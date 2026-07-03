import { B2BCompany } from '../types';

export const INITIAL_COMPANIES: B2BCompany[] = [
  {
    id: 'comp-01',
    name: 'Stoa Corp',
    businessId: 'IT-9908123A',
    location: 'Roma, Italy',
    primaryContactName: 'Marcus Aurelius',
    primaryContactEmail: 'marcus@philosophy.org',
    ordersCount: 3,
    totalSpent: 412.50,
    paymentTerm: 'Net 30',
    creditLimit: 5000,
    catalogId: 'cat-premium-wholesale',
    contacts: [
      { customerId: 'cust-01', name: 'Marcus Aurelius', email: 'marcus@philosophy.org', role: 'admin' }
    ]
  },
  {
    id: 'comp-02',
    name: 'Difference Engine Ltd',
    businessId: 'GB-1234567B',
    location: 'London, United Kingdom',
    primaryContactName: 'Ada Lovelace',
    primaryContactEmail: 'ada@computing.org',
    ordersCount: 2,
    totalSpent: 285.00,
    paymentTerm: 'Net 60',
    creditLimit: 15000,
    catalogId: 'cat-tech-corporate',
    contacts: [
      { customerId: 'cust-04', name: 'Ada Lovelace', email: 'ada@computing.org', role: 'admin' }
    ]
  },
  {
    id: 'comp-03',
    name: 'Nexus Apparel Group',
    businessId: 'FR-8812999C',
    location: 'Paris, France',
    primaryContactName: 'Charles Baudelaire',
    primaryContactEmail: 'charles@baudelaire.fr',
    ordersCount: 0,
    totalSpent: 0,
    paymentTerm: 'Due on receipt',
    creditLimit: 2000,
    catalogId: 'cat-fashion-retail',
    contacts: [
      { customerId: 'cust-06', name: 'Charles Baudelaire', email: 'charles@baudelaire.fr', role: 'buyer' }
    ]
  }
];
