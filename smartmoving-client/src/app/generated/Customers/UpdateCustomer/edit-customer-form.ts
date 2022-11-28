import { SecondaryPhoneNumberModel } from '../../Common/secondary-phone-number-model';
import { PhoneType } from '../../SmartMoving/Core/Data/Core/phone-type';
export class EditCustomerForm {
  name: string;
  phoneNumber: string;
  phoneType?: PhoneType;
  emailAddress: string;
  address: string;
  secondaryPhoneNumbers: SecondaryPhoneNumberModel[];
  employeeNumber: string;
}
