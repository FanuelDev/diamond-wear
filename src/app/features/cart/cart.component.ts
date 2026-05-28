import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'dw-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="cart-drawer" [class.open]="cart.isOpen()">
      <div class="cart-header">
        <h2>Mon Panier
          @if (cart.itemCount() > 0) {
            <span class="count-badge">{{ cart.itemCount() }}</span>
          }
        </h2>
        <button class="close-btn" (click)="cart.closeCart()">✕</button>
      </div>

      <div class="cart-body">
        @if (cart.items().length === 0) {
          <div class="empty-cart">
            <div class="empty-icon">🛍️</div>
            <p>Votre panier est vide</p>
            <a routerLink="/shop" class="btn-shop" (click)="cart.closeCart()">Découvrir la boutique</a>
          </div>
        } @else {
          <ul class="cart-items">
            @for (item of cart.items(); track $index; let i = $index) {
              <li class="cart-item">
                <div class="item-image" [style.background]="item.product.gradient">
                  <span>{{ item.product.icon }}</span>
                </div>
                <div class="item-info">
                  <p class="item-name">{{ item.product.name }}</p>
                  <p class="item-meta">{{ item.selectedSize }} · {{ item.selectedColor }}</p>
                  <div class="item-qty">
                    <button (click)="cart.updateQuantity(i, item.quantity - 1)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="cart.updateQuantity(i, item.quantity + 1)">+</button>
                  </div>
                </div>
                <div class="item-right">
                  <p class="item-price">{{ item.product.price * item.quantity | number:'1.0-0' }}</p>
                  <p class="item-price-unit">FCFA</p>
                  <button class="remove-btn" (click)="cart.removeItem(i)">🗑</button>
                </div>
              </li>
            }
          </ul>
        }
      </div>

      @if (cart.items().length > 0) {
        <div class="cart-footer">
          <div class="cart-totals">
            <div class="total-row">
              <span>Sous-total</span>
              <span>{{ cart.subtotal() | number:'1.0-0' }} FCFA</span>
            </div>
            <div class="total-row">
              <span>Livraison</span>
              <span>{{ cart.shipping() === 0 ? 'Gratuite' : (cart.shipping() | number:'1.0-0') + ' FCFA' }}</span>
            </div>
            @if (cart.shipping() > 0) {
              <p class="free-ship-hint">Encore {{ (50000 - cart.subtotal()) | number:'1.0-0' }} FCFA pour la livraison gratuite</p>
            }
            <div class="total-row total-final">
              <span>Total</span>
              <span>{{ cart.total() | number:'1.0-0' }} FCFA</span>
            </div>
          </div>
          <a routerLink="/checkout" class="checkout-btn" (click)="cart.closeCart()">
            Commander →
          </a>
          <button class="continue-btn" (click)="cart.closeCart()">Continuer mes achats</button>
        </div>
      }
    </aside>
  `,
  styles: [`
    .cart-drawer {
      position: fixed;
      top: 0; right: 0;
      width: 420px;
      max-width: 100vw;
      height: 100vh;
      background: #fff;
      z-index: 1100;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: -10px 0 60px rgba(0,0,0,0.2);
    }
    .cart-drawer.open { transform: translateX(0); }

    .cart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    .cart-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0D0D0D;
    }
    .count-badge {
      background: #E8772A;
      color: #fff;
      border-radius: 50%;
      width: 24px; height: 24px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn {
      background: none;
      border: 1px solid #eee;
      border-radius: 8px;
      width: 36px; height: 36px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
    }
    .close-btn:hover { background: #f5f5f5; border-color: #ddd; }

    .cart-body { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      text-align: center;
      gap: 1rem;
    }
    .empty-icon { font-size: 4rem; }
    .empty-cart p { color: #999; font-size: 1rem; }
    .btn-shop {
      background: #E8772A;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .btn-shop:hover { background: #C45A0F; }

    .cart-items { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .cart-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      border-radius: 12px;
      background: #fafafa;
      border: 1px solid #f0f0f0;
    }
    .item-image {
      width: 70px; height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
    }
    .item-info { flex: 1; min-width: 0; }
    .item-name { font-weight: 700; font-size: 0.9rem; margin: 0 0 0.2rem; color: #0D0D0D; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-meta { color: #999; font-size: 0.78rem; margin: 0 0 0.5rem; }
    .item-qty {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .item-qty button {
      width: 26px; height: 26px;
      border-radius: 6px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .item-qty button:hover { background: #f0f0f0; }
    .item-qty span { font-weight: 700; font-size: 0.9rem; min-width: 20px; text-align: center; }

    .item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }
    .item-price { margin: 0; font-weight: 800; font-size: 1rem; color: #0D0D0D; }
    .item-price-unit { margin: 0; font-size: 0.7rem; color: #999; }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      opacity: 0.5;
      transition: opacity 0.2s;
      margin-top: auto;
    }
    .remove-btn:hover { opacity: 1; }

    .cart-footer {
      border-top: 1px solid #f0f0f0;
      padding: 1.25rem 1.5rem;
      flex-shrink: 0;
    }
    .cart-totals { margin-bottom: 1rem; }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 0.4rem 0;
      font-size: 0.9rem;
      color: #555;
    }
    .total-row span:last-child { font-weight: 600; color: #0D0D0D; }
    .total-final {
      border-top: 2px solid #0D0D0D;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      font-weight: 800;
      font-size: 1.1rem;
      color: #0D0D0D;
    }
    .total-final span { color: #0D0D0D !important; }
    .free-ship-hint {
      font-size: 0.75rem;
      color: #E8772A;
      margin: 0.25rem 0;
      text-align: center;
    }

    .checkout-btn {
      display: block;
      width: 100%;
      background: #E8772A;
      color: #fff;
      text-align: center;
      padding: 1rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: 0.03em;
      transition: background 0.2s, transform 0.2s;
    }
    .checkout-btn:hover { background: #C45A0F; transform: translateY(-2px); }
    .continue-btn {
      display: block;
      width: 100%;
      background: none;
      border: none;
      color: #999;
      text-align: center;
      padding: 0.75rem;
      cursor: pointer;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      transition: color 0.2s;
    }
    .continue-btn:hover { color: #0D0D0D; }
  `]
})
export class CartComponent {
  cart = inject(CartService);
}
