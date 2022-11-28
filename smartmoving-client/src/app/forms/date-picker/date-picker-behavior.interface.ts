export interface DatePickerBehavior {
  getValueFor(rawValue: Date): any;
  convertInput(rawValue: any): Date;
}
