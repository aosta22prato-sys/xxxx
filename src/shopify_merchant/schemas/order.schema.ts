import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const orderZodSchema = z.object({
  customerName: z.string().min(1, '客户姓名必须录入'),
  customerEmail: z.string().email('必须指定有效的结算电子邮箱地址 (Invalid email address)'),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().default(0),
  shipping: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  paymentStatus: z.enum(['paid', 'pending', 'refunded']).default('pending'),
  fulfillmentStatus: z.enum(['unfulfilled', 'fulfilled']).default('unfulfilled'),
  notes: z.string().optional(),
});

export const orderSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'customerName', label: '收货客户姓名', type: 'text', placeholder: 'Emma Watson', required: true },
    { key: 'customerEmail', label: '联络电子邮箱', type: 'email', placeholder: 'emma@watson.co.uk', required: true },
    { key: 'total', label: '实付结算总额 (€)', type: 'price', placeholder: '150.00', required: true },
    { key: 'paymentStatus', label: '支付对账财务 (Payment)', type: 'select', options: [
      { label: 'Paid (已清算)', value: 'paid' },
      { label: 'Pending (待收取)', value: 'pending' },
      { label: 'Refunded (已原路退回)', value: 'refunded' },
    ] },
    { key: 'fulfillmentStatus', label: '发货交付履约 (Delivery)', type: 'select', options: [
      { label: 'Unfulfilled (待出货)', value: 'unfulfilled' },
      { label: 'Fulfilled (货已交承运商)', value: 'fulfilled' },
    ] },
    { key: 'notes', label: '备注留言', type: 'textarea', placeholder: 'DHL pack carefully, gift wrap needed' },
  ],
  columns: [
    { key: 'name', label: '订单号', type: 'text', sortable: true },
    { key: 'createdAt', label: '下单时间', type: 'date', sortable: true },
    { key: 'customerName', label: '对账客户', type: 'text' },
    { key: 'total', label: '结算合规金额', type: 'currency', sortable: true },
    { key: 'paymentStatus', label: '财务核账', type: 'badge' },
    { key: 'fulfillmentStatus', label: '物流履约', type: 'badge' },
  ],
};
