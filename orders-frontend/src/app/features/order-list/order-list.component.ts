import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, switchMap } from 'rxjs';
import { Order, ORDER_STATUSES, OrderStatus } from '../../shared/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @ViewChild('orderModal') orderModal!: TemplateRef<unknown>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly refresh$ = new Subject<void>();
  private readonly DEFAULT_QUANTITY = 1;
  private modalRef?: NgbModalRef;

  private readonly allOrders = signal<Order[]>([]);
  readonly statusFilter = signal<OrderStatus | ''>('');
  readonly searchTerm = signal<string>('');
  readonly isSubmitting = signal(false);
  readonly isRunningBatch = signal(false);
  readonly hasNewOrders = computed(() => this.allOrders().some(o => o.status === 'NEW'));
  readonly orders = computed(() => {
    const status = this.statusFilter();
    const search = this.searchTerm().toLowerCase().trim();
    let result = this.allOrders();
    if (status) result = result.filter(o => o.status === status);
    if (search) result = result.filter(o =>
      o.customerName.toLowerCase().includes(search) ||
      o.product.toLowerCase().includes(search)
    );
    return result;
  });

  readonly statuses = ORDER_STATUSES;
  readonly products = signal<string[]>([]);
  readonly form = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    product:      ['', Validators.required],
    quantity:     [this.DEFAULT_QUANTITY, [Validators.required, Validators.min(1)]]
  });

  get customerName(): FormControl { return this.form.get('customerName') as FormControl; }
  get product(): FormControl       { return this.form.get('product') as FormControl; }
  get quantity(): FormControl      { return this.form.get('quantity') as FormControl; }

  ngOnInit(): void {
    this.initOrdersStream();
    this.loadProducts();
  }

  private initOrdersStream(): void {
    this.refresh$
      .pipe(
        switchMap(() => this.orderService.getOrders()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (orders) => this.allOrders.set(orders ?? []),
        error: () => this.toastService.error('orders.notifications.errorLoad')
      });

    this.refresh$.next();
  }

  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OrderStatus | '';
    this.statusFilter.set(value);
  }

  openModal(): void {
    this.form.reset();
    this.modalRef = this.modalService.open(this.orderModal);
  }

  closeModal(): void {
    this.modalRef?.close();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.orderService.createOrder(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.onCreateSuccess(),
        error: () => this.onCreateError()
      });
  }

  runBatch(): void {
    if (this.isRunningBatch()) return;

    this.isRunningBatch.set(true);
    this.orderService.runBatch()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.onBatchSuccess(),
        error: () => this.onBatchError()
      });
  }

  private onCreateSuccess(): void {
    this.isSubmitting.set(false);
    this.toastService.success('orders.notifications.createSuccess');
    this.closeModal();
    this.statusFilter.set('');
    this.refresh$.next();
  }

  private onCreateError(): void {
    this.isSubmitting.set(false);
    this.toastService.error('orders.notifications.errorCreate');
  }

  private onBatchSuccess(): void {
    this.isRunningBatch.set(false);
    this.statusFilter.set('');
    this.toastService.success('orders.notifications.batchSuccess');
    this.refresh$.next();
  }

  private onBatchError(): void {
    this.isRunningBatch.set(false);
    this.toastService.error('orders.notifications.errorBatch');
  }

  private loadProducts(): void {
    this.orderService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.products.set(products ?? [])
      });
  }
}
