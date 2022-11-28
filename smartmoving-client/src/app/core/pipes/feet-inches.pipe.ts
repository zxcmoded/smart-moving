import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smFeetInches'
})
export class FeetInchesPipe implements PipeTransform {

  transform(valueInInches: number): any {
    if (!valueInInches || typeof(valueInInches) !== 'number') {
      return valueInInches;
    }

    const feet = Math.floor(valueInInches / 12);
    const remainingInches = valueInInches - feet * 12;

    const feetString = feet > 0 ? `${feet}'` : '';
    const inchesString = remainingInches > 0 ? `${remainingInches}"` : '';

    return [feetString, inchesString].filter(x => x.length).join(' ');
  }
}
