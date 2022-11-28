using System;
using System.Linq;
using AutoMapper;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Api.Features.Common;
using SmartMoving.Api.Features.Customers.GetCustomers;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.Customers.Common
{
    public class CustomerDetailsViewModel : IMapFrom<Customer>
    {
        public Guid Id { get; set; }
        public string EmployeeNumber { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public PhoneType? PhoneType { get; set; }

        public string EmailAddress { get; set; }

        public string Address { get; set; }

        public bool HasAccount { get; set; }

        public SecondaryPhoneNumber[] SecondaryPhoneNumbers { get; set; }
    }
}