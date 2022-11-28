using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SmartMoving.Core.Data.Core
{
    public interface IBelongToCompany
    {
        Guid CompanyId { get; set; }
    }

    public static class CompanyMappingExtensions
    {
        public static void EntityBelongsToCompany<T>(this EntityTypeBuilder<T> builder, Expression<Func<T, Company>> navigationExpression = null) 
            where T : class, IBelongToCompany
        {
            builder.HasOne(navigationExpression)
                .WithMany()
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        public static void EntityBelongsToCompany<T>(this EntityTypeBuilder<T> builder, Expression<Func<T, Company>> navigationExpression, Expression<Func<Company, IEnumerable<T>>> collectionExpression) 
            where T : class, IBelongToCompany
        {
            builder.HasOne(navigationExpression)
                .WithMany(collectionExpression)
                .HasForeignKey(x => x.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
