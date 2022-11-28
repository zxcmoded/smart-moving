import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { CustomerSummaryViewModel } from '../../generated/Customers/GetCustomers/customer-summary-view-model';
import { ApiClientService } from '../../core/api-client.service';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomersListFilterHelper, Filter } from './customers-list-filter.helper';
import { untilComponentDestroyed } from '../../core/take-until-destroyed';
import { PageViewModel } from 'app/generated/Paging/page-view-model';
import { CustomerSearchCriteriaForm } from 'app/generated/Customers/GetCustomers/customer-search-criteria-form';
import { PageRequestModelEx } from 'app/shared/pager/pager.component';
import { filtersToQueryString } from 'app/core/filters-to-query-string';

export interface CustomerFilter {
  status?: string;
  salesPersonId?: string;
  nameQuery?: string;
}

@Component({
  selector: 'sm-customers-list',
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit, OnDestroy {
  customers: CustomerSummaryViewModel[] = [];
  page: PageViewModel<CustomerSummaryViewModel>;
  customerFilterForm: UntypedFormGroup;
  quickFilters: Filter[] = [];
  activeQuickFilter = -1;
  isLoading = true;
  hasLoaded = false;

  private _lastFilters = '';
  pagerEvent$: Subject<PageRequestModelEx> = new Subject();
  lastPage = 0;
  sortedEvent$: Subject<string> = new Subject();
  currentSort = '';
  private _lastSort = '';

  constructor(
      private formBuilder: UntypedFormBuilder,
      private apiClient: ApiClientService
  ) {
  }

  ngOnInit() {
    this.quickFilters = new CustomersListFilterHelper().getJobFilters();

    this.customerFilterForm = this.formBuilder.group({
      SalesPerson: [''],
      OpportunityStatus: [''],
      Name: ['', Validators.minLength(3)]
    });

    combineLatest([this.customerFilterForm.valueChanges, this.pagerEvent$, this.sortedEvent$])
        .pipe(
            untilComponentDestroyed(this),
            debounceTime(500),
            map(([filters, page, sort]: [CustomerSearchCriteriaForm[], PageRequestModelEx, string]) => {
              page.sort = sort;
              const parameterFilters = CustomersListFilterHelper.toParameters(filters);
              return [this.quickFilters[this.activeQuickFilter].filters.concat(parameterFilters), page];
            }),
            filter(([filters, page]: [CustomerSearchCriteriaForm[], PageRequestModelEx]) =>
                JSON.stringify(filters) !== this._lastFilters || page.page !== this.lastPage || page.sort !== this._lastSort),
            switchMap(async ([filters, page]) => await this.getCustomers(filters, page))
        )
        .subscribe(page => {
          this.customers = page.pageResults;
          this.page = page;
          this.lastPage = page.pageNumber;
        });

    this.setActiveFilter(0);
    this.sortedEvent$.next('');
  }

  ngOnDestroy() {
  }

  private async getCustomers(filters: CustomerSearchCriteriaForm[], page: PageRequestModelEx) {
    this._lastFilters = JSON.stringify(filters);
    const [results] = await this.apiClient.getAll<[PageViewModel<CustomerSummaryViewModel>]>(
        [`customers/search-list?${filtersToQueryString(filters)}&${page.queryString()}`],
        x => this.isLoading = x);
    this.hasLoaded = true;
    return results;
  }

  setActiveFilter(index: number) {
    this.activeQuickFilter = index;
    this.disableAllControls();
    this.customerFilterForm.reset({
      SalesPerson: '',
      OpportunityStatus: ''
    });

    if (!this.quickFilters[index] ||
        !this.quickFilters[index].parameters ||
        !this.quickFilters[index].parameters.forEach) {
      // We've had a few customers hit this.
      return;
    }

    this.quickFilters[index].parameters.forEach(parameter => {
      this.customerFilterForm.get(parameter.name).enable();
    });
  }

  private disableAllControls() {
    this.customerFilterForm.get('SalesPerson').disable();
    this.customerFilterForm.get('OpportunityStatus').disable();
  }
}
