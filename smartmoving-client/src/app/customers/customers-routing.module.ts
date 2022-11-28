import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: { title: 'Customers' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./customers-list/customers-list.module').then(
            m => m.CustomersListModule
          )
      },
      {
        path: 'details/:id',
        loadChildren: () =>
          import('./customer-details/customer-details.module').then(
            m => m.CustomerDetailsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {}
