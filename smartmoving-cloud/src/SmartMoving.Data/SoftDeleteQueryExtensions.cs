using System;
using System.Collections.Generic;
using System.Linq;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Data
{
    public static class SoftDeleteQueryExtensions
    {
        public static IQueryable<T> WhereNotDeleted<T>(this IQueryable<T> queryable, Guid? includeId = null) where T : ISoftDeletableEntity
        {
            return queryable.Where(x => !x.IsDeleted || x.Id == includeId);
        }
        
        public static IEnumerable<T> WhereNotDeleted<T>(this IEnumerable<T> enumerable, Guid? includeId = null) where T : ISoftDeletableEntity
        {
            return enumerable.Where(x => !x.IsDeleted || x.Id == includeId);
        }
    }
}
