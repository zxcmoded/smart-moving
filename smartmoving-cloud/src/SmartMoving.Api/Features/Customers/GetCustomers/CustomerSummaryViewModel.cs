using System;
using System.Linq;
using AutoMapper;
using SmartMoving.Api.Infrastructure.Startup;
using Newtonsoft.Json;
using SmartMoving.Core.Data.Core;

namespace SmartMoving.Api.Features.Customers.GetCustomers
{
    public class CustomerSummaryViewModel : IMapFrom<Customer>
    {
        public Guid Id { get; set; }

        public DateTimeOffset CreatedAtUtc { get; set; }

        public string Name { get; set; }

        public string EmailAddress { get; set; }

        public bool HasAccount { get; set; }
        public string EmployeeNumber { get; set; }
    }
}