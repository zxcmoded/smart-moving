import { Component, EventEmitter, Input, OnInit, Output, Self, TemplateRef } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl } from '@angular/forms';
import { DateBehavior } from 'app/forms/date-picker/date-behavior.class';
import { DatePickerBehavior } from 'app/forms/date-picker/date-picker-behavior.interface';
import { BaseControlComponent } from 'app/forms/base-control.component';
import { enableValidationBridge, ValidationBridge } from 'app/forms/validation-bridge';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'sm-date-picker',
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent extends BaseControlComponent implements OnInit, ControlValueAccessor, ValidationBridge {

  @Input() popoverMode = false;
  @Input() popoverContainer: string = null;

  maxDateValue: Date;

  @Input() set maxDate(value: any) {
    this.maxDateValue = this.behavior.convertInput(value);
  }

  minDateValue: Date;

  @Input() set minDate(value: any) {
    this.minDateValue = this.behavior.convertInput(value);
  }

  startAtDateValue: Date;

  @Input() set startAtDate(value: any) {
    this.startAtDateValue = this.behavior.convertInput(value);
  }

  @Input() allowClearing = true;
  @Input() showIcon = true;

  @Input() set dateKeyMode(value: boolean) {
    this.behavior = new DateBehavior();
  }

  @Input() popoverTemplate: TemplateRef<any>;

  @Input() placement: PlacementArray = ['bottom', 'auto'];

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<any>();

  behavior: DatePickerBehavior = new DateBehavior();

  formControl = new UntypedFormControl();

  currentValue: Date | number;

  propagateChange = (_: any) => ({});
  propagateTouched = (_: any) => ({});

  get childControl() {
    return this.formControl;
  }

  get parentControl() {
    return this.parentNgControl.control;
  }

  constructor(@Self() private parentNgControl: NgControl) {
    super(parentNgControl);
    parentNgControl.valueAccessor = this;
  }

  ngOnInit() {

    super.ngOnInit();

    enableValidationBridge(this);

    this.formControl.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe((x: Date) => {
          if (x === this.currentValue) {
            return;
          }

          const newValue = this.behavior.getValueFor(x);

          if (newValue !== this.currentValue) {
            this.currentValue = newValue;
            this.propagateChange(this.currentValue);
            this.change.emit(this.currentValue);
          }
        });
  }

  pickerOpened() {
    // We don't want just opening the picker to be seen as a validation check.
    if (this.formControl && this.formControl.markAsUntouched) {
      // Need to delay until Angular has had time to flag the control as touched.
      setTimeout(() => {
        this.formControl.markAsUntouched();
      }, 100);
    }
  }

  clear() {
    this.currentValue = null;
    this.propagateChange(null);
    this.change.emit(null);
    this.formControl.setValue(null);
  }

  writeValue(rawValue: any) {

    const value = this.behavior.convertInput(rawValue);

    this.currentValue = value;

    if (value === null) {
      this.formControl.reset();
      return;
    }

    this.formControl.setValue(value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  validate(parentControl: UntypedFormControl) {
    if (!this.formControl?.validator) {
      return;
    }

    return this.formControl.validator(this.formControl);
  }
}
