import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CATEGORY_LABELS, ProductCategory } from '../../../core/models/product.model';
import { CartComponent } from '../../../features/cart/cart.component';

@Component({
  selector: 'dw-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CartComponent],
  template: `
    <header class="navbar" [class.scrolled]="scrolled()" [class.menu-open]="mobileOpen()" [class.light-mode]="!theme.isDark()">
      <div class="nav-container">

        <!-- D-Wear Logo -->
        <a routerLink="/" class="nav-logo" aria-label="Diamond Wear – Accueil">
          <img src="logo2.jpg" class="logo-img" alt="Diamond Wear"/>
        </a>

        <!-- Desktop Nav -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
          <div class="nav-dropdown"
               (mouseenter)="openDropdown()"
               (mouseleave)="closeDropdown()">
            <a routerLink="/shop" routerLinkActive="active">Boutique</a>
            <div class="dropdown-menu" [class.visible]="dropdownOpen()">
              @for (cat of categories; track cat.key) {
                <a [routerLink]="['/shop']" [queryParams]="{cat: cat.key}" class="dropdown-item"
                   (click)="dropdownOpen.set(false)">
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
          <!-- Search -->
          <button class="icon-btn" (click)="searchOpen.set(!searchOpen())" aria-label="Rechercher">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <!-- Theme toggle -->
          <button class="icon-btn theme-toggle" (click)="theme.toggle()" [attr.aria-label]="theme.isDark() ? 'Mode clair' : 'Mode sombre'">
            @if (theme.isDark()) {
              <!-- Sun icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            } @else {
              <!-- Moon icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>

          <!-- Cart -->
          <button class="icon-btn cart-btn" (click)="cart.toggleCart()" aria-label="Panier">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            @if (cart.itemCount() > 0) {
              <span class="cart-count">{{ cart.itemCount() }}</span>
            }
          </button>

          <!-- Hamburger -->
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
      background: var(--nav-scrolled-bg, rgba(13,13,13,0.92));
      backdrop-filter: blur(20px);
      box-shadow: var(--nav-scrolled-shadow, 0 4px 30px rgba(0,0,0,0.3));
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

    /* Logo */
    .nav-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-img {
      height: 52px;
      width: auto;
      object-fit: contain;
      display: block;
      border-radius: 10px;
      padding: 4px 8px;
      background: rgba(255,255,255,0.96);
    }

    /* Nav links */
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
    /* Light mode scrolled */
    .navbar.scrolled.light-mode .nav-links a { color: rgba(13,13,13,0.75); }
    .navbar.scrolled.light-mode .nav-links a:hover,
    .navbar.scrolled.light-mode .nav-links a.active { color: #0D0D0D; }

    /* Dropdown */
    .nav-dropdown { position: relative; }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.75rem);
      left: 50%;
      transform: translateX(-50%) translateY(-4px);
      background: #0D0D0D;
      border: 1px solid rgba(232,119,42,0.2);
      border-radius: 12px;
      padding: 0.75rem;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      /* hidden by default */
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    /* Invisible bridge that fills the gap between trigger and menu */
    .dropdown-menu::before {
      content: '';
      position: absolute;
      top: -0.75rem;
      left: 0; right: 0;
      height: 0.75rem;
    }
    .navbar.light-mode .dropdown-menu {
      background: #fff;
      box-shadow: 0 20px 60px rgba(0,0,0,0.12);
      border-color: #E8E8E8;
    }
    .dropdown-menu.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    .dropdown-item {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      color: rgba(255,255,255,0.8) !important;
      font-size: 0.85rem !important;
      transition: background 0.2s, color 0.2s !important;
      white-space: nowrap;
    }
    .navbar.light-mode .dropdown-item { color: rgba(13,13,13,0.7) !important; }
    .dropdown-item:hover { background: rgba(232,119,42,0.15); color: #E8772A !important; }
    .dropdown-item::after { display: none !important; }

    /* Actions */
    .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
    .icon-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.85);
      cursor: pointer;
      padding: 0.45rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
      position: relative;
    }
    .icon-btn:hover { color: #E8772A; background: rgba(232,119,42,0.1); }
    .navbar.scrolled.light-mode .icon-btn { color: rgba(13,13,13,0.7); }
    .navbar.scrolled.light-mode .icon-btn:hover { color: #E8772A; }

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

    .theme-toggle { transition: transform 0.4s ease, color 0.2s, background 0.2s; }
    .theme-toggle:active { transform: rotate(30deg) scale(0.9); }

    /* Hamburger */
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
    .mobile-menu-btn span::after { content: ''; position: absolute; }
    .mobile-menu-btn span::before { top: -7px; }
    .mobile-menu-btn span::after { top: 7px; }
    .mobile-menu-btn span.open { background: transparent; }
    .mobile-menu-btn span.open::before { transform: rotate(45deg); top: 0; }
    .mobile-menu-btn span.open::after { transform: rotate(-45deg); top: 0; }
    .navbar.scrolled.light-mode .mobile-menu-btn span,
    .navbar.scrolled.light-mode .mobile-menu-btn span::before,
    .navbar.scrolled.light-mode .mobile-menu-btn span::after { background: #0D0D0D; }

    /* Search bar */
    .search-bar {
      background: rgba(13,13,13,0.95);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .navbar.light-mode .search-bar { background: rgba(255,255,255,0.98); border-color: #E8E8E8; }
    .search-bar input {
      flex: 1;
      background: none;
      border: none;
      color: #fff;
      font-size: 1.1rem;
      outline: none;
    }
    .navbar.light-mode .search-bar input { color: #0D0D0D; }
    .search-bar input::placeholder { color: rgba(255,255,255,0.4); }
    .navbar.light-mode .search-bar input::placeholder { color: rgba(13,13,13,0.3); }
    .search-bar button {
      background: none; border: none;
      color: rgba(255,255,255,0.6); cursor: pointer; font-size: 1.2rem;
    }
    .navbar.light-mode .search-bar button { color: rgba(13,13,13,0.5); }

    /* Mobile nav */
    .mobile-nav {
      display: flex;
      flex-direction: column;
      background: #0D0D0D;
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .navbar.light-mode .mobile-nav { background: #fff; border-color: #E8E8E8; }
    .mobile-nav a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 0.9rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-weight: 600;
      font-size: 1rem;
    }
    .navbar.light-mode .mobile-nav a { color: #0D0D0D; border-color: #E8E8E8; }
    .mobile-nav .mobile-cat { font-size: 0.85rem; color: rgba(255,255,255,0.5); padding-left: 1rem; }
    .navbar.light-mode .mobile-nav .mobile-cat { color: rgba(13,13,13,0.5); }

    /* Cart overlay */
    .cart-overlay {
      position: fixed; inset: 0;
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
  theme = inject(ThemeService);
  scrolled    = signal(false);
  mobileOpen  = signal(false);
  searchOpen  = signal(false);
  dropdownOpen = signal(false);

  private _closeTimer: ReturnType<typeof setTimeout> | null = null;

  categories = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as ProductCategory,
    label
  }));

  openDropdown(): void {
    if (this._closeTimer) { clearTimeout(this._closeTimer); this._closeTimer = null; }
    this.dropdownOpen.set(true);
  }

  closeDropdown(): void {
    // Small grace period so the mouse can travel from the trigger to the menu
    this._closeTimer = setTimeout(() => this.dropdownOpen.set(false), 120);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }
}
