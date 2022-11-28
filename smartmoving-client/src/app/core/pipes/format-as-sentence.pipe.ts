import { Pipe, PipeTransform } from '@angular/core';

// this pipe is useful when you want a consistent formatting out of a message but you aren't necessarily in control of it
// will uppercase first char and guarantee punctuation at end
@Pipe({
  name: 'formatAsSentence'
})
export class FormatAsSentencePipe implements PipeTransform {

  transform(value: string): string {

    if (!value) {
      return value;
    }

    return this.formatAsSentence(value);
  }

  private formatAsSentence = (target: string) => {
    const upper = target.charAt(0).toUpperCase() + target.slice(1);
    if (upper.endsWith('!') || upper.endsWith('.') || upper.endsWith('?')) {
      return upper;
    } else {
      return upper + '.';
    }
  };
}
