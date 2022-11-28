import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeOfDay'
})
export class TimeOfDayPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value === null) {
      return '';
    }

    const parts = value.split(':');

    if (parts.length < 2 || parts.length > 3) {
      console.warn('Invalid value passed to time of day pipe', value);
      return '';
    }

    let hour = parseInt(parts[0]);
    const minute = parseInt(parts[1]);

    if (isNaN(hour) || isNaN(minute)) {
      console.warn('Invalid value passed to time of day pipe', value);
      return '';
    }

    const suffix = hour >= 12 ? 'pm' : 'am';

    if (hour > 12) {
      hour = hour - 12;
    } else if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute.toString().padStart(2, '0')} ${suffix}`;
  }

}
