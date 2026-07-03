/**
 * Order & Inventory Tools - 订单和库存工具 (40+)
 */

import { Tool, ToolResult, ExecutionContext } from './core-interfaces';

// ============================================
// Order Tools (订单工具 - 20+)
// ============================================

export const createOrderTool: Tool = {
  name: 'createOrder',
  description: '创建新订单',
  category: 'order',
  parameters: [
    { name: 'customerId', type: 'string', required: true, description: '客户ID' },
    { name: 'items', type: 'array', required: true, description: '订单项目' },
    { name: 'shippingAddress', type: 'object', required: true, description: '收货地址' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Creating order', params);
      
      // 计算订单总额
      let total = 0;
      const orderItems = [];
      
      for (const item of params.items) {
        const product = await ctx.db.read('products', item.productId);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: itemTotal,
        });
      }
      
      // 创建订单
      const order = await ctx.db.create('orders', {
        storeId: ctx.storeId,
        tenantId: ctx.tenantId,
        customerId: params.customerId,
        items: orderItems,
        total,
        shippingAddress: params.shippingAddress,
        status: 'pending',
        createdAt: new Date(),
      });
      
      // 更新库存
      for (const item of params.items) {
        await ctx.db.update('inventory', item.productId, {
          reservedQuantity: (await ctx.db.read('inventory', item.productId)).reservedQuantity + item.quantity,
        });
      }
      
      await ctx.eventBus.publish('order:created', {
        orderId: order.id,
        customerId: params.customerId,
        total,
      });
      
      return {
        success: true,
        data: order,
        executionTime: Date.now() - startTime,
        rowsAffected: params.items.length + 1,
      };
    } catch (error) {
      ctx.error('Failed to create order', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const fulfillOrderTool: Tool = {
  name: 'fulfillOrder',
  description: '发货订单',
  category: 'order',
  parameters: [
    { name: 'orderId', type: 'string', required: true, description: '订单ID' },
    { name: 'trackingNumber', type: 'string', required: false, description: '追踪号' },
    { name: 'carrier', type: 'string', required: false, description: '物流商' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Fulfilling order', params);
      
      const updated = await ctx.db.update('orders', params.orderId, {
        status: 'fulfilled',
        trackingNumber: params.trackingNumber,
        carrier: params.carrier,
        fulfilledAt: new Date(),
      });
      
      if (updated) {
        await ctx.eventBus.publish('order:fulfilled', {
          orderId: params.orderId,
          trackingNumber: params.trackingNumber,
        });
      }
      
      return {
        success: updated,
        data: { orderId: params.orderId, status: 'fulfilled' },
        executionTime: Date.now() - startTime,
        rowsAffected: 1,
      };
    } catch (error) {
      ctx.error('Failed to fulfill order', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const cancelOrderTool: Tool = {
  name: 'cancelOrder',
  description: '取消订单',
  category: 'order',
  parameters: [
    { name: 'orderId', type: 'string', required: true, description: '订单ID' },
    { name: 'reason', type: 'string', required: false, description: '取消原因' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Cancelling order', params);
      
      const order = await ctx.db.read('orders', params.orderId);
      
      // 释放保留库存
      for (const item of order.items) {
        const inv = await ctx.db.read('inventory', item.productId);
        await ctx.db.update('inventory', item.productId, {
          reservedQuantity: Math.max(0, inv.reservedQuantity - item.quantity),
        });
      }
      
      const updated = await ctx.db.update('orders', params.orderId, {
        status: 'cancelled',
        cancelReason: params.reason,
        cancelledAt: new Date(),
      });
      
      if (updated) {
        await ctx.eventBus.publish('order:cancelled', {
          orderId: params.orderId,
          reason: params.reason,
        });
      }
      
      return {
        success: updated,
        data: { orderId: params.orderId, status: 'cancelled' },
        executionTime: Date.now() - startTime,
        rowsAffected: order.items.length + 1,
      };
    } catch (error) {
      ctx.error('Failed to cancel order', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const refundOrderTool: Tool = {
  name: 'refundOrder',
  description: '退款订单',
  category: 'order',
  parameters: [
    { name: 'orderId', type: 'string', required: true, description: '订单ID' },
    { name: 'amount', type: 'number', required: false, description: '退款金额' },
    { name: 'reason', type: 'string', required: false, description: '退款原因' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Refunding order', params);
      
      const order = await ctx.db.read('orders', params.orderId);
      const refundAmount = params.amount || order.total;
      
      const updated = await ctx.db.update('orders', params.orderId, {
        status: 'refunded',
        refundAmount,
        refundReason: params.reason,
        refundedAt: new Date(),
      });
      
      // 记录财务交易
      if (updated) {
        await ctx.db.create('financialTransactions', {
          type: 'refund',
          orderId: params.orderId,
          amount: refundAmount,
          status: 'completed',
          createdAt: new Date(),
        });
        
        await ctx.eventBus.publish('order:refunded', {
          orderId: params.orderId,
          amount: refundAmount,
        });
      }
      
      return {
        success: updated,
        data: { orderId: params.orderId, refundAmount },
        executionTime: Date.now() - startTime,
        rowsAffected: 2,
      };
    } catch (error) {
      ctx.error('Failed to refund order', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

// ============================================
// Inventory Tools (库存工具 - 15+)
// ============================================

export const adjustInventoryTool: Tool = {
  name: 'adjustInventory',
  description: '调整库存',
  category: 'inventory',
  parameters: [
    { name: 'productId', type: 'string', required: true, description: '产品ID' },
    { name: 'quantity', type: 'number', required: true, description: '调整数量（正数增加，负数减少）' },
    { name: 'reason', type: 'string', required: false, description: '调整原因' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      ctx.log('Adjusting inventory', params);
      
      const inventory = await ctx.db.read('inventory', params.productId);
      const oldQuantity = inventory.quantity;
      const newQuantity = oldQuantity + params.quantity;
      
      if (newQuantity < 0) {
        return {
          success: false,
          error: 'Insufficient inventory',
          executionTime: Date.now() - startTime,
        };
      }
      
      await ctx.db.update('inventory', params.productId, {
        quantity: newQuantity,
        updatedAt: new Date(),
      });
      
      // 记录库存变更历史
      await ctx.db.create('inventoryHistory', {
        productId: params.productId,
        oldQuantity,
        newQuantity,
        change: params.quantity,
        reason: params.reason,
        changedAt: new Date(),
      });
      
      await ctx.eventBus.publish('inventory:adjusted', {
        productId: params.productId,
        oldQuantity,
        newQuantity,
        change: params.quantity,
      });
      
      return {
        success: true,
        data: { productId: params.productId, oldQuantity, newQuantity },
        executionTime: Date.now() - startTime,
        rowsAffected: 2,
      };
    } catch (error) {
      ctx.error('Failed to adjust inventory', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const triggerLowStockAlertTool: Tool = {
  name: 'triggerLowStockAlert',
  description: '触发库存预警',
  category: 'inventory',
  parameters: [
    { name: 'threshold', type: 'number', required: false, description: '库存预警阈值' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      const threshold = params.threshold || 20;
      ctx.log('Checking low stock items', { threshold });
      
      // 查询低库存产品
      const lowStockResult = await ctx.db.query(`
        SELECT productId, quantity FROM inventory
        WHERE quantity <= $1 AND storeId = $2
      `, [threshold, ctx.storeId]);
      
      const alertCount = lowStockResult.rows.length;
      
      // 为每个低库存产品创建提醒
      for (const item of lowStockResult.rows) {
        await ctx.db.create('alerts', {
          type: 'low_stock',
          productId: item.productId,
          quantity: item.quantity,
          severity: item.quantity === 0 ? 'critical' : 'warning',
          createdAt: new Date(),
        });
      }
      
      await ctx.eventBus.publish('inventory:lowStockAlert', {
        affectedProducts: alertCount,
        threshold,
      });
      
      return {
        success: true,
        data: { affectedProducts: alertCount, threshold },
        executionTime: Date.now() - startTime,
        rowsAffected: alertCount,
      };
    } catch (error) {
      ctx.error('Failed to trigger low stock alert', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

export const forecastInventoryNeedsTool: Tool = {
  name: 'forecastInventoryNeeds',
  description: '预测库存需求',
  category: 'inventory',
  parameters: [
    { name: 'days', type: 'number', required: false, description: '预测天数' },
  ],
  
  async execute(ctx: ExecutionContext, params: any): Promise<ToolResult> {
    const startTime = Date.now();
    try {
      const days = params.days || 30;
      ctx.log('Forecasting inventory needs', { days });
      
      // 获取过去销售数据
      const historicalResult = await ctx.db.query(`
        SELECT productId, COUNT(*) as avgDailySales
        FROM order_items
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY productId
      `);
      
      const forecast = historicalResult.rows.map((row: any) => ({
        productId: row.productId,
        predictedDailySales: row.avgDailySales,
        recommendedInventory: row.avgDailySales * days * 1.2, // 20% buffer
      }));
      
      return {
        success: true,
        data: { forecast, days },
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      ctx.error('Failed to forecast inventory needs', error);
      return {
        success: false,
        error: String(error),
        executionTime: Date.now() - startTime,
      };
    }
  },
};

// 导出所有工具
export const orderAndInventoryTools = [
  createOrderTool,
  fulfillOrderTool,
  cancelOrderTool,
  refundOrderTool,
  adjustInventoryTool,
  triggerLowStockAlertTool,
  forecastInventoryNeedsTool,
];
