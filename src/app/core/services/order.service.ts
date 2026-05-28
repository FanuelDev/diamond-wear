import { Injectable, signal } from '@angular/core';
import { Order, CustomerInfo, PaymentInfo } from '../models/order.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _currentOrder = signal<Order | null>(null);
  private readonly _orders = signal<Order[]>([]);

  readonly currentOrder = this._currentOrder.asReadonly();
  readonly orders = this._orders.asReadonly();

  placeOrder(
    items: CartItem[],
    customer: CustomerInfo,
    payment: PaymentInfo,
    subtotal: number,
    shipping: number
  ): Order {
    const order: Order = {
      id: `DW-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      items: [...items],
      customer,
      payment,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'confirmed',
      createdAt: new Date()
    };
    this._currentOrder.set(order);
    this._orders.update(list => [order, ...list]);
    return order;
  }

  clearCurrentOrder(): void {
    this._currentOrder.set(null);
  }
}
