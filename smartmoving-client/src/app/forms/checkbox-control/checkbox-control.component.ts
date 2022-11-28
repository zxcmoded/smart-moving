import { Component, Input, OnChanges, Optional, Self} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  viewProviders: [{
    // https://stackoverflow.com/questions/46141714/use-formcontrolname-for-custom-input-component-in-reactive-form
    provide: ControlContainer,
    useExisting: FormGroupDirective
  }]
})
export class CheckboxControlComponent extends BaseControlComponent implements OnChanges {

  @Input() formControlName: string;
  @Input() formControl: AbstractControl;

  // This puts this checkbox on the right, instead of the left.
  @Input() rightMode = false;
  @Input() paddedBackground = false;
  @Input() noMargin = false;
  @Input() alignWithInputs = false;

  finalInputName: string;

  constructor(@Self() @Optional() public readonly ngControl: NgControl) {
    super(ngControl);
  }

  handleLabelClick() {
    if (!this.ngControl?.enabled) {
      return;
    }

    this.ngControl.control.setValue(!this.ngControl.value);
    this.ngControl.control.markAsDirty();
  }
}
