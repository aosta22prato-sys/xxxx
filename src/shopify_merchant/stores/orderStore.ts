import { create } from 'zustand';
import { Order } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';

interface OrderState {
  orders: Order[];
  orderFilter: 'All' | 'unfulfilled' | 'fulfilled' | 'paid' | 'pending' | 'refunded';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setOrderFilter: (filter: 'All' | 'unfulfilled' | 'fulfilled' | 'paid' | 'pending' | 'refunded') => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updated: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

const getStoredOrders = (): Order[] => {
  const saved = localStorage.getItem('shopify_mock_orders');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_ORDERS;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: getStoredOrders(),
  orderFilter: 'All',
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setOrderFilter: (filter) => set({ orderFilter: filter }),
  setOrders: (orders) => {
    set({ orders });
    localStorage.setItem('shopify_mock_orders', JSON.stringify(orders));
  },
  addOrder: (order) => {
    const updated = [order, ...get().orders];
    set({ orders: updated });
    localStorage.setItem('shopify_mock_orders', JSON.stringify(updated));
  },
  updateOrder: (id, updated) => {
    const updatedList = get().orders.map((o) =>
      o.id === id ? { ...o, ...updated } : o
    );
    set({ orders: updatedList });
    localStorage.setItem('shopify_mock_orders', JSON.stringify(updatedList));
  },
  deleteOrder: (id) => {
    const updatedList = get().orders.filter((o) => o.id !== id);
    set({ orders: updatedList });
    localStorage.setItem('shopify_mock_orders', JSON.stringify(updatedList));
  },
}));
