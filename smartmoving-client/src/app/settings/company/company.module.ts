import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SmartMovingFormsModule } from '../../forms/smart-moving-forms.module';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { SettingsService } from '../settings.service';
import { CompanyComponent } from './company.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    data: { bodyClass: 'body-dark' }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SmartMovingFormsModule,
    CoreModule,
    NgSelectModule,
    NgbTooltipModule,
    SharedModule
  ],
  declarations: [
    CompanyComponent
  ]
})
export class CompanyModule { }
