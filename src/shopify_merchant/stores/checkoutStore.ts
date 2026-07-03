import { create } from 'zustand';
import { CheckoutConfig, FunnelMetric } from '../database/checkout';
import { CheckoutService } from '../services/checkout.service';

interface CheckoutState {
  checkoutConfig: CheckoutConfig | null;
  funnelMetrics: FunnelMetric[];
  loading: boolean;
  hydrateCheckout: () => void;
  updateCheckoutConfig: (config: Partial<CheckoutConfig>) => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  checkoutConfig: null,
  funnelMetrics: [],
  loading: false,

  hydrateCheckout: () => {
    set({ loading: true });
    const config = CheckoutService.getCheckoutConfig();
    const metrics = CheckoutService.getFunnelMetrics();
    set({ checkoutConfig: config, funnelMetrics: metrics, loading: false });
  },

  updateCheckoutConfig: (config) => {
    const active = get().checkoutConfig;
    if (!active) return;
    const updated = { ...active, ...config, updatedAt: new Date().toISOString() };
    set({ checkoutConfig: updated });
    CheckoutService.saveCheckoutConfig(updated);
  }
}));
