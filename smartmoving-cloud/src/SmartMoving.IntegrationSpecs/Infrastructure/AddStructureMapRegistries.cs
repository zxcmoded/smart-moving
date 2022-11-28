using JetBrains.Annotations;
using Microsoft.AspNetCore.Identity;
using SmartMoving.Core.Data.Security;
using SpecsFor.Core;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public class AddStructureMapRegistries : SmartMovingBehavior<ISpecs>
    {
        [UsedImplicitly]
        private void AddRegistries<TSut>(ISpecs instance) where TSut : class
        {
            var autoMocker = (StructureMapAutoMocker<TSut>)instance.Mocker;

            autoMocker.MoqAutoMocker.Container.Configure(x => { x.For<UserManager<AppUser>>().Use(ctx => (UserManager<AppUser>)null); });
        }

        public override void SpecInit(ISpecs instance)
        {
            CallMethod(instance, "AddRegistries");
        }
    }
}