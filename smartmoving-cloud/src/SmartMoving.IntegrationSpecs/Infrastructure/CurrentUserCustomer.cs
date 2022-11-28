using System.Linq;
using JetBrains.Annotations;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface ICurrentUserCustomer : INeedDatabase
    {
    }
    
    public class CurrentUserCustomer : SmartMovingBehavior<ICurrentUserCustomer>
    {
        [UsedImplicitly]
        private void SetCurrentUser<TSut>(ICurrentUserCustomer instance) where TSut : class
        {
            var autoMocker = (StructureMapAutoMocker<TSut>) instance.Mocker;

            var company = instance.Context.Companies.Single(x => x.Name == "Speedy Moving");
            var user = instance.Context.Users.Single(x => x.Id == AppUser.CustomerUserId);

            var currentUser = new SpecsCurrentUser
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                CompanyId = company.Id,
                Id = user.Id,
            };
            
            autoMocker.MoqAutoMocker.Container.Configure(x =>
            {
                x.For<ICurrentUser>().Use(currentUser);
            });

            instance.Context.SetCurrentUser(currentUser);
        }

        public override void SpecInit(ICurrentUserCustomer instance)
        {
            CallMethod(instance, "SetCurrentUser");
        }

        public override void AfterSpec(ICurrentUserCustomer instance)
        {
            instance.Context.Dispose();
        }
    }
}
