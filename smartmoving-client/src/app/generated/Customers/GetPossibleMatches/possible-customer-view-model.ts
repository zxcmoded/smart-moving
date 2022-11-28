import { PhoneType } from '../../SmartMoving/Core/Data/Core/phone-type';
export class PossibleCustomerViewModel {
  id: string;
  name: string;
  phoneNumber: string;
  phoneType?: PhoneType;
  emailAddress: string;
}
