/**
 * Analytics Service Layer - Level 10 Separation
 * High-performance service abstraction supporting switching between Mock, API, or WebSocket channels.
 */

import { ServiceProvider } from './product.service';

export interface ReportMetric {
  metric: string;
  value: string;
  note: string;
  trend: 'up' | 'down' | 'neutral';
}

export class AnalyticsService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async getRealTimeMetrics(): Promise<ReportMetric[]> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/analytics/realtime');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }

    // Default mock data aligned with PWA standard indicators
    return [
      { metric: 'Conversion Rate (转化率)', value: '2.84%', note: '↑ 0.12% 比上期对账周', trend: 'up' },
      { metric: 'Active Sessions (实时访客数)', value: '4,520 Pcs', note: '直接访客 45%, 社交引流 35%', trend: 'up' },
      { metric: 'Top Sell Category (最卓越产品类目)', value: 'Leather Pocket Wallet', note: '贡献本月订单的 35%', trend: 'up' },
      { metric: 'Average Order Value (客单价)', value: '€248.50', note: '↑ 4.2% 高端客群拉动明显', trend: 'up' },
    ];
  }
}
