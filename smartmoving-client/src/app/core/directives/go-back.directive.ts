import { Directive, HostListener, HostBinding } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[smGoBack]'
})
export class GoBackDirective {
  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.stopPropagation();
    this.location.back();
  }

  constructor(
    private location: Location
  ) { }
}
