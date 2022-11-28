using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Api.Infrastructure.Authorization
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (context.User is null)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var permissionsClaim = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);

            if (permissionsClaim is null || !AppRole.HasPermission(permissionsClaim.Value, requirement.Permission))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}