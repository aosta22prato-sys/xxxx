/**
 * AI Tool Integration - Register and manage AI tools
 * Bridges AI agents with ExecutionKernel
 */

import { ExecutionKernel } from './execution-kernel';
import { ActionRecord } from './types';

export interface ToolDefinition {
  name: string;
  description: string;
  executor: (params: any) => Promise<any>;
  isCompensable?: boolean;
  compensator?: (params: any) => Promise<any>;
  timeout?: number;
  retryable?: boolean;
  metadata?: Record<string, any>;
}

export class AIToolRegistry {
  private kernel: ExecutionKernel;
  private tools: Map<string, ToolDefinition> = new Map();

  constructor(kernel: ExecutionKernel) {
    this.kernel = kernel;
    console.log('[AIToolRegistry] Initialized');
  }

  /**
   * Register tool
   */
  registerTool(definition: ToolDefinition): void {
    if (this.tools.has(definition.name)) {
      console.warn(`[AIToolRegistry] Tool already registered: ${definition.name}, overwriting`);
    }

    this.tools.set(definition.name, definition);

    // Register with kernel
    this.kernel.registerTool(definition.name, definition.executor);

    // Register compensator if available
    if (definition.isCompensable && definition.compensator) {
      const rollbackName = `${definition.name}_rollback`;
      this.kernel.registerTool(rollbackName, definition.compensator);
    }

    console.log(`[AIToolRegistry] Tool registered: ${definition.name}`);
  }

  /**
   * Register multiple tools
   */
  registerTools(definitions: ToolDefinition[]): void {
    for (const def of definitions) {
      this.registerTool(def);
    }
  }

  /**
   * Get tool definition
   */
  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  /**
   * List all registered tools
   */
  listTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Execute tool via kernel
   */
  async executeTool(
    tool: string,
    params: any,
    context: any = {}
  ): Promise<any> {
    const toolDef = this.tools.get(tool);
    if (!toolDef) {
      throw new Error(`Tool not registered: ${tool}`);
    }

    const action: ActionRecord = {
      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tool,
      params,
      status: 'pending',
      createdAt: Date.now()
    };

    const results = await this.kernel.execute([action], context, {
      captureState: true,
      auditLog: true
    });

    if (!results[0].success) {
      throw new Error(results[0].error);
    }

    return results[0].data;
  }

  /**
   * Get registered tool count
   */
  getToolCount(): number {
    return this.tools.size;
  }

  /**
   * Check if tool exists
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Remove tool
   */
  removeTool(name: string): void {
    this.tools.delete(name);
    console.log(`[AIToolRegistry] Tool removed: ${name}`);
  }
}

/**
 * Create AI tool definition helper
 */
export function createToolDefinition(
  name: string,
  description: string,
  executor: (params: any) => Promise<any>,
  options: {
    isCompensable?: boolean;
    compensator?: (params: any) => Promise<any>;
    timeout?: number;
    retryable?: boolean;
    metadata?: Record<string, any>;
  } = {}
): ToolDefinition {
  return {
    name,
    description,
    executor,
    isCompensable: options.isCompensable || false,
    compensator: options.compensator,
    timeout: options.timeout,
    retryable: options.retryable !== false,
    metadata: options.metadata
  };
}

/**
 * Example tools for commerce operations
 */
export const commerceTools = {
  /**
   * Inventory tool
   */
  createInventoryTool: (): ToolDefinition =>
    createToolDefinition(
      'inventory.reserve',
      'Reserve inventory for order',
      async (params: { skuId: string; quantity: number; orderId: string }) => {
        // Mock implementation - replace with actual inventory service
        console.log(`[InventoryTool] Reserving ${params.quantity} units of ${params.skuId}`);
        return {
          reserved: params.quantity,
          skuId: params.skuId,
          orderId: params.orderId,
          timestamp: Date.now()
        };
      },
      {
        isCompensable: true,
        compensator: async (params: { skuId: string; quantity: number; orderId: string }) => {
          console.log(`[InventoryTool] Releasing ${params.quantity} units of ${params.skuId}`);
          return {
            released: params.quantity,
            skuId: params.skuId,
            orderId: params.orderId,
            timestamp: Date.now()
          };
        },
        timeout: 5000,
        retryable: true
      }
    ),

  /**
   * Payment tool
   */
  createPaymentTool: (): ToolDefinition =>
    createToolDefinition(
      'payment.process',
      'Process payment for order',
      async (params: { orderId: string; amount: number; method: string }) => {
        // Mock implementation - replace with actual payment service
        console.log(`[PaymentTool] Processing ${params.amount} via ${params.method} for ${params.orderId}`);
        return {
          orderId: params.orderId,
          amount: params.amount,
          status: 'success',
          transactionId: `tx_${Date.now()}`,
          timestamp: Date.now()
        };
      },
      {
        isCompensable: true,
        compensator: async (params: { orderId: string; amount: number; transactionId?: string }) => {
          console.log(`[PaymentTool] Refunding ${params.amount} for ${params.orderId}`);
          return {
            orderId: params.orderId,
            amount: params.amount,
            status: 'refunded',
            timestamp: Date.now()
          };
        },
        timeout: 10000,
        retryable: true
      }
    ),

  /**
   * Logistics tool
   */
  createLogisticsTool: (): ToolDefinition =>
    createToolDefinition(
      'logistics.ship',
      'Create shipment',
      async (params: { orderId: string; items: any[]; destination: string }) => {
        // Mock implementation - replace with actual logistics service
        console.log(`[LogisticsTool] Shipping order ${params.orderId} to ${params.destination}`);
        return {
          orderId: params.orderId,
          shipmentId: `ship_${Date.now()}`,
          status: 'created',
          trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: Date.now()
        };
      },
      {
        isCompensable: true,
        compensator: async (params: { orderId: string; shipmentId?: string }) => {
          console.log(`[LogisticsTool] Canceling shipment for order ${params.orderId}`);
          return {
            orderId: params.orderId,
            status: 'cancelled',
            timestamp: Date.now()
          };
        },
        timeout: 8000,
        retryable: true
      }
    ),

  /**
   * Notification tool
   */
  createNotificationTool: (): ToolDefinition =>
    createToolDefinition(
      'notification.send',
      'Send notification to customer',
      async (params: { orderId: string; message: string; channel: string }) => {
        // Mock implementation - replace with actual notification service
        console.log(
          `[NotificationTool] Sending ${params.channel} notification for ${params.orderId}: ${params.message}`
        );
        return {
          orderId: params.orderId,
          notificationId: `notif_${Date.now()}`,
          channel: params.channel,
          status: 'sent',
          timestamp: Date.now()
        };
      },
      {
        isCompensable: false,
        timeout: 3000,
        retryable: true
      }
    )
};

/**
 * Create standard commerce tool suite
 */
export function createCommerceToolSuite(): ToolDefinition[] {
  return [
    commerceTools.createInventoryTool(),
    commerceTools.createPaymentTool(),
    commerceTools.createLogisticsTool(),
    commerceTools.createNotificationTool()
  ];
}
