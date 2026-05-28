import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';
import { CATEGORY_LABELS } from '../../core/models/product.model';

@Component({
  selector: 'dw-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    @if (product()) {
      <div class="detail-page">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span>›</span>
          <a routerLink="/shop">Boutique</a>
          <span>›</span>
          <a [routerLink]="['/shop']" [queryParams]="{cat: product()!.category}">{{ categoryLabel() }}</a>
          <span>›</span>
          <span>{{ product()!.name }}</span>
        </nav>

        <div class="detail-layout">
          <!-- Image / Visual -->
          <div class="detail-visual">
            <div class="main-image" [style.background]="selectedGradient()">
              <span class="product-emoji">{{ product()!.icon }}</span>
              @if (product()!.isNew) {
                <div class="img-badge new">NEW</div>
              }
              @if (product()!.originalPrice) {
                <div class="img-badge sale">-{{ discount() }}%</div>
              }
            </div>
            <div class="image-thumbs">
              @for (color of product()!.colors.slice(0, 4); track color.hex) {
                <div class="thumb" [style.background]="color.hex" [class.active]="selectedColor() === color.name"
                     (click)="selectedColor.set(color.name)" [title]="color.name">
                </div>
              }
            </div>
          </div>

          <!-- Info -->
          <div class="detail-info">
            <span class="category-tag">{{ categoryLabel() }}</span>
            <h1>{{ product()!.name }}</h1>

            <div class="rating-row">
              <div class="stars-display">
                @for (s of starsArray(); track $index) {
                  <span [class.filled]="s">★</span>
                }
              </div>
              <span class="rating-val">{{ product()!.rating }}</span>
              <span class="review-count">({{ product()!.reviewCount }} avis)</span>
            </div>

            <div class="price-block">
              <span class="price-main">{{ product()!.price | number:'1.0-0' }} FCFA</span>
              @if (product()!.originalPrice) {
                <span class="price-old">{{ product()!.originalPrice | number:'1.0-0' }} FCFA</span>
                <span class="price-save">Économisez {{ product()!.originalPrice! - product()!.price | number:'1.0-0' }} FCFA</span>
              }
            </div>

            <p class="description">{{ product()!.description }}</p>

            <!-- Color Selector -->
            <div class="option-group">
              <div class="option-label">
                <span>Couleur :</span>
                <strong>{{ selectedColor() }}</strong>
              </div>
              <div class="color-options">
                @for (color of product()!.colors; track color.hex) {
                  <button class="color-btn" [class.active]="selectedColor() === color.name"
                          [style.background]="color.hex" [title]="color.name"
                          (click)="selectedColor.set(color.name)">
                    @if (selectedColor() === color.name) { <span class="check">✓</span> }
                  </button>
                }
              </div>
            </div>

            <!-- Size Selector -->
            <div class="option-group">
              <div class="option-label">
                <span>Taille :</span>
                <strong>{{ selectedSize() || 'Choisir une taille' }}</strong>
              </div>
              <div class="size-options">
                @for (size of product()!.sizes; track size) {
                  <button class="size-btn" [class.active]="selectedSize() === size"
                          (click)="selectedSize.set(size)">
                    {{ size }}
                  </button>
                }
              </div>
              @if (sizeError()) {
                <p class="error-msg">Veuillez choisir une taille</p>
              }
            </div>

            <!-- Quantity -->
            <div class="option-group">
              <div class="option-label"><span>Quantité :</span></div>
              <div class="qty-control">
                <button (click)="qty.set(Math.max(1, qty() - 1))">−</button>
                <span>{{ qty() }}</span>
                <button (click)="qty.set(qty() + 1)">+</button>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="cta-buttons">
              <button class="btn-add-cart" (click)="addToCart()" [disabled]="!product()!.inStock">
                @if (!product()!.inStock) { Rupture de stock }
                @else if (addedSuccess()) { ✓ Ajouté au panier ! }
                @else { 🛍 Ajouter au panier }
              </button>
              <button class="btn-buy-now" (click)="buyNow()" [disabled]="!product()!.inStock">
                Acheter maintenant →
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="badge-item">
                <span>🚚</span>
                <div>
                  <strong>Livraison rapide</strong>
                  <p>48h en Côte d'Ivoire</p>
                </div>
              </div>
              <div class="badge-item">
                <span>↩️</span>
                <div>
                  <strong>Retour facile</strong>
                  <p>30 jours pour retourner</p>
                </div>
              </div>
              <div class="badge-item">
                <span>🔒</span>
                <div>
                  <strong>Paiement sécurisé</strong>
                  <p>Visa · Mixx · MoovMoney</p>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="tags">
              @for (tag of product()!.tags; track tag) {
                <span class="tag">#{{ tag }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
          <section class="related-section">
            <div class="related-header">
              <h2>Vous aimerez aussi</h2>
            </div>
            <div class="related-grid">
              @for (p of relatedProducts(); track p.id) {
                <dw-product-card [product]="p" />
              }
            </div>
          </section>
        }
      </div>
    } @else {
      <div class="not-found">
        <h2>Produit introuvable</h2>
        <a routerLink="/shop">Retour à la boutique</a>
      </div>
    }
  `,
  styles: [`
    .detail-page { padding-top: 72px; }
    .breadcrumb {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: #999;
      flex-wrap: wrap;
    }
    .breadcrumb a { color: #999; text-decoration: none; transition: color 0.2s; }
    .breadcrumb a:hover { color: #E8772A; }
    .breadcrumb span { color: #ccc; }
    .breadcrumb span:last-child { color: #0D0D0D; font-weight: 600; }

    .detail-layout {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem 4rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }

    /* Visual */
    .detail-visual { position: sticky; top: 90px; }
    .main-image {
      width: 100%;
      aspect-ratio: 4/5;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      margin-bottom: 1rem;
    }
    .product-emoji {
      font-size: 9rem;
      filter: drop-shadow(0 20px 40px rgba(0,0,0,0.3));
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
    .img-badge {
      position: absolute;
      top: 1.25rem;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .img-badge.new { left: 1.25rem; background: #E8772A; color: #fff; }
    .img-badge.sale { right: 1.25rem; background: #1C1B2E; color: #C9A96E; }

    .image-thumbs { display: flex; gap: 0.75rem; }
    .thumb {
      width: 60px; height: 60px;
      border-radius: 12px;
      cursor: pointer;
      border: 3px solid transparent;
      transition: border-color 0.2s, transform 0.2s;
    }
    .thumb.active { border-color: #0D0D0D; transform: scale(1.05); }
    .thumb:hover { border-color: #E8772A; }

    /* Info */
    .detail-info { display: flex; flex-direction: column; gap: 1.5rem; }
    .category-tag {
      display: inline-block;
      background: rgba(232,119,42,0.1);
      border: 1px solid rgba(232,119,42,0.2);
      color: #E8772A;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      width: fit-content;
    }
    .detail-info h1 {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 900;
      color: #0D0D0D;
      margin: 0;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .rating-row { display: flex; align-items: center; gap: 0.5rem; }
    .stars-display { display: flex; gap: 2px; }
    .stars-display span { color: #ddd; font-size: 1.1rem; }
    .stars-display span.filled { color: #E8772A; }
    .rating-val { font-weight: 700; font-size: 0.9rem; color: #0D0D0D; }
    .review-count { color: #999; font-size: 0.85rem; }

    .price-block { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; }
    .price-main { font-size: 2rem; font-weight: 900; color: #0D0D0D; }
    .price-old { font-size: 1.1rem; color: #bbb; text-decoration: line-through; }
    .price-save {
      background: rgba(232,119,42,0.1);
      color: #E8772A;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .description { color: #555; line-height: 1.7; font-size: 0.95rem; margin: 0; }

    .option-group { display: flex; flex-direction: column; gap: 0.6rem; }
    .option-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
    .option-label span { color: #999; }
    .option-label strong { color: #0D0D0D; }

    .color-options { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .color-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 3px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, border-color 0.2s;
    }
    .color-btn.active { border-color: #0D0D0D; transform: scale(1.1); }
    .check { color: #fff; font-size: 0.8rem; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }

    .size-options { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .size-btn {
      min-width: 48px;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      border: 1.5px solid #e0e0e0;
      background: #fff;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      color: #0D0D0D;
      transition: border-color 0.2s, background 0.2s, color 0.2s;
    }
    .size-btn:hover { border-color: #E8772A; }
    .size-btn.active { border-color: #E8772A; background: #E8772A; color: #fff; }
    .error-msg { color: #e53e3e; font-size: 0.8rem; margin: 0; }

    .qty-control {
      display: flex;
      align-items: center;
      gap: 0;
      border: 1.5px solid #e0e0e0;
      border-radius: 10px;
      width: fit-content;
      overflow: hidden;
    }
    .qty-control button {
      width: 42px; height: 42px;
      border: none;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .qty-control button:hover { background: #E8772A; color: #fff; }
    .qty-control span { min-width: 50px; text-align: center; font-weight: 700; font-size: 1rem; }

    .cta-buttons { display: flex; gap: 1rem; flex-direction: column; }
    .btn-add-cart {
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      background: #0D0D0D;
      color: #fff;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      letter-spacing: 0.02em;
    }
    .btn-add-cart:hover:not(:disabled) { background: #1A1A1A; transform: translateY(-2px); }
    .btn-add-cart:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-buy-now {
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      background: #E8772A;
      color: #fff;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      letter-spacing: 0.02em;
    }
    .btn-buy-now:hover:not(:disabled) { background: #C45A0F; transform: translateY(-2px); }
    .btn-buy-now:disabled { opacity: 0.5; cursor: not-allowed; }

    .trust-badges {
      display: flex;
      gap: 1.25rem;
      padding: 1.25rem;
      background: #F9F5F0;
      border-radius: 12px;
    }
    .badge-item { display: flex; align-items: flex-start; gap: 0.6rem; flex: 1; }
    .badge-item > span { font-size: 1.25rem; flex-shrink: 0; }
    .badge-item strong { display: block; font-size: 0.8rem; color: #0D0D0D; margin-bottom: 0.1rem; }
    .badge-item p { margin: 0; font-size: 0.72rem; color: #999; }

    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tag {
      padding: 0.2rem 0.6rem;
      border-radius: 50px;
      background: #f0f0f0;
      color: #666;
      font-size: 0.78rem;
    }

    /* Related */
    .related-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 5rem;
    }
    .related-header { margin-bottom: 2rem; }
    .related-header h2 { font-size: 1.75rem; font-weight: 900; color: #0D0D0D; margin: 0; letter-spacing: -0.02em; }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    .not-found { text-align: center; padding: 8rem 2rem; }
    .not-found h2 { margin-bottom: 1rem; color: #0D0D0D; }
    .not-found a { color: #E8772A; }

    @media (max-width: 900px) {
      .detail-layout { grid-template-columns: 1fr; gap: 2rem; }
      .detail-visual { position: static; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
      .trust-badges { flex-direction: column; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  selectedSize = signal('');
  selectedColor = signal('');
  qty = signal(1);
  sizeError = signal(false);
  addedSuccess = signal(false);

  Math = Math;

  selectedGradient = () => {
    const p = this.product();
    if (!p) return '';
    const color = p.colors.find(c => c.name === this.selectedColor());
    return p.gradient;
  };

  discount(): number {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  categoryLabel(): string {
    const p = this.product();
    if (!p) return '';
    return CATEGORY_LABELS[p.category];
  }

  starsArray(): boolean[] {
    const p = this.product();
    if (!p) return [];
    const r = Math.round(p.rating);
    return Array.from({ length: 5 }, (_, i) => i < r);
  }

  relatedProducts = () => {
    const p = this.product();
    if (!p) return [];
    return this.productService.getByCategory(p.category)
      .filter(rp => rp.id !== p.id)
      .slice(0, 4);
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const p = this.productService.getById(params['id']);
      this.product.set(p);
      if (p) {
        this.selectedColor.set(p.colors[0].name);
        this.selectedSize.set('');
        this.qty.set(1);
        window.scrollTo(0, 0);
      }
    });
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    if (!this.selectedSize()) { this.sizeError.set(true); return; }
    this.sizeError.set(false);
    this.cartService.addItem(p, this.selectedSize(), this.selectedColor(), this.qty());
    this.addedSuccess.set(true);
    setTimeout(() => this.addedSuccess.set(false), 2000);
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;
    if (!this.selectedSize()) { this.sizeError.set(true); return; }
    this.cartService.addItem(p, this.selectedSize(), this.selectedColor(), this.qty());
    this.router.navigate(['/checkout']);
  }
}
