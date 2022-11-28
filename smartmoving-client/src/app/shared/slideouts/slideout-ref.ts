import { SlideoutPanelComponent } from './slideout-panel/slideout-panel.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';
import { SlideoutWithCustomDismissedResult } from 'app/shared/slideouts/slideout-with-custom-dismissed-result';

export class SlideoutRef<T> {

  private closePromiseResolver: (value?: any) => void;
  private readonly closePromise: Promise<any>;

  public disableBackdropClick = false;

  public component: T;
  disableClose = new EventEmitter<boolean>();

  constructor(private readonly slideoutPanelComponent: SlideoutPanelComponent,
              private readonly overlayRef: OverlayRef) {
    this.setupSubscriptions();
    this.closePromise = new Promise<any>(resolver => this.closePromiseResolver = resolver);
  }

  private setupSubscriptions() {
    this.overlayRef.backdropClick().subscribe(_ => {
      if (!this.disableBackdropClick && !this.slideoutPanelComponent.disableClose) {
        const result = (this.component as unknown as SlideoutWithCustomDismissedResult)?.getSlideoutDismissedResult?.() ?? undefined;
        this.close(result);
      }
    });

    this.slideoutPanelComponent.closing().subscribe(() => {
      this.overlayRef.detachBackdrop();
    });

    this.slideoutPanelComponent.closed().subscribe(() => {
      const result = (this.component as unknown as SlideoutWithCustomDismissedResult)?.getSlideoutDismissedResult?.() ?? undefined;
      this.overlayRef.dispose();
      this.closePromiseResolver(result);
    });

    this.disableClose.subscribe(disableClose => {
      this.slideoutPanelComponent.disableClose = disableClose;
    });
  }

  close(result: any = null) {
    this.slideoutPanelComponent.close();
    this.closePromiseResolver(result);
  }

  closed(): Promise<any> {
    return this.closePromise;
  }

  setAdditionalContainerClasses(classes: string) {
    this.slideoutPanelComponent.additionalContainerClasses = classes;
  }

  setTitle(title: string) {
    this.slideoutPanelComponent.title = title;
  }

  showBackButton(show: boolean, callback: () => any = null) {
    this.slideoutPanelComponent.showBackButton = show;
    this.slideoutPanelComponent.backButtonCallback = callback;
  }
}
