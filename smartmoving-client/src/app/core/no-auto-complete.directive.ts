import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[smNoAutoComplete]'
})
export class NoAutoCompleteDirective implements OnInit {

  constructor(
      private element: ElementRef
  ) {
  }


  ngOnInit() {
    try {
      if (!this.element || !this.element.nativeElement) {
        return;
      }

      if (this.isChrome()) {
        this.disableAutoCompleteForChrome();
      } else {
        this.disableAutoCompleteForCompliantBrowsers();
      }

    } catch (err) {
      console.error('Unable to disable autocomplete', err);
    }
  }

  private disableAutoCompleteForCompliantBrowsers() {
    const rawElement: HTMLElement = this.element.nativeElement;
    rawElement.setAttribute('autocomplete', 'off');
  }

  private disableAutoCompleteForChrome() {
    const rawElement: HTMLElement = this.element.nativeElement;
    const idAttr = rawElement.id;

    // This will find a label that's just next to it (like our old HTML layout), or the new layout when it's a level up.
    const label = idAttr && rawElement.parentElement ? rawElement.parentElement.parentElement.querySelector(`[for="${idAttr}"]`) : null;
    const randomId = 'id' + Math.random().toString(36).substring(2);

    rawElement.id = randomId;
    rawElement.setAttribute('autocomplete', `sm-auto-${randomId}`);

    if (label) {
      label.setAttribute('for', randomId);
    }
  }

  private isChrome() {
    return !!(window as any).chrome;
  }

}
