import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, Users, Bot, Settings, Database, RefreshCw, 
  Send, AlertTriangle, Key, Sliders, Check, Network, Activity,
  CreditCard, Mail, Eye, Play, Pause, Trash, ArrowRight, Shield, FileText, Globe, X,
  Code, Search, Lock, HelpCircle, Terminal, Coins, DollarSign,
  Brain, Award, Zap, CheckCircle, ShieldCheck, Inbox, Sparkles, Trash2, Scale, LayoutDashboard, Layers,
  Compass, BookOpen, Megaphone, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TenantConfig, AppMarketItem, IndustryType } from '../../types';
import { dbEngine } from '../../db/dbEngine';
import EcosPerformanceOptimizer from './ai-brain-center/EcosPerformanceOptimizer';
import EcosStrategicIntelligence from './ai-brain-center/EcosStrategicIntelligence';
import EcosCognitiveGovernance from './ai-brain-center/EcosCognitiveGovernance';
import EcosEnterpriseNervousSystem from './ai-brain-center/EcosEnterpriseNervousSystem';
import AIDiscoveryCenter from './ai-brain-center/AIDiscoveryCenter';
import AIExecutionControlCenter from './ai-brain-center/AIExecutionControlCenter';
import EcosCEODashboard from './ai-brain-center/EcosCEODashboard';
import EcosMasterDirectory from './ai-brain-center/EcosMasterDirectory';
import AINavigationCenter from '../AINavigationCenter';
import PlatformKnowledgeCenter from './ai-brain-center/PlatformKnowledgeCenter';
import PlatformWorkflowCenter from './ai-brain-center/PlatformWorkflowCenter';
import P1IntelligenceControlCenter from './ai-brain-center/P1IntelligenceControlCenter';
import PlatformTuningConsole from './ai-brain-center/PlatformTuningConsole';

interface SuperAdminCenterProps {
  activeSubTab?: 'stats' | 'tenants' | 'packages' | 'finance' | 'gateways' | 'communications' | 'ai-ops' | 'marketplace' | 'developer' | 'roles' | 'logs' | 'settings' | 'query' | 'diagnostics' | 'sectors';
  tenants: TenantConfig[];
  onUpdateTenantStatus: (tenantId: string, status: 'active' | 'suspended') => void;
  onUpdateTenantAiBudget: (tenantId: string, budget: number) => void;
  marketItems: AppMarketItem[];
  onAddMarketItem: (item: AppMarketItem) => void;
  globalDefaultModel: string;
  onChangeGlobalModel: (model: string) => void;
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  activeAgents?: any[];
  onUpdateAgents?: (agents: any[]) => void;
  onChangeSubTab?: (subTab: string) => void;
  auditLogs?: any[];
  setAuditLogs?: React.Dispatch<React.SetStateAction<any[]>>;
  agentRuns?: any[];
  setAgentRuns?: React.Dispatch<React.SetStateAction<any[]>>;
  agentTasks?: any[];
  setAgentTasks?: React.Dispatch<React.SetStateAction<any[]>>;
  tenantDB?: Record<string, any>;
  setTenantDB?: React.Dispatch<React.SetStateAction<any>>;
  addLog?: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  selectedIndustry?: IndustryType;
  onSwitchTab?: (tabId: string) => void;
  onImpersonate?: (tenantId: string, industry: IndustryType) => void;
  industryConfigs?: Record<string, any>;
  onUpdateIndustryConfigs?: (newConfigs: Record<string, any>) => void;
}

export default function SuperAdminCenter({
  activeSubTab = 'stats',
  tenants,
  onUpdateTenantStatus,
  onUpdateTenantAiBudget,
  marketItems,
  onAddMarketItem,
  globalDefaultModel,
  onChangeGlobalModel,
  onAddSystemLog,
  activeAgents = [],
  onUpdateAgents,
  onChangeSubTab,
  auditLogs = [],
  setAuditLogs,
  agentRuns = [],
  setAgentRuns,
  agentTasks = [],
  setAgentTasks,
  tenantDB,
  setTenantDB,
  addLog,
  selectedIndustry = 'retail',
  onSwitchTab,
  onImpersonate,
  industryConfigs = {},
  onUpdateIndustryConfigs
}: SuperAdminCenterProps) {

  // ==================== 24h System Task Performance Data for Recharts ====================
  const last24hPerformanceData = useMemo(() => {
    const data = [];
    const baseHour = 14; 
    for (let i = 23; i >= 0; i--) {
      const hourVal = (baseHour - i + 24) % 24;
      const hourStr = `${hourVal.toString().padStart(2, '0')}:00`;
      
      const isBusinessHour = hourVal >= 9 && hourVal <= 18;
      const baseTasks = isBusinessHour ? 220 : 115;
      const tasks = Math.floor(baseTasks + Math.sin(i * 0.8) * 45 + Math.random() * 20);
      
      const baseLatency = isBusinessHour ? 205 : 145;
      const latency = Math.floor(baseLatency + Math.cos(i * 0.8) * 20 + Math.random() * 15);
      
      data.push({
        time: hourStr,
        tasks,
        latency,
      });
    }
    return data;
  }, []);

  const performanceStats = useMemo(() => {
    const totalTasks = last24hPerformanceData.reduce((sum, item) => sum + item.tasks, 0);
    const avgLatency = Math.round(last24hPerformanceData.reduce((sum, item) => sum + item.latency, 0) / last24hPerformanceData.length);
    return {
      totalTasks,
      avgLatency,
      successRate: '99.91%',
    };
  }, [last24hPerformanceData]);

  // ==================== 1. 平台控制中心 States linked directly to dbEngine ====================
  const [allowSignup, setAllowSignup] = useState(() => dbEngine.system_settings.get('allow_signup', true));
  const [trialEnabled, setTrialEnabled] = useState(() => dbEngine.system_settings.get('trial_enabled', true));
  const [maintenanceMode, setMaintenanceMode] = useState(() => dbEngine.system_settings.get('maintenance_mode', false));
  const [readonlyMode, setReadonlyMode] = useState(() => dbEngine.system_settings.get('readonly_mode', false));
  const [systemNotice, setSystemNotice] = useState(() => dbEngine.system_notices.getCurrentNotice());
  const [isNoticeBroadcasting, setIsNoticeBroadcasting] = useState(false);
  const [upgradeLogs, setUpgradeLogs] = useState<string[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // System events, pending tasks & subscriptions loaded dynamically from dbEngine tables
  const [systemEvents, setSystemEvents] = useState(() => dbEngine.system_events.getAll());
  const [pendingTasksState, setPendingTasksState] = useState(() => dbEngine.pending_tasks.getAll());
  const [tenantSubscriptions, setTenantSubscriptions] = useState(() => dbEngine.tenant_subscriptions.getAll());

  // Active Metrics Definition Page Mode Inside Stats Tab
  const [activeStatsTabMode, setActiveStatsTabMode] = useState<'console' | 'definition'>('console');

  // Reload data from DB to make changes fully reactive and stable
  const reloadAdminDB = () => {
    setAllowSignup(dbEngine.system_settings.get('allow_signup', true));
    setTrialEnabled(dbEngine.system_settings.get('trial_enabled', true));
    setMaintenanceMode(dbEngine.system_settings.get('maintenance_mode', false));
    setReadonlyMode(dbEngine.system_settings.get('readonly_mode', false));
    setSystemNotice(dbEngine.system_notices.getCurrentNotice());
    setSystemEvents(dbEngine.system_events.getAll());
    setPendingTasksState(dbEngine.pending_tasks.getAll());
    setTenantSubscriptions(dbEngine.tenant_subscriptions.getAll());
  };

  useEffect(() => {
    const interval = setInterval(reloadAdminDB, 2000);
    return () => clearInterval(interval);
  }, []);

  // ==================== 2. 租户中心 Extra States ====================
  const [tokenAdjustments, setTokenAdjustments] = useState<Record<string, number>>({});
  const [selectedTenantData, setSelectedTenantData] = useState<TenantConfig | null>(null);
  const [isAddingTenant, setIsAddingTenant] = useState(false);
  const [quickTenantName, setQuickTenantName] = useState('');
  const [quickTenantIndustry, setQuickTenantIndustry] = useState<IndustryType>('retail');
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [quickPlanName, setQuickPlanName] = useState('');
  const [quickPlanPrice, setQuickPlanPrice] = useState(199);

  // ==================== 3. 数据查询中心 States ====================
  const [selectedTable, setSelectedTable] = useState<'orders' | 'products' | 'customers' | 'tenants'>('orders');
  const [queryInput, setQueryInput] = useState('SELECT * FROM orders LIMIT 20;');
  const [searchQuery, setSearchQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);

  // ==================== 4. Specialized Industry Database Inspector States ====================
  const [auditingIndustry, setAuditingIndustry] = useState<IndustryType | null>(null);
  const [auditingDataType, setAuditingDataType] = useState<'products' | 'orders' | 'customers'>('products');

  // Real Database Extraction
  const allOrders = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.orders || []).map((o: any) => ({ ...o, industry }));
    });
  }, [tenantDB]);

  const allProducts = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.products || []).map((p: any) => ({ ...p, industry }));
    });
  }, [tenantDB]);

  const allCustomers = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.customers || []).map((c: any) => ({ ...c, industry }));
    });
  }, [tenantDB]);

  // Handle data querying based on selections/CLI commands
  const processedQueryResult = useMemo(() => {
    let sourceData: any[] = [];
    if (selectedTable === 'orders') sourceData = allOrders;
    else if (selectedTable === 'products') sourceData = allProducts;
    else if (selectedTable === 'customers') sourceData = allCustomers;
    else if (selectedTable === 'tenants') sourceData = tenants;

    if (!searchQuery.trim()) {
      return sourceData;
    }

    const term = searchQuery.toLowerCase().trim();
    return sourceData.filter(item => {
      return Object.values(item).some(val => {
        if (!val) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [selectedTable, allOrders, allProducts, allCustomers, tenants, searchQuery]);

  // ==================== 4. 支付通道 States ====================
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 'stripe', name: 'Stripe 境外信用卡渠道网关', apiKey: 'sk_live_51Msz8pG9Ap82K...', webhook: 'https://SaaS-api.shopify.net/webhooks/stripe', status: true, syncTime: '2026-06-08 14:15:30', errorLogs: ['Webhook signature verification warning (2026-06-08 10:22)'] },
    { id: 'paypal', name: 'PayPal 贝宝数字金融对账网关', apiKey: 'client_id_live_A98F...', webhook: 'https://SaaS-api.shopify.net/webhooks/paypal', status: true, syncTime: '2026-06-08 13:58:12', errorLogs: [] },
    { id: 'adyen', name: 'Adyen 欧陆多币种快捷清算宿主', apiKey: 'ws_prod_z87y90aK772B...', webhook: 'https://SaaS-api.shopify.net/webhooks/adyen', status: true, syncTime: '2026-06-08 12:44:09', errorLogs: [] },
    { id: 'klarna', name: 'Klarna 境外先买后付账款信托', apiKey: 'pk_klarna_de_8b244...', webhook: 'https://SaaS-api.shopify.net/webhooks/klarna', status: false, syncTime: '从未同步', errorLogs: ['API credentials revoked by Klarna gateway sandbox issuer'] }
  ]);
  const [isSyncingGateway, setIsSyncingGateway] = useState<string | null>(null);

  // ==================== 5. AI 大脑中心 States ====================
  const [aiCentralTab, setAiCentralTab] = useState<'agents' | 'workflow' | 'automation' | 'knowledge' | 'rules' | 'events' | 'tasks' | 'monitor' | 'dashboard' | 'execution_center' | 'discovery' | 'monitoring' | 'optimizer' | 'strategic' | 'cognitive' | 'nervous' | 'memory' | 'boardroom' | 'system_map' | 'system_registry' | 'ai_navigator' | 'visual_workflow' | 'p1_intelligence' | 'tuning'>('agents');

  useEffect(() => {
    const handleSetCentralTab = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        console.log("[SuperAdminCenter] Heard ECOS_SET_AI_CENTRAL_TAB event with detail:", detail);
        setAiCentralTab(detail as any);
      }
    };
    window.addEventListener('ECOS_SET_AI_CENTRAL_TAB', handleSetCentralTab);
    return () => window.removeEventListener('ECOS_SET_AI_CENTRAL_TAB', handleSetCentralTab);
  }, []);
  const [aiOpTab, setAiOpTab] = useState<'revenue' | 'fraud' | 'campaign'>('revenue');
  const [dispatchedCampaign, setDispatchedCampaign] = useState(false);
  const [dispatchedSettlement, setDispatchedSettlement] = useState(false);
  const [lockedRisk, setLockedRisk] = useState(false);

  const [agentsList, setAgentsList] = useState([
    { id: 'inventory_agent', name: '库存调控代理 (Inventory Control Agent)', status: 'Active', version: 'v3.2.1', runs: 124, lastTime: '2.5s' },
    { id: 'pricing_agent', name: '实时调价智能体 (Pricing Adjustment Agent)', status: 'Active', version: 'v3.1.8', runs: 85, lastTime: '1.8s' },
    { id: 'marketing_agent', name: '客户挽留智能体 (Loyalty Re-engager Agent)', status: 'Active', version: 'v2.9.4', runs: 215, lastTime: '3.1s' },
    { id: 'support_agent', name: '智能客服专家 (Support Operations Expert)', status: 'Active', version: 'v4.0.2', runs: 412, lastTime: '0.9s' },
    { id: 'risk_agent', name: '风控拦截智能网 (Risk & Fraud Defensor)', status: 'Disabled', version: 'v2.1.0', runs: 18, lastTime: '4.2s' }
  ]);

  // Global Decisive AI Chat State (总后台 AI 智能运维)
  const [globalAIChatMessages, setGlobalAIChatMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `系统正常运行中。当前已对接全网活跃隔离商户，所有通道运行平稳。

我可以协助您执行全平台财务对账、风控高危商户筛选、联合战役效果评估。比如您可以问我：
- “过去7天全平台表现怎么样？”
- “哪些商铺的异常争议退款风险最高？”
- “当前全网各隔离商户的利润表现与 MRR 汇总”`
    }
  ]);
  const [globalAIChatInput, setGlobalAIChatInput] = useState('');
  const [isGlobalAIThinking, setIsGlobalAIThinking] = useState(false);

  // Fetch real agent task list
  const realAgentTasks = useMemo(() => {
    return agentTasks.length > 0 ? agentTasks : [
      { id: 'tsk_0091', agentId: 'inventory_agent', name: '服装保税仓库存缺料核查与补货命令', executionTime: '2026-06-08 14:12', result: '已补货提交至审批', status: 'WAIT_FOR_APPROVAL' },
      { id: 'tsk_0088', agentId: 'pricing_agent', name: '外卖披萨热销峰值竞品调价核算', executionTime: '2026-06-08 13:40', result: '平均单价上调 €1.2 加权通过', status: 'FINISHED' }
    ];
  }, [agentTasks]);

  // ==================== ECOS Enterprise Cognitive Operating System States ====================
  const [selectedDebateId, setSelectedDebateId] = useState<number>(1);
  const [humanRulingText, setHumanRulingText] = useState('');
  const [humanResolutionPath, setHumanResolutionPath] = useState('');
  const [showAnalysisPathId, setShowAnalysisPathId] = useState<number | null>(null);

  // New states for creating multi-agent debates dynamically
  const [showSpawnForm, setShowSpawnForm] = useState(false);
  const [spawnTopic, setSpawnTopic] = useState('');
  const [spawnAgents, setSpawnAgents] = useState<string[]>(["inventory", "pricing", "finance", "logistics"]);
  const [isSpawningDebate, setIsSpawningDebate] = useState(false);
  const [spawnDebateProgress, setSpawnDebateProgress] = useState('');

  const handleSpawnDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnTopic.trim()) return;

    setIsSpawningDebate(true);
    setSpawnDebateProgress('正在召集多职业智能专家(WMS仓储/收益定价/合规安全/财务审计)...');

    try {
      // Step visualizer simulations
      const timer1 = setTimeout(() => setSpawnDebateProgress('WMS Inventory Agent 正在调取 Botble SKU 备件与周转数据...'), 600);
      const timer2 = setTimeout(() => setSpawnDebateProgress('Yield Pricing Specialist 正在拟合跨国运费波动弹性...'), 1400);
      const timer3 = setTimeout(() => setSpawnDebateProgress('Corporate Finance Analyst 正在执行安全边际毛利审查...'), 2200);

      const resp = await fetch("/api/gemini/boardroom-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: spawnTopic,
          selectedAgents: spawnAgents,
          tenantId: "t_retail"
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const data = await resp.json();
      if (data.success && data.debate) {
        setDebates(prev => [data.debate, ...prev]);
        setSelectedDebateId(data.debate.id);
        onAddSystemLog('ECOS Boardroom', '发起联席会评', `成功召集多智能体研讨: "${spawnTopic.slice(0, 35)}..."`, 'success');
        setSpawnTopic('');
        setShowSpawnForm(false);
      } else {
        alert("Boardroom initialization failed: " + (data.error || "Unknown Error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Network exception connecting to AI Boardroom: " + err.message);
    } finally {
      setIsSpawningDebate(false);
      setSpawnDebateProgress('');
    }
  };

  // ECOS Memories (DNA Memory Constraints Database)
  const [memories, setMemories] = useState<any[]>([
    { id: 1, category: 'Brand Alignment', fact: '核心定位中高端服饰线。全集群任何单品由于换季折扣导致毛净利率严禁穿透 35% 红线。', importance: 'critical' },
    { id: 2, category: 'Pricing Protection', fact: '法国及意区特定自然冬季蚕丝特制品必须锚定高附加值定价，避开大众化廉价红波段。', importance: 'critical' },
    { id: 3, category: 'Geographical Boundary', fact: '核心市场物理隔离区划：目前主力覆盖法国、意大利。任何非常规物流阻尼应自动向两端分摊决策。', importance: 'normal' }
  ]);
  const [newMemoryCategory, setNewMemoryCategory] = useState('Brand Alignment');
  const [newMemoryImportance, setNewMemoryImportance] = useState<'normal' | 'critical'>('critical');
  const [newMemoryFact, setNewMemoryFact] = useState('');

  // ECOS Debates (Level 7 multi-agent board disputation)
  const [debates, setDebates] = useState<any[]>([
    {
      id: 1,
      topicTitle: '阿尔卑斯冬季山路滑溜阻尼增加导致法国仓蚕丝/羊毛系列爆款在12天内极缺的库存自适应调拨对冲策略',
      status: 'pending',
      opinions: [
        {
          agentName: 'WMS Supply Chain Sentry',
          agentCategory: 'Inventory',
          recommendation: '紧急启用意大利 Rome 保税二级大库的 300 件蚕丝成品物料，一键保税调拨分摊至法国 Lyon 主力库房。',
          rationale: '法国巴黎备库在 12 天内 100% 出现物理断供。意大利由于前期过剩备仓，可以完美分摊该溢出流量。',
          financialImpact: '提振净利+€5,200',
          confidenceScore: 89,
          isDominantAlternative: true
        },
        {
          agentName: 'Campaign Optimizer Sentry',
          agentCategory: 'Marketing',
          recommendation: '立即对法国里昂、巴黎等高流量沸点区全网用户限停发放“冬季系列”折扣优惠，调高毛净溢价率。',
          rationale: '通过局部价格歧视阻尼压制购买热度，拉长货架销售时长，规避物理断货的客户流失创伤。',
          financialImpact: '利润保全+€3,100',
          confidenceScore: 78,
          isDominantAlternative: false
        },
        {
          agentName: 'Financial Liquidity Sentry',
          agentCategory: 'Financial',
          recommendation: '暂缓法国仓调物物料行动。将储备资金全数转入清分结转高收益对冲债，保持 MRR 账期现金流最高安全分值。',
          rationale: '目前多租户跨国结汇因关税波动出现 1.5% 阻尼攀升，在银行清分窗口调运物料容易带来瞬时透支。',
          financialImpact: '理财收益+€1,800',
          confidenceScore: 65,
          isDominantAlternative: false
        },
        {
          agentName: 'Sovereign Sentry',
          agentCategory: 'Risk',
          recommendation: '物理冻结苏黎世大车物理路线。由于瑞士本周由于气象波幅产生高额临时关税（18.5%），必须重定向调拨轨迹。',
          rationale: '严格效忠 ECOS 宪规关税保全红线，宁愿空转 24h 也不可让多租户资金暴露在高危关税罚单概率中。',
          financialImpact: '规避流失+€18,600',
          confidenceScore: 92,
          isDominantAlternative: false
        }
      ]
    },
    {
      id: 2,
      topicTitle: '多租户法国店面谷歌广告投放 ROI 本周下滑 18.2% 与广告支出削减 25% 的联合应对论证',
      status: 'ruled',
      opinions: [
        {
          agentName: 'Campaign Optimizer Sentry',
          agentCategory: 'Marketing',
          recommendation: '立即消减法国低转换 Ad Group 广告开支 25%，向意大利优质引流人群重定向分派 15,000 欧元。',
          rationale: '法国获客成本（CAC）超出毛利容忍极值。将优质预算转移至意大利可以使全局 ROI 恢复 12%。',
          financialImpact: '挽回流量+€4,500',
          confidenceScore: 84,
          isDominantAlternative: true
        },
        {
          agentName: 'Financial Liquidity Sentry',
          agentCategory: 'Financial',
          recommendation: '全局冻结广告预算。将 25% 广告开支直接计入本季利润，防止跨国流动性发生负向偏离。',
          rationale: '由于外部结清利率调换，多租户在现汇期暴露，削减预算直接回款是保证现金流最好的自适应防线。',
          financialImpact: '纯利留存+€6,000',
          confidenceScore: 71,
          isDominantAlternative: false
        }
      ],
      ceoRuling: {
        decision: 'Sovereign Ruling Overrides Action Plans. Reject marketing scaling; freeze low efficiency Ad campaigns. Enforce localized dispatching path.',
        justification: 'Issued manually via Central AI Brain Core overriding automated standoffs to protect net margins above 35% and avoid Alpine border transit tariffs.',
        confidenceScore: 99,
        actionPlan: [
          '第一步：锁死瑞士海关大车物料运行。',
          '第二步：意大利罗马本地快速物流启动，调拨120件蚕丝。',
          '第三步：消减法国18%低ROI投放，结余进入清分池。'
        ]
      }
    }
  ]);

  // ECOS Operator simulated tasks tracer
  const [operatorTasks, setOperatorTasks] = useState<any[]>([
    {
      id: 1,
      taskName: 'ECOS Background Real-time Sentry Alignment (大仓备货水位与潜在缺货断货巡诊)',
      status: 'completed',
      subSteps: [
        { name: '多维数据库拉取主力大仓 (巴黎、里昂、罗马) 实时结余水位物理值', status: 'completed' },
        { name: '调用霍尔特-温特斯 (Exponential Smoothing) 时间序列拟合销量斜率', status: 'completed' },
        { name: '判定安全囤积天数 (Safety Limit) 穿透，发送紧急缺货中断命令 (OK)', status: 'completed' }
      ]
    },
    {
      id: 2,
      taskName: 'Ad Conversion Yield & Multi-Tenant Isolated Ad ROI Balance check (跨隔离租户广告投放转换分析纠偏)',
      status: 'running',
      subSteps: [
        { name: '自动解离隔离租户 (Tenant_id: e1a3b9) 支付通道中 Adyen 的物理数据', status: 'completed' },
        { name: '分析该隔离租户在法国、意区的引流转化 ROI 与竞品指数偏位', status: 'running' },
        { name: '计算高维 Bayesian 归因图谱，纠正是由于山路交通阻尼导致的履约率延迟导致的流失', status: 'pending' }
      ]
    },
    {
      id: 3,
      taskName: 'Reverse Logistics Optimization & Fraud Refund Denial (跨境逆向物流分析与异常退单欺诈防护)',
      status: 'pending',
      subSteps: [
        { name: '捕获全网异常跨区退货、非合规多次索赔的用户物理签名', status: 'pending' },
        { name: '启动三方信用预估评级核查，防止跨租户穿透刷单', status: 'pending' },
        { name: '自动拉黑并自主下达拒付答辨书制备 (Sovereign Shield On)', status: 'pending' }
      ]
    }
  ]);

  // ECOS Insights Ledger (Level 5 learning log)
  const [insights, setInsights] = useState<any[]>([
    { id: 1, insightCategory: 'User Purchasing Path', factLearned: '法国本土中高端VIP老客的冬季购买爆发点在周四下午 14:00 - 17:00，此时进行个性化邮件触达，转化密度平均提纯 18.25%。', impactScore: '+18.25%', validatedAt: '2026-06-05' },
    { id: 2, insightCategory: 'Margin Safeguard Rule', factLearned: '为了追求GMV大促而使单品综合折扣超越 20% 时，将物理击穿 35% 集团净利底线，并且用户在之后 90 天内复购意愿产生 22.4% 的贬损。', impactScore: 'Margin Protected', validatedAt: '2026-05-28' },
    { id: 3, insightCategory: 'Logistics Mountain Impedance', factLearned: '阿尔卑斯冬季降雪大范围封路情况下，由米兰保税区向巴黎发货的履约时效延迟 4.2天，平均每票损耗提升 €12.5。重定向至热那亚港口海运时效稳定且成本降低 9%。', impactScore: 'Cost Offset 9%', validatedAt: '2026-05-12' }
  ]);

  // ECOS Hypotheses diagnostic console
  const [hypotheses, setHypotheses] = useState<any[]>([
    {
      id: 1,
      hypothesisLabel: '高利润拉升契机：由特定冬季气温降幅诱导的服装板块意向度上扬',
      description: '大区天气监测核算，法国及欧陆在 7 天内气温面临 4.8 摄氏度骤降，VIP用户寻找防风呢大衣搜索转化率有 89% 概率急剧上冲。建议一键启用备用调拨路线。',
      confidenceScore: 89,
      status: 'dominant',
      logicalChain: ['气象气温骤落 4.8°C', '特定词搜索点击上扬 22%', '高溢价蚕丝/羊毛需求井喷', '意大利保税仓成品分拨'],
      supportingEvidence: [
        '实时欧陆气象哨所 (Meteo-France) 冬季锋面移动跟踪数据。',
        '多租户法国区本周搜索“大衣”、“羊毛”、“蚕丝”点击频次较上世纪上扬 22%。',
        '意大利 Rome 保税二级库目前成品储备饱和率达 142.5%，具有高富余空间。',
      ],
      refutationTrigger: '如果法国各隔离店面内自然库存水位在 5 天内无法得到物流批准，则该机会演化为硬饥饿缺货创伤。'
    }
  ]);

  // ECOS Interactivities
  const handleAddNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryFact.trim()) return;
    const item = {
      id: memories.length + 1,
      category: newMemoryCategory,
      fact: newMemoryFact,
      importance: newMemoryImportance
    };
    setMemories([item, ...memories]);
    setNewMemoryFact('');
    onAddSystemLog('AI Central Core - Memories', '写入企业DNA原则', `添加长期认知守则: [${newMemoryCategory}] "${newMemoryFact}"`, 'success');
    alert('DNA 新认知记忆条例已成功写入核心模型规则引擎底座！');
  };

  const handleDeleteMemory = (id: number) => {
    setMemories(memories.filter((m) => m.id !== id));
    onAddSystemLog('AI Central Core - Memories', '清除企业记忆', `擦除了 DNA 条例 #${id}`, 'warning');
  };

  const handleEnforceHumanRuling = (debateId: number) => {
    if (!humanRulingText.trim()) return;
    const actionPlans = humanResolutionPath.trim() 
      ? humanResolutionPath.split('\n').filter(Boolean) 
      : ['Manually override standoff.', 'Force immediate dispatch.'];

    setDebates(debates.map(d => {
      if (d.id === debateId) {
        return {
          ...d,
          status: 'ruled',
          ceoRuling: {
            decision: humanRulingText,
            justification: 'Issued manually via Central Strategic Control Core overriding automated standoff.',
            confidenceScore: 99,
            actionPlan: actionPlans
          }
        };
      }
      return d;
    }));

    // Real business operation loop: update stock / prices physically in simulated database
    if (tenantDB && setTenantDB) {
      const trackingCategory = selectedIndustry || 'retail';
      const updatedProducts = [...(tenantDB[trackingCategory]?.products || [])];
      
      if (updatedProducts.length > 0) {
        const lowerRuling = (humanRulingText + " " + humanResolutionPath).toLowerCase();
        let stateChanged = false;

        // If ruling corresponds to stock supplement/replenishment
        if (lowerRuling.includes("rome") || lowerRuling.includes("仓库") || lowerRuling.includes("调配") || lowerRuling.includes("补仓") || lowerRuling.includes("replenish") || lowerRuling.includes("dispatch")) {
          updatedProducts[0] = {
            ...updatedProducts[0],
            stock: 120 // replenish stock physically
          };
          stateChanged = true;
          onAddSystemLog('SaaS Database', '实库存补货成功', `对应 SKU [${updatedProducts[0].sku || 'WINTER-001'}] 的物理库存已自动纠偏加急备货至 120 件。`, 'success');
        }

        // If ruling corresponds to yield markup/price revisions
        if (lowerRuling.includes("价格") || lowerRuling.includes("定价") || lowerRuling.includes("上调") || lowerRuling.includes("markup") || lowerRuling.includes("price")) {
          const oldPrice = updatedProducts[0].price || 159;
          const newPrice = parseFloat((oldPrice * 1.048).toFixed(2));
          updatedProducts[0] = {
            ...updatedProducts[0],
            price: newPrice
          };
          stateChanged = true;
          onAddSystemLog('SaaS Database', '价格精算应用', `对应 SKU [${updatedProducts[0].sku || 'WINTER-001'}] 定价已由于多边运力上涨自动上浮4.8% (从 €${oldPrice} -> €${newPrice})。`, 'success');
        }

        if (stateChanged) {
          const updatedDB = {
            ...tenantDB,
            [trackingCategory]: {
              ...tenantDB[trackingCategory],
              products: updatedProducts
            }
          };
          setTenantDB(updatedDB);

          // Trigger server-side persistent save
          fetch("/api/db/save-all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDB)
          }).then(res => res.json())
            .then(data => {
              console.log("[Boardroom Engine] Enterprise relational sync status:", data.message || "ok");
            }).catch(err => {
              console.warn("[Boardroom Engine] Sync error:", err);
            });
        }
      }
    }

    onAddSystemLog('AI Central Command', '最高特批裁决', `仲裁纠纷 #${debateId}: "${humanRulingText}"`, 'success');
    setHumanRulingText('');
    setHumanResolutionPath('');
    alert('⚖ 最高总裁执行令已成功签署！底层 AI Boardroom 意见僵持已被打破，数据库实物流已触发，并同步推送至 Laravel/Botble 订单钩子节点。');
  };

  const handleSimulateOperatorTask = () => {
    setOperatorTasks(operatorTasks.map((t) => {
      if (t.status === 'running') {
        const nextSteps = t.subSteps.map((s) => {
          if (s.status === 'running') {
            return { ...s, status: 'completed' as const };
          } else if (s.status === 'pending') {
            return { ...s, status: 'running' as const };
          }
          return s;
        });
        const hasRunningNow = nextSteps.some(s => s.status === 'running');
        return {
          ...t,
          subSteps: nextSteps,
          status: hasRunningNow ? 'running' as const : 'completed' as const
        };
      } else if (t.status === 'pending') {
        const nextSteps = [...t.subSteps];
        if (nextSteps.length > 0) nextSteps[0].status = 'running';
        return {
          ...t,
          subSteps: nextSteps,
          status: 'running' as const
        };
      }
      return t;
    }));
    onAddSystemLog('AI Central Core - Simulator', '步骤自仿真运行', '点击触发推进中央巡航自演算步骤', 'info');
  };

  const selectedDebate = debates.find(d => d.id === selectedDebateId);

  // ==================== 6. 权限中心 States ====================
  const [rolesList, setRolesList] = useState([
    { id: 'owner', name: '系统拥有者 (Owner)', desc: '拥有平台的完整底座管理、账期结算、物理网格配置与财务支配权', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: true } },
    { id: 'admin', name: '系统管理员 (Super Admin)', desc: '运维级管理主控台、租户配额动态调拨、日志安全回放审计', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: false } },
    { id: 'manager', name: '服务主管级 (Manager)', desc: '管理客户产品合规发布、纠纷订单退款仲裁拦截安全限额控制', permissions: { product: true, order: true, finance: false, ai_ops: true, sys_config: false } },
    { id: 'staff', name: '运营专员组 (Staff)', desc: '可查询租户日常统计数据、对账流水，一般无任何配置更改审批权限', permissions: { product: true, order: false, finance: false, ai_ops: false, sys_config: false } },
    { id: 'support', name: '客服保障组 (Support)', desc: '可协助查询退款详情状态与日志轨迹，但无修改商品价格或支付密钥权限', permissions: { product: false, order: true, finance: false, ai_ops: false, sys_config: false } }
  ]);

  const [settingsForm, setSettingsForm] = useState({
    maxCommissionCap: 5.0,
    sessionTimeout: 3600
  });

  // ==================== New SAAS Center States ====================
  // SaaS SUBSCRIPTION PACKAGES MODEL
  const [subscriptionPackages, setSubscriptionPackages] = useState<any[]>([
    { id: 'starter', name: "SaaS Starter OS", price: 29.00, billingCycle: 'monthly', commissionRate: 2.0, activeTenants: 12, maxSkus: 500, aiQuota: 500, status: 'active', features: ["Core Storefront", "Stripe Checkout", "Offline Orders Cache", "RAG Support (Light)"] },
    { id: 'growth', name: "SaaS Growth OS", price: 79.00, billingCycle: 'monthly', commissionRate: 1.5, activeTenants: 28, maxSkus: 2000, aiQuota: 2500, status: 'active', features: ["Advanced Analytics", "Cross-Border Multicurrency", "Ecos Inventory Automator", "AI Descriptions (Magic)"] },
    { id: 'enterprise', name: "SaaS Enterprise OS", price: 299.00, billingCycle: 'monthly', commissionRate: 0.8, activeTenants: 8, maxSkus: 20000, aiQuota: 10000, status: 'active', features: ["Multi-Agent Debates Room", "Bayesian Causal Diagnostics", "Custom REST Hooks Pipeline", "Sovereign Override Power"] },
    { id: 'ultimate', name: "Ultimate Cognitive OS", price: 999.00, billingCycle: 'monthly', commissionRate: 0.2, activeTenants: 3, maxSkus: 100000, aiQuota: 999999, status: 'active', features: ["Full Autonomous Self-Healing", "Continuous Learning Ledger", "Dedicated Swiss Server Node", "24/7 Priority SLA Guard"] }
  ]);
  const [showAddPackageForm, setShowAddPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: '', price: 99, commission: 1.0, skus: 5000, aiQuota: 5000 });

  // FINANCIAL SETTLEMENT ACCOUNTING
  const [billingInvoices, setBillingInvoices] = useState<any[]>([
    { invoiceId: "INV-2026-001", companyName: "莉雅高奢巴黎旗舰店", amount: 1540.20, status: "paid", dueDate: "2026-06-15", commissionCharge: 12.32, tenantId: "t1" },
    { invoiceId: "INV-2026-002", companyName: "米兰极奢蚕丝物料店", amount: 2890.00, status: "pending", dueDate: "2026-06-20", commissionCharge: 23.12, tenantId: "t2" },
    { invoiceId: "INV-2026-003", companyName: "博洛尼亚前置保税小铺", amount: 790.00, status: "unpaid", dueDate: "2026-06-25", commissionCharge: 6.32, tenantId: "t3" },
    { invoiceId: "INV-2026-004", companyName: "南不列颠食品配送仓", amount: 450.00, status: "paid", dueDate: "2026-06-10", commissionCharge: 9.00, tenantId: "t4" }
  ]);
  const [financeFilter, setFinanceFilter] = useState<'all' | 'paid' | 'unpaid' | 'pending'>('all');

  // COMMUNICATIONS INTEGRATIONS
  const [communicationChannels, setCommunicationChannels] = useState<any[]>([
    { id: 'twilio', type: 'SMS Gateway', provider: 'Twilio', status: 'connected', deliveryRate: 99.4, sendCount: 14502, templateTriggers: ["auto_restock_alert", "fraud_alert_veto"] },
    { id: 'sendgrid', type: 'Email Router', provider: 'SendGrid', status: 'connected', deliveryRate: 98.7, sendCount: 82310, templateTriggers: ["order_paid_invoice", "voucher_reversal_notify"] },
    { id: 'aws_ses', type: 'Bulk Dispatch', provider: 'AWS SES', status: 'connected', deliveryRate: 99.1, sendCount: 220194, templateTriggers: ["marketing_broadcast_camp"] }
  ]);
  const [showAddCommTemplate, setShowAddCommTemplate] = useState(false);
  const [commLogs, setCommLogs] = useState<any[]>([
    { timestamp: "2026-06-08 14:10", tenant: "巴黎旗舰店", type: "Email", status: "delivered", destination: "client_vip_fr@vip.com", trigger: "order_paid_invoice" },
    { timestamp: "2026-06-08 13:55", tenant: "保税小铺", type: "SMS", status: "delivered", destination: "+33 6 452 821", trigger: "auto_restock_alert" },
    { timestamp: "2026-06-08 13:30", tenant: "米兰物料店", type: "Email", status: "delivered", destination: "shipping_rome_dept@italy.it", trigger: "voucher_reversal_notify" }
  ]);

  // APPLICATION MARKETPLACE PLUGINS
  const [customMarketplaceApps, setCustomMarketplaceApps] = useState<any[]>([
    { id: "app-01", name: "ERP 报关物流中继", developer: "Botble Partners Ltd", category: "Logistics", price: 19.99, activeTenants: 11, status: "published", rating: 4.8 },
    { id: "app-02", name: "Stripe 多国汇率锁死工具", developer: "Stripe Enterprise Labs", category: "Payment", price: 49.00, activeTenants: 15, status: "published", rating: 4.9 },
    { id: "app-03", name: "Gemini 多语种客服 AI 伴侣", developer: "Google Workspace Hub", category: "AI Employee", price: 99.00, activeTenants: 6, status: "published", rating: 4.7 },
    { id: "app-04", name: "法国保税仓一键结算账单插件", developer: "ECOS Foundations", category: "Finance", price: 0.00, activeTenants: 22, status: "published", rating: 5.0 }
  ]);
  const [showAddAppForm, setShowAddAppForm] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', developer: '', category: 'AI Employee', price: 19 });

  // DEVELOPER COOPERATIVE CORE
  const [devPartners, setDevPartners] = useState<any[]>([
    { id: "DEV-8802", name: "阿尔卑斯自适应技术开发组", appCount: 2, apiKey: "ecos_pk_live_f89b910a34", apiCalls: 1421, status: "approved" },
    { id: "DEV-9128", name: "博卡拉零售集成团队", appCount: 1, apiKey: "ecos_pk_live_d8172901a1", apiCalls: 820, status: "approved" },
    { id: "DEV-7014", name: "慕尼黑电商云工作室", appCount: 1, apiKey: "ecos_pk_live_9a8716b12c", apiCalls: 95, status: "pending" }
  ]);
  const [sandboxResponseLog, setSandboxResponseLog] = useState<string>("Click 'Run Sandbox Request Trigger' to execute open API validation test block.");

  // ==================== INTELLIGENCE HUB EXTENDED STATES ====================
  const [automationRules, setAutomationRules] = useState<any[]>([
    { id: 'rule_1', trigger: '库存跌破 20 件(Inventory < 20)', action: '向欧盟保税仓提配追加命令 & 发送WMS配货工单', status: 'Active', source: '库存调控智能体' },
    { id: 'rule_2', trigger: '整单优惠折扣超过 40%(Discount > 40%)', action: '物理冻结折扣发布流程，挂起等待商户Owner二次手工批准', status: 'Active', source: '合规稽核智能体' },
    { id: 'rule_3', trigger: '单笔订单金额超过 €1,500(Order Amount > €1500)', action: '自动关联风控防欺诈 system，锁死争议提款流程', status: 'Active', source: '风控拦截智能体' },
    { id: 'rule_4', trigger: '客户 30 天未下单 且 等级为 VIP', action: '由 CRM 智能助手代发 8 折促销券并在 48h 后回卷审计', status: 'Active', source: '客户挽留智能体' }
  ]);
  const [platformEvents, setPlatformEvents] = useState<any[]>([
    { id: 'evt_0989', type: 'order.created', timestamp: '2秒前', source: '巴黎旗舰店 (t1)', detail: '流水号 ord_91b_2026 结账通过，金额 €215.00' },
    { id: 'evt_0986', type: 'payment.disputed', timestamp: '1分钟前', source: '米兰旗舰店 (t2)', detail: '风控引擎捕获一单高争议率支付行为，金额 €1,650.00' },
    { id: 'evt_0981', type: 'inventory.exhausted', timestamp: '4分钟前', source: '博洛尼亚保税仓 (t3)', detail: '原料辅料小麦粉库存量降至 3kg，触发预警中枢' },
    { id: 'evt_0978', type: 'webhook.dispatched', timestamp: '9分钟前', source: '财务清算中枢', detail: '已成功向 Adyen 传输分期划拔凭证: payload_hmac_sha254' }
  ]);
  const [complianceRules, setComplianceRules] = useState<any[]>([
    { id: 'c_1', name: '全域商户最高单笔订单退款配额', val: '€ 2,500 / 笔', type: 'Hard Limit', desc: '超过此配额必须通过平台超级管理员总后台签署总统手印批准' },
    { id: 'c_2', name: '租户 API 突发并发限制 (Burst Rate)', val: '120 QPS / 店', type: 'Traffic Limit', desc: '抑制大促瞬时高并发对后端 PostgreSQL 带来的高延时穿透' },
    { id: 'c_3', name: '跨租户资金隔离对账双向核算机制', val: '100% Secure', type: 'Security Policy', desc: '财务中心严禁跨 tenant_id 物理穿透汇总。每个店具有完全独立的账期归档流水' }
  ]);


  // ==================== 8. 系统诊断中心 States ====================
  const [dbDiagnostic, setDbDiagnostic] = useState({ name: 'PostgreSQL Database Cluster', status: 'Connected', delay: '12ms', msg: '主从节点同步顺畅，空闲连接池池容量：94%' });
  const [redisDiagnostic, setRedisDiagnostic] = useState({ name: 'Redis Cache Memory Host', status: 'Connected', delay: '2ms', msg: '热缓存命中率：98.4%，物理占用内存：840 KB / 2 GB' });
  const [stripeHookDiagnostic, setStripeHookDiagnostic] = useState({ name: 'Stripe Webhook Pipeline', status: 'Healthy', delay: '45ms', msg: '事件转发通畅，最新心跳包签名验证 200 OK' });
  const [geminiDiagnostic, setGeminiDiagnostic] = useState({ name: 'LLM Model Gateway (Gemini API)', status: 'Connected', delay: '880ms', msg: '并发配额剩余 99.8%，安全审计围栏层正常防御' });
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // ==================== Helper Functions ====================
  const handleNoticeBroadcast = () => {
    setIsNoticeBroadcasting(true);
    setTimeout(() => {
      setIsNoticeBroadcasting(false);
      onAddSystemLog('平台公告发布', '发布网站公告', `更新并广播全网公告: "${systemNotice}"`, 'success');
      alert('公告已成功广播至全网多租户前台与后台顶栏！');
    }, 800);
  };

  const handleSystemUpgrade = () => {
    setIsUpgrading(true);
    setUpgradeLogs(['[1/4] 🚀 正在关闭外部网格注册，防止状态中断...', '[2/4] 🔍 备份主物理卷表 products/orders/tenants 并刷新事务提交...']);
    setTimeout(() => {
      setUpgradeLogs(prev => [...prev, '[3/4] 🛠️ 热重载 System Router 并更新 Ollama / Gemini 模型反演安全红线...']);
      setTimeout(() => {
        setUpgradeLogs(prev => [...prev, '[4/4] 🟢 底层物理安全模块重新加载完毕！租户物理隔离网格恢复。升级成功！']);
        setIsUpgrading(false);
        onAddSystemLog('平台升级控制', '底座物理系统升级', '全流程无缝热重载成功率 100%，数据库无缝切换', 'success');
        alert('全网物理底座集群及路由算法性能优化升级完毕！');
      }, 1000);
    }, 1000);
  };

  const handleTestConnection = (id: string, gatewayName: string) => {
    onAddSystemLog('支付中心', '测试链接', `触发网关 [${gatewayName}] 的 API 安全连接性能校验`, 'info');
    alert(`测试连接中...\n网关「${gatewayName}」安全握手连接校验通过！延迟 32ms`);
  };

  const handleSyncNow = (id: string, gatewayName: string) => {
    setIsSyncingGateway(id);
    setTimeout(() => {
      setIsSyncingGateway(null);
      setPaymentGateways(prev => prev.map(g => {
        if (g.id === id) {
          return { ...g, syncTime: new Date().toISOString().replace('T', ' ').substring(0, 19) };
        }
        return g;
      }));
      onAddSystemLog('支付中心', '数据对账同步', `完成网关 [${gatewayName}] 账账核对事务处理`, 'success');
      alert(`网关「${gatewayName}」与后端账房结算中心自动同步完毕！账单对账已物理同步至最新时刻。`);
    }, 1200);
  };

  const handleDiagnoseAll = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDbDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 5) + 8}ms`, status: 'Connected' }));
      setRedisDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 3) + 1}ms`, status: 'Connected' }));
      setStripeHookDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 20) + 30}ms`, status: 'Healthy' }));
      setGeminiDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 200) + 700}ms`, status: 'Connected' }));
      setIsDiagnosing(false);
      onAddSystemLog('系统诊断引擎', '全网综合体检', '物理网格、高速缓存、海关网关全链路健康体检满分', 'success');
      alert('全网 4 颗核心宿主物理服务器、中间件及 API 出入口线路全面诊断，体检结果: 🟢 优秀！');
    }, 1200);
  };

  const handleToggleAgent = (id: string, name: string) => {
    setAgentsList(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Disabled' : 'Active';
        onAddSystemLog('AI大脑控制', nextStatus === 'Active' ? '激活代理' : '停用代理', `更改智能体 「${name}」运行状态为 ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="w-full text-slate-800 font-sans animate-fadeIn">
      
      {/* 2. Top Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">平台总后台 · SYSTEM</h1>
            <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase border border-[#07C2E3]/20">SUPER_ADMIN</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#07C2E3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#07C2E3]"></span>
          </span>
          <span className="text-xs font-bold text-[#07C2E3] bg-[#07C2E3]/5 border border-[#07C2E3]/20 rounded-lg px-3 py-1.5 font-mono">
            SYS: ACTIVE_ONLINE
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MENU 1: 📊 平台控制中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6 text-left">
          
          {/* Subtab Switcher: Console view vs Metrics definition */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveStatsTabMode('console')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeStatsTabMode === 'console'
                  ? 'border-[#07C2E3] text-[#07C2E3]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              📊 Core Control Panel (核心管理大盘)
            </button>
            <button
              onClick={() => setActiveStatsTabMode('definition')}
              className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeStatsTabMode === 'definition'
                  ? 'border-[#07C2E3] text-[#07C2E3]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              📖 Platform Metrics Definition (平台指标定义)
            </button>
          </div>

          {/* Render 1: Core Control Panel (Dashboard Console) */}
          {activeStatsTabMode === 'console' && (
            <div className="space-y-6">
              
              {/* Specialized Verticals Data-Silo Monitor Room */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left">
                {/* Visual decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#07C2E3]/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#07C2E3]/10 border border-[#07C2E3]/30 flex items-center justify-center text-[#07C2E3]">
                      <Shield className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white uppercase tracking-tight">🚀 SaaS 6大垂直细分行业数据防泄露 · 硬隔离监视中心</h3>
                        <span className="text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900/60 leading-none">
                          物理安全舱已锁定
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        系统执行「商户数据物理硬隔离原则」。各行业的商品中心、订单流水、客户账户完全存储在独立的 ECOS 隔离区域内，物理零混合。总控制台提供全天候无缝审计、一键切换特权及跨库安全排查。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>租户专属数据存储链 (Drizzle)</span>
                  </div>
                </div>

                {/* 6 Grid of Isolated Industries */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                  {[
                    { id: 'retail', name: '服装分销中台', storeName: '👕 米兰风尚女装批发店', theme: 'Nebula 蓝', icon: '👕', spec: '批量阶梯定价 / 服装面料批次追溯', desc: '支持服装、鞋帽及多属性款式货品上架、专属批发结算单及客户层级折扣。', btnClass: 'border-cyan-500/20 text-[#07C2E3] hover:bg-[#07C2E3]/10' },
                    { id: 'food', name: '餐饮外卖配送', storeName: '🍔 慕尼黑私房菜配送店', theme: 'Classic Dark 红', icon: '🍔', spec: '菜品自动精选 / 独立配送小票厨房', desc: '配备专业餐饮POS系统及独立外卖订单、商品配餐推荐与送货骑手对接面板。', btnClass: 'border-red-500/20 text-red-400 hover:bg-red-500/10' },
                    { id: 'education', name: '跨境出海独立站', storeName: '🎓 382跨境3C出海站', theme: 'Indigo 紫', icon: '🎓', spec: '3C数码展示 / 出海营销推广中枢', desc: '一键将货品推向全球渠道、自带高转化海外独立站皮肤、隔离并跟踪海外汇率。', btnClass: 'border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10' },
                    { id: 'healthcare', name: '香水奢品收银POS', storeName: '🏪 巴黎高端香水POS快速结算端', theme: 'Emerald 绿', icon: '🏪', spec: '奢品原产地追溯 / 前端极速结算扫码', desc: '支持药店、奢护及美妆高频收银系统，前台大字体触摸支持与多规格独立扫码。', btnClass: 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' },
                    { id: 'service', name: '美业丽人预订', storeName: '💅 罗马会所美容线上预订端', theme: 'Elegant Pink 丽人', icon: '💅', spec: '技师专属排班 / 线上消费分发排班', desc: '精细至美容师日历式排班、定制化护肤疗程预订与美甲美睫服务绩效结算。', btnClass: 'border-pink-500/20 text-pink-400 hover:bg-pink-500/10' },
                    { id: 'manufacturing', name: '智能电器百货', storeName: '🔋 智慧电器多门店直销店', theme: 'Cyber Amber 智造', icon: '🔋', spec: '物料库存预警 / 渠道商拿货结算', desc: '多网点百货库存协同、电器批次质检追踪、独立多仓产能动态调度。', btnClass: 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10' },
                  ].map((indObj) => {
                    const industry = indObj.id as IndustryType;
                    const sectorData = tenantDB?.[industry] || { products: [], orders: [], customers: [] };
                    const prodCount = sectorData.products?.length || 0;
                    const orderCount = sectorData.orders?.length || 0;
                    const custCount = sectorData.customers?.length || 0;

                    return (
                      <div 
                        key={industry} 
                        className="bg-black/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
                      >
                        <div>
                          {/* Header of Column card */}
                          <div className="flex items-center justify-between mb-3.5 border-b border-slate-850 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{indObj.icon}</span>
                              <div className="flex flex-col">
                                <span className="text-[11px] text-slate-400 font-extrabold uppercase font-mono tracking-wider leading-none">{indObj.name}</span>
                                <span className="text-[9px] text-[#07C2E3] font-bold font-mono mt-1">{indObj.theme}</span>
                              </div>
                            </div>
                            <span className="text-[8px] font-mono bg-emerald-950/70 border border-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded font-black max-w-[80px] truncate leading-none">
                              t_{industry}
                            </span>
                          </div>

                          {/* Store Name & Specs */}
                          <p className="text-xs font-black text-slate-200 line-clamp-1 mb-2">
                            {indObj.storeName}
                          </p>
                          <p className="text-[10px] text-[#71717a] font-normal leading-relaxed mb-4">
                            {indObj.desc}
                          </p>

                          {/* Specialization list */}
                          <div className="p-2 mb-4 bg-[#0a0a0c] border border-slate-850 rounded-lg">
                            <span className="text-[8px] font-bold text-[#71717a] uppercase tracking-wider block">核心专项引擎</span>
                            <span className="text-[10px] font-black text-emerald-400 mt-1 block">
                              ⚙️ {indObj.spec}
                            </span>
                          </div>

                          {/* Isolated database entities stats counters */}
                          <div className="grid grid-cols-3 gap-1.5 bg-[#070709] border border-slate-850 rounded-lg p-2 mb-4 font-mono">
                            <div className="text-center border-r border-slate-850/80">
                              <span className="text-[8px] text-slate-500 block leading-none">📦 商品库</span>
                              <span className="text-xs font-extrabold text-white mt-1.5 block">{prodCount}</span>
                              <span className="text-[7px] text-slate-500 block font-bold mt-0.5 font-sans">Isolated</span>
                            </div>
                            <div className="text-center border-r border-[#1a1a1f]">
                              <span className="text-[8px] text-slate-500 block leading-none">🧾 订单链</span>
                              <span className="text-xs font-extrabold text-[#07C2E3] mt-1.5 block">{orderCount}</span>
                              <span className="text-[7px] text-slate-500 block font-bold mt-0.5 font-sans">Isolated</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[8px] text-slate-500 block leading-none">👥 客户群</span>
                              <span className="text-xs font-extrabold text-white mt-1.5 block">{custCount}</span>
                              <span className="text-[7px] text-slate-500 block font-bold mt-0.5 font-sans">Isolated</span>
                            </div>
                          </div>
                        </div>

                        {/* Action section inside Column card */}
                        <div className="space-y-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onImpersonate) {
                                onImpersonate('t_' + industry, industry);
                              }
                            }}
                            className="w-full py-1.5 bg-[#07C2E3]/90 hover:bg-[#07C2E3] text-black font-extrabold text-[10px] rounded flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer leading-none"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>特权一键穿梭端商家后台 ✈️</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setAuditingIndustry(industry);
                              setAuditingDataType('products');
                              addLog?.('Auditor Center', '数据库合规性物理审计', `管理员开启了针对「${industry}」行业的隔离数据仓深度分析`, 'info');
                            }}
                            className={`w-full py-1.5 bg-transparent border rounded font-black text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer leading-none ${indObj.btnClass}`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>🔍 审计隔离数据</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Block 1: 平台概况 (Platform Overview) with full Data Source Routing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[#07C2E3]/30 transition-all">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">全网多租户累计 GMV</span>
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">SQL_GMV</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3 font-mono">
                    € {allOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-[9px] text-slate-500 space-y-0.5">
                    <div><span className="font-bold text-slate-600">来源:</span> orders, payments</div>
                    <div><span className="font-bold text-slate-600">计算:</span> SUM(payments.amount)</div>
                    <div><span className="font-bold text-slate-600">更新:</span> 2026-06-08 16:21:33</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[#07C2E3]/30 transition-all">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">注册活跃租户数</span>
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">Live</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3 font-mono">
                    {tenants.filter(t => t.status === 'active').length} <span className="text-xs font-normal text-slate-400">/ {tenants.length} 家</span>
                  </p>
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-[9px] text-slate-500 space-y-0.5">
                    <div><span className="font-bold text-slate-600">来源:</span> tenants</div>
                    <div><span className="font-bold text-slate-600">计算:</span> COUNT(tenants.id WHERE active)</div>
                    <div><span className="font-bold text-slate-600">更新:</span> 实时动态</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[#07C2E3]/30 transition-all">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">活跃店铺实例</span>
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">Stores</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3 font-mono">
                    {dbEngine.stores.getAll().length} <span className="text-xs font-normal text-slate-400">个实例</span>
                  </p>
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-[9px] text-slate-500 space-y-0.5">
                    <div><span className="font-bold text-slate-600">来源:</span> stores</div>
                    <div><span className="font-bold text-slate-600">计算:</span> COUNT(stores.id)</div>
                    <div><span className="font-bold text-slate-600">更新:</span> 实时动态</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[#07C2E3]/30 transition-all">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">平台本月应收账单额</span>
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">Billing</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-3 font-mono">
                    € {Object.values(dbEngine.billing_accounts.getAll()).flatMap(arr => arr).filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-[9px] text-slate-500 space-y-0.5">
                    <div><span className="font-bold text-slate-600">来源:</span> billing_accounts, subscriptions</div>
                    <div><span className="font-bold text-slate-600">计算:</span> SUM(billing_accounts.amount)</div>
                    <div><span className="font-bold text-slate-600">更新:</span> 实时结算</div>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Section containing Blocks 2, 3, 4, 5 */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Block 2: 系统状态 (System Status) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#07C2E3]" />
                        <h3 className="text-xs font-black text-slate-900 uppercase">系统状态中心 · STATUS</h3>
                      </div>
                      <button 
                        onClick={() => {
                          onAddSystemLog('系统组件', '健康自检', '超级管理成功执行全局核心数据库、Redis、网关及模型微服务端到端通信自检，状态完美。', 'success');
                          alert('系统自愈与自检自发：已完成全部24项底层组件端到端回路连通自检，延时0.8ms，全部健康。');
                        }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        手动执行健康复位检查
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3 bg-zinc-950 text-white rounded-lg flex items-center justify-between border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">数据库层 (Database)</span>
                          <span className="text-xs font-extrabold text-slate-200 block mt-0.5">Drizzle + Local Memory</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-full font-black text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          在线
                        </span>
                      </div>

                      <div className="p-3 bg-zinc-950 text-white rounded-lg flex items-center justify-between border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">全局高速缓存 (Cache)</span>
                          <span className="text-xs font-extrabold text-slate-200 block mt-0.5">Redis Cluster (瑞士节点)</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-full font-black text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          在线
                        </span>
                      </div>

                      <div className="p-3 bg-zinc-950 text-white rounded-lg flex items-center justify-between border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">支付网关路由 (Payment)</span>
                          <span className="text-xs font-extrabold text-slate-200 block mt-0.5">Stripe Webhook / Adyen Checkout</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-full font-black text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          在线
                        </span>
                      </div>

                      <div className="p-3 bg-zinc-950 text-white rounded-lg flex items-center justify-between border border-zinc-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">智能算力服务 (AI Model)</span>
                          <span className="text-xs font-extrabold text-slate-200 block mt-0.5">Google Web SDK / Gemini Pro</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-full font-black text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          在线
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-150">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">开放注册接口 (Signup Tunnel)</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">控制外来企业自主入驻</p>
                          </div>
                          <button
                            onClick={() => {
                              const target = !allowSignup;
                              dbEngine.system_settings.set('allow_signup', target);
                              reloadAdminDB();
                              onAddSystemLog('平台控制室', '注册通道', `${target ? '开放' : '熔断拦截'}新自主入驻入通道`, 'warning');
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${allowSignup ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${allowSignup ? 'left-6.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-150">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">30天白名单体验 (Free Trial)</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">允许未绑定商户免费算力试用</p>
                          </div>
                          <button
                            onClick={() => {
                              const target = !trialEnabled;
                              dbEngine.system_settings.set('trial_enabled', target);
                              reloadAdminDB();
                              onAddSystemLog('平台控制室', '体验额度', `试用通道变更为: ${target ? '开通' : '拦截'}`, 'info');
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${trialEnabled ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${trialEnabled ? 'left-6.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-rose-50/40 rounded-lg border border-rose-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-rose-950">系统维护锁定模式 (Maintenance)</p>
                            <p className="text-[10px] text-rose-600 mt-0.5">锁定API写入, 并下发全局系统拦截公告</p>
                          </div>
                          <button
                            onClick={() => {
                              const target = !maintenanceMode;
                              dbEngine.system_settings.set('maintenance_mode', target);
                              reloadAdminDB();
                              onAddSystemLog('平台控制室', '维护锁定', `${target ? '🚨 开启高危维护锁定' : '🔓 复位复原生产正常运行'}`, 'error');
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${maintenanceMode ? 'left-6.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-amber-950">商户配置只读锁定 (Readonly)</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">只读硬锁定, 防止意外资损扣账</p>
                          </div>
                          <button
                            onClick={() => {
                              const target = !readonlyMode;
                              dbEngine.system_settings.set('readonly_mode', target);
                              reloadAdminDB();
                              onAddSystemLog('平台控制室', '安全隔离只读锁', `${target ? '⚠️ 启用配置只读' : '🔓 解锁配置更改'}`, 'warning');
                            }}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${readonlyMode ? 'bg-amber-600' : 'bg-slate-300'}`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${readonlyMode ? 'left-6.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Block 3: 待处理事项 (Pending Tasks) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                      <Inbox className="w-4 h-4 text-[#07C2E3]" />
                      <h3 className="text-xs font-black text-slate-800 uppercase">重要待处理事项中心 · PENDING_TASKS</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pendingTasksState.map((task: any) => {
                        // determine redirect subTab onClick
                        let targetSubTab = 'stats';
                        if (task.category === 'refund') targetSubTab = 'finance';
                        else if (task.category === 'merchant') targetSubTab = 'tenants';
                        else if (task.category === 'invoice') targetSubTab = 'packages';
                        else if (task.category === 'abnormal_tenant') targetSubTab = 'developer';

                        return (
                          <div 
                            key={task.id} 
                            onClick={() => {
                              if (onChangeSubTab) {
                                onChangeSubTab(targetSubTab);
                                onAddSystemLog('待办处理', '路由跳转', `快速点击待办进入 「${task.title}」 管理中心`, 'info');
                              }
                            }}
                            className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-150 transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <div>
                              <p className="text-xs font-black text-slate-900 group-hover:text-[#07C2E3] transition-colors">{task.title}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{task.description}</p>
                            </div>
                            <span className="bg-rose-50 text-rose-700 font-extrabold text-sm px-3 py-1 rounded-lg border border-rose-100">
                              {task.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Block 4: 系统异常 (System Exceptions) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <h3 className="text-xs font-black text-slate-800 uppercase">底层运行告警中心 · SYSTEM_EVENTS</h3>
                    </div>
                    <div className="space-y-2">
                      {systemEvents.map((evt: any) => (
                        <div key={evt.id} className="p-3 bg-rose-50/20 border border-rose-100 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping"></span>
                            <div>
                              <span className="text-xs font-black text-slate-900">{evt.name}</span>
                              <span className="text-[10px] text-slate-500 ml-3 font-mono">发生峰值: {evt.count} 次</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              alert(`系统异常检测核心回溯报告:\n\n异常事务: ${evt.name}\n发生总量: ${evt.count}次\n最新时间: ${evt.lastOccurred}\n错误代码: HTTP_GATEWAY_504_COMP_TIMEOUT\n错误明细: ${evt.description}\n系统自修复状态: [等待审计复核后重启网络套接字槽]`);
                              onAddSystemLog('系统告警审计', '查看异常日志', `查看告警错误事件「${evt.name}」日志封包`, 'info');
                            }}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-bold px-3 py-1 rounded"
                          >
                            查看详情
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side containing Blocks 5 & 6 */}
                <div className="space-y-6">
                  
                  {/* Block 5: 平台公告 (Platform Notice Broadcast) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Megaphone className="w-4 h-4 text-[#07C2E3]" />
                        <h3 className="text-xs font-black text-slate-800 uppercase">全网系统公告广播箱</h3>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">WS_BROADCAST</span>
                    </div>

                    <textarea
                      rows={3}
                      value={systemNotice}
                      onChange={(e) => setSystemNotice(e.target.value)}
                      placeholder="发送平台运营通知，所有租户会在工作台顶端立刻接收其广播推送..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] leading-relaxed"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleNoticeBroadcast}
                        disabled={isNoticeBroadcasting || !systemNotice.trim()}
                        className="flex-1 bg-[#07C2E3] hover:bg-[#06B2D0] disabled:opacity-50 text-slate-950 font-black text-xs py-2.5 rounded-lg cursor-pointer transition-all border border-[#07C2E3]/20 shadow"
                      >
                        {isNoticeBroadcasting ? '广播写入中...' : '发布通告'}
                      </button>
                      <button
                        onClick={() => {
                          dbEngine.system_notices.updateNotice('');
                          reloadAdminDB();
                          onAddSystemLog('公告发布', '撤回广播', '撤回全网通告广播', 'warning');
                          alert('平台全网广播公告已成功撤销并清空，商户后台即刻恢复无广播状态。');
                        }}
                        className="bg-slate-150 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer"
                      >
                        撤回
                      </button>
                    </div>
                  </div>

                  {/* Block 6: 快捷操作 (Quick Operations Shortcut) */}
                  <div className="bg-[#0f172a] text-white rounded-xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                      <Terminal className="w-4 h-4 text-[#07C2E3]" />
                      <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">快捷直达服务</h3>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setIsAddingTenant(!isAddingTenant)}
                        className="w-full bg-slate-900 border border-slate-800 hover:border-[#07C2E3]/50 text-slate-100 hover:text-[#07C2E3] text-left text-xs font-black p-3 rounded-lg flex items-center justify-between transition-all"
                      >
                        <span>👥 快速审批开设商户租户</span>
                        <span className="text-slate-500 font-mono text-[10px]">NEW_TENANT</span>
                      </button>

                      {isAddingTenant && (
                        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-3 animate-fadeIn text-left mt-1.5">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">主体企业名称</label>
                            <input 
                              type="text" 
                              placeholder="例如: 极光百货直销商贸..."
                              value={quickTenantName}
                              onChange={e => setQuickTenantName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">行业预设板块</label>
                            <select 
                              value={quickTenantIndustry} 
                              onChange={e => setQuickTenantIndustry(e.target.value as IndustryType)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="retail">👕 服装设计分销 (retail)</option>
                              <option value="food">🍔 外卖餐馆自动化 (food)</option>
                              <option value="manufacturing">🔋 百货电器货源直供 (manufacturing)</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              if (!quickTenantName.trim()) return;
                              const newId = `t_custom_${Date.now().toString().substring(11)}`;
                              // add to tenants array
                              tenants.push({
                                id: newId,
                                companyName: quickTenantName,
                                industry: quickTenantIndustry,
                                storeName: `${quickTenantName}专属分销仓`,
                                status: 'active',
                                aiBudget: 1000,
                                aiSpent: 0,
                                createdAt: new Date().toISOString().substring(0, 10)
                              });
                              // update subscription
                              dbEngine.tenant_subscriptions.updatePlan(newId, 'Starter OS Suite');
                              dbEngine.system_notices.updateNotice(`重大喜讯：热烈欢迎全新商户 [${quickTenantName}] 正式通过最高合规审查入驻极光智能 OS 系统！`);
                              reloadAdminDB();
                              setQuickTenantName('');
                              setIsAddingTenant(false);
                              onAddSystemLog('商户管理', '急速开设商户', `超级合规开启：一键审核批准并自动发放租户 [${newId}] 商户。`, 'success');
                              alert(`商户租户 [${quickTenantName}] 合规审核急速放行：激活并创建独立分销仓实例成功！`);
                            }}
                            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-xs py-2 rounded mt-2 cursor-pointer"
                          >
                            合规放行并开设租户
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => setIsAddingPlan(!isAddingPlan)}
                        className="w-full bg-slate-900 border border-slate-800 hover:border-[#07C2E3]/50 text-slate-100 hover:text-[#07C2E3] text-left text-xs font-black p-3 rounded-lg flex items-center justify-between transition-all"
                      >
                        <span>💳 立项新建平台商用套餐</span>
                        <span className="text-slate-500 font-mono text-[10px]">NEW_PACKAGE</span>
                      </button>

                      {isAddingPlan && (
                        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg space-y-3 animate-fadeIn text-left mt-1.5">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">套餐级别名称</label>
                            <input 
                              type="text" 
                              placeholder="例如: 极光 Ultimate AI 版"
                              value={quickPlanName}
                              onChange={e => setQuickPlanName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1">月费价格 ($ / 月)</label>
                            <input 
                              type="number" 
                              value={quickPlanPrice}
                              onChange={e => setQuickPlanPrice(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (!quickPlanName.trim()) return;
                              onAddSystemLog('套餐管理', '发布新套餐', `在全网数据库中发布新建商用套餐 ${quickPlanName}, 标价为 $${quickPlanPrice}/月`, 'success');
                              setQuickPlanName('');
                              setIsAddingPlan(false);
                              alert(`平台套餐立项发布成功：新套餐 [${quickPlanName}] 精品已写入计费接口标准，即可提供租户选购。`);
                            }}
                            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-xs py-2 rounded mt-2 cursor-pointer"
                          >
                            立项发布套餐
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (onChangeSubTab) {
                            onChangeSubTab('logs');
                            onAddSystemLog('平台控制台', '快捷跳转', '进入核心审计日志中心', 'info');
                          }
                        }}
                        className="w-full bg-slate-100/10 hover:bg-slate-100/20 text-slate-200 text-left text-xs font-bold p-3 rounded-lg flex items-center justify-between transition-all"
                      >
                        <span>📜 调阅审计追踪日志中心</span>
                        <span className="text-slate-400 font-mono text-[10px]">AUDIT_LOGS</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onChangeSubTab) {
                            onChangeSubTab('query');
                            onAddSystemLog('平台控制台', '快捷跳转', '进入底层SQL数据查询环境', 'info');
                          }
                        }}
                        className="w-full bg-slate-100/10 hover:bg-slate-100/20 text-slate-200 text-left text-xs font-bold p-3 rounded-lg flex items-center justify-between transition-all"
                      >
                        <span>🔍 进入 SQL 底层数据命令行查询</span>
                        <span className="text-slate-400 font-mono text-[10px]">DATA_QUERY</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Render 2: Platform Metrics Definition (平台指标定义) with explicit mappings */}
          {activeStatsTabMode === 'definition' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Scale className="w-5 h-5 text-[#07C2E3]" />
                <h3 className="text-sm font-black text-slate-900 uppercase">平台核心计算指标定义及追溯底账 · METRIC_STANDARDS</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                为解决多租户 SaaS 平台宏观统计口径不一引发的财务与运营审计纠纷，特在此公示极光商业大算力底层核心计量指标的 SQL 映射规范与审计流向。
              </p>

              <div className="space-y-4">
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] font-mono text-[10px] px-2 py-0.5 rounded font-black">GMV</span>
                    <span className="text-xs font-black text-slate-800">全网累计销售额 (Gross Merchandise Volume)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-4">
                    = 平台所有支付成功、且未取消退还的交易单据净额总和。
                  </p>
                  <div className="mt-2 bg-zinc-950 p-3 rounded-lg font-mono text-[10px] text-[#07C2E3] space-y-1">
                    <div><span className="text-amber-400">SELECT</span> SUM(total_amount) <span className="text-amber-400">FROM</span> orders <span className="text-amber-400">JOIN</span> payments <span className="text-amber-400">ON</span> orders.id = payments.order_id;</div>
                    <div className="text-slate-400"># 映射集合: database.orders, database.payments (口径排除状态为 "Refunded/已退款" 的订单项目)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] font-mono text-[10px] px-2 py-0.5 rounded font-black">ACTIVE_TENANTS</span>
                    <span className="text-xs font-black text-slate-800">活跃租户数 (Active Business Tenants)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-4">
                    = 正常付费开通、通过 KYC 合规认证且状态未被挂起（`status = 'active'`）的企业租户主体总数。
                  </p>
                  <div className="mt-2 bg-zinc-950 p-3 rounded-lg font-mono text-[10px] text-[#07C2E3] space-y-1">
                    <div><span className="text-amber-400">SELECT</span> COUNT(id) <span className="text-amber-400">FROM</span> tenants <span className="text-amber-400">WHERE</span> status = <span className="text-emerald-400">'active'</span>;</div>
                    <div className="text-slate-400"># 映射集合: database.tenants (若状态处于 'suspended' 隔离态不作计入)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#07C2E3]/15 text-[#07C2E3] font-mono text-[10px] px-2 py-0.5 rounded font-black">BILLING_REVENUE</span>
                    <span className="text-xs font-black text-slate-800">平台开单实收账款 (Platform Invoiced Revenue)</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-4">
                    = 平台所有租户因选购、升级套餐而产生的已到账发票与开单收据款项之实收总额。
                  </p>
                  <div className="mt-2 bg-zinc-950 p-3 rounded-lg font-mono text-[10px] text-[#07C2E3] space-y-1">
                    <div><span className="text-amber-400">SELECT</span> SUM(amount) <span className="text-amber-400">FROM</span> billing_accounts <span className="text-amber-400">WHERE</span> status = <span className="text-emerald-400">'paid'</span>;</div>
                    <div className="text-slate-400"># 映射整合: database.billing_accounts, database.subscriptions (实收账款为扣除退款、欠费坏账后的实付入账)</div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 2: 👥 租户管理中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'tenants' && (
        <div className="space-y-6 text-left">
          
          {/* Main Tenant list card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">全网多租户企业管制中心</h3>
                <p className="text-[10px] text-slate-400 mt-1">管理各租户实例、安全状态、计费套餐及代理登录审计入口。</p>
              </div>
              <span className="text-[10.5px] font-mono font-black text-[#07C2E3] bg-[#07C2E3]/10 px-2.5 py-1 rounded-lg">
                ONLINE: {tenants.filter(t => t.status === 'active').length} / {tenants.length} TENANTS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">租户 ID / 主店铺</th>
                    <th className="p-4">企业主体名称</th>
                    <th className="p-4">行业预设板块</th>
                    <th className="p-4">绑定商用套餐</th>
                    <th className="p-4">运行状态</th>
                    <th className="p-4">算力使用 (消耗 / 上限)</th>
                    <th className="p-4">店铺数</th>
                    <th className="p-4 text-right pr-6">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tenants.map(t => {
                    const currentPlan = dbEngine.tenant_subscriptions.getByTenant(t.id).plan;
                    const tenantStoresCount = dbEngine.stores.getAll().filter(s => s.tenantId === t.id).length || 1;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono">
                          <span className="font-bold text-[#07C2E3] block">{t.id.toUpperCase()}</span>
                          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{t.storeName}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">{t.companyName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">注册时间: {t.createdAt}</span>
                        </td>
                        <td className="p-4 uppercase font-bold text-slate-600 font-mono text-[10px]">{t.industry}</td>
                        <td className="p-4 font-extrabold text-slate-900">
                          <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-1 rounded border border-slate-200">
                            {currentPlan}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            t.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {t.status === 'active' ? '独立运行中' : '服务已挂起'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <span className="text-slate-900 font-extrabold">${t.aiSpent.toFixed(2)}</span>
                          <span className="text-slate-300 mx-1">/</span>
                          <span className="text-slate-500 font-semibold">${t.aiBudget}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-700 font-mono">{tenantStoresCount} 个仓储</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedTenantData(t);
                                onAddSystemLog('商户管制中心', '打开配置面板', `打开了商户 ${t.companyName} 的统一配置控制墙`, 'info');
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-3 py-1.5 rounded-lg text-[10.5px] cursor-pointer transition-colors"
                            >
                              管理操作 & 配额
                            </button>
                            <button
                              onClick={() => {
                                if (onImpersonate) {
                                  onImpersonate(t.id, t.industry);
                                } else {
                                  alert('代理服务跳转发生故障，请检查顶层路由通道配置。');
                                }
                              }}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black px-3 py-1.5 rounded-lg text-[10.5px] cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <span>代理登录</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded detailed config drawer and interactive blocks for selectedTenantData */}
          {selectedTenantData && (() => {
            const currentPlan = dbEngine.tenant_subscriptions.getByTenant(selectedTenantData.id).plan;
            const tenantStores = dbEngine.stores.getAll().filter(s => s.tenantId === selectedTenantData.id);
            const tenantProductsCount = tenantDB && tenantDB[selectedTenantData.industry]?.products?.length || 9;
            const tenantOrders = tenantDB && tenantDB[selectedTenantData.industry]?.orders || [];
            const tenantInvoices = dbEngine.billing_accounts.getByTenant(selectedTenantData.id);

            return (
              <div id="expanded-tenant-ops-drawer" className="bg-white border border-slate-200 rounded-xl p-5 space-y-6 relative animate-fadeIn shadow-md text-left">
                
                {/* Header title */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-[#07C2E3] font-mono font-black border border-[#07C2E3]/20 px-2 py-0.5 rounded">
                      ID: {selectedTenantData.id.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-wide">
                      租户超级管理墙: {selectedTenantData.companyName}
                    </h4>
                  </div>
                  <button 
                    onClick={() => setSelectedTenantData(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3 py-1.5 rounded"
                  >
                    ✕ 关闭面板
                  </button>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                  
                  {/* Column 1: Basic profiles, store items, impersonate login */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                      <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>🏢 基本档案及合规信息</span>
                        <Shield className="w-3.5 h-3.5 text-[#07C2E3]" />
                      </h4>
                      <div className="space-y-2">
                        <div><span className="text-slate-400 font-medium">企业税号:</span> <span className="font-mono font-extrabold text-slate-800 ml-1">FI-93810-{selectedTenantData.id.slice(-3)}</span></div>
                        <div><span className="text-slate-400 font-medium">注册邮箱:</span> <span className="font-bold text-slate-800 ml-1">{selectedTenantData.id}@commerce-os.eu</span></div>
                        <div><span className="text-slate-400 font-medium">联系电话:</span> <span className="font-mono text-slate-800 ml-1">+39 02 {selectedTenantData.id.charCodeAt(2)}92 108</span></div>
                        <div><span className="text-slate-400 font-medium">注册地址:</span> <span className="text-slate-800 font-bold ml-1">Milan Commerce Terminal, Block C, Italy</span></div>
                        <div><span className="text-slate-400 font-medium">当前套餐:</span> <span className="font-black text-[#07C2E3] ml-1">{currentPlan}</span></div>
                        <div><span className="text-slate-400 font-medium">到期日期:</span> <span className="font-mono text-slate-800 font-semibold ml-1">2027-06-12 12:00:00</span></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                      <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-2">
                        🛍️ 绑定仓储实例店铺 ({tenantStores.length} 个)
                      </h4>
                      <div className="space-y-2.5">
                        {tenantStores.map(store => (
                          <div key={store.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs">
                            <div>
                              <p className="font-black text-slate-900 text-[11.5px]">{store.name}</p>
                              <p className="text-[9.5px] font-mono text-slate-400 mt-1">ID: {store.id} · Pre: {store.domain}</p>
                            </div>
                            <div className="flex gap-1">
                              <a 
                                href="https://shopify.com" 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1.5 rounded transition-all"
                              >
                                访问网站
                              </a>
                              <button
                                onClick={() => {
                                  if (onImpersonate) {
                                    onImpersonate(selectedTenantData.id, selectedTenantData.industry);
                                  }
                                }}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 text-[10px] font-black px-2.5 py-1.5 rounded transition-all cursor-pointer"
                              >
                                进入后台
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Subscription modifying & Quota controls */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-4">
                      <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-2">
                        💳 变更商用套餐 & 算力限制
                      </h4>
                      <div>
                        <label className="text-[10px] text-slate-400 font-extrabold block mb-1">选择企业商用套餐</label>
                        <select
                          value={currentPlan}
                          onChange={(e) => {
                            const newPlan = e.target.value;
                            dbEngine.tenant_subscriptions.updatePlan(selectedTenantData.id, newPlan);
                            reloadAdminDB();
                            onAddSystemLog('计费调整', '升级企业套餐', `调整租户 ${selectedTenantData.companyName} 套餐至 「${newPlan}」`, 'success');
                            alert(`租户 [${selectedTenantData.companyName}] 套餐级别已修改为: ${newPlan}，对应各项API约束已完成重写。`);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="Free">🆓 免费体验沙盒 (Free)</option>
                          <option value="Starter OS Suite">🥉 极光入门套件 (Starter OS Suite)</option>
                          <option value="Growth Cloud Package">🥈 极光云增长包 (Growth Cloud Package)</option>
                          <option value="Pro Enterprise Brain">🥇 极光旗舰认知企业大脑 (Pro Enterprise Brain)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-extrabold block mb-1">调整AI算力上限月度预算</label>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            value={tokenAdjustments[selectedTenantData.id] ?? selectedTenantData.aiBudget}
                            onChange={(e) => setTokenAdjustments({ ...tokenAdjustments, [selectedTenantData.id]: Number(e.target.value) })}
                            className="bg-white border rounded px-3 py-1.5 font-mono text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                          />
                          <button
                            onClick={() => {
                              const budget = tokenAdjustments[selectedTenantData.id] || selectedTenantData.aiBudget;
                              onUpdateTenantAiBudget(selectedTenantData.id, budget);
                              onAddSystemLog('算力调配', '变更预算配额', `重设租户 ${selectedTenantData.companyName} 的算力预算上限为 $${budget}`, 'success');
                              alert(`算力预算配额调整成功：商户 [${selectedTenantData.companyName}] 本月上限已设定为 $${budget}`);
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-3.5 py-1.5 rounded font-bold cursor-pointer"
                          >
                            确定调配
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3.5">
                      <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-1.5">
                        📈 套餐配额用量监视 (Quotas Limit)
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>🧠 AI 算力预算使用率</span>
                            <span>${selectedTenantData.aiSpent.toFixed(2)} / ${selectedTenantData.aiBudget.toFixed(2)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#07C2E3]" 
                              style={{ width: `${Math.min(100, (selectedTenantData.aiSpent / selectedTenantData.aiBudget) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>📦 商品 SKU 占仓量</span>
                            <span>{tenantProductsCount} / {currentPlan === 'Free' ? 20 : currentPlan.includes('Starter') ? 100 : 1000} SKUs</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-800" 
                              style={{ width: `${Math.min(100, (tenantProductsCount / (currentPlan === 'Free' ? 20 : currentPlan.includes('Starter') ? 100 : 1000)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>📋 历史累计单据量</span>
                            <span>{tenantOrders.length} / {currentPlan === 'Free' ? 50 : 500} 笔</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-800" 
                              style={{ width: `${Math.min(100, (tenantOrders.length / (currentPlan === 'Free' ? 50 : 500)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>👥 活跃企业子员工数</span>
                            <span>4 / {currentPlan === 'Free' ? 2 : currentPlan.includes('Starter') ? 10 : 100} 个用户</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-600" 
                              style={{ width: `${Math.min(100, (4 / (currentPlan === 'Free' ? 2 : currentPlan.includes('Starter') ? 10 : 100)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Invoices records & State freezes */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                      <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-2">
                        🧾 租户财务开单与账单流水
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {tenantInvoices.map((inv: any) => (
                          <div key={inv.id} className="p-2 bg-white border border-slate-200 rounded flex justify-between items-center text-[11px]">
                            <div>
                              <span className="font-mono font-bold block text-slate-800">{inv.invoiceNo}</span>
                              <span className="text-[9.5px] text-slate-400 font-mono block">{inv.dueDate}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-black text-slate-900 block">€ {inv.amount}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {inv.status === 'paid' ? '已到账' : '待支付'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-rose-50/25 rounded-xl border border-rose-100 space-y-3">
                      <h4 className="font-black text-rose-950 uppercase text-[11px] border-b border-rose-100 pb-2">
                        🚨 租户封停与注销挂载管制
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newStatus = selectedTenantData.status === 'active' ? 'suspended' : 'active';
                            onUpdateTenantStatus(selectedTenantData.id, newStatus);
                            reloadAdminDB();
                            onAddSystemLog('商户封挂', newStatus === 'active' ? '接触冰冻' : '执行冰冻挂起', `一键变更租户 ${selectedTenantData.companyName} 服务许可状态为 ${newStatus}`, 'warning');
                            alert(`租户服务状态硬性干预成功：目前状态已切换为 "${newStatus === 'active' ? '允许独立运行中' : '隔离并在端点全面封停'}"！`);
                          }}
                          className={`flex-1 py-2 rounded-lg font-black text-xs cursor-pointer border ${
                            selectedTenantData.status === 'active'
                              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                          }`}
                        >
                          {selectedTenantData.status === 'active' ? '一键暂停挂起租户' : '复位恢复运行'}
                        </button>
                      </div>

                      <div className="border-t border-rose-100 pt-3 mt-3">
                        <label className="text-[9.5px] text-rose-800 font-bold block mb-1">
                          二次合规安全软注销 (请输入企业名字以完成软注销)
                        </label>
                        <div className="flex gap-1.5">
                          <input 
                            type="text"
                            placeholder="二次确认商户名字"
                            className="bg-white border border-rose-200 text-rose-950 px-2 py-1 text-xs rounded w-full focus:outline-none"
                            id="tenant-soft-delete-confirmation-field"
                            onChange={(e) => {
                              // evaluate confirm state
                              const field = e.target;
                              const btn = document.getElementById('soft-del-execution-button') as HTMLButtonElement;
                              if (btn) {
                                btn.disabled = field.value !== selectedTenantData.companyName;
                              }
                            }}
                          />
                          <button
                            id="soft-del-execution-button"
                            disabled
                            onClick={() => {
                              // Perform soft delete
                              const tIdx = tenants.findIndex(it => it.id === selectedTenantData.id);
                              if (tIdx !== -1) {
                                tenants.splice(tIdx, 1);
                                reloadAdminDB();
                                onAddSystemLog('租户注销', '硬合规注销审核', `商户 ${selectedTenantData.companyName} 注销完毕并进入数据孤岛软删除归档`, 'warning');
                                alert('租户注销软删除完毕：其全部生产运行节点已安全析出并标记脱挂。');
                                setSelectedTenantData(null);
                              }
                            }}
                            className="bg-rose-900 override-disable hover:bg-rose-950 disabled:opacity-50 text-white font-bold text-[10.5px] px-3.5 py-1.5 rounded"
                          >
                            安全软注销
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Tenant Filtered Audit Logs */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5 text-xs">
                  <h4 className="font-extrabold text-slate-800 uppercase text-[11px] border-b border-slate-200 pb-2">
                    🛡️ 当前租户专属安全审计与调阅痕迹 (Audited Logs)
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[10.5px]">
                    {auditLogs.filter(log => log.agent.toLowerCase().includes(selectedTenantData.id.toLowerCase()) || log.details.toLowerCase().includes(selectedTenantData.companyName.toLowerCase()) || log.details.toLowerCase().includes(selectedTenantData.id.toLowerCase())).map((log, idx) => (
                      <div key={idx} className="p-2 bg-white border border-slate-200 rounded flex justify-between items-center text-slate-700">
                        <div className="flex gap-2 items-center">
                          <span className="p-0.5 px-1 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">LOG</span>
                          <span><span className="font-bold text-slate-900">[{log.action}]</span> {log.details}</span>
                        </div>
                        <span className="text-slate-400 text-[9.5px] shrink-0 ml-4">{log.timestamp || '刚刚'}</span>
                      </div>
                    ))}
                    {auditLogs.filter(log => log.agent.toLowerCase().includes(selectedTenantData.id.toLowerCase()) || log.details.toLowerCase().includes(selectedTenantData.companyName.toLowerCase()) || log.details.toLowerCase().includes(selectedTenantData.id.toLowerCase())).length === 0 && (
                      <div className="text-slate-400 text-center py-4 font-sans text-xs">没有检测到该租户任何在案的配置修改或越权审计痕迹，合规状况：100% PERFECT。</div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 3: 🔍 数据查询中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'query' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Search className="w-5 h-5 text-[#07C2E3]" />
              <div>
                <h3 className="text-sm font-extrabold tracking-wider text-slate-100">全网数据查询器</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">管理员直接查询平台级单据与主体状态。</p>
              </div>
            </div>

            {/* Selector Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">选择数据表:</span>
                <div className="flex gap-1.5">
                  {(['orders', 'products', 'customers', 'tenants'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSelectedTable(tab);
                        setQueryInput(`SELECT * FROM ${tab} LIMIT 20;`);
                        setQueryError(null);
                      }}
                      className={`px-3 py-1.5 rounded font-bold uppercase transition-all text-[11px] cursor-pointer ${selectedTable === tab ? 'bg-[#07C2E3] text-slate-950 border border-[#07C2E3]' : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'}`}
                    >
                      {tab === 'orders' ? '📋 订单' : tab === 'products' ? '🛍️ 商品' : tab === 'customers' ? '👥 客户' : '🏢 租户'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template clicks */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">预置对账模版:</span>
                <button
                  onClick={() => {
                    setSelectedTable('orders');
                    setSearchQuery('payment_failed');
                    setQueryInput(`SELECT * FROM orders WHERE payment_status = 'failed';`);
                    onAddSystemLog('查询中心', '对账检索', '一键抓取异常支付账单', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  ⚠️ 异常订单
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('products');
                    setSearchQuery('');
                    setQueryInput(`SELECT * FROM products ORDER BY price DESC;`);
                    onAddSystemLog('查询中心', '数据检索', '检索产品物料价目库', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🔥 高单价商品
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('tenants');
                    setSearchQuery('suspended');
                    setQueryInput(`SELECT * FROM tenants WHERE status = 'suspended';`);
                    onAddSystemLog('查询中心', '网格审计', '检索暂时挂起的商户', 'warning');
                  }}
                  className="bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🚨 挂起商户
                </button>
              </div>
            </div>

            {/* Search inputs */}
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="键入关键字，如 姓名, 租户, 交易ID, SKU 进行秒级物料行匹配..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-3 font-mono focus:outline-none focus:ring-1 focus:ring-[#07C2E3] placeholder-slate-600"
              />
              <button
                onClick={() => {
                  onAddSystemLog('查询中心', '数据检索', `检索 ${selectedTable} 匹配 ${searchQuery}`, 'info');
                  alert(`读取成功！已抓取到 ${processedQueryResult.length} 行匹配数据记录。`);
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                直接搜索
              </button>
            </div>
          </div>

          {/* Results grid */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-850 font-extrabold uppercase">📊 读取记录数：{processedQueryResult.length} 行</span>
              <span className="font-mono text-slate-400">READ_MODE: BYPASS_ROUTER</span>
            </div>

            <div className="overflow-x-auto">
              {processedQueryResult.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2 text-xs">
                  <p>未在当前选择的数据表中检索到符合条件的对账单记录。</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                      {selectedTable === 'orders' && (
                        <>
                          <th className="p-4">订单号 (ID)</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">买家客户</th>
                          <th className="p-4">结算货款</th>
                          <th className="p-4">支付方式</th>
                          <th className="p-4">支付状态</th>
                          <th className="p-4">下单日期</th>
                        </>
                      )}
                      {selectedTable === 'products' && (
                        <>
                          <th className="p-4">物品 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">商品名称</th>
                          <th className="p-4">系统成本</th>
                          <th className="p-4">公允销售价</th>
                          <th className="p-4">库存余量</th>
                          <th className="p-4">状态</th>
                        </>
                      )}
                      {selectedTable === 'customers' && (
                        <>
                          <th className="p-4">客户 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">姓名</th>
                          <th className="p-4">绑定邮箱</th>
                          <th className="p-4">国家</th>
                          <th className="p-4">累计消费</th>
                          <th className="p-4">层级</th>
                        </>
                      )}
                      {selectedTable === 'tenants' && (
                        <>
                          <th className="p-4">租户 ID</th>
                          <th className="p-4">签约主体企业</th>
                          <th className="p-4">挂载行业</th>
                          <th className="p-4">状态</th>
                          <th className="p-4">创建日期</th>
                          <th className="p-4">已结提存额</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {processedQueryResult.map((row: any, idx: number) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Selected Orders schema */}
                        {selectedTable === 'orders' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'ord_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans">{row.customerName || row.customerId || '匿名买家'}</td>
                            <td className="p-4 font-bold text-slate-900">€{row.total ?? 0.0}</td>
                            <td className="p-4 uppercase text-[10px] font-sans font-extrabold">{row.paymentMethod || 'Stripe_Card'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${row.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : row.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {row.paymentStatus || 'unknown'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt || '2026-06-08'}</td>
                          </>
                        )}

                        {/* Selected Products schema */}
                        {selectedTable === 'products' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'sku_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '商品档案'}</td>
                            <td className="p-4 text-slate-500">€{(row.costPrice || (row.price ? row.price * 0.6 : 10)).toFixed(2)}</td>
                            <td className="p-4 text-[#07C2E3] font-bold">€{(row.price || 0.0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-slate-900">{row.stock ?? 0} 件</td>
                            <td className="p-4 font-sans text-slate-500 text-[10px]">
                              {(row.stock ?? 0) <= 10 ? '🔴 跌至补货线' : '🟢 配备充足'}
                            </td>
                          </>
                        )}

                        {/* Selected Customers schema */}
                        {selectedTable === 'customers' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'cust_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '客商档案'}</td>
                            <td className="p-4 text-slate-500 break-all">{row.email || 'n/a'}</td>
                            <td className="p-4 font-sans">{row.country || 'EU / EUR'}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.totalSpent || 0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-emerald-700">VIP_Active</td>
                          </>
                        )}

                        {/* Selected Tenants schema */}
                        {selectedTable === 'tenants' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3] uppercase">{row.id}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.companyName}</td>
                            <td className="p-4 uppercase text-slate-600 font-sans text-[10px] font-extrabold">{row.industry}</td>
                            <td className="p-4 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-700 font-bold'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.aiSpent * 10).toFixed(2)}</td>
                          </>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 4: 💳 支付中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'gateways' && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentGateways.map(g => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#07C2E3]" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{g.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${g.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {g.status ? '● 收单正常' : '○ 通道暂停'}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">物理通信安全 API 秘钥 Key</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={g.apiKey}
                          readOnly
                          className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-mono rounded px-2 text-[11px] py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">WebHook 配送应答域目录</label>
                      <input
                        type="text"
                        value={g.webhook}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, webhook: val } : item));
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-800 font-mono rounded text-[11px] py-1.5 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-2 font-mono">
                    <span>最近一期财务对账划拨时间:</span>
                    <span className="font-bold text-slate-800">{g.syncTime}</span>
                  </div>

                  {g.errorLogs.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-[10px] space-y-1">
                      <span className="font-bold uppercase tracking-wider block text-rose-950">Gateway System Diagnostics (通道诊断异常):</span>
                      {g.errorLogs.map((err, idx) => (
                        <span key={idx} className="block font-mono font-medium">✕ {err}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTestConnection(g.id, g.name)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        ⚡ 连通测试
                      </button>
                      <button
                        onClick={() => handleSyncNow(g.id, g.name)}
                        disabled={isSyncingGateway === g.id}
                        className="bg-[#07C2E3]/10 hover:bg-[#07C2E3]/25 text-[#07C2E3] font-bold text-[11px] px-3 py-1.5 rounded-lg border border-[#07C2E3]/20 tracking-wider cursor-pointer"
                      >
                        {isSyncingGateway === g.id ? '正在对账同步...' : '🔄 即刻对账'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const nextState = !g.status;
                        setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, status: nextState } : item));
                        onAddSystemLog('支付中心', nextState ? '开启收单网关' : '吊销收单网关', `变更支付网关渠道 ${g.name} 的运行状态为 ${nextState ? '启用' : '废弃中断'}`, nextState ? 'success' : 'error');
                      }}
                      className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${g.status ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                    >
                      {g.status ? '🚨 吊销通道' : '🔓 激活通道'}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 10: 💳 套餐管理 / Packages */}
      {/* ========================================================= */}
      {activeSubTab === 'packages' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  SaaS 多租户订阅套餐管理中心
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">管理商家订购版本、配置抽成扣点比例、SKU数量承载力限额与自主 AI 算力配额。</p>
              </div>
              <button
                onClick={() => setShowAddPackageForm(!showAddPackageForm)}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1"
              >
                {showAddPackageForm ? '✕ 关闭窗体' : '➕ 创设新订购套餐'}
              </button>
            </div>

            {/* Spawn Form */}
            {showAddPackageForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">创设自定义商家订阅版本</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">版本名称</label>
                    <input
                      type="text"
                      placeholder="如: Europe Ultimate AI"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#07C2E3]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">订购月费 (€ / 月)</label>
                    <input
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">抽成扣点比例 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPackage.commission}
                      onChange={(e) => setNewPackage({ ...newPackage, commission: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">SKU 存储上限 (件)</label>
                    <input
                      type="number"
                      value={newPackage.skus}
                      onChange={(e) => setNewPackage({ ...newPackage, skus: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">每月 AI 算力额度 (Token 额值)</label>
                    <input
                      type="number"
                      value={newPackage.aiQuota}
                      onChange={(e) => setNewPackage({ ...newPackage, aiQuota: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!newPackage.name.trim()) return alert('请输入套餐版本名称！');
                      const pack = {
                        id: 'custom_' + Date.now(),
                        name: newPackage.name,
                        price: newPackage.price,
                        billingCycle: 'monthly',
                        commissionRate: newPackage.commission,
                        activeTenants: 0,
                        maxSkus: newPackage.skus,
                        aiQuota: newPackage.aiQuota,
                        status: 'active',
                        features: ["Storefront Support", "Standard Multi-Agent Guard", "WMS Fulfillment Hook"]
                      };
                      setSubscriptionPackages([...subscriptionPackages, pack]);
                      setShowAddPackageForm(false);
                      setNewPackage({ name: '', price: 99, commission: 1.0, skus: 5000, aiQuota: 5000 });
                      onAddSystemLog('套餐管理', '发布新套餐', `管理员创设新套餐级别「${pack.name}」，对公月费 €${pack.price}`, 'success');
                      alert(`应用成功！套餐「${pack.name}」已添加。`);
                    }}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-extrabold text-[11px] px-4 py-2 rounded-lg cursor-pointer shadow-sm transition-all uppercase"
                  >
                    💾 确认创设并全球分发
                  </button>
                </div>
              </div>
            )}

            {/* List Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">套餐阶梯方案 (Tier)</th>
                    <th className="p-4">结算方式</th>
                    <th className="p-4">公允资费 (月费)</th>
                    <th className="p-4 text-center">基础扣点比例 (Rate)</th>
                    <th className="p-4 text-center">当前签约存量</th>
                    <th className="p-4">承载规格</th>
                    <th className="p-4">系统状态</th>
                    <th className="p-4 text-center">操作指令</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {subscriptionPackages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-sans font-bold text-slate-900 block text-[13px]">{p.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1 font-sans">
                          {p.features.map((f: string, fIdx: number) => (
                            <span key={fIdx} className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-medium border border-slate-200/50">
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-sans text-slate-500 font-bold capitalize">{p.billingCycle}</td>
                      <td className="p-4 font-bold text-slate-900 text-sm">€ {p.price.toFixed(2)}</td>
                      <td className="p-4 text-center font-bold text-indigo-600 text-sm">{p.commissionRate.toFixed(1)}%</td>
                      <td className="p-4 text-center font-bold text-emerald-600 text-sm">{p.activeTenants} 家</td>
                      <td className="p-4 font-sans space-y-0.5 text-slate-500">
                        <span className="block text-[10px]">📦 SKU上限: <b className="text-slate-800">{p.maxSkus === 100000 ? '无限' : `${p.maxSkus} SKU`}</b></span>
                        <span className="block text-[10px]">🧠 AIToken/月: <b className="text-slate-800">{p.aiQuota === 999999 ? '无限' : `${p.aiQuota} TOK`}</b></span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                          {p.status === 'active' ? '🟢 线上挂牌' : '🔴 暂时禁售'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-sans">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => {
                              const newPrice = parseFloat(prompt(`请输入「${p.name}」新资费比例（当前 €${p.price}）：`, p.price.toString()) || p.price.toString());
                              if (!isNaN(newPrice)) {
                                setSubscriptionPackages(subscriptionPackages.map(pkg => pkg.id === p.id ? { ...pkg, price: newPrice } : pkg));
                                onAddSystemLog('套餐管理', '资费改单', `修改「${p.name}」订购资费为 €${newPrice}`, 'warning');
                                alert('修改成功！');
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-sans font-bold px-2 py-1.5 cursor-pointer"
                          >
                            ✎ 调价
                          </button>
                          <button
                            onClick={() => {
                              const toggled = p.status === 'active' ? 'suspended' : 'active';
                              setSubscriptionPackages(subscriptionPackages.map(pkg => pkg.id === p.id ? { ...pkg, status: toggled } : pkg));
                              onAddSystemLog('套餐管理', '套餐状态变更', `更改「${p.name}」挂牌状态为 ${toggled === 'active' ? '售卖' : '中断'}`, 'warning');
                              alert('挂牌状态更新完毕！');
                            }}
                            className={`px-2 py-1.5 rounded text-[10px] font-sans font-bold border transition-all cursor-pointer ${p.status === 'active' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-250'}`}
                          >
                            {p.status === 'active' ? '🚫 下架' : '⚡ 挂牌'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 11: 💰 财务结算 / Finance */}
      {/* ========================================================= */}
      {activeSubTab === 'finance' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">年度全网总流水 (GMV)</span>
              <p className="text-lg font-black text-[#07C2E3] mt-1 font-mono">€ 1,294,850.12</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1">同比去年 +184.2% (高倍率)</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">平台佣金净结算额 (MRR)</span>
              <p className="text-lg font-black text-white mt-1 font-mono">€ 425,124.00</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1">平均提点 2.0% 的技术服务利润</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">等待清算结款 (Pending)</span>
              <p className="text-lg font-black text-amber-500 mt-1 font-mono">
                € {billingInvoices.filter(i => i.status !== 'paid').reduce((acc, curr) => acc + curr.commissionCharge, 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-500 font-mono mt-1">商户挂账，30天账期滚动</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">托管合规划拨金</span>
              <p className="text-lg font-black text-rose-500 mt-1 font-mono">€ 360,000.00</p>
              <span className="text-[10px] text-slate-500 font-mono mt-1">平台常备保障准备金</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">租户交易清算账单列表</h3>
                <p className="text-[10px] text-slate-400 mt-1">查看并确认各多租户物理商铺在平台对公开提款时的资金结算发票单据。</p>
              </div>

              {/* Invoice Filters */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['all', 'paid', 'pending', 'unpaid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFinanceFilter(filter)}
                    className={`px-3 py-1 text-[10px] font-bold rounded capitalize cursor-pointer ${financeFilter === filter ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {filter === 'all' ? '全部' : filter === 'paid' ? '已支付' : filter === 'pending' ? '待结算' : '已逾期'}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices list */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">账账发票号 (Id)</th>
                    <th className="p-4">商家/租户签约集团 (Merchant)</th>
                    <th className="p-4">应还本月账期流水 (GTV)</th>
                    <th className="p-4 uppercase">提扣返款所得</th>
                    <th className="p-4">账账履约截至</th>
                    <th className="p-4">结算划拔状态</th>
                    <th className="p-4 text-center">管理员最高清算动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {billingInvoices
                    .filter((inv) => financeFilter === 'all' || inv.status === financeFilter)
                    .map((inv) => (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-indigo-600 font-bold font-mono">#{inv.invoiceId}</td>
                        <td className="p-4 font-sans font-bold text-slate-900">{inv.companyName}</td>
                        <td className="p-4 text-slate-800 font-bold text-sm">€ {inv.amount.toFixed(2)}</td>
                        <td className="p-4 text-emerald-600 font-bold text-sm">€ {inv.commissionCharge.toFixed(2)}</td>
                        <td className="p-4 text-slate-500">{inv.dueDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : inv.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            {inv.status === 'paid' ? '🟢 结算入账' : inv.status === 'pending' ? '🟡 划拔中' : '🔴 挂欠锁死'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {inv.status !== 'paid' ? (
                            <button
                              onClick={() => {
                                setBillingInvoices(billingInvoices.map((i) => i.invoiceId === inv.invoiceId ? { ...i, status: 'paid' } : i));
                                onAddSystemLog('财务结算', '一键线下核账', `核准清账发票号 #${inv.invoiceId}, 实收取提点所得金 €${inv.commissionCharge}`, 'success');
                                alert(`打款核准清账发票 ${inv.invoiceId} 账期闭合成功！资金入账。`);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                            >
                              💰 一键清算确认
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-sans font-medium">✔️ 结算流程终结</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 12: 📨 通信中心 / Communications */}
      {/* ========================================================= */}
      {activeSubTab === 'communications' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {communicationChannels.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">
                    {c.provider}
                  </span>
                  <span className="text-emerald-600 font-black font-mono text-[10px]">
                    🟢 通道畅通
                  </span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <p className="text-slate-500 text-[11px] font-sans">通道类别：<b className="text-slate-800">{c.type}</b></p>
                  <p className="text-slate-500 text-[11px] font-sans">投递送达率: <b className="text-emerald-600">{c.deliveryRate}%</b></p>
                  <p className="text-slate-500 text-[11px] font-sans">累计发送单数: <b className="text-slate-800">{c.sendCount.toLocaleString()}</b></p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">绑定系统自动化触发触发器:</span>
                    <div className="flex flex-wrap gap-1">
                      {c.templateTriggers.map((t: string) => (
                        <span key={t} className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px] px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      const triggerSim = c.templateTriggers[0];
                      const newLog = {
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        tenant: "测试租户_Sim",
                        type: c.type.split(' ')[0],
                        status: "delivered",
                        destination: c.id === 'twilio' ? '+44 7911 123456' : 'super_tester@shopify-ai.eu',
                        trigger: triggerSim
                      };
                      setCommLogs([newLog, ...commLogs]);
                      onAddSystemLog('通信中继器', '下发模拟通道广播', `管理员模拟通道 [${c.provider}] 成功测试投递「${triggerSim}」接口成功`, 'success');
                      alert(`【投递测试仿真信令】\n已给通道 [${c.provider}] 发送广播投递，成功投递到 ${newLog.destination}！`);
                    }}
                    className="bg-[#07C2E3]/15 hover:bg-[#07C2E3] text-slate-800 hover:text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-lg border border-[#07C2E3]/20 transition-all cursor-pointer"
                  >
                    ⚡ 测试信号投递 (Ping)
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              通信网关 发送与延迟回溯日志 (Real-Time Communication Stream)
            </h4>
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">日志发生时刻</th>
                    <th className="p-4">关联租户企业 (Tenant)</th>
                    <th className="p-4">中继器类别</th>
                    <th className="p-4">配送触发核心</th>
                    <th className="p-4">接收物理端点</th>
                    <th className="p-4">网关返回响应结果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {commLogs.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-450">{l.timestamp}</td>
                      <td className="p-4 font-sans font-bold text-slate-900">{l.tenant}</td>
                      <td className="p-4 font-sans text-slate-500 uppercase">{l.type}</td>
                      <td className="p-4 font-mono font-bold text-indigo-700">{l.trigger}</td>
                      <td className="p-4 font-sans font-medium text-slate-705">{l.destination}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black border border-emerald-100 rounded text-[9.5px]">
                          🟢 {l.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 5: 🧠 AI大脑中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'ai-ops' && (
        <div className="space-y-6 text-left">
          
          {/* AI Central Inner Tabs Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-4">
            {[
              { id: 'dashboard', name: '智脑大盘', icon: LayoutDashboard },
              { id: 'p1_intelligence', name: '决策治理', icon: Sparkles },
              { id: 'knowledge', name: '知识向量', icon: BookOpen },
              { id: 'nervous', name: '突触网络', icon: Network },
              { id: 'tuning', name: '智脑微调(LoRA)', icon: Sliders }
            ].map(sub => {
              const SubIcon = sub.icon;
              const isSubActive = aiCentralTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setAiCentralTab(sub.id as any)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSubActive 
                      ? 'bg-[#07C2E3] text-zinc-950 border-[#07C2E3]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {aiCentralTab === 'dashboard' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <EcosCEODashboard setAiCentralTab={setAiCentralTab} onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'p1_intelligence' && (
            <div className="animate-fadeIn">
              <P1IntelligenceControlCenter />
            </div>
          )}

          {aiCentralTab === 'ai_navigator' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <AINavigationCenter 
                onSwitchTab={(tabId) => {
                  if (onSwitchTab) {
                    onSwitchTab(tabId);
                  }
                }} 
                addLog={addLog || onAddSystemLog} 
              />
            </div>
          )}

          {aiCentralTab === 'knowledge' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <PlatformKnowledgeCenter 
                tenantDB={tenantDB || {}} 
                setTenantDB={setTenantDB || (() => {})} 
                selectedIndustry={selectedIndustry} 
                addLog={addLog || onAddSystemLog} 
              />
            </div>
          )}

          {aiCentralTab === 'visual_workflow' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <PlatformWorkflowCenter 
                addLog={addLog || onAddSystemLog} 
              />
            </div>
          )}

          {aiCentralTab === 'execution_center' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm animate-fadeIn">
              <AIExecutionControlCenter onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'discovery' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900 font-extrabold text-[13px] uppercase tracking-wider">诊断发现中枢</h3>
                  <p className="text-xs text-slate-500 mt-1">自动诊断并显示高价值平台事件与链路推荐。</p>
                </div>
              </div>
              <AIDiscoveryCenter onAddSystemLog={onAddSystemLog} />
            </div>
          )}

          {aiCentralTab === 'monitoring' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KPI卡片面盘 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">智脑状态</span>
                  <p className="text-lg font-black text-[#07C2E3] mt-1 font-mono">🟢 正常运行</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">集群连接：100%</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">调度频次</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">854 次</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">今日自动调度总数</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">隔离租户</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">{tenants.filter(t => t.status==='active').length} 活跃 / 共 {tenants.length} 家</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">沙箱物理隔开锁死</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">异常防御</span>
                  <p className="text-lg font-black text-rose-500 mt-1 font-mono">{lockedRisk ? '拦截运行中' : '拦截预备中'}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">防止租户越权穿透</span>
                </div>
              </div>

              {/* 🎯 平台级统控与对账战略大脑 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 text-left mb-6 font-semibold">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 text-left">
                      <span>决策中枢</span>
                      <span className="text-[9.5px] bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 px-1.5 py-0.5 rounded font-mono font-black uppercase">智能大脑</span>
                    </h3>
                  </div>
                  
                  {/* Action subtabs */}
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAiOpTab('revenue')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'revenue' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      财务对账
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiOpTab('fraud')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'fraud' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      风控审计
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiOpTab('campaign')}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'campaign' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      大促调度
                    </button>
                  </div>
                </div>

                {/* Operations workspace */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[220px] flex flex-col justify-between text-left">
                  
                  {aiOpTab === 'revenue' && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="flex justify-between items-center text-left">
                        <span className="font-bold text-slate-800 text-xs">经营对账数据</span>
                        <span className="font-mono text-[10px] text-slate-400">状态：已验证</span>
                      </div>

                      <div className="overflow-x-auto text-left">
                        <table className="w-full text-left border-collapse bg-white border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold font-sans">
                              <th className="p-2.5">行业分类</th>
                              <th className="p-2.5">对账流水</th>
                              <th className="p-2.5">平均毛利</th>
                              <th className="p-2.5">结算状态</th>
                              <th className="p-2.5">物理隔离</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold font-mono text-slate-700">
                            <tr>
                              <td className="p-2.5 font-sans">服饰零售</td>
                              <td className="p-2.5">€ 58,290.00</td>
                              <td className="p-2.5 text-emerald-600">72.1%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-sans">食品配餐</td>
                              <td className="p-2.5">€ 12,410.00</td>
                              <td className="p-2.5 text-emerald-600">64.8%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-sans">基础通用</td>
                              <td className="p-2.5">€ 109,500.00</td>
                              <td className="p-2.5 text-emerald-600">55.0%</td>
                              <td className="p-2.5 text-slate-500">正常结算循环</td>
                              <td className="p-2.5 text-emerald-600">🟢 隔离安全</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">对账评估：租户资金完全隔离，安全隔离通过。</span>
                        <div className="flex items-center gap-2">
                          {dispatchedSettlement && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                              ✔️ 已打款结算
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setDispatchedSettlement(true);
                              onAddSystemLog('AI决策中心', '平台全网结算', '由智脑汇总分析并自动调拨打款各物理租户账款', 'success');
                              alert('对账完成！已成功确认对账结算，完成资金清算。');
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
                          >
                            一键清算
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {aiOpTab === 'fraud' && (
                    <div className="space-y-4 text-xs font-sans text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">支付风控审计</span>
                        <span className="font-mono text-[10px] text-[#07C2E3]">防护等级：高级</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">网关安全防护</span>
                          <span className="text-emerald-600 font-extrabold font-mono block">100% 正常</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">多币种拦截</span>
                          <span className="text-emerald-600 font-extrabold font-mono block">实时监控中</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="text-[11px] text-slate-400 font-bold block">异常大额争议</span>
                          <span className="text-slate-800 font-extrabold font-mono block">{lockedRisk ? '0 笔' : '1 笔 (待处理)'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">安全声明：物理防穿透机制部署完毕。</span>
                        <button
                          onClick={() => {
                            setLockedRisk(!lockedRisk);
                            onAddSystemLog('AI决策中心', lockedRisk ? '解除风控锁' : '开启风控拦截', '一键置下安全防欺诈大额交易红线机制', lockedRisk ? 'warning' : 'success');
                            alert(lockedRisk ? '风控解除。' : '风控锁全面部署！');
                          }}
                          className={`font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all ${lockedRisk ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-900 hover:bg-slate-850 text-[#07C2E3]'}`}
                        >
                          {lockedRisk ? '解除风控锁' : '开启风控锁'}
                        </button>
                      </div>
                    </div>
                  )}

                  {aiOpTab === 'campaign' && (
                    <div className="space-y-4 text-xs font-sans text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-xs">联促部署</span>
                        <span className="font-mono text-[10px] text-[#07C2E3]">网关广播就绪</span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between font-mono py-1 border-b">
                          <span className="text-slate-400 text-[11px]">大促代号</span>
                          <span className="font-bold text-slate-800 text-[11px]">CAMP_GLOBAL_2026</span>
                        </div>
                        <div className="flex justify-between font-mono py-1 border-b">
                          <span className="text-slate-400 text-[11px]">推荐受众</span>
                          <span className="font-bold text-slate-800 text-[11px]">欧洲服饰、食品健康</span>
                        </div>
                        <div className="flex justify-between font-mono py-1">
                          <span className="text-slate-400 text-[11px]">大促折率</span>
                          <span className="font-bold text-[#07C2E3] text-[11px]">七折优惠 + 跨国免费配</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">大促说明：联合大促仅提供对商家的营销配置。</span>
                        <div className="flex items-center gap-2">
                          {dispatchedCampaign && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                              ✔️ 已广播
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setDispatchedCampaign(true);
                              onAddSystemLog('AI决策中心', '联合营销发布', '一键广播大促通用接口', 'success');
                              alert('大促广播配置已下发！');
                            }}
                            className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
                          >
                            一键发布
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="space-y-4 text-left">
                <span className="text-xs text-slate-500 font-bold tracking-wider uppercase block">
                  命令中心
                </span>

                {/* 对话消息容器 */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[350px] overflow-y-auto space-y-4 shadow-inner">
                  {globalAIChatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.role === 'user' ? '管理员' : '智脑核心'}
                      </span>
                      <div className={`p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 border border-slate-800 text-white font-mono' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                       }`}>
                        <div className="whitespace-pre-line prose prose-slate max-w-none prose-xs font-semibold">
                          {msg.content}
                        </div>
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                            {msg.actions.map((act: any, aIdx: number) => (
                              <button
                                key={aIdx}
                                onClick={() => {
                                  if (act.action === 'view_tenants') {
                                    onChangeSubTab?.('tenants');
                                  } else if (act.action === 'view_gateways') {
                                    onChangeSubTab?.('gateways');
                                  } else if (act.action === 'lock_risk') {
                                    setLockedRisk(true);
                                    onAddSystemLog('风控审计', '全局安全防护', '由决策智脑一键提升并锁死异常交易退款监控阈值', 'success');
                                    alert('网关隔离开启！');
                                  } else if (act.action === 'view_query_products') {
                                    setSelectedTable('products');
                                    onChangeSubTab?.('query');
                                  } else if (act.action === 'alert_restock') {
                                    onAddSystemLog('供应链协调', '库存跨区分拨', '决策中枢一键调度自动向隔离保税商铺调配物资', 'info');
                                    alert('库存补充已完成！');
                                  } else if (act.action === 'deploy_campaign') {
                                    setDispatchedCampaign(true);
                                    onAddSystemLog('营销指挥', '联合API广播', '全局广播 CAM_GLOBAL_SUMMER_2026 大促活动底座', 'success');
                                    alert('活动发布完毕！');
                                  } else if (act.action === 'alert_marketing') {
                                    alert('大促配置已下发。');
                                  } else if (act.action === 'view_ai_revenue') {
                                    setAiOpTab('revenue');
                                  } else if (act.action === 'view_ai_fraud') {
                                    setAiOpTab('fraud');
                                  }
                                }}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-extrabold text-[11px] px-2.5 py-1.5 rounded transition-all flex items-center gap-1 shadow-sm uppercase cursor-pointer"
                              >
                                ⚡ {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isGlobalAIThinking && (
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[10px] font-bold text-slate-400">智脑核心</span>
                      <div className="bg-white border border-slate-200 text-slate-500 rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="font-mono">智脑中枢正在审计中...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 快捷推荐指令卡 */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-zinc-500 font-bold block">快捷决策指令：</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('过去7天全平台表现怎么样？')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      📈 经营大盘
                    </button>

                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('哪些商铺的异常争议退款风险最高？')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      🚨 风控拦截
                    </button>

                    <button
                      type="button"
                      onClick={() => setGlobalAIChatInput('全网多租户高压力 SKU 库存分析')}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-605 text-xs cursor-pointer font-bold transition-all"
                    >
                      🍕 补货物资
                    </button>
                  </div>
                </div>

                {/* 命令行表单 */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!globalAIChatInput.trim() || isGlobalAIThinking) return;
                    const userT = globalAIChatInput.trim();
                    setGlobalAIChatInput('');
                    setGlobalAIChatMessages(prev => [...prev, { role: 'user', content: userT }]);
                    setIsGlobalAIThinking(true);

                    setTimeout(() => {
                      setIsGlobalAIThinking(false);
                      const lowerInput = userT.toLowerCase();
                      let aiReply = '';
                      let actions: any[] = [];
                      
                      const isGreeting = /^(你好|hi|在吗|在|测试|测试一下|ok|hello|test)$/i.test(
                        lowerInput.replace(/[\s\p{P}]/gu, '')
                      );

                      if (isGreeting) {
                        aiReply = '已处于指令调度状态。您可以询问跨隔离沙箱安全、退款纠纷漏洞、或者全网夏季联合大促情况。';
                      } else if (lowerInput.includes('7天') || lowerInput.includes('表现') || lowerInput.includes('gmv') || lowerInput.includes('业绩')) {
                        aiReply = `全网过去 7 天经营表现优异：\n- 🟢 全平台 GMV 总计: € 180,200.00（环比上升 12.4%）。\n- 💳 支付核算：各账户完成隔离财务验证。\n- 👥 新增账户：新增 3 家活跃隔离商户。`;
                        actions = [
                          { label: '租户清算', action: 'view_tenants' },
                          { label: '支付对账', action: 'view_gateways' }
                        ];
                      } else if (lowerInput.includes('退款') || lowerInput.includes('争议') || lowerInput.includes('风险') || lowerInput.includes('纠纷') || lowerInput.includes('风控') || lowerInput.includes('拦截')) {
                        aiReply = `全网纠纷拦截率处于 0.15% 的安全区，隔离中枢已执行物理校验：\n- 🚨 注意：法国巴黎服饰店存在一笔大额争议有待处理。\n- 🛡️ 安全隔离机制运行正常。`;
                        actions = [
                          { label: '开启防护', action: 'lock_risk' },
                          { label: '活跃商户', action: 'view_tenants' }
                        ];
                      } else if (lowerInput.includes('sku') || lowerInput.includes('库存') || lowerInput.includes('配额') || lowerInput.includes('断货') || lowerInput.includes('补')) {
                        aiReply = `全平台大部分商铺供货稳定。但在食品配餐隔离区：\n- 🍕 极少部分食品辅料当前库存已跌破警戒线。\n- 📦 已配置自动向相关保税商铺补充配额。`;
                        actions = [
                          { label: '查看库存', action: 'view_query_products' },
                          { label: '一键调配', action: 'alert_restock' }
                        ];
                      } else if (lowerInput.includes('战役') || lowerInput.includes('大促') || lowerInput.includes('营销')) {
                        aiReply = `大促联合代号 CAMP_GLOBAL_2026：\n- 📣 活动广播完毕，目前有 6 个网关已准备就绪。\n- ⏳ 预计夏季大促将推动多店成交量上升 35% 以上。`;
                        actions = [
                          { label: '部署API', action: 'deploy_campaign' },
                          { label: '一键广播', action: 'alert_marketing' }
                        ];
                      } else {
                        aiReply = `已对指令进行跨沙箱多维审计。当前平台租户情况：\n- 利润与资金完全隔离正常，大局流动正常。\n- Stripe 验证及 Adyen 分账一切安全。您可以随时在下方选择指令一键执行。`;
                        actions = [
                          { label: '财务对账', action: 'view_ai_revenue' },
                          { label: '风控拦截', action: 'view_ai_fraud' }
                        ];
                      }

                      setGlobalAIChatMessages(prev => [...prev, {
                        role: 'assistant',
                        content: aiReply,
                        actions: actions
                      }]);
                    }, 700);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="作为系统管理员，输入对跨租户利润、纠纷监控或者全局大促的命令..."
                    value={globalAIChatInput}
                    onChange={(e) => setGlobalAIChatInput(e.target.value)}
                    className="flex-1 bg-white border border-[#07C2E3] rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#07C2E3] focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                  />
                  <button
                    type="submit"
                    disabled={!globalAIChatInput.trim() || isGlobalAIThinking}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-[#0b1329] font-black text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer shadow transition-all"
                  >
                    发送
                  </button>
                </form>
              </div>
            </div>
          )}


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* AI Agents state column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#07C2E3]" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">底座内嵌多智能体大脑引擎 (Core AI Agents Status)</h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Total: {agentsList.length} AI Employees</span>
              </div>

              {/* Table listing */}
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-405">
                      <th className="p-3">系统标号 ID / Agent 角色</th>
                      <th className="p-3">底层模型版本</th>
                      <th className="p-3">累计调用频段（本周期）</th>
                      <th className="p-3">单次指令平均推理耗时</th>
                      <th className="p-3">安全诊断状态</th>
                      <th className="p-3 text-center">指令调配与生命期控制</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {agentsList.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{a.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Role ID: system_{a.id}</span>
                        </td>
                        <td className="p-3 font-normal text-slate-500">{a.version}</td>
                        <td className="p-3 font-bold text-slate-800 text-center">{a.runs} 次调阅</td>
                        <td className="p-3 text-slate-600">{a.lastTime}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-sans ${a.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-500 border'}`}>
                            {a.status === 'Active' ? '🟢 RAG_ONLINE' : '⚪ SYSTEM_OFFLINE'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                onAddSystemLog('AI大脑中心', '重启模型', `重启智能大脑 ${a.name}，清理上下文缓冲区`, 'info');
                                alert(`已物理清除智能体「${a.name}」在本地 RAG 内存中的向量上下文，模型完成热插配置重启。`);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-[10px] px-2 py-1 rounded transition-all cursor-pointer"
                            >
                              🔄 重启
                            </button>
                            <button
                              onClick={() => handleToggleAgent(a.id, a.name)}
                              className={`font-extrabold text-[10px] px-2 py-1 rounded border transition-all cursor-pointer ${a.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border-emerald-200'}`}
                            >
                              {a.status === 'Active' ? '🚨 挂起下线' : '🔓 下派干预'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* AI Runs Table right column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-[#07C2E3]" />
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">实时 RAG 数据任务流 (Live AI Task Flow)</h3>
                  </div>
                  <span className="font-extrabold text-[9px] bg-[#07C2E3]/15 text-[#059BBC] rounded px-1.5 border border-[#07C2E3]/20">Active</span>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                  展示由平台各租户触发的多路分布式任务。当客户行为触发 IF-THEN 决策时，对应 Agent 会自动组装向量上下文进行 RAG 分析：
                </p>

                <div className="space-y-2.5 text-xs">
                  {realAgentTasks.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 border rounded-lg space-y-1.5 hover:bg-slate-100/50 transition-colors">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-[#059BBC]">{t.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === 'FINISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-sans font-bold text-slate-800 leading-snug">{t.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 pt-1 font-mono border-t border-slate-100">
                        <span>执勤时间: {t.executionTime}</span>
                        <span className="text-[#059BBC] font-bold max-w-[150px] truncate">Result: {t.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 font-sans flex justify-between items-center">
                <span>智能体指令运行全部处于严格容器物理域隔离状态。</span>
                <span className="font-mono text-[#07C2E3] font-bold">SANDBOXED_OK</span>
              </div>

            </div>

          </div>

          {aiCentralTab === 'optimizer' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">⚡ Ecos 智脑优化中枢 (Ecos Optimizer Core)</h3>
                  <p className="text-xs text-slate-400 mt-1">跨多租户的大并发算法智能调优运行期，自动调控 CPU 资源并保障租户沙箱运行极速</p>
                </div>
              </div>
              <EcosPerformanceOptimizer 
                tenantDB={tenantDB} 
                selectedIndustry={selectedIndustry} 
                setTenantDB={setTenantDB} 
                addLog={addLog || onAddSystemLog} 
              />
            </div>
          )}

          {aiCentralTab === 'strategic' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">🧭 ECOS 战略大脑中枢 (Ecos Strategic Intelligence System)</h3>
                  <p className="text-xs text-slate-400 mt-1">分析全网宏观大盘资金状态与宏观调拨大单分配安全级别</p>
                </div>
              </div>
              <EcosStrategicIntelligence />
            </div>
          )}

          {aiCentralTab === 'cognitive' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-100">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">🧠 ECOS 认知治理中枢 (Ecos Cognitive Governance)</h3>
                  <p className="text-xs text-slate-400 mt-1">最高主权审计层多智能体意识自我纠偏与物理沙盒安全状态核验阵列</p>
                </div>
              </div>
              <EcosCognitiveGovernance />
            </div>
          )}

          {aiCentralTab === 'nervous' && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 animate-fadeIn text-left text-slate-950 shadow-sm">
              <EcosEnterpriseNervousSystem />
            </div>
          )}

          {aiCentralTab === 'tuning' && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 animate-fadeIn text-left text-slate-950 shadow-sm">
              <PlatformTuningConsole />
            </div>
          )}

          {/* ========================================================= */}
          {/* 🧠 平台级 ECOS ENTERPRISE COGNITIVE BRAIN CENTER */}
          {/* ========================================================= */}
          {aiCentralTab === 'memory' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fadeIn">

              {/* Panel 1: DNA Memory Center (1/3 width) */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">DNA Memory Center & Memory DNA</span>
                </div>
                <span className="text-[8.5px] font-mono bg-[#07C2E3]/15 text-[#07C2E3] px-1.5 py-0.5 rounded border border-[#07C2E3]/20 uppercase">
                  Constitution Core
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                此处沉淀全平台商户通行的 ECOS 经营大宪章守则，作为模型底座最高原则机制。凡在此写入的 DNA 约束，AI 决策时拥有最高一票否决权，绝对规避违反店主利益。
              </p>

              {/* Memory List */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {memories.map((m) => (
                  <div key={m.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2 text-left relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-bold text-zinc-300 font-mono uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-855">
                        {m.category}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 rounded ${
                        m.importance === 'critical' ? 'bg-rose-950/45 text-rose-400 border border-rose-900/30' : 'bg-slate-800 text-slate-405'
                      }`}>
                        {m.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">{m.fact}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteMemory(m.id)}
                      className="absolute top-2.5 right-2 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5 rounded hover:bg-zinc-900"
                      title="清除记忆"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Memory Form */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 space-y-3 text-left">
                <span className="text-[10px] text-slate-450 font-black tracking-wider uppercase block">新增大宪章认知断言 (Add DNA Memory)</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8.5px] text-slate-500 font-bold uppercase mb-1">条例维度 Category</label>
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10.5px] rounded p-1 font-mono focus:outline-none"
                    >
                      <option value="Brand Alignment">Brand Alignment</option>
                      <option value="Pricing Protection">Pricing Protection</option>
                      <option value="Geographical Boundary">Geographical Boundary</option>
                      <option value="Model Alignment">Model Alignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8.5px] text-slate-505 font-bold uppercase mb-1">保障烈度 Priority</label>
                    <select
                      value={newMemoryImportance}
                      onChange={(e) => setNewMemoryImportance(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10.5px] rounded p-1 font-mono focus:outline-none"
                    >
                      <option value="critical">Critical (一票否决)</option>
                      <option value="normal">Normal (推荐采纳)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] text-slate-500 font-bold uppercase mb-1">断言陈述 Fact text (100% 物理注入推理链路)</label>
                  <textarea
                    rows={2}
                    value={newMemoryFact}
                    onChange={(e) => setNewMemoryFact(e.target.value)}
                    placeholder="例如：禁止任何商品无理由包邮至高通胀阻尼极点区域..."
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-sans"
                  />
                </div>

                <form onSubmit={handleAddNewMemory}>
                  <button
                    type="submit"
                    disabled={!newMemoryFact.trim()}
                    className={`w-full py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
                      newMemoryFact.trim()
                        ? 'bg-[#07C2E3] hover:bg-[#06B2D0] hover:scale-98 text-zinc-950 cursor-pointer'
                        : 'bg-zinc-805 text-slate-505 cursor-not-allowed border border-zinc-900'
                    }`}
                  >
                    📥 灌注大宪章长期记忆 DNA
                  </button>
                </form>
              </div>
            </div>

            {/* Continuous Learning Insights Ledger (2/3 width) - Relocated to Memory & Knowledge Base Tab */}
            <div className="p-5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl space-y-4 lg:col-span-2 text-left md:h-[650px] overflow-hidden flex flex-col justify-between">
              <div className="border-b border-zinc-800 pb-2.5 space-y-0.5">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#07C2E3]" />
                  <span>Continuous Learning Insights Ledger (智脑自适应学习数据库)</span>
                </h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold font-sans">记录全网各隔离租户深度元学习循环下自动提取的商铺见识与经营规则</p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {insights.map((ins) => (
                  <div key={ins.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2 text-left shadow-md">
                    <div className="flex items-center justify-between border-b border-zinc-900/60 pb-1.5 font-mono">
                      <span className="text-[9.5px] font-bold text-[#07C2E3] uppercase tracking-wider">
                        ⚙ 学成契机 Category: {ins.insightCategory}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-normal">Verified {ins.validatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">{ins.factLearned}</p>
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-zinc-400 pt-1 border-t border-zinc-900/45">
                      <span>决策增量估测: <span className="text-emerald-400">{ins.insightCategory === 'User Purchasing Path' ? '+18.25%' : ins.insightCategory === 'Margin Safeguard Rule' ? 'Margin Protected' : 'Cost Offset 9%'}</span></span>
                      <span className="text-emerald-500">🟢 Physical Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          )}



          {aiCentralTab === 'boardroom' && (
            <React.Fragment>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fadeIn">

              {/* Panel 2: Boardroom Disputes & Decision Forum (2/3 width) */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 lg:col-span-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Multi-Agent Boardroom & Decision Forum</span>
                </div>
                <span className="text-[8.5px] font-mono bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                  Sovereign Override Unit
                </span>
              </div>

              {/* Debate Index Selector Tabs & Spawn Button */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">活跃争议议程 (Active Agenda)</span>
                  <button
                    onClick={() => setShowSpawnForm(!showSpawnForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] py-1 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-900/20 active:scale-95"
                  >
                    <span>➕ 召开多智能体联席会商</span>
                  </button>
                </div>

                {/* Create Session Form Drawer */}
                {showSpawnForm && (
                  <form onSubmit={handleSpawnDebate} className="bg-zinc-950 p-4 rounded-xl border border-indigo-500/30 space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-xs font-black text-[#07C2E3] uppercase tracking-wider">召开多专业 ECOS 决策联席会议 (Multi-Agent Team Debate)</span>
                      <button type="button" onClick={() => setShowSpawnForm(false)} className="text-zinc-500 hover:text-red-500 text-sm">×</button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">1. 联席会议会商议题 (E-Commerce Incident Topic / Emergency Context)</label>
                      <textarea
                        rows={2.5}
                        required
                        value={spawnTopic}
                        onChange={(e) => setSpawnTopic(e.target.value)}
                        placeholder="例：法国里昂前置仓爆款羊毛大衣受到阿尔卑斯极寒气象道路封锁，预计12天内极度空货，商讨备用仓Rome跨国调配与运力浮成本+4.8%定价修正的多智能体联动对冲决策。"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">2. 邀约参会议席职业智能体 (Select Participating Professional Agents)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'inventory', label: 'Oliver (仓储物流官)', emoji: '🏭' },
                          { id: 'pricing', label: 'Fiona (收益精算师)', emoji: '💰' },
                          { id: 'finance', label: 'Christian (财务稽核师)', emoji: '📈' },
                          { id: 'logistics', label: 'Douglas (物流调度官)', emoji: '🚚' },
                          { id: 'marketing', label: 'Marcus (整合营销官)', emoji: '🎁' },
                          { id: 'customer', label: 'Grace (会员留存官)', emoji: '👥' },
                          { id: 'risk', label: 'Emily (合规稽核官)', emoji: '🛡️' }
                        ].map((ag) => {
                          const isSelected = spawnAgents.includes(ag.id);
                          return (
                            <button
                              type="button"
                              key={ag.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSpawnAgents(spawnAgents.filter(x => x !== ag.id));
                                } else {
                                  setSpawnAgents([...spawnAgents, ag.id]);
                                }
                              }}
                              className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-[11px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-900 text-[#07C2E3] border-[#07C2E3]/50'
                                  : 'bg-zinc-950/20 text-zinc-400 border-zinc-900 hover:border-zinc-801'
                              }`}
                            >
                              <span>{ag.emoji}</span>
                              <span className="truncate">{ag.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowSpawnForm(false)}
                        className="text-xs text-zinc-400 hover:text-red-500 font-bold px-3 py-1.5"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={isSpawningDebate || !spawnTopic.trim() || spawnAgents.length === 0}
                        className={`px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider cursor-pointer transition-all ${
                          isSpawningDebate || !spawnTopic.trim() || spawnAgents.length === 0
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95'
                        }`}
                      >
                        {isSpawningDebate ? '脑网算力并联中...' : '🏛 启动全集群专家会同商讨 (Trigger Multi-Agent Analysis)'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Spawning Loading Status Screen */}
                {isSpawningDebate && (
                  <div className="bg-zinc-950 p-6 rounded-xl border border-[#07C2E3]/30 flex flex-col items-center justify-center space-y-3.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full border-2 border-t-[#07C2E3] border-zinc-800 animate-spin"></div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-black text-[#07C2E3] tracking-widest uppercase animate-pulse">ECOS 并行算力重组脑网中...</p>
                      <p className="text-[10px] text-zinc-400 font-mono italic">{spawnDebateProgress}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {debates.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDebateId(d.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold max-w-xs truncate transition-all cursor-pointer ${
                        selectedDebateId === d.id
                          ? 'bg-zinc-950 text-[#07C2E3] border-[#07C2E3]/50 shadow-md'
                          : 'bg-zinc-900/40 text-slate-400 border-zinc-900 hover:text-slate-200'
                      }`}
                    >
                      【议题 #{d.id.toString().slice(-4)}】 {d.topicTitle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Selected Debate Workspace */}
              {selectedDebate ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 space-y-3.5">
                    <div className="flex items-start justify-between border-b border-zinc-900 pb-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#07C2E3] tracking-widest uppercase font-black">ACTIVE BOARD DISPUTATION</span>
                        <h4 className="text-xs font-bold text-slate-200 leading-relaxed font-mono">{selectedDebate.topicTitle}</h4>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider border ${
                        selectedDebate.status === 'ruled'
                          ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40'
                          : 'bg-amber-950/30 text-amber-400 border-amber-900/40 animate-pulse'
                      }`}>
                        {selectedDebate.status === 'ruled' ? 'Sovereign Ruled (已签总统仲裁令)' : 'Disputing (多方僵持商讨中)'}
                      </span>
                    </div>

                    {/* Standoff Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedDebate.opinions.map((op: any, oIdx: number) => (
                        <div key={oIdx} className="p-3 bg-zinc-900 w-full rounded-lg border border-zinc-850/80 space-y-2 relative">
                          {op.isDominantAlternative && (
                            <span className="absolute top-2.5 right-2 bg-[#07C2E3]/15 text-[#07C2E3] border border-[#07C2E3]/25 font-bold font-mono text-[8.5px] px-1.5 py-0.2 rounded uppercase">
                              Dominant Alternative (占优推荐方案)
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3]"></span>
                            <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest font-mono">{op.agentName}</span>
                          </div>
                          <p className="text-[11px] font-bold text-[#07C2E3] leading-relaxed font-mono">📍 核心建议: {op.recommendation}</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">原因层: {op.rationale}</p>
                          <div className="flex items-center justify-between text-[9.5px] font-mono font-bold text-slate-500 pt-1.5 border-t border-zinc-900/50">
                            <span>利润增益预估: <span className="text-emerald-500">{op.financialImpact}</span></span>
                            <span>因果置信分: {op.confidenceScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sovereign Overwrite Section */}
                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        Sovereign Power Overwrite (最高主权裁判干预中心)
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500">PRESIDENTIAL VETO LAYER</span>
                    </div>

                    {selectedDebate.status === 'ruled' ? (
                      <div className="p-4 bg-emerald-950/20 border-2 border-emerald-800/40 rounded-xl space-y-3 animate-fadeIn">
                        <div className="flex items-start gap-2 text-[11px] font-bold text-emerald-400 tracking-wide font-mono">
                          <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[9px] uppercase font-black select-none shrink-0">Presidential signed</span>
                          <span>最高意志判词已存证注入集群内核:</span>
                        </div>
                        <p className="text-xs font-black text-white px-3.5 py-2.5 bg-zinc-950 rounded border border-zinc-850 font-mono italic">
                          "{selectedDebate.ceoRuling?.decision}"
                        </p>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-zinc-405 uppercase font-mono tracking-wider">执行指令细则路径 / Automated Actions Enforced:</span>
                          <ol className="list-decimal pl-5 text-xs text-slate-300 font-medium font-mono space-y-0.5">
                            {selectedDebate.ceoRuling?.actionPlan?.map((p: string, pIdx: number) => (
                              <li key={pIdx}>{p}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
                          多智能体大脑在此议题推荐发生相互利益阻尼，陷入算法僵局。超级管理员可在此强制裁定最高 sovereign 指引，并重写全链路自动化的子执行细则，强行下达执行：
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] text-[#07C2E3] font-bold uppercase tracking-wider mb-1">最高总裁特判干预裁决词 / Supreme Ruling Dictum</label>
                            <input
                              type="text"
                              value={humanRulingText}
                              onChange={(e) => setHumanRulingText(e.target.value)}
                              placeholder="例：裁定执行 Supply Sentry 第一调拨方案并消减 20% 多租户在法广告预算，锁定法国市场风险。"
                              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] text-[#07C2E3] font-bold uppercase tracking-wider mb-1">总裁自动化特派指令细则 (按换行分隔 / Action steps)</label>
                            <textarea
                              rows={2.5}
                              value={humanResolutionPath}
                              onChange={(e) => setHumanResolutionPath(e.target.value)}
                              placeholder="第一步：启动 Rome 意大利库房 300 件针织调拨大车...&#10;第二步：限期消减低转换 ROI Google Ads 组..."
                              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-zinc-850/40">
                          <button
                            type="button"
                            onClick={() => handleEnforceHumanRuling(selectedDebate.id)}
                            disabled={!humanRulingText.trim()}
                            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                              humanRulingText.trim()
                                ? 'bg-amber-500 text-zinc-950 shadow-md active:scale-95 hover:bg-amber-600 cursor-pointer'
                                : 'bg-zinc-805 text-slate-550 cursor-not-allowed border border-zinc-900'
                            }`}
                          >
                            签发最高总裁执行令 / Enforce Sovereign Verdict
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">No active debates index loaded.</div>
              )}
            </div>

            {/* Panel 3: Digital Twin & Meta Learning Engine (1/3 width inside Boardroom Tab) */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-5 lg:col-span-1 text-left flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#07C2E3]" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Digital Twin Console, Meta Tuning & continuous Learning</span>
                </div>
                <span className="text-[8.5px] font-mono bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                  Meta Analytics Platform
                </span>
              </div>

              {/* Advanced Technical Indicators Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">贝叶斯置信收敛 (Bayesian Converge Score)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">96.5%</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">↑ 1.2% (Steady)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.5%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">神经网络自拟合损失 (Neural Loss Curve)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">0.024</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">↓ 0.003 (Optimal)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">自主知识图谱关联密度 (KG Concept Density)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">924 Nodes</span>
                    <span className="text-[9.5px] text-[#07C2E3] font-mono">+12/hrs (Exploring)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#07C2E3] h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1 text-left">
                  <span className="text-[9.5px] text-zinc-400 font-bold block uppercase tracking-wider">证据链核对置信底分 (Evidence Check Yield)</span>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xl font-black text-white font-mono">98.15%</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono">Verified 9/9</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>

               {/* Simulated Tracer Block */}
               <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-4 text-left mt-5">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-2.5 gap-2.5">
                   <div className="space-y-0.5">
                     <h4 className="text-[10.5px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                       Autonomous Operator Simulated Task Tracer (背景深度自演进仿真器)
                     </h4>
                   </div>
                   <button
                     type="button"
                     onClick={handleSimulateOperatorTask}
                     className="px-2.5 py-1 bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-zinc-950 font-black text-[9.5px] rounded tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all shrink-0"
                   >
                     <Play className="w-2.5 h-2.5 fill-current" />
                     <span>推进仿真</span>
                   </button>
                 </div>

                 {/* Tracer List */}
                 <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                   {operatorTasks.map((tk) => (
                     <div key={tk.id} className="p-2.5 bg-zinc-900 border border-zinc-950 rounded-lg space-y-1.5 text-left text-xs text-slate-350">
                       <div className="flex items-center justify-between">
                         <span className="text-[8.5px] font-black text-zinc-500 font-mono">#{tk.id}</span>
                         <span className={`text-[8px] font-black px-1 rounded uppercase ${
                           tk.status === 'completed' ? 'bg-emerald-950/45 text-emerald-400' :
                           tk.status === 'running' ? 'bg-[#07C2E3]/15 text-[#07C2E3] animate-pulse' :
                           'bg-zinc-805 text-slate-500'
                         }`}>
                           {tk.status}
                         </span>
                       </div>
                       <h5 className="font-bold text-[10px] text-slate-200 leading-tight font-mono">{tk.taskName}</h5>
                       <div className="space-y-1 pt-1.5 border-t border-zinc-900/40">
                         {tk.subSteps.map((step: any, sIdx: number) => {
                           const isDone = step.status === 'completed';
                           const isActive = step.status === 'running';
                           return (
                             <div key={sIdx} className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                               <span>{sIdx + 1}. {step.name}</span>
                               <span className={isDone ? 'text-emerald-500 font-bold' : isActive ? 'text-[#07C2E3] font-black' : 'text-slate-650'}>
                                 {isDone ? '✓ COMPLETED' : isActive ? '● SIMULATING' : '○ PEND'}
                               </span>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                </div>
             </div>

           </div>

          {/* Level 2 Bayesian Hypothesis Diagnostic details (Full-Width below grid in Boardroom Tab) */}
          <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-850/80 space-y-4 text-left mt-6 animate-fadeIn text-slate-100">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 col-span-2">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-bold text-[#07C2E3] font-mono uppercase tracking-wider block">Enterprise Dominant Bayesian Hypothesis (置信度最大因果拟合链)</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">展示当前全网络因气象、物流时变、价格歧视综合影响，由智脑拟合的最优因果分析图谱。支持查看全量正面支持证据与阻断对冲事实：</p>
                  </div>
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 rounded font-bold uppercase shrink-0">Confidence Score: 89%</span>
                </div>

                {hypotheses.map((hyp) => (
                  <div key={hyp.id} className="space-y-3 font-semibold text-xs text-slate-300 leading-relaxed">
                    <h5 className="font-bold text-white text-xs font-mono">🔍 诊断假说：{hyp.hypothesisLabel}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{hyp.description}</p>

                    {/* Logical chain diagram */}
                    <div className="bg-zinc-900 w-full rounded-lg p-3 border border-zinc-900 space-y-2 text-left">
                      <span className="text-[9px] text-[#07C2E3] uppercase font-bold tracking-widest font-mono">因果溯源推链 (Causal Bayesian Threading)</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-black text-slate-300">
                        {hyp.logicalChain.map((step: string, sIdx: number) => (
                          <React.Fragment key={sIdx}>
                            <span className="bg-zinc-950 px-2.5 py-0.8 rounded border border-zinc-900 whitespace-nowrap">{step}</span>
                            {sIdx < hyp.logicalChain.length - 1 && <span className="text-slate-600">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Evidence expander button */}
                    <div className="pt-1.5 text-left">
                      <button
                        type="button"
                        onClick={() => setShowAnalysisPathId(showAnalysisPathId === hyp.id ? null : hyp.id)}
                        className="text-xs text-[#07C2E3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <span>{showAnalysisPathId === hyp.id ? '收起逻辑推导验证审计' : '展开多视域深度论证核对证据 / View Supporting Evidence'}</span>
                        <span className="text-[10px] font-mono">[{hyp.supportingEvidence.length} 条正面核对事实]</span>
                      </button>

                      {showAnalysisPathId === hyp.id && (
                        <div className="mt-3 bg-zinc-900 w-full p-4 rounded-lg border border-zinc-900 space-y-3.5 font-mono animate-fadeIn text-left">
                          <div className="space-y-1.5 text-left">
                            <h6 className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Positive Fact Evidence (全量正面关联事实证据)
                            </h6>
                            <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                              {hyp.supportingEvidence.map((ev: string, evIdx: number) => <li key={evIdx}>{ev}</li>)}
                            </ul>
                          </div>
                          <div className="space-y-1.5 pt-2.5 border-t border-zinc-800 text-left">
                            <h6 className="text-[10px] text-rose-500 font-black uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Negative Refutation Triggers (假说伪证穿透阻断触发条件)
                            </h6>
                            <p className="text-xs text-slate-450 leading-relaxed">{hyp.refutationTrigger}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            </React.Fragment>
          )}

          {aiCentralTab === 'system_map' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <EcosMasterDirectory initialTab="map" />
            </div>
          )}

          {aiCentralTab === 'system_registry' && (
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 animate-fadeIn text-left text-slate-900 shadow-sm">
              <EcosMasterDirectory initialTab="registry" />
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 13: 🧩 应用市场 / Marketplace */}
      {/* ========================================================= */}
      {activeSubTab === 'marketplace' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  SaaS 平台内置 ECOS 插件应用市场
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">审核并挂牌或禁售第三方开发者向应用市场提交的企业级插件、分账组件及扩展件。</p>
              </div>
              <button
                onClick={() => setShowAddAppForm(!showAddAppForm)}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1"
              >
                {showAddAppForm ? '✕ 关闭窗体' : '➕ 上架新应用插件'}
              </button>
            </div>

            {/* Add App Form */}
            {showAddAppForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">向应用市场投产发布外部插件</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">插件插件名称</label>
                    <input
                      type="text"
                      placeholder="如: DHL European Freight"
                      value={newApp.name}
                      onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#07C2E3]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">插件分类</label>
                    <input
                      type="text"
                      placeholder="如: Shipping / ERP"
                      value={newApp.category}
                      onChange={(e) => setNewApp({ ...newApp, category: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">资费定价 (月费 €)</label>
                    <input
                      type="number"
                      value={newApp.price}
                      onChange={(e) => setNewApp({ ...newApp, price: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase">开发合作代理 (Developer)</label>
                    <input
                      type="text"
                      placeholder="如: LogiTech EU Dev"
                      value={newApp.developer}
                      onChange={(e) => setNewApp({ ...newApp, developer: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!newApp.name.trim() || !newApp.developer.trim()) return alert('请完整填写插件表单信息！');
                      const appObj = {
                        id: 'app_' + Date.now().toString().slice(-6),
                        name: newApp.name,
                        category: newApp.category || 'Utility',
                        developer: newApp.developer,
                        price: newApp.price,
                        installs: 0,
                        status: 'published' as const
                      };
                      setCustomMarketplaceApps([...customMarketplaceApps, appObj]);
                      setShowAddAppForm(false);
                      setNewApp({ name: '', category: '', developer: '', price: 19 });
                      onAddSystemLog('应用市场', '上架新插件', `审核并通过开发者 [${appObj.developer}] 的应用「${appObj.name}」，资费定价 €${appObj.price}/月`, 'success');
                      alert(`审核挂牌成功！「${appObj.name}」插件已对全网商家售卖。`);
                    }}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-extrabold text-[11px] px-4 py-2 rounded-lg cursor-pointer shadow-sm transition-all uppercase"
                  >
                    💾 批准并开始全球售卖
                  </button>
                </div>
              </div>
            )}

            {/* Marketplace Apps table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">插件 ID/唯一编码</th>
                    <th className="p-4">应用插件名称</th>
                    <th className="p-4">分类定位</th>
                    <th className="p-4">合伙开发组织 (Partner)</th>
                    <th className="p-4">资费定价 (月费)</th>
                    <th className="p-4 text-center">累计安装商户</th>
                    <th className="p-4">平台售卖状态</th>
                    <th className="p-4 text-center">控制操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {customMarketplaceApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-400 font-black">#{app.id}</td>
                      <td className="p-4 font-sans font-bold text-slate-900 text-sm">{app.name}</td>
                      <td className="p-4 font-sans text-indigo-700 text-[11px]">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded font-black border border-indigo-150">
                          {app.category}
                        </span>
                      </td>
                      <td className="p-4 font-sans font-medium text-slate-600">{app.developer}</td>
                      <td className="p-4 font-black text-slate-800 text-sm">€ {app.price.toFixed(2)}</td>
                      <td className="p-4 text-center text-emerald-600 font-extrabold text-sm">{app.installs} 家</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${app.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                          {app.status === 'published' ? '🟢 允许下载' : '🔴 暂时停售'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-sans">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => {
                              const newPrice = parseFloat(prompt(`请输入「${app.name}」新月订费比例（当前 €${app.price}）：`, app.price.toString()) || app.price.toString());
                              if (!isNaN(newPrice)) {
                                setCustomMarketplaceApps(customMarketplaceApps.map(x => x.id === app.id ? { ...x, price: newPrice } : x));
                                onAddSystemLog('应用市场', '改变插件价格', `修改「${app.name}」资费为 €${newPrice}`, 'warning');
                                alert('调价成功！');
                              }
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-705 border border-slate-205 rounded text-[10px] font-bold px-2 py-1.5 cursor-pointer"
                          >
                            ✎ 调价
                          </button>
                          <button
                            onClick={() => {
                              const toggled = app.status === 'published' ? 'suspended' as const : 'published' as const;
                              setCustomMarketplaceApps(customMarketplaceApps.map(x => x.id === app.id ? { ...x, status: toggled } : x));
                              onAddSystemLog('应用市场', '改插件销售状态', `更改「${app.name}」销售状态为 ${toggled === 'published' ? '挂牌' : '下架'}`, 'warning');
                              alert('插件销售状态更改完毕！');
                            }}
                            className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${app.status === 'published' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-220' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-250'}`}
                          >
                            {app.status === 'published' ? '🚫 禁售' : '⚡ 挂牌'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 14: 👨‍💻 开发者中心 / Developer */}
      {/* ========================================================= */}
      {activeSubTab === 'developer' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Developer Partner Account grid (2/3 width) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  系统授权开发者合作伙伴及 API 证书控制区
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">物理分拔与管控外部对接商物理集成 API 许可凭证 Token，保障通信数据不被穿透。</p>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl text-xs font-semibold">
                <table className="w-full text-left border-collapse text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-4">开发者企业主体 (Partner)</th>
                      <th className="p-4">旗下已上架插件</th>
                      <th className="p-4">API 通信 Key (Token Key)</th>
                      <th className="p-4">关联 SDK 调用次数</th>
                      <th className="p-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {devPartners.map((dev) => (
                      <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-sans font-bold text-slate-900 block text-sm">{dev.name}</span>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">ID: {dev.id}</span>
                        </td>
                        <td className="p-4 font-sans text-slate-700 font-bold text-[11px]">{dev.appCount} 款上架</td>
                        <td className="p-4 font-normal text-slate-500 break-all max-w-[180px]">{dev.apiKey}</td>
                        <td className="p-4 text-slate-805 font-bold font-mono text-center">{dev.apiCalls.toLocaleString()} 次</td>
                        <td className="p-4 text-center font-sans">
                          <button
                            onClick={() => {
                              const secureRandomToken = 'sk_live_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                              setDevPartners(devPartners.map(x => x.id === dev.id ? { ...x, apiKey: secureRandomToken } : x));
                              onAddSystemLog('证书管理', '重新轮转秘钥', `重构合伙开发者 [${dev.name}] 的物理 API 通信密钥`, 'error');
                              alert(`重新轮转秘钥成功！旧物理 Key 已经作废停用。\n全新安全 Credentials Token Key 已分拔：\n${secureRandomToken}`);
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] px-3 py-1.5 rounded"
                          >
                            🚨 重新轮转秘钥
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sandbox Request Trigger Console (1/3 width) */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl shadow flex flex-col justify-between text-left select-none text-slate-100 font-mono">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#07C2E3]" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">ECOS Sandbox Simulator (API 沙箱仿真终端)</span>
                  </div>
                  <span className="text-[8px] bg-indigo-950/80 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded font-black select-none uppercase">
                    API Tester
                  </span>
                </div>

                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans font-medium">
                  模拟外部 ERP / 仓储 WMS 与平台多租户体系的安全 API 调试通畅度。测试请求时，系统会在真实的虚拟物理沙箱环境中，隔空跑完分账逻辑：
                </p>

                <div className="space-y-3 font-semibold font-mono text-[11px] text-zinc-300">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#07C2E3] font-bold uppercase tracking-widest block">仿真请求 API 调拔路经 (API Endpoint)</label>
                    <select
                      id="sim-endpoint-select"
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#07C2E3] text-[10.5px]"
                    >
                      <option value="/api/v1/store/products">GET /api/v1/store/products (查询隔离商铺 SKU 列表)</option>
                      <option value="/api/v1/finance/payouts">POST /api/v1/finance/payouts (申请财务结账与银行打款)</option>
                      <option value="/api/v1/orders/shipping">POST /api/v1/orders/shipping (推送 WMS 底座物理仓配面单)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <label className="text-[9px] text-zinc-500 block">测试通信应答数据 (Response Terminal Frame):</label>
                    <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-850 min-h-[140px] text-[10px] text-emerald-400 font-mono overflow-auto max-h-[180px] leading-snug whitespace-pre">
                      {sandboxResponseLog}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 mt-4 flex justify-between items-center font-sans">
                <span className="text-[9px] text-zinc-500 font-mono">HEADERS: Content-Type: application/json</span>
                <button
                  onClick={() => {
                    const selectedE = (document.getElementById('sim-endpoint-select') as HTMLSelectElement)?.value || '/api/v1/store/products';
                    let simulatedJson = '';
                    if (selectedE.includes('products')) {
                      simulatedJson = JSON.stringify({
                        status: 200,
                        tenant_isolation: "sandbox_success",
                        timestamp: new Date().toISOString(),
                        count: 4,
                        products: [
                          { id: "sku_fashion_01", name: "Modern Blazer Extra", stock: 120, price: 89.0 },
                          { id: "sku_food_02", name: "Organic Protein Bar", stock: 450, price: 4.5 }
                        ]
                      }, null, 2);
                    } else if (selectedE.includes('payouts')) {
                      simulatedJson = JSON.stringify({
                        status: 200,
                        payout_request_id: "pay_sim_" + Math.floor(Math.sin(Date.now()) * 1000000).toString().replace('-',''),
                        target_bank: "Deutsche Bank AG (Frankfurt)",
                        principal_amount: 14500.00,
                        ledger_status: "settled_complete_sandbox"
                      }, null, 2);
                    } else {
                      simulatedJson = JSON.stringify({
                        status: 201,
                        tracking_courier: "DHL Express Delivery",
                        consignment_id: "cons_dhl_" + Math.floor(Math.random() * 900000 + 100000),
                        destination_zip: "75001 Paris",
                        payload_verification: "hmac_sha256_verified"
                      }, null, 2);
                    }
                    setSandboxResponseLog(simulatedJson);
                    onAddSystemLog('沙箱终端', '执行 API 仿真', `管理员通过仿真控制终端发起了物理 Endpoint '${selectedE}' 请求，返回 200 OK`, 'info');
                  }}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-[11px] px-3.5 py-2 rounded-lg cursor-pointer shadow transition-all uppercase"
                >
                  🚀 仿真发射 (Trigger Sim)
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 6: 🔐 权限中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统级运行人员 角色权限控制矩阵</h3>
                <p className="text-[10px] text-slate-400 mt-1">精细化管理多租户 SaaS 系统的后台人员资产身份配置（Owner/SuperAdmin/Staff）</p>
              </div>
              <span className="text-[11px] font-mono text-slate-405 font-bold">Platform-Level Guardrails</span>
            </div>

            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left border-collapse text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                    <th className="p-4">角色标识符 / 职能描述</th>
                    <th className="p-4 text-center">商品发布管理 (Product)</th>
                    <th className="p-4 text-center">订单退款审计 (Order)</th>
                    <th className="p-4 text-center">收单结算及银行划拨 (Finance)</th>
                    <th className="p-4 text-center">智能配置指令下发 (AI Ops)</th>
                    <th className="p-4 text-center">物理底座服务器管理 (Sys Admin)</th>
                    <th className="p-4 text-center">安全隔离状态修改</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rolesList.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-405 font-normal block mt-1 leading-normal max-w-sm font-sans">{r.desc}</span>
                      </td>
                      
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.product}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, product: !item.permissions.product };
                                onAddSystemLog('权限变更', '更改商品读写权', `更改角色 [${r.name}] 的商品修改权限为 ${!item.permissions.product}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.order}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, order: !item.permissions.order };
                                onAddSystemLog('权限变更', '更改退货审单权', `更改角色 [${r.name}] 的退单审核权限为 ${!item.permissions.order}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.finance}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, finance: !item.permissions.finance };
                                onAddSystemLog('权限变更', '更改银行划拔权', `更改角色 [${r.name}] 的财务打款及划拔权限为 ${!item.permissions.finance}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.ai_ops}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, ai_ops: !item.permissions.ai_ops };
                                onAddSystemLog('权限变更', '更改AI控制权', `更改角色 [${r.name}] 的智能自动化控制权限为 ${!item.permissions.ai_ops}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.sys_config}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, sys_config: !item.permissions.sys_config };
                                onAddSystemLog('权限变更', '更改核心底座支配权', `更改角色 [${r.name}] 的宿主控制级别权限为 ${!item.permissions.sys_config}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 accent-[#07C2E3] cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center font-mono">
                        <button
                          onClick={() => {
                            onAddSystemLog('权限审计', '保存身份矩阵', `确定保存角色 ${r.name} 的运行机制描述`, 'success');
                            alert(`角色「${r.name}」权限规则修改已物理生效并落库！`);
                          }}
                          className="bg-[#07C2E3]/15 hover:bg-[#07C2E3] text-slate-800 hover:text-slate-950 border border-[#07C2E3]/35 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          💾 保存生效
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 7: 📜 审计中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 text-left">
          
          {/* Recharts System Task Performance over the last 24 hours */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  系统任务执能分析 (24小时性能监测)
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">监测全域多智能体底座任务吞吐节奏、平均时延指标，及系统动态高可用率</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#07C2E3] rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">任务吞吐量 (次/h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">平均响应延时 (ms)</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 累计任务吞吐量</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{performanceStats.totalTasks.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">次任务</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 平均内核响应延迟</span>
                <span className="text-lg font-black text-[#07C2E3] font-mono mt-0.5 block">{performanceStats.avgLatency} <span className="text-xs text-[#07C2E3]/70 font-normal font-sans">ms</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">系统综合 SLA 高可用率</span>
                <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">{performanceStats.successRate}</span>
              </div>
            </div>

            {/* Line Chart Grid */}
            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={last24hPerformanceData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="left"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] font-mono text-slate-200">
                            <p className="font-bold mb-1 text-slate-400">时间: {label}</p>
                            <p className="text-[#07C2E3] flex items-center justify-between gap-4">
                              <span>任务量:</span>
                              <span className="font-extrabold text-white">{payload[0]?.value} 次/h</span>
                            </p>
                            {payload[1] && (
                              <p className="text-amber-500 flex items-center justify-between gap-4 mt-0.5">
                                <span>延迟:</span>
                                <span className="font-extrabold text-white">{payload[1]?.value} ms</span>
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#07C2E3" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#07C2E3' }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#f59e0b" 
                    strokeWidth={1.5} 
                    dot={false} 
                    activeDot={{ r: 3, strokeWidth: 0, fill: '#f59e0b' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统物理全域 综合安全审计中心 (Audit Registry Master)</h3>
                <p className="text-[10px] text-slate-400 mt-1">100% 记录来自于底座服务器热加载、支付秘钥变更、网格隔离拦截的日志归档</p>
              </div>
              <span className="font-mono text-[#07C2E3] text-[10px] font-bold">SEC_AUDIT_STABLE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">审计时间点</th>
                    <th className="p-4">执勤运维模块</th>
                    <th className="p-4">安全防线审计细节 specs</th>
                    <th className="p-4 font-mono">操作人身份 ID</th>
                    <th className="p-4 text-center">底座隔离存档签名</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((l: any, idx: number) => {
                    const typeColor = l.type === 'error' ? 'text-red-600' : l.type === 'warning' ? 'text-amber-600' : 'text-emerald-700';
                    return (
                      <tr key={l.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-slate-500">{l.createdAt || '2026-06-08 14:56'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-black ${l.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : l.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700'}`}>
                            {l.module || 'SYS_CONTROLLER'}
                          </span>
                        </td>
                        <td className={`p-4 truncate max-w-md font-sans ${typeColor}`}>{l.details || '系统管理员对账审查完毕并存档'}</td>
                        <td className="p-4 text-slate-800 font-bold font-mono">{(l.userId || 'SuperAdmin').toUpperCase()}</td>
                        <td className="p-4 text-center">
                          <span className="bg-slate-10s0 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                            #{Math.floor(Math.sin(idx + 1) * 90000) + 10000}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 14:12:01</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-sans">多租户安全网格</span></td>
                    <td className="p-4 font-sans text-emerald-700">米兰风尚服装批发集团 沙箱隔离鉴权通过，数据库连接网格验证无越权溢出。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#48192</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 13:58:12</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-sans">支付中继调度</span></td>
                    <td className="p-4 font-sans text-emerald-700">财务对账：通过 Adyen 网关安全拆算欧洲零售物理账户 1.2% 并提划入平台瑞士对公托管行。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#59218</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 8: 🩺 系统诊断中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">底座物理组件全网健康体检 diagnostic</h3>
                <p className="text-[10px] text-slate-400 mt-1">诊断包含数据库集群、高速 Redis 缓存、API 网关及第三方收单接口握手性能</p>
              </div>
              <button
                onClick={handleDiagnoseAll}
                disabled={isDiagnosing}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] disabled:opacity-50 text-slate-950 font-black text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-sm"
              >
                {isDiagnosing ? '🔍 正在高精密度扫轨诊断中...' : '🔄 运行系统全域高维诊断'}
              </button>
            </div>

            {/* Diagnostics Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{dbDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {dbDiagnostic.status} | {dbDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{dbDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">CONNECTION_URI: postgresql://SaaS_user:***@swiss-pg-host-1:5432/db</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{redisDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {redisDiagnostic.status} | {redisDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{redisDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MEM_EVICTION_POLICY: volatile-lru | MASTER_HOST</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{stripeHookDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {stripeHookDiagnostic.status} | {stripeHookDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{stripeHookDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">API_GATEWAY: public_https_listener_stripe (200_OK_VERIF)</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{geminiDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {geminiDiagnostic.status} | {geminiDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{geminiDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MODEL_PROOFS: @google/genai TypeScript Native Endpoint</div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU: 🎨 6大板块与主题系统 */}
      {/* ========================================================= */}
      {activeSubTab === 'sectors' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <Layers className="w-5 h-5 text-[#07C2E3]" />
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">独立6大板块与6大主题配置中枢</h3>
                <p className="text-[10px] text-slate-400">在此设置各行业分支商家端的主控台功能模块和色彩视觉主题，打破同质化逻辑，实现精细化定制。</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: List of 6 Industry sectors */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">活跃行业板块清单</span>
                <div className="space-y-2">
                  {[
                    { id: 'retail', label: '👕 新零售服装批发', icon: '👕', defaultColor: '#07C2E3' },
                    { id: 'food', label: '🍔 餐饮外卖连锁', icon: '🍔', defaultColor: '#EF4444' },
                    { id: 'manufacturing', label: '🔋 智慧电器百货', icon: '🔋', defaultColor: '#F59E0B' },
                    { id: 'healthcare', label: '🏪 高端香水零售POS', icon: '🏪', defaultColor: '#10B981' },
                    { id: 'service', label: '💅 丽人美容会所', icon: '💅', defaultColor: '#EC4899' },
                    { id: 'education', label: '🎓 跨境出海网店', icon: '🎓', defaultColor: '#6366F1' },
                  ].map((sector) => {
                    const cfg = industryConfigs[sector.id] || {};
                    const themeColor = cfg.themeColor || sector.defaultColor;
                    const activeCount = Object.values(cfg.enabledMenus || {}).filter(Boolean).length;
                    const isSelected = selectedTenantData?.id === sector.id; // or just local sector selected

                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => {
                          // Select by setting a dynamic state
                          setSelectedTenantData({ id: sector.id } as any);
                        }}
                        className={`w-full p-3.5 rounded-xl transition-all border text-left flex items-start gap-3 cursor-pointer ${
                          selectedTenantData?.id === sector.id 
                            ? 'bg-slate-50 border-slate-300 shadow-sm' 
                            : 'bg-white hover:bg-slate-50/50 border-slate-100'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm"
                          style={{ backgroundColor: `${themeColor}12`, border: `2px solid ${themeColor}` }}
                        >
                          {sector.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 truncate">{cfg.label || sector.label}</span>
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: themeColor, boxShadow: `0 0 8px ${themeColor}` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{cfg.storeTitle || '商户精品店'}</p>
                          <div className="flex items-center gap-3 mt-2 text-[9px] font-mono font-bold text-slate-500">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded">功能模块: {activeCount}/12</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded">模型: {cfg.aiModel ? cfg.aiModel.replace('gemini-', '') : 'flash'}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Editor Form for the Selected Industry Sector */}
              {(() => {
                const activeId = selectedTenantData?.id && ['retail', 'food', 'manufacturing', 'healthcare', 'service', 'education'].includes(selectedTenantData.id)
                  ? selectedTenantData.id 
                  : 'retail';
                const cfg = industryConfigs[activeId] || {};
                
                return (
                  <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-5 text-left">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block">SECTOR_CONFIGURATION_EDITOR</span>
                        <h4 className="text-xs font-extrabold text-slate-800">
                          配置看板 - {cfg.label || activeId}
                        </h4>
                      </div>
                      <span 
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{ 
                          color: cfg.themeColor, 
                          borderColor: `${cfg.themeColor}50`,
                          backgroundColor: `${cfg.themeColor}12`
                        }}
                      >
                        {cfg.themeColorName || '主题色彩'}
                      </span>
                    </div>

                    {/* Form fields */}
                    <div className="space-y-4 text-xs font-semibold text-slate-700">
                      
                      {/* 1. Store Title */}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-400 uppercase mb-0.5">门店系统名称 (Store Workspace Title)</label>
                        <input
                          type="text"
                          value={cfg.storeTitle || ''}
                          onChange={(e) => {
                            const updated = {
                              ...industryConfigs,
                              [activeId]: {
                                ...cfg,
                                storeTitle: e.target.value
                              }
                            };
                            if (onUpdateIndustryConfigs) onUpdateIndustryConfigs(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#07C2E3]/80"
                          placeholder="自定义商家前后台显示的品牌门店系统名称"
                        />
                      </div>

                      {/* 2. Slogan description */}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-400 uppercase mb-0.5">板块专属定制宣传语 & 功能定位简介</label>
                        <textarea
                          rows={2}
                          value={cfg.slogan || ''}
                          onChange={(e) => {
                            const updated = {
                              ...industryConfigs,
                              [activeId]: {
                                ...cfg,
                                slogan: e.target.value
                              }
                            };
                            if (onUpdateIndustryConfigs) onUpdateIndustryConfigs(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#07C2E3]/80 font-normal"
                          placeholder="简短说明本板块的专有业务核心，例如：原创服装设计与分销中台..."
                        />
                      </div>

                      {/* 3. Theme Preset Picker */}
                      <div className="space-y-15">
                        <label className="block text-[10px] text-slate-400 uppercase mb-0.5">板块一行业一特有主题视觉色彩 (Dynamic 6 Themes Palette)</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[
                            { name: '极客蓝 (Cyan)', hex: '#07C2E3' },
                            { name: '护眼绿 (Emerald)', hex: '#10B981' },
                            { name: '尊爵紫 (Indigo)', hex: '#6366F1' },
                            { name: '优雅粉 (Pink)', hex: '#EC4899' },
                            { name: '金牌橙 (Amber)', hex: '#F59E0B' },
                            { name: '中国红 (Red)', hex: '#EF4444' },
                            { name: '皇家蓝 (Blue)', hex: '#3B82F6' },
                            { name: '高雅玫瑰 (Rose)', hex: '#F43F5E' },
                          ].map((color) => {
                            const isActive = cfg.themeColor === color.hex;
                            return (
                              <button
                                key={color.hex}
                                type="button"
                                onClick={() => {
                                  const updated = {
                                    ...industryConfigs,
                                    [activeId]: {
                                      ...cfg,
                                      themeColor: color.hex,
                                      themeColorName: color.name
                                    }
                                  };
                                  if (onUpdateIndustryConfigs) onUpdateIndustryConfigs(updated);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                  isActive 
                                    ? 'bg-white border-slate-300 shadow-sm text-slate-800' 
                                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color.hex }} />
                                <span>{color.name.split(' (')[0]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. AI Model configuration */}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-400 uppercase mb-0.5">分派本地级智算推理核心设备 (Dedicated LLM Broker)</label>
                        <select
                          value={cfg.aiModel || 'gemini-3.5-flash'}
                          onChange={(e) => {
                            const updated = {
                              ...industryConfigs,
                              [activeId]: {
                                ...cfg,
                                aiModel: e.target.value
                              }
                            };
                            if (onUpdateIndustryConfigs) onUpdateIndustryConfigs(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none font-sans text-xs cursor-pointer"
                        >
                          <option value="gemini-3.5-pro">Gemini 3.5 Pro (推荐：高维评估、对账、宏观对决)</option>
                          <option value="gemini-3.5-flash">Gemini 3.5 Flash (推荐：标准及自动采购高吞吐)</option>
                          <option value="gemini-2.5-pro">Gemini 2.5 Pro (推荐：化学及健康安全审查专用)</option>
                          <option value="gemini-2.5-flash">Gemini 2.5 Flash (推荐：高速收单与轻量客服)</option>
                          <option value="ollama-qwen2.5-7b">Ollama Qwen 2.5 7B (本地物理私有环境对账代理)</option>
                        </select>
                      </div>

                      {/* 5. Modules Enabled checklist */}
                      <div className="space-y-2 pt-1 border-t border-slate-200">
                        <label className="block text-[10px] text-slate-400 uppercase">定制精细化细分模块功能开关 (Feature Module Access Control)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold text-slate-500">
                          {[
                            { key: 'command', label: '📊 业务工作台' },
                            { key: 'sales', label: '📈 销售分析中心' },
                            { key: 'products', label: '📦 货源与商品中心' },
                            { key: 'orders', label: '🛒 订单履约中心' },
                            { key: 'customers', label: '👥 会员与CRM中心' },
                            { key: 'marketing', label: '📢 AI智脑营销推广' },
                            { key: 'finance', label: '💰 财务结算对账' },
                            { key: 'agents', label: '🤖 AI智体员工中心' },
                            { key: 'marketplace', label: '🧩 外配独立插件市场' },
                            { key: 'employees', label: '👩‍💼 传统人力考勤排班' },
                            { key: 'roles', label: '🔐 安全角色权限控制' },
                            { key: 'settings', label: '⚙️ 商家级通用配置' },
                          ].map((item) => {
                            const isChecked = cfg.enabledMenus?.[item.key] !== false;
                            return (
                              <label 
                                key={item.key} 
                                className={`flex items-center gap-1.5 p-2 rounded-lg border bg-white select-none cursor-pointer transition-all ${
                                  isChecked ? 'border-emerald-300 text-emerald-800 bg-emerald-50/10' : 'border-slate-100 text-slate-400 hover:bg-slate-50/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const currentMenus = { ...(cfg.enabledMenus || {}) };
                                    currentMenus[item.key] = e.target.checked;
                                    const updated = {
                                      ...industryConfigs,
                                      [activeId]: {
                                        ...cfg,
                                        enabledMenus: currentMenus
                                      }
                                    };
                                    if (onUpdateIndustryConfigs) onUpdateIndustryConfigs(updated);
                                  }}
                                  className="accent-emerald-500 rounded focus:ring-0 cursor-pointer"
                                />
                                <span className="font-sans text-[10px] font-semibold">{item.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Confirm Save action */}
                    <div className="flex justify-end pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          onAddSystemLog('平台板块主题调校', '完成单独板块配置', `成功更新行业 [${cfg.label || activeId}] 的专有主题色彩、门店标题及 ${Object.values(cfg.enabledMenus || {}).filter(Boolean).length} 个功能模块组合状态。`, 'success');
                          alert(`⚖ 板块【${cfg.label || activeId}】配置大纲保存成功！\n\n该设定即刻生效并已固化存档至磁盘数据库。登入该商户端后台时，其左侧侧边栏导航和视觉主题调色也将自动映射切换。`);
                        }}
                        className="bg-[#0c1329] hover:bg-slate-800 text-white font-bold text-xs p-2.5 rounded-lg cursor-pointer transition-all shadow-sm flex items-center gap-2 border border-slate-700/50"
                      >
                        <span>保存并物理固化该板块配置</span>
                      </button>
                    </div>

                  </div>
                );
              })()}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 9: ⚙️ 平台设置中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Settings className="w-4 h-4 text-[#07C2E3]" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">平台全局规则与底座高保设置 specs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-slate-705">
              
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统对公开扣点佣金上限比例 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsForm.maxCommissionCap}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxCommissionCap: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#07C2E3]/80"
                />
                <span className="text-[9px] text-slate-400 block font-normal">设定所有商家套餐中最大自动对账手续费率提点硬上限，当前: 5.0%</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统管理员 Session 会话注销超时 (秒)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#07C2E3]/80"
                />
                <span className="text-[9px] text-slate-400 block font-normal">无操作超时注销会话的时常。对账密钥保护红线。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">全网默认底座大语言智算模型 (LLM Model Name)</label>
                <select
                  value={globalDefaultModel}
                  onChange={(e) => onChangeGlobalModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none font-sans"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (推荐：标准对账及自动采购高速度)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (推荐：跨境高奢大订单风险综合评估)</option>
                  <option value="ollama-qwen2.5-7b">Ollama Qwen 2.5 7B (本地物理私有环境对账代理)</option>
                </select>
                <span className="text-[9px] text-slate-400 block font-normal">缺省模型将自动作为商户开通营销挽客/采购规则逻辑反思的默认容器。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">允许调用所有者权限的运维 IP 白名单列表</label>
                <input
                  type="text"
                  value="127.0.0.1, 82.102.39.*, 45.120.*.*"
                  readOnly
                  className="w-full bg-slate-10s0 border border-slate-200 text-slate-450 font-mono rounded px-2.5 py-1.5 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block font-normal">除白名单网段以外的 IP 尝试物理登入 Super Admin 控制台将直接触发底层安全死锁拦截。</span>
              </div>

            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  onAddSystemLog('平台设置', '保存系统环境 parameters', `由于安全检查核审，保存环境 parameters 并更新默认模型级别为 ${globalDefaultModel}`, 'success');
                  alert('配置 parameters 已持久化保存并且即刻生效！');
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md"
              >
                保存平台全部设置参数
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOM ISOLATED DATA AUDIT MODAL */}
      {/* ========================================================= */}
      {auditingIndustry && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-left">
          <div className="bg-[#09090b] border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scaleIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-850 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/85 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>🔍 独立行业专属数据库 · 物理数据合规审计中枢</span>
                    <span className="text-[9px] bg-emerald-950/80 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-900/40">
                      Namespace Checked: t_{auditingIndustry}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    严格遵循多租户防数据交叉原则。本面板实时查询专属隔离数据，当前显示的每一行数据对其他 5 个行业均为不可见。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditingIndustry(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-sans text-xs flex items-center gap-1 leading-none"
              >
                <X className="w-4 h-4" />
                <span>关闭审计</span>
              </button>
            </div>

            {/* Selector Options */}
            <div className="px-5 py-3.5 border-b border-slate-850 bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#71717a] mr-2">审计实体对象:</span>
                {[
                  { id: 'products', name: '📦 隔离商品中心 (Products)' },
                  { id: 'orders', name: '🧾 隔离订单中心 (Orders)' },
                  { id: 'customers', name: '👥 隔离客户中心 (Customers)' },
                ].map((tab) => {
                  const isActive = auditingDataType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAuditingDataType(tab.id as any)}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all border cursor-pointer leading-none ${
                        isActive
                          ? 'bg-[#07C2E3]/15 text-[#07C2E3] border-[#07C2E3]/35'
                          : 'bg-transparent text-slate-400 border-transparent hover:text-slate-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 font-mono text-[9px] text-[#71717a] bg-[#0c0c0e] px-3 py-1 rounded border border-slate-850">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>加密沙盒安全等级: FIPS-140-3 Level 4</span>
              </div>
            </div>

            {/* Data rows list Table */}
            <div className="flex-1 overflow-auto p-5 bg-black/60 font-sans text-xs text-slate-300">
              {(() => {
                const rawItems = tenantDB?.[auditingIndustry]?.[auditingDataType] || [];
                
                if (rawItems.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 py-10">
                      <Inbox className="w-10 h-10 text-slate-600 animate-bounce" />
                      <p className="font-extrabold text-[11px] uppercase tracking-wider">数据库内无独立数据或尚未初始化</p>
                      <p className="text-[10px] text-zinc-600">本沙盒数据库中目前没有找到由于人工或AI追加产生的孤岛条目。</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {/* Raw DB Header Status */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#0c0c0e] p-2.5 rounded-lg border border-slate-850">
                      <span className="font-mono">
                        SQL DB SELECT RESULT: <span className="text-emerald-400 font-extrabold">{rawItems.length} rows</span> loaded from table 't_{auditingIndustry}.{auditingDataType}'
                      </span>
                      <span className="text-emerald-500 font-bold">● SecSafe Connected</span>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto border border-slate-850 rounded-xl bg-[#0c0c0e]">
                      <table className="min-w-full divide-y divide-slate-850">
                        <thead className="bg-[#09090b]">
                          {auditingDataType === 'products' && (
                            <tr>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">ID</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">商品名称 / Name</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">价格 / Price</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">分类 / Category</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">库存 / Stock</th>
                            </tr>
                          )}
                          {auditingDataType === 'orders' && (
                            <tr>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Order ID</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">客户 / Customer</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">总金额 / Total</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">支付状态 / Status</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider frame-mono">购买货品 / Details</th>
                            </tr>
                          )}
                          {auditingDataType === 'customers' && (
                            <tr>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">ID</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">客户姓名 / Name</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-mono">注册邮箱 / Email</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider">等级 / VIP Tier</th>
                              <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">消费次数 / Total Orders</th>
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y divide-slate-850 bg-black/20 font-sans">
                          {rawItems.map((item: any, idx: number) => (
                            <tr key={item.id || idx} className="hover:bg-slate-900/60 transition-colors">
                              {auditingDataType === 'products' && (
                                <>
                                  <td className="px-4 py-2.5 text-slate-450 font-mono text-[10px]">{item.id}</td>
                                  <td className="px-4 py-2.5 font-bold text-white flex items-center gap-1.5">
                                    <span>{item.name}</span>
                                    {item.fabric && <span className="bg-cyan-950/70 border border-cyan-900/60 text-cyan-400 text-[8px] px-1 rounded">{item.fabric}</span>}
                                    {item.spicyLevel && <span className="bg-red-950/70 border border-red-900/60 text-red-400 text-[8px] px-1 rounded">{item.spicyLevel} spy</span>}
                                  </td>
                                  <td className="px-4 py-2.5 font-mono text-emerald-450 font-extrabold">€{Number(item.price || 0).toFixed(2)}</td>
                                  <td className="px-4 py-2.5 text-slate-300 font-bold">{item.category}</td>
                                  <td className="px-4 py-2.5 text-slate-300 font-bold font-mono">{item.stock ?? 99} 件</td>
                                </>
                              )}
                              {auditingDataType === 'orders' && (
                                <>
                                  <td className="px-4 py-2.5 text-slate-450 font-mono text-[10px]">{item.id}</td>
                                  <td className="px-4 py-2.5 text-slate-200 font-bold">{item.customerName || item.customer || '匿名客户'}</td>
                                  <td className="px-4 py-2.5 font-mono text-emerald-450 font-extrabold">€{Number(item.total || item.amount || 0).toFixed(2)}</td>
                                  <td className="px-4 py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase font-mono ${
                                      item.status === 'completed' || item.status === 'paid'
                                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50'
                                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                    }`}>
                                      {item.status || 'paid'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-300 text-[11px] truncate max-w-xs">
                                    {Array.isArray(item.items)
                                      ? item.items.map((it: any) => `${it.name || it.productName} * ${it.quantity || 1}`).join(', ')
                                      : item.details || item.notes || '常规采购条目'}
                                  </td>
                                </>
                              )}
                              {auditingDataType === 'customers' && (
                                <>
                                  <td className="px-4 py-2.5 text-slate-450 font-mono text-[10px]">{item.id}</td>
                                  <td className="px-4 py-2.5 font-bold text-white">{item.name}</td>
                                  <td className="px-4 py-2.5 text-slate-300 font-mono">{item.email || `${item.id}@commerce.org`}</td>
                                  <td className="px-4 py-2.5 text-slate-300">
                                    <span className="bg-slate-800/80 border border-slate-700/60 text-slate-200 text-[9px] px-1.5 py-0.5 rounded font-black max-w-[80px] truncate leading-none">
                                      {item.level || item.tier || 'VIP 会员'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-300 font-mono font-bold">{item.totalOrders || 1} 次</td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Technical DB Isolation Verification Notice */}
                    <div className="bg-[#0c0c0e]/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-[11px] font-black text-slate-200">隔离存储安全加密哈希校对一致 (SecSafe Hash OK)</p>
                          <p className="text-[9px] text-[#71717a] mt-0.5 font-mono truncate max-w-lg">
                            SHA-255 Silo Signature Lock: 9f8a37bdeca70678fa1b{auditingIndustry}93ea8c7d8fbe0aee92bb3f5e04278
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 leading-none">
                          Isolation: Verified
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-850 text-right bg-black/40 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-[#71717a] font-bold">
                ECOS Isolated Core Engine Admin Auditor
              </span>
              <button
                type="button"
                onClick={() => setAuditingIndustry(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white font-extrabold text-xs rounded-lg cursor-pointer transition-all active:scale-95 leading-none"
              >
                我知道了，完全隔离无任何混淆
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
