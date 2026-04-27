export type OrderStatus = 'NEW' | 'PROCESSED' | 'FAILED';

export const ORDER_STATUSES: OrderStatus[] = ['NEW', 'PROCESSED', 'FAILED'];

export interface Order {
  id: number;
  customerName: string;
  product: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  customerName: string;
  product: string;
  quantity: number;
}
