import { Pipe, PipeTransform } from '@angular/core';

/*
This pipe expects a whole number in minutes.

showZeroAsDash
  If true, shows "--".
  If false, by default, will show "0h".
  If a string, example "m", it will append that instead, like "0m".
 */
@Pipe({
  name: 'daysHoursAndMinutes'
})
export class DaysHoursAndMinutesPipe implements PipeTransform {

  transform(value: any, showZeroAsDash: (boolean | string) = true, hideDays = false): any {

    if (isNaN(value) || !value) {
      return showZeroAsDash === true ? '--' :
          showZeroAsDash === false ? '0h' :
              `0${showZeroAsDash}`;
    }

    const days = Math.floor(value / 1440);
    let hours = Math.floor(value / 60);
    const minutes = Math.ceil(value - hours * 60);

    let transformedResult = '';

    if (days && !hideDays) {
      transformedResult += `${days}d `;

      hours -= days * 24;
    }

    if (hours) {
      transformedResult += `${hours}h `;
    }

    if (minutes) {
      transformedResult += `${minutes}m `;
    }

    return transformedResult.trim();
  }
}
