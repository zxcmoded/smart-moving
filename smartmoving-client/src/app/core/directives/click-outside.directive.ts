import { Directive, EventEmitter, Output, ElementRef, Renderer2, OnDestroy, Input, NgZone, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[smClickOutside]'
})
export class ClickOutsideDirective implements OnDestroy {
  unsubscribe: () => void;

  @Output('smClickOutside') click = new EventEmitter();

  @Input()
  smClickOutsideIgnoreElementByClass: string;

  @Input()
  smClickOutsideIgnoreElement: Element;

  constructor(
      private el: ElementRef,
      private renderer: Renderer2,
      private ngZone: NgZone,
      private changeDetectorRef: ChangeDetectorRef
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.unsubscribe = this.renderer.listen('document', 'click', e => this.outsideClickHandler(e));
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  private outsideClickHandler(event: MouseEvent) {

    if (!this.el || !this.el.nativeElement) {
      return;
    }

    if (this.smClickOutsideIgnoreElement) {
      if (event.target === this.smClickOutsideIgnoreElement) {
        return;
      }
    }

    if (this.smClickOutsideIgnoreElementByClass) {
      let target = event.target as Element;

      while (target != null) {
        if (target.classList.contains(this.smClickOutsideIgnoreElementByClass)) {
          return;
        }
        target = target.parentElement;
      }
    }

    if (!this.el.nativeElement.contains(event.target)) {
      try {
        this.click.emit();
        this.changeDetectorRef.detectChanges();
      } catch (err) {
        // Nothing to do, just ignore it.
      }
    }
  }
}
