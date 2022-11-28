using System;
using System.Collections.Generic;

namespace SmartMoving.Core.Extensions
{
    public static class EnumHelper
    {
        public static TEnum Parse<TEnum>(string toParse) where TEnum : Enum
        {
            TEnum parsed = (TEnum)Enum.Parse(typeof(TEnum), toParse);
            return parsed;
        }

        public static string[] GetNames<TEnum>() where TEnum : Enum
        {
            return Enum.GetNames(typeof(TEnum));
        }

        public static IEnumerable<TEnum> GetAll<TEnum>() where TEnum : Enum
        {
            var vals = Enum.GetValues(typeof(TEnum));
            foreach(var val in vals)
            {
                yield return (TEnum)val;
            }
        }
    }
}