import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceJoin'
})
export class SentenceJoinPipe implements PipeTransform {

  transform(input: any): any {

    if (!Array.isArray(input) || input.length === 0) {
      return input;
    }

    let joinedString: string;

    if(input.length === 1){
        joinedString = input[0];
    } else if(input.length > 1){
        joinedString = input.slice(0, -1).join(', ') + ' and ' + input.slice(-1);
    }

    return joinedString;
  }
}
