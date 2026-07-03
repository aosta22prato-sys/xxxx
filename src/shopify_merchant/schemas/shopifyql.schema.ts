import { z } from 'zod';

export const shopifyQLZodSchema = z.object({
  name: z.string().min(1, '报告名称不能为空'),
  description: z.string().min(5, '报告说明和指标细化说明过短'),
  shopifyQL: z.string().min(5, 'ShopifyQL 查询字段语句不能为空'),
  type: z.enum(['sales', 'payments', 'inventory', 'customers']).default('sales'),
});
