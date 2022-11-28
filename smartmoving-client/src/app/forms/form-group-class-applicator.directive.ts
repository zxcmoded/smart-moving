import { AfterViewChecked, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '.form-group'
})
export class FormGroupClassApplicatorDirective implements OnInit, AfterViewChecked {
  elementWithFormGroup: HTMLElement;
  // This is a bit of a lie. It might be input / textarea / select, but this works well enough for our uses for now.
  input: HTMLInputElement;

  constructor(private readonly elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementWithFormGroup = this.elementRef.nativeElement;
    this.findAndSetInput();
  }

  private findAndSetInput() {
    const inputs = this.elementWithFormGroup.getElementsByTagName('input');
    if (inputs?.length) {
      this.input = inputs[0];
      return;
    }

    const textareas = this.elementWithFormGroup.getElementsByTagName('textarea');
    if (textareas?.length) {
      this.input = textareas[0] as unknown as HTMLInputElement;
      return;
    }

    const selects = this.elementWithFormGroup.getElementsByTagName('select');
    if (selects?.length) {
      this.input = selects[0] as unknown as HTMLInputElement;
      return;
    }
  }

  ngAfterViewChecked() {
    if (!this.input) {
      // Some inputs are only conditionally shown later.
      this.findAndSetInput();

      if (!this.input) {
        return;
      }
    }

    if (this.input.disabled || this.input.attributes['readonly']) {
      this.elementWithFormGroup.classList.add('sm-form-group-disabled');
    } else {
      this.elementWithFormGroup.classList.remove('sm-form-group-disabled');
    }

    if (this.input.classList.contains('ng-invalid')) {
      this.elementWithFormGroup.classList.add('sm-form-group-invalid');
    } else {
      this.elementWithFormGroup.classList.remove('sm-form-group-invalid');
    }

    if (this.input.attributes['readonly']) {
      return;
    }

    if (this.input.classList.contains('ng-touched') ||
        (this.input.type === 'checkbox' && this.input.classList.contains('ng-dirty'))) {
      this.elementWithFormGroup.classList.add('sm-form-group-touched');
    } else {
      this.elementWithFormGroup.classList.remove('sm-form-group-touched');
    }
  }

}
