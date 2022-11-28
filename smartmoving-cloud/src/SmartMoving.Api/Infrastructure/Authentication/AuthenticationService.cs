using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartMoving.Api.Features.Authentication;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Infrastructure.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenProviderOptions _tokenProviderOptions;
        private readonly AppDbContext _context;

        public AuthenticationService(UserManager<AppUser> userManager, IOptions<TokenProviderOptions> tokenProviderOptions, AppDbContext context)
        {
            _userManager = userManager;
            _tokenProviderOptions = tokenProviderOptions.Value;
            _context = context;
        }

        public async Task<LoginResult> Login(LoginForm form, AppUser user, Company company, bool useImpersonation = false)
        {
            var companyId = user.CompanyId;

            var roles = await _userManager.GetRolesAsync(user);
            var permissions = "||";

            if (roles.Any())
            {
                var roleName = roles.First();
                var role = await _context.Roles
                                         .WithReadUncommitted(_context)
                                         .SingleAsync(x => x.NormalizedName == AppRole.NormalizeName(roleName) &&
                                                           // The role may not exist on target impersonation company,
                                                           // so always grab it from the user's actual company.
                                                           x.CompanyId == user.CompanyId);
                permissions = role.Permissions;
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.DisplayName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(nameof(AppUser.CompanyId), companyId.ToString()),
                new Claim(ClaimTypes.Role, permissions),
            };

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_tokenProviderOptions.SecretKey));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var tokenExpirationDate = DateTimeOffset.UtcNow.ToEndOfDayCentralTime();

            var token = new JwtSecurityToken(
                issuer: _tokenProviderOptions.Issuer,
                audience: _tokenProviderOptions.Audience,
                claims: claims,
                expires: tokenExpirationDate.UtcDateTime,
                signingCredentials: credentials);

            user.LastLoggedInAt = DateTimeOffset.UtcNow;

            if (!string.IsNullOrWhiteSpace(form.AppVersion))
            {
                user.LastLoggedInAppVersion = form.AppVersion;
            }

            await _userManager.UpdateAsync(user);

            var loginResult = new LoginResult
            {
                Id = user.Id,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                DisplayName = user.DisplayName,
                UserTitle = user.Title,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CompanyName = company.Name,
                CompanyId = companyId,
                PlatformId = company.RandomId,
                Permissions = permissions,
                CompanyCreatedAtUtc = company.CreatedAtUtc,
                UserCreatedAtUtc = user.CreatedAtUtc != DateTimeOffset.MinValue ? user.CreatedAtUtc : (DateTimeOffset?)null,
                RoleName = roles.FirstOrDefault(),
            };

            return loginResult;
        }
    }
}