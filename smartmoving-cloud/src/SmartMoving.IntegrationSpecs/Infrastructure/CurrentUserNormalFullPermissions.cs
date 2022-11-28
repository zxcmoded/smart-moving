using System;
using System.Linq;
using JetBrains.Annotations;
using SmartMoving.Core;
using SmartMoving.Core.Data.Security;
using SmartMoving.Data.Contexts;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.Infrastructure
{
    public interface ICurrentUserNormalFullPermissions : INeedDatabase
    {
    }

    public class CurrentUserNormalFullPermissions : SmartMovingBehavior<ICurrentUserNormalFullPermissions>
    {
        [UsedImplicitly]
        private void SetCurrentUser<TSut>(ICurrentUserNormalFullPermissions instance) where TSut : class
        {
            var autoMocker = (StructureMapAutoMocker<TSut>)instance.Mocker;

            var company = instance.Context.Companies.Single(x => x.Name == "Speedy Moving");
            var user = instance.Context.Users.SingleOrDefault(x => x.CompanyId == company.Id && x.Email == "normal@speedy-moving.com");

            if (user is null)
            {
                user = new AppUser
                {
                    Id = Guid.NewGuid(),
                    UserName = "normal-full-perms@speedy-moving.com",
                    Email = "normal-full-perms@speedy-moving.com",
                    EmailConfirmed = true,
                    DisplayName = "FullPerms User",
                    CompanyId = company.Id
                };

                instance.Context.Users.Add(user);

                instance.Context.SaveChanges();
            }

            var currentUser = new SpecsCurrentUser(true)
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                CompanyId = company.Id,
                Id = user.Id,
            };

            autoMocker.MoqAutoMocker.Container.Configure(x => { x.For<ICurrentUser>().Use(currentUser); });

            instance.Context.SetCurrentUser(currentUser);
        }

        public override void SpecInit(ICurrentUserNormalFullPermissions instance)
        {
            CallMethod(instance, "SetCurrentUser");
        }

        public override void AfterSpec(ICurrentUserNormalFullPermissions instance)
        {
            instance.Context.Dispose();
        }
    }
}