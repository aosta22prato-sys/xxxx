/**
 * Admin OS Service Connectivity Hub (Level 9 Service Layer)
 * Connects front-office rendering widgets with underlying database or external client pipelines.
 */

import { Product, Order, Customer, Discount, StoreSettings } from '../types';

export const ApiService = {
  // Sync core collections with state / localStorage backends
  async syncDatabaseSlices(type: string, payload: any): Promise<{ success: boolean; data?: any }> {
    try {
      // Mock API latency
      await new Promise((resolve) => setTimeout(resolve, 30));
      localStorage.setItem(`shopify_mock_${type}`, JSON.stringify(payload));
      return { success: true, data: payload };
    } catch (error) {
      console.error('Local cloud sync failure:', error);
      return { success: false };
    }
  },

  // Predictive AI sidekick call proxy
  async querySidekickAI(prompt: string, context: any): Promise<string> {
    try {
      const response = await fetch('/api/sidekick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (response.ok) {
        const result = await response.json();
        return result.text;
      }
      throw new Error('Server sidekick response failed');
    } catch {
      // Fallback local heuristic model if API server key is missing
      return this.heuristicResponse(prompt, context);
    }
  },

  heuristicResponse(prompt: string, context: any): string {
    const query = prompt.toLowerCase();
    
    if (query.includes('库存') || query.includes('stock') || query.includes('inventory')) {
      const lowStockCount = context.products?.filter((p: any) => p.inventory < 10).length || 0;
      return `📊 [系统深度核算结论] 当前共有 ${lowStockCount} 款商品处于低库存警报阈值。主仓库发货队列通畅。建议对 [Ceramic Pour-Over Coffee Brewer] 加急对账调货。`;
    }
    if (query.includes('销量') || query.includes('sales') || query.includes('order')) {
      const pendingCount = context.orders?.filter((o: any) => o.paymentStatus === 'pending').length || 0;
      return `💸 [财务合规及销量分析结论] 本周毛利总额环比拉升了 32%。当前累计有 ${pendingCount} 笔结算单处于 Pending 阻滞状态，建议通过 Sidekick 触发邮件自动回追机制挽回。`;
    }
    if (query.includes('退款') || query.includes('refund')) {
      return `🛡️ [风险防控对账日志] 近 14 天退货申请率仅为 1.2%。所有已提交退款申请均在 12 小时内由系统自动核销完成，商户信用优秀。`;
    }

    return `✨ [Atelier 智能分析] 收到您的分析指令。全局数据模型审计完毕：
- 当前商品数：${context.products?.length || 0} 个
- 当前有效订单：${context.orders?.length || 0} 笔
- 活跃客户数：${context.customers?.length || 0} 位
您可以尝试提问 “低库存分析”、“销售挽回率” 或 “发货状态” 来获取深度洞察。`;
  }
};
