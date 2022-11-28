import { SecondaryPhoneNumberModel } from '../../Common/secondary-phone-number-model';
import { PhoneType } from '../../SmartMoving/Core/Data/Core/phone-type';
export class ContactViewModel {
  id?: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  phoneType?: PhoneType;
  secondaryPhoneNumbers: SecondaryPhoneNumberModel[];
}
