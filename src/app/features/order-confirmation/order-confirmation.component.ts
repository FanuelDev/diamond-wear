import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'dw-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-page">
      <div class="confetti-bg"></div>

      @if (order()) {
        <div class="confirmation-card">
          <div class="success-icon">
            <div class="icon-ring"></div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <h1>Commande confirmée ! 🎉</h1>
          <p class="subtitle">Merci {{ order()!.customer.firstName }} ! Votre commande a été enregistrée avec succès.</p>

          <div class="order-id-box">
            <span class="order-label">Numéro de commande</span>
            <strong class="order-id">{{ order()!.id }}</strong>
          </div>

          <div class="confirmation-details">
            <div class="detail-block">
              <h3>Livraison à</h3>
              <p>{{ order()!.customer.firstName }} {{ order()!.customer.lastName }}</p>
              <p>{{ order()!.customer.address }}</p>
              <p>{{ order()!.customer.city }}, {{ order()!.customer.country }}</p>
              <p>{{ order()!.customer.phone }}</p>
            </div>

            <div class="detail-block">
              <h3>Paiement</h3>
              @if (order()!.payment.method === 'visa') {
                <p>Carte Visa</p>
                <p>•••• •••• •••• {{ $any(order()!.payment).cardNumber?.slice(-4) }}</p>
              } @else if (order()!.payment.method === 'mixx') {
                <p>Mixx by Yas</p>
                <p>{{ $any(order()!.payment).phoneNumber }}</p>
              } @else {
                <p>Moov Money</p>
                <p>{{ $any(order()!.payment).phoneNumber }}</p>
              }
              <p class="status-tag">✓ Paiement validé</p>
            </div>

            <div class="detail-block">
              <h3>Résumé</h3>
              <div class="amount-row">
                <span>Sous-total</span>
                <span>{{ order()!.subtotal | number:'1.0-0' }} FCFA</span>
              </div>
              <div class="amount-row">
                <span>Livraison</span>
                <span>{{ order()!.shipping === 0 ? 'Gratuite' : (order()!.shipping | number:'1.0-0') + ' FCFA' }}</span>
              </div>
              <div class="amount-row total">
                <span>Total payé</span>
                <span>{{ order()!.total | number:'1.0-0' }} FCFA</span>
              </div>
            </div>
          </div>

          <div class="order-items">
            <h3>Articles commandés</h3>
            <div class="items-list">
              @for (item of order()!.items; track $index) {
                <div class="conf-item">
                  <div class="ci-img" [style.background]="item.product.gradient">
                    <span>{{ item.product.icon }}</span>
                  </div>
                  <div class="ci-info">
                    <p>{{ item.product.name }}</p>
                    <p class="ci-meta">{{ item.selectedSize }} · {{ item.selectedColor }} · Qté: {{ item.quantity }}</p>
                  </div>
                  <p class="ci-price">{{ item.product.price * item.quantity | number:'1.0-0' }} FCFA</p>
                </div>
              }
            </div>
          </div>

          <div class="tracking-steps">
            <h3>Suivi de commande</h3>
            <div class="steps-track">
              <div class="track-step done">
                <div class="ts-dot"></div>
                <div class="ts-info">
                  <strong>Commande confirmée</strong>
                  <span>{{ order()!.createdAt | date:'d MMM yyyy, HH:mm' }}</span>
                </div>
              </div>
              <div class="track-line done"></div>
              <div class="track-step">
                <div class="ts-dot pending"></div>
                <div class="ts-info">
                  <strong>En préparation</strong>
                  <span>Dans les prochaines heures</span>
                </div>
              </div>
              <div class="track-line"></div>
              <div class="track-step">
                <div class="ts-dot pending"></div>
                <div class="ts-info">
                  <strong>Expédié</strong>
                  <span>Sous 24-48h</span>
                </div>
              </div>
              <div class="track-line"></div>
              <div class="track-step">
                <div class="ts-dot pending"></div>
                <div class="ts-info">
                  <strong>Livré</strong>
                  <span>Estimé dans 2-3 jours</span>
                </div>
              </div>
            </div>
          </div>

          <div class="confirmation-ctas">
            <a routerLink="/shop" class="btn-shop-again">
              Continuer mes achats →
            </a>
            <a routerLink="/" class="btn-home">Retour à l'accueil</a>
          </div>

          <div class="confirmation-note">
            <p>📧 Un email de confirmation a été envoyé à <strong>{{ order()!.customer.email }}</strong></p>
            <p>📞 Pour toute question : <strong>+225 07 00 00 00 00</strong></p>
          </div>
        </div>
      } @else {
        <div class="no-order">
          <p>Aucune commande trouvée.</p>
          <a routerLink="/">Retour à l'accueil</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 100vh;
      background: #F9F5F0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 3rem 1rem;
      position: relative;
      overflow: hidden;
    }
    .confetti-bg {
      position: fixed;
      inset: 0;
      background-image:
        radial-gradient(circle at 20% 20%, rgba(232,119,42,0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(201,169,110,0.08) 0%, transparent 50%);
      pointer-events: none;
    }

    .confirmation-card {
      background: #fff;
      border-radius: 24px;
      padding: 3rem;
      max-width: 700px;
      width: 100%;
      box-shadow: 0 20px 80px rgba(0,0,0,0.1);
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s ease both;
    }
    @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

    .success-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E8772A, #C45A0F);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      position: relative;
    }
    .icon-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 3px solid rgba(232,119,42,0.3);
      animation: ripple 1.5s ease-out 0.3s both;
    }
    @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(1.5);opacity:0} }

    .confirmation-card h1 {
      text-align: center;
      font-size: 2rem;
      font-weight: 900;
      color: #0D0D0D;
      margin: 0 0 0.75rem;
      letter-spacing: -0.02em;
    }
    .subtitle { text-align: center; color: #666; font-size: 1rem; margin: 0 0 2rem; }

    .order-id-box {
      background: #F9F5F0;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      border: 1px dashed #E8772A;
    }
    .order-label { font-size: 0.8rem; color: #999; font-weight: 600; }
    .order-id { font-size: 1.05rem; color: #E8772A; font-family: monospace; letter-spacing: 0.05em; }

    .confirmation-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-block h3 {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #E8772A;
      margin: 0 0 0.75rem;
    }
    .detail-block p { margin: 0 0 0.2rem; font-size: 0.87rem; color: #555; }
    .status-tag {
      color: #4CAF50 !important;
      font-weight: 700 !important;
      margin-top: 0.5rem !important;
    }
    .amount-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.87rem;
      color: #555;
      margin-bottom: 0.3rem;
    }
    .amount-row span:last-child { font-weight: 600; color: #0D0D0D; }
    .amount-row.total {
      border-top: 1px solid #e0e0e0;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      font-weight: 800;
      color: #0D0D0D;
    }
    .amount-row.total span { color: #0D0D0D !important; }

    .order-items { margin-bottom: 2rem; }
    .order-items h3 { font-size: 1rem; font-weight: 800; color: #0D0D0D; margin: 0 0 1rem; }
    .items-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .conf-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #F9F5F0;
      border-radius: 10px;
    }
    .ci-img {
      width: 48px; height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .ci-info { flex: 1; }
    .ci-info p { margin: 0 0 0.1rem; font-size: 0.88rem; font-weight: 700; color: #0D0D0D; }
    .ci-meta { color: #999 !important; font-weight: 400 !important; font-size: 0.78rem !important; }
    .ci-price { font-weight: 800; font-size: 0.9rem; color: #0D0D0D; white-space: nowrap; }

    .tracking-steps { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f0f0f0; }
    .tracking-steps h3 { font-size: 1rem; font-weight: 800; color: #0D0D0D; margin: 0 0 1.25rem; }
    .steps-track { display: flex; align-items: center; gap: 0; }
    .track-step { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
    .ts-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      background: #E8772A;
      flex-shrink: 0;
      box-shadow: 0 0 0 3px rgba(232,119,42,0.2);
    }
    .ts-dot.pending {
      background: #e0e0e0;
      box-shadow: none;
    }
    .ts-info { display: flex; flex-direction: column; }
    .ts-info strong { font-size: 0.78rem; color: #0D0D0D; }
    .ts-info span { font-size: 0.7rem; color: #999; }
    .track-line {
      flex: 1;
      height: 2px;
      background: #e0e0e0;
      min-width: 20px;
    }
    .track-line.done { background: #E8772A; }
    .track-step.done .ts-dot { background: #E8772A; }

    .confirmation-ctas {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    .btn-shop-again {
      flex: 1;
      background: #E8772A;
      color: #fff;
      padding: 1rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 800;
      font-size: 0.95rem;
      text-align: center;
      transition: background 0.2s, transform 0.2s;
    }
    .btn-shop-again:hover { background: #C45A0F; transform: translateY(-2px); }
    .btn-home {
      padding: 1rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      color: #555;
      border: 1.5px solid #e0e0e0;
      transition: border-color 0.2s, color 0.2s;
      white-space: nowrap;
    }
    .btn-home:hover { border-color: #0D0D0D; color: #0D0D0D; }

    .confirmation-note {
      background: #F9F5F0;
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }
    .confirmation-note p { margin: 0 0 0.3rem; font-size: 0.85rem; color: #666; }
    .confirmation-note p:last-child { margin: 0; }
    .confirmation-note strong { color: #0D0D0D; }

    .no-order { text-align: center; padding: 3rem; }
    .no-order a { color: #E8772A; }

    @media (max-width: 640px) {
      .confirmation-card { padding: 2rem 1.5rem; }
      .confirmation-details { grid-template-columns: 1fr; }
      .steps-track { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
      .track-line { width: 2px; height: 20px; min-width: 0; }
      .confirmation-ctas { flex-direction: column; }
    }
  `]
})
export class OrderConfirmationComponent {
  private orderService = inject(OrderService);
  order = this.orderService.currentOrder;
}
