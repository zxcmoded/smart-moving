using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using RandomNameGeneratorLibrary;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;
using SmartMoving.Data.Contexts;

namespace SmartMoving.IntegrationSpecs.Builders
{
    internal static class CustomerBuilderExtension
    {
        internal static CustomerBuilder BuildCustomer(this AppDbContext context, Action<Customer> overrides = null) => new CustomerBuilder(context, overrides);
    }

    internal class CustomerBuilder : BaseBuilder<Customer>
    {
        private readonly PersonNameGenerator _nameGenerator = new PersonNameGenerator();

        public CustomerBuilder(AppDbContext context, Action<Customer> overrides) : base(context, overrides)
        {
        }

        protected override Customer BuildEntity()
        {
            var customerName = _nameGenerator.GenerateRandomFirstAndLastName();

            return new Customer
            {
                Name = customerName,
                HasAccount = false,
                EmailAddress = customerName.Kebaberize() + "@dummy.com",
                PhoneNumber = $"{Rand.Next(100, 999)}5555555",
                PhoneType = PhoneType.Mobile,
            };
        }

        public CustomerBuilder WithSecondaryPhoneNumber(string phoneNumber, PhoneType phoneType)
        {
            var phoneNumbers = new List<SecondaryPhoneNumber>(Entity.SecondaryPhoneNumbers)
            {
                new SecondaryPhoneNumber { PhoneNumber = phoneNumber, PhoneType = phoneType }
            };

            Entity.SecondaryPhoneNumbers = phoneNumbers.ToArray();
            Entity.UpdateSecondaryPhoneNumberIndex();
            return this;
        }

        protected override Task InitializeMissingMembers()
        {
            Entity.NormalizeEverything();
            return Task.CompletedTask;
        }
    }
}