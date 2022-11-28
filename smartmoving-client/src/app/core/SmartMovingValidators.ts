import { AbstractControl, Validators, ValidationErrors, UntypedFormControl, ValidatorFn, UntypedFormArray } from '@angular/forms';

export class SmartMovingValidators {

  private static baseEmailRegex = '[\\w\\+\\-\\.]+@[\\w\\-\\.]+\\.[a-zA-Z]{2,}';

  static get multiEmailRegex() {
    return `^\\s*(${SmartMovingValidators.baseEmailRegex},?)+\\s*$`;
  }

  static get emailRegex() {
    return `^\\s*${SmartMovingValidators.baseEmailRegex}\\s*$`;
  }

  static get caOrUsPostalCodeRegex() {
    return `(${SmartMovingValidators._usZipCodeRegex})|(${SmartMovingValidators._caPostalCodeRegex})`;
  }

  static requiredEmail(control: AbstractControl) {
    return Validators.pattern(SmartMovingValidators.emailRegex)(control);
  }

  static optionalEmail(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern(SmartMovingValidators.emailRegex)(control);
  }

  static optionalMultiEmail(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern(SmartMovingValidators.multiEmailRegex)(control);
  }

  static optionalPhone(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators
        .pattern(/^\s*(\((\d{3})\)|(\d{3}))\s*[-\/.]?\s*(\d{3})\s*[-\/.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*\s*$/)(control);
  }

  static url(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern('https?://.+')(control);
  }

  static domainOnly(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/)(control);
  }

  static emailPrefixOnly(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern('[\\w\\+\\-\\.]+')(control);
  }

  static notEmptyString(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: 'Value is only whitespace' };
  }

  static makeAlwaysInvalidValidator(errorMessage: string) {
    return (_: AbstractControl) => ({ error: errorMessage });
  }

  static createStandardPasswordValidators() {
    return [
      Validators.required,
      SmartMovingValidators.validateMinLength,
      SmartMovingValidators.validatePatternWithCustomErrorKey(/^(?=.*[A-Z])/g, 'capitalCase'),
      SmartMovingValidators.validatePatternWithCustomErrorKey(/^(?=.*\d)/g, 'digits'),
      SmartMovingValidators.validateUniqueCharacter
    ];
  }

  private static validateUniqueCharacter(control: UntypedFormControl): ValidationErrors {
    const value = control.value || '';
    const text: string[] = value.split('');
    const uniqueCharacters = [];

    text.forEach(character => {
      if (!uniqueCharacters.includes(character)) {
        uniqueCharacters.push(character);
      }
    });

    return (uniqueCharacters.length >= 6) ? null : {
      uniqueCharacters: true
    };
  }

  private static validatePatternWithCustomErrorKey(pattern: RegExp, errorKey: string): ValidatorFn {
    return (control: UntypedFormControl): ValidationErrors => {
      const value = control.value || '';

      const errorObj = {};
      errorObj[errorKey] = true;
      return pattern.test(value) ? null : errorObj;
    };
  }

  private static validateMinLength(control: UntypedFormControl): ValidationErrors {
    return (control.value && control.value.length >= 8) ? null : {
      minlength: true
    };
  }

  static get moneyRegex() {
    return '(\\d+)?(\\.\\d{1,2})?';
  }

  static get extendedMoneyRegex() {
    return '(\\d+)?(\\.\\d{1,4})?';
  }

  static wholeNumber(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(/^\d+$/)(control);
  }

  static money(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(SmartMovingValidators.moneyRegex)(control);
  }

  static extendedMoney(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(SmartMovingValidators.extendedMoneyRegex)(control);
  }

  static salesTaxRate(control: AbstractControl) {
    return Validators.pattern(/^\d+(\.\d{1,3})?$/)(control);
  }

  static creditCardFee(control: AbstractControl) {
    return Validators.pattern(/^\d+(\.\d{1,3})?$/)(control);
  }

  static discountPercent(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern('\\d+(\\.\\d)?')(control);
  }

  // Allows 0.1234, blank, 0.3
  static discountPercentAs0To1(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(/^\d?(\.\d{0,4})?$/)(control);
  }

  static standardDecimal(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(/^\d+(\.\d{1,2})?$/)(control);
  }

  // TODO: Update normal discounts to have more precision, combine these two regex's, etc
  static extendedDiscountPercent(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(/^\d+(\.\d{1,2})?$/)(control);
  }

  static minSelected(min: number) {
    const validator: ValidatorFn = (array: UntypedFormArray) => {
      const selectedCount = array.controls?.filter(x => x.value === true)?.length;

      return selectedCount >= min ? null : { required: true };
    };

    return validator;
  }

  static usZipCode(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(SmartMovingValidators._usZipCodeRegex)(control);
  }

  private static _usZipCodeRegex = '\\d{5}(-\\d{4})?';

  static caPostalCode(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    return Validators.pattern(SmartMovingValidators._caPostalCodeRegex)(control);
  }

  private static _caPostalCodeRegex = '[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]';

  static usOrCaPostalCode(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return Validators.pattern(`(${SmartMovingValidators._usZipCodeRegex})|(${SmartMovingValidators._caPostalCodeRegex})`)(control);
  }

  static feetInches(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    // Works in conjunction with feet-inches.directive
    if (typeof (control.value) !== 'number') {
      return { feetInches: true };
    }

    return null;
  }

  /**
   * Can be used to construct conditional validation.  Note that this only works *if* you correctly update the target
   * control's validity when the parent control (or controls) changes.
   * ADAPTED FROM https://medium.com/ngx/3-ways-to-implement-conditional-validation-of-reactive-forms-c59ed6fc3325
   *
   * @param predicate
   * @param validator
   * @param errorNamespace optional argument that creates own namespace for the validation error
   */
  static conditionalValidator(predicate: () => boolean, validator: ValidatorFn, errorNamespace?: string): ValidatorFn {
    return (formControl => {
      if (!formControl.parent) {
        return null;
      }

      let error = null;

      if (predicate()) {
        error = validator(formControl);
      }

      if (errorNamespace && error) {
        const customError = {};
        customError[errorNamespace] = error;
        error = customError;
      }

      return error;
    });
  }
}
