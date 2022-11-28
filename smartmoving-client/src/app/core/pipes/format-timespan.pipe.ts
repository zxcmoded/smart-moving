import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimespan'
})
export class FormatTimespanPipe implements PipeTransform {

  transform(value: string): unknown {
    if (!value?.indexOf) {
      return;
    }

    const [hours, minutes, seconds] = value.split(':').map(x => parseInt(x));

    let result = ``;

    if (hours) {
      result += `${hours}h `;
    }

    result += `${minutes}m `;

    if (!hours) {
      result += `${seconds}s`;
    }

    return result;
  }

}
