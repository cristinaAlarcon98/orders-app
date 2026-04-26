import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, OrderStatus } from '../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(status?: OrderStatus): Observable<Order[]> {
    const params = status ? new HttpParams().set('status', status) : {};
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  runBatch(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/batch/run`, null);
  }
}
