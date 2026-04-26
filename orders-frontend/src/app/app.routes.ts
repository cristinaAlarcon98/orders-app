import { Routes } from '@angular/router';
import { OrderListComponent } from './features/order-list/order-list.component';
import { OrderCreateComponent } from './features/order-create/order-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/new', component: OrderCreateComponent }
];
