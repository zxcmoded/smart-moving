import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[smEnsureHttpPrefix]'
})
export class EnsureHttpPrefixDirective {

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {
  }

  @HostListener('change', ['$event']) onEvent($event) {
    const rawValue = this.el.nativeElement.value;

    if (!rawValue || typeof(rawValue) !== 'string') {
      return;
    }

    if (!rawValue.startsWith('http')) {
      this.control.control.setValue(`http://${rawValue}`);
    }
  }
}
