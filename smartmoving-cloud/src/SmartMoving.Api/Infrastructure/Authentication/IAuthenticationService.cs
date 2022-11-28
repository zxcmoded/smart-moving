using System.Threading.Tasks;
using SmartMoving.Api.Features.Authentication;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Api.Infrastructure.Authentication
{
    public interface IAuthenticationService
    {
        Task<LoginResult> Login(LoginForm form, AppUser user, Core.Data.Core.Company company, bool useImpersonation = false);
    }
}