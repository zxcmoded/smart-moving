import { Component, OnInit, forwardRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, Validators } from '@angular/forms';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-color-control',
  templateUrl: './color-control.component.html',
  styleUrls: ['./color-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorControlComponent),
      multi: true
    }
  ]
})
export class ColorControlComponent extends BaseControlComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {

  colorControl: UntypedFormControl;

  propagateChange: (_: any) => void;
  touched: () => void;

  constructor() {
    super(null);
    this.colorControl = new UntypedFormControl();
    this.labelText = 'Color';
    this.placeholder = 'Color';
  }

  async ngOnInit() {
    this.colorControl.valueChanges
        .pipe(untilComponentDestroyed(this))
        .subscribe(x => {
          if (!this.propagateChange) {
            return;
          }

          this.propagateChange(x?.length ? `#${x}` : null);
        });
  }

  ngOnDestroy() {
  }

  writeValue(val: any): void {
    if (!this.colorControl) {
      return;
    }

    if (val === null) {
      this.colorControl.reset();
      return;
    }

    if (val && typeof (val) === 'string' && val.startsWith('#')) {
      val = val.substring(1);
    }

    this.colorControl.setValue(val);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.touched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.colorControl.disable();
    } else {
      this.colorControl.enable();
    }
  }

  focused() {
    this.touched();
  }

  omitSpecialChar(event) {
    const k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (!changes || !this.colorControl) {
      return;
    }

    this.colorControl.clearValidators();

    if (this.isRequired) {
      this.colorControl.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(6)]);
    } else {
      this.colorControl.setValidators([Validators.minLength(3), Validators.maxLength(6)]);
    }
  }
}
