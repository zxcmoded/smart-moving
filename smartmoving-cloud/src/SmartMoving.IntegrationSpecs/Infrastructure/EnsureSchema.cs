using JetBrains.Annotations;
using SmartMoving.Api.Infrastructure.Startup;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class EnsureSchema : SmartMovingBehavior<INeedDatabase>
    {
        private static bool _initialized;

        [UsedImplicitly]
        private void SetupDatabase<TSut>(INeedDatabase instance) where TSut : class
        {
            if (_initialized)
            {
                return;
            }
            
            var autoMocker = (StructureMapAutoMocker<TSut>) instance.Mocker;

            StartupTasksExtensions.SetupDatabase(instance.Context, autoMocker.MoqAutoMocker.Container.GetNestedContainer());

            _initialized = true;
        }

        public override void SpecInit(INeedDatabase instance)
        {
            CallMethod(instance, "SetupDatabase");
        }
    }
}
