using System;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;
using SmartMoving.Data.Contexts;

namespace SmartMoving.IntegrationSpecs.Builders
{
    internal static class CompanyBuilderExtensions
    {
        internal static CompanyBuilder BuildCompany(this AppDbContext context, Action<Company> overrides = null) => new CompanyBuilder(context, overrides);
    }

    public class CompanyBuilder : BaseBuilder<Company>
    {
        public CompanyBuilder(AppDbContext context, Action<Company> overrides) : base(context, overrides)
        {
        }

        protected override Company BuildEntity()
        {
            return new Company
            {
                Address = new Address
                {
                    Street = "1 Wayne Drive",
                    City = "Gotham",
                    State = "New York",
                    ZipCode = "12345"
                },
                Name = "Company " + Rand.RandomDigitString(5),
                SmsNumber = "+5555555555"
            };
        }
    }
}