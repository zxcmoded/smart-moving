import { AbstractControl, UntypedFormControl, ValidationErrors } from '@angular/forms';

export interface ValidationBridge {
  childControl: AbstractControl;
  parentControl: AbstractControl;

  validate(parentControl: UntypedFormControl): ValidationErrors;
}

/*

This function can be used to "bridge" the validation between a child FormControl instance and a parent FormControl instance
via a component that implements the ControlValueAccessor interface.

Bridging does NOT support dynamically changing validators on either side using setValidators.  Using that will likely
break the bridging.

In order to use this function, implement the ValidationBridge interface, and call this function early in your ngOnInit function.

For an example, see sm-date-picker.

 */

export const enableValidationBridge = (target: ValidationBridge) => {

  if (!target.childControl?.setValidators || !target.parentControl?.setValidators) {
    return;
  }

  // Apply validators from the parent to the child
  if (target.parentControl.validator) {
    target.childControl.setValidators([
      target.parentControl.validator
    ]);
    target.childControl.updateValueAndValidity();
  }

  // Bind up child validation so that we can influence validity of the parent.
  const validatorsForParent = [target.validate.bind(target)];
  if (target.parentControl.validator) {
    validatorsForParent.push(target.parentControl.validator);
  }
  target.parentControl.setValidators(validatorsForParent);
  target.parentControl.updateValueAndValidity();

  // Decorate the parent control's updateValueAndValidity method so that we can update the child when
  // the parent changes.
  const originalUpdateValueAndValidity = target.parentControl.updateValueAndValidity;

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  target.parentControl.updateValueAndValidity = function(opts?: { onlySelf?: boolean; emitEvent?: boolean }) {
    originalUpdateValueAndValidity.apply(target.parentControl, arguments);
    target.childControl.updateValueAndValidity(opts);
  };
};
