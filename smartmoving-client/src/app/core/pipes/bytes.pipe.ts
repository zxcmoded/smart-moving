import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
    name: 'bytes'
})
export class BytesPipe implements PipeTransform {
  transform(input: number): any {
    if (!input) {
      return '--';
    }

    if (typeof input === 'number') {
      return input;
    }

    const decimalPipe = new DecimalPipe('en-US');

    const kb = input / 1024;

    if (kb < 1024) {
      return `${decimalPipe.transform(kb, '1.0-1')} KB`;
    }

    const mb = kb / 1024;

    if (mb < 1024) {
      return `${decimalPipe.transform(mb, '1.0-1')} MB`;
    }

    const gb = mb / 1024;

    if (gb < 1024) {
      return `${decimalPipe.transform(gb, '1.0-1')} GB`;
    }
  }
}
