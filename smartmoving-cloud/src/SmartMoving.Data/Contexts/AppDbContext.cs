using Microsoft.EntityFrameworkCore;
using SmartMoving.Core;
using System;
using System.Linq.Expressions;

namespace SmartMoving.Data.Contexts
{
    /// <summary>
    /// Our main context, that gets our read/write connection string.
    /// </summary>
    public class AppDbContext : BaseDbContext<AppDbContext>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUser currentUser) : base(options, currentUser)
        {

        }

        public void AttachAndMarkPropertyAsModified<TEntity, TProperty>(TEntity entity, Expression<Func<TEntity, TProperty>> propertyExpression) where TEntity : class
        {
            var entityEntry = Set<TEntity>().Attach(entity);

            entityEntry.Property(propertyExpression).IsModified = true;
        }
    }
}
