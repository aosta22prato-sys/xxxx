import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const productZodSchema = z.object({
  title: z.string().min(1, '商品名称/标题必须填入 (Title is required)'),
  vendor: z.string().min(1, '品牌商不能为空 (Vendor is required)'),
  price: z.number().nonnegative('售价不能低于零 (Price must be non-negative)'),
  inventory: z.number().int().nonnegative('库存量不能为负且应为整数 (Inventory must be valid integer)'),
  description: z.string().optional(),
  type: z.string().default('High-End Leather'),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  sku: z.string().min(2, 'SKU编码必须是唯一的标识'),
  collections: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export const productSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'title', label: '商品标题 (Title)', type: 'text', placeholder: 'e.g., Ceramic Coffee Set', required: true },
    { key: 'vendor', label: '供应商 (Vendor)', type: 'text', placeholder: 'Atelier Paris', required: true },
    { key: 'price', label: '价格 (Price €)', type: 'price', placeholder: '240.00', required: true },
    { key: 'inventory', label: '库存数量 (Stock)', type: 'number', placeholder: '80', required: true },
    { key: 'sku', label: '唯一 SKU 编码 (Unique Node)', type: 'text', placeholder: 'SKU-ATL-0912', required: true },
    { key: 'type', label: '商品分类 (Type)', type: 'select', options: [
      { label: 'High-End Leather', value: 'High-End Leather' },
      { label: 'Artisan Ceramic', value: 'Artisan Ceramic' },
      { label: 'Eco Homeware', value: 'Eco Homeware' },
      { label: 'Fragrance Accent', value: 'Fragrance Accent' },
    ] },
    { key: 'status', label: '上架状态 (Status)', type: 'status', options: [
      { label: 'Active', value: 'active' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' },
    ] },
    { key: 'description', label: '高级详情描述 (Description)', type: 'textarea', placeholder: 'Describe the fine materials, design concept...' },
  ],
  columns: [
    { key: 'title', label: '商品名称', type: 'text', sortable: true },
    { key: 'vendor', label: '供应商', type: 'text' },
    { key: 'price', label: '零售价格', type: 'currency', sortable: true },
    { key: 'inventory', label: '货源储备', type: 'number', sortable: true },
    { key: 'status', label: '渠道运作', type: 'badge' },
    { key: 'sku', label: 'SKU条码', type: 'text' },
  ],
};
