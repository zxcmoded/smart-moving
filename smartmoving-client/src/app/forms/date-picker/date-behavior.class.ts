import { DatePickerBehavior } from 'app/forms/date-picker/date-picker-behavior.interface';

// This behavior shouldn't need to do anything.  It takes in dates, and hands dates back, no translation needed.
export class DateBehavior implements DatePickerBehavior {

  getValueFor(rawValue: Date) {
    return rawValue;
  }

  convertInput(rawValue: any): Date{
    if (!rawValue) {
      return null;
    }

    return rawValue;
  }
}
