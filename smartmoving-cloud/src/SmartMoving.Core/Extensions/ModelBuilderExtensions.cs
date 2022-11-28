using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace SmartMoving.Core.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void ApplyAllConfigurationsFromAssemblyContainingType<TType>(this ModelBuilder modelBuilder)
        {
            var applyGenericMethod = typeof(ModelBuilder).GetMethods(BindingFlags.Instance | BindingFlags.Public)
                .Single(x => x.Name == "ApplyConfiguration" && x.GetParameters()[0].ParameterType.GetGenericTypeDefinition() == typeof(IEntityTypeConfiguration<>));

            var applicableTypes = typeof(TType)
                .Assembly
                .GetTypes()
                .Where(c => c.IsClass && !c.IsAbstract && !c.ContainsGenericParameters);

            foreach (var type in applicableTypes)
            {
                foreach (var iface in type.GetInterfaces())
                {
                    // if type implements interface IEntityTypeConfiguration<SomeEntity>
                    if (iface.IsConstructedGenericType && iface.GetGenericTypeDefinition() == typeof(IEntityTypeConfiguration<>))
                    {
                        // make concrete ApplyConfiguration<SomeEntity> method
                        var applyConcreteMethod = applyGenericMethod.MakeGenericMethod(iface.GenericTypeArguments[0]);
                        // and invoke that with fresh instance of your configuration type
                        applyConcreteMethod.Invoke(modelBuilder, new object[] { Activator.CreateInstance(type) });
                        break;
                    }
                }
            }
        }
    }
}
