import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';

@Pipe({
  name: 'smPercent'
})
export class SmPercentPipe implements PipeTransform {

  transform(value: any, digits?: string, parenthesisNegatives = false): any {
    if (value == null) {
      return '--';
    }

    if (isNaN(value)) {
      console.warn('Invalid value passed to smPercent pipe', value);
      return value;
    }

    if (!value) {
      return '--';
    }

    const percentPipe = new PercentPipe('en-US');

    if (parenthesisNegatives && value < 0) {
      return `(${percentPipe.transform(value * -1, digits)})`;
    }

    return percentPipe.transform(value, digits);
  }

}
