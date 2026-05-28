import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { CATEGORY_LABELS, ProductCategory } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'dw-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, ScrollRevealDirective],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg-pattern"></div>
      <div class="hero-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-tag">Collection 2026 ◆</span>
          <h1 class="hero-title">
            <span class="title-line line-1">ÉLÈVE</span>
            <span class="title-line line-2">TON <em>STYLE</em></span>
            <span class="title-line line-3">AFRICAIN</span>
          </h1>
          <p class="hero-desc">
            La mode africaine réinventée. Des pièces qui racontent votre histoire,
            portées avec fierté et audace.
          </p>
          <div class="hero-ctas">
            <a routerLink="/shop" class="btn-primary">
              <span>Découvrir la Collection</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a routerLink="/shop" [queryParams]="{cat:'tenues-africaines'}" class="btn-ghost">Tenues Africaines</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-num">2K+</span>
              <span class="stat-label">Clients satisfaits</span>
            </div>
            <div class="stat-divider">◆</div>
            <div class="stat">
              <span class="stat-num">150+</span>
              <span class="stat-label">Références</span>
            </div>
            <div class="stat-divider">◆</div>
            <div class="stat">
              <span class="stat-num">100%</span>
              <span class="stat-label">Africain</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-product-card">
            <div class="hpc-inner">
              <div class="hpc-image">
                <span class="hpc-icon">👘</span>
                <div class="hpc-badge">NEW</div>
              </div>
              <div class="hpc-info">
                <p class="hpc-name">Agbada Royal Black Gold</p>
                <p class="hpc-price">95 000 FCFA</p>
              </div>
            </div>
          </div>
          <div class="hero-floating-card float-1">
            <span>🧢</span>
            <div>
              <p>Diamond Cap</p>
              <p class="fc-price">15 000 FCFA</p>
            </div>
          </div>
          <div class="hero-floating-card float-2">
            <span>👟</span>
            <div>
              <p>Sneakers Kente</p>
              <p class="fc-price">48 000 FCFA</p>
            </div>
          </div>
          <div class="hero-big-icon">◆</div>
        </div>
      </div>
      <div class="hero-scroll-hint">
        <span>Scroller</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- MARQUEE -->
    <div class="marquee-strip">
      <div class="marquee-track">
        @for (item of marqueeItems; track item) {
          <span class="marquee-item">{{ item }}</span>
        }
        @for (item of marqueeItems; track item) {
          <span class="marquee-item">{{ item }}</span>
        }
      </div>
    </div>

    <!-- CATEGORIES -->
    <section class="categories-section">
      <div class="section-container">
        <div class="section-header" dwReveal="slide-up">
          <span class="section-tag">Collections</span>
          <h2>Explorez nos <em>Univers</em></h2>
          <p>De la rue à la cérémonie, Diamond Wear habille chaque moment.</p>
        </div>
        <div class="categories-grid">
          @for (cat of categories; track cat.key; let i = $index) {
            <a [routerLink]="['/shop']" [queryParams]="{cat: cat.key}" class="cat-card" [ngStyle]="{'--cat-color': cat.color}" dwReveal="scale" [dwDelay]="i * 80">
              <div class="cat-card-bg"></div>
              <span class="cat-icon">{{ cat.icon }}</span>
              <div class="cat-info">
                <h3>{{ cat.label }}</h3>
                <span class="cat-count">{{ cat.count }} articles →</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="featured-section">
      <div class="section-container">
        <div class="section-header" dwReveal="slide-up">
          <span class="section-tag">Sélection</span>
          <h2>Nos <em>Coups de Cœur</em></h2>
          <p>Les pièces les plus appréciées par notre communauté.</p>
        </div>
        <div class="products-grid">
          @for (product of productService.featuredProducts(); track product.id; let i = $index) {
            <dw-product-card [product]="product" dwReveal="slide-up" [dwDelay]="(i % 4) * 100" />
          }
        </div>
        <div class="section-cta" dwReveal="fade">
          <a routerLink="/shop" class="btn-outline">Voir tous les articles</a>
        </div>
      </div>
    </section>

    <!-- AFRICAN COLLECTION SPOTLIGHT -->
    <section class="spotlight">
      <div class="spotlight-left">
        <div class="spotlight-pattern"></div>
        <div class="spotlight-content" dwReveal="slide-right">
          <span class="section-tag light">Heritage · 2026</span>
          <h2>La Collection<br><em>Africaine</em></h2>
          <p>Boubous brodés main, Dashikis contemporains, Agbadas royaux... Chaque pièce est une œuvre d'art qui célèbre notre richesse culturelle.</p>
          <div class="spotlight-features">
            <div class="sf-item">
              <span class="sf-icon">🧵</span>
              <div>
                <strong>Broderie Main</strong>
                <p>Artisanat traditionnel</p>
              </div>
            </div>
            <div class="sf-item">
              <span class="sf-icon">🌍</span>
              <div>
                <strong>100% Africain</strong>
                <p>Fièrement fabriqué en Afrique</p>
              </div>
            </div>
            <div class="sf-item">
              <span class="sf-icon">✨</span>
              <div>
                <strong>Pièces Uniques</strong>
                <p>Éditions limitées et exclusives</p>
              </div>
            </div>
          </div>
          <a routerLink="/shop" [queryParams]="{cat:'tenues-africaines'}" class="btn-primary">
            <span>Voir la Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
      <div class="spotlight-right" dwReveal="slide-left">
        <div class="african-grid">
          @for (p of africanProducts(); track p.id) {
            <a [routerLink]="['/product', p.id]" class="agrid-card" [style.background]="p.gradient">
              <span>{{ p.icon }}</span>
              <div class="agrid-info">
                <p>{{ p.name }}</p>
                <span>{{ p.price | number:'1.0-0' }} FCFA</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- STATS BANNER -->
    <section class="stats-banner">
      <div class="stats-pattern"></div>
      <div class="section-container">
        <div class="stats-grid">
          @for (stat of stats; track stat.label) {
            <div class="stat-card" dwReveal="scale">
              <span class="stat-big">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
              <p>{{ stat.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    <section class="new-arrivals">
      <div class="section-container">
        <div class="section-header" dwReveal="slide-up">
          <span class="section-tag">Fresh Drop</span>
          <h2>Dernières <em>Nouveautés</em></h2>
        </div>
        <div class="products-grid grid-4">
          @for (product of productService.newProducts(); track product.id; let i = $index) {
            <dw-product-card [product]="product" dwReveal="slide-up" [dwDelay]="i * 100" />
          }
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter">
      <div class="newsletter-pattern"></div>
      <div class="newsletter-content" dwReveal="scale">
        <span class="section-tag light">Newsletter</span>
        <h2>Rejoins la <em>Tribu Diamond</em></h2>
        <p>Reçois en avant-première les nouveautés, promos exclusives et inspirations mode africaine.</p>
        <form class="newsletter-form" (submit)="$event.preventDefault(); onSubscribe()">
          <input type="email" placeholder="Votre adresse email" [class.success]="subscribed()">
          <button type="submit" class="btn-primary">
            @if (!subscribed()) { <span>S'abonner</span> }
            @else { <span>✓ Inscrit !</span> }
          </button>
        </form>
        <p class="newsletter-hint">Pas de spam. Désinscription en 1 clic.</p>
      </div>
    </section>
  `,
  styles: [`
    /* ===== HERO ===== */
    .hero {
      min-height: 100vh;
      background: #0D0D0D;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 0 2rem;
    }
    .hero-bg-pattern {
      position: absolute;
      inset: 0;
      background-image:
        repeating-conic-gradient(rgba(232,119,42,0.07) 0 90deg, transparent 90deg 180deg) 0 0 / 60px 60px,
        repeating-conic-gradient(rgba(201,169,110,0.04) 0 90deg, transparent 90deg 180deg) 30px 30px / 60px 60px;
      pointer-events: none;
    }
    .hero-shapes { position: absolute; inset: 0; pointer-events: none; }
    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }
    .shape-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, #E8772A, transparent);
      top: -200px; right: -100px;
      animation: float1 8s ease-in-out infinite;
    }
    .shape-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, #C9A96E, transparent);
      bottom: -100px; left: 10%;
      animation: float2 10s ease-in-out infinite;
      opacity: 0.2;
    }
    .shape-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, #1C1B2E, transparent);
      top: 30%; right: 30%;
      opacity: 0.5;
    }
    @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,40px) scale(1.1)} }
    @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }

    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      padding-top: 5rem;
      position: relative;
      z-index: 1;
    }

    .hero-text { display: flex; flex-direction: column; gap: 1.5rem; }
    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(232,119,42,0.15);
      border: 1px solid rgba(232,119,42,0.3);
      color: #E8772A;
      padding: 0.4rem 1rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      width: fit-content;
    }
    .hero-title {
      margin: 0;
      line-height: 1;
      display: flex;
      flex-direction: column;
    }
    .title-line {
      font-size: clamp(3.5rem, 7vw, 7rem);
      font-weight: 900;
      color: #fff;
      letter-spacing: -0.03em;
      display: block;
      overflow: hidden;
    }
    .title-line em {
      font-style: normal;
      color: #E8772A;
      -webkit-text-stroke: 0;
    }
    .title-line.line-1 { animation: slideIn 0.8s ease 0.2s both; }
    .title-line.line-2 { animation: slideIn 0.8s ease 0.4s both; }
    .title-line.line-3 {
      animation: slideIn 0.8s ease 0.6s both;
      color: transparent;
      -webkit-text-stroke: 2px rgba(255,255,255,0.3);
    }
    @keyframes slideIn { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

    .hero-desc {
      color: rgba(255,255,255,0.6);
      font-size: 1.05rem;
      line-height: 1.7;
      max-width: 440px;
      margin: 0;
      animation: fadeUp 0.8s ease 0.8s both;
    }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

    .hero-ctas {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      animation: fadeUp 0.8s ease 1s both;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #E8772A;
      color: #fff;
      padding: 0.9rem 1.75rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 800;
      font-size: 0.9rem;
      letter-spacing: 0.03em;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      border: none;
      cursor: pointer;
    }
    .btn-primary:hover { background: #C45A0F; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(232,119,42,0.4); }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.9rem 1.75rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.8);
      border: 1px solid rgba(255,255,255,0.2);
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .btn-ghost:hover { border-color: #E8772A; color: #E8772A; background: rgba(232,119,42,0.1); }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      animation: fadeUp 0.8s ease 1.2s both;
    }
    .stat { display: flex; flex-direction: column; }
    .stat-num { font-size: 1.5rem; font-weight: 900; color: #fff; line-height: 1; }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 0.2rem; }
    .stat-divider { color: #E8772A; font-size: 0.6rem; }

    /* Hero Visual */
    .hero-visual {
      position: relative;
      height: 600px;
      animation: fadeUp 0.8s ease 0.6s both;
    }
    .hero-product-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 280px;
    }
    .hpc-inner {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }
    .hpc-image {
      height: 320px;
      background: linear-gradient(135deg, #1C1B2E, #0D0D0D, #C9A96E);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .hpc-icon {
      font-size: 6rem;
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
      animation: bobbing 3s ease-in-out infinite;
    }
    @keyframes bobbing { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
    .hpc-badge {
      position: absolute;
      top: 1rem; left: 1rem;
      background: #E8772A;
      color: #fff;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .hpc-info { padding: 1.25rem; }
    .hpc-name { color: #fff; font-weight: 700; font-size: 0.95rem; margin: 0 0 0.25rem; }
    .hpc-price { color: #E8772A; font-weight: 800; font-size: 1.1rem; margin: 0; }

    .hero-floating-card {
      position: absolute;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      backdrop-filter: blur(10px);
      white-space: nowrap;
    }
    .hero-floating-card span { font-size: 1.75rem; }
    .hero-floating-card p { margin: 0; font-size: 0.82rem; color: rgba(255,255,255,0.8); font-weight: 600; }
    .fc-price { color: #C9A96E !important; font-weight: 800 !important; font-size: 0.9rem !important; }
    .float-1 {
      top: 8%;
      right: 0;
      animation: floatCard1 6s ease-in-out infinite;
    }
    .float-2 {
      bottom: 10%;
      left: -10px;
      animation: floatCard2 7s ease-in-out infinite;
    }
    @keyframes floatCard1 { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-15px) rotate(-1deg)} }
    @keyframes floatCard2 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-20px) rotate(1deg)} }

    .hero-big-icon {
      position: absolute;
      bottom: 5%;
      right: -5%;
      font-size: 8rem;
      color: rgba(232,119,42,0.08);
      font-weight: 900;
      pointer-events: none;
      animation: slowSpin 20s linear infinite;
    }
    @keyframes slowSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .hero-scroll-hint {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.4);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      animation: fadeUp 1s ease 1.5s both;
    }
    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
      animation: scrollLine 1.5s ease-in-out infinite;
    }
    @keyframes scrollLine { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

    /* ===== MARQUEE ===== */
    .marquee-strip {
      background: #E8772A;
      padding: 0.9rem 0;
      overflow: hidden;
    }
    .marquee-track {
      display: flex;
      gap: 0;
      animation: marquee 25s linear infinite;
      width: max-content;
    }
    .marquee-item {
      color: #fff;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 0 2rem;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .marquee-item::after {
      content: '◆';
      font-size: 0.5rem;
      color: rgba(255,255,255,0.5);
    }
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    /* ===== SHARED SECTION STYLES ===== */
    .section-container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
    .section-header { text-align: center; margin-bottom: 3.5rem; }
    .section-tag {
      display: inline-block;
      background: rgba(232,119,42,0.1);
      border: 1px solid rgba(232,119,42,0.2);
      color: #E8772A;
      padding: 0.3rem 0.9rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .section-tag.light { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
    .section-header h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 900;
      color: #0D0D0D;
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    .section-header h2 em { font-style: normal; color: #E8772A; }
    .section-header p { color: #666; font-size: 1rem; max-width: 500px; margin: 0 auto; line-height: 1.7; }

    /* ===== CATEGORIES ===== */
    .categories-section { padding: 6rem 0; background: #F9F5F0; }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    .cat-card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      padding: 2rem 1.5rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 2px solid transparent;
      min-height: 160px;
    }
    .cat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.1);
      border-color: var(--cat-color, #E8772A);
    }
    .cat-card-bg {
      position: absolute;
      inset: 0;
      background: var(--cat-color, #E8772A);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .cat-card:hover .cat-card-bg { opacity: 0.05; }
    .cat-icon {
      font-size: 2.5rem;
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }
    .cat-card:hover .cat-icon { transform: scale(1.2) rotate(-5deg); }
    .cat-info { position: relative; z-index: 1; }
    .cat-info h3 { margin: 0 0 0.25rem; font-size: 1rem; font-weight: 800; color: #0D0D0D; }
    .cat-count { font-size: 0.8rem; color: #999; font-weight: 600; transition: color 0.2s; }
    .cat-card:hover .cat-count { color: var(--cat-color, #E8772A); }

    /* ===== FEATURED PRODUCTS ===== */
    .featured-section { padding: 6rem 0; background: #fff; }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .products-grid.grid-4 { grid-template-columns: repeat(4, 1fr); }
    .section-cta { text-align: center; margin-top: 3rem; }
    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: 2px solid #0D0D0D;
      color: #0D0D0D;
      padding: 0.9rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 800;
      font-size: 0.9rem;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .btn-outline:hover { background: #0D0D0D; color: #fff; }

    /* ===== SPOTLIGHT ===== */
    .spotlight {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 600px;
    }
    .spotlight-left {
      background: #1C1B2E;
      padding: 5rem 4rem;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .spotlight-pattern {
      position: absolute;
      inset: 0;
      background-image:
        repeating-conic-gradient(rgba(232,119,42,0.08) 0 90deg, transparent 90deg 180deg) 0 0 / 40px 40px;
      pointer-events: none;
    }
    .spotlight-content { position: relative; z-index: 1; max-width: 480px; }
    .spotlight-content h2 {
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      font-weight: 900;
      color: #fff;
      margin: 0.5rem 0 1.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .spotlight-content h2 em { font-style: normal; color: #E8772A; }
    .spotlight-content > p { color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 2rem; font-size: 0.95rem; }

    .spotlight-features { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2.5rem; }
    .sf-item { display: flex; align-items: center; gap: 1rem; }
    .sf-icon { font-size: 1.5rem; width: 44px; height: 44px; background: rgba(232,119,42,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .sf-item strong { display: block; color: #fff; font-size: 0.9rem; font-weight: 700; margin-bottom: 0.1rem; }
    .sf-item p { color: rgba(255,255,255,0.45); font-size: 0.8rem; margin: 0; }

    .spotlight-right { background: #0D0D0D; display: flex; align-items: center; justify-content: center; padding: 3rem; }
    .african-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; max-width: 400px; }
    .agrid-card {
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-decoration: none;
      transition: transform 0.3s ease;
      min-height: 150px;
      position: relative;
      overflow: hidden;
    }
    .agrid-card:hover { transform: scale(1.03); }
    .agrid-card span { font-size: 2.5rem; }
    .agrid-info { margin-top: auto; }
    .agrid-info p { margin: 0 0 0.2rem; color: #fff; font-weight: 700; font-size: 0.82rem; }
    .agrid-info span { color: rgba(255,255,255,0.7); font-size: 0.78rem; font-weight: 600; }

    /* ===== STATS ===== */
    .stats-banner { background: #E8772A; padding: 5rem 0; position: relative; overflow: hidden; }
    .stats-pattern {
      position: absolute;
      inset: 0;
      background-image: repeating-conic-gradient(rgba(0,0,0,0.08) 0 90deg, transparent 90deg 180deg) 0 0 / 30px 30px;
      pointer-events: none;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      position: relative;
    }
    .stat-card {
      text-align: center;
      color: #fff;
      padding: 2rem 1rem;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .stat-big { display: block; font-size: 3rem; font-weight: 900; line-height: 1; margin-bottom: 0.5rem; }
    .stat-card .stat-label { display: block; font-weight: 700; font-size: 1rem; margin-bottom: 0.4rem; }
    .stat-card p { margin: 0; font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.5; }

    /* ===== NEW ARRIVALS ===== */
    .new-arrivals { padding: 6rem 0; background: #F9F5F0; }

    /* ===== NEWSLETTER ===== */
    .newsletter {
      background: #0D0D0D;
      padding: 6rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .newsletter-pattern {
      position: absolute;
      inset: 0;
      background-image: repeating-conic-gradient(rgba(232,119,42,0.06) 0 90deg, transparent 90deg 180deg) 0 0 / 50px 50px;
      pointer-events: none;
    }
    .newsletter-content { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
    .newsletter-content h2 {
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      font-weight: 900;
      color: #fff;
      margin: 0.5rem 0 1rem;
      letter-spacing: -0.02em;
    }
    .newsletter-content h2 em { font-style: normal; color: #E8772A; }
    .newsletter-content > p { color: rgba(255,255,255,0.5); margin-bottom: 2rem; line-height: 1.7; }
    .newsletter-form {
      display: flex;
      gap: 0.75rem;
      max-width: 480px;
      margin: 0 auto 1rem;
    }
    .newsletter-form input {
      flex: 1;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 50px;
      padding: 0.9rem 1.5rem;
      color: #fff;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .newsletter-form input::placeholder { color: rgba(255,255,255,0.35); }
    .newsletter-form input:focus { border-color: #E8772A; }
    .newsletter-form input.success { border-color: #4CAF50; }
    .newsletter-hint { color: rgba(255,255,255,0.3); font-size: 0.78rem; margin: 0; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1200px) {
      .categories-grid { grid-template-columns: repeat(3, 1fr); }
      .products-grid { grid-template-columns: repeat(3, 1fr); }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .spotlight { grid-template-columns: 1fr; }
      .spotlight-right { display: none; }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .products-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .categories-grid { grid-template-columns: 1fr 1fr; }
      .products-grid { grid-template-columns: 1fr 1fr; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .newsletter-form { flex-direction: column; }
    }
  `]
})
export class HomeComponent {
  productService = inject(ProductService);
  private cartService = inject(CartService);

  subscribed = signal(false);

  marqueeItems = [
    'Diamond Wear', 'Mode Africaine', 'Élève ton Style', 'Collection 2026',
    'Fait en Afrique', 'Premium Quality', 'Streetwear Africain', 'D-Wear'
  ];

  categories = [
    { key: 'casquettes' as ProductCategory, label: 'Casquettes', icon: '🧢', color: '#E8772A', count: 4 },
    { key: 'bonnets' as ProductCategory, label: 'Bonnets', icon: '🎩', color: '#C9A96E', count: 3 },
    { key: 'tshirts' as ProductCategory, label: 'T-Shirts', icon: '👕', color: '#1C1B2E', count: 6 },
    { key: 'manches-longues' as ProductCategory, label: 'Manches Longues', icon: '👔', color: '#E8772A', count: 4 },
    { key: 'pulls' as ProductCategory, label: 'Pulls & Hoodies', icon: '🧥', color: '#8B4513', count: 3 },
    { key: 'tenues-africaines' as ProductCategory, label: 'Tenues Africaines', icon: '👘', color: '#C9A96E', count: 5 },
    { key: 'chaussures' as ProductCategory, label: 'Chaussures', icon: '👟', color: '#0D0D0D', count: 4 },
  ];

  stats = [
    { value: '2 000+', label: 'Clients', desc: 'Clients satisfaits à travers l\'Afrique' },
    { value: '150+', label: 'Références', desc: 'Articles dans notre catalogue permanent' },
    { value: '7', label: 'Catégories', desc: 'Du casual au cérémonial africain' },
    { value: '100%', label: 'Africain', desc: 'Conçu et fabriqué fièrement en Afrique' },
  ];

  readonly africanProducts = computed(() =>
    this.productService.getByCategory('tenues-africaines').slice(0, 4)
  );

  onSubscribe(): void {
    this.subscribed.set(true);
  }
}
