using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using SmartMoving.Api.Features.Common;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Api.Infrastructure.Authentication;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Helpers;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Authentication
{
    [StandardRoute,
     EnableCors(CorsPolicy.SmClient),
     ApiController]
    public class AuthenticationController : SmartMovingController
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(UserManager<AppUser> userManager, AppDbContext context,
            IAuthenticationService authenticationService)
        {
            _userManager = userManager;
            _context = context;
            _authenticationService = authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResult>> Login(LoginForm form)
        {
            var user = await _userManager.FindByEmailAsync(form.EmailAddress);

            if (user == null || user.Deactivated)
            {
                return Unauthorized();
            }

            if (user.TerminationDate.HasValue && user.TerminationDate < DateKey.Today)
            {
                Logger.Info($"Terminated user attempted to log in: {user.Id}");
                return Unauthorized();
            }

            var passwordIsValid = await _userManager.CheckPasswordAsync(user, form.Password);

            if (!passwordIsValid)
            {
                return Unauthorized();
            }

            _context.RemoveCompanyFilter();

            var company = await _context.Companies.AsNoTracking()
                                        .Where(x => x.Id == user.CompanyId)
                                        .WithReadUncommitted(_context)
                                        .SingleAsync();

            if (!company.IsEnabled)
            {
                Logger.Info($"{form.EmailAddress} tried to log in for company {company.Name}/ {company.RandomId} but they are not enabled.");
                return Unauthorized();
            }

            var loginResult = await _authenticationService.Login(form, user, company);

            return Ok(loginResult);
        }

        [Authorize]
        [HttpGet("authenticated")]
        public ActionResult Authenticated()
        {
            return Ok();
        }
    }
}