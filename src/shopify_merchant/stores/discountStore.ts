import { create } from 'zustand';
import { Discount } from '../types';
import { INITIAL_DISCOUNTS } from '../data/mockData';

interface DiscountState {
  discounts: Discount[];
  setDiscounts: (discounts: Discount[]) => void;
  addDiscount: (discount: Discount) => void;
  updateDiscount: (id: string, updated: Partial<Discount>) => void;
  deleteDiscount: (id: string) => void;
}

const getStoredDiscounts = (): Discount[] => {
  const saved = localStorage.getItem('shopify_mock_discounts');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_DISCOUNTS;
};

export const useDiscountStore = create<DiscountState>((set, get) => ({
  discounts: getStoredDiscounts(),
  setDiscounts: (discounts) => {
    set({ discounts });
    localStorage.setItem('shopify_mock_discounts', JSON.stringify(discounts));
  },
  addDiscount: (discount) => {
    const updated = [discount, ...get().discounts];
    set({ discounts: updated });
    localStorage.setItem('shopify_mock_discounts', JSON.stringify(updated));
  },
  updateDiscount: (id, updated) => {
    const updatedList = get().discounts.map((d) =>
      d.id === id ? { ...d, ...updated } : d
    );
    set({ discounts: updatedList });
    localStorage.setItem('shopify_mock_discounts', JSON.stringify(updatedList));
  },
  deleteDiscount: (id) => {
    const updatedList = get().discounts.filter((d) => d.id !== id);
    set({ discounts: updatedList });
    localStorage.setItem('shopify_mock_discounts', JSON.stringify(updatedList));
  },
}));
