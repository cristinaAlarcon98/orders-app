import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Order, ORDER_STATUSES, OrderStatus, PRODUCTS } from '../../shared/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  @ViewChild('orderModal') orderModal!: TemplateRef<unknown>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly allOrders = signal<Order[]>([]);

  readonly statusFilter = signal<OrderStatus | ''>('');
  readonly orders = computed(() => {
    const status = this.statusFilter();
    const all = this.allOrders();
    return status ? all.filter(o => o.status === status) : all;
  });

  readonly statuses = ORDER_STATUSES;
  readonly products = PRODUCTS;

  readonly form: FormGroup;

  private modalRef?: NgbModalRef;

  constructor(
    private readonly orderService: OrderService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      product:      ['', Validators.required],
      quantity:     [1,  [Validators.required, Validators.min(1)]]
    });
  }

  get customerName(): FormControl { return this.form.get('customerName') as FormControl; }
  get product(): FormControl       { return this.form.get('product') as FormControl; }
  get quantity(): FormControl      { return this.form.get('quantity') as FormControl; }

  ngOnInit(): void {
    this.loadOrders();
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OrderStatus | '';
    this.statusFilter.set(value);
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

    this.orderService.createOrder(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.closeModal();
          this.statusFilter.set('');
          this.loadOrders();
        },
        error: () => alert(this.translate.instant('orders.notifications.errorCreate'))
      });
  }

  runBatch(): void {
    this.orderService.runBatch()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.statusFilter.set('');
          alert(this.translate.instant('orders.notifications.batchSuccess'));
          this.loadOrders();
        },
        error: () => alert(this.translate.instant('orders.notifications.errorBatch'))
      });
  }

  private loadOrders(): void {
    this.orderService.getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => this.allOrders.set(orders ?? []),
        error: () => alert(this.translate.instant('orders.notifications.errorLoad'))
      });
  }
}
