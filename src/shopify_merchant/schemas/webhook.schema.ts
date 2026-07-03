import { z } from 'zod';
import { SchemaFieldMeta, SchemaColumnMeta } from './types';

export const webhookZodSchema = z.object({
  topic: z.enum(['orders/create', 'products/update', 'customers/redact', 'carts/update']),
  addressUrl: z.string().url('目标推送 IP/URL 地址不合规'),
  format: z.enum(['json', 'xml']).default('json'),
  status: z.enum(['active', 'paused']).default('active'),
});

export const webhookSchemaMeta: { fields: SchemaFieldMeta[]; columns: SchemaColumnMeta[] } = {
  fields: [
    { key: 'topic', label: '推送触发事件 (Webhook Event Topic)', type: 'select', options: [
      { label: '订单创建 (orders/create)', value: 'orders/create' },
      { label: '商品变动更新 (products/update)', value: 'products/update' },
      { label: '客群注销安全验证 (customers/redact)', value: 'customers/redact' },
      { label: '加购遗留行为 (carts/update)', value: 'carts/update' }
    ], required: true },
    { key: 'addressUrl', label: '目标推送端点 (Payload Delivery Endpoint Close)', type: 'text', placeholder: 'https://api.yoursoftware.com/webhook', required: true },
    { key: 'format', label: '荷载包传输协议 (Format)', type: 'select', options: [
      { label: 'JSON Application/Payload', value: 'json' },
      { label: 'XML Struct String', value: 'xml' }
    ]}
  ],
  columns: [
    { key: 'topic', label: '订阅事件', type: 'badge' },
    { key: 'addressUrl', label: '目标服务器接收端点', type: 'text' },
    { key: 'format', label: '载荷协议', type: 'text' },
    { key: 'status', label: '频道状态', type: 'badge' },
    { key: 'createdAt', label: '订立时间', type: 'text' }
  ]
};
