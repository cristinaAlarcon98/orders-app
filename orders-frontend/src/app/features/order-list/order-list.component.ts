import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrderStatus } from '../../shared/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  selectedStatus: OrderStatus | undefined;
  readonly statuses: OrderStatus[] = ['NEW', 'PROCESSED', 'FAILED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.selectedStatus).subscribe({
      next: (orders) => (this.orders = orders),
      error: () => alert('Error al cargar los pedidos')
    });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status ? (status as OrderStatus) : undefined;
    this.loadOrders();
  }

  runBatch(): void {
    this.orderService.runBatch().subscribe({
      next: () => {
        alert('Batch ejecutado correctamente');
        this.loadOrders();
      },
      error: () => alert('Error al ejecutar el batch')
    });
  }
}
