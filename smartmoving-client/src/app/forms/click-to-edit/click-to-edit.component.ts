import {
  Component,
  OnInit,
  forwardRef,
  HostBinding,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  NgZone
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, UntypedFormControl } from '@angular/forms';
import { round } from 'app/core/round-number';
import { spliceOutOfArray } from 'app/core/splice-out-of-array.function';

class ClickToEditDocumentEventWatcher {

  listeners = [] as ClickToEditComponent[];

  constructor() {
    document.addEventListener('click', (e) => {
      this.listeners.forEach(x => {
        try {
          if (x.docClick) {
            x.docClick(e);
          }
        } catch {
          // PacMan, because we want to make sure *all* event handlers get to fire.
          console.error('Failed to execute a click event for an element in the array!', e);
        }
      });
    });
  }

  addListener(handler: ClickToEditComponent) {
    this.listeners.push(handler);
  }

  removeListener(handler: ClickToEditComponent) {
    spliceOutOfArray(this.listeners, handler);
  }
}

export class ClickToEditValueChangeEvent {
  oldValue: any;
  newValue: any;
}

@Component({
  selector: 'sm-click-to-edit',
  templateUrl: './click-to-edit.component.html',
  styleUrls: ['./click-to-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClickToEditComponent),
      multi: true
    }
  ],
})
export class ClickToEditComponent implements OnInit, ControlValueAccessor, OnDestroy {

  static watcher = new ClickToEditDocumentEventWatcher();

  propagateChange: (_: any) => any;
  propagateTouched: () => any;
  @Input() type = 'text';
  @Input() allowEditing = true;
  @Input() allowEmpty = false;
  @Input() allowOnlyNumbers = true;
  @Input() textColorClass = 'text-primary';
  @Input() validate: (val) => boolean;
  @Input() precision = 2;
  @HostBinding('class.display-mode') displayMode = true;

  control: UntypedFormControl;
  rawValue: any;
  oldVal;
  switching: boolean;
  invalid: boolean;

  @Output() valueChange = new EventEmitter<ClickToEditValueChangeEvent>();

  constructor(private readonly ngZone: NgZone) {
    ClickToEditComponent.watcher.addListener(this);
  }

  ngOnInit() {
    this.control = new UntypedFormControl(['']);
  }

  ngOnDestroy() {
    ClickToEditComponent.watcher.removeListener(this);
  }

  switchToEditMode() {
    if (this.allowEditing && !this.control.disabled) {
      this.oldVal = this.rawValue;
      this.displayMode = false;
      this.switching = true;
    }
  }

  docClick(event: MouseEvent) {
    if (this.displayMode) {
      return;
    }

    if (this.switching) {
      this.switching = false;
      return;
    }

    if (this.belongsToComponent(event.target as any)) {
      return;
    }

    this.ngZone.run(() => this.persistChanges());
  }

  belongsToComponent(target: Element) {
    const closest = target.closest('.click-to-edit-wrapper');
    return !!closest;
  }

  writeValue(value: any): void {
    this.rawValue = value;
    this.control.setValue(this.rawValue);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  persistChanges() {
    let controlValue = this.control.value;
    const validator = this.validate || (() => true);

    if (!validator(controlValue)) {
      this.invalid = true;
      return;
    }

    if (!controlValue && !this.allowEmpty && !(this.type === 'integer' && controlValue === 0)) {
      this.cancel();
      return;
    }

    if (this.allowOnlyNumbers) {
      controlValue = round(this.control.value, this.precision);
      if (isNaN(this.control.value) || ((this.type === 'number') && (this.control.value < 1))) {
        this.cancel();
        return;
      }
    } else if (!controlValue && !this.allowEmpty) {
      this.cancel();
      return;
    }

    this.displayMode = true;
    this.rawValue = controlValue;
    if (controlValue !== this.oldVal) { // Value has changed
      // This is to update the number, if it gets rounded.
      this.control.setValue(controlValue, {
        emitEvent: false
      });
      if (this.propagateChange) {
        this.propagateChange(controlValue);
      }
      if (this.propagateTouched) {
        this.propagateTouched();
      }
      this.valueChange.emit({
        oldValue: this.oldVal,
        newValue: controlValue,
      } as ClickToEditValueChangeEvent);
    }
  }

  cancel() {
    this.displayMode = true;
    this.control.setValue(this.rawValue);
  }
}
