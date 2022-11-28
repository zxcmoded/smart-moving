import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const dateMoment = moment(value);

    if (!dateMoment.isValid()) {
      console.warn('Invalid value passed to time ago pipe', value);
      return 'n/a';
    }

    const now = moment();

    const daysDiff = now.diff(dateMoment, 'd');

    if (daysDiff > 2) {
      return dateMoment.format('l');
    }

    let result = dateMoment.fromNow();

    if (result === 'a day ago') {
      result = 'Yesterday';
    }

    return result;
  }

}
