import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value || !value.toUpperCase) {
      return '';
    }

    // Handle acronyms
    if (value.toUpperCase() === value) {
      return value;
    }

    return value.charAt(0).toUpperCase() + value.substr(1).replace(/[A-Z](?![()/])|\d+/g, ' $&').replace('Smart Moving', 'SmartMoving');
  }

}
