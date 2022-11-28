import { UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../settings.service';
import { CompanySettingsModel } from '../../generated/Settings/Company/company-settings-model';
import { PhoneNumberPipe } from '../../core/pipes/phone-number.pipe';
import { StronglyTypedFormBuilderService } from 'app/shared/strongly-typed-form-builder.service';
import { AddressModel } from 'app/generated/Common/address-model';

@Component({
  selector: 'sm-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyDetailsForm: UntypedFormGroup;
  isLoading = true;

  constructor(
    private formBuilder: StronglyTypedFormBuilderService,
    private settingService: SettingsService
  ) {
    this.createForm();
  }

  async ngOnInit() {
    await this.getCompanyDetails();
  }

  createForm() {
    const urlRegex = 'https?://.+';
    this.companyDetailsForm = this.formBuilder.group<CompanySettingsModel>()
      .for(x => x.phoneNumber, ['', Validators.required])
      .for(x => x.stateLicenseNumber, ['', Validators.required])
      .for(x => x.ianaTzdbTimeZone, [null, Validators.required])
      .for(x => x.websiteAddress, ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])])
      .for(x => x.customerPortalUrl, ['', Validators.compose([Validators.required, Validators.pattern(urlRegex)])])
      .for(x => x.smsNumber, [{ value: '', disabled: true }])
      .for(x => x.address, this.formBuilder.group<AddressModel>()
        .for(x => x.street, [''])
        .for(x => x.city, [''])
        .for(x => x.state, [''])
        .for(x => x.zipCode, [''])
        .build())
      .build();
  }

  async getCompanyDetails() {
    const company = await this.settingService.getCompanyDetails();
    this.setCompanyDetails(company);
    this.isLoading = false;
  }

  setCompanyDetails(company: CompanySettingsModel) {
    const phoneNumberPipe = new PhoneNumberPipe();
    this.companyDetailsForm.patchValue({
      phoneNumber: phoneNumberPipe.transform(company.phoneNumber),
      stateLicenseNumber: company.stateLicenseNumber,
      address: company.address,
      websiteAddress: company.websiteAddress,
      customerPortalUrl: company.customerPortalUrl,
      smsNumber: phoneNumberPipe.transform(company.smsNumber),
      ianaTzdbTimeZone: company.ianaTzdbTimeZone
    } as CompanySettingsModel);
    this.companyDetailsForm.markAsTouched();
  }

  async updateCompanyDetails() {
    const company = await this.settingService.updateCompanyDetails(this.companyDetailsForm.value);

    this.companyDetailsForm.markAsPristine();
    this.setCompanyDetails(company);
  }
}
