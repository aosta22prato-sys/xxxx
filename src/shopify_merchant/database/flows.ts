/**
 * Shopify Flow Automation Database
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface FlowAction {
  id: string;
  type: 'email' | 'webhook' | 'slack' | 'discount' | 'tag_customer';
  config: {
    to?: string;
    subject?: string;
    body?: string;
    url?: string;
    channel?: string;
    tagName?: string;
    discountCode?: string;
    discountValue?: number;
  };
}

export interface FlowCondition {
  field: 'order_total' | 'inventory_count' | 'customer_country' | 'has_vip_tag';
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains';
  value: string | number;
}

export interface FlowWorkflow {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft';
  trigger: 'order_created' | 'inventory_low' | 'customer_created' | 'abandoned_checkout';
  conditions: FlowCondition[];
  actions: FlowAction[];
  runCount: number;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_FLOW_DATA: FlowWorkflow[] = [
  {
    id: 'flow_low_inventory_alert',
    title: '商品低库存自动邮件报警系统',
    description: '当任意商品可售库存低于 5 件时，自动触发邮件通知给仓储处负责人，并发出告警。',
    status: 'active',
    trigger: 'inventory_low',
    conditions: [
      {
        field: 'inventory_count',
        operator: 'less_than',
        value: 5
      }
    ],
    actions: [
      {
        id: 'action_1',
        type: 'email',
        config: {
          to: 'warehouse@ateliernoir.co',
          subject: '[低警报] 欧洲主权仓商品补货通知',
          body: '注意：您店铺内有商品库存由于交易成交当前已减少并低于预设临界值(5)，请加急排产补货。'
        }
      }
    ],
    runCount: 42,
    lastRunAt: '2026-06-17T01:30:00Z',
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-06-17T01:30:00Z'
  },
  {
    id: 'flow_vip_auto_tag',
    title: '高客单 VIP 尊享用户自动标定层',
    description: '当订单实付总金额超过 €500 欧元时，自动为对应的买家客户打上 [VIP] 和 [High-Value] 标签。',
    status: 'active',
    trigger: 'order_created',
    conditions: [
      {
        field: 'order_total',
        operator: 'greater_than',
        value: 500
      }
    ],
    actions: [
      {
        id: 'action_2',
        type: 'tag_customer',
        config: {
          tagName: 'VIP_Elite'
        }
      },
      {
        id: 'action_3',
        type: 'slack',
        config: {
          channel: '#mktg-vip-alerts',
          body: '🎉 哇哦！检测到一笔来自欧盟大域的高定实付订单已成交，金额已超过 €500。自动升级客户标记！'
        }
      }
    ],
    runCount: 18,
    lastRunAt: '2026-06-16T18:45:00Z',
    createdAt: '2026-06-13T08:00:00Z',
    updatedAt: '2026-06-16T18:45:00Z'
  },
  {
    id: 'flow_abandoned_recovery_discount',
    title: '弃单快速转化——全自动折扣唤醒',
    description: '针对弃购结算流失事件，在触发后向系统挂载派发一张 9 折专属满减优惠券促进回转。',
    status: 'draft',
    trigger: 'abandoned_checkout',
    conditions: [
      {
        field: 'order_total',
        operator: 'greater_than',
        value: 100
      }
    ],
    actions: [
      {
        id: 'action_4',
        type: 'discount',
        config: {
          discountCode: 'REGAIN10',
          discountValue: 10
        }
      }
    ],
    runCount: 0,
    createdAt: '2026-06-15T15:20:00Z',
    updatedAt: '2026-06-15T15:20:00Z'
  }
];
