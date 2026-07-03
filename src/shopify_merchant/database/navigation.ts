/**
 * Navigation Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
}

export interface NavigationMenu {
  id: string;
  title: string;
  handle: string; // e.g. 'main-menu', 'footer'
  status: 'active' | 'draft' | 'archived';
  items: NavigationItem[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_NAVIGATION_DATA: NavigationMenu[] = [
  {
    id: 'nav_main',
    title: 'Main Menu Navigation',
    handle: 'main-menu',
    status: 'active',
    items: [
      { id: 'item_1', label: 'Home', url: '/' },
      { id: 'item_2', label: 'Bespoke Collections', url: '/collections' },
      { id: 'item_3', label: 'Product Catalog', url: '/products' },
      { id: 'item_4', label: 'Editorial Journal', url: '/blog' },
      { id: 'item_5', label: 'Bespoke Sizing', url: '/pages/sizing-guides' }
    ],
    createdAt: '2026-06-16T09:00:00Z',
    updatedAt: '2026-06-17T01:30:00Z'
  },
  {
    id: 'nav_footer_service',
    title: 'Footer Service Links',
    handle: 'footer-services',
    status: 'active',
    items: [
      { id: 'item_f1', label: 'Shipping & Tax Policies', url: '/policies/shipping' },
      { id: 'item_f2', label: 'Return Commitments', url: '/policies/returns' },
      { id: 'item_f3', label: 'Concierge Support', url: '/pages/contact' }
    ],
    createdAt: '2026-06-16T09:05:00Z',
    updatedAt: '2026-06-16T09:05:00Z'
  }
];
