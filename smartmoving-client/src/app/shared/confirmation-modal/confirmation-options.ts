import { TemplateRef } from '@angular/core';
import { ModalTemplateAlertLevel } from '../sm-modal-template/sm-modal-template.component';

export class ConfirmationOptions {
  title: string;
  message: string;
  messageIsHtml: boolean;
  bodyTemplate?: TemplateRef<any>;
  bodyTemplateContext: any;
  confirmationButtonText: string;
  confirmationButtonCssClass: string;
  confirmationButtonDisabled: () => boolean;
  secondaryButtonText: string;
  showSecondaryButton: boolean;
  modalAlertLevel: ModalTemplateAlertLevel;
  action?: () => Promise<any> | any;
  cancelAction?: () => Promise<any> | any;
  maxWidth?: string;
}
