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

export const PRODUCTS = [
  'Nike Air Max 90',
  'Nike Air Force 1',
  'Adidas Ultraboost',
  'Adidas Stan Smith',
  'New Balance 574',
  'Converse Chuck Taylor',
  'Vans Old Skool',
  'Jordan 1 Retro High',
  'Puma Suede Classic',
  'Asics Gel-Nimbus'
];
