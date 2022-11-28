import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { OverlayParams, SlideoutService } from 'app/shared/slideouts/slideout.service';
import { SlideoutRef } from 'app/shared/slideouts/slideout-ref';
import {
  AddEditContactSlideoutComponent,
  AddEditContactSlideoutOptions,
} from '../add-edit-contact-slideout/add-edit-contact-slideout.component';
import { ConfirmationService } from 'app/shared/confirmation-modal/confirmation.service';
import { ApiClientService } from 'app/core/api-client.service';
import { spliceOutOfArray } from 'app/core/splice-out-of-array.function';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { first } from 'rxjs/operators';
import { ContactViewModel } from 'app/generated/Opportunities/Common/contact-view-model';

export interface ViewContactsSlideoutOptions {
  opportunityId: string;
  executeSave: boolean;
}

@Component({
  selector: 'sm-view-contacts-slideout',
  templateUrl: './view-contacts-slideout.component.html'
})
export class ViewContactsSlideoutComponent implements OnInit, OnDestroy {
  contacts: ContactViewModel[];
  isLoading = true;

  constructor(@Inject(OverlayParams) public readonly params: ViewContactsSlideoutOptions,
              private readonly slideoutRef: SlideoutRef<any>,
              private readonly slideoutService: SlideoutService,
              private readonly confirmationService: ConfirmationService,
              private readonly apiClient: ApiClientService) {
  }

  async ngOnInit() {
    [this.contacts] = await this.apiClient.getAll<[ContactViewModel[]]>([`opportunities/${this.params.opportunityId}/contacts`],
        x => this.isLoading = x);
  }

  close() {
    this.slideoutRef.close(this.contacts);
  }

  async addEditContact(contact: ContactViewModel) {
    const addEditContactParams: AddEditContactSlideoutOptions = {
      opportunityId: this.params.opportunityId,
      contact
    };

    const slideout = this.slideoutService.changeTo(`${!contact ? 'Add' : 'Edit'} Contact`, AddEditContactSlideoutComponent, addEditContactParams);

    slideout.component.returnToListView
        .pipe(
            untilComponentDestroyed(this),
            first()
        )
        .subscribe(() => {
          const opts: ViewContactsSlideoutOptions = {
            opportunityId: this.params.opportunityId,
            executeSave: true,
          };

          this.slideoutService.changeTo(`Additional Contacts`, ViewContactsSlideoutComponent, opts);
        });
  }

  async deleteContact(contact: ContactViewModel) {
    const result = await this.confirmationService.showConfirmation({
      title: 'Delete contact?',
      message: 'Are you sure you wish to delete this contact?',
      action: async () => {
        await this.apiClient.deleteAll([{ url: `contacts/${contact.id}` }]);
        spliceOutOfArray(this.contacts, contact);
      }
    });
  }

  ngOnDestroy() {
  }
}
