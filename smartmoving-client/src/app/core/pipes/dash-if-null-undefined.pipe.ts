import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'app/core/is-null-or-undefined';

@Pipe({
  name: 'dashIfNullUndefined'
})
export class DashIfNullUndefinedPipe implements PipeTransform {

  transform(value: any, replacement?: string): any {
    replacement = replacement ? replacement : '--';

    if (isNullOrUndefined(value)) {
      return replacement;
    }

    return value;
  }

}
