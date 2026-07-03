import { create } from 'zustand';
import { SavedReport, ShopifyQlResult } from '../database/shopifyql';
import { ShopifyQlService } from '../services/shopifyql.service';

interface ShopifyQlState {
  reports: SavedReport[];
  activeQuery: string;
  queryResult: ShopifyQlResult | null;
  loading: boolean;
  error: string | null;
  hydrateReports: () => void;
  setActiveQuery: (q: string) => void;
  addReport: (rep: SavedReport) => void;
  deleteReport: (id: string) => void;
  runActiveQuery: () => void;
}

export const useShopifyQlStore = create<ShopifyQlState>((set, get) => ({
  reports: [],
  activeQuery: 'SHOW sum(gross_sales), sum(net_sales) FROM sales GROUP BY month ORDER BY month ASC',
  queryResult: null,
  loading: false,
  error: null,

  hydrateReports: () => {
    set({ loading: true });
    try {
      const reports = ShopifyQlService.getSavedReports();
      set({ reports, loading: false });
    } catch (_) {
      set({ error: 'Failed to hydrate reporting templates', loading: false });
    }
  },

  setActiveQuery: (q) => {
    set({ activeQuery: q });
  },

  addReport: (rep) => {
    const list = [...get().reports, rep];
    set({ reports: list });
    ShopifyQlService.saveReports(list);
  },

  deleteReport: (id) => {
    const list = get().reports.filter(r => r.id !== id);
    set({ reports: list });
    ShopifyQlService.saveReports(list);
  },

  runActiveQuery: () => {
    set({ loading: true, error: null });
    // Simulate slight processing network delay of query engine
    setTimeout(() => {
      try {
        const query = get().activeQuery;
        const result = ShopifyQlService.executeQuery(query);
        set({ queryResult: result, loading: false });
      } catch (err: any) {
        set({ error: err.message || 'Syntax error executing ShopifyQL query', queryResult: null, loading: false });
      }
    }, 400);
  }
}));
