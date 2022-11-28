using SmartMoving.Api.Features.Customers.GetCustomers;
using StructureMap;

namespace SmartMoving.Api.Features.Customers
{
    public class CustomersRegistry : Registry
    {
        public CustomersRegistry()
        {
            ForConcreteType<CustomerSearchBuilder>();
        }
    }
}