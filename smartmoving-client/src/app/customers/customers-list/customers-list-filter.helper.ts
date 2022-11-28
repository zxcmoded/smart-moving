import { CustomerSearchCriteriaType } from 'app/generated/Customers/GetCustomers/customer-search-criteria-type';

export interface TopFilter {
  name: string;
  allowedValues: string[];
}

export interface Filter {
  name: string;
  filters: any[];
  selected?: boolean;
  parameters?: TopFilter[];
}

export class CustomersListFilterHelper {
  static toParameters(filters) {
    return Object.keys(filters).reduce((acc, parameter) => {
      if (filters[parameter]) {
        acc.push({
          parameter,
          comparisonType: parameter === 'Name' ? '*' : '=',
          value: filters[parameter]
        });
      }
      return acc;
    }, []);
  }

  getJobFilters(): Filter[] {
    return [
      {
        name: 'Has Account',
        filters: [{
          parameter: CustomerSearchCriteriaType.HasAccount,
          comparisonType: '=',
          value: 'true'
        }],
        parameters: [],
      },
      {
        name: 'All Customers',
        filters: [],
        parameters: [],
      }
    ];
  }
}
