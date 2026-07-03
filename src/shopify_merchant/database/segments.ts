import { Segment } from '../types';

export const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 'seg-01',
    name: '所有意向用户',
    description: '商铺内的所有注册用户群体，包含游客和注册会员。',
    query: 'status == "active"',
    memberCount: 5,
    category: 'prebuilt'
  },
  {
    id: 'seg-02',
    name: '高净值客群 (VIP)',
    description: '累计消费金额达到或超过 €500 的超级大客户。',
    query: 'totalSpent >= 500',
    memberCount: 2,
    category: 'prebuilt'
  },
  {
    id: 'seg-03',
    name: '活跃回头客 (Returning)',
    description: '累计购买单数不小于 2 笔的常客连签群体。',
    query: 'ordersCount >= 2',
    memberCount: 3,
    category: 'prebuilt'
  },
  {
    id: 'seg-04',
    name: '流失预警客群',
    description: '曾经产生过购买但近期 180 天未下过新单的重点客群。',
    query: 'ordersCount > 0 && activeStatus == "inactive"',
    memberCount: 1,
    category: 'prebuilt'
  },
  {
    id: 'seg-05',
    name: '订阅专区群组',
    description: '开启了邮件及促销通知选项的注册买家。',
    query: 'tags contains "subscribed" || tags contains "newsletter"',
    memberCount: 4,
    category: 'prebuilt'
  }
];
