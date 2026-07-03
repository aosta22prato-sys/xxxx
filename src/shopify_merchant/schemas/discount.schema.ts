import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const discountZodSchema = z.object({
  code: z.string().min(2, '折扣口令券码必须大于1位 (Code too short)'),
  type: z.enum(['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y']),
  value: z.number().positive('面额/比率必须大于0'),
  valueText: z.string().default(''),
  status: z.enum(['active', 'expired', 'scheduled']).default('active'),
  minRequirement: z.string().optional(),
});

export const discountSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'code', label: '渠道优惠码 (Discount Coupon Code)', type: 'text', placeholder: 'MILANO15', required: true },
    { key: 'type', label: '优惠类型 (Calculation Type)', type: 'select', options: [
      { label: 'Percentage off (百分比核减)', value: 'percentage' },
      { label: 'Fixed discount amount (定额现金直降)', value: 'fixed_amount' },
      { label: 'Free express shipping (免收陆空运费)', value: 'free_shipping' },
    ] },
    { key: 'value', label: '折扣额度/折扣率 (Value)', type: 'number', placeholder: '15', required: true },
    { key: 'status', label: '优惠卡生命周期 (Status)', type: 'select', options: [
      { label: 'Active (立即全店通卷启用)', value: 'active' },
      { label: 'Scheduled (定时定点预发布)', value: 'scheduled' },
      { label: 'Expired (挂起禁用/已失效)', value: 'expired' },
    ] },
    { key: 'minRequirement', label: '最低起用消费门槛 (€)', type: 'text', placeholder: 'Spend at least €150' },
  ],
  columns: [
    { key: 'code', label: '折扣密码', type: 'text', sortable: true },
    { key: 'valueText', label: '折扣条款', type: 'text' },
    { key: 'type', label: '抵扣序列', type: 'text' },
    { key: 'usageCount', label: '已被客群核销次数', type: 'number', sortable: true },
    { key: 'status', label: '当前存续状态', type: 'badge' },
  ],
};
