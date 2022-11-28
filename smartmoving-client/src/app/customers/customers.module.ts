import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { SmartMovingFormsModule } from '../forms/smart-moving-forms.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    CoreModule,
    SmartMovingFormsModule
  ]
})
export class CustomersModule { }
