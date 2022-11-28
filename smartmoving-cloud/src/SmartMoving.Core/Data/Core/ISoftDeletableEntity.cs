using System;

namespace SmartMoving.Core.Data.Core
{
    public interface ISoftDeletableEntity
    {
        Guid Id { get; set; }

        bool IsDeleted { get; set; }

        DateTimeOffset? DeletedAtUtc { get; set; }
    }
}
