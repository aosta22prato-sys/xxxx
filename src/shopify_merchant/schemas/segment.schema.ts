import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const segmentZodSchema = z.object({
  name: z.string().min(1, '分群名称不能为空'),
  description: z.string().optional(),
  query: z.string().min(1, '分析逻辑公式不能为空'),
});

export const segmentSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'name', label: '分群名称', type: 'text', placeholder: '常买大客户', required: true },
    { key: 'description', label: '分群描述', type: 'text', placeholder: '分析筛选购买次数超过2次的尊享客户' },
    { key: 'query', label: '分析筛选式 (ShopifyQL syntax)', type: 'text', placeholder: 'ordersCount >= 2', required: true }
  ],
  columns: [
    { key: 'name', label: '细分群组', type: 'text', sortable: true },
    { key: 'description', label: '群组业务定位', type: 'text' },
    { key: 'query', label: '数字资产规则式 (Query logic)', type: 'text' },
    { key: 'memberCount', label: '群组建档人数', type: 'number', sortable: true }
  ]
};
