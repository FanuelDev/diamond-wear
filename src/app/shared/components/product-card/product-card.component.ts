import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'dw-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="card" [class.out-of-stock]="!product.inStock">
      <a [routerLink]="['/product', product.id]" class="card-image-wrap">
        <div class="card-image">
          <img [src]="product.imageUrl" [alt]="product.name" class="product-img" loading="lazy"/>
          <div class="image-overlay">
            <button class="quick-view-btn" (click)="$event.preventDefault(); onQuickAdd()">
              + Ajouter au panier
            </button>
          </div>
        </div>
        <div class="card-badges">
          @if (product.isNew) {
            <span class="badge badge-new">NEW</span>
          }
          @if (product.originalPrice) {
            <span class="badge badge-sale">-{{ discount() }}%</span>
          }
          @if (!product.inStock) {
            <span class="badge badge-sold">Épuisé</span>
          }
        </div>
      </a>

      <div class="card-body">
        <div class="card-rating">
          <span class="stars">{{ stars() }}</span>
          <span class="review-count">({{ product.reviewCount }})</span>
        </div>
        <h3 class="card-name">
          <a [routerLink]="['/product', product.id]">{{ product.name }}</a>
        </h3>
        <div class="card-colors">
          @for (color of product.colors.slice(0, 4); track color.hex) {
            <span class="color-dot" [style.background]="color.hex" [title]="color.name"></span>
          }
        </div>
        <div class="card-price">
          <span class="price-current">{{ product.price | number:'1.0-0' }} FCFA</span>
          @if (product.originalPrice) {
            <span class="price-original">{{ product.originalPrice | number:'1.0-0' }}</span>
          }
        </div>
      </div>

      @if (added()) {
        <div class="added-toast">✓ Ajouté</div>
      }
    </article>
  `,
  styles: [`
    .card {
      position: relative;
      background: var(--card-bg, #fff);
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
    .card.out-of-stock .card-image { filter: grayscale(0.4); }

    .card-image-wrap { display: block; text-decoration: none; position: relative; }
    .card-image {
      width: 100%;
      aspect-ratio: 3/4;
      position: relative;
      overflow: hidden;
      background: var(--surface-2, #F5F0EB);
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .card:hover .product-img { transform: scale(1.06); }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(13,13,13,0.45);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .card:hover .image-overlay { opacity: 1; }

    .quick-view-btn {
      background: #E8772A;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      letter-spacing: 0.04em;
      transform: translateY(10px);
      transition: transform 0.3s ease, background 0.2s;
      white-space: nowrap;
    }
    .card:hover .quick-view-btn { transform: translateY(0); }
    .quick-view-btn:hover { background: #C45A0F; }

    .card-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge-new { background: #E8772A; color: #fff; }
    .badge-sale { background: #1C1B2E; color: #C9A96E; }
    .badge-sold { background: rgba(0,0,0,0.7); color: #fff; }

    .card-body { padding: 1rem 1.25rem 1.25rem; }
    .card-rating { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.3rem; }
    .stars { color: #E8772A; font-size: 0.85rem; }
    .review-count { color: var(--text-muted, #999); font-size: 0.78rem; }

    .card-name { margin: 0 0 0.5rem; font-size: 0.95rem; font-weight: 700; color: var(--text, #0D0D0D); line-height: 1.3; }
    .card-name a { text-decoration: none; color: inherit; }
    .card-name a:hover { color: #E8772A; }

    .card-colors { display: flex; gap: 0.4rem; margin-bottom: 0.75rem; }
    .color-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2px solid var(--border-col, #eee);
      display: inline-block;
    }

    .card-price { display: flex; align-items: baseline; gap: 0.6rem; }
    .price-current { font-size: 1rem; font-weight: 800; color: var(--text, #0D0D0D); }
    .price-original { font-size: 0.85rem; color: var(--text-muted, #999); text-decoration: line-through; }

    .added-toast {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(232,119,42,0.92);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 800;
      border-radius: 16px;
      animation: fadeOut 1.5s ease forwards;
    }
    @keyframes fadeOut {
      0% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; pointer-events: none; }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  added = signal(false);

  constructor(private cart: CartService) {}

  discount(): number {
    if (!this.product.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  stars(): string {
    const r = Math.round(this.product.rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  onQuickAdd(): void {
    if (!this.product.inStock) return;
    const size = this.product.sizes[0];
    const color = this.product.colors[0].name;
    this.cart.addItem(this.product, size, color);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1600);
    this.addedToCart.emit();
  }
}
