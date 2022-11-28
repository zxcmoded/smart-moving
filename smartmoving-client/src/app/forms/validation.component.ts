import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'sm-validation',
  template: `
  <div *ngIf="showValidation()" class="feedback invalid-feedback {{additionalCssClasses}}">
    <i class="fa fa-warning"></i>
    {{getValidationMessage()}}
  </div>`,
})
export class ValidationComponent implements OnInit {
  @Input() controlName: string;
  @Input() formGroup: UntypedFormGroup;
  @Input() form: NgForm | FormGroupDirective;
  @Input() skipSubmissionCheck = false;
  @Input() additionalCssClasses: string;

  constructor() { }

  ngOnInit() {
  }

  showValidation() {
    if (!this.formGroup || !this.form) {
      return false;
    }

    return (this.skipSubmissionCheck || this.form.submitted) && !this.formGroup.controls[this.controlName].valid;
  }

  getValidationMessage() {
    if (!this.formGroup) {
      return;
    }

    const control = this.formGroup.controls[this.controlName];

    if (!control) {
      return;
    }

    if (!control.errors) {
      return;
    }

    if (control.errors.minlength) {
      return 'This field is too short';
    }

    if (control.errors.maxlength) {
      return 'This field is too long';
    }

    if (control.errors.email) {
      return 'This field must be a valid e-mail address';
    }

    if (control.errors.required) {
      return 'This field is required';
    }

    return 'This field is invalid';
  }
}
