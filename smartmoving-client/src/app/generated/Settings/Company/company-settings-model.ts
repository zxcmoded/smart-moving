import { AddressModel } from '../../Common/address-model';
export class CompanySettingsModel {
  phoneNumber: string;
  stateLicenseNumber: string;
  address: AddressModel;
  websiteAddress: string;
  customerPortalUrl: string;
  smsNumber: string;
  ianaTzdbTimeZone: string;
}
