import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { SlideoutService } from '../slideouts/slideout.service';
import {
  EditCustomerSlideoutOptions,
  EditCustomerSlideoutComponent,
  EditCustomerSlideoutResult
} from '../edit-customer-slideout/edit-customer-slideout.component';
import { SecondaryPhoneNumberModel } from 'app/generated/Common/secondary-phone-number-model';
import { PhoneType } from 'app/generated/SmartMoving/Core/Data/Core/phone-type';
import { AddEditContactSlideoutComponent, AddEditContactSlideoutOptions } from './add-edit-contact-slideout/add-edit-contact-slideout.component';
import { ContactViewModel } from 'app/generated/Opportunities/Common/contact-view-model';
import { ViewContactsSlideoutComponent, ViewContactsSlideoutOptions } from './view-contacts-slideout/view-contacts-slideout.component';
import { ActivatedRoute } from '@angular/router';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { filter } from 'rxjs/operators';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

export interface Contact {
  id?: string;
  name: string;
  phoneNumber: string;
  phoneType?: PhoneType;
  secondaryPhoneNumbers: SecondaryPhoneNumberModel[];
  emailAddress: string;
  employeeNumber: string;
}

@Component({
  selector: 'sm-contact-summary',
  templateUrl: './contact-summary.component.html',
  styles: [
    `:host {
      max-width: 100%
    }`
  ]
})
export class ContactSummaryComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('contactH2') contactH2;
  @ViewChild('contactH3') contactH3;

  @Input() hideEdit = false;
  @Input() primaryContact: Contact;
  @Input() primaryContactId: string;
  @Input() saveMode: 'None' | 'Integrated' = 'None';
  @Input() opportunityId: string;
  @Input() secondaryContacts: ContactViewModel[] = [];
  @Input() badgeDisplay: 'left' | 'top' = 'left';

  @Output() primaryContactUpdated = new EventEmitter<Contact>();
  @Output() secondaryContactsUpdated = new EventEmitter<ContactViewModel[]>();

  @ViewChild('contactMatchPopover') contactMatchPopover: NgbPopover;
  highlightContactId: string;
  contactMatch: ContactViewModel;

  constructor(private readonly slideoutService: SlideoutService,
              private readonly activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams
        .pipe(
            untilComponentDestroyed(this),
            filter(x => x.contactId)
        ).subscribe(x => {
      if (this.contactMatchPopover) {
        this.contactMatchPopover.close();
      }
      this.highlightContactId = x.contactId;
      this.tryShowContactInfo();
    });
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.secondaryContacts && changes.secondaryContacts.currentValue) {
      this.tryShowContactInfo();
    }
  }

  private tryShowContactInfo() {

    if (!this.highlightContactId) {
      return;
    }

    // UI not ready yet!
    if (!this.contactMatchPopover) {
      setTimeout(() => {
        this.tryShowContactInfo();
      }, 250);
      return;
    }

    this.contactMatch = this.secondaryContacts && this.secondaryContacts.find(x => x.id === this.highlightContactId);

    if (this.contactMatch) {
      this.contactMatchPopover.open();
      // Clear after showing.  This prevents the popup from reopening if the secondary contacts
      // are rebound after display.  This field will be repopulated if the route changes and
      // we need to display contact info for someone else.
      this.highlightContactId = null;
    }
  }

  async editPrimaryContact() {
    await this.editCustomer();
  }

  async editCustomer() {
    const opts: EditCustomerSlideoutOptions = {
      customerId: this.primaryContactId,
      contact: this.primaryContact,
      executeSave: this.saveMode === 'Integrated'
    };

    const slideout = this.slideoutService.open(`Edit ${this.primaryContact.name}`, EditCustomerSlideoutComponent, opts);

    const result: EditCustomerSlideoutResult = await slideout.closed();

    if (result && result.contact) {
      this.primaryContactUpdated.emit(result.contact);
    }
  }

  async addContact() {
    const opts: AddEditContactSlideoutOptions = {
      opportunityId: this.opportunityId,
      contact: null,
      closeOnAdd: true
    };

    const slideout = this.slideoutService.open(`Add Contact`, AddEditContactSlideoutComponent, opts);

    const newContact: ContactViewModel = await slideout.closed();

    if (newContact) {
      this.secondaryContacts.push(newContact);
      this.secondaryContactsUpdated.emit(this.secondaryContacts);
    }
  }

  async viewContacts() {
    const opts: ViewContactsSlideoutOptions = {
      opportunityId: this.opportunityId,
      executeSave: this.saveMode === 'Integrated'
    };

    const slideout = this.slideoutService.open(`Additional Contacts`, ViewContactsSlideoutComponent, opts);

    const contacts: ContactViewModel[] = await slideout.closed();

    if (contacts) {
      this.secondaryContacts = contacts;
    }
  }

  spaceIsNeeded(element: any) {
    if (!element) {
      return false;
    }

    return element.offsetWidth < element.scrollWidth;
  }
}
