import { Component, OnInit, TemplateRef, ViewChild, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Order, OrderStatus, PRODUCTS } from '../../shared/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @ViewChild('orderModal') orderModal!: TemplateRef<any>;

  private allOrders = signal<Order[]>([]);
  readonly statusFilter = signal<string>('');
  readonly orders = computed(() => {
    const status = this.statusFilter();
    const all = this.allOrders();
    return status ? all.filter(o => o.status === status) : all;
  });

  form: FormGroup;

  private modalRef?: NgbModalRef;

  readonly statuses: OrderStatus[] = ['NEW', 'PROCESSED', 'FAILED'];
  readonly products = PRODUCTS;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => this.allOrders.set(orders ?? []),
      error: () => alert('Error al cargar los pedidos')
    });
  }

  openModal(): void {
    this.form.reset({ customerName: '', product: '', quantity: 1 });
    this.modalRef = this.modalService.open(this.orderModal);
  }

  closeModal(): void {
    this.modalRef?.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    this.orderService.createOrder(this.form.value).subscribe({
      next: () => {
        this.closeModal();
        this.statusFilter.set('');
        this.loadOrders();
      },
      error: () => alert('Error al crear el pedido')
    });
  }

  runBatch(): void {
    this.orderService.runBatch().subscribe({
      next: () => {
        this.statusFilter.set('');
        alert('Batch ejecutado correctamente');
        this.loadOrders();
      },
      error: () => alert('Error al ejecutar el batch')
    });
  }
}
