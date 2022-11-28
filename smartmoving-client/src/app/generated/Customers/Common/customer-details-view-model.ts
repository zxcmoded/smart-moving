import { SecondaryPhoneNumberModel } from '../../Common/secondary-phone-number-model';
import { PhoneType } from '../../SmartMoving/Core/Data/Core/phone-type';
export class CustomerDetailsViewModel {
  id: string;
  name: string;
  phoneNumber: string;
  phoneType?: PhoneType;
  emailAddress: string;
  address: string;
  initialReferralSource: string;
  hasAccount: boolean;
  secondaryPhoneNumbers: SecondaryPhoneNumberModel[];
  storageAccountBalance: number;
  jobsTotalPaid: number;
  jobsTotalInvoiced: number;
  totalBalance: number;
  originAddress: string;
}
