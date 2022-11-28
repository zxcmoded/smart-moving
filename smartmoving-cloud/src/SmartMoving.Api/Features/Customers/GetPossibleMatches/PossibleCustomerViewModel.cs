using System;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.Customers.GetPossibleMatches
{
    public class PossibleCustomerViewModel : IMapFrom<Customer>
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public PhoneType? PhoneType { get; set; }

        public string EmailAddress { get; set; }
    }
}
