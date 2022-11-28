using SmartMoving.Core;
using SpecsFor.Core;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Helpers
{
    public static class CurrentUserHelpers
    {
        public static ICurrentUser GetCurrentUser<T>(this ISpecs<T> specs) where T : class
        {
            var autoMocker = (StructureMapAutoMocker<T>)specs.Mocker;

            return autoMocker.MoqAutoMocker.Container.GetInstance<ICurrentUser>();
        }
    }
}
