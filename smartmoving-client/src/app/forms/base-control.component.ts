import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, UntypedFormControl, NgControl } from '@angular/forms';
import { NOOP_VALUE_ACCESSOR } from 'app/forms/control-value-accessor-noop-shim';
import { CamelCasePipe } from 'app/core/pipes/camel-case.pipe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  template: ''
})
export class BaseControlComponent implements OnChanges, OnInit {
  @Input() inputId = 'id' + Math.random().toString(36).substring(2);
  @Input() inputName: string; // Defaults to inputId if not specified

  @Input() labelText: string;
  @Input() labelExtraCss: string;
  @Input() labelTemplateRef: TemplateRef<any>;

  // This is used for our automated UI tests to select elements.
  @Input() dataTestId: string;
  finalDataTestId: string;

  @Input() placeholder: string;

  @Input() noMargin = false;

  @Input() helpText: string;
  @Input() helpIconClass: string;
  @Input() helpTemplateRef: TemplateRef<any>;

  // If set, the control will be marked as required even if the corresponding FormControl does not have a Required validator.
  @Input() isRequired: boolean;

  @Input() isReadonly = false;

  @Input() autoFocusInput = false;
  @Input() autoSelectTextWhenAutoFocus = false;

  finalInputName: string;
  showLabel: boolean;

  autocompleteValue = 'off';

  isRequiredControl: boolean;

  // Undo-related props
  showUndoButton: boolean;
  private undoAction: () => any;
  private undoMessage: () => string;

  constructor(public readonly ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }

    if (!!(window as any).chrome) {
      this.autocompleteValue = this.inputId;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }

    if (changes.isRequired) {
      this.checkRequiredValue();
    }

    this.placeholder = this.placeholder ?? this.labelText;
    this.finalInputName = this.inputName ?? this.inputId;
    this.showLabel = !!(this.labelText || this.labelTemplateRef);

    this.finalDataTestId = this.dataTestId ?? BaseControlComponent.generateDataTestId(this.labelText);
  }

  static generateDataTestId(startingFrom: string) {
    return new CamelCasePipe().transform(startingFrom);
  }

  ngOnInit() {
    this.checkRequiredValue();

    // Trick to detect if the required validator was removed
    this.ngControl?.statusChanges.pipe(untilDestroyed(this)).subscribe(_ => this.checkRequiredValue());
  }

  private checkRequiredValue() {
    if (this.isRequired !== undefined) {
      this.isRequiredControl = this.isRequired;
      return;
    }

    if (this.ngControl?.control?.validator) {
      const validator = this.ngControl.control.validator({} as AbstractControl);
      this.isRequiredControl = validator?.required === true;
      return;
    }

    this.isRequiredControl = false;
  }

  enableUndo(undoControl: UntypedFormControl, undoAction: () => any, undoMessage: () => string) {
    undoControl.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe(x => this.showUndoButton = !!x);

    this.showUndoButton = undoControl.enabled && undoControl.value as boolean;
    this.undoAction = undoAction;
    this.undoMessage = undoMessage;
  }

  disableUndo() {
    this.undoAction = null;
    this.undoMessage = null;
  };

  doUndo() {
    this.undoAction();
  }

  getUndoMessage() {
    return this.undoMessage();
  }
}
