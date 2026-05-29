import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { CATEGORY_LABELS, CATEGORY_ICONS, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'dw-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ScrollRevealDirective],
  template: `
    <!-- Page Header -->
    <section class="shop-hero">
      <!-- Brand shapes — inspired by the D-Wear logo -->
      <div class="hs hs-orange-tr"></div>
      <div class="hs hs-navy-bl"></div>
      <div class="hs hs-wedge-br"></div>
      <div class="hs hs-gold-tl"></div>

      <!-- Circular ring badge (logo badge echo) -->
      <svg class="hero-ring" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <path id="rp" d="M160,160 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1-236,0"/>
        </defs>
        <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(232,119,42,0.18)" stroke-width="0.8"/>
        <circle cx="160" cy="160" r="108" fill="none" stroke="rgba(232,119,42,0.07)" stroke-width="0.5"/>
        <text font-size="9.5" letter-spacing="7.2" fill="rgba(255,255,255,0.09)"
              font-family="'Space Grotesk', sans-serif" font-weight="700">
          <textPath href="#rp">DIAMOND WEAR • DIAMOND WEAR •</textPath>
        </text>
      </svg>

      <div class="shop-hero-content">
        <div class="hero-eyebrow">
          <span class="eyebrow-rule"></span>
          <span class="eyebrow-label">{{ activeCategory() === 'all' ? 'Collection' : 'Boutique' }}</span>
          <span class="eyebrow-rule"></span>
        </div>
        <h1>{{ pageTitle() }}</h1>
        <p class="hero-count">
          {{ productService.filteredProducts().length }}&nbsp;article{{ productService.filteredProducts().length > 1 ? 's' : '' }}
        </p>
      </div>
    </section>

    <div class="shop-layout">
      <!-- Sidebar Filters -->
      <aside class="sidebar" [class.open]="filterOpen()">
        <div class="sidebar-header">
          <h3>Filtres</h3>
          <button class="sidebar-close" (click)="filterOpen.set(false)">✕</button>
        </div>

        <div class="filter-group">
          <h4>Catégories</h4>
          <div class="filter-options">
            <button class="filter-option" [class.active]="activeCategory() === 'all'" (click)="setCategory('all')">
              <span>Tout voir</span>
              <span class="opt-count">{{ allCount() }}</span>
            </button>
            @for (cat of allCategories; track cat.key) {
              <button class="filter-option" [class.active]="activeCategory() === cat.key" (click)="setCategory(cat.key)">
                <span>{{ cat.icon }} {{ cat.label }}</span>
                <span class="opt-count">{{ getCategoryCount(cat.key) }}</span>
              </button>
            }
          </div>
        </div>

        <div class="filter-group">
          <h4>Prix</h4>
          <div class="price-range">
            <div class="price-inputs">
              <input type="number" [(ngModel)]="minPrice" placeholder="Min" min="0">
              <span>–</span>
              <input type="number" [(ngModel)]="maxPrice" placeholder="Max" min="0">
            </div>
            <button class="apply-price" (click)="applyPriceFilter()">Appliquer</button>
          </div>
        </div>

        <div class="filter-group">
          <h4>Disponibilité</h4>
          <label class="filter-check">
            <input type="checkbox" [(ngModel)]="inStockOnly" (change)="applyFilters()">
            <span>En stock uniquement</span>
          </label>
        </div>

        <div class="filter-group">
          <h4>Trier par</h4>
          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="sort-select">
            <option value="featured">Sélection</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
            <option value="new">Nouveautés</option>
          </select>
        </div>

        <button class="reset-filters" (click)="resetFilters()">Réinitialiser les filtres</button>
      </aside>

      <!-- Main Content -->
      <main class="shop-main">
        <!-- Top Bar -->
        <div class="shop-topbar">
          <button class="filter-toggle" (click)="filterOpen.set(true)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtres
            @if (activeFiltersCount() > 0) {
              <span class="filter-badge">{{ activeFiltersCount() }}</span>
            }
          </button>

          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Rechercher..." [(ngModel)]="searchQuery" (input)="onSearch()">
            @if (searchQuery) {
              <button (click)="clearSearch()">✕</button>
            }
          </div>

          <div class="view-options">
            <button [class.active]="gridCols() === 3" (click)="gridCols.set(3)" title="3 colonnes">▦</button>
            <button [class.active]="gridCols() === 4" (click)="gridCols.set(4)" title="4 colonnes">⊞</button>
          </div>
        </div>

        <!-- Category Chips -->
        <div class="category-chips">
          <button class="chip" [class.active]="activeCategory() === 'all'" (click)="setCategory('all')">Tout</button>
          @for (cat of allCategories; track cat.key) {
            <button class="chip" [class.active]="activeCategory() === cat.key" (click)="setCategory(cat.key)">
              {{ cat.icon }} {{ cat.label }}
            </button>
          }
        </div>

        <!-- Products Grid -->
        @if (displayedProducts().length > 0) {
          <div class="products-grid" [class.cols-3]="gridCols() === 3" [class.cols-4]="gridCols() === 4">
            @for (product of displayedProducts(); track product.id; let i = $index) {
              <dw-product-card [product]="product" dwReveal="slide-up" [dwDelay]="(i % gridCols()) * 80" />
            }
          </div>
        } @else {
          <div class="no-results">
            <span>🔍</span>
            <h3>Aucun article trouvé</h3>
            <p>Essayez de modifier vos filtres ou votre recherche.</p>
            <button class="btn-primary" (click)="resetFilters()">Tout afficher</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .shop-hero {
      background: #0D0D0D;
      padding: 6.5rem 2rem 2.75rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    /* ── Brand shapes ────────────────────────────────────────── */
    .hs { position: absolute; pointer-events: none; }

    /* Orange organic blob — top right (logo large orange element) */
    .hs-orange-tr {
      width: 380px; height: 420px;
      top: -100px; right: -110px;
      background: #E8772A;
      border-radius: 55% 45% 62% 38% / 48% 58% 42% 52%;
      opacity: 0.11;
    }

    /* Navy arc — bottom left (logo navy circle) */
    .hs-navy-bl {
      width: 400px; height: 400px;
      bottom: -220px; left: -90px;
      background: #1C1B2E;
      border-radius: 50%;
      opacity: 0.65;
    }

    /* Orange triangle wedge — bottom right (logo geometric wedge) */
    .hs-wedge-br {
      width: 260px; height: 160px;
      bottom: 0; right: 0;
      background: #E8772A;
      clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      opacity: 0.13;
    }

    /* Gold diamond accent — top left (logo gold teardrop) */
    .hs-gold-tl {
      width: 100px; height: 100px;
      top: 38%; left: 4%;
      background: #C9A96E;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      opacity: 0.14;
    }

    /* Circular ring — logo badge echo, centered behind text */
    .hero-ring {
      position: absolute;
      width: 340px; height: 340px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      overflow: visible;
    }
    /* ──────────────────────────────────────────────────────── */

    .shop-hero-content { position: relative; z-index: 1; }

    /* Eyebrow — "Collection" / "Boutique" with orange rules */
    .hero-eyebrow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.1rem;
    }
    .eyebrow-rule {
      width: 36px;
      height: 1px;
      background: var(--orange);
      opacity: 0.8;
      flex-shrink: 0;
    }
    .eyebrow-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--orange);
    }

    /* Main title */
    .shop-hero h1 {
      font-size: clamp(2rem, 5vw, 3.75rem);
      font-weight: 900;
      color: #fff;
      margin: 0 0 0.9rem;
      letter-spacing: -0.025em;
      line-height: 1.05;
    }

    /* Article count */
    .hero-count {
      color: rgba(255,255,255,0.32);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      margin: 0;
      text-transform: uppercase;
    }

    .shop-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      gap: 2rem;
      align-items: start;
    }

    /* Sidebar */
    .sidebar {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #f0f0f0;
      position: sticky;
      top: 90px;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .sidebar-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #0D0D0D; }
    .sidebar-close {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #999;
    }

    .filter-group { margin-bottom: 1.75rem; }
    .filter-group h4 {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #999;
      margin: 0 0 0.75rem;
    }
    .filter-options { display: flex; flex-direction: column; gap: 0.25rem; }
    .filter-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.88rem;
      color: #555;
      text-align: left;
      transition: background 0.2s, color 0.2s;
    }
    .filter-option:hover { background: #f5f5f5; }
    .filter-option.active { background: rgba(232,119,42,0.1); color: #E8772A; font-weight: 700; }
    .opt-count {
      background: #f0f0f0;
      border-radius: 20px;
      padding: 0.1rem 0.5rem;
      font-size: 0.75rem;
      color: #999;
    }
    .filter-option.active .opt-count { background: rgba(232,119,42,0.15); color: #E8772A; }

    .price-range { display: flex; flex-direction: column; gap: 0.75rem; }
    .price-inputs { display: flex; align-items: center; gap: 0.5rem; }
    .price-inputs input {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      outline: none;
      width: 80px;
    }
    .price-inputs input:focus { border-color: #E8772A; }
    .price-inputs span { color: #999; }
    .apply-price {
      background: #E8772A;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .apply-price:hover { background: #C45A0F; }

    .filter-check {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      font-size: 0.88rem;
      color: #555;
    }
    .filter-check input { accent-color: #E8772A; width: 16px; height: 16px; }

    .sort-select {
      width: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      font-size: 0.88rem;
      outline: none;
      color: #0D0D0D;
      cursor: pointer;
    }
    .sort-select:focus { border-color: #E8772A; }

    .reset-filters {
      width: 100%;
      background: none;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.7rem;
      font-size: 0.85rem;
      color: #999;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }
    .reset-filters:hover { border-color: #E8772A; color: #E8772A; }

    /* Shop Main */
    .shop-main { min-width: 0; }
    .shop-topbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .filter-toggle {
      display: none;
      align-items: center;
      gap: 0.5rem;
      background: #0D0D0D;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      position: relative;
    }
    .filter-badge {
      position: absolute;
      top: -6px; right: -6px;
      background: #E8772A;
      color: #fff;
      border-radius: 50%;
      width: 18px; height: 18px;
      font-size: 0.65rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .search-box {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 50px;
      padding: 0.6rem 1rem;
    }
    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.88rem;
      background: transparent;
      color: #0D0D0D;
    }
    .search-box input::placeholder { color: #bbb; }
    .search-box svg { color: #bbb; flex-shrink: 0; }
    .search-box button { background: none; border: none; cursor: pointer; color: #bbb; font-size: 1rem; line-height: 1; }

    .view-options { display: flex; gap: 0.25rem; }
    .view-options button {
      width: 36px; height: 36px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      background: #fff;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bbb;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .view-options button.active { border-color: #E8772A; color: #E8772A; background: rgba(232,119,42,0.08); }

    .category-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.75rem;
    }
    .chip {
      padding: 0.45rem 1rem;
      border-radius: 50px;
      border: 1px solid #e0e0e0;
      background: #fff;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      color: #555;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .chip:hover { border-color: #E8772A; color: #E8772A; }
    .chip.active { background: #E8772A; border-color: #E8772A; color: #fff; }

    .products-grid {
      display: grid;
      gap: 1.25rem;
    }
    .products-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
    .products-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }

    .no-results {
      text-align: center;
      padding: 5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .no-results span { font-size: 3rem; }
    .no-results h3 { margin: 0; font-size: 1.25rem; color: #0D0D0D; }
    .no-results p { color: #999; margin: 0; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #E8772A;
      color: #fff;
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      font-weight: 800;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #C45A0F; }

    @media (max-width: 1024px) {
      .shop-layout { grid-template-columns: 1fr; }
      .sidebar {
        position: fixed;
        top: 0; left: 0;
        width: 320px;
        height: 100vh;
        z-index: 1200;
        border-radius: 0;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        box-shadow: 10px 0 40px rgba(0,0,0,0.2);
      }
      .sidebar.open { transform: translateX(0); }
      .sidebar-close { display: block; }
      .filter-toggle { display: flex; }
      .products-grid.cols-4 { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 640px) {
      .shop-layout { padding: 1rem; }
      .products-grid.cols-3,
      .products-grid.cols-4 { grid-template-columns: repeat(2, 1fr); }
      .view-options { display: none; }
    }
  `]
})
export class ShopComponent implements OnInit {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  filterOpen = signal(false);
  gridCols = signal(4);
  searchQuery = '';
  minPrice = 0;
  maxPrice = 0;
  inStockOnly = false;
  sortBy = 'featured';

  activeCategory = signal<ProductCategory | 'all'>('all');

  allCategories = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as ProductCategory,
    label,
    icon: CATEGORY_ICONS[key as ProductCategory]
  }));

  allCount = computed(() => this.productService.products().length);

  pageTitle = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return 'Toute la Boutique';
    return CATEGORY_LABELS[cat];
  });

  catIcon = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return '';
    return CATEGORY_ICONS[cat];
  });

  displayedProducts = computed(() => {
    let list = [...this.productService.filteredProducts()];
    if (this.inStockOnly) list = list.filter(p => p.inStock);
    if (this.maxPrice > 0) list = list.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);
    switch (this.sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'new': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  });

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.activeCategory() !== 'all') count++;
    if (this.inStockOnly) count++;
    if (this.maxPrice > 0) count++;
    return count;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['cat']) this.setCategory(params['cat']);
      if (params['filter'] === 'new') this.sortBy = 'new';
      if (params['filter'] === 'promo') this.sortBy = 'featured';
    });
  }

  setCategory(cat: ProductCategory | 'all'): void {
    this.activeCategory.set(cat);
    this.productService.setCategory(cat);
    this.filterOpen.set(false);
  }

  getCategoryCount(cat: ProductCategory): number {
    return this.productService.getByCategory(cat).length;
  }

  onSearch(): void {
    this.productService.setSearch(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.productService.setSearch('');
  }

  applyPriceFilter(): void {}

  applyFilters(): void {}

  resetFilters(): void {
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.inStockOnly = false;
    this.sortBy = 'featured';
    this.setCategory('all');
    this.productService.setSearch('');
  }
}
