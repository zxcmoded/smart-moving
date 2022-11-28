import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceText'
})
export class ReplaceTextPipe implements PipeTransform {
  transform(value: string, textToReplace: string, replaceWith = ''): any {
    if (!value || !value.toUpperCase) {
      return '';
    }

    if (!textToReplace || !textToReplace.toUpperCase) {
      return value;
    }

    return value.replace(textToReplace, replaceWith);
  }
}
