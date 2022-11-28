using System;
using System.Collections.Generic;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    // Taken from Magnum https://github.com/phatboyg/Magnum/blob/master/src/Magnum/Reflection/ExtensionsForGenericArguments.cs
    public static class GenericExtensions
    {
        public static IEnumerable<Type> GetDeclaredGenericArguments(this object obj)
        {
            if (obj == null)
                yield break;

            foreach (var type in obj.GetType().GetDeclaredGenericArguments())
            {
                yield return type;
            }
        }

        public static IEnumerable<Type> GetDeclaredGenericArguments(this Type type)
        {
            var atLeastOne = false;
            var baseType = type;
            while (baseType != null)
            {
                if (baseType.IsGenericType)
                {
                    foreach (var declaredType in baseType.GetGenericArguments())
                    {
                        yield return declaredType;

                        atLeastOne = true;
                    }
                }

                baseType = baseType.BaseType;
            }

            if (atLeastOne)
                yield break;

            foreach (var interfaceType in type.GetInterfaces())
            {
                if (!interfaceType.IsGenericType)
                    continue;

                foreach (var declaredType in interfaceType.GetGenericArguments())
                {
                    if (declaredType.IsGenericParameter)
                        continue;

                    yield return declaredType;
                }
            }
        }
    }
}
