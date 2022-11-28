import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequireAuthenticatedGuard } from './core/auth/require-authenticated-guard';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { RedirectToUserHomeComponent } from './redirect-to-user-home/redirect-to-user-home.component';
import { RedirectToHomepageGuard } from './core/redirect-to-homepage-guard';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';

const routes: Routes = [
  // This route doesn't do anything except redirect the user to the right place, based on their role
  {
    path: '',
    // The guard *should* prevent the component from ever loading, but just in case, we have a component, too.
    canActivate: [RedirectToHomepageGuard],
    component: RedirectToUserHomeComponent
  },


  // Public-facing pages
  {
    path: '',
    data: { moduleName: 'Login and Public Pages' },
    loadChildren: () => import('app/public/public.module').then(m => m.PublicModule)
  },


  // Authenticated pages (with app layout)
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [RequireAuthenticatedGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('app/home/home.module').then(m => m.HomeModule),
        data: {
          allowedPermissions: [Permission.CompanyDashboard],
          moduleName: 'Company Dashboard'
        }
      },


      {
        path: 'customers',
        loadChildren: () => import('app/customers/customers.module').then(m => m.CustomersModule),
        data: {
          allowedPermissions: [Permission.Customers],
          moduleName: 'Customers'
        }
      },

      {
        path: 'settings',
        loadChildren: () => import('app/settings/settings.module').then(m => m.SettingsModule),
        data: {
          allowedPermissions: [Permission.Settings],
          moduleName: 'Settings'
        }
      }
    ]
  },


  // Layout, but no auth required
  {
    path: 'logout',
    component: AppLayoutComponent,
    children: [{ path: '', component: LogoutComponent }],
  },

  // Catch all
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    relativeLinkResolution: 'legacy',
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
