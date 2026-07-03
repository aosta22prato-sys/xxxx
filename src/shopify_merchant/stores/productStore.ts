import { create } from 'zustand';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface ProductState {
  products: Product[];
  productFilter: 'All' | 'active' | 'draft' | 'archived';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setProductFilter: (filter: 'All' | 'active' | 'draft' | 'archived') => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const getStoredProducts = (): Product[] => {
  const saved = localStorage.getItem('shopify_mock_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_PRODUCTS;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: getStoredProducts(),
  productFilter: 'All',
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setProductFilter: (filter) => set({ productFilter: filter }),
  setProducts: (products) => {
    set({ products });
    localStorage.setItem('shopify_mock_products', JSON.stringify(products));
  },
  addProduct: (product) => {
    const updated = [product, ...get().products];
    set({ products: updated });
    localStorage.setItem('shopify_mock_products', JSON.stringify(updated));
  },
  updateProduct: (id, updated) => {
    const updatedList = get().products.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    set({ products: updatedList });
    localStorage.setItem('shopify_mock_products', JSON.stringify(updatedList));
  },
  deleteProduct: (id) => {
    const updatedList = get().products.filter((p) => p.id !== id);
    set({ products: updatedList });
    localStorage.setItem('shopify_mock_products', JSON.stringify(updatedList));
  },
}));
