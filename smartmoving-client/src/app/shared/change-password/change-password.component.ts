import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ApiClientService } from '../../core/api-client.service';
import { SmartMovingValidators } from '../../core/SmartMovingValidators';

@Component({
  selector: 'sm-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  formGroup: UntypedFormGroup;
  missingEmail: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id: string; email: string},
    private modalRef: MatDialogRef<any>,
    private formBuilder: UntypedFormBuilder,
    private apiClient: ApiClientService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      password: ['', [...SmartMovingValidators.createStandardPasswordValidators()]]
    });

    if (!this.data.email) {
      this.formGroup.disable();
      this.missingEmail = true;
    }
  }

  async changePassword() {
    const password = this.formGroup.get('password').value;

    try {
      await this.apiClient.post(`settings/users/${this.data.id}/set-password`, {password});
      this.modalRef.close(true);
    } catch (err) {
      this.notifications.error('Oops', 'There was a problem changing the user\'s password.');
    }
  }

  cancel() {
    this.modalRef.close(false);
  }
}
