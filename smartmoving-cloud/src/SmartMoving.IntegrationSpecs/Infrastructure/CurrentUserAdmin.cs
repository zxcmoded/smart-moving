using System.Linq;
using JetBrains.Annotations;
using SmartMoving.Core;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface ICurrentUserAdmin : INeedDatabase
    {
    }

    public class CurrentUserAdmin : SmartMovingBehavior<ICurrentUserAdmin>
    {
        [UsedImplicitly]
        private void SetCurrentUser<TSut>(ICurrentUserAdmin instance) where TSut : class
        {
            var autoMocker = (StructureMapAutoMocker<TSut>)instance.Mocker;

            var company = instance.Context.Companies.Single(x => x.Name == "Speedy Moving");
            var user = instance.Context.Users.Single(x => x.CompanyId == company.Id && x.Email == "really-good@interviewee.com");

            var currentUser = new SpecsCurrentUser
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                CompanyId = company.Id,
                Id = user.Id,
            };

            autoMocker.MoqAutoMocker.Container.Configure(x => { x.For<ICurrentUser>().Use(currentUser); });

            instance.Context.SetCurrentUser(currentUser);
        }

        public override void SpecInit(ICurrentUserAdmin instance)
        {
            CallMethod(instance, "SetCurrentUser");
        }

        public override void AfterSpec(ICurrentUserAdmin instance)
        {
            instance.Context.Dispose();
        }
    }
}