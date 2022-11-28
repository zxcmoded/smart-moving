import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { OverlayParams } from 'app/shared/slideouts/slideout.service';
import { SlideoutRef } from 'app/shared/slideouts/slideout-ref';
import { ApiClientService } from 'app/core/api-client.service';
import { SmartMovingValidators } from 'app/core/SmartMovingValidators';
import { SecondaryPhoneNumberModel } from 'app/generated/Common/secondary-phone-number-model';
import { ContactForm } from 'app/generated/Opportunities/Contacts/contact-form';
import { StronglyTypedFormBuilderService } from 'app/shared/strongly-typed-form-builder.service';
import { nameof } from 'app/core/nameof';
import { asFormArray } from 'app/shared/helpers/form-helpers';
import { ContactViewModel } from 'app/generated/Opportunities/Common/contact-view-model';
import { PhoneNumberPipe } from 'app/core/pipes/phone-number.pipe';

export interface AddEditContactSlideoutOptions {
  opportunityId: string;
  contact: ContactViewModel;
  closeOnAdd?: boolean;
}

@Component({
  selector: 'sm-add-edit-contact-slideout',
  templateUrl: './add-edit-contact-slideout.component.html'
})
export class AddEditContactSlideoutComponent implements OnInit {
  asFormArray = asFormArray;
  formGroup: UntypedFormGroup;
  addMode: boolean;
  returnToListView = new EventEmitter<any>();
  isSaving = false;

  private phoneNumberPipe = new PhoneNumberPipe();

  constructor(@Inject(OverlayParams) private readonly params: AddEditContactSlideoutOptions,
              private readonly formBuilder: StronglyTypedFormBuilderService,
              private readonly slideoutRef: SlideoutRef<any>,
              private readonly apiClient: ApiClientService) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group<ContactForm>()
        .forManual('id', [null])
        .for(x => x.name, [null, Validators.required])
        .for(x => x.emailAddress, [null, [SmartMovingValidators.optionalEmail]])
        .for(x => x.phoneNumber, [null, [SmartMovingValidators.optionalPhone]])
        .for(x => x.phoneType, [null])
        .forEmptyArray(x => x.secondaryPhoneNumbers)
        .build();

    this.addMode = !this.params.contact;

    if (this.params.contact) {
      this.formGroup.patchValue({
        name: this.params.contact.name,
        emailAddress: this.params.contact.emailAddress,
        phoneNumber: this.phoneNumberPipe.transform(this.params.contact.phoneNumber),
        phoneType: this.params.contact.phoneType
      } as ContactForm);

      this.params.contact.secondaryPhoneNumbers.forEach(x => this.addPhone(x, false));
    }
  }

  addPhone(phoneNumber?: SecondaryPhoneNumberModel, markDirty = true) {
    const phoneForm = this.formBuilder.group<SecondaryPhoneNumberModel>()
        .for(x => x.phoneNumber, [null, [Validators.required, SmartMovingValidators.optionalPhone]])
        .for(x => x.phoneType, [null, Validators.required])
        .build();

    if (phoneNumber) {
      phoneNumber.phoneNumber = this.phoneNumberPipe.transform(phoneNumber.phoneNumber);
      phoneForm.patchValue(phoneNumber);
    }

    const secondaryPhoneNumbers = this.formGroup.get(nameof<ContactForm>(x => x.secondaryPhoneNumbers)) as UntypedFormArray;
    secondaryPhoneNumbers.push(phoneForm);

    // don't mark the form as dirty on init
    if (markDirty) {
      this.formGroup.markAsDirty();
    }
  }

  removePhone(index: number) {
    const secondaryPhoneNumbers = this.formGroup.get(nameof<ContactForm>(x => x.secondaryPhoneNumbers)) as UntypedFormArray;
    secondaryPhoneNumbers.removeAt(index);

    this.formGroup.markAsDirty();
  }

  async submit() {
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.invalid) {
      return;
    }

    this.isSaving = true;

    const form = {
      ...this.formGroup.value,
      opportunityId: this.params.opportunityId
    } as ContactForm;

    if (!form.emailAddress) {
      delete form.emailAddress;
    } else {
      form.emailAddress = form.emailAddress.trim();
    }

    if (!form.phoneNumber) {
      form.phoneType = null;
    }

    const contactId = (this.params.contact && this.params.contact.id) || '';

    const saveMethod = this.addMode ?
        (x: { url: string; body: any }[]) => this.apiClient.postAll<[ContactViewModel]>(x) :
        (x: { url: string; body: any }[]) => this.apiClient.putAll<[ContactViewModel]>(x);

    let contact: ContactViewModel;
    try {
      [contact] = (await saveMethod([{ url: `contacts/${contactId}`, body: form }]));

    } finally {
      this.isSaving = false;
      this.handleClose(contact);
    }
  }

  cancel() {
    this.handleClose(null);
  }

  private handleClose(contact: ContactViewModel) {
    if (this.addMode && this.params.closeOnAdd) {
      this.slideoutRef.close(contact);
    } else {
      this.returnToListView.emit();
    }
  }
}
