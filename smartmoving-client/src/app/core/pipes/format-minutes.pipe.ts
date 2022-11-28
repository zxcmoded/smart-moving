import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMinutes'
})
export class FormatMinutesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (isNaN(value)) {
      console.warn('Invalid value passed to format minutes pipe', value);
      return;
    }

    const hours = Math.floor(value / 60);
    const minutes = value - hours * 60;

    if (!minutes) {
      return `${hours}h`;
    }

    if (!hours) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }
}
