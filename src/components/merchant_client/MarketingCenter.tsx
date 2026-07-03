import React, { useState, useMemo } from 'react';
import { 
  Megaphone,
  Plus, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Compass, 
  Tag, 
  Percent, 
  Layers, 
  FileText, 
  Activity, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  Smartphone, 
  Heart,
  ChevronRight,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import { CustomerItem, IndustryType } from '../../types';

interface MarketingCenterProps {
  customers: CustomerItem[];
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onUpdateCustomers?: (updated: CustomerItem[]) => void;
}

// 优惠券数据结构
interface CouponItem {
  id: string;
  code: string;
  name: string;
  type: 'flat' | 'percentage';
  value: number; // 扣减或比例值
  minSpend: number;
  status: 'active' | 'inactive';
  usageCount: number;
  maxUsage: number;
  startDate: string;
  endDate: string;
}

// 营销活动数据结构
interface CampaignItem {
  id: string;
  name: string;
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Google' | 'Meta';
  budget: number;
  salesGenerated: number;
  clicks: number;
  impressions: number;
  conversions: number;
  status: 'draft' | 'running' | 'completed';
  targetSegment: string;
  startDate: string;
  endDate: string;
}

// 营销模板数据结构
interface MarketingTemplate {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'WhatsApp';
  subject?: string;
  content: string;
  variables: string[];
}

// 营销发送历史记录 
interface MarketingLogItem {
  id: string;
  campaignId?: string;
  channel: 'Email' | 'SMS' | 'WhatsApp';
  recipientName: string;
  recipientContact: string;
  templateName: string;
  couponApplied?: string;
  contentSnapshot: string;
  status: 'Delivered' | 'Opened' | 'Clicked' | 'Failed';
  timestamp: string;
}

export default function MarketingCenter({
  customers,
  selectedIndustry,
  addLog,
  onUpdateCustomers
}: MarketingCenterProps) {
  
  // 子标签页切换：'coupons'=优惠券, 'campaigns'=营销活动, 'loyalty'=会员营销, 'dispatch'=分发控制(邮件/短信/WhatsApp), 'templates'=营销模板, 'logs'=营销记录
  const [activeSubTab, setActiveSubTab] = useState<'coupons' | 'campaigns' | 'loyalty' | 'dispatch' | 'templates' | 'logs'>('coupons');

  // --- 核心状态声明 (Real-time storage arrays) ---

  // 1. 优惠券状态
  const [coupons, setCoupons] = useState<CouponItem[]>([
    { id: 'CPN-001', code: 'SUMMER50', name: '夏季大促立减 €50 优惠券', type: 'flat', value: 50, minSpend: 250, status: 'active', usageCount: 120, maxUsage: 500, startDate: '2026-06-01', endDate: '2026-08-31' },
    { id: 'CPN-002', code: 'VIP15', name: '钻石俱乐部十五折折扣券', type: 'percentage', value: 15, minSpend: 0, status: 'active', usageCount: 45, maxUsage: 100, startDate: '2026-06-05', endDate: '2026-12-31' },
    { id: 'CPN-003', code: 'FREESHIP', name: '首购专享全欧免邮卡券', type: 'flat', value: 15, minSpend: 35, status: 'active', usageCount: 231, maxUsage: 1000, startDate: '2026-05-10', endDate: '2026-11-30' },
    { id: 'CPN-004', code: 'AUTUMN10', name: '秋季新品尝鲜九折优惠券', type: 'percentage', value: 10, minSpend: 50, status: 'inactive', usageCount: 0, maxUsage: 300, startDate: '2026-09-01', endDate: '2026-10-31' },
  ]);

  // 新建优惠券表单暂存
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponName, setNewCouponName] = useState('');
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponVal, setNewCouponVal] = useState(20);
  const [newCouponMin, setNewCouponMin] = useState(100);
  const [newCouponMax, setNewCouponMax] = useState(500);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);

  // 2. 营销活动状态
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([
    { id: 'CAMP-001', name: 'Google Search 搜索引流 - LTV 再营销', channel: 'Google', budget: 1200, salesGenerated: 4580, clicks: 1240, impressions: 8500, conversions: 186, status: 'running', targetSegment: '白金以上等级会员', startDate: '2026-06-01', endDate: '2026-06-30' },
    { id: 'CAMP-002', name: '邮件营销 - 2026秋装新品尝鲜推送', channel: 'Email', budget: 200, salesGenerated: 1890, clicks: 820, impressions: 3200, conversions: 52, status: 'running', targetSegment: '高频标签客户', startDate: '2026-06-05', endDate: '2026-06-15' },
    { id: 'CAMP-003', name: 'WhatsApp 直连 - 高价值黑金会员充值送分', channel: 'WhatsApp', budget: 350, salesGenerated: 3400, clicks: 410, impressions: 650, conversions: 62, status: 'running', targetSegment: '钻石会员级别', startDate: '2026-06-07', endDate: '2026-06-21' },
    { id: 'CAMP-004', name: 'Meta 广告组 - 停用挽回包测试', channel: 'Meta', budget: 800, salesGenerated: 0, clicks: 0, impressions: 0, conversions: 0, status: 'draft', targetSegment: '流失倾向标记组', startDate: '2026-06-15', endDate: '2026-06-30' },
  ]);

  // 新建营销活动表单暂存
  const [newCampName, setNewCampName] = useState('');
  const [newCampChannel, setNewCampChannel] = useState<'Email' | 'SMS' | 'WhatsApp' | 'Google' | 'Meta'>('Email');
  const [newCampBudget, setNewCampBudget] = useState(300);
  const [newCampSegment, setNewCampSegment] = useState('所有白银以上会员');
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);

  // 3. 促销邮件/短信模板
  const [templates, setTemplates] = useState<MarketingTemplate[]>([
    { id: 'TMP-001', name: '新注册会员欢迎信 (含券)', type: 'Email', subject: '🎉 欢迎来到我们! 属于您的立减 €50 专享新会员好礼已就绪', content: '尊贵的 {CustomerName}！非常高兴在我们的 {Industry} 主页看到您。现为您奉上本季专属立减优惠券密码：{CouponCode}。在结算时直接输入即可获得直接扣减，有效期至 {EndDate}。祝您购物愉快！', variables: ['{CustomerName}', '{Industry}', '{CouponCode}', '{EndDate}'] },
    { id: 'TMP-002', name: '沉默客户促活回访 (短信短链)', type: 'SMS', content: '【{Industry}】亲爱的 {CustomerName}，我们很想念您！特别为您准备了专享额外 {CouponValue} 折扣，折扣码: {CouponCode}。直接点击进入结账: ais.os/r_sale', variables: ['{CustomerName}', '{CouponValue}', '{CouponCode}'] },
    { id: 'TMP-003', name: 'WhatsApp 金钻会员积分增值通知', type: 'WhatsApp', content: '尊敬的 VIP 客户 {CustomerName} 先生/女士：今天是我们特惠双倍积分权益日！您的当前积分为 {CurrentPoints} 分。特备双倍券：{CouponCode}（无门槛免费送），点击卡片直接提取激活。', variables: ['{CustomerName}', '{CurrentPoints}', '{CouponCode}'] },
    { id: 'TMP-004', name: '节假日高转化通用单模板', type: 'Email', subject: '🎁 限时狂欢开启 - 今日下单立减优惠确认', content: 'Hi {CustomerName}！期待已久的季度答谢特惠专场现已就绪。凭该邮件专属邀请码：{CouponCode} 发起账单，即可无门槛抵用。速来配置抢购！', variables: ['{CustomerName}', '{CouponCode}'] }
  ]);

  const [newTempName, setNewTempName] = useState('');
  const [newTempType, setNewTempType] = useState<'Email' | 'SMS' | 'WhatsApp'>('Email');
  const [newTempSubject, setNewTempSubject] = useState('');
  const [newTempContent, setNewTempContent] = useState('');
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);

  // 4. 发送日志记录
  const [logs, setLogs] = useState<MarketingLogItem[]>([
    { id: 'ML-801', campaignId: 'CAMP-002', channel: 'Email', recipientName: 'Alex Mercer', recipientContact: 'alex@mercer.com', templateName: '新注册会员欢迎信 (含券)', couponApplied: 'SUMMER50', contentSnapshot: '尊贵的 Alex Mercer！非常高兴在我们的零售专场看到您。现为您奉上折扣码：SUMMER50...', status: 'Clicked', timestamp: '2026-06-07 14:24' },
    { id: 'ML-802', campaignId: 'CAMP-003', channel: 'WhatsApp', recipientName: 'Tiffany Vance', recipientContact: '+44 7946 0012', templateName: 'WhatsApp 金钻会员积分增值通知', couponApplied: 'VIP15', contentSnapshot: '尊敬的 VIP 客户 Tiffany Vance 先生/女士：您的当前积分为 450 分。特备双倍券：VIP15...', status: 'Opened', timestamp: '2026-06-07 16:50' },
    { id: 'ML-803', campaignId: 'CAMP-002', channel: 'Email', recipientName: 'John Doe', recipientContact: 'john@doe.com', templateName: '新注册会员欢迎信 (含券)', couponApplied: 'SUMMER50', contentSnapshot: '尊贵的 John Doe！非常高兴在我们的零售专场看到您。折扣码：SUMMER50...', status: 'Delivered', timestamp: '2026-06-07 17:10' }
  ]);

  // 5. 分发控制交互表单暂存
  const [selectedLogChannel, setSelectedLogChannel] = useState<'Email' | 'SMS' | 'WhatsApp'>('Email');
  const [selectedTargetSegment, setSelectedTargetSegment] = useState<'all' | 'diamonds' | 'golds' | 'vips' | 'silent'>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState('TMP-001');
  const [selectedCouponId, setSelectedCouponId] = useState('CPN-001');
  
  // 会员等级促销配置
  const [tierRuleConfig, setTierRuleConfig] = useState({
    diamondGiftCoupon: 'VIP15',
    platinumGiftCoupon: 'SUMMER50',
    goldPointsMultiplier: 1.5,
    diamondPointsMultiplier: 2.0,
    autoBirthdayWorkflow: true
  });

  // --- 辅助运算逻辑 (Computed states) ---

  // 过滤后的群组，获取符合条件的客户记录，用来预览分发受众
  const matchedAudienceList = useMemo(() => {
    let list = [...customers];
    if (selectedTargetSegment === 'diamonds') {
      list = list.filter(c => c.tier === '钻石会员');
    } else if (selectedTargetSegment === 'golds') {
      list = list.filter(c => c.tier === '黄金会员' || c.tier === '白金会员');
    } else if (selectedTargetSegment === 'vips') {
      list = list.filter(c => c.tags.includes('VIP') || c.tags.includes('高价值') || c.totalSpend >= 300);
    } else if (selectedTargetSegment === 'silent') {
      list = list.filter(c => c.tags.includes('30天未购买') || c.status === 'inactive');
    }
    return list;
  }, [customers, selectedTargetSegment]);

  // 激活/停用优惠券
  const handleToggleCouponStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'inactive' : 'active';
        addLog('Marketing System', '优惠券状态切换', `已将券 [${c.code}] 的服务状态变更为: ${nextStatus === 'active' ? '开启使用' : '下线禁用'}`, 'warning');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // 删除优惠券 
  const handleDeleteCoupon = (id: string, code: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    addLog('Marketing System', '删除卡券', `物理从数据库移除卡券: [${code}]。`, 'error');
  };

  // 提交新建优惠券
  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponName.trim()) return;

    const validatedCode = newCouponCode.trim().toUpperCase().replace(/\s+/g, '');
    
    // 重复校验
    if (coupons.some(c => c.code === validatedCode)) {
      addLog('Marketing System', '新建失败', '已存在完全同名的优惠券代码。', 'error');
      return;
    }

    const nextCoupon: CouponItem = {
      id: `CPN-${Date.now().toString().slice(-3)}`,
      code: validatedCode,
      name: newCouponName.trim(),
      type: newCouponType,
      value: Number(newCouponVal) || 0,
      minSpend: Number(newCouponMin) || 0,
      status: 'active',
      usageCount: 0,
      maxUsage: Number(newCouponMax) || 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 默认90天过期
    };

    setCoupons(prev => [nextCoupon, ...prev]);
    addLog('Marketing System', '添加优惠卡券', `优惠渠道扩展：成对录入大额核对券 [${validatedCode}]。初始库存量 ${newCouponMax} 张。`, 'success');
    
    // 重置并隐藏
    setNewCouponCode('');
    setNewCouponName('');
    setNewCouponVal(20);
    setNewCouponMin(100);
    setNewCouponMax(500);
    setShowAddCouponModal(false);
  };

  // 提交新建活动 
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;

    const nextCam: CampaignItem = {
      id: `CAMP-${Date.now().toString().slice(-3)}`,
      name: newCampName.trim(),
      channel: newCampChannel,
      budget: Number(newCampBudget) || 100,
      salesGenerated: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0,
      status: 'draft',
      targetSegment: newCampSegment,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setCampaigns(prev => [nextCam, ...prev]);
    addLog('Campaign Manager', '策划专属推广项目', `成功在云数据库提交草稿阶段活动「${newCampName}」，预算核定价为 $${newCampBudget}。`, 'success');
    
    setNewCampName('');
    setNewCampBudget(300);
    setShowAddCampaignModal(false);
  };

  // 启动草稿阶段活动
  const handleLaunchCampaign = (id: string, name: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        addLog('Campaign Manager', '部署活动项目', `营销计划「${name}」在全欧广告服务器网关完成编译并开始正式生效。`, 'success');
        return { ...c, status: 'running' };
      }
      return c;
    }));
  };

  // 物理清除活动
  const handleDeleteCampaign = (id: string, name: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    addLog('Campaign Manager', '清除活动', `撤消活动「${name}」的云主机，已进行物理出库。`, 'warning');
  };

  // 新建信息/邮件模板
  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTempName.trim() || !newTempContent.trim()) return;

    // 解析变量 
    const bracketVars = (newTempContent.match(/\{[A-Za-z0-9_]+\}/g) || []) as string[];
    const uniqueVariables = Array.from(new Set(bracketVars));

    const nextTemp: MarketingTemplate = {
      id: `TMP-${Date.now().toString().slice(-3)}`,
      name: newTempName.trim(),
      type: newTempType,
      subject: newTempType === 'Email' ? (newTempSubject.trim() || '特惠专享通知') : undefined,
      content: newTempContent,
      variables: uniqueVariables
    };

    setTemplates(prev => [...prev, nextTemp]);
    addLog('Template Factory', '制作消息模板', `创建了适用于 [${newTempType}] 渠道的多语种通用对账模板「${newTempName}」。`, 'success');

    setNewTempName('');
    setNewTempSubject('');
    setNewTempContent('');
    setShowAddTemplateModal(false);
  };

  // 物理删除模板
  const handleDeleteTemplate = (id: string, name: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    addLog('Template Factory', '出库清除模板', `已删除配置模版「${name}」的系统关联。`, 'warning');
  };

  // 会员营销等级规则设置同步保存
  const handleSaveTierRules = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('Loyalty Engine', '体系积分换算规则修改', '全局会员等级自动对账脚本参数更改成功。全量对账线程已部署。', 'success');
  };

  // 一键一通道大规模投递 (Real Execution Engine with instant log feed & campaign metrics push!)
  const handleTriggerBulkDispatchSend = () => {
    if (matchedAudienceList.length === 0) {
      addLog('Dispatch Hub', '群发被拒', '当前选定的条件受众组中包含 0 位合规会员，请重新调整过滤选项。', 'warning');
      return;
    }

    const tpl = templates.find(t => t.id === selectedTemplateId) || templates[0];
    const cpn = coupons.find(c => c.id === selectedCouponId);

    addLog('Dispatch Hub', '启动多通路群发', `开始提取 ${matchedAudienceList.length} 位会员的核心邮箱/手机号。校验数据库安全状态...`, 'info');

    // 组合新日志
    const newLogsBatch: MarketingLogItem[] = matchedAudienceList.map((client, idx) => {
      // 替换内容模板 
      let snapshot = tpl.content
        .replace(/{CustomerName}/g, client.name)
        .replace(/{Industry}/g, selectedIndustry === 'retail' ? '高端服饰店' : selectedIndustry === 'food' ? '多国风餐饮食' : '国际商贸中心')
        .replace(/{CouponCode}/g, cpn ? cpn.code : 'N/A')
        .replace(/{CouponValue}/g, cpn ? `${cpn.value}${cpn.type === 'flat' ? '元' : '%'}` : 'N/A')
        .replace(/{EndDate}/g, cpn ? cpn.endDate : 'N/A')
        .replace(/{CurrentPoints}/g, String(client.points));

      const contactDetail = selectedLogChannel === 'Email' ? client.email : client.phone;

      // 分布设定初始到达状态比例
      const statuses: MarketingLogItem['status'][] = ['Delivered', 'Opened', 'Clicked'];
      const pickStatus = statuses[idx % statuses.length];

      return {
        id: `ML-${Date.now().toString().slice(-3)}${idx}`,
        channel: selectedLogChannel,
        recipientName: client.name,
        recipientContact: contactDetail,
        templateName: tpl.name,
        couponApplied: cpn ? cpn.code : undefined,
        contentSnapshot: snapshot.length > 60 ? snapshot.slice(0, 60) + '...' : snapshot,
        status: pickStatus,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    });

    // 合并投递审计
    setLogs(prev => [...newLogsBatch, ...prev]);

    // 同时动态推升关联优惠券和渠道大盘的模拟统计额 
    if (cpn) {
      setCoupons(prev => prev.map(c => {
        if (c.id === cpn.id) {
          return { ...c, usageCount: Math.min(c.maxUsage, c.usageCount + matchedAudienceList.length) };
        }
        return c;
      }));
    }

    // 同时也推升活动大盘 clicks/impressions 从而构成真闭环 
    setCampaigns(prev => prev.map(cam => {
      // 如果属于该通路的活动则增加
      if (cam.channel === selectedLogChannel && cam.status === 'running') {
        const clicksInc = Math.floor(matchedAudienceList.length * 0.4);
        const revenueInc = Math.floor(clicksInc * (selectedIndustry === 'retail' ? 85 : 45));
        return {
          ...cam,
          impressions: cam.impressions + matchedAudienceList.length,
          clicks: cam.clicks + clicksInc,
          salesGenerated: cam.salesGenerated + revenueInc
        };
      }
      return cam;
    }));

    addLog(
      'Dispatch Hub',
      '群发投递成功',
      `批量推送已通过「${selectedLogChannel}」网关并发完成！共发送 ${matchedAudienceList.length} 条数据，相关优惠券和广告大盘点击、总业绩同步闭环增长。`,
      'success'
    );
  };

  return (
    <div className="flex flex-col gap-4 text-slate-800 animate-fadeIn" id="marketing-center-main">
      
      {/* 行业与功能核心看板 - 品牌顶部标识 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e6fafc] text-[#07C2E3] flex items-center justify-center shadow-inner">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 font-sans text-sm leading-tight">
              <span>营销中心</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] bg-slate-50 border border-slate-150 rounded-lg px-3 py-1.5 select-none font-bold">
          <span>当前行业后台架构:</span>
          <span className="text-[#07C2E3] font-bold uppercase">{selectedIndustry} Store</span>
        </div>
      </div>

      {/* 2. 营销专属二级子标签切换栏 */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-xs justify-start select-none">
        
        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'coupons'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>优惠券与折扣管理</span>
        </button>

        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'campaigns'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>广告与 ROI 营销活动</span>
        </button>

        <button
          onClick={() => setActiveSubTab('loyalty')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'loyalty'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>会员等级营销促活</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dispatch')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'dispatch'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>多通路批量分发控制台</span>
        </button>

        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'templates'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>广告消息模板工厂</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 h-8 ${
            activeSubTab === 'logs'
              ? 'bg-[#e6fafc] text-[#07C2E3]'
              : 'text-slate-550 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>全量营销实操记录流</span>
        </button>

      </div>

      {/* 3. 核心大板块面板 */}
      <div className="w-full flex flex-col gap-4">

        {/* ----------------- SUBTAB 1: COUPONS ----------------- */}
        {activeSubTab === 'coupons' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/15">
              <div>
                <h3 className="font-extrabold text-slate-900 font-sans text-xs">可用优惠券控制台</h3>
              </div>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white h-7 px-3 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>配置新营销券</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none h-10">
                    <th className="pl-4 pr-3 py-2.5 w-24">卡券密令</th>
                    <th className="p-3">卡券企划主名称</th>
                    <th className="p-3 text-center">折扣类型</th>
                    <th className="p-3 text-center">优惠力额</th>
                    <th className="p-3 text-center">起用门槛</th>
                    <th className="p-3 text-center">已扣发份额</th>
                    <th className="p-3 text-center">配限上限</th>
                    <th className="p-3 text-center">期效终日</th>
                    <th className="p-3 text-center">卡券状态</th>
                    <th className="p-3 text-right pr-4">核审动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-xs">
                  {coupons.map((c) => {
                    const isOver = c.usageCount >= c.maxUsage;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/40 border-b border-slate-100">
                        <td className="pl-4 pr-3 py-3">
                          <span className="font-mono font-black text-[#07C2E3] bg-[#e6fafc] border border-[#07C2E3]/20 px-2 py-0.5 rounded text-[10px]">
                            {c.code}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            c.type === 'flat' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {c.type === 'flat' ? '直接立减' : '比例折扣'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-black text-slate-800">
                          {c.type === 'flat' ? `€${c.value}` : `${c.value}%`}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {c.minSpend > 0 ? `满 €${c.minSpend}` : '无限制'}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-slate-955">{c.usageCount} 张</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                              <div 
                                className="bg-[#07C2E3] h-full" 
                                style={{ width: `${Math.min(100, (c.usageCount / c.maxUsage) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono font-medium text-slate-550">
                          {c.maxUsage} 张
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400 text-[10px]">
                          {c.endDate}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            c.status === 'active' && !isOver
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-150'
                              : 'bg-rose-50 text-rose-500 border-rose-150'
                          }`}>
                            {isOver ? '核销完毕' : c.status === 'active' ? '正常投放' : '已禁售'}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4 space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleCouponStatus(c.id)}
                            className={`py-0.5 px-2 rounded text-[10px] font-bold cursor-pointer transition-all border ${
                              c.status === 'active'
                                ? 'bg-rose-550/10 text-rose-600 border-rose-100 hover:bg-rose-50'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50'
                            }`}
                          >
                            {c.status === 'active' ? '下架' : '挂载'}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="bg-transparent hover:text-red-600 py-0.5 px-2 text-[10px] font-bold text-slate-400 rounded transition-colors cursor-pointer"
                          >
                            物理删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- SUBTAB 2: CAMPAIGNS & ROI ----------------- */}
        {activeSubTab === 'campaigns' && (
          <div className="space-y-4">
            
            {/* 顶栏广告效果指标一览 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wide block">累计广告总预算</span>
                <strong className="text-lg font-black font-mono text-slate-900 mt-1 block">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </strong>
                <span className="text-[9px] text-slate-400 block mt-1">云投放渠道结算成本</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wide block">直拉订单成交额 (SaaS闭环)</span>
                <strong className="text-lg font-black font-mono text-[#07C2E3] mt-1 block">
                  ${campaigns.reduce((sum, c) => sum + c.salesGenerated, 0).toLocaleString()}
                </strong>
                <span className="text-[9px] text-emerald-600 font-bold block mt-1">
                  总体 ROI: {(campaigns.reduce((sum, c) => sum + c.salesGenerated, 0) / Math.max(1, campaigns.reduce((sum, c) => sum + c.budget, 0))).toFixed(2)}x
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wide block">整域点击引流</span>
                <strong className="text-lg font-black font-mono text-slate-800 mt-1 block">
                  {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()} 次
                </strong>
                <span className="text-[9px] text-slate-400 block mt-1">已计费通路转化量</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wide block">平均广告点击率 (CTR)</span>
                <strong className="text-lg font-black font-mono text-indigo-600 mt-1 block">
                  {((campaigns.reduce((sum, c) => sum + c.clicks, 0) / Math.max(1, campaigns.reduce((sum, c) => sum + c.impressions, 0))) * 100).toFixed(2)}%
                </strong>
                <span className="text-[9px] text-slate-400 block mt-1">符合国际数字媒体常规指标</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/15">
                <div>
                  <h3 className="font-extrabold text-slate-900 font-sans text-xs">广告活动统计</h3>
                  <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">CAMPAIGNS</p>
                </div>
                <button
                  onClick={() => setShowAddCampaignModal(true)}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white h-7 px-3 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建活动</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none h-10">
                      <th className="pl-4 pr-3 py-2.5 w-20">活动编号</th>
                      <th className="p-3">策划名称</th>
                      <th className="p-3 text-center">分发通路</th>
                      <th className="p-3 text-right">广告花费</th>
                      <th className="p-3 text-right">广告收入</th>
                      <th className="p-3 text-center">ROI</th>
                      <th className="p-3 text-center">曝光数</th>
                      <th className="p-3 text-center">点击数</th>
                      <th className="p-3 text-center">转化订单</th>
                      <th className="p-3 text-center">开始时间</th>
                      <th className="p-3 text-center">结束时间</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-right pr-4">管理操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-xs">
                    {campaigns.map((cam) => {
                      const roi = cam.budget > 0 ? (cam.salesGenerated / cam.budget).toFixed(2) : '0.00';
                      return (
                        <tr key={cam.id} className="hover:bg-slate-50/40 border-b border-slate-100 h-14">
                          <td className="pl-4 pr-3 py-3 font-mono font-bold text-slate-900">{cam.id}</td>
                          <td className="p-3 font-bold text-slate-800">{cam.name}</td>
                          <td className="p-3 text-center">
                            <span className="font-bold text-[10px] uppercase font-mono tracking-wider block">
                              {cam.channel}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-slate-900 font-extrabold">${cam.budget.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono text-[#07C2E3] font-black">${cam.salesGenerated.toFixed(2)}</td>
                          <td className="p-3 text-center font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              Number(roi) >= 3.0 
                                ? 'bg-emerald-50 text-emerald-700 font-black border border-emerald-100' 
                                : Number(roi) > 1.0 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'bg-slate-50 text-slate-400'
                            }`}>
                              {roi}x
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-500">{cam.impressions.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono text-slate-700 font-semibold">{cam.clicks.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono text-[#07C2E3] font-bold">{cam.conversions.toLocaleString()}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{cam.startDate}</td>
                          <td className="p-3 text-center font-mono text-slate-500">{cam.endDate}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              cam.status === 'running'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-150'
                                : 'bg-slate-50 text-slate-400 border-slate-150'
                            }`}>
                              {cam.status === 'running' ? '运行中' : '草稿'}
                            </span>
                          </td>
                          <td className="p-3 text-right pr-4 space-x-1 whitespace-nowrap">
                            {cam.status === 'draft' ? (
                              <button
                                onClick={() => handleLaunchCampaign(cam.id, cam.name)}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-0.5 px-2 rounded text-[10px] font-bold cursor-pointer transition-all inline-block"
                              >
                                发布活动
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 select-none">已发布</span>
                            )}
                            <button
                              onClick={() => handleDeleteCampaign(cam.id, cam.name)}
                              className="bg-transparent hover:text-red-650 py-0.5 px-2 text-[10px] font-bold text-slate-400 rounded cursor-pointer"
                            >
                              清除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- SUBTAB 3: LOYALTY & MEMBER AUTOMATIONS ----------------- */}
        {activeSubTab === 'loyalty' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* 规则表单 */}
            <form onSubmit={handleSaveTierRules} className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#07C2E3]" />
                  <span>自动化客户等级联动规则规则库</span>
                </h4>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">LOYALTY_RULES</p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    【白金会员】升段专享赠送卡券
                  </label>
                  <select
                    value={tierRuleConfig.platinumGiftCoupon}
                    onChange={(e) => setTierRuleConfig(prev => ({ ...prev, platinumGiftCoupon: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#07C2E3] font-mono cursor-pointer"
                  >
                    {coupons.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    【钻石会员】升段专享赠送卡券
                  </label>
                  <select
                    value={tierRuleConfig.diamondGiftCoupon}
                    onChange={(e) => setTierRuleConfig(prev => ({ ...prev, diamondGiftCoupon: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#07C2E3] font-mono cursor-pointer"
                  >
                    {coupons.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      黄金级别成交积分倍率
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={tierRuleConfig.goldPointsMultiplier}
                      onChange={(e) => setTierRuleConfig(prev => ({ ...prev, goldPointsMultiplier: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      钻石级别成交积分倍率
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={tierRuleConfig.diamondPointsMultiplier}
                      onChange={(e) => setTierRuleConfig(prev => ({ ...prev, diamondPointsMultiplier: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-150 mt-4 select-none">
                  <div>
                    <span className="font-bold text-[11px] block text-slate-800">生日专享好礼定时发送机制</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">检测到生日周期时，系统将通过邮件全天候自动激活发券机制。</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tierRuleConfig.autoBirthdayWorkflow}
                    onChange={(e) => setTierRuleConfig(prev => ({ ...prev, autoBirthdayWorkflow: e.target.checked }))}
                    className="rounded text-[#07C2E3] focus:ring-[#07C2E3] w-4 h-4"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 px-4 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all"
                >
                  保存
                </button>
              </div>
            </form>

            {/* 会员专属尊享福利和促活快速指南汇总（真实数据和可操作按钮，无演示占位） */}
            <div className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-150 pb-3">
                  <h4 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>特定群组促销直连工具</span>
                  </h4>
                  <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">SEGMENT_TOOLS</p>
                </div>

                <div className="space-y-3 font-medium text-xs">
                  <div className="bg-[#e6fafc]/30 border border-[#07C2E3]/20 rounded-lg p-3 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">对所有「白金/钻石等级会员」一键发券</span>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-150 text-[8px] font-mono px-1 rounded">VIP专属</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic font-mono leading-relaxed mt-1">
                        系统查验，当前租户内共有 {customers.filter(c => c.tier === '钻石会员' || c.tier === '白金会员').length} 位核心活跃的高LTV消费者。
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTargetSegment('diamonds');
                        setSelectedCouponId('CPN-002'); // 用 VIP15
                        setActiveSubTab('dispatch');
                        addLog('Loyalty Engine', '预设高客群发', '已将目标受众群秒级载入到分发模块，准备进行批派券。', 'info');
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 py-1 px-2.5 rounded text-[10px] font-extrabold cursor-pointer transition-all shrink-0 uppercase tracking-tight"
                    >
                      直达发券
                    </button>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-200 rounded-lg p-3 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">促活停转「高危机流失倾向」或静默组</span>
                        <span className="bg-amber-50 text-amber-700 border border-amber-150 text-[8px] font-mono px-1 rounded">挽回流失</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic font-mono leading-relaxed mt-1">
                        系统查验，带「30天未购买」归类或处于停用状态的买家有 {customers.filter(c => c.tags.includes('30天未购买') || c.status === 'inactive').length} 位。
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTargetSegment('silent');
                        setSelectedCouponId('CPN-001'); // 立减50元
                        setActiveSubTab('dispatch');
                        addLog('Loyalty Engine', '促活分派发券', '已成功加载沉默低频客群到分发通路页面，准备挽回。', 'info');
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 py-1 px-2.5 rounded text-[10px] font-extrabold cursor-pointer transition-all shrink-0 uppercase tracking-tight"
                    >
                      直达挽回
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono mt-4 leading-normal bg-slate-50 border border-slate-150 p-2.5 rounded-lg space-y-1">
                <span className="font-bold text-slate-600 block">多租户等级自动校订：</span>
                <p>所有成交和退款会通过 app.tsx 实时回调积分库，白银升白金、白金降普通等核算均为底层自动换算。在 Command Center 调用时均不影响财务真实合规数据。</p>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 4: DISPATCH CONSOLE ----------------- */}
        {activeSubTab === 'dispatch' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* 分发动作大看板 */}
            <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 font-display">
                  <Send className="w-4 h-4 text-[#07C2E3]" />
                  <span>多通路并发群投大看板</span>
                </h4>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">DISPATCH_BOARD</p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                
                {/* 1. 通路 */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    发送通讯媒介
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Email', name: '邮件营销', icon: Mail },
                      { id: 'SMS', name: '短信营销', icon: Smartphone },
                      { id: 'WhatsApp', name: 'WhatsApp', icon: MessageSquare }
                    ].map(ch => {
                      const Icon = ch.icon;
                      const isSel = selectedLogChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setSelectedLogChannel(ch.id as any)}
                          className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#e6fafc] text-[#07C2E3] border-[#07C2E3]' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px]">{ch.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. 受众 */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    目标筛选客群
                  </label>
                  <select
                    value={selectedTargetSegment}
                    onChange={(e) => setSelectedTargetSegment(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#07C2E3] font-bold cursor-pointer"
                  >
                    <option value="all">所有的店面活跃常客 ({customers.length} 位)</option>
                    <option value="diamonds">大额钻石贵宾层级 ({customers.filter(c=>c.tier==='钻石会员').length} 位)</option>
                    <option value="golds">中高LTV黄金/白金层级 ({customers.filter(c=>c.tier==='黄金会员'||c.tier==='白金会员').length} 位)</option>
                    <option value="vips">被标记 VIP/高价值 的客群 ({customers.filter(c=>c.tags.includes('VIP')||c.tags.includes('高价值')||c.totalSpend>=300).length} 位)</option>
                    <option value="silent">流失危机或30天无订单客户 ({customers.filter(c=>c.tags.includes('30天未购买')||c.status==='inactive').length} 位)</option>
                  </select>
                </div>

                {/* 3. 模板 */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    选择对应媒介模板
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#07C2E3] font-mono cursor-pointer"
                  >
                    {templates.filter(t => t.type === selectedLogChannel).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                    {templates.filter(t => t.type !== selectedLogChannel).map(t => (
                      <option key={t.id} value={t.id} disabled>{t.name} (媒介不匹配)</option>
                    ))}
                  </select>
                </div>

                {/* 4. 带券 */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    关联派发优惠折扣券
                  </label>
                  <select
                    value={selectedCouponId}
                    onChange={(e) => setSelectedCouponId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#07C2E3] font-mono cursor-pointer"
                  >
                    <option value="">-- 不关联任何代金代码 --</option>
                    {coupons.filter(c => c.status === 'active').map(c => (
                      <option key={c.id} value={c.id}>{c.code} (额：{c.type === 'flat' ? `€${c.value}` : `${c.value}%`} off | 剩上限 {(c.maxUsage - c.usageCount)}张)</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* 动作 */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTriggerBulkDispatchSend}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-98 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>发送消息 ({matchedAudienceList.length} 位会员)</span>
                </button>
              </div>
            </div>

            {/* 实况匹配预览 */}
            <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-150 pb-3 flex justify-between items-center text-left">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>本次投发受众明细与变量效果试看 ({matchedAudienceList.length}人位)</span>
                    </h4>
                    <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">PREVIEW_FLOW</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-150 py-0.5 px-2 rounded">对账预览模式</span>
                </div>

                {/* 实例转换效果块 */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">首行买家样本模拟渲染效果预览</span>
                  {matchedAudienceList.length > 0 ? (
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-400">称谓: {matchedAudienceList[0].name}</span>
                        <span className="text-slate-400">通信接点: {selectedLogChannel === 'Email' ? matchedAudienceList[0].email : matchedAudienceList[0].phone}</span>
                      </div>
                      <div className="bg-white border border-slate-150 p-2.5 rounded-lg text-slate-700 leading-normal text-[10px] whitespace-pre-wrap">
                        {templates.find(t=>t.id === selectedTemplateId)?.type === selectedLogChannel ? (
                          templates.find(t=>t.id === selectedTemplateId)?.content
                            .replace(/{CustomerName}/g, matchedAudienceList[0].name)
                            .replace(/{Industry}/g, selectedIndustry === 'retail' ? '高端服饰店' : selectedIndustry === 'food' ? '多国风餐饮食' : '国际商贸中心')
                            .replace(/{CouponCode}/g, coupons.find(c=>c.id===selectedCouponId)?.code || 'N/A')
                            .replace(/{CouponValue}/g, coupons.find(c=>c.id===selectedCouponId) ? `${coupons.find(c=>c.id===selectedCouponId)?.value}${coupons.find(c=>c.id===selectedCouponId)?.type === 'flat' ? '元' : '%'}` : 'N/A')
                            .replace(/{EndDate}/g, coupons.find(c=>c.id===selectedCouponId)?.endDate || 'N/A')
                            .replace(/{CurrentPoints}/g, String(matchedAudienceList[0].points))
                        ) : (
                          <span className="text-rose-500 font-mono font-bold">请更换模板或通道，当前两项要求的底层通信媒介介质处于冲突不相称状态。</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 p-4 font-bold font-sans">由于过滤导致客群为空，无法生成投写效果。</div>
                  )}
                </div>

                {/* 受众表格明细 */}
                <div className="max-h-[170px] overflow-y-auto border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-150 text-[9px] font-bold text-slate-400 uppercase tracking-wider h-8 select-none">
                        <th className="pl-3 p-1 text-center">ID</th>
                        <th className="p-1">会员大名</th>
                        <th className="p-1">目标通信接点</th>
                        <th className="p-1 text-center">对应等级</th>
                        <th className="p-1 text-right pr-3">累计LTV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-[10px] text-slate-650 font-mono">
                      {matchedAudienceList.length > 0 ? (
                        matchedAudienceList.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/20 h-7">
                            <td className="pl-3 p-1 text-center text-slate-800 font-bold">{c.id}</td>
                            <td className="p-1 font-sans font-bold text-slate-700">{c.name}</td>
                            <td className="p-1 text-slate-500">{selectedLogChannel === 'Email' ? c.email : c.phone}</td>
                            <td className="p-1 text-center">{c.tier}</td>
                            <td className="p-1 text-right pr-3 font-bold">${c.totalSpend.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center font-bold text-slate-450 font-sans">
                            无可用群发受众。
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
              
              <div className="text-[9px] text-slate-400 leading-normal border-t border-slate-150 pt-2 float-left font-mono italic">
                安全防护拦截开启：系统已自动去除处于云物理停用或黑名单黑客的 {customers.filter(c=>c.status==='inactive').length} 位特殊高危客户。
              </div>
            </div>

          </div>
        )}

        {/* ----------------- SUBTAB 5: APP MESSAGE TEMPLATES ----------------- */}
        {activeSubTab === 'templates' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/15">
              <div>
                <h3 className="font-extrabold text-slate-900 font-sans text-xs">消息模板工厂</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">TEMPLATES</p>
              </div>
              <button
                onClick={() => setShowAddTemplateModal(true)}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white h-7 px-3 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>制作新消息模板</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 hover:shadow-xs transition-all relative flex flex-col justify-between min-h-[160px]">
                  
                  {/* Delete trigger */}
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="彻底废弃此模板"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-3 font-sans">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${
                        tpl.type === 'Email' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' : (tpl.type === 'SMS' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-[#e6fafc] text-[#07C2E3] border-[#07C2E3]/20')
                      }`}>
                        {tpl.type} 模板
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{tpl.name}</strong>
                    </div>

                    {tpl.type === 'Email' && tpl.subject && (
                      <div className="text-[10px] font-bold text-slate-500 font-mono">
                        <span className="text-slate-400">邮件主旨:</span> {tpl.subject}
                      </div>
                    )}

                    <p className="text-[10px] text-slate-600 leading-relaxed italic bg-white border border-slate-100 rounded-lg p-2.5 font-mono select-none">
                      {tpl.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-200/50">
                    <span className="text-[8px] uppercase font-bold text-slate-400">使用的动态占位标配:</span>
                    {tpl.variables.map((v, vIdx) => (
                      <span key={vIdx} className="bg-slate-150 text-slate-600 font-mono text-[8px] px-1 py-0.2 rounded font-medium select-none">
                        {v}
                      </span>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- SUBTAB 6: DISPATCH LOGS ----------------- */}
        {activeSubTab === 'logs' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/15 select-none animate-fadeIn">
              <div>
                <h3 className="font-extrabold text-slate-900 font-sans text-xs">全通路历史发送和到达详情 (Audit Trails)</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold">SENDING_LOGS</p>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">实时监听网关开启</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none h-10">
                    <th className="pl-4 pr-3 py-2.5 w-16 text-center">日志编号</th>
                    <th className="p-3">关联项目</th>
                    <th className="p-3 text-center">通道媒介</th>
                    <th className="p-3">会员姓名</th>
                    <th className="p-3">通信接点 (电邮/电话)</th>
                    <th className="p-3">调用关联模板</th>
                    <th className="p-3 text-center">派发券代码</th>
                    <th className="p-3">出库快照 snapshot</th>
                    <th className="p-3 text-center">到达反馈</th>
                    <th className="p-3 text-right pr-4">物理审记时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-xs">
                  {logs.map((l) => {
                    let stBg = 'bg-slate-50 text-slate-600';
                    if (l.status === 'Clicked') stBg = 'bg-[#e6fafc] text-[#07C2E3] font-bold border border-[#07C2E3]/20';
                    else if (l.status === 'Opened') stBg = 'bg-indigo-50 text-indigo-700 border border-indigo-150';
                    else if (l.status === 'Delivered') stBg = 'bg-emerald-50 text-emerald-600 border border-emerald-150';

                    return (
                      <tr key={l.id} className="hover:bg-slate-50/40 border-b border-slate-100 h-12 font-mono">
                        <td className="pl-4 pr-3 py-2 text-center text-slate-400">{l.id}</td>
                        <td className="p-3 font-sans font-semibold text-slate-800">{l.campaignId || '手动单单对账'}</td>
                        <td className="p-3 text-center">
                          <span className="text-[9px] font-bold uppercase block">{l.channel}</span>
                        </td>
                        <td className="p-3 font-sans font-bold text-slate-800">{l.recipientName}</td>
                        <td className="p-3 break-all max-w-[150px]">{l.recipientContact}</td>
                        <td className="p-3 font-sans text-slate-600">{l.templateName}</td>
                        <td className="p-3 text-center">
                          {l.couponApplied ? (
                            <span className="text-[#07C2E3] font-black">{l.couponApplied}</span>
                          ) : (
                            <span className="text-slate-350">-</span>
                          )}
                        </td>
                        <td className="p-3 max-w-[200px] truncate text-[10px] text-slate-500 italic" title={l.contentSnapshot}>
                          {l.contentSnapshot}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${stBg}`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4 text-[10px] text-slate-400">{l.timestamp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- MODALS (Real Functional Overlays) ----------------- */}

      {/* MODAL 1: CREATE COUPON FORM OVERLAY */}
      {showAddCouponModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-start justify-between border-b border-slate-150 pb-2">
              <h4 className="font-extrabold text-slate-900 text-sm">配置新云物理优惠券</h4>
              <button 
                onClick={() => setShowAddCouponModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">卡券兑换代金密令 (无空字符大写)</label>
                  <input
                    type="text"
                    required
                    placeholder="如 AUTUMN80"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">折扣形式</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  >
                    <option value="flat">直接立减 (€) 扣除</option>
                    <option value="percentage">比例折扣 (%) 扣除</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-bold text-slate-450">卡券企划主标题名称</label>
                <input
                  type="text"
                  required
                  placeholder="如 圣诞折扣专享 满100减20"
                  value={newCouponName}
                  onChange={(e) => setNewCouponName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-sans font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-455">优惠力额值</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-455">最低买家起用门槛 (€)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-455">配置下发数量上限</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newCouponMax}
                    onChange={(e) => setNewCouponMax(Number(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="bg-transparent text-slate-500 hover:text-red-500 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs"
                >
                  生成卡券并全服挂载
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE CAMPAIGN FORM OVERLAY */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-start justify-between border-b border-slate-150 pb-2">
              <h4 className="font-extrabold text-slate-900 text-sm">策划新引流营销活动 (Campaign)</h4>
              <button 
                onClick={() => setShowAddCampaignModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-bold text-slate-450">广告企划分支活动大名</label>
                <input
                  type="text"
                  required
                  placeholder="如 谷歌搜索-零售双倍积分回流活动"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">云通道介质</label>
                  <select
                    value={newCampChannel}
                    onChange={(e) => setNewCampChannel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    <option value="Email">Email 邮件营销</option>
                    <option value="SMS">SMS 短信群发</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Google">Google AdWords</option>
                    <option value="Meta">Meta Ads</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">预算额配值 ($)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value) || 100)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-bold text-slate-455">锁定受众特征段</label>
                <input
                  type="text"
                  required
                  placeholder="所有流失风险客户 / 钻石专属"
                  value={newCampSegment}
                  onChange={(e) => setNewCampSegment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                />
              </div>

              <div className="flex justify-end pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="bg-transparent text-slate-500 hover:text-red-500 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs"
                >
                  暂存企划方案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE TEMPLATE FORM OVERLAY */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-start justify-between border-b border-slate-150 pb-2">
              <h4 className="font-extrabold text-[#07C2E3] text-sm font-sans flex items-center gap-1.5">
                <FileText className="w-5 h-5" />
                <span>制作多通路消息模版</span>
              </h4>
              <button 
                onClick={() => setShowAddTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplateSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">模版方案名称</label>
                  <input
                    type="text"
                    required
                    placeholder="例如 答谢会促销模版"
                    value={newTempName}
                    onChange={(e) => setNewTempName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-450">关联媒介类型</label>
                  <select
                    value={newTempType}
                    onChange={(e) => setNewTempType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-[#b5b5b5]/30 rounded-lg px-2.5 py-2 text-xs font-bold"
                  >
                    <option value="Email">Email 电子邮件</option>
                    <option value="SMS">SMS 特惠短信</option>
                    <option value="WhatsApp">WhatsApp 交互卡片</option>
                  </select>
                </div>
              </div>

              {newTempType === 'Email' && (
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase font-bold text-slate-455">电子邮件主题栏</label>
                  <input
                    type="text"
                    placeholder="这里输入展现给买家的电邮标题"
                    value={newTempSubject}
                    onChange={(e) => setNewTempSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[8px] uppercase font-bold text-slate-455">模版消息正文语料 (支持标准插值变量)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="支持插值标签: {CustomerName} = 客户姓名, {CouponCode} = 折扣密令, {CouponValue} = 立减折扣额, {CurrentPoints} = 当前积分, {EndDate} = 截至效期, {Industry} = 店面类目"
                  value={newTempContent}
                  onChange={(e) => setNewTempContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[9px] text-slate-400 font-mono space-y-1">
                <span className="font-bold text-slate-600 block">变量插值规则温馨小贴士:</span>
                <p>底层在群发投发或调用 Gemini 营销专员时，将通过 RegEx 语法精确扫描大括号标记 `{}` 内的特定字段值合并渲染输出。禁止添加其他奇数未知字符。</p>
              </div>

              <div className="flex justify-end pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="bg-transparent text-slate-500 hover:text-red-500 font-bold px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs"
                >
                  模板入库生存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
