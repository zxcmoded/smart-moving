import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'smHighPrecisionCurrency'
})
export class SmHighPrecisionCurrencyPipe implements PipeTransform {

  transform(value: any, showZeroAmount: boolean = false): any {

    if (value == null) {
      return '--';
    }

    if (isNaN(value)) {
      console.warn('Invalid value passed to smHighPrecisionCurrency pipe', value);
      return '--';
    }

    if (value === 0 && !showZeroAmount || !value && value !== 0) {
      return '--';
    }

    const currencyPipe = new CurrencyPipe('en-US');

    return currencyPipe.transform(value, 'USD', 'symbol', '1.2-4');
  }
}
