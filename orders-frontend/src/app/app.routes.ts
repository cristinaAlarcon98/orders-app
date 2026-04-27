import { Routes } from '@angular/router';
import { OrderListComponent } from './features/order-list/order-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrderListComponent }
];
