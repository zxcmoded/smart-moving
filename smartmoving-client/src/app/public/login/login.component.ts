import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { CurrentUserService } from 'app/core/current-user.service';
import { AuthenticationService } from 'app/core/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginForm } from 'app/generated/Authentication/login-form';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { StronglyTypedFormBuilderService } from 'app/shared/strongly-typed-form-builder.service';

@Component({
  selector: 'sm-login',
  templateUrl: './login.component.html',
  styles: [':host { width: 100% }']
})
export class LoginComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isSubmitting = false;

  constructor(private readonly notifications: NotificationsService,
              private readonly currentUser: CurrentUserService,
              private readonly authenticationService: AuthenticationService,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly formBuilder: StronglyTypedFormBuilderService,
              private readonly matDialog: MatDialog,) {
    this.formGroup = this.formBuilder.group<LoginForm>()
        .for(x => x.emailAddress, [null, Validators.required])
        .for(x => x.password, [null, Validators.required])
        .for(x => x.rememberMe, [false])
        .build();
  }

  ngOnInit() {
    const emailAddress = this.tryGetRememberedEmailAddress();

    if (emailAddress) {
      this.formGroup.patchValue({
        emailAddress,
        rememberMe: true
      });
    }
  }

  async submit() {
    this.isSubmitting = true;
    const formValue: LoginForm = this.formGroup.value;

    try {
      const result = await this.authenticationService.login(formValue);

      if (!result.successful) {
        this.notifications.error('Login failed', 'Unable to validate your username or password.');
        return;
      }

      this.currentUser.loginFromResult(result);

      if (!this.currentUser.getDefaultRoute()) {
        this.notifications.error('Not supported', 'You do not have a role that allows you to log in via the web.');
        this.currentUser.logout();
        return;
      }

      if (formValue.rememberMe) {
        this.rememberEmailAddress(formValue.emailAddress);
      } else {
        this.clearRememberedAddress();
      }

      this.authenticationService.setAutomaticLogoutInterval();

      const returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

      this.router.navigateByUrl(returnUrl ? returnUrl : this.currentUser.getDefaultRoute());

    } finally {
      this.isSubmitting = false;
    }
  }

  private rememberEmailAddress(email: string) {
    localStorage.setItem('SmartMoving.LoginEmailAddress', email);
  }

  private clearRememberedAddress() {
    localStorage.removeItem('SmartMoving.LoginEmailAddress');
  }

  private tryGetRememberedEmailAddress() {
    return localStorage.getItem('SmartMoving.LoginEmailAddress');
  }

}
