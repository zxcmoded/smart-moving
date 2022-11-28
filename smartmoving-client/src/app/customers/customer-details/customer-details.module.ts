import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerDetailsComponent } from './customer-details.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: CustomerDetailsComponent, data: { bodyClass: 'body-dark' } }
];

@NgModule({
  declarations: [
    CustomerDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgbTooltipModule,
    CoreModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class CustomerDetailsModule {}
