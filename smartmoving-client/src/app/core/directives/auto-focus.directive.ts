import { Directive, AfterContentInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[smAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() smAutoFocus = true;

  constructor(
      private elementRef: ElementRef
  ) {
  }

  ngAfterContentInit() {
    //  Wait 50ms, then try to set the focus. If that fails, wait another second, then try again.
    setTimeout(() => {
      // If the directive is not set to a value, the input is actually treated as empty string. Great. Sweet. Love it. Glad that's what it does.
      if (this.smAutoFocus !== false) {
        this.smAutoFocus = true;
      }
      if (this.smAutoFocus && !this.trySetFocus()) {
        setTimeout(() => this.trySetFocus(), 1000);
      }
    }, 50);
  }

  private trySetFocus() {
    try {
      this.elementRef?.nativeElement?.focus?.();
      this.elementRef?.nativeElement?.select?.();
    } catch (err) {
      console.error(err);
    }

    return this.elementRef?.nativeElement?.focus || this.elementRef?.nativeElement?.select;
  }
}
