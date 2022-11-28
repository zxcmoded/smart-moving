import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'smNumber'
})
export class SmNumberPipe implements PipeTransform {

  transform(value: any, digitsInfo?: string, showZero = false): any {
    if (value == null) {
      return '--';
    }

    if (isNaN(value)) {
      console.warn('Invalid value passed to smNumber pipe', value);
      return value;
    }

    if (!value && !showZero) {
      return '--';
    }

    const decimalPipe = new DecimalPipe('en-US');

    return decimalPipe.transform(value, digitsInfo);
  }

}
