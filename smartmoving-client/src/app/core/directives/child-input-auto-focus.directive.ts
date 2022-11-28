import { AfterContentInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import * as moment from 'moment';
import { delayAsync } from 'app/core/delay-async.function';

@Directive({
  selector: '[smChildInputAutoFocus]'
})
export class ChildInputAutoFocusDirective implements AfterContentInit, OnInit, OnDestroy {
  @Input() setFocusEvent: EventEmitter<any>;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.setFocusEvent?.pipe(untilComponentDestroyed(this))
        .subscribe(_ => this.setAutoFocus());
  }

  ngAfterContentInit() {
    this.setAutoFocus();
  }

  private setAutoFocus() {
    //  Wait 50ms, then try to set the focus. If that fails, then try to set focus for up to 1 second.
    const now = moment();
    setTimeout(async () => {
      if (!this.trySetFocus()) {
        do {
          this.trySetFocus();

          // Wait 100ms so performance is not very impacted.
          await delayAsync(100);
        } while (!this.trySetFocus() && moment().diff(now, 'milliseconds') <= 1000);
      }
    }, 50);
  }

  private trySetFocus() {
    const element = this.elementRef.nativeElement.querySelector('input, select, textarea');

    if (element && element.focus) {
      if (!element.classList?.contains('dont-auto-focus')) {
        element.focus();
      }

      return true;
    }

    return false;
  }

  ngOnDestroy() {
  }
}
