import { Input, Component, Output, EventEmitter, ViewEncapsulation, TemplateRef } from '@angular/core';

export enum ModalTemplateAlertLevel {
  Warn = 'modal-warn'
}

@Component({
  selector: 'sm-modal-template',
  templateUrl: './sm-modal-template.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SmModalTemplateComponent {
  @Input() title: string;
  @Input() stopClickPropagation = true;
  @Input() showHeader = true;
  @Input() showFooter = true;

  @Input() modalHeaderClass = '';
  @Input() modalBodyClass = '';

  @Input() primaryButtonText: string;
  @Input() primaryButtonClass = 'btn-primary';
  @Input() primaryButtonDisableState = false;
  @Input() primaryButtonTooltip = null;
  @Input() primaryButtonTooltipDisableState = null;
  @Output() primaryAction: EventEmitter<any> = new EventEmitter();
  @Input() primaryButtonFocus = false;

  @Input() showSecondaryButton = true;
  @Input() secondaryButtonText = 'Cancel';
  @Output() secondaryAction: EventEmitter<any> = new EventEmitter();

  @Input() showTertiaryButton = false;
  @Input() tertiaryButtonText = 'Cancel';
  @Input() tertiaryButtonClass = 'btn-secondary';
  @Output() tertiaryAction: EventEmitter<any> = new EventEmitter();

  @Input() isBusyState = false;
  @Input() modalAlertLevel: ModalTemplateAlertLevel = null;

  @Input() showDismissButton = false;

  @Input() headerTemplateRef: TemplateRef<any>;
}
