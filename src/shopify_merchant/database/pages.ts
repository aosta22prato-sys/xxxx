/**
 * Pages Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  template: 'default' | 'contact' | 'landing-page' | 'about-us';
  metaTitle: string;
  metaDescription: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PAGES_DATA: StaticPage[] = [
  {
    id: 'page_about',
    title: 'About Atelier Noir',
    slug: 'about-us',
    content: '<h1>Our Legacy</h1><p>Atelier Noir defines contemporary classicism and modern commercial luxury. Established in Brussels, we craft leather, fabrics, and jewelry with absolute focus on texture, form, and detail.</p>',
    template: 'about-us',
    metaTitle: 'About Us | Atelier Noir',
    metaDescription: 'Discover the story, materials, and artisan techniques of Atelier Noir.',
    status: 'active',
    createdAt: '2026-06-16T08:00:00Z',
    updatedAt: '2026-06-16T08:00:00Z'
  },
  {
    id: 'page_contact',
    title: 'Customer Concierge',
    slug: 'contact',
    content: '<p>Contact our concierge for bespoke sizing, orders assistance, or general consultations.</p><p>Email: concierge@atelier-noir.com</p>',
    template: 'contact',
    metaTitle: 'Concierge Services | Atelier Noir',
    metaDescription: 'Get in touch with the Atelier Noir concierge team for bespoke inquiries.',
    status: 'active',
    createdAt: '2026-06-16T08:15:00Z',
    updatedAt: '2026-06-16T08:15:00Z'
  },
  {
    id: 'page_faq',
    title: 'Frequently Answered Questions',
    slug: 'faq',
    content: '<h2>Shipping & Deliveries</h2><p>We ship internationally via DHL Express with complete insurance coverage.</p><h2>Sizing Advice</h2><p>Consult our interactive size charts or reach out to client assistance.</p>',
    template: 'default',
    metaTitle: 'F.A.Q. | Support | Atelier Noir',
    metaDescription: 'Find answers to standard questions about tracking, shipping, and bespoke adjustments.',
    status: 'draft',
    createdAt: '2026-06-16T09:00:00Z',
    updatedAt: '2026-06-16T14:00:00Z'
  }
];
