import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[smStopClickPropagation]'
})
export class StopClickPropagationDirective {
  @Input() smStopClickPropagation: boolean;
  @Input() preventDefault = false;

  constructor() { }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent) {
    if (this.smStopClickPropagation === false) {
      return;
    }

    event.stopPropagation();

    if (this.preventDefault) {
      event.preventDefault();
    }
  }
}
