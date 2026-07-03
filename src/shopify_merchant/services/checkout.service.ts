import { CheckoutConfig, FunnelMetric, INITIAL_CHECKOUT_DATA, INITIAL_FUNNEL_METRICS } from '../database/checkout';

export class CheckoutService {
  private static STORAGE_KEY = 'noir_admin_checkout';
  private static FUNNEL_STORAGE_KEY = 'noir_admin_checkout_funnel';

  static getCheckoutConfig(): CheckoutConfig {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_CHECKOUT_DATA));
      return INITIAL_CHECKOUT_DATA;
    }
    return JSON.parse(stored);
  }

  static getFunnelMetrics(): FunnelMetric[] {
    const stored = localStorage.getItem(this.FUNNEL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.FUNNEL_STORAGE_KEY, JSON.stringify(INITIAL_FUNNEL_METRICS));
      return INITIAL_FUNNEL_METRICS;
    }
    return JSON.parse(stored);
  }

  static saveCheckoutConfig(config: CheckoutConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }
}
