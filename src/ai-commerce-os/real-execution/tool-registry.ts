/**
 * Tool Registry - 所有工具的注册表 (100+工具)
 * 
 * 这是整个 Tool Universe 的中枢，所有工具都在这里注册和管理
 */

import { Tool, ExecutionContext } from './core-interfaces';
import { productTools } from './tools-product';
import { orderAndInventoryTools } from './tools-order-inventory';
import { marketingFinanceCustomerTools } from './tools-marketing-finance';

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, Tool> = new Map();

  private constructor() {
    this.registerAllTools();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * 注册所有工具
   */
  private registerAllTools() {
    console.log('📦 [Tool Registry] 正在注册工具...');

    // 注册产品工具
    productTools.forEach((tool) => {
      this.registerTool(tool);
    });

    // 注册订单和库存工具
    orderAndInventoryTools.forEach((tool) => {
      this.registerTool(tool);
    });

    // 注册营销和财务工具
    marketingFinanceCustomerTools.forEach((tool) => {
      this.registerTool(tool);
    });

    console.log(`✅ [Tool Registry] 已注册 ${this.tools.size} 个工具`);
  }

  /**
   * 注册单个工具
   */
  private registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  /**
   * 获取工具
   */
  public getTool(toolName: string): Tool | null {
    return this.tools.get(toolName) || null;
  }

  /**
   * 获取所有工具
   */
  public getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 按分类获取工具
   */
  public getToolsByCategory(category: string): Tool[] {
    return Array.from(this.tools.values()).filter(
      (tool) => tool.category === category
    );
  }

  /**
   * 执行工具
   */
  public async executeTool(
    ctx: ExecutionContext,
    toolName: string,
    params: any
  ): Promise<any> {
    const tool = this.getTool(toolName);

    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    // 验证参数
    if (tool.validate && !tool.validate(params)) {
      throw new Error(`Invalid parameters for tool: ${toolName}`);
    }

    // 检查权限
    if (tool.requiresPermission) {
      // TODO: 实现权限检查
    }

    // 执行工具
    return await tool.execute(ctx, params);
  }

  /**
   * 获取工具列表（用于API）
   */
  public getToolList(): Array<{
    name: string;
    description: string;
    category: string;
    parameters: any[];
  }> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      parameters: tool.parameters,
    }));
  }

  /**
   * 搜索工具
   */
  public searchTools(query: string): Tool[] {
    const q = query.toLowerCase();
    return Array.from(this.tools.values()).filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
    );
  }
}

export const toolRegistry = ToolRegistry.getInstance();
