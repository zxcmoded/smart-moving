import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { slideoutAnimations } from './slideout-animations';
import { Subject } from 'rxjs';
import { AnimationEvent } from '@angular/animations';
import { SlideoutPopoutOptions } from 'app/shared/slideouts/slideout-options';

@Component({
  selector: 'sm-slideout-panel',
  templateUrl: './slideout-panel.component.html',
  styleUrls: ['./slideout-panel.component.scss'],
  animations: [slideoutAnimations.slideIn],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[@slideIn]': 'animationState',
    '(@slideIn.done)': 'onAnimationDone($event)',
  }
})
export class SlideoutPanelComponent implements OnInit {

  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  animationState: 'void' | 'enter' | 'exit' = 'enter';

  title: string;
  additionalContainerClasses: string;
  showCloseButton = true;
  showBackButton = false;
  noPadding = false;
  popoutOptions: SlideoutPopoutOptions;
  disableClose = false;

  focusEventEmitter = new EventEmitter<any>();

  private closeSubject = new EventEmitter<any>();
  private closingSubject = new EventEmitter<any>();
  backButtonCallback: () => any;

  constructor() {
  }

  ngOnInit() {

  }

  attachTemplate(portal: TemplatePortal) {

    if (!this.portalOutlet) {
      throw new Error('Portal outlet was not defined!');
    }

    return this.portalOutlet.attachTemplatePortal(portal);
  }

  attachComponent<T>(portal: ComponentPortal<T>) {
    if (!this.portalOutlet) {
      throw new Error('Portal outlet was not defined!');
    }

    return this.portalOutlet.attach(portal);
  }

  onAnimationDone($event: AnimationEvent) {

    if ($event.phaseName === 'done' && $event.toState === 'exit') {
      this.closeSubject.emit();
      this.closeSubject.complete();
    }
  }

  close() {
    if (!this.disableClose) {
      this.animationState = 'exit';
      this.closingSubject.emit();
      this.closingSubject.complete();
    }
  }

  closing() {
    return this.closingSubject.asObservable();
  }

  closed() {
    return this.closeSubject.asObservable();
  }

  popout() {
    window.open(this.popoutOptions.url, this.popoutOptions.features ?? 'smPopout', this.popoutOptions.features ?? 'width=400,height=800,menubar=no');
    this.close();
  }

  back() {
    if (this.backButtonCallback) {
      this.backButtonCallback();
    }
  }

  setAutoFocus() {
    this.focusEventEmitter.emit();
  }
}
