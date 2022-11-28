import { Directive, Input, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { delayAsync } from '../delay-async.function';

// This directive allows you to programatically scroll to a specific element when the element is initialized.
// Usage: <div [smScrollIntoView]="someBooleanExpression">...</div>
// Additionally, you can fire an event with a scrollTargetId and that will force scrolling (great for click handlers)
// Usage (target):       <div smScrollIntoView [scrollEvent]="scrollToEvent" [scrollTargetId]="targetId">...</div>
// Usage (source):       <div (click)="scrollToEvent.emit(targetId)"> ...</div>
@Directive({
  selector: '[smScrollIntoView]'
})
export class ScrollIntoViewDirective implements OnInit, OnChanges, OnDestroy {

  @Input('smScrollIntoView') enabled: boolean;

  // the current id that the directive is tied to
  @Input() scrollTargetInstanceId: string;
  // the id that we are trying to scroll to
  @Input() scrollTargetId: string;

  @Input() fullPageScroll = false;
  @Input() extraOffset = 0;

  constructor(private readonly el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollTargetInstanceId && changes?.scrollTargetId?.currentValue === this.scrollTargetInstanceId) {
      this.scroll();
    }
  }

  async ngOnInit() {
    if (!this.enabled) {
      return;
    }

    await delayAsync(10);

    this.scroll();
  }

  ngOnDestroy() {
  }

  private scroll() {
    const element = this.el?.nativeElement as HTMLElement;

    if (this.fullPageScroll) {
      document.scrollingElement.scrollTop = (element.offsetParent as HTMLElement).offsetTop + this.extraOffset;
    } else if (element?.parentElement) {
      element.parentElement.scrollTop = element.offsetTop - element.parentElement.offsetTop;
    }
  }
}
