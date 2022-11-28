using System;

namespace SmartMoving.Core.Data
{
    public abstract class EntityBase
    {
        public Guid Id { get; set; } = CombGuid.Generate();

        public DateTimeOffset CreatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    }
}
