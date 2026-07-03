/**
 * Checkout Optimization Database
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface CheckoutConfig {
  id: string;
  themeStyle: 'one_page' | 'three_step';
  enableExpressCheckout: boolean;
  expressProviders: ('shoppay' | 'applepay' | 'paypal')[];
  guestCheckout: 'allowed' | 'required' | 'disabled';
  requirePhoneNumber: boolean;
  addressAutocomplete: boolean;
  companyNameField: 'hidden' | 'optional' | 'required';
  orderNotesField: 'hidden' | 'optional' | 'required';
  brandingHeaderLogoUrl?: string;
  brandingAccentColor: string;
  brandingDensity: 'tight' | 'spacious';
  updatedAt: string;
}

export interface FunnelMetric {
  stage: string;
  visitors: number;
  conversionRate: number;
  dropoffRate: number;
}

export const INITIAL_CHECKOUT_DATA: CheckoutConfig = {
  id: 'checkout_default',
  themeStyle: 'one_page',
  enableExpressCheckout: true,
  expressProviders: ['shoppay', 'applepay'],
  guestCheckout: 'allowed',
  requirePhoneNumber: true,
  addressAutocomplete: true,
  companyNameField: 'optional',
  orderNotesField: 'optional',
  brandingHeaderLogoUrl: '',
  brandingAccentColor: '#111111',
  brandingDensity: 'spacious',
  updatedAt: '2026-06-17T02:00:00Z'
};

export const INITIAL_FUNNEL_METRICS: FunnelMetric[] = [
  { stage: '1. Cart Page (购物车页)', visitors: 10450, conversionRate: 100, dropoffRate: 0 },
  { stage: '2. Information (填写收货地址)', visitors: 6240, conversionRate: 59.7, dropoffRate: 40.3 },
  { stage: '3. Shipping Mode (确认配送方式)', visitors: 4890, conversionRate: 78.3, dropoffRate: 21.7 },
  { stage: '4. Payment Page (完成支付结算)', visitors: 3450, conversionRate: 70.5, dropoffRate: 29.5 },
  { stage: '5. Completed (下单成功)', visitors: 2840, conversionRate: 82.3, dropoffRate: 17.7 }
];
