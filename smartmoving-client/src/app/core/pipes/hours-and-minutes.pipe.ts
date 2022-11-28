import { Pipe, PipeTransform } from '@angular/core';

export enum MinutesOrHours {
  Minutes,
  Hours
}

@Pipe({
  name: 'hoursAndMinutes'
})
export class HoursAndMinutesPipe implements PipeTransform {
  /*
  This pipe expects either
  * a decimal number in hours (ex: 5.5 is 5 hours 30 minutes (default))
    or
  * a number in minutes (ex: 330 is 5 hours 30 minutes)
  */
  transform(value: any, showZeroAsDash = false, minutesOrHours = MinutesOrHours.Hours): any {

    if (isNaN(value)) {
      console.warn('Invalid value passed to hours and minutes pipe', value);
      return;
    }

    if (!value && showZeroAsDash) {
      return '--';
    }

    let hours, minutes: number;

    if (minutesOrHours === MinutesOrHours.Hours) {
      hours = Math.floor(value);
      minutes = Math.floor((value - hours) * 60);
    } else {
      hours = Math.floor(value / 60);
      minutes = value % 60;
    }

    if (!minutes) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }

}
