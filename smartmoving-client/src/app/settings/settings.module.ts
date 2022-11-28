import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { SmartMovingFormsModule } from '../forms/smart-moving-forms.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { CoreModule } from '../core/core.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsHomeComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    SmartMovingFormsModule,
    NgSelectModule,
    NgbTooltipModule
  ],
})
export class SettingsModule {}
