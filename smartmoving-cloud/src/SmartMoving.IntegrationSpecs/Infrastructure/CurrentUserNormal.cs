using System;
using System.Linq;
using JetBrains.Annotations;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface ICurrentUserNormal : INeedDatabase
    {
    }
    
    public class CurrentUserNormal : SmartMovingBehavior<ICurrentUserNormal>
    {
        [UsedImplicitly]
        private void SetCurrentUser<TSut>(ICurrentUserNormal instance) where TSut : class
        {
            var autoMocker = (StructureMapAutoMocker<TSut>) instance.Mocker;

            var company = instance.Context.Companies.Single(x => x.Name == "Speedy Moving");
            var user = instance.Context.Users.SingleOrDefault(x => x.CompanyId == company.Id && x.Email == "normal@speedy-moving.com");

            if (user is null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid(),
                    UserName = "normal@speedy-moving.com",
                    Email = "normal@speedy-moving.com",
                    EmailConfirmed = true,
                    DisplayName = "Normal User",
                    CompanyId = company.Id
                };

                instance.Context.Users.Add(user);

                instance.Context.SaveChanges();
            }

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

        public override void SpecInit(ICurrentUserNormal instance)
        {
            CallMethod(instance, "SetCurrentUser");
        }

        public override void AfterSpec(ICurrentUserNormal instance)
        {
            instance.Context.Dispose();
        }
    }
}
