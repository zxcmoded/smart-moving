import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { NOOP_VALUE_ACCESSOR } from 'app/forms/control-value-accessor-noop-shim';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { filter } from 'rxjs/operators';
import { InputTextControlComponent } from 'app/forms/input-text-control/input-text-control.component';

@Component({
  selector: 'sm-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss'],
  viewProviders: [{
    // https://stackoverflow.com/questions/46141714/use-formcontrolname-for-custom-input-component-in-reactive-form
    provide: ControlContainer,
    useExisting: FormGroupDirective
  }]
})
// This doesn't derive from our base class because it is intended to be used as-is, with little/no customization.
export class SearchControlComponent implements OnInit, OnDestroy {
  @ViewChild('inputTextControl') inputTextControl: InputTextControlComponent;

  @Input() inputId = 'id' + Math.random().toString(36).substring(2);
  @Input() dataTestId = 'search-box';

  @Input() placeholder = 'Search...';

  // These are needed in order to facilitate the ngControl binding.
  @Input() formControlName: string;
  @Input() formControl: AbstractControl;

  @Output() cleared = new EventEmitter();

  constructor(@Self() @Optional() public readonly ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  ngOnInit() {
    this.ngControl?.valueChanges?.pipe(
        untilComponentDestroyed(this),
        filter(x => !x))
        .subscribe(_ => this.cleared.emit());
  }

  ngOnDestroy() {
  }

  clear() {
    this.ngControl?.control?.setValue('');

    try {
      this.inputTextControl?.focus?.();
    } catch (err) {
      console.error(err);
    }
  }
}
