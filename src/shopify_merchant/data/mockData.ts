/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order, Customer, Discount, StoreSettings } from '../types';

// Sleek Inline SVG icons and sketches to represent our high-end black & white collection
export const MOCK_PRODUCT_SVGS = {
  wallet: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/><path d="M12 11h9v4h-9zM3 10h6"/></svg>`,
  shirt: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><path d="M20.38 6.53l-3.34-3.34A2 2 0 0015.62 2.6H8.38A2 2 0 006.96 3.2L3.62 6.53A2 2 0 003 7.94v11.4a2 2 0 002 2h14a2 2 0 002-2V7.94c0-.53-.21-1.04-.62-1.41z"/><path d="M6 21v-5h12v5M3 10h18M12 2.6v7.4"/></svg>`,
  dripper: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><path d="M17 19H7a4 4 0 01-4-4V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10a4 4 0 01-4 4z"/><path d="M3 8h18M5 19h14M8 23h8M12 3v5"/></svg>`,
  headphones: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9"/><path d="M4 14a2 2 0 00-2 2v3a2 2 0 002 2h2V14H4zm16 0h-2v7h2a2 2 0 002-2v-3a2 2 0 00-2-2z"/></svg>`,
  deskpad: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M6 14h12M14 17h4"/></svg>`,
  backpack: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><rect x="5" y="6" width="14" height="15" rx="3"/><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2M5 11h14M12 6v15M9 21h6"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  candle: `<svg viewBox="0 0 24 24" fill="none" class="w-12 h-12 stroke-black stroke-2 stroke-round"><rect x="6" y="9" width="12" height="12" rx="2"/><path d="M12 9V5a1 1 0 012-1 1 1 0 01-2 5zM9 13h6M9 17h6"/></svg>`
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-01',
    name: '#1001',
    customerName: 'Marcus Aurelius',
    customerEmail: 'marcus@philosophy.org',
    items: [
      { productId: 'prod-01', title: 'Minimalist Leather Pocket Wallet', quantity: 1, price: 49.00, image: 'wallet' },
      { productId: 'prod-03', title: 'Ceramic Pour-Over Coffee Brewer', quantity: 1, price: 35.00, image: 'dripper' }
    ],
    subtotal: 84.00,
    discountCode: 'WELCOME10',
    discountAmount: 8.40,
    tax: 15.12,
    shipping: 0.00, // free shipping
    total: 90.72,
    paymentStatus: 'paid',
    fulfillmentStatus: 'unfulfilled',
    createdAt: '2026-06-16T14:32:00-07:00',
    notes: 'Please leave package by the guard gate.'
  },
  {
    id: 'ord-02',
    name: '#1002',
    customerName: 'Clara Schumann',
    customerEmail: 'clara.sch@piano.de',
    items: [
      { productId: 'prod-04', title: 'Acoustic One Wireless Headphones', quantity: 1, price: 249.00, image: 'headphones' }
    ],
    subtotal: 249.00,
    tax: 44.82,
    shipping: 10.00,
    total: 303.82,
    paymentStatus: 'pending',
    fulfillmentStatus: 'unfulfilled',
    createdAt: '2026-06-16T08:15:00-07:00'
  },
  {
    id: 'ord-03',
    name: '#1003',
    customerName: 'Soren Kierkegaard',
    customerEmail: 'soren.k@exist.dk',
    items: [
      { productId: 'prod-02', title: 'Raw Organic Hemp Tee', quantity: 2, price: 39.00, image: 'shirt' },
      { productId: 'prod-05', title: 'Matte Graphite Desk Pad (Medium)', quantity: 1, price: 45.00, image: 'deskpad' }
    ],
    subtotal: 123.00,
    discountCode: 'SPRING15',
    discountAmount: 18.45,
    tax: 18.82,
    shipping: 5.00,
    total: 128.37,
    paymentStatus: 'paid',
    fulfillmentStatus: 'fulfilled',
    createdAt: '2026-06-15T19:40:00-07:00'
  },
  {
    id: 'ord-04',
    name: '#1004',
    customerName: 'Ada Lovelace',
    customerEmail: 'ada@computing.org',
    items: [
      { productId: 'prod-06', title: 'Waterproof Adventure Pack', quantity: 1, price: 120.00, image: 'backpack' }
    ],
    subtotal: 120.00,
    tax: 21.60,
    shipping: 0.00,
    total: 141.60,
    paymentStatus: 'refunded',
    fulfillmentStatus: 'fulfilled',
    createdAt: '2026-06-14T11:05:00-07:00',
    notes: 'Returned due to sizing mismatch.'
  },
  {
    id: 'ord-05',
    name: '#1005',
    customerName: 'Hokusai Katsushika',
    customerEmail: 'greatwave@edo.jp',
    items: [
      { productId: 'prod-01', title: 'Minimalist Leather Pocket Wallet', quantity: 3, price: 49.00, image: 'wallet' }
    ],
    subtotal: 147.00,
    tax: 26.46,
    shipping: 12.00,
    total: 185.46,
    paymentStatus: 'paid',
    fulfillmentStatus: 'unfulfilled',
    createdAt: '2026-06-13T16:20:00-07:00'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    email: 'marcus@philosophy.org',
    phone: '+39 06 5831 294',
    ordersCount: 3,
    totalSpent: 412.50,
    tags: ['vip', 'editorial', 'quiet-luxury'],
    segment: 'VIP',
    company: 'Stoa Corp'
  },
  {
    id: 'cust-02',
    firstName: 'Clara',
    lastName: 'Schumann',
    email: 'clara.sch@piano.de',
    phone: '+49 30 9012 300',
    ordersCount: 1,
    totalSpent: 303.82,
    tags: ['music', 'premium'],
    segment: 'Returning'
  },
  {
    id: 'cust-03',
    firstName: 'Soren',
    lastName: 'Kierkegaard',
    email: 'soren.k@exist.dk',
    ordersCount: 4,
    totalSpent: 520.00,
    tags: ['philosophy', 'frequent-buyer'],
    segment: 'VIP'
  },
  {
    id: 'cust-04',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@computing.org',
    phone: '+44 20 7946 0192',
    ordersCount: 2,
    totalSpent: 285.00,
    tags: ['tech', 'B2B'],
    segment: 'B2B',
    company: 'Difference Engine Ltd'
  },
  {
    id: 'cust-05',
    firstName: 'Hokusai',
    lastName: 'Katsushika',
    email: 'greatwave@edo.jp',
    ordersCount: 1,
    totalSpent: 185.46,
    tags: ['artist'],
    segment: 'Returning'
  },
  {
    id: 'cust-06',
    firstName: 'Linus',
    lastName: 'Torvalds',
    email: 'torvalds@kernel.org',
    ordersCount: 0,
    totalSpent: 0.00,
    tags: ['banned-from-checkout'],
    segment: 'Abandoned Checkout'
  }
];

export const INITIAL_DISCOUNTS: Discount[] = [
  {
    id: 'disc-01',
    code: 'SPRING20',
    type: 'percentage',
    value: 20,
    valueText: '20% Off',
    status: 'active',
    usageCount: 148,
    minRequirement: 'Spend at least €100.00'
  },
  {
    id: 'disc-02',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    valueText: 'Free Shipping',
    status: 'active',
    usageCount: 320,
    minRequirement: 'All orders over €50.00'
  },
  {
    id: 'disc-03',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    valueText: '10% Off',
    status: 'active',
    usageCount: 89,
    minRequirement: 'New subscribers'
  },
  {
    id: 'disc-04',
    code: 'BOGO_TEE',
    type: 'buy_x_get_y',
    value: 100, // 100% off item Y
    valueText: 'Buy 2, Get 1 Tee Free',
    status: 'scheduled',
    usageCount: 0,
    buyQuantity: 2,
    getYQuantity: 1
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  shopName: 'Atelier Noir',
  shopEmail: 'hello@noiratelier.com',
  currency: 'EUR',
  currencySymbol: '€',
  timezone: 'GMT+1 (Berlin)',
  shippingStandardRate: 10.00,
  taxRate: 19.00, // 19% standard VAT
  plan: 'Shopify',
  language: 'zh'
};
