import { AfterViewChecked, Directive, ElementRef } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[smNgbTooltipEnableOnOverflow]'
})
export class NgbTooltipEnableOnOverflowDirective implements AfterViewChecked{

  constructor(
      private readonly elementRef: ElementRef,
      private readonly ngbTooltip: NgbTooltip
  ) {
  }

  ngAfterViewChecked() {
    const element = this.elementRef?.nativeElement as HTMLElement;

    if (!element || !this.ngbTooltip) {
      return;
    }

    const isDisabled = element.offsetWidth >= element.scrollWidth;

    if (this.ngbTooltip.disableTooltip === isDisabled) {
      return;
    }

    setTimeout(() => {
      this.ngbTooltip.disableTooltip = isDisabled;
    }, 0);
  }
}
