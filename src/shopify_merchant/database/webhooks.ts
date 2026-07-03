/**
 * API Keys & Webhooks Subscriptions Database
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  secretMask: string;
  scope: 'all_write' | 'read_only' | 'merchant_access';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface WebhookSubscription {
  id: string;
  topic: 'orders/create' | 'products/update' | 'customers/redact' | 'carts/update';
  addressUrl: string;
  format: 'json' | 'xml';
  signingSecret: string;
  status: 'active' | 'paused';
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  subscriptionId: string;
  topic: string;
  statusCode: number;
  payloadSize: string;
  responseTimeMs: number;
  timestamp: string;
  status: 'success' | 'failed';
}

export const INITIAL_DEVELOPER_DATA = {
  apiKeys: [
    {
      id: 'key_1',
      name: 'Klaviyo Global Sync Key',
      keyPrefix: 'shpat_live_klv',
      secretMask: 'shpat_live_klv_••••••••••••••••••••3a9d',
      scope: 'all_write',
      status: 'active',
      createdAt: '2026-06-10T14:00:00Z'
    },
    {
      id: 'key_2',
      name: 'TaxJar Regional EU calculator',
      keyPrefix: 'shpat_live_txj',
      secretMask: 'shpat_live_txj_••••••••••••••••••••df24',
      scope: 'read_only',
      status: 'active',
      createdAt: '2026-06-12T11:22:00Z'
    }
  ] as ApiKey[],
  webhooks: [
    {
      id: 'wh_1',
      topic: 'orders/create',
      addressUrl: 'https://api.klaviyo.com/v2/webhooks/receiver-noir',
      format: 'json',
      signingSecret: 'whsec_9b2e88a38c11f77d33dca01e4a2ec',
      status: 'active',
      createdAt: '2026-06-14T09:12:00Z'
    },
    {
      id: 'wh_2',
      topic: 'products/update',
      addressUrl: 'https://erp.ateliernoir.co/v1/sync/products',
      format: 'json',
      signingSecret: 'whsec_cc043b8fa32b101fd902ef1bb2df4',
      status: 'active',
      createdAt: '2026-06-15T16:40:00Z'
    }
  ] as WebhookSubscription[],
  logs: [
    {
      id: 'log_1',
      subscriptionId: 'wh_1',
      topic: 'orders/create',
      statusCode: 200,
      payloadSize: '2.4 KB',
      responseTimeMs: 142,
      timestamp: '2026-06-17T02:10:00Z',
      status: 'success'
    },
    {
      id: 'log_2',
      subscriptionId: 'wh_2',
      topic: 'products/update',
      statusCode: 200,
      payloadSize: '1.8 KB',
      responseTimeMs: 284,
      timestamp: '2026-06-17T01:55:00Z',
      status: 'success'
    },
    {
      id: 'log_3',
      subscriptionId: 'wh_1',
      topic: 'orders/create',
      statusCode: 502,
      payloadSize: '2.4 KB',
      responseTimeMs: 3000,
      timestamp: '2026-06-16T22:30:00Z',
      status: 'failed'
    }
  ] as WebhookLog[]
};
