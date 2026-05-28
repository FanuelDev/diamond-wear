import { CartItem } from './cart.model';

export type PaymentMethod = 'visa' | 'mixx' | 'moovmoney';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface VisaPayment {
  method: 'visa';
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface MobilePayment {
  method: 'mixx' | 'moovmoney';
  phoneNumber: string;
}

export type PaymentInfo = VisaPayment | MobilePayment;

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  payment: PaymentInfo;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
