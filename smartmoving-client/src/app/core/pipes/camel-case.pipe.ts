import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || typeof value !== 'string') {
      return value;
    }

    // Lovingly borrowed from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    const updatedValue = value.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/[^a-zA-Z ]/g, '');
    return updatedValue.substr(0, 1).toLowerCase() + updatedValue.substr(1);
  }

}
