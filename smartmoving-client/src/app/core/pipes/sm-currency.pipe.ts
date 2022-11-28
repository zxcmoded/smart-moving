import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'smCurrency'
})
export class SmCurrencyPipe implements PipeTransform {

  transform(value: any, showCents = true, digitsInfo = null, parenthesisNegatives = false, showZero = false): any {

    if (value === null || value === undefined) {
      return '--';
    }

    if (isNaN(value)) {
      console.warn('Invalid value passed to smCurrency pipe', value);
      return '--';
    }

    if (!value && !showZero) {
      return '--';
    }

    const currencyPipe = new CurrencyPipe('en-US');

    const digits = showCents ? undefined : '1.0-0';

    if (parenthesisNegatives && value < 0) {
      return `(${currencyPipe.transform(value * -1, 'USD', 'symbol', digitsInfo || digits)})`;
    }

    return currencyPipe.transform(value, 'USD', 'symbol', digitsInfo || digits);
  }
}
