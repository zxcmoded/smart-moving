import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {
  transform(value: string): any {

    if (!value) {
      return value;
    }

    const result = value.split(' ').reduce((acc, each) => acc + each.charAt(0), '');

    if (result.length > 3) {
      return result.substring(0, 3);
    }

    return result;
  }
}
