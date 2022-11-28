import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
        data: { allowedPermissions: [Permission.Settings] }
      }, {
        path: 'home',
        component: SettingsHomeComponent
      }, {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
