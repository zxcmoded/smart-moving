import { Component, EventEmitter, HostBinding, Input, OnChanges, Optional, Output, Self, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  viewProviders: [{
    // https://stackoverflow.com/questions/46141714/use-formcontrolname-for-custom-input-component-in-reactive-form
    provide: ControlContainer,
    useExisting: FormGroupDirective
  }]
})
export class RadioControlComponent extends BaseControlComponent implements OnChanges {
  @Input() formControlName: string;
  @Input() formControl: AbstractControl;

  @Input() inputValue: any;

  @Input() isInline = false;
  @Input() useFullWidthLabel = false;
  /** An event emitter allowing you to subscribe direction to changes. This can be more efficient than matching on a list of ids.
   * Currently only tested with formControl input (not formControlName) */
  @Output() valueChange = new EventEmitter<any>();

  @HostBinding('class.d-inline-flex') get useInlineFlex() {
    return this.isInline;
  }

  constructor(@Self() @Optional() public readonly ngControl: NgControl) {
    super(ngControl);
  }


  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (!changes) {
      return;
    }

    this.finalDataTestId = this.dataTestId ?? BaseControlComponent.generateDataTestId(this.inputName + this.inputValue);
  }
}
