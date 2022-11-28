import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AppProfileMenuComponent } from './app-profile-menu/app-profile-menu.component';
import { AppSidenavComponent } from './app-sidenav/app-sidenav.component';
import { SmartMovingFormsModule } from '../forms/smart-moving-forms.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    SharedModule,
    MatDialogModule,
    OverlayModule,
    PortalModule,
    ReactiveFormsModule,
    SmartMovingFormsModule,
    NgbTooltipModule,
  ],
  declarations: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppProfileMenuComponent,
    AppSidenavComponent,
  ],
  exports: [
    AppLayoutComponent,
  ],
})
export class LayoutModule {}
