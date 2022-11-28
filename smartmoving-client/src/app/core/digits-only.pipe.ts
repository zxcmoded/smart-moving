import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitsOnly'
})
export class DigitsOnlyPipe implements PipeTransform {

  transform(value: any) {

    if (!value || !value.replace) {
      return '';
    }

    return value.replace(/\D/g, '');
  }
}
