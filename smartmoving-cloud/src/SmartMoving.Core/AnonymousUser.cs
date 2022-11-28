using System;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Core
{
    public class AnonymousUser : ICurrentUser
    {
        public Guid Id => Guid.Empty;

        public string DisplayName => "Anonymous";

        public string Email => "anonymous@smartmoving.com";

        public Guid CompanyId => Guid.Empty;

        public bool HasPermission(Permission permission, bool ignoreSuperUserFlag = false) => false;
    }
}
