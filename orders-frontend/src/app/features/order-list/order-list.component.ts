import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, switchMap } from 'rxjs';
import { Order, ORDER_STATUSES, OrderStatus } from '../../shared/models/order.model';
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
  private readonly refresh$ = new Subject<void>();
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
        error: () => alert(this.translate.instant('orders.notifications.errorLoad'))
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
    this.form.reset({ customerName: '', product: '', quantity: this.DEFAULT_QUANTITY });
    this.modalRef = this.modalService.open(this.orderModal);
  }

  closeModal(): void {
    this.modalRef?.close();
  }

  private readonly DEFAULT_QUANTITY = 1;

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.orderService.createOrder(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeModal();
          this.statusFilter.set('');
          this.refresh$.next();
        },
        error: () => {
          this.isSubmitting.set(false);
          alert(this.translate.instant('orders.notifications.errorCreate'));
        }
      });
  }

  runBatch(): void {
    if (this.isRunningBatch()) return;

    this.isRunningBatch.set(true);
    this.orderService.runBatch()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isRunningBatch.set(false);
          this.statusFilter.set('');
          alert(this.translate.instant('orders.notifications.batchSuccess'));
          this.refresh$.next();
        },
        error: () => {
          this.isRunningBatch.set(false);
          alert(this.translate.instant('orders.notifications.errorBatch'));
        }
      });
  }

  private loadProducts(): void {
    this.orderService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.products.set(products ?? [])
      });
  }
}
