import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeBetter'
})
export class HumanizeBetterPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value || !value.toUpperCase) {
      return '';
    }

    // Handle acronyms
    if (value.toUpperCase() === value) {
      return value;
    }

    // Shamelessly stolen from SO: https://stackoverflow.com/a/35953318/32353.  This humanizes a string using various rules.
    const result = value
      .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([A-Z][a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([A-Z]+[a-z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, '$1 $2')
      .replace(/([a-z]+)([A-Z0-9]+)/g, '$1 $2')
      // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
      .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, '$1 $2')
      .replace(/([0-9])([A-Z][a-z]+)/g, '$1 $2')
      // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
      .replace(/([A-Z]{2,})([0-9]{2,})/g, '$1 $2')
      .replace(/([0-9]{2,})([A-Z]{2,})/g, '$1 $2')
      // Replace the literal ' And ' with a correctly-titalized version
      .replace(' And ', ' and ')
      .trim();

    // capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

}
