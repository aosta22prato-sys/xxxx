/**
 * Business State Observer - 实时读取业务状态
 * 
 * 这是执行循环的"眼睛"，实时观察和汇总业务状态
 */

import { BusinessState, ExecutionContext, Database } from './core-interfaces';

export class BusinessStateObserver {
  private static instance: BusinessStateObserver;

  private constructor() {
    console.log('👁️  [Business State Observer] 初始化实时状态观察器...');
  }

  public static getInstance(): BusinessStateObserver {
    if (!BusinessStateObserver.instance) {
      BusinessStateObserver.instance = new BusinessStateObserver();
    }
    return BusinessStateObserver.instance;
  }

  /**
   * 观察完整的业务状态 - 从数据库实时读取
   */
  public async observeBusinessState(
    ctx: ExecutionContext
  ): Promise<BusinessState> {
    console.log('📊 [State Observer] 开始观察业务状态...');

    try {
      const state: BusinessState = {
        // 销售数据
        revenue: await this.getRevenueData(ctx),

        // 利润数据
        profit: await this.getProfitData(ctx),

        // 库存数据
        inventory: await this.getInventoryData(ctx),

        // 客户数据
        customers: await this.getCustomerData(ctx),

        // 订单数据
        orders: await this.getOrderData(ctx),

        // 营销数据
        marketing: await this.getMarketingData(ctx),

        // 物流数据
        logistics: await this.getLogisticsData(ctx),

        // 时间戳
        timestamp: Date.now(),
      };

      console.log('✅ [State Observer] 业务状态观察完成');
      return state;
    } catch (error) {
      ctx.error('Failed to observe business state', error);
      throw error;
    }
  }

  /**
   * 获取销售收入数据
   */
  private async getRevenueData(ctx: ExecutionContext) {
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);

    const queryRevenue = async (sinceDate: Date) => {
      const result = await ctx.db.query(
        `SELECT SUM(total) as total FROM orders
         WHERE storeId = $1 AND createdAt >= $2 AND status != 'cancelled'`,
        [ctx.storeId, sinceDate]
      );
      return result.rows[0]?.total || 0;
    };

    return {
      daily: await queryRevenue(dayAgo),
      weekly: await queryRevenue(weekAgo),
      monthly: await queryRevenue(monthAgo),
      ytd: await queryRevenue(yearAgo),
    };
  }

  /**
   * 获取利润数据
   */
  private async getProfitData(ctx: ExecutionContext) {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const revenueResult = await ctx.db.query(
      `SELECT SUM(o.total) as revenue FROM orders o
       WHERE o.storeId = $1 AND o.createdAt >= $2 AND o.status != 'cancelled'`,
      [ctx.storeId, monthAgo]
    );

    const costResult = await ctx.db.query(
      `SELECT SUM(oi.quantity * p.costPrice) as cost
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE p.storeId = $1 AND oi.createdAt >= $2`,
      [ctx.storeId, monthAgo]
    );

    const revenue = revenueResult.rows[0]?.revenue || 0;
    const cost = costResult.rows[0]?.cost || 0;
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      absolute: profit,
      margin,
      costOfGoods: cost,
    };
  }

  /**
   * 获取库存数据
   */
  private async getInventoryData(ctx: ExecutionContext) {
    const inventoryResult = await ctx.db.query(
      `SELECT 
         COUNT(*) as totalSKUs,
         SUM(quantity) as totalUnits,
         SUM(warehouseCapacity) as warehouseCapacity
       FROM inventory
       WHERE storeId = $1`,
      [ctx.storeId]
    );

    const inv = inventoryResult.rows[0];

    // 计算库存周转率和天数
    const salesResult = await ctx.db.query(
      `SELECT COUNT(*) as totalUnitsSold FROM order_items
       WHERE orderId IN (SELECT id FROM orders WHERE storeId = $1 AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY))`,
      [ctx.storeId]
    );

    const unitsSold = salesResult.rows[0]?.totalUnitsSold || 1;
    const totalUnits = inv.totalUnits || 1;
    const turnoverRate = (unitsSold / 30) * 365; // 年周转率
    const daysSalesOfInventory = 365 / Math.max(1, turnoverRate);

    return {
      totalSKUs: inv.totalSKUs || 0,
      totalUnits: inv.totalUnits || 0,
      warehouseCapacity: inv.warehouseCapacity || 0,
      turnoverRate,
      daysSalesOfInventory,
    };
  }

  /**
   * 获取客户数据
   */
  private async getCustomerData(ctx: ExecutionContext) {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalResult = await ctx.db.query(
      `SELECT COUNT(*) as total FROM customers WHERE storeId = $1`,
      [ctx.storeId]
    );

    const newResult = await ctx.db.query(
      `SELECT COUNT(*) as new FROM customers WHERE storeId = $1 AND createdAt >= $2`,
      [ctx.storeId, monthAgo]
    );

    const repeatResult = await ctx.db.query(
      `SELECT COUNT(DISTINCT customerId) as repeat FROM orders
       WHERE storeId = $1 
       GROUP BY customerId 
       HAVING COUNT(*) > 1`,
      [ctx.storeId]
    );

    const ltv = await ctx.db.query(
      `SELECT AVG(totalSpent) as avgLTV FROM (
         SELECT SUM(total) as totalSpent FROM orders
         WHERE storeId = $1 AND status != 'cancelled'
         GROUP BY customerId
       ) subq`,
      [ctx.storeId]
    );

    const churnResult = await ctx.db.query(
      `SELECT 
         COUNT(DISTINCT c.id) as churned
       FROM customers c
       WHERE c.storeId = $1 
       AND c.id NOT IN (
         SELECT DISTINCT customerId FROM orders
         WHERE storeId = $1 AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       )`,
      [ctx.storeId]
    );

    const total = totalResult.rows[0]?.total || 1;
    const churned = churnResult.rows[0]?.churned || 0;

    return {
      totalCount: total,
      newThisMonth: newResult.rows[0]?.new || 0,
      repeatRate: total > 0 ? ((repeatResult.rows.length || 0) / total) * 100 : 0,
      avgLifetimeValue: ltv.rows[0]?.avgLTV || 0,
      churnRate: total > 0 ? (churned / total) * 100 : 0,
    };
  }

  /**
   * 获取订单数据
   */
  private async getOrderData(ctx: ExecutionContext) {
    const totalResult = await ctx.db.query(
      `SELECT COUNT(*) as total FROM orders WHERE storeId = $1`,
      [ctx.storeId]
    );

    const statusResult = await ctx.db.query(
      `SELECT status, COUNT(*) as count FROM orders 
       WHERE storeId = $1 
       GROUP BY status`,
      [ctx.storeId]
    );

    const aovResult = await ctx.db.query(
      `SELECT AVG(total) as aov FROM orders 
       WHERE storeId = $1 AND status != 'cancelled'`,
      [ctx.storeId]
    );

    const conversionResult = await ctx.db.query(
      `SELECT 
         (SELECT COUNT(*) FROM orders WHERE storeId = $1) as orders,
         (SELECT COUNT(*) FROM product_views WHERE storeId = $1 AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as views`,
      [ctx.storeId]
    );

    const statuses: { [key: string]: number } = {
      pending: 0,
      fulfilled: 0,
      cancelled: 0,
    };

    for (const row of statusResult.rows) {
      statuses[row.status] = row.count;
    }

    const conversionData = conversionResult.rows[0];
    const conversionRate =
      conversionData.views > 0
        ? (conversionData.orders / conversionData.views) * 100
        : 0;

    return {
      totalCount: totalResult.rows[0]?.total || 0,
      pendingCount: statuses.pending,
      fulfilledCount: statuses.fulfilled,
      cancelledCount: statuses.cancelled,
      avgOrderValue: aovResult.rows[0]?.aov || 0,
      conversionRate,
    };
  }

  /**
   * 获取营销数据
   */
  private async getMarketingData(ctx: ExecutionContext) {
    const adsResult = await ctx.db.query(
      `SELECT 
         SUM(spend) as totalSpend,
         SUM(revenue) as totalRevenue,
         SUM(impressions) as totalImpressions,
         SUM(clicks) as totalClicks,
         COUNT(*) as campaignCount
       FROM adCampaigns 
       WHERE storeId = $1 AND status = 'active'`,
      [ctx.storeId]
    );

    const ads = adsResult.rows[0];
    const spend = ads?.totalSpend || 0;
    const revenue = ads?.totalRevenue || 0;
    const roi = spend > 0 ? revenue / spend : 0;
    const impressions = ads?.totalImpressions || 0;
    const clicks = ads?.totalClicks || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;

    return {
      adsSpend: spend,
      adsROI: roi,
      impressions,
      clicks,
      ctr,
      cpc,
      activeCampaigns: ads?.campaignCount || 0,
    };
  }

  /**
   * 获取物流数据
   */
  private async getLogisticsData(ctx: ExecutionContext) {
    const shippingResult = await ctx.db.query(
      `SELECT 
         AVG(TIMESTAMPDIFF(DAY, createdAt, fulfilledAt)) as avgShippingTime,
         AVG(shippingCost) as avgShippingCost,
         COUNT(*) as totalShipped
       FROM orders
       WHERE storeId = $1 AND status = 'fulfilled'`,
      [ctx.storeId]
    );

    const shipping = shippingResult.rows[0];

    const returnResult = await ctx.db.query(
      `SELECT COUNT(*) as returned FROM returns
       WHERE storeId = $1`,
      [ctx.storeId]
    );

    const totalOrders = await ctx.db.query(
      `SELECT COUNT(*) as total FROM orders WHERE storeId = $1`,
      [ctx.storeId]
    );

    const returns = returnResult.rows[0]?.returned || 0;
    const total = totalOrders.rows[0]?.total || 1;
    const returnRate = (returns / total) * 100;

    return {
      avgShippingTime: shipping?.avgShippingTime || 0,
      shippingCost: shipping?.avgShippingCost || 0,
      deliverySuccessRate: 98, // TODO: 从数据库计算
      returnRate,
    };
  }
}

export const businessStateObserver = BusinessStateObserver.getInstance();
