import { AbstractControl, UntypedFormArray } from '@angular/forms';

export const asFormArray = (control: AbstractControl): UntypedFormArray => control as UntypedFormArray;
