import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[select2]'
})
export class Select2Directive implements AfterViewInit {

  @Input()
  placeholder: string;

  @Input('class')
  cssClass: string;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    $(this.el.nativeElement).select2({
      placeholder: this.placeholder,
      containerCssClass: this.cssClass,
      width: '100%'
    });
  }
}
