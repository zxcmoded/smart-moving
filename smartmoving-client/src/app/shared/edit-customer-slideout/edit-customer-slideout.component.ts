import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { SlideoutRef } from 'app/shared/slideouts/slideout-ref';
import { ApiClientService } from 'app/core/api-client.service';
import { SmartMovingValidators } from 'app/core/SmartMovingValidators';
import { Contact } from '../contact-summary/contact-summary.component';
import { OverlayParams } from '../slideouts/slideout.service';
import { SecondaryPhoneNumberModel } from 'app/generated/Common/secondary-phone-number-model';
import { EditCustomerForm } from 'app/generated/Customers/UpdateCustomer/edit-customer-form';
import { StronglyTypedFormBuilderService } from '../strongly-typed-form-builder.service';
import { nameof } from 'app/core/nameof';
import { asFormArray } from 'app/shared/helpers/form-helpers';
import { PhoneNumberPipe } from 'app/core/pipes/phone-number.pipe';

export interface EditCustomerSlideoutOptions {
  customerId: string;
  contact: Contact;
  executeSave: boolean;
}

export interface EditCustomerSlideoutResult {
  contact: Contact;
  customerId: string;
}

@Component({
  selector: 'sm-edit-customer-slideout',
  templateUrl: './edit-customer-slideout.component.html'
})
export class EditCustomerSlideoutComponent implements OnInit, OnDestroy {
  formGroup: UntypedFormGroup;
  isSaving = false;
  customerId: string;
  asFormArray = asFormArray;

  private phoneNumberPipe = new PhoneNumberPipe();


  constructor(@Inject(OverlayParams) private params: EditCustomerSlideoutOptions,
              private apiClient: ApiClientService,
              private formBuilder: StronglyTypedFormBuilderService,
              private slideoutRef: SlideoutRef<any>) {
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group<EditCustomerForm>()
        .for(x => x.name, [null, Validators.required])
        .for(x => x.emailAddress, [null, SmartMovingValidators.optionalEmail])
        .for(x => x.phoneNumber, [null, SmartMovingValidators.optionalPhone])
        .for(x => x.phoneType, [null])
        .for(x => x.employeeNumber, [null,[Validators.required, Validators.maxLength(20)]])
        .forEmptyArray(x => x.secondaryPhoneNumbers)
        .build();

    this.formGroup.patchValue({
      name: this.params.contact.name,
      emailAddress: this.params.contact.emailAddress,
      employeeNumber:this.params.contact.employeeNumber,
      phoneNumber: this.phoneNumberPipe.transform(this.params.contact.phoneNumber),
      phoneType: this.params.contact.phoneType
    } as EditCustomerForm);

    // Avoiding ExpressionChangedAfterItHasBeenCheckedError. This is actually
    // what the docs recommend.
    setTimeout(() => this.params.contact.secondaryPhoneNumbers.forEach(x => this.addPhone(x, false)), 0);
  }

  ngOnDestroy() {
  }

  cancel() {
    this.slideoutRef.close();
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

    const secondaryPhoneNumbers = this.formGroup.get(nameof<EditCustomerForm>(x => x.secondaryPhoneNumbers)) as UntypedFormArray;
    secondaryPhoneNumbers.push(phoneForm);

    // don't mark the form as dirty on init
    if (markDirty) {
      this.formGroup.markAsDirty();
    }
  }

  removePhone(index: number) {
    const secondaryPhoneNumbers = this.formGroup.get(nameof<EditCustomerForm>(x => x.secondaryPhoneNumbers)) as UntypedFormArray;
    secondaryPhoneNumbers.removeAt(index);

    this.formGroup.markAsDirty();
  }

  async submit() {
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.invalid) {
      return;
    }

    const form = this.formGroup.value as EditCustomerForm;

    if (!form.emailAddress) {
      delete form.emailAddress;
    } else {
      form.emailAddress = form.emailAddress.trim();
    }

    if (!form.phoneNumber) {
      form.phoneType = null;
    }

    if (this.params.executeSave) {
      await this.apiClient.putAll([{ url: `customers/${this.params.customerId}`, body: form }], x => this.isSaving = x);
    }

    const result: EditCustomerSlideoutResult = {
      contact: { emailAddress: '', ...form },
      customerId: this.customerId
    };

    this.slideoutRef.close(result);
  }
}
