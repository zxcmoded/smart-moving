using Microsoft.AspNetCore.Authorization;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Api.Infrastructure.Authorization
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement(Permission permission)
        {
            Permission = permission;
        }

        public Permission Permission { get; }
    }
}