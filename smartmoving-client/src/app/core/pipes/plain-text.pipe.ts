import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plainText'
})
export class PlainTextPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) {
      return '';
    }

    return value.replace(/<.*?>/g, '')
                .replace(/&nbsp;/g, ' ');
  }

}
