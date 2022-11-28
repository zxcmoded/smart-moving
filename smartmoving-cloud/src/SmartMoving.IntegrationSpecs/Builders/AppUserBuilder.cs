using System;
using System.Threading.Tasks;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;
using SmartMoving.Core.Helpers;
using SmartMoving.Data.Contexts;

namespace SmartMoving.IntegrationSpecs.Builders
{
    internal static class AppUserBuilderExtension
    {
        internal static AppUserBuilder BuildAppUser(this AppDbContext context, Action<AppUser> overrides = null) => new AppUserBuilder(context, overrides);
    }

    internal class AppUserBuilder : BaseBuilder<AppUser>
    {
        public AppUserBuilder(AppDbContext context, Action<AppUser> overrides) : base(context, overrides)
        { }

        protected override AppUser BuildEntity()
        {
            var email = $"user-{Rand.RandomString(5)}@dummy.com";
            return new AppUser
            {
                Id = Guid.NewGuid(),
                DisplayName = $"User {Rand.RandomString(5)}",
                Email = email,
                UserName = email,
            };
        }

        protected override async Task InitializeMissingMembers()
        {
            if (Entity.BranchId == null &&
                 Entity.Branch == null)
            {
                Entity.Branch = await Context.Branches.TakeSingleRandomAsync();
                Entity.BranchId = Entity.Branch.Id;
            }
        }
        
        public AppUserBuilder Deactivated(DateTimeOffset? deactivatedAt = null)
        {
            Entity.Deactivated = true;
            Entity.DeactivatedAtUtc = deactivatedAt ?? DateTimeOffset.UtcNow;

            return this;
        }

        public AppUserBuilder Terminated(int? terminationDate = null)
        {
            Entity.TerminationDate = terminationDate ?? DateKey.Today;

            return this;
        }
    }
}
