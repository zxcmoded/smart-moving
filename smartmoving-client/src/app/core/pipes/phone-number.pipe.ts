import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, displayMode?: 'noParens', args?: any): any {
    if (!value || !value.substr) {
      return value;
    }

    if (value.startsWith('+1')) {
      value = value.substr(2);
    }

    value = value.trim();

    const parts = value.split(/(?:([eE][xX][tT])|[xX])/g);

    const phonePart = parts[0].trim().replace(/\D/g, '');
    const extensionPart = parts.length > 1 ? ` ext ${parts[parts.length - 1].trim()}` : '';

    if (phonePart.length !== 10) {
      return value;
    }

    let areaCodeComponent;

    if (displayMode === 'noParens') {
      areaCodeComponent = `${phonePart.substr(0, 3)}-`;
    } else {
      areaCodeComponent = `(${phonePart.substr(0, 3)}) `;
    }

    return `${areaCodeComponent}${phonePart.substr(3, 3)}-${phonePart.substr(6, 4)}${extensionPart}`;
  }
}
