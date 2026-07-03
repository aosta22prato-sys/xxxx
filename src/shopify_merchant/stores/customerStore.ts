import { create } from 'zustand';
import { Customer } from '../types';
import { INITIAL_CUSTOMERS } from '../data/mockData';

interface CustomerState {
  customers: Customer[];
  customerFilter: 'All' | 'VIP' | 'Returning' | 'Abandoned Checkout' | 'B2B';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCustomerFilter: (filter: 'All' | 'VIP' | 'Returning' | 'Abandoned Checkout' | 'B2B') => void;
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const getStoredCustomers = (): Customer[] => {
  const saved = localStorage.getItem('shopify_mock_customers');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_CUSTOMERS;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: getStoredCustomers(),
  customerFilter: 'All',
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setCustomerFilter: (filter) => set({ customerFilter: filter }),
  setCustomers: (customers) => {
    set({ customers });
    localStorage.setItem('shopify_mock_customers', JSON.stringify(customers));
  },
  addCustomer: (customer) => {
    const updated = [customer, ...get().customers];
    set({ customers: updated });
    localStorage.setItem('shopify_mock_customers', JSON.stringify(updated));
  },
  updateCustomer: (id, updated) => {
    const updatedList = get().customers.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    set({ customers: updatedList });
    localStorage.setItem('shopify_mock_customers', JSON.stringify(updatedList));
  },
  deleteCustomer: (id) => {
    const updatedList = get().customers.filter((c) => c.id !== id);
    set({ customers: updatedList });
    localStorage.setItem('shopify_mock_customers', JSON.stringify(updatedList));
  },
}));
