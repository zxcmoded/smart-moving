using System;
using SmartMoving.Core.Data.Security;

namespace SmartMoving.Core
{
    public interface ICurrentUser
    {
        Guid Id { get; }

        string DisplayName { get; }

        string Email { get; }

        Guid CompanyId { get; }
    }
}