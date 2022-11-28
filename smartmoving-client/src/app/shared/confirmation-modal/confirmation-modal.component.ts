import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationOptions } from './confirmation-options';

@Component({
  selector: 'sm-confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent implements OnInit {

  isWorking = false;

  constructor(
      private dialogRef: MatDialogRef<ConfirmationModalComponent>,
      @Inject(MAT_DIALOG_DATA) public params: ConfirmationOptions
  ) {
  }

  ngOnInit() {
  }

  async confirm() {
    if (this.params.action) {
      try {
        this.isWorking = true;
        await this.params.action();
      } finally {
        this.isWorking = false;
      }
    }

    this.dialogRef.close(true);
  }

  async cancel() {
    if (this.params.cancelAction) {
      try {
        this.isWorking = true;
        await this.params.cancelAction();
      } finally {
        this.isWorking = false;
      }
    }

    this.dialogRef.close(false);
  }
}
