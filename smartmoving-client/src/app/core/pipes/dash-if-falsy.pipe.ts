import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashIfFalsy'
})
export class DashIfFalsyPipe implements PipeTransform {

  transform(value: any, replacement?: string): any {
    replacement = replacement ? replacement : '--';

    if (!value) {
      return replacement;
    }

    return value;
  }

}
