import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const customerZodSchema = z.object({
  firstName: z.string().min(1, '首名不能为空'),
  lastName: z.string().min(1, '末名不能为空'),
  email: z.string().email('电子邮箱格式不合规'),
  phone: z.string().optional(),
  segment: z.enum(['All', 'VIP', 'Returning', 'Abandoned Checkout', 'B2B']).default('All'),
  totalSpent: z.number().default(0),
  ordersCount: z.number().default(0),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const customerSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'firstName', label: '名字 (First Name)', type: 'text', placeholder: 'Alexander', required: true },
    { key: 'lastName', label: '姓氏 (Last Name)', type: 'text', placeholder: 'Hamilton', required: true },
    { key: 'email', label: '电子邮箱 (Email)', type: 'email', placeholder: 'alex@hamilton.co', required: true },
    { key: 'phone', label: '联络电话 (Phone)', type: 'text', placeholder: '+39 345 6172 199' },
    { key: 'segment', label: '高净值客群区间 (Segmentation)', type: 'select', options: [
      { label: 'VIP client (极高净值尊贵特约)', value: 'VIP' },
      { label: 'Returning client (常客连签)', value: 'Returning' },
      { label: 'B2B Partnership (机构大客户对公)', value: 'B2B' },
      { label: 'Standard subscriber (普通意向客户)', value: 'All' },
    ] },
    { key: 'company', label: '附属机构/名义公司 (Company)', type: 'text', placeholder: 'Hamilton Fabrics S.p.A.' },
    { key: 'notes', label: '顾问客户档案卡备注 (Staff Notes)', type: 'textarea', placeholder: 'Custom order collector; prefers cashmere products.' },
  ],
  columns: [
    { key: 'lastName', label: '客户姓名', type: 'text', sortable: true },
    { key: 'email', label: '电子邮箱', type: 'text' },
    { key: 'segment', label: '分群级别', type: 'badge' },
    { key: 'ordersCount', label: '累计购买单数', type: 'number', sortable: true },
    { key: 'totalSpent', label: '历史毛利额贡献', type: 'currency', sortable: true },
  ],
};
