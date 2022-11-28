/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
declare const $: JQueryStatic;

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SmartMovingFormsModule } from './forms/smart-moving-forms.module';
import { LayoutModule } from './layout/layout.module';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandlerService } from './core/global-error-handler.service';
import { AuthHttpInterceptorService } from './core/auth-http-interceptor.service';
import { RedirectToUserHomeComponent } from './redirect-to-user-home/redirect-to-user-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    RedirectToUserHomeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    SimpleNotificationsModule.forRoot({
      position: ['top', 'right'],
      timeOut: 3000,
      showProgressBar: false,
      pauseOnHover: true,
      clickToClose: true
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgbPopoverModule,

    AppRoutingModule,
    LayoutModule,
    CoreModule.forRoot(),
    SmartMovingFormsModule,
    SharedModule,
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
