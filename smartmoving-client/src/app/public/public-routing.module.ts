import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { LoginComponent } from './login/login.component';
import { StandardSidebarComponent } from './standard-sidebar/standard-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // NOTE: Don't change the login path without updating the `auth-http-interceptor`.
      {
        path: 'login', children: [
          { path: '', component: LoginComponent },
          { path: '', component: StandardSidebarComponent, outlet: 'sidebar' },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
