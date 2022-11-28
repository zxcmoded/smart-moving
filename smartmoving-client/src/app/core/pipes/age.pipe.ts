import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const dateMoment = moment(value);

    if (!dateMoment.isValid()) {
      console.warn('Invalid value passed to age pipe', value);
      return 'n/a';
    }
    return dateMoment.toNow(true);
  }

}
