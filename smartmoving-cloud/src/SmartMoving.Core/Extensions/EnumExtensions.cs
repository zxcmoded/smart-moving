using System;
using System.Collections.Generic;
using System.Linq;
using Humanizer;

namespace SmartMoving.Core.Extensions
{
    public static class EnumExtensions
    {
        public static TAttribute GetAttribute<TAttribute>(this Enum value) where TAttribute : Attribute
        {
            var type = value.GetType();
            var name = Enum.GetName(type, value);
            
            return type.GetField(name)
                        .GetCustomAttributes(false)
                        .OfType<TAttribute>()
                        .SingleOrDefault();
        }

        public static string Titleize(this Enum value)
        {
            return value.ToString().Titleize();
        }

        public static IEnumerable<object> GetInDeclaredOrder(this Type type)
        {
            if (!type.IsEnum)
            {
                throw new ArgumentException("Type must be an enum");
            }
            
            return type.GetFields()
                .Where(x => x.IsStatic)
                .Select(x => Enum.Parse(type, x.Name));
        }
    }
}
