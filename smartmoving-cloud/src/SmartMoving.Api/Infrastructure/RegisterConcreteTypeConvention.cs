using System.Linq;
using StructureMap;
using StructureMap.Graph;
using StructureMap.Graph.Scanning;

namespace SmartMoving.Api.Infrastructure
{
    public class RegisterConcreteTypeConvention : IRegistrationConvention
    {
        public void ScanTypes(TypeSet types, Registry registry)
        {
            var concreteTypes = types.FindTypes(TypeClassification.Concretes).ToList();

            foreach (var type in concreteTypes)
            {
                registry.AddType(type, type);
            }
        }
    }
}