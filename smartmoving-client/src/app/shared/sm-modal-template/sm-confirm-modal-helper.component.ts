import { Input, TemplateRef, Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'sm-confirm-modal-helper',
  styles: [':host {width: 100%}'],
  template: `
  <div [class]="titleDivClass">
    <ng-content select="[modalTitle]"></ng-content>
  </div>

  <ng-template #confirmModal>
    <sm-modal-template
      [title]="title"
      [primaryButtonText]="primaryButtonText"
      [primaryButtonClass]="primaryButtonClass"
      (primaryAction)="primaryAction()"
      (secondaryAction)="cancel()">

      <ng-container modalBody>
        <ng-content select="[modalBody]"></ng-content>
      </ng-container>
    </sm-modal-template>
  </ng-template>
  `,
  exportAs: 'confirmModal'
})
export class ConfirmModalHelperComponent {
  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (this.enableAction) {
      this.openModal();
    }
  }

  @Input() title = 'Are you sure?';
  @Input() primaryButtonText = 'Confirm';
  @Input() primaryButtonClass = 'btn-primary';
  @Input() enableAction = true;
  @Input() titleDivClass = '';
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() modalOpened: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmModal', { static: true }) confirmModal: TemplateRef<any>;
  private modalRef: MatDialogRef<any>;
  private params;

  constructor(private matDialog: MatDialog) { }

  openModal(params?: any) {
    this.modalRef = this.matDialog.open(this.confirmModal, { autoFocus: false });
    this.params = params;
    this.modalOpened.emit();
  }

  primaryAction() {
    this.confirm.emit(this.params);
    this.modalRef.close();
  }

  cancel() {
    this.cancelEvent.emit();
    this.modalRef.close();
  }
}
