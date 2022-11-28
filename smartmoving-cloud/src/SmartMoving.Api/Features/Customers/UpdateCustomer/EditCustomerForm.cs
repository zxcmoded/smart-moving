using System;
using System.ComponentModel.DataAnnotations;
using SmartMoving.Api.Infrastructure.Startup;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.Customers.UpdateCustomer
{
    public class EditCustomerForm : IMapTo<Customer>
    {
        [Required]
        [StringLength(20)]
        public string EmployeeNumber { get; set; }
        [Required]
        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public PhoneType? PhoneType { get; set; }

        [EmailAddress]
        public string EmailAddress { get; set; }

        public string Address { get; set; }

        public SecondaryPhoneNumber[] SecondaryPhoneNumbers { get; set; } = Array.Empty<SecondaryPhoneNumber>();
    }
}