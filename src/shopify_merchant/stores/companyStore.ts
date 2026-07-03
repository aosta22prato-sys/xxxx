import { create } from 'zustand';
import { B2BCompany } from '../types';
import { INITIAL_COMPANIES } from '../database/companies';

interface CompanyState {
  companies: B2BCompany[];
  setCompanies: (companies: B2BCompany[]) => void;
  addCompany: (company: B2BCompany) => void;
  updateCompany: (id: string, updated: Partial<B2BCompany>) => void;
  deleteCompany: (id: string) => void;
}

const getStoredCompanies = (): B2BCompany[] => {
  const saved = localStorage.getItem('shopify_mock_companies');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_COMPANIES;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: getStoredCompanies(),
  setCompanies: (companies) => {
    set({ companies });
    localStorage.setItem('shopify_mock_companies', JSON.stringify(companies));
  },
  addCompany: (company) => {
    const updated = [company, ...get().companies];
    set({ companies: updated });
    localStorage.setItem('shopify_mock_companies', JSON.stringify(updated));
  },
  updateCompany: (id, updated) => {
    const updatedList = get().companies.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    set({ companies: updatedList });
    localStorage.setItem('shopify_mock_companies', JSON.stringify(updatedList));
  },
  deleteCompany: (id) => {
    const updatedList = get().companies.filter((c) => c.id !== id);
    set({ companies: updatedList });
    localStorage.setItem('shopify_mock_companies', JSON.stringify(updatedList));
  },
}));
