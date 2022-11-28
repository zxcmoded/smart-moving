import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourOfDay'
})
export class HourOfDayPipe implements PipeTransform {

  transform(value: any, displayMode = 'full'): any {
    if (value == null) {
      return '';
    }

    if (isNaN(value)) {
      console.warn('Invalid value passed to hour of day pipe', value);
      return '';
    }

    if (value >= 24) {
      value -= 24;
    }

    const isAm = value < 12;

    const suffix = displayMode === 'full' ?
          (isAm ? 'am' : 'pm') :
          displayMode === 'short' ?
          (isAm ? 'a' : 'p') : '';

    if (value === 0) {
      return `12${suffix}`;
    }

    let hours = Math.floor(value);
    const minutes = Math.floor((value - hours) * 60);

    if (!isAm) {
      if (hours > 12) {
        hours = hours - 12;
      }
    }

    const minutesFormatted = minutes ? `:${minutes.toString().padStart(2, '0')}` : '';

    return `${hours}${minutesFormatted}${suffix}`;
  }

}
