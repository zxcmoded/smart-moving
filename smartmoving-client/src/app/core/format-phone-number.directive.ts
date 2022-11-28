import { Directive, ElementRef, AfterContentInit, Input, HostListener } from '@angular/core';
import { UntypedFormControl, NgControl } from '@angular/forms';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';

@Directive({
  selector: '[smFormatPhoneNumber]'
})
export class FormatPhoneNumberDirective implements AfterContentInit {
  @Input() formatOnBlur = false;
  private phoneNumberPipe = new PhoneNumberPipe();

  constructor(private el: ElementRef, private control: NgControl) {
  }

  ngAfterContentInit() {
    if (this.control && this.control.control) {
      this.formatAsPhoneNumber(this.control.control.value);
    }
  }

  @HostListener('blur', ['$event']) onBlur() {
    if (this.formatOnBlur) {
      const realControl = this.control?.control as UntypedFormControl;

      if (realControl?.valid) {
        const formattedPhone = this.phoneNumberPipe.transform(this.control.value);

        if (formattedPhone) {
          this.el.nativeElement.value = formattedPhone;
        }
      }
    }
  }

  private formatAsPhoneNumber(value: string) {
    const result = this.phoneNumberPipe.transform(value);

    if (result) {
      this.el.nativeElement.value = result;
    }
  }
}
