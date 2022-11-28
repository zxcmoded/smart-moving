import { Component, Input, Optional, Self} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-textarea-control',
  templateUrl: './textarea-control.component.html',
  viewProviders: [{
    // https://stackoverflow.com/questions/46141714/use-formcontrolname-for-custom-input-component-in-reactive-form
    provide: ControlContainer,
    useExisting: FormGroupDirective
  }]
})
export class TextareaControlComponent extends BaseControlComponent {

  // These are needed in order to facilitate the ngControl binding.
  @Input() formControlName: string;
  @Input() formControl: AbstractControl;

  @Input() rows = 3;
  @Input() textAreaMaxLength: number;

  @Input() autoGrow = false;
  @Input() autoGrowValue: any;

  constructor(@Self() @Optional() public readonly ngControl: NgControl) {
    super(ngControl);
  }
}
