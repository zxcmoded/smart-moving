import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SmartMovingFormsModule } from '../forms/smart-moving-forms.module';
import { LoginComponent } from './login/login.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StandardSidebarComponent } from './standard-sidebar/standard-sidebar.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,

    PublicRoutingModule,

    CoreModule,
    SharedModule,
    SmartMovingFormsModule
  ],
  declarations: [
    LoginComponent,
    PublicLayoutComponent,
    StandardSidebarComponent,
  ]
})
export class PublicModule {}
