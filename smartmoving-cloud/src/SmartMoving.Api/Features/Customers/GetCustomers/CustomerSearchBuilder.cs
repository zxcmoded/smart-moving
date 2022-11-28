using System;
using System.Linq;
using SmartMoving.Api.Features.Common;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Api.Features.Customers.GetCustomers
{
    public class CustomerSearchBuilder
    {
        public IQueryable<Customer> Process(CustomerSearchCriteriaForm criteria, IQueryable<Customer> customers)
        {
            return criteria.Parameter switch
            {
                CustomerSearchCriteriaType.Name => ProcessNameQueryCriteria(criteria, customers),
                CustomerSearchCriteriaType.HasAccount => ProcessHasAccountQueryCriteria(criteria, customers),
                _ => throw new NotImplementedException($"The following criteria could not be evaluated: {criteria.ToJson()}"),
            };
        }

        private IQueryable<Customer> ProcessNameQueryCriteria(CustomerSearchCriteriaForm criteria, IQueryable<Customer> customers)
        {
            var name = criteria.Value?.Trim();

            switch (criteria.ComparisonType)
            {
                case ComparisonType.Search:
                {
                    return customers.Where(x => x.Name.Contains(name));
                }
                case ComparisonType.Equal:
                {
                    return customers.Where(x => x.Name == name);
                }
                case ComparisonType.NotEqual:
                {
                    return customers.Where(x => x.Name != name);
                }
                default:
                    throw new NotImplementedException($"The following criteria could not be evaluated: {criteria.ToJson()}");
            }
        }


        private IQueryable<Customer> ProcessHasAccountQueryCriteria(CustomerSearchCriteriaForm criteria, IQueryable<Customer> customers)
        {
            switch (criteria.ComparisonType)
            {
                case ComparisonType.Equal:
                    if (bool.Parse(criteria.Value))
                    {
                        return customers.Where(x => x.HasAccount);
                    }
                    else
                    {
                        return customers.Where(x => !x.HasAccount);
                    }
                default:
                    throw new NotImplementedException($"The following criteria could not be evaluated: {criteria.ToJson()}");
            }
        }
    }
}