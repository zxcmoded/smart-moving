/* eslint-disable max-len */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbCollapseModule, NgbPopoverModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgSelectModule } from '@ng-select/ng-select';
import { SmartMovingFormsModule } from '../forms/smart-moving-forms.module';
import { SlideoutPanelComponent } from './slideouts/slideout-panel/slideout-panel.component';
import { EditCustomerSlideoutComponent } from './edit-customer-slideout/edit-customer-slideout.component';
import { CoreModule } from '../core/core.module';
import { SmModalTemplateComponent } from './sm-modal-template/sm-modal-template.component';
import { ConfirmModalHelperComponent } from './sm-modal-template/sm-confirm-modal-helper.component';
import { PasswordRequirementsComponent } from './password-requirements/password-requirements.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RouteChangeConfirmationComponent } from './route-change-confirmation/route-change-confirmation.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { PagerComponent } from './pager/pager.component';
import { RouterModule } from '@angular/router';
import { ContactSummaryComponent } from 'app/shared/contact-summary/contact-summary.component';
import { ViewContactsSlideoutComponent } from 'app/shared/contact-summary/view-contacts-slideout/view-contacts-slideout.component';
import { SecondaryContactComponent } from 'app/shared/contact-summary/secondary-contact/secondary-contact.component';
import { AddEditContactSlideoutComponent } from 'app/shared/contact-summary/add-edit-contact-slideout/add-edit-contact-slideout.component';


const declareAndExport = [
  SmModalTemplateComponent,
  ConfirmModalHelperComponent,
  PasswordRequirementsComponent,
  RouteChangeConfirmationComponent,
  LoadingOverlayComponent,
  PagerComponent,
  EditCustomerSlideoutComponent,
  SlideoutPanelComponent,
  ChangePasswordComponent,
  ConfirmationModalComponent,
  ContactSummaryComponent,
  ViewContactsSlideoutComponent,
  SecondaryContactComponent,
  AddEditContactSlideoutComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbPopoverModule,
    OverlayModule,
    PortalModule,
    MatDialogModule,
    SmartMovingFormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgSelectModule,
    CoreModule,
    NgbCollapseModule
  ],
  declarations: [
    ...declareAndExport,
  ],
  exports: [
    NgbPopoverModule,
    NgbCollapseModule,
    ...declareAndExport,
  ]
})
export class SharedModule {}
