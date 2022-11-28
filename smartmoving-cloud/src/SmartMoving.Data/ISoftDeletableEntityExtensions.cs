using SmartMoving.Core.Data.Core;
using System;

namespace SmartMoving.Data
{
    public static class ISoftDeletableEntityExtensions
    {
        public static void MarkDeleted(this ISoftDeletableEntity entity, DateTimeOffset? date = null)
        {
            entity.IsDeleted = true;
            entity.DeletedAtUtc = date ?? DateTimeOffset.UtcNow;
        }

        public static void UnmarkDeleted(this ISoftDeletableEntity entity)
        {
            entity.IsDeleted = false;
            entity.DeletedAtUtc = null;
        }
    }
}