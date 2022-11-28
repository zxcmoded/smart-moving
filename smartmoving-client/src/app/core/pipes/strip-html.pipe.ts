import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return '';
    }

    return value
    .replace(/<.*?>/g, ' ') // replace tags
    .replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});/ig, ' '); // replace HTML entities
  }
}
