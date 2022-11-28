import { Directive, ElementRef, Input, AfterViewChecked } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[smRequiredLabels]'
})
export class RequiredLabelsDirective implements AfterViewChecked {
  @Input() smRequiredLabels: UntypedFormGroup;

  constructor(
      private elementRef: ElementRef
  ) {
  }

  ngAfterViewChecked() {
    const form: HTMLElement = this.elementRef.nativeElement;

    const inputs = form.getElementsByTagName('input');
    const selects = form.getElementsByTagName('select');
    const customSelects = [...Array.prototype.slice.call(form.getElementsByTagName('sm-select-control'), 0)];

    const combined: HTMLInputElement[] | HTMLSelectElement[] = [
      ...Array.prototype.slice.call(inputs, 0),
      ...Array.prototype.slice.call(selects, 0)
    ];

    const requiredFields = this.getRequiredFields(this.smRequiredLabels);

    // First adjust normal things
    for (const input of combined) {
      if (input.type === 'radio' || !input.labels) {
        continue;
      }

      const labels = [] as HTMLLabelElement[];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let labelIndex = 0; labelIndex < input.labels.length; labelIndex++) {
        labels.push(input.labels[labelIndex]);
      }

      const isRequired = input.required ||
          requiredFields.some(x => x === input.id) ||
          requiredFields.some(x => x === input.getAttribute('formcontrolname'));

      this.adjustLabels(labels, isRequired);
    }

    // Then adjust the funky controls wrapping ng-select
    for (const customSelect of customSelects) {
      const labels = [] as HTMLLabelElement[];

      // Get the nested real input element
      const realInput = customSelect.getElementsByTagName('input')[0];

      // The input id gets mangled because Chrome sucks hard, so this is why we have to dig deeper
      // to find the real labels
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let labelIndex = 0; labelIndex < realInput.labels.length; labelIndex++) {
        labels.push(realInput.labels[labelIndex]);
      }

      // The first condition should be the one hit every time, then it'll short-circuit.
      // Just including the others to be safe.
      const isRequired = requiredFields.some(x => x === customSelect.getAttribute('formcontrolname')) ||
          realInput.required ||
          requiredFields.some(x => x === realInput.id) ||
          requiredFields.some(x => x === realInput.getAttribute('formcontrolname'));

      this.adjustLabels(labels, isRequired);
    }
  }

  private adjustLabels(labels: HTMLLabelElement[], isRequired: boolean) {
    labels.forEach(label => {
      if (isRequired && !label.innerText.endsWith('*') && label.className !== 'form-toggle-label') {
        const newNode = document.createElement('text');
        newNode.textContent = ' *';
        label.appendChild(newNode);
      } else if (!isRequired && label.innerText.endsWith(' *')) {
        label.innerText = label.innerText.replace(' *', '');
      }
    });
  }

  getRequiredFields(formGroup: UntypedFormGroup) {
    return Object.keys(formGroup.controls).reduce((previous, current) => {
      if (formGroup.controls[current] && formGroup.controls[current]['controls']) {
        const groupControls = this.getRequiredFields(formGroup.controls[current] as UntypedFormGroup).map(x => `${current}.${x}`);
        previous.push(...groupControls);
        return previous;
      }

      if (!formGroup.controls[current]?.validator) {
        return previous;
      }

      const validatorTest = formGroup.controls[current].validator({} as AbstractControl);

      if (validatorTest && validatorTest.required) {
        previous.push(current);
      }

      return previous;
    }, [] as string[]);
  }
}
