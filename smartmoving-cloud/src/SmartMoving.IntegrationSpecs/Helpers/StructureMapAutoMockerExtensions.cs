using SpecsFor.Core;
using StructureMap.AutoMocking;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public static class StructureMapAutoMockerExtensions
    {
        public static AutoMockedContainer GetMockContainer(this ISpecs specs)
        {
            dynamic specsDynamic = specs;

            return specsDynamic.Mocker.MoqAutoMocker.Container;
        }
    }
}