import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ConfirmationOptions } from './confirmation-options';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private defaultOptions: ConfirmationOptions = {
    title: 'Are you sure?',
    message: 'Are you sure you wish to proceed?',
    messageIsHtml: false,
    confirmationButtonText: 'Yes, proceed',
    confirmationButtonCssClass: 'btn-primary',
    confirmationButtonDisabled: () => false,
    secondaryButtonText: 'Cancel',
    showSecondaryButton: true,
    bodyTemplateContext: {},
    modalAlertLevel: null
  };

  constructor(
    private matDialog: MatDialog
  ) { }

  async showConfirmation(options: Partial<ConfirmationOptions>) {

    const finalOptions = {
      ...this.defaultOptions,
      ...options
    };

    const dialog = this.matDialog.open(ConfirmationModalComponent, {
      disableClose: true,
      maxWidth: options.maxWidth ?? '300px',
      data: finalOptions,
      autoFocus: false
    });

    return (await dialog.afterClosed().toPromise()) as boolean;
  }
}
