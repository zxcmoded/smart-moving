using System;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;
using SmartMoving.Data.Contexts;

namespace SmartMoving.IntegrationSpecs.Builders
{
    internal static class BranchBuilderExtensions
    {
        internal static BranchBuilder BuildBranch(this AppDbContext context, Action<Branch> overrides = null) => new BranchBuilder(context, overrides);
    }

    public class BranchBuilder : BaseBuilder<Branch>
    {
        public BranchBuilder(AppDbContext context, Action<Branch> overrides) : base(context, overrides)
        {
        }

        protected override Branch BuildEntity()
        {
            return new Branch
            {
                Name = "Branch " + Rand.RandomString(5),
                CustomerPortalUrl = "https://portal.smartmoving.com",
                DispatchLocation = new BranchAddress
                {
                    FullAddress = "Dummy",
                    Lat = 123,
                    Lng = 456
                },
                MailingAddress = new Address(),
            };
        }
    }
}