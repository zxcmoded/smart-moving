import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form'
})
export class FormClassApplicatorDirective implements OnInit {
  @Input() formGroup: UntypedFormGroup;
  form: HTMLElement;

  constructor(private readonly elementRef: ElementRef) {
  }

  ngOnInit() {
    this.setUpHooks();
  }

  private setUpHooks() {
    this.form = this.elementRef.nativeElement;

    this.form.addEventListener('submit', (element) => this.form.classList.add('sm-form-submitted'));

    if (this.formGroup) {
      const oldReset = this.formGroup.reset;

      this.formGroup.reset = (value: any, options?: any) => {
        oldReset.apply(this.formGroup, [value, options]);
        this.form.classList.remove('sm-form-submitted');
      };
    }
  }
}
