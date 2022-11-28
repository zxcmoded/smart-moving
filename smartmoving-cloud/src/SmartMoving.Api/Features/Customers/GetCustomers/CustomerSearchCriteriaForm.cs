using SmartMoving.Api.Features.Common;

namespace SmartMoving.Api.Features.Customers.GetCustomers
{
    public class CustomerSearchCriteriaForm
    {
        public CustomerSearchCriteriaType Parameter { get; set; }

        public ComparisonType ComparisonType { get; set; }

        public string Value { get; set; }
    }
}