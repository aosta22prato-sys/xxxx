import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const flowZodSchema = z.object({
  title: z.string().min(1, '工作流标题不能为空'),
  description: z.string().min(1, '工作流描述不能为空'),
  status: z.enum(['active', 'draft']).default('draft'),
  trigger: z.enum(['order_created', 'inventory_low', 'customer_created', 'abandoned_checkout']),
  runCount: z.number().default(0),
});

export const flowSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'title', label: '工作流名称 (Workflow Title)', type: 'text', placeholder: 'Auto discount for abandoned carts', required: true },
    { key: 'description', label: '逻辑细节注解 (Description)', type: 'text', placeholder: 'Triggers when a cart is abandoned...', required: true },
    { key: 'status', label: '运行状态 (Status)', type: 'select', options: [
      { label: '启用并监视 (ACTIVE)', value: 'active' },
      { label: '仅保存草稿 (DRAFT)', value: 'draft' }
    ]},
    { key: 'trigger', label: '流触发条件 (Workflow Trigger Event)', type: 'select', options: [
      { label: '有新订单成交时 (order_created)', value: 'order_created' },
      { label: '商品库存告急时 (inventory_low)', value: 'inventory_low' },
      { label: '有新商户注册时 (customer_created)', value: 'customer_created' },
      { label: '消费者出现挽留行为时 (abandoned_checkout)', value: 'abandoned_checkout' }
    ]}
  ],
  columns: [
    { key: 'title', label: '流名称', type: 'text', sortable: true },
    { key: 'trigger', label: '流触发源', type: 'badge' },
    { key: 'status', label: '托管状态', type: 'badge' },
    { key: 'runCount', label: '累计执行量', type: 'number', sortable: true },
    { key: 'lastRunAt', label: '最近执行时间', type: 'text' }
  ]
};
