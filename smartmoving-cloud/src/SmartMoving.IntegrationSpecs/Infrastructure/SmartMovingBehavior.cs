using System;
using System.Linq;
using System.Reflection;
using SpecsFor.Core;
using SpecsFor.Core.Configuration;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public abstract class SmartMovingBehavior<T> : Behavior<T> where T : class
    {
        protected void CallMethod(ISpecs instance, string method)
        {
            var sutType = GetSUTType(instance);

            var initializeMethod = GetType().GetMethod(method, BindingFlags.NonPublic | BindingFlags.Instance).MakeGenericMethod(sutType);
            initializeMethod.Invoke(this, new object[] { instance });
        }

        protected Type GetSUTType(ISpecs instance)
        {
            var instanceType = instance.GetType();
            var sutType = instanceType.GetInterfaces().First(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(ISpecs<>)).GetDeclaredGenericArguments().First();

            return sutType;
        }
    }
}
