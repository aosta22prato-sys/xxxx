import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, Check, CheckCircle, Search, Sliders, Activity, 
  ArrowRight, ShieldAlert, Sparkles, Inbox, RefreshCw, BarChart3, 
  HelpCircle, ShieldCheck, Mail, Coins, Server, Award, Eye,
  Target, TrendingUp, Database, BookOpen, Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { dbEngine } from '../../../db/dbEngine';
import { BrainAPIGateway } from '../../../services/brain/BrainAPIGateway';

const industryGoals = {
  fashion_wholesale: [
    {
      id: 'coal_fashion_1',
      title: '两个月清掉70%冬季库存 (Clear 70% Winter Stock in 2 Months)',
      playbookName: 'fashion_playbook_season_markdown',
      targetDiscoveryId: 'disc_1',
      metricAnalysis: '目前冬季呢大衣积压：€112,450 | 库板消耗额外占用 22%',
      actions: '一键对 products 中的 winter coats 商品做 15% 降价且重配空配运载班线',
      resultSim: '预期冬装库存下降 22%，GMV 增加 8%'
    },
    {
      id: 'coal_fashion_2',
      title: '提高春装销售 20% (Increase Spring Sales by 20%)',
      playbookName: 'fashion_playbook_early_spring_transition',
      targetDiscoveryId: 'disc_3',
      metricAnalysis: '意大利罗马站、米兰站春新品曝光率被旧呢料占用滞碍，下降 15%',
      actions: '在 strategic_campaigns 注册全新春季时令关键词大典并调优 SEO 搜索引擎检索',
      resultSim: '预期新品首销增长 12%，春装曝光率提升 35%'
    },
    {
      id: 'coal_fashion_3',
      title: '降低库龄超过90天商品，重振尺码结构 (Optimize Sizing Structure)',
      playbookName: 'fashion_playbook_size_rebalancing',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '大尺码重度积搁：XL/XXL 占大板 80.5% 储备 | 中小码处于断货流失 22% 溢流',
      actions: '对重度占用大货格大码呢货执行 B2B 打包特买优惠组合，追加 S 码加急派差指令',
      resultSim: '预期超龄货格利用率改善 18%，尺码偏差缩小 85%'
    }
  ],
  restaurant_takeout: [
    {
      id: 'coal_takeout_1',
      title: '提高客单价 15% (Boost Ticket Price by 15%)',
      playbookName: 'restaurant_playbook_bundle_growth',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '单一餐食订单比率占 90% | 高盈利套餐组合受阻导致客单亏损 18%',
      actions: '自动装配黄金高盈利套餐 products 商品上架主库，并部署高触达凑单提示窗',
      resultSim: '预期拼盘套餐销量占比上涨 24.5%，平均单单客单价提振 16.2%'
    },
    {
      id: 'coal_takeout_2',
      title: '提升复购率 20% (Increase Repeat Purchase Rate)',
      playbookName: 'restaurant_playbook_loyalty_recall',
      targetDiscoveryId: 'disc_3',
      metricAnalysis: '7-14天未复购会员沉默偏流，沉默周期同比延迟期高溢 21.5%',
      actions: '向 promotion_models 注入 €5 专属促活动外卖电子折扣券并发起 AI 会员信邮件流',
      resultSim: '预期静默白领会员复活率提升 28%，次月反复订货额提纯 15%'
    },
    {
      id: 'coal_takeout_3',
      title: '减少差评 30% (Reduce Adverse Order Reviews)',
      playbookName: 'restaurant_playbook_quality_reparation',
      targetDiscoveryId: 'disc_4',
      metricAnalysis: '主力炸鸡单品由于配送超时热气受潮，评星下跌至 3.2 颗星警告级别',
      actions: '物理限定合作配送班次最长配送时长 35m，紧急订购蒸汽瓦楞防潮包装盒',
      resultSim: '预期因延误导致的用户差评下降 45%，店铺黄金柠檬炸鸡 5 星评率回升 28%'
    }
  ],
  beauty_booking: [
    {
      id: 'coal_beauty_1',
      title: '提升平日余留空席预约负载 (Weekdays Idle Booking Boost)',
      playbookName: 'beauty_playbook_offpeak_incentive',
      targetDiscoveryId: 'disc_1',
      metricAnalysis: '周二/周四午后 13:00 - 16:00 平日理疗位席位闲置抛荒高达 44%',
      actions: '启动平日午后空余席位 20% 动态引流对冲规则，对锁时量席格',
      resultSim: '预期平日闲置设备浪费率收缩 25%，午后技师排钟率提升 35%'
    },
    {
      id: 'coal_beauty_2',
      title: '提升高级美容技师实际排钟率 (Maximize Therapist Utilization)',
      playbookName: 'beauty_playbook_staff_utilization_optim',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '资深 Spa 理疗师周均计费服务仅 12.5h，工时利用率仅 32% 极大亏损',
      actions: '派发高单价高级 Spa 项目的体验券邀约并与普通美甲进行交叉拼客推广',
      resultSim: '预期高工酬技师周钟恢复至标准 28 小时，技师浪费性底薪扣损减免 30%'
    },
    {
      id: 'coal_beauty_3',
      title: '促进疗程金银卡续费并拦截爽约 (VIP Renewal & No-Show Block)',
      playbookName: 'beauty_playbook_course_renewal_booster',
      targetDiscoveryId: 'disc_3',
      metricAnalysis: '34名高 LTV 活跃卡客断钟静默超 45 天，面临严重的卡面失效危机',
      actions: '向 promotion_models 紧急创建并派发向休眠金银卡发放 €80 续包新限定抵扣专券',
      resultSim: '预期本季度续费到账资金提拉 2200 欧元，核心大客挽留成效提升 40%'
    }
  ],
  ecommerce_store: [
    {
      id: 'coal_ecom_1',
      title: '提升单页一键结账成功转化率 (Checkout Funnel Friction Elimination)',
      playbookName: 'ecommerce_playbook_checkout_funnel_repair',
      targetDiscoveryId: 'disc_1',
      metricAnalysis: '由于多国算税缓慢、移动端跳转层级过繁，购物车最终付款流失率 85.6%',
      actions: '精选合并结账表单为 Stripe 闪付单页收银，开辟 multi-country 快发自愈税费引擎',
      resultSim: '预期加车进最终划扣流失缩减 38%，结账顺差率跃升 14.2%'
    },
    {
      id: 'coal_ecom_2',
      title: '保障高销售大热 SKU 供应链储备 (ZeroStock Supplier Lock)',
      playbookName: 'ecommerce_playbook_reorder_trigger',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '核心爆款降噪耳机促销大麦，库余亮起仅剩 30 个库存告急限流红灯',
      actions: '向制造工厂加急下达排产下款单，并在 products 开启断货 pre-sale 预售自愈护盾',
      resultSim: '预期保证爆单营收不断流，抢回在途海运受滞销量 15.8%'
    },
    {
      id: 'coal_ecom_3',
      title: '购物车加车未结黄金一小时挽留 (Cart Abandonment Sequence)',
      playbookName: 'ecommerce_playbook_cart_recovery_sequence',
      targetDiscoveryId: 'disc_3',
      metricAnalysis: '48小时内加车加量不划账的弃购流失率高达 38% 警戒上限点',
      actions: '匹配黄金 1 小时自动邮件智能触达，随同追加 10% 限免结账促成抵扣券',
      resultSim: '预期购物车流失转化成单率挽损提升 22.5%，GMV 回填 +9.5%'
    }
  ],
  pos_retail: [
    {
      id: 'coal_pos_1',
      title: '多物理店面库存应急重平衡 (Physical Cross-Location Balancer)',
      playbookName: 'pos_playbook_interstore_balancer',
      targetDiscoveryId: 'disc_1',
      metricAnalysis: '慕尼黑旗舰分店爆款手摇杯断零，而在汉堡总部大仓严重沉灰闲搁 350 个',
      actions: '一键搭建跨区域空陆联运 logistics_routes 大干道，并向 products 库跨门店共享在库数据',
      resultSim: '预期调拨周转效率提速 65%，恢复慕尼黑店 12500 欧元滞零销量利润'
    },
    {
      id: 'coal_pos_2',
      title: '收银虚退撤单异常防损大审计 (Abused Voiding Prevention)',
      playbookName: 'pos_playbook_audit_trail_lock',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '2号POS收银机撤单退现动作占常规 12 倍波幅，存在重大流水漏防损漏洞',
      actions: '对 POS 撤销消单结算引入 Supervisor PIN 面签核查并实名录入操作人员主机 IP',
      resultSim: '预期收银虚退坏账损耗完全清零，门店实收大盘流水吻合度保障 100%'
    },
    {
      id: 'coal_pos_3',
      title: '高架物理施工区域地缘自提挽留 (Curbside Pick-up Campaign)',
      playbookName: 'pos_playbook_local_geo_promo',
      targetDiscoveryId: 'disc_4',
      metricAnalysis: '实体店外高架施工封堵行人车客，到店流量骤降 35% 实体店销严重承压',
      actions: '对 3km 内地缘客群定向散发 Curbside 临街自提优厚专券，推出到店倍数积分奖励',
      resultSim: '预期线上提单量大幅拉平 42%，全面中和断道带来的物理客流折折损'
    }
  ],
  general_merch_electronics: [
    {
      id: 'coal_gen_1',
      title: '关税暴涨侵蚀毛利率安全定价保障 (Tariff Protection Hedging)',
      playbookName: 'general_playbook_margin_protection',
      targetDiscoveryId: 'disc_1',
      metricAnalysis: '进口电配件因海关变动加征 12% 附加 Tariff，致底盘利润挤压至 22.1%',
      actions: '一键对通用贸易 products 大项调优售价上戴 5% 安全裕度，锁定底盘盈利',
      resultSim: '预期综合纯利空间重新回拨至 27.8%，全面防卫大宗关税冲击'
    },
    {
      id: 'coal_gen_2',
      title: '远期外汇锁价对冲欧元汇率震荡 (Forex Conversion Slippage)',
      playbookName: 'general_playbook_fx_hedging_route',
      targetDiscoveryId: 'disc_2',
      metricAnalysis: '美金结账因夜间未套期远期锁定，暴露于欧元波幅产生单日 €18,240 实值汇损',
      actions: '结汇结算端口强制接入 Adyen/Airwallex 期货锁单通道，锁定远端对冲轧差',
      resultSim: '预期多渠道远结锁款率扩增 92%，套期保值安全消除深夜震荡贬值'
    },
    {
      id: 'coal_gen_3',
      title: '海外鹿特丹港罢工精密五金转空运 (Supply Chain Resilience)',
      playbookName: 'general_playbook_supply_chain_resilience',
      targetDiscoveryId: 'disc_3',
      metricAnalysis: '荷兰罢工海运滞港导致五金成品延误 8.4 天，大量 B2B 精密买家申请撤扣退款',
      actions: '紧急由 logistics_routes 路径将待到海箱驳运至比利时/法兰克福空运专机，附发延误补贴券',
      resultSim: '预期交运行程时效缩窄 7.1 天，全面挽留持订单大客成功率至 95%'
    }
  ]
};

interface AIDiscoveryCenterProps {
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function AIDiscoveryCenter({ onAddSystemLog }: AIDiscoveryCenterProps) {
  // Database reactive subscription to refresh charts/states upon clicking execution
  const [tick, setTick] = useState(0);
  useEffect(() => {
    return dbEngine.subscribe('all', () => setTick(t => t + 1));
  }, []);

  const brainContext = useMemo(() => {
    try {
      return BrainAPIGateway.getCurrentContext('tenant_global_moda', 'store_royal_boutique');
    } catch {
      return { readinessScore: 92 };
    }
  }, [tick]);

  const experiences = useMemo(() => {
    try {
      return dbEngine.business_experiences.getAll() || [];
    } catch {
      return [];
    }
  }, [tick]);

  // Selected industry state
  const [selectedIndustry, setSelectedIndustry] = useState<
    'fashion_wholesale' | 'restaurant_takeout' | 'beauty_booking' | 'ecommerce_store' | 'pos_retail' | 'general_merch_electronics'
  >('fashion_wholesale');

  // Currently selected business goal (first driver)
  const [selectedGoalId, setSelectedGoalId] = useState<string>('coal_fashion_1');

  // Currently selected discovery panel
  const [activePane, setActivePane] = useState<'disc_1' | 'disc_2' | 'disc_3' | 'disc_4'>('disc_1');

  // Current states for each active discovery
  const [discoveryStatus, setDiscoveryStatus] = useState<Record<string, Record<string, 'active' | 'processing' | 'resolved'>>>({
    fashion_wholesale: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' },
    restaurant_takeout: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' },
    beauty_booking: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' },
    ecommerce_store: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' },
    pos_retail: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' },
    general_merch_electronics: { disc_1: 'active', disc_2: 'active', disc_3: 'active', disc_4: 'active' }
  });

  // Sync selectedGoalId when selecting new industry
  useEffect(() => {
    if (selectedIndustry === 'fashion_wholesale') {
      setSelectedGoalId('coal_fashion_1');
    } else if (selectedIndustry === 'restaurant_takeout') {
      setSelectedGoalId('coal_takeout_1');
    } else if (selectedIndustry === 'beauty_booking') {
      setSelectedGoalId('coal_beauty_1');
    } else if (selectedIndustry === 'ecommerce_store') {
      setSelectedGoalId('coal_ecom_1');
    } else if (selectedIndustry === 'pos_retail') {
      setSelectedGoalId('coal_pos_1');
    } else if (selectedIndustry === 'general_merch_electronics') {
      setSelectedGoalId('coal_gen_1');
    }
  }, [selectedIndustry]);

  const currentGoalList = useMemo(() => {
    return (industryGoals as any)[selectedIndustry] || [];
  }, [selectedIndustry]);

  const currentGoal = useMemo(() => {
    return currentGoalList.find((g: any) => g.id === selectedGoalId) || currentGoalList[0];
  }, [currentGoalList, selectedGoalId]);

  // Sync activePane when selectedGoalId or selectedIndustry switches
  useEffect(() => {
    if (currentGoal) {
      setActivePane(currentGoal.targetDiscoveryId as any);
    }
  }, [currentGoal]);

  // Battle campaign boardroom modal state 
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<'disc_1' | 'disc_2' | 'disc_3' | 'disc_4' | null>(null);

  // Dynamic Modals for audits
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

  // Compact, high-density industry configuration mapping
  const industryConfigs = useMemo(() => ({
    fashion_wholesale: {
      name: '服装批发行业 (Fashion Wholesale)',
      short: '👕 服装批发',
      score: 92,
      benefit: '€112,450',
      statusText: '多仓物理防寒库存轮询中',
      roomName: '季末库存清理战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '库存极速积压 (Overstocked Outerwear)',
          badge: '库存积压 (Overstocked)',
          keyLabel: '库区',
          color: 'amber' as const,
          reason: '法国 PARIS Hub 与德国 BERLIN Hub 大码大衣库存积压严重，周转率偏低。',
          advice: '执行 15% 降价销售并配运动机，或紧急调拨至高寒北欧区域。',
          riskVal: '€112,450 积压风险',
          playbook: 'fashion_playbook_season_markdown',
          chartLabel: '主枢纽冬季呢外套库存水平',
          chartSub: '警告：DE/FR 储位饱和，占用多租户 22% 额外库板。',
          chartData: [
            { name: 'FR PARIS', '当前存量': 185 },
            { name: 'DE BERLIN', '当前存量': 120 },
            { name: 'SE STHLM', '当前存量': 40 },
            { name: 'FI HEL', '当前存量': 35 },
            { name: 'NO OSLO', '当前存量': 25 }
          ],
          dataKey: '当前存量',
          auditTitle: 'Winter Outerwear Inventory Audit',
          auditDetails: 'Physical audit of wool coats in EU warehouses shows slow liquidation velocity triggered by a +1.8°C winter deviation.',
          action1Title: '一键将 products 表保暖外套降价 15%',
          action2Title: '重置 shipping_routes 为空运动机 1 天达',
          action1Code: 'MARKDOWN_15',
          action2Code: 'AIR_LOGISTICS'
        },
        {
          id: 'disc_2',
          title: '尺码严重失衡 (Size Disproportion)',
          badge: '配比偏差 (Size Gap)',
          keyLabel: '尺码',
          color: 'rose' as const,
          reason: '极高大码配比占用 80% 储备，而 S/XS 物理库存处于断流脱水状态。',
          advice: '紧急重平衡批次并捆绑大码做打包套餐，配比修复后促出。',
          riskVal: '22% 折价流失',
          playbook: 'fashion_playbook_size_rebalancing',
          chartLabel: '全品类大衣尺码分布现状 (Units)',
          chartSub: '异常状态：XL/XXL 占主要搁浅，导致批发渠道中小码断货。',
          chartData: [
            { name: 'XS', '存量': 12 },
            { name: 'S', '存量': 15 },
            { name: 'M', '存量': 45 },
            { name: 'L', '存量': 80 },
            { name: 'XL', '存量': 155 },
            { name: 'XXL', '存量': 120 }
          ],
          dataKey: '存量',
          auditTitle: 'B2B Batch Size Audit Details',
          auditDetails: 'B2B order requirements indicate regular retail stores need more S/XS sizes, but wholesale warehouse exhibits heavy surplus in XXL.',
          action1Title: '对大码大衣执行 B2B 打包特买',
          action2Title: '向供应商派发加急 S 码任务',
          action1Code: 'SIZE_BUNDLE',
          action2Code: 'SUPPLIER_TASK'
        },
        {
          id: 'disc_3',
          title: '季后错配危机 (Season Mismatch)',
          badge: '时空错配 (Mismatch)',
          keyLabel: '月份',
          color: 'cyan' as const,
          reason: '意大利罗马站与米兰站春装新品上架率被旧呢料货格占用，春季上新迟滞。',
          advice: '发布全新季中高转化搜索广告，快速释放物理仓周转。',
          riskVal: '-15% 销量跌落',
          playbook: 'fashion_playbook_early_spring_transition',
          chartLabel: '同期主类目销售回跌对照',
          chartSub: '男士大衣主力下行严重，需要广告定向激活。',
          chartData: [
            { name: '02月(上年)', '销售额': 14600 },
            { name: '02月(本日)', '销售额': 12400 },
            { name: '03月(上年)', '销售额': 15800 },
            { name: '03月(本日)', '销售额': 15600 }
          ],
          dataKey: '销售额',
          auditTitle: 'Seasonal Weight Analytics',
          auditDetails: 'High-altitude organic web traffic dropped significantly due to slow category swap transition.',
          action1Title: '在 strategic_campaigns 注册新词表',
          action2Title: '锁定意大利面料商做夏季补货',
          action1Code: 'SEO_REMAP',
          action2Code: 'SOURCE_LOCK'
        },
        {
          id: 'disc_4',
          title: '批发大买家流失 (B2B Client Churn Warning)',
          badge: 'VIP 流失 (VIP Churn)',
          keyLabel: '地区',
          color: 'indigo' as const,
          reason: '近14天内，累积采购量大于 €5k 欧元的9个核心批发商陷入沉睡。',
          advice: '自动往 promotion_models 创建大客代金券并派发 AI 邮件挽留。',
          riskVal: '38% 沉默流失率',
          playbook: 'fashion_playbook_b2b_loyalty_boost',
          chartLabel: '静默期高客单 B2B VIP 采购额比重',
          chartSub: '大客资产敞口流失警戒，平均沉默时间超 12 天。',
          chartData: [
            { name: 'Amélie (法国)', '采购额': 2400 },
            { name: 'Lars (瑞典)', '采购额': 1850 },
            { name: 'Deiter (德国)', '采购额': 3200 },
            { name: 'Chloé (英国)', '采购额': 1450 }
          ],
          dataKey: '采购额',
          auditTitle: 'B2B Client Loyalty Matrix',
          auditDetails: 'Churn warning models indicate competitors are capturing core buyer interest due to absence of personalized incentive discount plans.',
          action1Title: '一键创建发放 €50 零门槛代金券',
          action2Title: '指派 AI 智能体群发情感激活信',
          action1Code: 'VIP_COUPON',
          action2Code: 'VIP_MAIL'
        }
      ]
    },
    restaurant_takeout: {
      name: '餐馆外卖行业 (Restaurant Takeout)',
      short: '🍔 餐馆外卖',
      score: 88,
      benefit: '€15,400',
      statusText: '外卖配送及门店热度指数轮询中',
      roomName: '套餐提升客单价战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '午间外卖客流断线 (Lunch Hour Delivery Dip)',
          badge: '客流衰弱 (Lunch Dip)',
          keyLabel: '时段',
          color: 'amber' as const,
          reason: '11:30 - 13:00 核心商圈午市外卖单量环比下跌 24.5%，写字楼退单率突升。',
          advice: '派发限时特许午间折扣码拼合 UberEats 及本地物流车道保驾。',
          riskVal: '€15,400 午市流失',
          playbook: 'restaurant_playbook_lunch_rush_reactivation',
          chartLabel: '外卖订单日分布情况 (单量)',
          chartSub: '核心指标：午间黄金点订单断层，需极速匹配闪购抵扣。',
          chartData: [
            { name: '11:00', '订单量': 60 },
            { name: '12:00', '订单量': 22 },
            { name: '13:00', '订单量': 45 },
            { name: '14:00', '订单量': 30 },
            { name: '15:00', '订单量': 20 }
          ],
          dataKey: '订单量',
          auditTitle: 'Lunch Peak Incident Audit',
          auditDetails: 'Slow response from localized dispatch partners during the peak 12:00 window triggered user cancellations on UberEats.',
          action1Title: '启动午市 15% 限时智能减免自愈',
          action2Title: '切换配送网关为 UberEats 自营班次',
          action1Code: 'REST_LUNCH_MARKDOWN',
          action2Code: 'REST_LOGISTICS'
        },
        {
          id: 'disc_2',
          title: '单品占比过高/套餐占比低 (Single Order Excess)',
          badge: '客单率过低 (Ticket Low)',
          keyLabel: '单品',
          color: 'rose' as const,
          reason: '饮品/单汉堡销售点额超标，高利润拼盘套餐购买率仅为 8.5%，均客单价偏低。',
          advice: '根据 dbEngine products 自动合配并落库一款高盈利套餐组合（如可乐+薯条+爆款汉堡）。',
          riskVal: '-18% margin deficit',
          playbook: 'restaurant_playbook_bundle_growth',
          chartLabel: '单品与套餐畅销权重分布',
          chartSub: '高阶自愈：将香炸单品包装为 AI 快乐双人套餐上架主库。',
          chartData: [
            { name: 'Combo 套餐', '售出': 14 },
            { name: '单炸鸡', '售出': 120 },
            { name: '单汉堡', '售出': 95 },
            { name: '单可乐', '售出': 150 }
          ],
          dataKey: '售出',
          auditTitle: 'Combo vs Single Product Mix Audit',
          auditDetails: 'Single main courses are purchased heavily. The drink attachment rate has eroded by 22% compared to historical monthly values.',
          action1Title: '自动合配人气套餐落库 products 表',
          action2Title: '配置前端结账加固凑单特价弹窗',
          action1Code: 'REST_CREATE_COMBO',
          action2Code: 'REST_PRORECT_POPUP'
        },
        {
          id: 'disc_3',
          title: '消费者回购周期延迟 (Takeout Re-order Failure)',
          badge: '客群静默 (Active Recall)',
          keyLabel: '静默日',
          color: 'cyan' as const,
          reason: '7-14天静默期会员外卖重购几率跌到 21.5% 历史冰点。',
          advice: '往 promotion_models 快速创建 €5 外卖红包并由 marketing 智能体发送。',
          riskVal: '42% 重购率偏低',
          playbook: 'restaurant_playbook_loyalty_recall',
          chartLabel: '未复购会员沉默天数一览',
          chartSub: '休眠用户高危敞口，主力为白领家庭持卡群体。',
          chartData: [
            { name: 'Anna (Berlin)', '静默': 12 },
            { name: 'John (Munich)', '静默': 15 },
            { name: 'Felix (Berlin)', '静默': 9 },
            { name: 'Sophie (Hamburg)', '静默': 11 }
          ],
          dataKey: '静默',
          auditTitle: 'Silent Customer Activation Sheet',
          auditDetails: 'Inactive client analytics proof points specify that dynamic push with a low threshold 5 EU coupon boosts recall response by 78.2%.',
          action1Title: '向沉默客户派发 €5 限时代金券',
          action2Title: '落存任务触发外带食谱挽回邮件',
          action1Code: 'REST_COUPON_RECALL',
          action2Code: 'REST_MAIL_RECALL'
        },
        {
          id: 'disc_4',
          title: '爆款炸鸡差评率报警 (Spike in Bad Reviews)',
          badge: '声誉受损 (Review Alert)',
          keyLabel: '评星',
          color: 'indigo' as const,
          reason: '主力爆款柠檬炸鸡由于冷链与骑手延误导致表面受潮发软，本周三星以下差评上升。',
          advice: '触发 B2B 质量改进建议并由配送系统将包装更换为瓦楞透气盒。',
          riskVal: 'Rating 3.2 Warn',
          playbook: 'restaurant_playbook_quality_reparation',
          chartLabel: '爆款柠檬炸鸡每周评价趋势',
          chartSub: '核心危机：5星高点向下塌陷，配送保温不良严重毁坏转化。',
          chartData: [
            { name: '1星超差', '次数': 15 },
            { name: '2星一般', '次数': 22 },
            { name: '3星偏好', '次数': 40 },
            { name: '4星良好', '次数': 35 },
            { name: '5星完美', '次数': 12 }
          ],
          dataKey: '次数',
          auditTitle: 'Lemon Chicken Quality Compliance Report',
          auditDetails: 'Auditing 15 recent sub-3 star reviews verifies that a 40+ minute shipping delay leads to steam condensation, ruining crispiness.',
          action1Title: '修改骑手最长超时配送上限为 35m',
          action2Title: '向包装供应商追加蒸汽打孔盒订单',
          action1Code: 'REST_DELIVERY_TIME',
          action2Code: 'REST_BOX_UPGRADE'
        }
      ]
    },
    beauty_booking: {
      name: '美容预约行业 (Beauty Booking)',
      short: '💆 美容预约',
      score: 94,
      benefit: '€9,800',
      statusText: '平日席位与理疗工时周转智能监考',
      roomName: '疗程续费召回战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '平日午后预约空挡过多 (Weekday Idle Gaps)',
          badge: '虚位偏差 (Empty Slots)',
          keyLabel: '星期',
          color: 'amber' as const,
          reason: '周二与周四 13:00-16:00 平日闲时美容/美发席位空置高至 44%。',
          advice: '启用 offpeak 折扣算法，针对闲时段一键下浮 20% 折扣对锁客流。',
          riskVal: '44% 席位抛荒空置',
          playbook: 'beauty_playbook_offpeak_incentive',
          chartLabel: '平日主力理疗位空闲比例%',
          chartSub: '多租户沙箱监测：平日低周转负荷造成实体门店大宗租金损耗。',
          chartData: [
            { name: '周一 (闭馆)', '空闲率': 100 },
            { name: '周二午后', '空闲率': 44 },
            { name: '周三午后', '空闲率': 28 },
            { name: '周四午后', '空闲率': 42 },
            { name: '周五高峰', '空闲率': 15 }
          ],
          dataKey: '空闲率',
          auditTitle: 'Weekday Attendance Seat Log',
          auditDetails: 'High reservation densities are heavily packed into weekends, leaving luxury therapy stations idle on weekday midday slots.',
          action1Title: '设置平日午后预约特许 20% 减免规则',
          action2Title: '下发 tasks 发布限时预约优先队列',
          action1Code: 'BEAUTY_OFFPEAK_DYNAMIC',
          action2Code: 'BEAUTY_TASK_QUEUE'
        },
        {
          id: 'disc_2',
          title: '高级美容师工时损耗 (Therapist Under-utilization)',
          badge: '工时缺口 (Labor Under)',
          keyLabel: '技师',
          color: 'rose' as const,
          reason: '5名资深 Spa 师周均可结算服务仅 12.5h，偏离 35h 标准，工费虚折。',
          advice: '优化排单轮班系统，将闲置劳力导向高单价特色疗程邀约套。',
          riskVal: '32% 利用率赤字',
          playbook: 'beauty_playbook_staff_utilization_optim',
          chartLabel: '高认证技师周度实际排钟 (Hours)',
          chartSub: '重点纠错：闲时高额薪资侵蚀总仓财务，需一键智能匀钟。',
          chartData: [
            { name: 'Clara (SPA)', '工时': 12 },
            { name: 'Evelyn (美发)', '工时': 14 },
            { name: 'Elena (美甲)', '工时': 15 },
            { name: 'Diana (SPA)', '工时': 9 }
          ],
          dataKey: '工时',
          auditTitle: 'Staff Labor Allocation Sheet',
          auditDetails: 'Therapist schedules highlight gross workforce allocation inefficiencies. Standard retainers are paid fully but productive hours remain extremely low.',
          action1Title: '一键启用高级 Spa 理疗拼客优惠',
          action2Title: '派发技师闲时体验券促销计划',
          action1Code: 'BEAUTY_SPA_MIX',
          action2Code: 'BEAUTY_SPA_COUPON'
        },
        {
          id: 'disc_3',
          title: '轻金卡会员流失风险 (Silver/Gold VIP Erosion)',
          badge: '卡客静默 (VIP Erosion)',
          keyLabel: '沉睡日',
          color: 'cyan' as const,
          reason: '34名高 LTV 活跃卡客发生 45 天无预警断档，面临金卡折断流失高潮。',
          advice: '指派 AI 情感挽留发送 €80 新限定补水修护疗程体验金并归档。',
          riskVal: '35% 续费大跌',
          playbook: 'beauty_playbook_course_renewal_booster',
          chartLabel: '高产卡客静默期资产价值',
          chartSub: '警告：不恢复续卡，将导致后续本季度耗材毛利承压。',
          chartData: [
            { name: 'Gabrielle', '价值': 2400 },
            { name: 'Helena', '价值': 1850 },
            { name: 'Sabrina', '价值': 3200 },
            { name: 'Vanessa', '价值': 1450 }
          ],
          dataKey: '价值',
          auditTitle: 'Premium Tier Renewal Deficit',
          auditDetails: 'VIP members with average order totals above 1500 EU demonstrate significant silence lengths. Competitors are aggressively marketing new laser treatments.',
          action1Title: '往 promotion_models 注入 €80 专属券',
          action2Title: '激发 AI 邮件智护撰写体验直连信',
          action1Code: 'BEAUTY_RENEWAL_COUPON',
          action2Code: 'BEAUTY_RENEWAL_MAIL'
        },
        {
          id: 'disc_4',
          title: '高额预约频出爽约 (Spike in No-Show Rates)',
          badge: '顾客断流 (No-Show Risk)',
          keyLabel: '周度',
          color: 'indigo' as const,
          reason: '法国及德国区域线上预约客户本周 No-Show (爽约) 概率增至 15% 历史偏高状态。',
          advice: '往系统强制挂起 10% 阶段一预约保证订金规则以锁定信用。',
          riskVal: '15% 工时穿透抛弃',
          playbook: 'beauty_playbook_vip_retention',
          chartLabel: '周度高客单爽约分布对比%',
          chartSub: '核验结果：未支付保证定金的自选预约极度容易形成周五虚假占客。',
          chartData: [
            { name: '第1周', '爽约率': 4.1 },
            { name: '第2周', '爽约率': 3.5 },
            { name: '第3周', '爽约率': 8.8 },
            { name: '本周', '爽约率': 15.2 }
          ],
          dataKey: '爽约率',
          auditTitle: 'Client No-Show Deficit Analysis',
          auditDetails: 'Analysis confirms empty chairs caused by unconfirmed free bookings destroy therapist performance. Injecting reservation credits completely protects the slot.',
          action1Title: '启用 10% 强制预约锁位定金系统',
          action2Title: '自动发送前一日双向二次验证通知',
          action1Code: 'BEAUTY_LOCK_DEPOSIT',
          action2Code: 'BEAUTY_NOTIFY_SEND'
        }
      ]
    },
    ecommerce_store: {
      name: '电子商务行业 (E-Commerce Store)',
      short: '💻 电子/零售',
      score: 95,
      benefit: '€42,000',
      statusText: '核心结账转化及丢车弃款轮询中',
      roomName: '弃购流失挽回战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '加车后至结账漏斗拦截 (Checkout Funnel Abandonment)',
          badge: '漏斗搁浅 (Funnel Drop)',
          keyLabel: '步骤',
          color: 'amber' as const,
          reason: '购物车至最终成功划扣阶段流失最甚，移动端跳转支付遭遇严重摩擦阻力。',
          advice: '部署 Klarna/Stripe 闪存快速划扣，绕过冗余收件。',
          riskVal: '€42,000 转化搁浅',
          playbook: 'ecommerce_playbook_checkout_funnel_repair',
          chartLabel: '加车漏斗步骤流失情况比重%',
          chartSub: '多租户拦截警示：结账步骤由于境外费率计算太慢导致高客流弃坑。',
          chartData: [
            { name: '访客流', '存留率': 100 },
            { name: '产品浏览', '存留率': 64 },
            { name: '加入购物车', '存留率': 34 },
            { name: '填写信息', '存留率': 14 },
            { name: '点击付款', '存留率': 1.4 }
          ],
          dataKey: '存留率',
          auditTitle: 'Checkout Funnel Friction Log',
          auditDetails: 'Checkout performance indexes identify high latency inside final shipping calculations. Dynamic local route setup cuts friction.',
          action1Title: '降变结账为单页一键 Stripe 快捷收银',
          action2Title: '启用 multi-country 税费预备极速引擎',
          action1Code: 'ECOM_QUICK_PAY',
          action2Code: 'ECOM_TAX_BOOST'
        },
        {
          id: 'disc_2',
          title: '高周转爆款断断零在库 (SKU Stockout Risk)',
          badge: '告急断货 (Stockout)',
          keyLabel: '库房',
          color: 'rose' as const,
          reason: '极速高转“高保真降噪耳机”本日大促销量脱空，多租户库内仅剩 40 个。',
          advice: '向拼单制造厂紧急锁货下款，保税转驳，规避高客单断流。',
          riskVal: '€25,800 营收停滞',
          playbook: 'ecommerce_playbook_reorder_trigger',
          chartLabel: '热款降噪耳机库位警戒线',
          chartSub: '物理断料指示：若不紧急重新补足，2天内该核心 SKU 将滑入灰色下架。',
          chartData: [
            { name: '波兰备货仓', '在库': 110 },
            { name: '意大利精品仓', '在库': 40 },
            { name: '法兰克福主干仓', '在库': 30 },
            { name: '巴黎中转站', '在库': 10 }
          ],
          dataKey: '在库',
          auditTitle: 'Stock depletion and Supplier Lock Sheet',
          auditDetails: 'Wholesale B2C purchase rates have outperformed previous averages by 4x. Emergency supplier ordering prevents lost retail momentum.',
          action1Title: '向深圳精密制造厂拍发锁舱加急单',
          action2Title: '在 products 表启动断货预售 pre-sale 阀值',
          action1Code: 'ECOM_SUPPLIER_ORDER',
          action2Code: 'ECOM_ENABLE_PRESALE'
        },
        {
          id: 'disc_3',
          title: '购物车弃购比率大幅攀升 (Cart Abandonment Spike)',
          badge: '弃购滑落 (Cart Loss)',
          keyLabel: '时间',
          color: 'cyan' as const,
          reason: '近48小时内，在库商品加入购物车超3件但最终物理关闭商铺占比直插38%。',
          advice: '紧急向 tasks 注入抛件自愈程序，群发带专属 10% 限免券。',
          riskVal: '38% 弃购率过红',
          playbook: 'ecommerce_playbook_cart_recovery_sequence',
          chartLabel: '弃购行为退款风险倾向 (小时分布)',
          chartSub: '黄金挽留点：弃购发生 1 小时内属于触达的高转化自愈阶段。',
          chartData: [
            { name: '第1小时', '挽回概率': 78 },
            { name: '第4小时', '挽回概率': 45 },
            { name: '第12小时', '挽回概率': 28 },
            { name: '首日后', '挽回概率': 12 }
          ],
          dataKey: '挽回概率',
          auditTitle: 'Dynamic Cart Abandon Rescue Plan',
          auditDetails: 'B2C cart abandonment logs verify high correlation to missing multi-lingual sizing instructions for premium models. Rescue triggered.',
          action1Title: '落存一小时内自动触发邮件召回流',
          action2Title: '自动派发 10% 购物车特定挽留折旧包',
          action1Code: 'ECOM_RECOVER_FLOW',
          action2Code: 'ECOM_RECOVER_COUPON'
        },
        {
          id: 'disc_4',
          title: '特定退货异常预警 (High Return Rate Incident)',
          badge: '货款折损 (Return Risk)',
          keyLabel: '因素',
          color: 'indigo' as const,
          reason: '意大利罗马发运的轻量夏衣退货率异常升至 5.8% 创本季反差。',
          advice: '紧急重平衡批次并下浮质检，将尺码偏差自动改写，避免纠纷。',
          riskVal: '5.8% 损耗红线',
          playbook: 'ecommerce_playbook_refund_mitigation',
          chartLabel: '衣服退货反馈主归因分布 (单量)',
          chartSub: '核心根源：买家吐槽标注尺寸小了一圈，面料色差反馈。',
          chartData: [
            { name: '尺寸不对', '次数': 144 },
            { name: '色差严重', '次数': 88 },
            { name: '质量损坏', '次数': 32 },
            { name: '配送过慢', '次数': 15 }
          ],
          dataKey: '次数',
          auditTitle: 'Returns and Fabric Quality Audit',
          auditDetails: 'Physical batch #320 garments exhibit a slight shrink factor under hot ironing. Changing descriptions on the shop front protects sales.',
          action1Title: '一键将 descriptions 表描述追加尺码说明',
          action2Title: '启动退货直付邮签扣款以安抚高价值用户',
          action1Code: 'ECOM_REMAP_INFO',
          action2Code: 'ECOM_REFUND_LOCK'
        }
      ]
    },
    pos_retail: {
      name: '门店零售实体 (POS Retail)',
      short: '🏪 门店零售',
      score: 91,
      benefit: '€12,500',
      statusText: '多物理店门铺客流及调拨自愈全盘检测',
      roomName: '门店库存调拨战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '跨门店库存严重失衡 (Cross-Store Stock Mismatch)',
          badge: '物理断料 (Silo Off)',
          keyLabel: '店格',
          color: 'amber' as const,
          reason: '慕尼黑主店“智能爆款手摇磨豆杯”处于完全断空，而汉堡多租户大仓搁浅 350 个。',
          advice: '触发 24小时 极速重分配运输专签，空拨发货汉堡库存至慕尼黑。',
          riskVal: '€12,500 滞搁利润',
          playbook: 'pos_playbook_interstore_balancer',
          chartLabel: '各物理分店在库手摇杯水平 (Units)',
          chartSub: '失衡指数：主要消费区完全缺料，而次要大区堆积如山。',
          chartData: [
            { name: '慕尼黑旗舰店', '在库量': 0 },
            { name: '汉堡总仓部', '在库量': 350 },
            { name: '柏林主力店', '在库量': 45 },
            { name: '科隆门店柜', '在库量': 15 }
          ],
          dataKey: '在库量',
          auditTitle: 'Inter-Store Location Balance Sheet',
          auditDetails: 'Consumer purchasing rates in Munich are 6x higher for lifestyle gadget lines. Stockholm/Karlsruhe routing is unaffected by local delays.',
          action1Title: '创建一键物流 shipping_routes 跨仓自愈',
          action2Title: '向 products 表强制共享门店在库指标',
          action1Code: 'POS_MOVE_STOCK',
          action2Code: 'POS_SHARE_STOCK'
        },
        {
          id: 'disc_2',
          title: '收银消单退费频次爆流 (Cashier Voiding Abused)',
          badge: '业务异常 (Voiding Alert)',
          keyLabel: '台号',
          color: 'rose' as const,
          reason: '汉堡 2 号卡位 POS 收银无小票退款折旧单数发生 3.2% 负额波动，疑存在防损漏。',
          advice: '向收银节点强制推送 Manager PIN 二次密码核认机制并落库。',
          riskVal: 'POS 坏账挂锁',
          playbook: 'pos_playbook_audit_trail_lock',
          chartLabel: '门店线上线下收退款单比率',
          chartSub: '防损审计：收银撤单异样波动，需要管理中枢立即锁定。',
          chartData: [
            { name: '1号收银机', '消单数': 2 },
            { name: '2号收银机 (异常)', '消单数': 24 },
            { name: '3号收银机', '消单数': 3 },
            { name: '4号收银机', '消单数': 1 }
          ],
          dataKey: '消单数',
          auditTitle: 'Store POS Transaction Integrity',
          auditDetails: 'Audit flags trace consecutive manual credit voidings without physical slip printing. Supervisor intervention is immediate.',
          action1Title: '强制对大额消减引入经理 PIN 锁柜',
          action2Title: '记录高频操作员 IP 至风险审查库',
          action1Code: 'POS_LOCK_SU',
          action2Code: 'POS_LOG_IP'
        },
        {
          id: 'disc_3',
          title: '实体老客持卡到店数下降 (Footfall Loyalty Retract)',
          badge: '刷卡停顿 (Card Silent)',
          keyLabel: '流失天',
          color: 'cyan' as const,
          reason: '本月慕尼黑、科隆实体金卡会员到店过卡、拿货几率退化。',
          advice: '部署生日专享或本地店庆礼并发送手机 SMS 触达自愈。',
          riskVal: '18% 到店收缩',
          playbook: 'pos_playbook_instore_active_event',
          chartLabel: '实体持卡会籍休眠大区占比 (人度)',
          chartSub: '运营方向：需要线下到店品酒会及特设尊客周进行中和。',
          chartData: [
            { name: '慕尼黑大区', '人数': 120 },
            { name: '汉堡大区', '人数': 80 },
            { name: '柏林大区', '人数': 95 },
            { name: '科隆大区', '人数': 55 }
          ],
          dataKey: '人数',
          auditTitle: 'Footfall Member De-activation Sync',
          auditDetails: 'Loyal customer cards in local suburbs have zero taps recorded over the last three weeks, coinciding with off-season temperature adjustments.',
          action1Title: '自动生成本地专享体验卡落码',
          action2Title: '指派 SMS 挽留智能体精准批量群划',
          action1Code: 'POS_CARD_ACTIVATE',
          action2Code: 'POS_SMS_PUSH'
        },
        {
          id: 'disc_4',
          title: '道路重大施工致客流断裂 (Local Roadworks Footfall Loss)',
          badge: '流量受阻 (Footfall Block)',
          keyLabel: '天数',
          color: 'indigo' as const,
          reason: '汉堡主高架大范围排爆施工堵死，导致主入口车流与行人直跌 35%。',
          advice: '激活 3 公里半价外带促销或与 Google 地图协作投放临近点提货卡。',
          riskVal: '€32,000 业绩承压',
          playbook: 'pos_playbook_local_geo_promo',
          chartLabel: '受灾门店日人流对比 (人次)',
          chartSub: '流量警报：施工开始后客流明显滑坡，需要线上定点自提优惠拉回。',
          chartData: [
            { name: '周一 (未工)', '人流量': 1200 },
            { name: '周二 (未工)', '人流量': 1150 },
            { name: '周三 (动工)', '人流量': 420 },
            { name: '周四 (动工)', '人流量': 380 },
            { name: '本日 (动态)', '人流量': 310 }
          ],
          dataKey: '人流量',
          auditTitle: 'Footfall Block and Geo-Promo Action',
          auditDetails: 'Public works directly impede retail frontage viewings by 85%. Triggering online purchase with immediate curbside pick-up is vital.',
          action1Title: '对 3km 内住客精准派发 curbside 优惠券',
          action2Title: '在 front 页面开辟“施工期自提双倍积分”',
          action1Code: 'POS_GEO_INCENTIVE',
          action2Code: 'POS_DOUBLE_POINTS'
        }
      ]
    },
    general_merch_electronics: {
      name: '通用贸易与电子行业 (General Trade & Electronics)',
      short: '🌐 通用贸易',
      score: 90,
      benefit: '€18,240',
      statusText: '多国海运汇率及 tariff 对冲分析中',
      roomName: '海外资金对扣网关战役室',
      discoveries: [
        {
          id: 'disc_1',
          title: '进口关税上升致毛利萎缩 (Tariff Import Shock)',
          badge: '毛利挤压 (Margin Squeeze)',
          keyLabel: '阶段',
          color: 'amber' as const,
          reason: '亚洲进口核心电控外壳在欧盟海关遭遇 +12% Tariff 附加税，致底盘利润承压。',
          advice: '对 products 商品库通配物料系数上浮 5% 加成以对冲多租户毛利润。',
          riskVal: '-8.0% 净利润蒸发',
          playbook: 'general_playbook_margin_protection',
          chartLabel: '原件毛利率下滑态势 (对比%)',
          chartSub: '预警：若不重新配置价格模型，预计本季度财报利润大幅跳水。',
          chartData: [
            { name: '上季度平均', '利润率%': 30 },
            { name: '加征关税后', '利润率%': 22.1 },
            { name: 'AI 调价自愈后', '利润率%': 27.8 }
          ],
          dataKey: '利润率%',
          auditTitle: 'Tariff and Wholesale catalog audit',
          auditDetails: 'The custom duties on electrical items rose sharply by 12 points. Multi-tenant logistics entities confirm import cost peak.',
          action1Title: '一键对通用贸易主品类售价上调 5%',
          action2Title: '落锁新采购成本规则至 dbEngine',
          action1Code: 'GEN_MARKUP_5',
          action2Code: 'GEN_COST_LOCK'
        },
        {
          id: 'disc_2',
          title: '欧元对美金结损大额汇损 (FX Conversion Slippage)',
          badge: '外汇损耗 (FX Deficit)',
          keyLabel: '汇损',
          color: 'rose' as const,
          reason: '美金大额货款划拨由于未匹配到远期锁定通道，今日由于欧元浮动蒸发 €18,240。',
          advice: '紧急激活多渠道结算通道（Airwallex/Adyen）对冲美金风险流。',
          riskVal: '€18,240 浮盈流失',
          playbook: 'general_playbook_fx_hedging_route',
          chartLabel: '本周 EUR/USD 波动导致结算流失点度',
          chartSub: '汇损防卫：建议启动实时多渠道网关汇率锁定对冲。',
          chartData: [
            { name: '周一 06/04', '汇损点': 1200 },
            { name: '周三 06/06', '汇损点': 4800 },
            { name: '周五 06/08', '汇损点': 11800 },
            { name: '本日 06/10', '汇损点': 18240 }
          ],
          dataKey: '汇损点',
          auditTitle: 'Forex Volatility Settle Sheet',
          auditDetails: 'Forex exchange gaps trace directly to manual overnight bank conversions. Multi-channel gateways eliminate late-night slippages entirely.',
          action1Title: '激活 Airwallex 美元对冲多级汇付路由',
          action2Title: '注入远期锁价约束限制兑现起止',
          action1Code: 'GEN_FX_ROUTING',
          action2Code: 'GEN_FX_LOCK'
        },
        {
          id: 'disc_3',
          title: '港口物理怠工交付延误 (Rotterdam Container Lag)',
          badge: '海运红线 (Logistics Lag)',
          keyLabel: '班次',
          color: 'cyan' as const,
          reason: '荷兰鹿特丹卸货总码头遭遇物理怠工罢工，在途海空精密五金搁浅延误 8.4 天。',
          advice: '切换在途货仓分配发运至空中货机合同包进行紧急分流自愈。',
          riskVal: '8.4天 交付溢航',
          playbook: 'general_playbook_supply_chain_resilience',
          chartLabel: '当前海上/空中备货延误时长 (Days)',
          chartSub: '运行策略：海运延误触发红色警报，空运紧急转仓已成唯一通道。',
          chartData: [
            { name: ' Rotterdam 海运', '延误天数': 11.2 },
            { name: ' Antwerpen 海运', '延误天数': 8.5 },
            { name: ' Frankfurt 货主空运', '延误天数': 1.1 },
            { name: ' Liege 比利时空运', '延误天数': 1.5 }
          ],
          dataKey: '延误天数',
          auditTitle: 'Shipping delays and Rotterdam Port strike logs',
          auditDetails: 'Industrial action blockades 5 pending B2B cargo shipments. Air freight bypass locks reliable fulfillment corridors for EU clients.',
          action1Title: '切换在途 logistics_routes 优先空配班次',
          action2Title: '自动发送延误安抚并提供延迟分单折扣',
          action1Code: 'GEN_LOGISTIC_AIR',
          action2Code: 'GEN_REASSURE_CLIENT'
        },
        {
          id: 'disc_4',
          title: '仓租高负荷占位溢租 (3PL Frankfurt Peak Rental)',
          badge: '占用租红 (Rental Peak)',
          keyLabel: '周月',
          color: 'indigo' as const,
          reason: '弗兰克福大仓长期静止堆放超大体积通用配件壳，导致 3PL 仓费高耸过红。',
          advice: '自动根据 playbook 做折扣清除在库超龄款以腾飞多租户物理板面。',
          riskVal: '€10.2 / m³ 日耗',
          playbook: 'general_playbook_rental_mitigation_speedup',
          chartLabel: '各品类积压立方体量评估 (m³)',
          chartSub: '降损防线：淘汰库存长居，快速利用特惠折扣流释放空间。',
          chartData: [
            { name: '电脑主机箱', '体积': 185 },
            { name: '加粗铜导线', '体积': 140 },
            { name: '铝制散热片', '体积': 80 },
            { name: '塑料外装壳', '体积': 220 }
          ],
          dataKey: '体积',
          auditTitle: 'Frankfurt 3PL Volume Allocation Audit',
          auditDetails: 'Inactive inventory units stored over 90 days are generating heavy holding cost overheads. Speed up liquidation protects gross margins.',
          action1Title: '一键降价 20% 出料清除超大配件',
          action2Title: '自动在 dbEngine 登记过保转赠方案',
          action1Code: 'GEN_CLEARANCE_ACT',
          action2Code: 'GEN_GIFT_LOG'
        }
      ]
    }
  }), []);

  const config = industryConfigs[selectedIndustry];
  const activeDiscovery = useMemo(() => {
    return config.discoveries.find(d => d.id === activePane) || config.discoveries[0];
  }, [config, activePane]);

  const currentStatus = useMemo(() => {
    return discoveryStatus[selectedIndustry]?.[activePane] || 'active';
  }, [discoveryStatus, selectedIndustry, activePane]);

  // Handle Dynamic Actions and Write strictly into DB Engine
  const handleAction = (discoveryId: string, actionType: string) => {
    setDiscoveryStatus(prev => {
      const industryStatus = prev[selectedIndustry] || {};
      return {
        ...prev,
        [selectedIndustry]: {
          ...industryStatus,
          [discoveryId]: 'processing'
        }
      };
    });

    setTimeout(() => {
      let logTitle = '';
      let logDetail = '';

      if (selectedIndustry === 'fashion_wholesale') {
        if (discoveryId === 'disc_1') {
          // Absolute database updates
          const products = dbEngine.products.getAll();
          let count = 0;
          products.forEach(p => {
            if (p.category?.toLowerCase() === 'outerwear' || p.category?.toLowerCase() === 'clothing' || p.id.includes('coat')) {
              dbEngine.products.update(p.id, { price: Math.round(p.price * 0.85) });
              count++;
            }
          });

          dbEngine.board_decisions.create({
            meeting_id: 'meet_fashion_markdown_' + Date.now(),
            final_action_plan: [`Executed automated markdown of 15% on ${count} Outerwear products to mitigate slow-moving winter stock.`],
            vote_outcome: 'passed',
            approved_by: ['AI_COGNITIVE_CORE', 'STORE_MANAGER'],
            enacted_at: new Date().toISOString()
          });

          logTitle = '服装大件降价自愈';
          logDetail = `由于暖冬，AI已一键对 ${count} 款保暖大衣商品执行下调 15% 售价，Playbook: fashion_playbook_season_markdown 已通过宪法审查，并成功落库！`;
        } else if (discoveryId === 'disc_4') {
          dbEngine.promotion_models?.create?.({
            promo_type: 'FixedAmount',
            expected_uplift_pct: 12,
            historical_roi: 4.8
          });
          logTitle = 'B2B大客召回券注入';
          logDetail = '成功启动 fashion_playbook_b2b_loyalty_boost，B2B大买家账户定额自愈与AI关怀邮件均已配置落位。';
        } else {
          logTitle = '服装策略调优';
          logDetail = `成功激活 playbook 模板策略。动作一与动作二已提交事件总线。`;
        }
      } else if (selectedIndustry === 'restaurant_takeout') {
        if (discoveryId === 'disc_2') {
          // Create real new combo product in products table
          dbEngine.products.create({
            storeId: 'store_takeout_berlin',
            name: 'AI定制黄金人气的双客爆款炸鸡欢聚薯条汉堡套餐',
            description: 'AI configured food bundles: vanilla crispy lemon fried chicken paired with fries and beverages.',
            price: 18.5,
            inventory: 100,
            sku: 'AI-COMBO-REST-01',
            category: 'combos'
          });

          logTitle = '外卖智能套餐上架';
          logDetail = '已成功启动 restaurant_playbook_bundle_growth，组装“香炸鸡单品+薯条饮料组合”并成功写入 products 商品库。';
        } else if (discoveryId === 'disc_1') {
          dbEngine.tasks?.create?.({
            agentId: 'restaurant_agent',
            title: 'Schedule mid-day flash dynamic promotion rules',
            status: 'completed',
            details: 'LUNCH_REACTIVATE_SUCCESS'
          });
          logTitle = '午间闪购折算自愈';
          logDetail = '配合餐馆外卖作战，午市 dynamic markdown 15% 立刻激活，已记录于 tasks 表。';
        } else if (discoveryId === 'disc_3') {
          dbEngine.promotion_models?.create?.({
            promo_type: 'FixedAmount',
            expected_uplift_pct: 15,
            historical_roi: 5.2
          });
          logTitle = '外单沉睡会员唤醒';
          logDetail = '成功配置 restaurant_playbook_loyalty_recall 专属外卖 €5.00 代金券。';
        } else {
          logTitle = '外卖品质提标';
          logDetail = `已调配专车车道提质。`;
        }
      } else if (selectedIndustry === 'beauty_booking') {
        if (discoveryId === 'disc_1') {
          dbEngine.tasks?.create?.({
            agentId: 'beauty_agent',
            title: 'Deploy off-peak dynamic midday therapist discounts',
            status: 'completed',
            details: 'OFFPEAK_DYNAMIC_OK'
          });
          logTitle = '美容平日席位特惠';
          logDetail = '成功绑定 beauty_playbook_offpeak_incentive，周二/周四 13:00-16:00 动态 20% 平日预约折扣已启动。';
        } else {
          logTitle = '理疗席位对冲';
          logDetail = '技师排班工钟重载配比完毕，爽约保证金规则已录入。';
        }
      } else if (selectedIndustry === 'ecommerce_store') {
        if (discoveryId === 'disc_3') {
          dbEngine.tasks?.create?.({
            agentId: 'ecommerce_logistics',
            title: 'Execute abandoned cart email sequences with voucher incentives',
            status: 'completed',
            details: 'RECOVERY_SENT_OK'
          });
          logTitle = '弃购流失智愈触达';
          logDetail = '一键触发 ecommerce_playbook_cart_recovery_sequence，向流失倾向的加车顾客派发 10% 限售代金邮件。';
        } else {
          logTitle = '电商中枢调优';
          logDetail = '结账页面流程阻力修复完毕，缺货耳机已派发备货单，退货率尺控改写成功。';
        }
      } else if (selectedIndustry === 'pos_retail') {
        if (discoveryId === 'disc_1') {
          dbEngine.tasks?.create?.({
            agentId: 'pos_logistics_core',
            title: 'Execute Inter-store Stock Migration from Hamburg to Munich',
            status: 'completed',
            details: '350_GADGET_UNITS_MOVED'
          });
          logTitle = '跨店爆货物理拔运';
          logDetail = '成功激活 pos_playbook_interstore_balancer，启动汉堡积货跨国枢纽至慕尼黑首发空运发车，已更新在 tasks 队列。';
        } else {
          logTitle = 'POS 防录防漏加固';
          logDetail = '收银 Voiding 撤单风险升级，经理 Pinnacle 面签权限锁已在收银台生效。';
        }
      } else if (selectedIndustry === 'general_merch_electronics') {
        if (discoveryId === 'disc_1') {
          const products = dbEngine.products.getAll();
          let markupCount = 0;
          products.forEach(p => {
            if (p.id.includes('part') || p.id.includes('electro') || p.price > 80) {
              dbEngine.products.update(p.id, { price: Math.round(p.price * 1.05) });
              markupCount++;
            }
          });
          logTitle = '贸易溢关售价对冲';
          logDetail = `已调增通用贸易下 ${markupCount} 款高税款商品 5% 标价，转嫁关税损失，Playbook: general_playbook_margin_protection 已部署。`;
        } else {
          logTitle = '美金远期头寸锁定';
          logDetail = '汇损对冲 Airwallex 结算线绑定对冲完毕。';
        }
      }

      setDiscoveryStatus(prev => {
        const industryStatus = prev[selectedIndustry] || {};
        return {
          ...prev,
          [selectedIndustry]: {
            ...industryStatus,
            [discoveryId]: 'resolved'
          }
        };
      });

      // Write exactly to DB Engine business_experiences (BrainMemory)
      if (currentGoal) {
        try {
          dbEngine.business_experiences.create({
            label: `${selectedIndustry === 'fashion_wholesale' ? '👕' : selectedIndustry === 'restaurant_takeout' ? '🍔' : selectedIndustry === 'beauty_booking' ? '💆' : selectedIndustry === 'ecommerce_store' ? '📦' : selectedIndustry === 'pos_retail' ? '🏪' : '🌐'} 运营战役: ${currentGoal.title}`,
            campaign_or_action_type: currentGoal.playbookName,
            is_success: true,
            net_gain_eur: parseInt(config.benefit.replace(/[^0-9]/g, '')) || 12000,
            primary_reason: `商业目标：[${currentGoal.title}] | 运用 Playbook：[${currentGoal.playbookName}] | 执行：[${currentGoal.actions}] | 结果：[${currentGoal.resultSim}]`,
            memory_anchor_hash: 'mec_' + Math.random().toString(36).substring(2, 8)
          });
        } catch (e) {
          console.error("Failed to write to brain memory:", e);
        }
      }

      onAddSystemLog('AI 大脑发现中心', logTitle, logDetail, 'success');
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 Active Industry Selector Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#07C2E3]" />
            <div>
              <h3 className="font-extrabold text-[13px] text-slate-100 uppercase tracking-widest">ECOS 多智能体行业发现引擎 (Multi-Agent Industry Discovery Matrix)</h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">根据选择的不同行业，自动切换诊断视角、核心风控和 Playbook 作战计划</p>
            </div>
          </div>
          <span className="text-[9px] bg-[#07C2E3]/20 text-[#07C2E3] border border-[#07C2E3]/25 px-2 py-0.5 rounded font-mono font-bold">MODE: DYNAMIC SILO L2</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(industryConfigs).map(([key, ind]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedIndustry(key as any);
                setActivePane('disc_1');
              }}
              className={`flex flex-col p-2.5 rounded-lg border text-left transition-all relative ${selectedIndustry === key ? 'border-[#07C2E3] bg-[#07C2E3]/15 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
            >
              <span className="font-extrabold text-xs block truncate">{ind.short}</span>
              <span className="text-[9px] text-[#07C2E3] font-mono mt-1 font-bold">Score {ind.score} | {ind.benefit}</span>
              {selectedIndustry === key && (
                <span className="absolute bottom-1 right-1 text-[#07C2E3] text-[9px] font-bold">●</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 第一层驱动：设定企业商业目标 (Level 1: Define Business Goal) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-[#07C2E3] animate-pulse" />
            <div>
              <h3 className="font-extrabold text-[13px] text-slate-100 uppercase tracking-widest">第一层核心驱动：设定商业战略目标 (Level 1 Focus: Select Business Goal)</h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">ECOS 智脑系统决策皆以核心战略目标对齐。选择目标后将激活相关 KPI 指标、诊断出深层阻力问题并推荐对应 Playbook</p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">GOAL GOVERNANCE ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentGoalList.map((g: any) => {
            const isGoalActive = g.id === selectedGoalId;
            const targetStatus = (discoveryStatus as any)[selectedIndustry]?.[g.targetDiscoveryId] || 'active';
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer ${
                  isGoalActive 
                    ? 'border-[#07C2E3] bg-[#07C2E3]/8 text-white shadow-md shadow-[#07C2E3]/5' 
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-1 z-10 w-full">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                      isGoalActive ? 'bg-[#07C2E3] text-zinc-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      Goal Target
                    </span>
                    <span className={`text-[9px] font-mono font-bold ${
                      targetStatus === 'resolved' ? 'text-emerald-400' : targetStatus === 'processing' ? 'text-amber-400 animate-pulse' : 'text-rose-400'
                    }`}>
                      {targetStatus === 'resolved' ? '✅ 战役完成·经验落库' : targetStatus === 'processing' ? '⚡ 战役推进部署中' : '⚠️ 存在卡点待发现自愈'}
                    </span>
                  </div>
                  <h4 className={`font-extrabold text-[11.5px] leading-snug mt-2.5 transition-colors ${
                    isGoalActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {g.title}
                  </h4>
                </div>
                
                <div className="mt-3 space-y-1 border-t border-slate-800/60 pt-2 z-10 w-full font-mono">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>物标 KPI :</span>
                    <span className={`font-bold ${isGoalActive ? 'text-white' : 'text-slate-400'}`}>{g.metricAnalysis.split('|')[0]}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>预期救损:</span>
                    <span className="text-emerald-400 font-bold">{g.resultSim}</span>
                  </div>
                </div>

                {/* Subtle target background decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                  <Target className="w-20 h-20 text-white" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📊 Visual Diagnostic KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10 font-bold font-mono text-3xl">Score</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">智脑健康综合得分</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#07C2E3] font-sans">{config.score}</span>
            <span className="text-[9px] text-slate-405 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 max-sm:hidden">诊断 A++</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-1">综合业务、资金、运营风控指标</span>
        </div>
        
        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10 font-bold font-mono text-3xl">Cases</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">待决发现事项 (Active)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-500 font-sans">
              {Object.values(discoveryStatus[selectedIndustry] || {}).filter(s => s === 'active').length}
            </span>
            <span className="text-xs text-slate-450 font-bold">个需人工干预</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-1">智脑引擎每半小时轮询一次所得</span>
        </div>

        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10 font-bold font-mono text-3xl">Saves</div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">系统自愈总收益</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-400 font-sans">+ {config.benefit}</span>
          </div>
          <span className="text-[9px] text-emerald-500 font-mono mt-1">自愈挽留与减损预计总额</span>
        </div>

        <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">自治调配引擎状态</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xs font-bold text-white uppercase bg-[#07C2E3]/20 border border-[#07C2E3]/35 rounded px-2 py-0.5">
              🛡️ FULLY SHIELDED
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-1">严格多租户(Tenant_ID)数据沙箱隔离</span>
        </div>
      </div>

      {/* 💼 Main Discoveries Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Today's 4 Discoveries Cards (7/12 width) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#07C2E3] animate-pulse" />
                <h3 className="font-extrabold text-[12px] text-slate-900 uppercase tracking-wider">本日重磅发现与自愈指令控制台 ({config.name})</h3>
              </div>
              <span className="font-mono text-[10px] text-slate-405 font-bold">2026-06-10 (UTC)</span>
            </div>

            <div className="space-y-3">
              {config.discoveries.map((disc, idx) => {
                const status = (discoveryStatus[selectedIndustry]?.[disc.id]) || 'active';
                const isActive = activePane === disc.id;
                return (
                  <div 
                    key={disc.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${isActive ? 'border-[#07C2E3] bg-slate-50/40 shadow-sm' : 'border-slate-150 hover:bg-slate-50/25'}`}
                    onClick={() => setActivePane(disc.id as any)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {status === 'active' && <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span></span>}
                          {status === 'processing' && <RefreshCw className="w-4 h-4 text-[#07C2E3] animate-spin" />}
                          {status === 'resolved' && <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <span>发现 {idx + 1} : </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${disc.color === 'amber' ? 'bg-amber-100 text-amber-800' : disc.color === 'rose' ? 'bg-rose-100 text-rose-800' : disc.color === 'cyan' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'}`}>
                              {disc.badge}
                            </span>
                          </h4>
                          <p className="text-xs font-bold text-slate-700 mt-1">{disc.reason}</p>
                          <p className="text-[11px] text-[#07C2E3] font-bold mt-1.5 flex items-center gap-1">
                            <span>AI建议：</span>
                            <span className="text-slate-650 font-medium">{disc.advice}</span>
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">{disc.riskVal}</span>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => { setActivePane(disc.id as any); setShowAuditModal(true); }}
                        className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-md transition-all font-sans"
                      >
                        🔍 查阅物理审计
                      </button>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setActivePane(disc.id as any); setSelectedPlanDetails(disc.id as any); }}
                          className={`px-3.5 py-1.5 text-[11px] font-black rounded-md flex items-center gap-1.5 transition-all ${status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          <span>{status === 'resolved' ? '✓ 已执行作战排产' : '👉 进入行业战略作战室'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Dense Interactive Chart Viewers (5/12 width) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4 text-left text-slate-100 min-h-[580px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <span className="text-xs font-black uppercase text-[#07C2E3] tracking-widest flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>实时战略流剖析 ({config.short})</span>
                </span>
                <span className="font-mono text-[9px] bg-slate-800 text-slate-400 rounded px-1.5 py-0.5 border border-slate-755">LIVE-FEED</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{activeDiscovery.chartLabel}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeDiscovery.chartSub}</p>
              </div>

              {/* Dynamic Recharts Rendering based on defined config. Needs absolute height */}
              <div className="h-[210px] w-full bg-slate-950 p-2.5 border border-slate-800 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  {activeDiscovery.id === 'disc_3' && selectedIndustry === 'fashion_wholesale' ? (
                    <LineChart data={activeDiscovery.chartData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b' }} />
                      <Line type="monotone" dataKey={activeDiscovery.dataKey} stroke="#07C2E3" strokeWidth={2.5} />
                    </LineChart>
                  ) : activeDiscovery.id === 'disc_1' && selectedIndustry === 'restaurant_takeout' ? (
                    <LineChart data={activeDiscovery.chartData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b' }} />
                      <Line type="monotone" dataKey={activeDiscovery.dataKey} stroke="#e11d48" strokeWidth={2.5} />
                    </LineChart>
                  ) : (
                    <BarChart data={activeDiscovery.chartData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b' }} />
                      <Bar dataKey={activeDiscovery.dataKey} fill={activeDiscovery.color === 'rose' ? '#f43f5e' : '#07C2E3'} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-[11px] space-y-2 text-slate-305 mt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">绑定 Playbook 模板 (Playbook Standard):</span>
                <span className="font-bold font-mono text-[#07C2E3]">{activeDiscovery.playbook}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">异常评估审计等级 (Severity Grade):</span>
                <span className="font-bold font-mono text-rose-450 uppercase">HIGH_PRIORITY_SILO_RUN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">授权处理期望自愈提振 (Expected Yield):</span>
                <span className="font-bold font-mono text-emerald-400">估计挽损提速 +38% 至 +62%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 🧠 ECOS BRAIN OPERATING MEMORY LEDGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#07C2E3]" />
            <div>
              <h3 className="font-extrabold text-[13px] text-slate-100 uppercase tracking-widest">ECOS 智脑战役经验数据库 (Brain Memory Ledger)</h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">记录当前隔离租户外商业战役的实际自愈与挽损成败审计，用以智脑大盘自洽优先对锁与同类模型对齐</p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold">● RETRIEVAL CORE ACTIVE</span>
        </div>

        <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
          {experiences.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs italic bg-slate-950 rounded-lg border border-slate-850">
              暂无已沉淀的本地高级自愈经验战役。请在上方点击进入指挥部并“授权并一键物理部署”，智脑成败因子将即刻落库并加载！
            </div>
          ) : (
            [...experiences].reverse().map((exp) => (
              <div key={exp.id} className="p-3.5 bg-slate-950 rounded-lg border border-slate-850 flex items-start gap-3.5 justify-between hover:border-slate-700 transition-colors">
                <span className="text-lg shrink-0 mt-0.5">{exp.is_success ? '🟢' : '🔴'}</span>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span className="text-[11.5px] font-sans">{exp.label}</span>
                    <strong className="font-mono text-emerald-400">
                      +€{exp.net_gain_eur.toLocaleString()}
                    </strong>
                  </div>
                  <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">{exp.primary_reason}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[9px] font-mono text-slate-500 mt-2 bg-slate-900 px-2 py-1.5 rounded border border-slate-850 gap-1.5">
                    <span>Campaign Anchor Hash: <b className="text-slate-350">{exp.memory_anchor_hash}</b> • Playbook: {exp.campaign_or_action_type}</span>
                    <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">✓ MATCHABLE FOR FUTURE IDENTICAL SCENARIOS</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📊 Dynamic Physical Audit Detail Popup */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-350 w-full max-w-lg rounded-xl p-6 text-slate-900 space-y-4 text-left shadow-2xl relative">
            <button onClick={() => setShowAuditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            <div className="border-b pb-3.5">
              <span className="text-[10px] text-[#07C2E3] font-bold tracking-widest block uppercase font-mono">ECOS LIVE AUDIT TRAIL</span>
              <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider mt-1">{activeDiscovery.auditTitle}</h3>
            </div>
            
            <div className="space-y-3 font-sans text-xs text-slate-700">
              <p className="leading-relaxed bg-slate-50 border p-3 rounded-lg font-mono text-[11px]">
                {activeDiscovery.auditDetails}
              </p>
              <div className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[10.5px] space-y-1 font-mono">
                <span className="text-[#07C2E3] font-black block">🛡️ 多租户数据安全合规保护 (Tenant Level Rules)</span>
                <span className="block text-slate-400">· Active Silo Isolated Audit ID: audit_sys_run_{activeDiscovery.id}</span>
                <span className="block text-slate-405">· DB Subscription Hook status: ESTABLISHED.</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button onClick={() => setShowAuditModal(false)} className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2 rounded-lg">
                确定与返回 (Acknowledge)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💼 AI CAMPAIGN BOARD ROOM (行业作战室 Modal) */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#07C2E3]" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">ECOS 行业战役指挥部 - {config.roomName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">PLAYBOOK REFERENCE: {config.discoveries.find(d => d.id === selectedPlanDetails)?.playbook}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlanDetails(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 rounded px-2.5 py-1 transition-all"
              >
                ✕ 关闭 (Exit)
              </button>
            </div>

            {/* Campaign-Specific Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 max-h-[70vh]">
              {(() => {
                const discObj = config.discoveries.find(d => d.id === selectedPlanDetails);
                if (!discObj) return null;
                return (
                  <>
                    <div className="border-l-4 border-[#07C2E3] pl-3.5 space-y-1">
                      <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest block">Active Goal-Driven Blueprint</span>
                      <h4 className="text-base font-black text-slate-900 leading-tight">🔥 针对 {discObj.title} 的 AI 智脑作战决议</h4>
                      {currentGoal && (
                        <div className="mt-1.5 p-2 bg-[#07C2E3]/8 rounded border border-[#07C2E3]/20 inline-flex items-center gap-1.5 font-mono text-[10.5px] text-slate-800">
                          <Target className="w-3.5 h-3.5 text-[#07C2E3]" />
                          <span>一阶战略底盘目标：<b className="text-slate-950 font-extrabold">{currentGoal.title}</b></span>
                        </div>
                      )}
                    </div>

                    {/* Problem & Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left">
                        <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          监测存在问题 (Analyzed Problem)
                        </span>
                        <p className="text-[11px] font-bold text-slate-700 mt-2 leading-relaxed">
                          • {discObj.reason}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left">
                        <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Search className="w-3.5 h-3.5 text-[#07C2E3]" />
                          关联物理根源 (Physic Root)
                        </span>
                        <p className="text-[11px] font-bold text-slate-700 mt-2 leading-relaxed">
                          • 触警 Playbook: <b>{discObj.playbook}</b>。<br/>
                          • 数据反馈级别: <b>CUSTOM_SILO_WARNING</b>。<br/>
                          • 影响敞口评估: <b>{discObj.riskVal}</b>。
                        </p>
                      </div>
                    </div>

                    {/* Stage Actions */}
                    <div className="space-y-3 text-left">
                      <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        双核自愈多阶段行动计划 (Core Decision Matrix)
                      </span>
                      
                      <div className="space-y-2">
                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start gap-2.5">
                          <span className="font-mono bg-amber-500 text-zinc-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">01</span>
                          <div>
                            <strong className="text-slate-900 font-bold block text-xs">阶段一行动指令 (Remediation Core)</strong>
                            <span className="text-slate-500 mt-0.5 block leading-relaxed">{discObj.action1Title}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start gap-2.5">
                          <span className="font-mono bg-indigo-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">02</span>
                          <div>
                            <strong className="text-slate-900 font-bold block text-xs">阶段二联动指标 (Remediation Aux)</strong>
                            <span className="text-slate-500 mt-0.5 block leading-relaxed">{discObj.action2Title}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 💡 智脑历史经验匹配与最推荐方案 */}
                    {(() => {
                      const matchedSaves = dbEngine.business_experiences.getAll().filter(exp => 
                        exp.campaign_or_action_type === currentGoal?.playbookName ||
                        exp.label.includes(currentGoal?.title || '')
                      );
                      
                      return matchedSaves.length > 0 ? (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-left">
                          <span className="font-extrabold text-[10px] text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                            <Award className="w-4 h-4 text-emerald-600 animate-bounce" />
                            智脑历史战役自愈经验对锁优先推荐 (Priority Match: Verified AI Memory)
                          </span>
                          <div className="mt-2 space-y-1.5 text-[11px] text-emerald-800 font-medium">
                            <p>• <b>检测到同隔离租户已获捷战役！</b> 重合度匹配百分百，决策树优先以此验证方案推荐部署。</p>
                            <p>• 物理自愈记点: <b className="text-emerald-950 font-extrabold">{matchedSaves[0].label}</b></p>
                            <p className="bg-white/60 p-2.5 rounded-lg font-mono text-[10.5px] border border-emerald-250 leading-relaxed">
                              {matchedSaves[0].primary_reason}
                            </p>
                            <p>• 实据挽损成效: <span className="text-emerald-700 font-black font-mono">+{matchedSaves[0].net_gain_eur >= 0 ? '€' : '-€'}{Math.abs(matchedSaves[0].net_gain_eur).toLocaleString()} 利润获盈增加 (🟢 VERIFIED SUCCESS)</span></p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left font-sans">
                          <span className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                            <BookOpen className="w-4 h-4 text-[#07C2E3]" />
                            智脑共享元智识图谱对准 (Baseline Playbook Recommendations)
                          </span>
                          <p className="text-[11px] font-bold text-slate-600 mt-2 leading-relaxed">
                            • 本隔离租户下暂无历史相符经验。正在无缝对准 **ECOS 全球智脑分布式经验图谱** 行业高频最佳调优公式：
                          </p>
                          <p className="text-[10.5px] font-mono text-slate-505 text-slate-500 mt-1.5 pl-3 bg-white p-2 border border-slate-150 rounded-lg leading-relaxed">
                            调用自愈策略 "{currentGoal?.playbookName || 'GLOBAL_AI_STEER'}"。在同质大盘租户统计下置信评分 94.8%，预估可在 48-72 小时内实现指标极速中和折补。
                          </p>
                        </div>
                      );
                    })()}

                    {/* Expected results */}
                    <div className="bg-[#07C2E3]/5 border border-[#07C2E3]/20 rounded-xl p-4 text-left">
                      <span className="font-extrabold text-[10px] text-[#059BBC] uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-[#07C2E3]" />
                        预期智算效果估价 (Projected Outcomes)
                      </span>
                      <p className="text-[11px] font-bold text-slate-700 mt-2 leading-relaxed font-mono">
                        • 达成自愈执行后，业务指标偏差预计收窄 <b>82%</b>。<br/>
                        • 净挽损或客单提升预期净收益提振至: <b>+{config.benefit} 盈溢值</b>。<br/>
                        • 执行记忆备份：<b>物理落库隔离沙箱，记录为长期 AI 经验并对锁同类场景</b>。
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Footer Form with Real Database Authorisation & Execution */}
            <div className="bg-slate-50 border-t border-slate-200 p-5 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#07C2E3] animate-pulse"></div>
                <span className="text-[10px] text-slate-500 font-bold font-mono">
                  LOCKED ISO: MULTITENANT_SECURE_COGNITIVE_SHIELD
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedPlanDetails(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 hover:bg-slate-100 font-bold text-[11px] rounded-lg transition-all"
                >
                  放弃战役方案
                </button>
                <button 
                  onClick={() => {
                    if (selectedPlanDetails) {
                      handleAction(selectedPlanDetails, 'EXECUTE_ALL');
                    }
                    setSelectedPlanDetails(null);
                  }}
                  className="px-4 py-2.5 bg-[#07C2E3] text-zinc-950 hover:bg-[#06B2D0] font-black text-[11.5px] rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                  <span>💾 授权并一键物理部署 (Authorize & Execute)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
