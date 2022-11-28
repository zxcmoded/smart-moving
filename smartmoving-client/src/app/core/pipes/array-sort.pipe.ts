import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'app/core/is-null-or-undefined';

/*
Usage: *ngFor="let bar of foo | arraySort:'+id'"

Sorts by a single property. + means ascending, - means descending.
*/
@Pipe({
  name: 'arraySort'
})
export class ArraySortPipe implements PipeTransform {
  transform<T>(array: Array<T>, args: string): Array<T> {
    if (!args || typeof args[0] === 'undefined' || !args[0]) {
      return array;
    }

    const direction = args[0][0];
    const column = args.slice(1);

    array.sort((aIn: any, bIn: any) => {
      let left, right, a, b;

      if (column.indexOf('.') > 0) {
        const colParts = column.split('.');

        if (isNullOrUndefined(aIn[colParts[0]])) {
          a = aIn[colParts[0]];
        } else {
          a = aIn[colParts[0]][colParts[1]];
        }

        if (isNullOrUndefined(bIn[colParts[0]])) {
          b = bIn[colParts[0]];
        } else {
          b = bIn[colParts[0]][colParts[1]];
        }
      } else {
        a = aIn[column];
        b = bIn[column];
      }

      if (isNullOrUndefined(a) && isNullOrUndefined(b)) {
        return 0;
      }

      if (isNullOrUndefined(a)) {
        return (direction === '-') ? 1 : -1;
      }

      if (isNullOrUndefined(b)) {
        return (direction === '-') ? -1 : 1;
      }

      if (typeof a === 'number') {
        left = a;
        right = b;

        return (direction === '-') ? right - left : left - right;
      }

      if (typeof a === 'boolean') {
        left = a;
        right = b;

        return (left === right ? 0 : left === true ? -1 : 1) * (direction === '-' ? -1 : 1);
      }

      left = (a.toLowerCase && a.toLowerCase()) || '';
      right = (b.toLowerCase && b.toLowerCase()) || '';

      return (left < right ? -1 : 1) * (direction === '-' ? -1 : 1);
    });

    return array;
  }

}
