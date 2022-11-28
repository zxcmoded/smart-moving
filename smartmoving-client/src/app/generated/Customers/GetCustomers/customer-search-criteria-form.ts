import { ComparisonType } from '../../Common/comparison-type';
import { CustomerSearchCriteriaType } from './customer-search-criteria-type';
export class CustomerSearchCriteriaForm {
  parameter: CustomerSearchCriteriaType;
  comparisonType: ComparisonType;
  value: string;
}
