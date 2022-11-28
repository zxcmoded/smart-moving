import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { BaseControlComponent } from 'app/forms/base-control.component';
import { delayAsync } from 'app/core/delay-async.function';

enum InputAddonMode {
  None,
  Template,
  Icon,
  Text
}

@Component({
  selector: 'sm-input-text-control',
  templateUrl: './input-text-control.component.html',
  viewProviders: [{
    // https://stackoverflow.com/questions/46141714/use-formcontrolname-for-custom-input-component-in-reactive-form
    provide: ControlContainer,
    useExisting: FormGroupDirective
  }]
})
export class InputTextControlComponent extends BaseControlComponent implements OnChanges, AfterViewInit {
  InputAddonMode = InputAddonMode;

  // Basic properties for simple use cases. If you need more complex, use the template ref properties.
  @Input() prependIconClass: string;
  @Input() prependText: string;
  @Input() prependBackgroundIsClear: boolean;
  @Input() prependTemplateInfoArray: { ref: TemplateRef<any>; backgroundIsClear?: boolean }[];
  prependMode: InputAddonMode;

  @Input() appendIconClass: string;
  @Input() appendText: string;
  @Input() appendBackgroundIsClear: boolean;
  @Input() appendTemplateInfoArray: { ref: TemplateRef<any>; backgroundIsClear?: boolean }[];
  @Input() inputType: 'text' | 'number' | string = 'text';
  appendMode: InputAddonMode;

  // This cannot be used with labelTemplateRef
  @Input() labelActionTemplateRef: TemplateRef<any>;

  @Input() maxLength: number;

  @Input() narrowMode = false;
  @Input() rightAlign = false;
  @Input() centerAlign = false;

  // These are needed in order to facilitate the ngControl binding.
  @Input() formControlName: string;
  @Input() formControl: AbstractControl;

  @Output() inputFocus = new EventEmitter();
  @Output() inputBlur = new EventEmitter();

  @ViewChild('inputTextbox') inputTextbox: ElementRef;
  @ViewChild('phoneInputTextbox') phoneInputTextbox: ElementRef;
  @ViewChild('numberTextbox') numberTextbox: ElementRef;

  private get input() {
    return this.phoneInputTextbox ?? this.numberTextbox ?? this.inputTextbox;
  }

  @Input() showClearButton = false;

  @Input() isPhoneNumber = false;
  @Input() useSmallControl = false;
  @Input() fixedWidth = null;

  @Output() cleared = new EventEmitter();

  constructor(@Self() @Optional() public readonly ngControl: NgControl) {
    super(ngControl);
  }

  async ngAfterViewInit() {
    if (this.autoFocusInput) {
      let attemptsLeft = 5;

      // Try to wait for the element to become available.
      while (attemptsLeft-- > 0) {
        if (!this.input?.nativeElement?.focus) {
          await delayAsync(100);
        }
      }

      this.input?.nativeElement?.focus();
      if (this.autoSelectTextWhenAutoFocus) {
        this.input?.nativeElement.select();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }

    super.ngOnChanges(changes);

    this.prependMode = this.getPrependMode();
    this.appendMode = this.getAppendMode();
  }

  getPrependMode() {
    if (this.prependTemplateInfoArray?.length) {
      return InputAddonMode.Template;
    }

    if (this.prependIconClass) {
      return InputAddonMode.Icon;
    }

    if (this.prependText) {
      return InputAddonMode.Text;
    }

    return InputAddonMode.None;
  }

  getAppendMode() {
    if (this.appendTemplateInfoArray?.length) {
      return InputAddonMode.Template;
    }

    if (this.appendIconClass) {
      return InputAddonMode.Icon;
    }

    if (this.appendText) {
      return InputAddonMode.Text;
    }

    return InputAddonMode.None;
  }

  focus() {
    this.input.nativeElement.focus();
    // This helps focus on mobile devices according the internet, and the internet is never wrong.
    this.input.nativeElement.select();
  }

  clear() {
    this.ngControl?.control?.setValue(null);
    this.cleared.emit();
  }
}
