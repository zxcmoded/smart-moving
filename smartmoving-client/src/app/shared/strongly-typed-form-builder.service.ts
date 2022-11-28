import { Injectable, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, ValidatorFn, AbstractControlOptions, UntypedFormGroup, AsyncValidatorFn } from '@angular/forms';
import { nameof } from 'app/core/nameof';
import { SmartMovingValidators } from 'app/core/SmartMovingValidators';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';

export type ValidatorConfigExpression<T> = (config: ValidatorBuilder<T>) => void;

export class ValidatorBuilder<T> {
  validators: ValidatorFn[] = [];

  // Helper for building up a reusable config expression in a strongly-typed way.
  static buildConfigExpressionFor<TConfig>(validatorConfig: ValidatorConfigExpression<TConfig>) {
    return validatorConfig;
  }

  constructor(
      // The validator will need access to the form value at runtime, but the form doesn't exist yet.  This will
      // lazily resolve to the form's value at runtime.
      private readonly formValueAccessor: () => T
  ) {
  }

  conditional(predicate: (x: T) => boolean, ...validators: ValidatorFn[]) {
    const wrappedPredicate = () => predicate(this.formValueAccessor());

    validators.forEach(validator => this.validators.push(SmartMovingValidators.conditionalValidator(wrappedPredicate, validator)));
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class StronglyTypedGroupBuilder<T extends object> {
  private finalForm: UntypedFormGroup;
  private controls: { [key: string]: any } = {};
  private isConditionalValidationEnabled: boolean;
  private parent: OnDestroy;

  constructor(private readonly formBuilder: UntypedFormBuilder,
              private readonly stronglyTypedBuilder: StronglyTypedFormBuilderService) {
  }

  forIf(condition: boolean, name: ((obj: T) => any) | (new (...params: any[]) => T), options: any, validatorConfig: ValidatorConfigExpression<T> = null) {
    if (!condition) {
      return this;
    }

    return this.for(name, options, validatorConfig);
  }

  for(name: ((obj: T) => any) | (new (...params: any[]) => T), options: any, validatorConfig: ValidatorConfigExpression<T> = null) {

    options = options ?? [null];

    this.controls[nameof(name)] = options;

    if (validatorConfig) {
      const builder = new ValidatorBuilder(() => this.finalForm.value);
      validatorConfig(builder);
      // Make sure there is a spot for validators to go in the options
      options[1] = options[1] ?? [];

      if (!options[1].push) {
        console.error('StronglyTypedGroupBuilder used incorrectly, unable to add validator.');
      } else {
        options[1].push(...builder.validators);
      }
    }

    return this;
  }

  forEmptyArray(name: ((obj: T) => any) | (new (...params: any[]) => T)) {
    this.controls[nameof(name)] = this.formBuilder.array([]);
    return this;
  }

  forManual(name: string, options: any, validatorConfig: ValidatorConfigExpression<T> = null) {
    this.controls[name] = options;

    if (validatorConfig) {
      const builder = new ValidatorBuilder(() => this.finalForm.value);
      validatorConfig(builder);
      // Make sure there is a spot for validators to go in the options
      options[1] = options[1] ?? [];

      if (!options[1].push) {
        console.error('StronglyTypedGroupBuilder used incorrectly, unable to add validator.');
      } else {
        options[1].push(...builder.validators);
      }
    }

    return this;
  }

  forArrayManual(name: string, array: any[], options: any[] = null) {
    options = options ?? [null];

    this.controls[name] = this.formBuilder.array(array, options);
    return this;
  }

  forControl(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null) {
    return this.formBuilder.control(formState, validatorOrOpts);
  }

  enableConditionalValidation(parent: OnDestroy) {
    this.isConditionalValidationEnabled = true;
    this.parent = parent;

    return this;
  }

  build(options = null) {
    this.finalForm = this.formBuilder.group(this.controls, options);

    if (this.isConditionalValidationEnabled) {
      this.finalForm.valueChanges
          .pipe(untilComponentDestroyed(this.parent))
          .subscribe(() => this.updateControlValidity());
    }

    return this.finalForm;
  }

  updateControlValidity() {
    for (const controlName in this.finalForm.controls) {
      if (this.finalForm.controls.hasOwnProperty(controlName)) {
        const control = this.finalForm.controls[controlName];
        control.updateValueAndValidity({ emitEvent: false });
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class StronglyTypedFormBuilderService {
  constructor(private readonly formBuilder: UntypedFormBuilder) {
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  group<T extends object>() {
    return new StronglyTypedGroupBuilder<T>(this.formBuilder, this);
  }

  control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    return this.formBuilder.control(formState, validatorOrOpts, asyncValidator);
  }
}

