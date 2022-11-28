import { Injectable, InjectionToken, Injector, TemplateRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import { SlideoutPanelComponent } from './slideout-panel/slideout-panel.component';
import { SlideoutRef } from './slideout-ref';
import { SlideoutOptions } from './slideout-options';

export const OverlayParams = new InjectionToken<unknown>('OVERLAYPARAMS');

@Injectable({
  providedIn: 'root'
})
export class SlideoutService {
  private activeSlideoutRef: SlideoutRef<any>;
  private activeSlideoutComponent: SlideoutPanelComponent;
  private lastPortal: TemplatePortal | ComponentPortal<any>;

  constructor(private readonly overlay: Overlay,
              private readonly injector: Injector) {
  }

  openSlideouts: OverlayRef[] = [];

  open<T>(
      title: string,
      componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
      params: any = {},
      options: Partial<SlideoutOptions> = {}): SlideoutRef<T> {

    const overlayRef = this.createOverlay(options);

    this.openSlideouts.push(overlayRef);

    const slideoutPanelComponent = this.createSlideoutPanel(overlayRef);
    slideoutPanelComponent.title = title;
    slideoutPanelComponent.popoutOptions = options.popoutOptions;
    slideoutPanelComponent.noPadding = options.noPadding;

    const slideoutRef = new SlideoutRef<T>(slideoutPanelComponent, overlayRef);

    this.applyOptionsToSlideout(options, slideoutRef);

    const componentRefOrNull = this.attachContent(slideoutRef, slideoutPanelComponent, componentOrTemplateRef, params);

    if (componentRefOrNull) {
      slideoutRef.component = componentRefOrNull.instance;

      if (componentRefOrNull.instance['hideCloseButton']) {
        slideoutPanelComponent.showCloseButton = false;
      }
    }

    slideoutRef.closed().then(_ => {
      const index = this.openSlideouts.findIndex(x => x === overlayRef);
      if (index < 0 || index > this.openSlideouts.length) {
        return;
      }
      this.openSlideouts.splice(index, 1);
    });

    slideoutPanelComponent.closed().subscribe(_ => {
      const index = this.openSlideouts.findIndex(x => x === overlayRef);
      if (index < 0 || index > this.openSlideouts.length) {
        return;
      }
      this.openSlideouts.splice(index, 1);
    });

    this.activeSlideoutRef = slideoutRef;
    this.activeSlideoutComponent = slideoutPanelComponent;

    return slideoutRef;
  }

  changeTo<T>(
      title: string,
      componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
      params: any = {},
      options: Partial<SlideoutOptions> = {}): SlideoutRef<T> {

    if (!this.openSlideouts.length) {
      throw Error('No active slideout to change to, you should open a slideout instead.');
    }

    const slideoutPanelComponent = this.activeSlideoutComponent;
    slideoutPanelComponent.title = title;
    slideoutPanelComponent.popoutOptions = options.popoutOptions;
    slideoutPanelComponent.noPadding = options.noPadding;

    const slideoutRef = this.activeSlideoutRef;

    // Always clear out the back button status.  The new component can set it if it wants.
    slideoutRef.showBackButton(false);

    this.applyOptionsToSlideout(options, slideoutRef);

    if (options.width) {
      this.openSlideouts[0].updateSize({
        width: options.width
      });
    }

    this.lastPortal.detach();
    const componentRefOrNull = this.attachContent(slideoutRef, slideoutPanelComponent, componentOrTemplateRef, params);

    if (componentRefOrNull) {
      slideoutRef.component = componentRefOrNull.instance;
      slideoutPanelComponent.showCloseButton = !componentRefOrNull.instance['hideCloseButton'];
    }

    slideoutPanelComponent.setAutoFocus();
    return slideoutRef;
  }

  private applyOptionsToSlideout = (options: Partial<SlideoutOptions>, slideoutRef: SlideoutRef<any>) => {
    slideoutRef.disableBackdropClick = !!options.disableBackdropClick;
    slideoutRef.setAdditionalContainerClasses(options.additionalContainerClasses ?? '');
  };

  private createSlideoutPanel = (overlayRef: OverlayRef) => {
    const portal = new ComponentPortal(SlideoutPanelComponent);

    const slideoutRef = overlayRef.attach<SlideoutPanelComponent>(portal);

    return slideoutRef.instance;
  };

  private attachContent<T>(
      slideoutRef: SlideoutRef<T>,
      slideoutPanelComponent: SlideoutPanelComponent,
      componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
      params: any) {

    if (componentOrTemplateRef instanceof TemplateRef) {
      this.lastPortal = new TemplatePortal(componentOrTemplateRef, null);
      slideoutPanelComponent.attachTemplate(this.lastPortal);
    } else {
      const injector = this.createInjector(slideoutRef, params);
      this.lastPortal = new ComponentPortal(componentOrTemplateRef, undefined, injector);
      return slideoutPanelComponent.attachComponent(this.lastPortal);
    }
  }

  private createInjector(slideoutRef: SlideoutRef<any>, params) {
    const injectionTokens = new WeakMap<any, any>([
      [SlideoutRef, slideoutRef], [OverlayParams, params]
    ]);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private createOverlay(options: Partial<SlideoutOptions> = null) {

    const defaultOptions: SlideoutOptions = {
      width: '525px',
      height: '100%',
      backdropClass: 'slideout-backdrop',
      panelClass: 'slideout-panel',
    };

    const positionStrategy = this.overlay.position()
        .global()
        .right()
        .top();

    const overlayParams = {
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
      ...defaultOptions,
      ...(options || {})
    };

    return this.overlay.create(overlayParams);
  }
}
