import { Directive, ElementRef, AfterContentInit, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[smAutoGrow]'
})
export class AutoGrowDirective implements AfterContentInit, OnChanges {
  @Input() autoGrowMaxHeight = 250;
  @Input() autoGrowMinHeight = 0;
  @Input() autoGrowValue: any;
  @Input('smAutoGrow') isEnabled;

  constructor(
    private element: ElementRef
  ) {
  }

  ngAfterContentInit() {

  }

  ngOnChanges(changes) {
    if (changes.autoGrowValue && this.isEnabled !== false) {
      this.resize();
    }
  }

  private resize() {
    setTimeout(() => {
      const el = this.element.nativeElement;
      el.style.height = 'auto';
      el.style.overflow = 'hidden';
      const neededHeight = el.scrollHeight;
      const minHeight = this.autoGrowMinHeight;
      const maxHeight = this.autoGrowMaxHeight;

      // console.log('Min height and max height: ', minHeight, maxHeight);

      let height = minHeight;

      // console.log('Needed: ', neededHeight);

      if (neededHeight > minHeight) {
        height = neededHeight;
        // console.log('Setting needed height because it is greater than min: ', height);
      }
      // console.log('Height is now ', height);
      if (height > maxHeight) {
        height = maxHeight;
        // console.log('capping to max height: ', height);
        el.style.overflow = 'auto';
      }

      // console.log('Setting height: ', height);

      el.style.height = height + 'px';

    }, 0);
  }
}
