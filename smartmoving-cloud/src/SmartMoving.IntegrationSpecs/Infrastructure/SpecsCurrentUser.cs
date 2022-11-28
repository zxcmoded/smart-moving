using System;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class SpecsCurrentUser : ICurrentUser
    {
        public SpecsCurrentUser(bool grantAllPerms = false)
        {
            GrantAllPerms = grantAllPerms;
        }

        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public Guid CompanyId { get; set; }

        private bool GrantAllPerms { get; }

        public bool HasPermission(Permission permission, bool ignoreSuperUserFlag = false) => GrantAllPerms;
    }
}