import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CustomerInfo, PaymentInfo, PaymentMethod } from '../../core/models/order.model';

type Step = 'info' | 'payment' | 'review';

@Component({
  selector: 'dw-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <div class="checkout-header">
        <a routerLink="/" class="checkout-logo">
          <span>◆</span> Diamond<span class="orange">Wear</span>
        </a>
        <div class="steps-indicator">
          <div class="step" [class.active]="currentStep() === 'info'" [class.done]="stepDone('info')">
            <span class="step-num">{{ stepDone('info') ? '✓' : '1' }}</span>
            <span>Informations</span>
          </div>
          <div class="step-line"></div>
          <div class="step" [class.active]="currentStep() === 'payment'" [class.done]="stepDone('payment')">
            <span class="step-num">{{ stepDone('payment') ? '✓' : '2' }}</span>
            <span>Paiement</span>
          </div>
          <div class="step-line"></div>
          <div class="step" [class.active]="currentStep() === 'review'">
            <span class="step-num">3</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div class="checkout-layout">
        <!-- Left: Form -->
        <div class="checkout-form-area">

          <!-- Step 1: Customer Info -->
          @if (currentStep() === 'info') {
            <div class="form-card" [@slideIn]>
              <h2>Informations de livraison</h2>
              <div class="form-grid">
                <div class="field">
                  <label>Prénom *</label>
                  <input [(ngModel)]="customer.firstName" placeholder="Jean" [class.error]="errors['firstName']">
                  @if (errors['firstName']) { <span class="field-error">Requis</span> }
                </div>
                <div class="field">
                  <label>Nom *</label>
                  <input [(ngModel)]="customer.lastName" placeholder="Kouassi" [class.error]="errors['lastName']">
                  @if (errors['lastName']) { <span class="field-error">Requis</span> }
                </div>
                <div class="field full">
                  <label>Email *</label>
                  <input type="email" [(ngModel)]="customer.email" placeholder="jean.kouassi@email.com" [class.error]="errors['email']">
                  @if (errors['email']) { <span class="field-error">Email invalide</span> }
                </div>
                <div class="field full">
                  <label>Téléphone *</label>
                  <input type="tel" [(ngModel)]="customer.phone" placeholder="+225 07 00 00 00 00" [class.error]="errors['phone']">
                  @if (errors['phone']) { <span class="field-error">Requis</span> }
                </div>
                <div class="field full">
                  <label>Adresse *</label>
                  <input [(ngModel)]="customer.address" placeholder="Rue, Quartier, Numéro" [class.error]="errors['address']">
                  @if (errors['address']) { <span class="field-error">Requis</span> }
                </div>
                <div class="field">
                  <label>Ville *</label>
                  <input [(ngModel)]="customer.city" placeholder="Abidjan" [class.error]="errors['city']">
                  @if (errors['city']) { <span class="field-error">Requis</span> }
                </div>
                <div class="field">
                  <label>Pays</label>
                  <select [(ngModel)]="customer.country">
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="SN">Sénégal</option>
                    <option value="ML">Mali</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="GN">Guinée</option>
                    <option value="GH">Ghana</option>
                    <option value="TG">Togo</option>
                    <option value="BJ">Bénin</option>
                    <option value="CM">Cameroun</option>
                  </select>
                </div>
              </div>
              <button class="btn-next" (click)="goToPayment()">
                Continuer vers le paiement →
              </button>
            </div>
          }

          <!-- Step 2: Payment -->
          @if (currentStep() === 'payment') {
            <div class="form-card">
              <h2>Mode de paiement</h2>

              <div class="payment-methods">
                <button class="pay-method" [class.active]="paymentMethod() === 'visa'" (click)="paymentMethod.set('visa')">
                  <div class="pm-icon visa-icon">VISA</div>
                  <div class="pm-info">
                    <strong>Carte Visa / Mastercard</strong>
                    <p>Paiement sécurisé par carte bancaire</p>
                  </div>
                  <div class="pm-radio" [class.checked]="paymentMethod() === 'visa'"></div>
                </button>

                <button class="pay-method" [class.active]="paymentMethod() === 'mixx'" (click)="paymentMethod.set('mixx')">
                  <div class="pm-icon mixx-icon">MIXX</div>
                  <div class="pm-info">
                    <strong>Mixx by Yas</strong>
                    <p>Paiement mobile Orange / MTN</p>
                  </div>
                  <div class="pm-radio" [class.checked]="paymentMethod() === 'mixx'"></div>
                </button>

                <button class="pay-method" [class.active]="paymentMethod() === 'moovmoney'" (click)="paymentMethod.set('moovmoney')">
                  <div class="pm-icon moov-icon">MOOV</div>
                  <div class="pm-info">
                    <strong>Moov Money</strong>
                    <p>Paiement via Moov Africa</p>
                  </div>
                  <div class="pm-radio" [class.checked]="paymentMethod() === 'moovmoney'"></div>
                </button>
              </div>

              <!-- Visa Form -->
              @if (paymentMethod() === 'visa') {
                <div class="payment-form">
                  <div class="card-preview" [class.flipped]="cvvFocus()">
                    <div class="card-front">
                      <div class="card-chip">
                        <div></div><div></div><div></div><div></div>
                      </div>
                      <div class="card-number-preview">
                        {{ formatCardDisplay() }}
                      </div>
                      <div class="card-bottom">
                        <div>
                          <p class="card-label">Titulaire</p>
                          <p class="card-val">{{ visa.cardHolder || 'VOTRE NOM' }}</p>
                        </div>
                        <div>
                          <p class="card-label">Expiration</p>
                          <p class="card-val">{{ visa.expiry || 'MM/AA' }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="card-back">
                      <div class="card-strip"></div>
                      <div class="cvv-area">
                        <span>CVV</span>
                        <div class="cvv-display">{{ visa.cvv || '•••' }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="field full">
                    <label>Numéro de carte *</label>
                    <input [(ngModel)]="visa.cardNumber" placeholder="1234 5678 9012 3456"
                           maxlength="19" (input)="formatCardNumber($event)"
                           [class.error]="errors['cardNumber']">
                    @if (errors['cardNumber']) { <span class="field-error">Numéro invalide</span> }
                  </div>
                  <div class="field full">
                    <label>Nom sur la carte *</label>
                    <input [(ngModel)]="visa.cardHolder" placeholder="JEAN KOUASSI"
                           (input)="visa.cardHolder = $any($event.target).value.toUpperCase()"
                           [class.error]="errors['cardHolder']">
                  </div>
                  <div class="form-grid">
                    <div class="field">
                      <label>Expiration *</label>
                      <input [(ngModel)]="visa.expiry" placeholder="MM/AA" maxlength="5"
                             (input)="formatExpiry($event)" [class.error]="errors['expiry']">
                    </div>
                    <div class="field">
                      <label>CVV *</label>
                      <input [(ngModel)]="visa.cvv" type="password" placeholder="•••" maxlength="4"
                             (focus)="cvvFocus.set(true)" (blur)="cvvFocus.set(false)"
                             [class.error]="errors['cvv']">
                    </div>
                  </div>
                </div>
              }

              <!-- Mobile Money Form -->
              @if (paymentMethod() === 'mixx' || paymentMethod() === 'moovmoney') {
                <div class="payment-form mobile-money-form">
                  <div class="mobile-pay-info">
                    @if (paymentMethod() === 'mixx') {
                      <div class="mm-logo mixx">MIXX<span>by Yas</span></div>
                    } @else {
                      <div class="mm-logo moov">MOOV<span>Money</span></div>
                    }
                    <p>Entrez votre numéro de téléphone. Vous recevrez une demande de confirmation sur votre téléphone.</p>
                  </div>
                  <div class="field full">
                    <label>Numéro {{ paymentMethod() === 'mixx' ? 'Orange / MTN' : 'Moov' }} *</label>
                    <div class="phone-input">
                      <span class="phone-prefix">🇨🇮 +225</span>
                      <input [(ngModel)]="mobilePhone" placeholder="07 00 00 00 00"
                             type="tel" [class.error]="errors['mobilePhone']">
                    </div>
                    @if (errors['mobilePhone']) { <span class="field-error">Numéro invalide</span> }
                  </div>
                  <div class="mm-steps">
                    <div class="mm-step">
                      <span class="ms-num">1</span>
                      <span>Entrez votre numéro et confirmez</span>
                    </div>
                    <div class="mm-step">
                      <span class="ms-num">2</span>
                      <span>Vérifiez votre téléphone</span>
                    </div>
                    <div class="mm-step">
                      <span class="ms-num">3</span>
                      <span>Entrez votre code PIN pour valider</span>
                    </div>
                  </div>
                </div>
              }

              <div class="form-actions">
                <button class="btn-back" (click)="currentStep.set('info')">← Retour</button>
                <button class="btn-next" (click)="goToReview()">Vérifier la commande →</button>
              </div>
            </div>
          }

          <!-- Step 3: Review -->
          @if (currentStep() === 'review') {
            <div class="form-card">
              <h2>Vérification de la commande</h2>

              <div class="review-section">
                <div class="review-row">
                  <h3>Livraison</h3>
                  <button class="edit-btn" (click)="currentStep.set('info')">Modifier</button>
                </div>
                <div class="review-info">
                  <p>{{ customer.firstName }} {{ customer.lastName }}</p>
                  <p>{{ customer.email }}</p>
                  <p>{{ customer.phone }}</p>
                  <p>{{ customer.address }}, {{ customer.city }}, {{ customer.country }}</p>
                </div>
              </div>

              <div class="review-section">
                <div class="review-row">
                  <h3>Paiement</h3>
                  <button class="edit-btn" (click)="currentStep.set('payment')">Modifier</button>
                </div>
                <div class="review-info">
                  @if (paymentMethod() === 'visa') {
                    <p>Carte Visa •••• •••• •••• {{ visa.cardNumber.slice(-4) || '????'}}</p>
                  } @else {
                    <p>{{ paymentMethod() === 'mixx' ? 'Mixx by Yas' : 'Moov Money' }} — {{ mobilePhone }}</p>
                  }
                </div>
              </div>

              <div class="review-section">
                <h3>Articles commandés</h3>
                <div class="review-items">
                  @for (item of cart.items(); track $index) {
                    <div class="review-item">
                      <div class="ri-image" [style.background]="item.product.gradient">
                        <span>{{ item.product.icon }}</span>
                      </div>
                      <div class="ri-info">
                        <p class="ri-name">{{ item.product.name }}</p>
                        <p class="ri-meta">{{ item.selectedSize }} · {{ item.selectedColor }} · Qté: {{ item.quantity }}</p>
                      </div>
                      <p class="ri-price">{{ item.product.price * item.quantity | number:'1.0-0' }} FCFA</p>
                    </div>
                  }
                </div>
              </div>

              <div class="form-actions">
                <button class="btn-back" (click)="currentStep.set('payment')">← Retour</button>
                <button class="btn-confirm" (click)="placeOrder()" [disabled]="processing()">
                  @if (processing()) {
                    <span class="spinner"></span> Traitement...
                  } @else {
                    ✓ Confirmer la commande
                  }
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Right: Order Summary -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>Résumé de commande</h3>
            <div class="summary-items">
              @for (item of cart.items(); track $index) {
                <div class="summary-item">
                  <div class="si-img" [style.background]="item.product.gradient">
                    <span>{{ item.product.icon }}</span>
                    <span class="si-qty">{{ item.quantity }}</span>
                  </div>
                  <div class="si-info">
                    <p>{{ item.product.name }}</p>
                    <p class="si-meta">{{ item.selectedSize }} · {{ item.selectedColor }}</p>
                  </div>
                  <p class="si-price">{{ item.product.price * item.quantity | number:'1.0-0' }}</p>
                </div>
              }
            </div>
            <div class="summary-totals">
              <div class="total-row">
                <span>Sous-total</span>
                <span>{{ cart.subtotal() | number:'1.0-0' }} FCFA</span>
              </div>
              <div class="total-row">
                <span>Livraison</span>
                <span>{{ cart.shipping() === 0 ? 'Gratuite' : (cart.shipping() | number:'1.0-0') + ' FCFA' }}</span>
              </div>
              <div class="total-row final">
                <span>Total</span>
                <span>{{ cart.total() | number:'1.0-0' }} FCFA</span>
              </div>
            </div>
            <div class="secure-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { min-height: 100vh; background: #F9F5F0; }
    .checkout-header {
      background: #0D0D0D;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .checkout-logo {
      font-size: 1.25rem;
      font-weight: 900;
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      letter-spacing: -0.02em;
    }
    .checkout-logo span:first-child { color: #E8772A; }
    .orange { color: #E8772A; }

    .steps-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.4);
      font-size: 0.82rem;
      font-weight: 600;
    }
    .step.active { color: #E8772A; }
    .step.done { color: rgba(255,255,255,0.6); }
    .step-num {
      width: 26px; height: 26px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .step.active .step-num { background: #E8772A; color: #fff; }
    .step.done .step-num { background: rgba(255,255,255,0.2); }
    .step-line { width: 40px; height: 1px; background: rgba(255,255,255,0.15); }

    .checkout-layout {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
      align-items: start;
    }

    .form-card {
      background: #fff;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 4px 30px rgba(0,0,0,0.06);
    }
    .form-card h2 { font-size: 1.4rem; font-weight: 900; color: #0D0D0D; margin: 0 0 1.75rem; letter-spacing: -0.02em; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field.full { grid-column: 1 / -1; }
    .field label { font-size: 0.8rem; font-weight: 700; color: #555; letter-spacing: 0.03em; }
    .field input, .field select {
      padding: 0.75rem 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #0D0D0D;
      outline: none;
      transition: border-color 0.2s;
      background: #fff;
    }
    .field input:focus, .field select:focus { border-color: #E8772A; }
    .field input.error { border-color: #e53e3e; }
    .field-error { font-size: 0.75rem; color: #e53e3e; }

    /* Payment Methods */
    .payment-methods { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.75rem; }
    .pay-method {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border: 2px solid #e0e0e0;
      border-radius: 14px;
      background: #fff;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.2s, background 0.2s;
    }
    .pay-method.active { border-color: #E8772A; background: rgba(232,119,42,0.04); }
    .pm-icon {
      width: 56px; height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.8rem;
      flex-shrink: 0;
      letter-spacing: 0.05em;
    }
    .visa-icon { background: #1A1F71; color: #fff; font-style: italic; }
    .mixx-icon { background: #FF6B00; color: #fff; }
    .moov-icon { background: #00A0E3; color: #fff; }
    .pm-info { flex: 1; }
    .pm-info strong { display: block; font-size: 0.9rem; font-weight: 700; color: #0D0D0D; margin-bottom: 0.1rem; }
    .pm-info p { margin: 0; font-size: 0.78rem; color: #999; }
    .pm-radio {
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 2px solid #ddd;
      flex-shrink: 0;
      position: relative;
      transition: border-color 0.2s;
    }
    .pm-radio.checked { border-color: #E8772A; }
    .pm-radio.checked::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #E8772A;
    }

    /* Card Visual */
    .payment-form { margin-bottom: 1.5rem; }
    .card-preview {
      width: 340px;
      height: 200px;
      margin: 0 auto 1.75rem;
      perspective: 1000px;
      position: relative;
    }
    .card-front, .card-back {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1.5rem;
      backface-visibility: hidden;
      transition: transform 0.6s ease;
    }
    .card-front {
      background: linear-gradient(135deg, #1C1B2E 0%, #E8772A 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-back {
      background: linear-gradient(135deg, #E8772A, #1C1B2E);
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .card-preview.flipped .card-front { transform: rotateY(-180deg); }
    .card-preview.flipped .card-back { transform: rotateY(0); }

    .card-chip {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 40px; height: 32px;
      border-radius: 4px;
      overflow: hidden;
      background: #C9A96E;
    }
    .card-chip div { border: 0.5px solid rgba(0,0,0,0.2); }
    .card-number-preview { color: #fff; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.15em; font-family: monospace; }
    .card-bottom { display: flex; gap: 2rem; }
    .card-label { color: rgba(255,255,255,0.5); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 0.1rem; }
    .card-val { color: #fff; font-size: 0.82rem; font-weight: 600; margin: 0; }
    .card-strip { height: 44px; background: #0D0D0D; margin: 0 -1.5rem; }
    .cvv-area { margin-top: 1rem; display: flex; align-items: center; justify-content: flex-end; gap: 1rem; }
    .cvv-area span { color: rgba(255,255,255,0.6); font-size: 0.75rem; }
    .cvv-display {
      background: #fff;
      color: #0D0D0D;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-weight: 700;
      font-family: monospace;
      min-width: 60px;
      text-align: center;
    }

    /* Mobile Money */
    .mobile-money-form { padding: 1.5rem; background: #F9F5F0; border-radius: 14px; margin-bottom: 1.5rem; }
    .mobile-pay-info { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .mm-logo {
      font-size: 1.1rem;
      font-weight: 900;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      flex-shrink: 0;
    }
    .mm-logo span { font-size: 0.6rem; font-weight: 500; opacity: 0.8; }
    .mm-logo.mixx { background: #FF6B00; color: #fff; }
    .mm-logo.moov { background: #00A0E3; color: #fff; }
    .mobile-pay-info p { color: #666; font-size: 0.85rem; line-height: 1.5; margin: 0; }
    .phone-input {
      display: flex;
      align-items: center;
      border: 1.5px solid #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    .phone-prefix {
      padding: 0.75rem 1rem;
      background: #f5f5f5;
      border-right: 1px solid #e0e0e0;
      font-size: 0.88rem;
      color: #555;
      white-space: nowrap;
    }
    .phone-input input {
      flex: 1;
      border: none;
      padding: 0.75rem 1rem;
      outline: none;
      font-size: 0.9rem;
      background: transparent;
    }
    .mm-steps { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.25rem; }
    .mm-step { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: #555; }
    .ms-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: #E8772A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
      flex-shrink: 0;
    }

    /* Actions */
    .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn-back {
      padding: 0.9rem 1.5rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 12px;
      background: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 700;
      color: #555;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-back:hover { border-color: #0D0D0D; color: #0D0D0D; }
    .btn-next, .btn-confirm {
      flex: 1;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      background: #E8772A;
      color: #fff;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-next:hover, .btn-confirm:hover:not(:disabled) { background: #C45A0F; transform: translateY(-2px); }
    .btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Review Step */
    .review-section {
      padding: 1.25rem 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 0.5rem;
    }
    .review-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .review-row h3 { margin: 0; font-size: 0.95rem; font-weight: 800; color: #0D0D0D; }
    .edit-btn {
      background: none;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 0.3rem 0.75rem;
      font-size: 0.78rem;
      cursor: pointer;
      color: #E8772A;
      font-weight: 600;
      transition: background 0.2s;
    }
    .edit-btn:hover { background: rgba(232,119,42,0.1); }
    .review-info p { margin: 0 0 0.2rem; font-size: 0.88rem; color: #555; }
    .review-items { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem; }
    .review-item { display: flex; align-items: center; gap: 0.75rem; }
    .ri-image {
      width: 48px; height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .ri-info { flex: 1; }
    .ri-name { margin: 0 0 0.1rem; font-weight: 700; font-size: 0.88rem; color: #0D0D0D; }
    .ri-meta { margin: 0; font-size: 0.75rem; color: #999; }
    .ri-price { font-weight: 800; font-size: 0.9rem; color: #0D0D0D; white-space: nowrap; }

    /* Order Summary */
    .order-summary { position: sticky; top: 2rem; }
    .summary-card {
      background: #fff;
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 4px 30px rgba(0,0,0,0.06);
    }
    .summary-card h3 { font-size: 1.1rem; font-weight: 800; color: #0D0D0D; margin: 0 0 1.25rem; }
    .summary-items { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid #f0f0f0; }
    .summary-item { display: flex; align-items: center; gap: 0.75rem; }
    .si-img {
      width: 50px; height: 56px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      position: relative;
      flex-shrink: 0;
    }
    .si-qty {
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
      font-weight: 800;
    }
    .si-info { flex: 1; min-width: 0; }
    .si-info p { margin: 0 0 0.1rem; font-size: 0.85rem; font-weight: 700; color: #0D0D0D; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .si-meta { font-size: 0.75rem; color: #999; font-weight: 400 !important; }
    .si-price { font-weight: 800; font-size: 0.88rem; color: #0D0D0D; white-space: nowrap; }

    .summary-totals { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .total-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #555; }
    .total-row span:last-child { font-weight: 600; color: #0D0D0D; }
    .total-row.final {
      border-top: 2px solid #0D0D0D;
      padding-top: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 800;
      font-size: 1.05rem;
      color: #0D0D0D;
    }
    .total-row.final span { color: #0D0D0D !important; }

    .secure-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #999;
      font-size: 0.8rem;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }
    .secure-badge svg { color: #4CAF50; }

    @media (max-width: 900px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .order-summary { position: static; }
      .card-preview { width: 100%; max-width: 340px; }
    }
    @media (max-width: 640px) {
      .checkout-header { flex-direction: column; align-items: flex-start; }
      .steps-indicator { width: 100%; justify-content: center; }
      .form-grid { grid-template-columns: 1fr; }
      .field.full { grid-column: auto; }
    }
  `]
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  currentStep = signal<Step>('info');
  paymentMethod = signal<PaymentMethod>('visa');
  processing = signal(false);
  cvvFocus = signal(false);

  customer: CustomerInfo = {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: 'CI'
  };

  visa = { cardNumber: '', cardHolder: '', expiry: '', cvv: '' };
  mobilePhone = '';
  errors: Record<string, boolean> = {};

  stepDone(step: Step): boolean {
    const steps: Step[] = ['info', 'payment', 'review'];
    return steps.indexOf(this.currentStep()) > steps.indexOf(step);
  }

  formatCardDisplay(): string {
    const num = this.visa.cardNumber.replace(/\s/g, '');
    const padded = num.padEnd(16, '•');
    return padded.match(/.{1,4}/g)?.join(' ') ?? '•••• •••• •••• ••••';
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 16);
    this.visa.cardNumber = val.match(/.{1,4}/g)?.join(' ') ?? val;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    this.visa.expiry = val;
  }

  goToPayment(): void {
    this.errors = {};
    if (!this.customer.firstName) this.errors['firstName'] = true;
    if (!this.customer.lastName) this.errors['lastName'] = true;
    if (!this.customer.email || !this.customer.email.includes('@')) this.errors['email'] = true;
    if (!this.customer.phone) this.errors['phone'] = true;
    if (!this.customer.address) this.errors['address'] = true;
    if (!this.customer.city) this.errors['city'] = true;
    if (Object.keys(this.errors).length === 0) this.currentStep.set('payment');
  }

  goToReview(): void {
    this.errors = {};
    if (this.paymentMethod() === 'visa') {
      if (this.visa.cardNumber.replace(/\s/g, '').length < 16) this.errors['cardNumber'] = true;
      if (!this.visa.cardHolder) this.errors['cardHolder'] = true;
      if (this.visa.expiry.length < 5) this.errors['expiry'] = true;
      if (this.visa.cvv.length < 3) this.errors['cvv'] = true;
    } else {
      if (this.mobilePhone.replace(/\s/g, '').length < 8) this.errors['mobilePhone'] = true;
    }
    if (Object.keys(this.errors).length === 0) this.currentStep.set('review');
  }

  placeOrder(): void {
    this.processing.set(true);
    const paymentInfo: PaymentInfo = this.paymentMethod() === 'visa'
      ? { method: 'visa', cardNumber: this.visa.cardNumber, cardHolder: this.visa.cardHolder, expiry: this.visa.expiry, cvv: this.visa.cvv }
      : { method: this.paymentMethod() as 'mixx' | 'moovmoney', phoneNumber: this.mobilePhone };

    setTimeout(() => {
      this.orderService.placeOrder(
        this.cart.items(),
        this.customer,
        paymentInfo,
        this.cart.subtotal(),
        this.cart.shipping()
      );
      this.cart.clearCart();
      this.router.navigate(['/order-confirmation']);
    }, 2000);
  }
}
