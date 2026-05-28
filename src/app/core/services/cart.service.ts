import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  private readonly _isOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly shipping = computed(() =>
    this.subtotal() === 0 ? 0 : this.subtotal() >= 50000 ? 0 : 3000
  );

  readonly total = computed(() => this.subtotal() + this.shipping());

  addItem(product: Product, size: string, color: string, qty = 1): void {
    this._items.update(items => {
      const idx = items.findIndex(
        i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
      );
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [...items, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
    this.openCart();
  }

  updateQuantity(index: number, qty: number): void {
    if (qty <= 0) { this.removeItem(index); return; }
    this._items.update(items => {
      const updated = [...items];
      updated[index] = { ...updated[index], quantity: qty };
      return updated;
    });
  }

  removeItem(index: number): void {
    this._items.update(items => items.filter((_, i) => i !== index));
  }

  clearCart(): void {
    this._items.set([]);
  }

  openCart(): void { this._isOpen.set(true); }
  closeCart(): void { this._isOpen.set(false); }
  toggleCart(): void { this._isOpen.update(v => !v); }
}
