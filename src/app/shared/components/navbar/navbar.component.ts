import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CATEGORY_LABELS, ProductCategory } from '../../../core/models/product.model';
import { CartComponent } from '../../../features/cart/cart.component';

@Component({
  selector: 'dw-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CartComponent],
  template: `
    <header class="navbar" [class.scrolled]="scrolled()" [class.menu-open]="mobileOpen()">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/" class="nav-logo">
          <span class="logo-diamond">◆</span>
          <span class="logo-text">Diamond<span>Wear</span></span>
        </a>

        <!-- Desktop Nav -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
          <div class="nav-dropdown">
            <a routerLink="/shop" routerLinkActive="active">Boutique</a>
            <div class="dropdown-menu">
              @for (cat of categories; track cat.key) {
                <a [routerLink]="['/shop']" [queryParams]="{cat: cat.key}" class="dropdown-item">
                  {{ cat.label }}
                </a>
              }
            </div>
          </div>
          <a routerLink="/shop" [queryParams]="{filter:'new'}">Nouveautés</a>
          <a routerLink="/shop" [queryParams]="{filter:'promo'}">Promos</a>
        </nav>

        <!-- Right Actions -->
        <div class="nav-actions">
          <button class="search-btn" (click)="searchOpen.set(!searchOpen())" aria-label="Rechercher">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="cart-btn" (click)="cart.toggleCart()" aria-label="Panier">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            @if (cart.itemCount() > 0) {
              <span class="cart-count">{{ cart.itemCount() }}</span>
            }
          </button>
          <button class="mobile-menu-btn" (click)="mobileOpen.update(v => !v)" aria-label="Menu">
            <span [class.open]="mobileOpen()"></span>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      @if (searchOpen()) {
        <div class="search-bar">
          <input type="text" placeholder="Rechercher un article..." autofocus (keydown.escape)="searchOpen.set(false)">
          <button (click)="searchOpen.set(false)">✕</button>
        </div>
      }

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <nav class="mobile-nav">
          <a routerLink="/" (click)="mobileOpen.set(false)">Accueil</a>
          <a routerLink="/shop" (click)="mobileOpen.set(false)">Boutique</a>
          @for (cat of categories; track cat.key) {
            <a [routerLink]="['/shop']" [queryParams]="{cat: cat.key}" (click)="mobileOpen.set(false)" class="mobile-cat">
              {{ cat.label }}
            </a>
          }
          <a routerLink="/shop" [queryParams]="{filter:'new'}" (click)="mobileOpen.set(false)">Nouveautés</a>
          <a routerLink="/shop" [queryParams]="{filter:'promo'}" (click)="mobileOpen.set(false)">Promos</a>
        </nav>
      }
    </header>

    <!-- Cart Drawer -->
    <dw-cart />
    @if (cart.isOpen()) {
      <div class="cart-overlay" (click)="cart.closeCart()"></div>
    }
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      background: transparent;
      transition: background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s;
      padding: 0 2rem;
    }
    .navbar.scrolled {
      background: rgba(13,13,13,0.92);
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 30px rgba(0,0,0,0.3);
    }
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #fff;
      font-weight: 900;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }
    .logo-diamond {
      color: #E8772A;
      font-size: 1.5rem;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    .logo-text span { color: #E8772A; }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }
    .nav-links a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.03em;
      transition: color 0.2s;
      position: relative;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px; left: 0;
      width: 0; height: 2px;
      background: #E8772A;
      transition: width 0.3s ease;
    }
    .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
    .nav-links a:hover, .nav-links a.active { color: #fff; }

    .nav-dropdown { position: relative; }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 1rem);
      left: 50%;
      transform: translateX(-50%);
      background: #0D0D0D;
      border: 1px solid rgba(232,119,42,0.2);
      border-radius: 12px;
      padding: 0.75rem;
      min-width: 200px;
      display: none;
      flex-direction: column;
      gap: 0.25rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .nav-dropdown:hover .dropdown-menu { display: flex; }
    .dropdown-item {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      color: rgba(255,255,255,0.8) !important;
      font-size: 0.85rem !important;
      transition: background 0.2s, color 0.2s !important;
      white-space: nowrap;
    }
    .dropdown-item:hover { background: rgba(232,119,42,0.15); color: #E8772A !important; }
    .dropdown-item::after { display: none !important; }

    .nav-actions { display: flex; align-items: center; gap: 1rem; }
    .search-btn, .cart-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.85);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
      position: relative;
    }
    .search-btn:hover, .cart-btn:hover { color: #E8772A; background: rgba(232,119,42,0.1); }
    .cart-count {
      position: absolute;
      top: 0; right: 0;
      background: #E8772A;
      color: #fff;
      border-radius: 50%;
      width: 18px; height: 18px;
      font-size: 0.65rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pop 0.3s ease;
    }
    @keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      width: 36px; height: 36px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0;
    }
    .mobile-menu-btn span,
    .mobile-menu-btn span::before,
    .mobile-menu-btn span::after {
      display: block;
      width: 24px; height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all 0.3s ease;
      position: relative;
    }
    .mobile-menu-btn span::before,
    .mobile-menu-btn span::after {
      content: '';
      position: absolute;
    }
    .mobile-menu-btn span::before { top: -7px; }
    .mobile-menu-btn span::after { top: 7px; }
    .mobile-menu-btn span.open { background: transparent; }
    .mobile-menu-btn span.open::before { transform: rotate(45deg); top: 0; }
    .mobile-menu-btn span.open::after { transform: rotate(-45deg); top: 0; }

    .search-bar {
      background: rgba(13,13,13,0.95);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 100%;
    }
    .search-bar input {
      flex: 1;
      background: none;
      border: none;
      color: #fff;
      font-size: 1.1rem;
      outline: none;
    }
    .search-bar input::placeholder { color: rgba(255,255,255,0.4); }
    .search-bar button {
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      font-size: 1.2rem;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      background: #0D0D0D;
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .mobile-nav a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 0.9rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-weight: 600;
      font-size: 1rem;
    }
    .mobile-nav .mobile-cat {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.5);
      padding-left: 1rem;
    }

    .cart-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1099;
      backdrop-filter: blur(4px);
    }

    @media (max-width: 900px) {
      .nav-links { display: none; }
      .mobile-menu-btn { display: flex; }
    }
  `]
})
export class NavbarComponent {
  cart = inject(CartService);
  scrolled = signal(false);
  mobileOpen = signal(false);
  searchOpen = signal(false);

  categories = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as ProductCategory,
    label
  }));

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }
}
