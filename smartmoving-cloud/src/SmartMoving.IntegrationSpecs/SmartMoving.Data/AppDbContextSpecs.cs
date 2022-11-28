using System.Linq;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using SmartMoving.Core.Data;
using SmartMoving.Core.Data.Core;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;
using StructureMap.TypeRules;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Data
{
    public class AppDbContextSpecs
    {
        public class ContextConventions : SpecsFor<object>
        {
            [Test]
            public void AllEntitiesThatBelongToACompanyShouldBeAddedAsDbSetProperties()
            {
                // Why?  Because filtering doesn't work properly without it. 
                var entityTypes = typeof(EntityBase).Assembly.GetTypes()
                                                    .Where(x => x.CanBeCastTo<IBelongToCompany>() && x != typeof(IBelongToCompany) && !x.IsAbstract)
                                                    .ToArray();

                var dbSetProps = typeof(AppDbContext).GetProperties()
                                                     .Where(x => x.PropertyType.IsGenericType && x.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>))
                                                     .ToArray();

                var entitiesWithoutDbSetProp = entityTypes
                                               .Where(x => dbSetProps.All(p => p.PropertyType != typeof(DbSet<>).MakeGenericType(x)))
                                               .ToArray();

                if (entitiesWithoutDbSetProp.Any())
                {
                    var error = "The following types should be added as DbSet properties on AppDbContext: " +
                                string.Join(", ", entitiesWithoutDbSetProp.Select(x => x.FullName));

                    Assert.Fail(error);
                }
            }
        }
    }
}