import { Pipe, PipeTransform } from '@angular/core';

// Borrowed from: https://stackoverflow.com/a/46455994/32353

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {

    if (!value || !value.substr) {
      return value;
    }

    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}
