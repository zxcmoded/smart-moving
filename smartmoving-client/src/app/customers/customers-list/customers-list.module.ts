import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core.module';

import { SharedModule } from '../../shared/shared.module';

import { CustomersListComponent } from './customers-list.component';
import { SmartMovingFormsModule } from '../../forms/smart-moving-forms.module';

const routes: Routes = [
  { path: '', data: {title: 'Customers List'}, component: CustomersListComponent }
];

@NgModule({
  declarations: [
    CustomersListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    SharedModule,
    SmartMovingFormsModule
  ],
  exports: [RouterModule]
})
export class CustomersListModule {}
