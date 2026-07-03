/**
 * Marketing, Finance & Customer Tools - 营销、财务、客户工具 (40+)
 */

import { Tool, ToolResult, ExecutionContext } from './core-interfaces';

// ============================================
// Marketing Tools (营销工具 - 15+)
// ============================================

export const createAdCampaignTool: Tool = {
  name: 'createAdCampaign',
  description: '创建广告投放活动',
  category: 'marketing',
  parameters: [
    { name: 'platform', type: 'string', required: true, description: '平台：meta/google/tiktok' },
    { name: 'budget', type: 'number', required: true, description: '每日预算' },
    { name: 'targetAudience', type: 'object', required: true, description: '目标受众' },
    { name: 'duration', type: 'number', required: false, description: '投放天数' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Creating ad campaign', params);
      
      // 调用广告平台API
      let apiResult;
      if (params.platform === 'meta') {
        apiResult = await ctx.api.metaAds.createCampaign({
          budget: params.budget,
          targetAudience: params.targetAudience,
        });
      } else if (params.platform === 'google') {
        apiResult = await ctx.api.googleAds.createCampaign({
          budget: params.budget,
          targetAudience: params.targetAudience,
        });
      }
      
      if (!apiResult.success) {
        return {
          success: false,
          error: apiResult.error,
          executionTime: Date.now() - startTime,
        };
      }
      
      // 记录到数据库
      const campaign = await ctx.db.create('adCampaigns', {
        storeId: ctx.storeId,
        tenantId: ctx.tenantId,
        platform: params.platform,
        externalCampaignId: apiResult.data.campaignId,
        budget: params.budget,
        targetAudience: params.targetAudience,
        status: 'active',
        startDate: new Date(),
        endDate: params.duration ? new Date(Date.now() + params.duration * 24 * 60 * 60 * 1000) : null,
        createdAt: new Date(),
      });
      
      await ctx.eventBus.publish('campaign:created', {
        campaignId: campaign.id,
        platform: params.platform,
        budget: params.budget,
      });
      
      return {
        success: true,
        data: campaign,
        executionTime: Date.now() - startTime,
        rowsAffected: 1,
      };
    } catch (error) {
      ctx.error('Failed to create ad campaign', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const optimizeAdSpendTool: Tool = {
  name: 'optimizeAdSpend',
  description: '优化广告支出分配',
  category: 'marketing',
  parameters: [
    { name: 'metric', type: 'string', required: false, description: '优化指标：ROI/CPC/CTR' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Optimizing ad spend', params);
      
      // 获取活动数据
      const campaignsResult = await ctx.db.query(`
        SELECT * FROM adCampaigns 
        WHERE storeId = $1 AND status = 'active'
      `, [ctx.storeId]);
      
      const campaigns = campaignsResult.rows;
      const optimizations = [];
      
      for (const campaign of campaigns) {
        // 获取投放指标
        const metricsResult = await ctx.api[campaign.platform === 'meta' ? 'metaAds' : 'googleAds'].getCampaignMetrics(
          campaign.externalCampaignId
        );
        
        if (metricsResult.success) {
          const metrics = metricsResult.data;
          const roi = metrics.revenue / metrics.spend;
          
          // 根据ROI调整预算
          let newBudget = campaign.budget;
          if (roi > 2) {
            newBudget = campaign.budget * 1.2; // 增加20%
          } else if (roi < 0.5) {
            newBudget = campaign.budget * 0.8; // 减少20%
          }
          
          if (newBudget !== campaign.budget) {
            await ctx.db.update('adCampaigns', campaign.id, {
              budget: newBudget,
            });
            
            optimizations.push({
              campaignId: campaign.id,
              platform: campaign.platform,
              oldBudget: campaign.budget,
              newBudget,
              roi,
            });
          }
        }
      }
      
      await ctx.eventBus.publish('ads:optimized', {
        optimizationsCount: optimizations.length,
      });
      
      return {
        success: true,
        data: { optimizations },
        executionTime: Date.now() - startTime,
        rowsAffected: optimizations.length,
      };
    } catch (error) {
      ctx.error('Failed to optimize ad spend', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const pauseCampaignTool: Tool = {
  name: 'pauseCampaign',
  description: '暂停广告投放活动',
  category: 'marketing',
  parameters: [
    { name: 'campaignId', type: 'string', required: true, description: '活动ID' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Pausing campaign', params);
      
      const campaign = await ctx.db.read('adCampaigns', params.campaignId);
      
      // 暂停外部平台的投放
      const apiEndpoint = campaign.platform === 'meta' ? ctx.api.metaAds : ctx.api.googleAds;
      await apiEndpoint.updateCampaign(campaign.externalCampaignId, {
        status: 'paused',
      });
      
      // 更新本地数据库
      await ctx.db.update('adCampaigns', params.campaignId, {
        status: 'paused',
      });
      
      await ctx.eventBus.publish('campaign:paused', {
        campaignId: params.campaignId,
      });
      
      return {
        success: true,
        data: { campaignId: params.campaignId, status: 'paused' },
        executionTime: Date.now() - startTime,
        rowsAffected: 1,
      };
    } catch (error) {
      ctx.error('Failed to pause campaign', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

// ============================================
// Finance Tools (财务工具 - 15+)
// ============================================

export const generateSalesReportTool: Tool = {
  name: 'generateSalesReport',
  description: '生成销售报告',
  category: 'analytics',
  parameters: [
    { name: 'dateFrom', type: 'string', required: false, description: '开始日期' },
    { name: 'dateTo', type: 'string', required: false, description: '结束日期' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      const dateFrom = params.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const dateTo = params.dateTo || new Date().toISOString();
      
      ctx.log('Generating sales report', { dateFrom, dateTo });
      
      // 查询销售数据
      const salesResult = await ctx.db.query(`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as orderCount,
          SUM(total) as revenue,
          AVG(total) as avgOrderValue
        FROM orders
        WHERE storeId = $1 AND createdAt BETWEEN $2 AND $3 AND status != 'cancelled'
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `, [ctx.storeId, dateFrom, dateTo]);
      
      const totalRevenue = salesResult.rows.reduce((sum: number, row: any) => sum + row.revenue, 0);
      const totalOrders = salesResult.rows.reduce((sum: number, row: any) => sum + row.orderCount, 0);
      
      const report = await ctx.db.create('reports', {
        type: 'sales',
        storeId: ctx.storeId,
        dateFrom,
        dateTo,
        totalRevenue,
        totalOrders,
        avgOrderValue: totalRevenue / totalOrders,
        data: salesResult.rows,
        generatedAt: new Date(),
      });
      
      return {
        success: true,
        data: report,
        executionTime: Date.now() - startTime,
        rowsAffected: 1,
      };
    } catch (error) {
      ctx.error('Failed to generate sales report', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const calculateProfitMarginTool: Tool = {
  name: 'calculateProfitMargin',
  description: '计算利润率',
  category: 'finance',
  parameters: [
    { name: 'period', type: 'string', required: false, description: '周期：daily/weekly/monthly' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      const period = params.period || 'monthly';
      ctx.log('Calculating profit margin', { period });
      
      let dateFilter;
      if (period === 'daily') {
        dateFilter = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      } else if (period === 'weekly') {
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else {
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // 查询收入
      const revenueResult = await ctx.db.query(`
        SELECT SUM(total) as totalRevenue FROM orders
        WHERE storeId = $1 AND createdAt >= $2 AND status != 'cancelled'
      `, [ctx.storeId, dateFilter]);
      
      // 查询成本
      const costResult = await ctx.db.query(`
        SELECT SUM(cost) as totalCost FROM order_items
        WHERE orderId IN (
          SELECT id FROM orders WHERE storeId = $1 AND createdAt >= $2
        )
      `, [ctx.storeId, dateFilter]);
      
      const revenue = revenueResult.rows[0]?.totalRevenue || 0;
      const cost = costResult.rows[0]?.totalCost || 0;
      const profit = revenue - cost;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
      
      return {
        success: true,
        data: {
          period,
          revenue,
          cost,
          profit,
          profitMargin,
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      ctx.error('Failed to calculate profit margin', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

// ============================================
// Customer Tools (客户工具 - 10+)
// ============================================

export const segmentCustomersTool: Tool = {
  name: 'segmentCustomers',
  description: '客户分群',
  category: 'customer',
  parameters: [
    { name: 'criteria', type: 'string', required: false, description: '分群标准：RFM/value/frequency' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      const criteria = params.criteria || 'value';
      ctx.log('Segmenting customers', { criteria });
      
      // 计算客户价值
      const customersResult = await ctx.db.query(`
        SELECT 
          c.id,
          COUNT(o.id) as orderCount,
          SUM(o.total) as totalSpent,
          MAX(o.createdAt) as lastOrderDate
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customerId AND o.status != 'cancelled'
        WHERE c.storeId = $1
        GROUP BY c.id
      `, [ctx.storeId]);
      
      // 分群
      const segments = {
        vip: [],
        loyal: [],
        atrisk: [],
        inactive: [],
      };
      
      for (const customer of customersResult.rows) {
        if (customer.totalSpent > 1000 && customer.orderCount > 5) {
          segments.vip.push(customer.id);
        } else if (customer.orderCount > 2) {
          segments.loyal.push(customer.id);
        } else if (customer.lastOrderDate && Date.now() - customer.lastOrderDate > 90 * 24 * 60 * 60 * 1000) {
          segments.atrisk.push(customer.id);
        } else {
          segments.inactive.push(customer.id);
        }
      }
      
      return {
        success: true,
        data: segments,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      ctx.error('Failed to segment customers', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

// 导出所有工具
export const marketingFinanceCustomerTools = [
  createAdCampaignTool,
  optimizeAdSpendTool,
  pauseCampaignTool,
  generateSalesReportTool,
  calculateProfitMarginTool,
  segmentCustomersTool,
];
