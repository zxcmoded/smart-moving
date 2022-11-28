import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, from as fromPromise } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SlideoutService } from 'app/shared/slideouts/slideout.service';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { TitleService } from 'app/shared/title.service';
import { ApiClientService } from 'app/core/api-client.service';
import { CustomerDetailsViewModel } from 'app/generated/Customers/Common/customer-details-view-model';
import { Contact } from 'app/shared/contact-summary/contact-summary.component';

@Component({
  selector: 'sm-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  isLoading = true;
  hasLoaded = false;

  customer: CustomerDetailsViewModel;
  widgets = [];

  constructor(
      private readonly activatedRoute: ActivatedRoute,
      private readonly slideout: SlideoutService,
      private readonly titleService: TitleService,
      private readonly api: ApiClientService,) {
  }

  ngOnInit() {
    this.activatedRoute.params
        .pipe(
            untilComponentDestroyed(this),
            switchMap(params => forkJoin([
              fromPromise(this.getCustomerDetail(params.id)),
            ]))
        )
        .subscribe(([customer]) => {
          this.titleService.prependTitle(customer.name);
          this.customer = customer;
          this.isLoading = false;
          this.hasLoaded = true;
        });
  }

  ngOnDestroy() {
  }

  primaryContactUpdated(contact: Contact) {
    this.customer = Object.assign({}, this.customer, contact);
  }

  private async getCustomerDetail(id: string) {

    const [customerDetails] = await this.api.getAll<[CustomerDetailsViewModel]>([
      `customers/${id}`,
    ]);

    return customerDetails;
  }
}
