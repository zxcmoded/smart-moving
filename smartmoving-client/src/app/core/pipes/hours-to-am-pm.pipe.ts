import { Pipe, PipeTransform } from '@angular/core';
import { round } from 'app/core/round-number';

@Pipe({
  name: 'hoursToAmPm'
})
export class HoursToAmPmPipe implements PipeTransform {

  transform(value: any, short = false): any {
    const am = short ? 'a' : 'AM';
    const pm = short ? 'p' : 'PM';
    const zeroth = short ? '' : '00';
    const space = short ? '' : ' ';

    if (value >= 0 && value !== null) {
      const time = value.toString();
      let hour = time.split('.')[0];
      let min = Number.parseFloat('.' + time.split('.')[1]);

      const ampm = hour >= 12 ? pm : am;
      min = min ? round(60 * min, 0) : 0;

      hour = hour > 12 ? hour - 12 : (hour <= 0) ? 12 : hour;

      let timeFormat = `${hour}`;

      if (min || zeroth) {
        timeFormat += ':';

        timeFormat += `${min === 0 ? zeroth : (min < 10 ? ('0' + min) : min)}`;
      }

      timeFormat += `${space}${ampm}`;

      return timeFormat;
    }
  }

}
