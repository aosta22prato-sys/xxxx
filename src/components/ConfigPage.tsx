import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  ArrowLeft, 
  Check, 
  Plus, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  Layers, 
  FileText, 
  Coins, 
  TrendingUp, 
  Bot, 
  Trash2, 
  Settings, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  Activity,
  FileCheck,
  Flame,
  UserCheck
} from 'lucide-react';
import { IndustryType } from '../types';

interface ConfigPageProps {
  onBack: () => void;
  onComplete: (config: { 
    workspaceName: string; 
    channels: string[]; 
    negotiatedProducts?: any[];
    customIndustry?: IndustryType;
    customBudget?: number;
    customMetrics?: any[];
    customKnowledge?: any[];
  }) => void;
}

type ModeType = 'mas' | 'traditional';

export default function ConfigPage({ onBack, onComplete }: ConfigPageProps) {
  const [mode, setMode] = useState<ModeType>('mas');
  const [workspaceName, setWorkspaceName] = useState('赛博朋克深港轻食工坊');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['在线销售', '在线外卖']);
  const [targetIndustry, setTargetIndustry] = useState<IndustryType>('food'); // defaults to food (軽食)

  // One-Sentence Input
  const [sentenceInput, setSentenceInput] = useState('在深圳南山区开个极简风轻食店，预算50万，60天内开业');
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0); // 0: input, 1: multi-agent compiling, 2: human-in-the-loop audit
  
  // Animation state during MAS generation
  const [compilingLogs, setCompilingLogs] = useState<string[]>([]);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [activeCompilingAgent, setActiveCompilingAgent] = useState('');

  // SCM negotiation strategy
  const [negotiationStrategy, setNegotiationStrategy] = useState<'cooperative' | 'strategic' | 'mercenary'>('strategic');

  // Interactive CAD / BIM blueprint variables
  const [storeSizeSqM, setStoreSizeSqM] = useState(85);
  const [diningTableCount, setDiningTableCount] = useState(6);
  const [plumbingNodes, setPlumbingNodes] = useState(3);
  const [selectedBimLayer, setSelectedBimLayer] = useState<'walls' | 'electricity' | 'plumbing' | 'furniture'>('furniture');

  // Reverse Complementing params
  const [parameters, setParameters] = useState({
    targetAudience: '企业中产、都市白领、健身卡客群',
    estimatedCompetitors: 4,
    expectedDailyTraffic: 1450,
    rentSqM: 450, // 450 RMB / SqM / Month
    targetGrossMargin: 72, // 72%
    riskGrade: '中偏低 (Low-Medium)'
  });

  // RPA Government and Filing variables
  const [rpaRegistryForm, setRpaRegistryForm] = useState({
    repName: '张建华',
    repId: '440305199208153412',
    regCapital: '500,000 元整',
    registeredDistrict: '深圳市南山区粤海街道高新北区创意大厦',
    businessScope: '热食、冷食制售；自研配方功能餐饮开发；外卖快餐供应链管理；冷链销售'
  });
  const [rpaSignedName, setRpaSignedName] = useState('');
  const [rpaCheckboxAccepted, setRpaCheckboxAccepted] = useState(true);
  const [rpaSubmitted, setRpaSubmitted] = useState(false);

  // Financial ROI projections parameters
  const [avgCustomerSpend, setAvgCustomerSpend] = useState(38); // € or ¥
  const [monthlyVolumeSales, setMonthlyVolumeSales] = useState(4800); // 4800 orders/month
  const [staffCount, setStaffCount] = useState(4); // 4 full time equivalents

  // Presets templates for "一句话生店"
  const presets = [
    {
      label: '深圳南山极简轻食店-50w',
      desc: '深圳南山区科兴科学园附近，客群白领，赛博极简美学，50万，60天',
      prompt: '在深圳南山区粤海街道，开一家预算50万、主打健身健康白领的赛博极简风轻食餐馆，60天内必须筹备上线开工。',
      industry: 'food' as IndustryType,
      workspace: '赛博极简健康轻食工坊'
    },
    {
      label: '上海徐汇白领高端咖啡店-80w',
      desc: '上海徐汇滨江，客群新中产、白领，罗马轻奢主义，80万，30天',
      prompt: '我想在上海徐汇滨江沿岸开一个高端精品咖啡店，租金预算高，主打罗马轻奢格调，总开支80万，30天内极限开业。',
      industry: 'food' as IndustryType,
      workspace: '罗马轻奢精品咖啡馆'
    },
    {
      label: '成都太古里赛博朋克风潮玩店-35w',
      desc: '成都锦江区太古里商圈，客群潮玩青年，末日废土风，35万，45天',
      prompt: '在成都锦江区太古里商圈开一家面向Z世代年轻人的赛博朋克风潮玩艺术百货店，投资打定35万，45天交付首批店务。',
      industry: 'manufacturing' as IndustryType,
      workspace: '末日废土赛博潮玩社'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setSentenceInput(p.prompt);
    setWorkspaceName(p.workspace);
    setTargetIndustry(p.industry);
  };

  // Run multi-agent pipeline compilation simulation with deterministic highly structured processes
  const handleLaunchCompilation = () => {
    if (!sentenceInput.trim()) return;
    setActiveStep(1);
    setCompilationProgress(0);
    setCompilingLogs([]);

    const logHistory = [
      { prg: 5, agent: 'Chief Orchestrator', log: '🔍 [Orchestrator] 核心大脑开机：成功捕获一句话指令。正在进行语义分词与向量路由分析。' },
      { prg: 10, agent: 'Chief Orchestrator', log: '💡 [Orchestrator] 补充信息：原意“开个轻食店”语义解密完成。反向匹配隐藏因子 — 锁定南山区、设定客群为都市白领及健身会员、推荐目标毛利率 72%。' },
      { prg: 15, agent: 'Site Intelligence', log: '📍 [Site Intelligence] 选址与评估智能体介入：正在爬取美团/腾讯热力图及周边竞争环境数据。' },
      { prg: 22, agent: 'Site Intelligence', log: '📍 [Site Intelligence] 商圈锁定：粤海街道万象天地/科兴辐射半径（0.5km内约1.45w白领高热人群）。基准租金拟定 ￥450/㎡/月。' },
      { prg: 30, agent: 'Brand & Architect', log: '📐 [Architect Agent] BIMCAD 店面装修设计师报到：触发 Stable Diffusion/BIM 智能体，渲染 2D/3D 装配式装修线路地图。' },
      { prg: 42, agent: 'Brand & Architect', log: '📐 [Architect Agent] 装配模组化拼积木方案拼盘：确定轻食工坊采用 85 ㎡ 标准规格。水电强弱电节点已智能点位标记。' },
      { prg: 50, agent: 'Sourcing & SCM', log: '📦 [SCM Negotiator] 供应链及物料自动配单智能体介入：自动测算大盘首批进货清单（SKU）。正在通过 B2B 议价网关呼叫供应商机器。' },
      { prg: 65, agent: 'Sourcing & SCM', log: '📦 [SCM Negotiator] 供应链博弈：正与供应商机器人进行多轮价格反拉博弈。使用 [Strategic] 策略，预计将核心设备采购扣减至 ￥12.8w (砍降 24%)。' },
      { prg: 75, agent: 'Compliance RPA', log: '⚖️ [Legal Agent] 合规与国家政务接口自动填报启动：已拉取当地工商局统一社会信用申请模板表。' },
      { prg: 82, agent: 'Compliance RPA', log: '⚖️ [Legal Agent] 信息预填：法定代表人“张建华”，经营场所“高新北区创意大厦”，经营分类标记为冷热食制售。' },
      { prg: 90, agent: 'Digital Infrastructure', log: '🏦 [Financial-as-Code] 金融及收单自动化测算：配置 Adyen/Stripe 虚拟多币种记账账户。生成现金流 amortization/payback 盈亏敏感期试算模型。' },
      { prg: 95, agent: 'Chief Orchestrator', log: '⚡️ [Orchestrator] 多智能体开店计划打包完毕：准备好 Human-in-the-loop 人类审核哨兵验证。推送详细数据看板。' },
      { prg: 100, agent: 'System Gateway', log: '✓ [Complete] 闭环流水线渲染成功！已在安全独立沙盒内构建了本店铺的最佳业务底座。请店主检查审理。' }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logHistory.length) {
        const item = logHistory[index];
        setCompilationProgress(item.prg);
        setActiveCompilingAgent(item.agent);
        setCompilingLogs(prev => [...prev, item.log]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveStep(2); // Move to the big interactive audit page!
        }, 500);
      }
    }, 450);
  };

  // BIM Takeoff pricing sheet calculations
  // Unit prices: pre-fab bar = 28000, Table = 2200, Plumb line = 450 per node, floor design = 180 per sqm
  const materialCosts = {
    prefabBar: 28000,
    diningTable: 2200,
    plumbingPipes: 450,
    floorTiles: 180,
    lightingRig: 4200
  };

  const bimTakeoffs = [
    { name: '预制集成吧台 / Modular Pre-fab Bar', count: 1, unit: '组', unitPrice: materialCosts.prefabBar, desc: '高度一体化不锈钢配餐、水吧台，包含制冰机内嵌空腔' },
    { name: '西欧极简原木餐椅桌 / Premium Scandinavian Diner Sets', count: diningTableCount, unit: '套', unitPrice: materialCosts.diningTable, desc: '高档耐磨防火面原木双椅餐桌' },
    { name: '商用大流量上下强排水软管 / Commercial Water Hose Line', count: plumbingNodes, unit: '流路', unitPrice: materialCosts.plumbingPipes, desc: '加厚多路回流防止排水管道' },
    { name: '轻工业灰色防滑聚氨酯自流平地板 / Epoxide Anti-slick Tiles', count: storeSizeSqM, unit: '㎡', unitPrice: materialCosts.floorTiles, desc: '食品级防尘止滑地面材料，工厂预裁' },
    { name: '智能环境白平衡LED吊灯组 / Smart Atmosphere Balance Lighting', count: Math.ceil(storeSizeSqM / 15), unit: '组', unitPrice: materialCosts.lightingRig, desc: '支持AI自动调整色温和照度的高转换灯盘组' }
  ];

  const totalBimCost = bimTakeoffs.reduce((sum, item) => sum + (item.count * item.unitPrice), 0);

  // Supplier multi-bidding pricing
  // Strategy effects: Cooperative saves 15% but takes 10 days, Strategic saves 24% and takes 15 days, Mercenary saves 32% but takes 25 days due to hard margin pressure.
  const getSCMStats = () => {
    let savingsPct = 24;
    let baselineSum = 185000;
    let expectedDelivery = 15;
    let bidCount = 5;

    if (negotiationStrategy === 'cooperative') {
      savingsPct = 15;
      expectedDelivery = 10;
      bidCount = 3;
    } else if (negotiationStrategy === 'mercenary') {
      savingsPct = 32;
      expectedDelivery = 28;
      bidCount = 9;
    }

    const negotiatedSum = Math.round(baselineSum * (1 - savingsPct / 100));
    return { savingsPct, baselineSum, negotiatedSum, expectedDelivery, bidCount };
  };

  const scmNegotiationData = getSCMStats();

  // Financial Ledger Computations
  const getFinancialLedger = () => {
    // Sales Revenue: Volume * Average Spend
    const revenue = monthlyVolumeSales * avgCustomerSpend;
    // Costs: COGS (1 - Margin), Rent, Wage (staff count * 3500 avg wage index), utilities + fees
    const cogs = Math.round(revenue * (1 - parameters.targetGrossMargin / 100));
    const rent = Math.round(storeSizeSqM * parameters.rentSqM);
    const wages = staffCount * 6500; // € or ¥ 6500 monthly wages per head
    const otherCost = Math.round(revenue * 0.08) + 4000; // 8% marketing/fees + utilities

    const totalOpCost = cogs + rent + wages + otherCost;
    const netProfit = revenue - totalOpCost;
    const paybackMonths = netProfit > 0 ? (500000 / netProfit).toFixed(1) : '无法收回投资';

    return { revenue, cogs, rent, wages, otherCost, totalOpCost, netProfit, paybackMonths };
  };

  const financials = getFinancialLedger();

  // Final Action: Complete and pass back to SaaS database
  const handleDeploySaaSPlatform = () => {
    // Generate Products catalog based on the selected theme (Food style or Manufacturing style)
    const customFoodProducts = [
      { id: 'custom_f1', name: '极简牛油果金枪鱼能量沙拉 / Minimalist Avocado Tuna Salad', sku: 'SKU-MINI-SALAD', stock: 120, minStockThreshold: 15, price: 38.00, sales: 88, status: 'In Stock' as const },
      { id: 'custom_f2', name: '全麦羽衣甘蓝蛋白素食卷 / Healthy Whole Wheat Vegan Wrap', sku: 'SKU-HEALTHY-WRAP', stock: 150, minStockThreshold: 20, price: 28.00, sales: 124, status: 'In Stock' as const },
      { id: 'custom_f3', name: '冷泡低卡茉莉柠檬能量茶 / Cold Brew Low-Cal Jasmine Lemon Tea', sku: 'SKU-COLD-TEA', stock: 45, minStockThreshold: 10, price: 18.00, sales: 240, status: 'In Stock' as const },
      { id: 'custom_f4', name: '希腊酸奶提拉米苏健康低糖杯 / Greek Yogurt Sugar-Free Tiramisu Cup', sku: 'SKU-YOGURT-TIRA', stock: 8, minStockThreshold: 15, price: 32.00, sales: 65, status: 'Low Stock' as const }
    ];

    const customRetailProducts = [
      { id: 'custom_r1', name: '末日废土做旧破损机车夹克 / Cyberpunk Wasteland Distressed Jacket', sku: 'SKU-CYBER-JACKET', stock: 40, minStockThreshold: 8, price: 680.00, sales: 12, status: 'In Stock' as const },
      { id: 'custom_r2', name: '磁吸模块化折叠战术背包 / Modular Magnetic Tactical Backpack', sku: 'SKU-TAC-BAG', stock: 85, minStockThreshold: 12, price: 299.00, sales: 42, status: 'In Stock' as const },
      { id: 'custom_r3', name: '金属反光防尘多功能面罩 / Reflective Metallic Anti-Dust Face Guard', sku: 'SKU-MASK-V2', stock: 2, minStockThreshold: 15, price: 89.00, sales: 130, status: 'Low Stock' as const }
    ];

    const finalProducts = targetIndustry === 'food' ? customFoodProducts : customRetailProducts;

    const FAQDocumentsIndexed = [
      { id: 'kd_auto_01', title: '《餐饮质量QS安全自检管理制度手册》', category: '合规标准', content: '自检作业规范及环境表面取样频次；轻食原辅料冷链验收温度必须严格对齐 ≤4℃，并在 24小时内流转耗尽，防止产生有害菌落。', size: '2.5 KB', lastUpdated: '2026-06-09' },
      { id: 'kd_auto_02', title: '《美团/饿了么店底外卖营销算法提权指南》', category: '增长运营', content: '针对前30天冷启动新店期，核心转化漏斗应保证首款立减券额度不低于客单百分之十五，且配送时戳保持控制在24分钟以为。', size: '4.8 KB', lastUpdated: '2026-06-09' }
    ];

    const customMetricsGenerated = [
      { name: '每日平均流水预估', value: `￥${Math.round(financials.revenue / 30)}`, change: '+14%', isUp: true, tooltip: '一句话智能算法根据粤海街道白领配算所得日均值' },
      { name: '供应商协议直省', value: `￥${Math.round((scmNegotiationData.baselineSum - scmNegotiationData.negotiatedSum))}`, change: `省 ${scmNegotiationData.savingsPct}%`, isUp: true, tooltip: '战略性竞价模型从设备总供应商处谈判回扣扣点' },
      { name: '预计收回成本期', value: `${financials.paybackMonths} 个月`, change: '回本健康', isUp: true, tooltip: '净毛利按 50万 开店总资本计算折算出的预计回本月份' },
      { name: '每日预计客流量', value: `${parameters.expectedDailyTraffic} 人`, change: '稳定', isUp: true, tooltip: '周边科兴大厦、大冲白领客群的客流漏斗计算值' }
    ];

    onComplete({
      workspaceName: workspaceName.trim(),
      channels: selectedChannels,
      negotiatedProducts: finalProducts,
      customIndustry: targetIndustry,
      customBudget: 500000,
      customMetrics: customMetricsGenerated,
      customKnowledge: FAQDocumentsIndexed
    });
  };

  const channelOptions = [
    { label: '在线销售 (网店)', code: 'online' },
    { label: '在线外卖渠道', code: 'delivery' },
    { label: '线下门店 POS 收银端', code: 'pos' },
    { label: '社交网红社群代发', code: 'social' }
  ];

  const handleToggleChannel = (label: string) => {
    if (selectedChannels.includes(label)) {
      setSelectedChannels(selectedChannels.filter(c => c !== label));
    } else {
      setSelectedChannels([...selectedChannels, label]);
    }
  };

  return (
    <div id="saas-store-compiler-screen" className="bg-[#0b0c0d] min-h-screen text-slate-100 font-sans flex flex-col justify-between relative select-none">
      
      {/* Absolute Subtle High-End Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#07C2E3]/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      {/* STICKY TOP HEADER */}
      <header className="px-8 py-5 border-b border-[#1f2124] bg-[#070809]/95 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#07C2E3] to-[#046B7D] rounded-xl flex items-center justify-center shadow-lg shadow-[#07C2E3]/10">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-sm font-black tracking-widest text-white block">AI COMMERCE OS</span>
            <span className="block text-[8px] font-mono text-[#07C2E3] uppercase tracking-wider font-extrabold">Enterprise Multi-Agent Suite v2.0</span>
          </div>
        </div>

        {/* Traditional / Multi-Agent Toggle Slider */}
        <div className="flex bg-[#121316] p-1 rounded-xl border border-[#2d2e30]">
          <button
            onClick={() => {
              setMode('mas');
              setActiveStep(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              mode === 'mas' 
                ? 'bg-gradient-to-r from-[#07C2E3] to-[#059BBC] text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 一句话多智能体生店 (高级)
          </button>
          <button
            onClick={() => {
              setMode('traditional');
              setActiveStep(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'traditional' 
                ? 'bg-slate-800 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 传统步骤问明配置
          </button>
        </div>
      </header>

      {/* CORE FRAME CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center">
        
        {/* ==================== TRANSITIONAL MODE A: STANDARD WORKFLOW ==================== */}
        {mode === 'traditional' && (
          <div className="w-full max-w-xl bg-[#121316] border border-[#232427] rounded-3xl p-8 shadow-2xl space-y-7 animate-fadeIn text-left mt-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#07C2E3] font-black tracking-widest block uppercase">Traditional Provisioning Configuration</span>
              <h2 className="text-xl font-bold text-white">请配置新商铺主体基本参数</h2>
              <p className="text-xs text-slate-400 leading-relaxed">如果您不想使用 AI 智能体帮您决策并自动建立店面资产，请在下方手动输入所需信息：</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">1. 创建企业空间名称 / Store Workspace Name</label>
                <input 
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="请输入您的店铺或集团名称..."
                  className="w-full bg-[#0a0b0d] border border-[#2d2e30] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#07C2E3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">2. 核心主营销售渠道 / Select Selling Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {channelOptions.map(ch => {
                    const active = selectedChannels.includes(ch.label);
                    return (
                      <button
                        key={ch.code}
                        type="button"
                        onClick={() => handleToggleChannel(ch.label)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          active 
                            ? 'bg-[#07C2E3]/10 border-[#07C2E3] text-[#07C2E3] font-bold shadow-sm' 
                            : 'bg-[#15171a] border-[#25272a] hover:border-[#35373a] text-slate-400'
                        }`}
                      >
                        <span>{ch.label}</span>
                        {active ? (
                          <Check className="w-3.5 h-3.5 text-[#07C2E3] shrink-0" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">3. 行业专区模块分类 / Industry Preset Track</label>
                <select
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value as IndustryType)}
                  className="w-full bg-[#0a0b0d] border border-[#2d2e30] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#07C2E3] transition-all"
                >
                  <option value="retail">👕 新零售服装设计批发后台</option>
                  <option value="food">🍔 极简餐饮与茶饮外卖后台</option>
                  <option value="manufacturing">🔌 家电百货制造多终端直开后台</option>
                  <option value="service">💆 医疗美容与物理SPA网络后台</option>
                  <option value="education">📦 3C跨境网店与跨境独立站后台</option>
                  <option value="healthcare">🏪 实体POS收银端及零售门店后台</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
              >
                返回上一步
              </button>
              <button
                type="button"
                onClick={handleDeploySaaSPlatform}
                className="flex-1 bg-gradient-to-r from-[#07C2E3] to-[#059BBC] text-slate-950 text-xs font-black py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#07C2E3]/15 cursor-pointer text-center"
              >
                立即部署云商铺
              </button>
            </div>
          </div>
        )}

        {/* ==================== SPECIAL EDITION MODE B: MAS "ONE-SENTENCE STORE GEN" PROCESS ==================== */}
        {mode === 'mas' && (
          <div className="w-full space-y-6">
            
            {/* STEP 0: INITIAL CARD INPUT AREA */}
            {activeStep === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left max-w-5xl mx-auto w-full pt-4 animate-fadeIn">
                
                {/* Left block - input form */}
                <div className="lg:col-span-7 bg-[#121316] border border-[#232427] p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07C2E3]/10 border border-[#07C2E3]/25 text-[10px] font-black tracking-widest text-[#07C2E3] uppercase">
                      <Cpu className="w-3.5 h-3.5 text-[#07C2E3] animate-spin" style={{ animationDuration: '4s' }} />
                      <span>One-Sentence Store Generator Core</span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                      一句话生店面：<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07C2E3] to-[#9F7AEA]">多智能体极致协同决策开店</span>
                    </h1>
                    
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      不仅仅是简单的文本或者图片生成。系统将彻底激活 **首席执行决策链 (MAS v2.0)**，在分钟内直接完成 <b>反向缺补</b>、<b>地块选址测算</b>、<b>BIM CAD 图纸物料明细</b>、<b>B2B 多轮让利价格博弈</b>、<b>合规政府 RPA 资料自动整理文件</b> 以及 <b>ROI 回本周期财务测算表</b> 的极客闭环！
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        说出您的开店构想 (输入 行业/地段/风风/预算/周期)
                      </label>
                      <textarea
                        value={sentenceInput}
                        onChange={(e) => setSentenceInput(e.target.value)}
                        placeholder="例：在深圳南山区开个极简风轻食店，预算50万，60天内开业..."
                        rows={4}
                        className="w-full bg-[#070809] border border-[#2d2e30]/80 rounded-2xl p-4 text-xs font-semibold text-white placeholder-slate-600 focus:outline-[#07C2E3] focus:ring-1 focus:ring-[#07C2E3] transition-all font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-4 bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-350 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>返回</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLaunchCompilation}
                      className="flex-1 bg-[#07C2E3] text-slate-950 font-black text-xs py-3.5 rounded-xl hover:bg-[#06B2D0] active:scale-[0.99] transition-all shadow-lg shadow-[#07C2E3]/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🚀 启动多智能体协作建店流水线</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right block - high fidelity enterprise templates list */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-start">
                  <div className="bg-[#121316]/50 border border-[#232427] p-5 rounded-3xl">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono mb-3.5">
                      💡 推荐：企业级开店策略大盘模板
                    </h3>
                    
                    <div className="space-y-3.5">
                      {presets.map((preset, index) => (
                        <div 
                          key={index}
                          onClick={() => applyPreset(preset)}
                          className="bg-[#0a0b0d] border border-[#232427] hover:border-[#07C2E3]/40 p-4 rounded-2xl transition-all cursor-pointer select-none group flex flex-col justify-between text-left"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-white group-hover:text-[#07C2E3] transition-colors">{preset.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-bold font-mono">
                              PRESET {index + 1}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed truncate">{preset.desc}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-2 flex items-center gap-1 italic truncate">
                            &ldquo;{preset.prompt}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#121316] to-[#181124] border border-[#232427] p-5 rounded-3xl flex flex-col space-y-3 text-left">
                    <h4 className="text-xs font-extrabold text-[#07C2E3] flex items-center gap-1.5 font-mono uppercase">
                      <ShieldCheck className="w-4 h-4" /> v1.0 Architecture Locked
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed leading-relaxed">
                      SaaS 多租户架构严格绑定隔离，防止数据穿透。多智能体博弈执行引入博弈论竞价模型，采购折扣合同直接写回 ERP 流水。
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 1: ACTIVE LIVE COMPOSER ENGINE LOGS */}
            {activeStep === 1 && (
              <div className="max-w-3xl mx-auto w-full bg-[#121316] border border-[#232427] rounded-3xl p-6 shadow-2xl space-y-6 text-left animate-fadeIn mt-4">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-[#2d2e30] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#07C2E3]/20 border border-[#07C2E3]/35 rounded-lg flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[#07C2E3] animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">多智能体协同建店中 / Compiled in sandbox</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">正在协调安排：首席决策、选址、品牌CAD设计、SCM采购、政府RPA...</p>
                    </div>
                  </div>

                  <span className="text-xs text-[#07C2E3] font-black font-mono animate-pulse">{compilationProgress}%</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#07C2E3] via-[#046B7D] to-[#9F7AEA] transition-all duration-350 rounded-full"
                    style={{ width: `${compilationProgress}%` }}
                  />
                </div>

                {/* Active executing agent indicator card */}
                {activeCompilingAgent && (
                  <div className="p-3 bg-[#0a0b0d] border border-slate-900 rounded-xl flex items-center justify-between animate-fadeIn select-none">
                    <span className="text-[10px] font-black font-mono text-slate-400">⚡ 当前执政智能体:</span>
                    <span className="text-xs font-black text-[#07C2E3] flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#07C2E3] animate-bounce" /> {activeCompilingAgent}
                    </span>
                  </div>
                )}

                {/* Scrolling micro details rows */}
                <div className="bg-[#070809] border border-[#232427] rounded-2xl p-4 h-64 overflow-y-auto font-mono text-[10.5px] space-y-2.5 scrollbar-thin">
                  {compilingLogs.map((log, idx) => {
                    let textAccent = 'text-slate-400';
                    if (log.includes('✓') || log.includes('Success')) textAccent = 'text-emerald-400 font-semibold';
                    else if (log.includes('Orchestrator')) textAccent = 'text-[#07C2E3] font-semibold';
                    else if (log.includes('Sourcing')) textAccent = 'text-amber-450';
                    else if (log.includes('RPA')) textAccent = 'text-purple-400';

                    return (
                      <div key={idx} className={`leading-relaxed border-b border-[#121316] pb-1.5 last:border-none ${textAccent} animate-fadeIn`}>
                        {log}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-[10px] text-slate-550 italic">
                  企业级提示：多智能体正在提取精确行业参数库、检索当地租金热图对齐...
                </div>
              </div>
            )}

            {/* STEP 2: HUMAN-IN-THE-LOOP DETAILED INTERACTIVE MULTI-VIEW AUDIT */}
            {activeStep === 2 && (
              <div className="w-full text-left space-y-8 animate-fadeIn">
                
                {/* Title and Top Header bar */}
                <div className="bg-[#121316] border border-[#232427] p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Core Generation Perfect and Complete
                    </span>
                    <h2 className="text-xl font-bold font-sans text-white">店铺自动化方案完成 — 等待您审核确认</h2>
                    <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
                      多智能体协同设计的数据已就绪。为了保障企业级开店<b>100%确定、杜绝幻觉</b>，请审核并调整参数。点击最下方“下发布署”即可将商品、图纸及采购合同同步至多租户 SaaS 核心数据库。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeploySaaSPlatform}
                    className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-[#07C2E3] to-[#046B7D] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-[#07C2E3]/15 hover:scale-[1.02] transition-all cursor-pointer text-center"
                  >
                    🚀 核准无误：直接下发布署开店
                  </button>
                </div>

                {/* THE 4 COLLABORATION PHASES AND INTERACTIVE BLOCKS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-start">
                  
                  {/* LEFT BIG AREA - TABS AND WORK CONTENT (BIM, Negotiation, RPA, Financials) */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* PHASE 1: COMPLEMENT PARAMETERS CARD */}
                    <div className="bg-[#121316] border border-[#232427] rounded-3xl p-5 shadow-lg space-y-4">
                      <div className="flex items-center justify-between border-b border-[#2d2e30] pb-3.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#07C2E3]" />
                          <h3 className="text-xs font-black uppercase tracking-wider text-white">阶段 1: 选址与反向补全信息评估 / Site Intelligence</h3>
                        </div>
                        <span className="text-[10px] bg-[#07C2E3]/10 border border-[#07C2E3]/20 px-2 py-0.5 rounded-full text-[#07C2E3] font-bold font-mono">
                          ESTIMATED STATS
                        </span>
                      </div>

                      {/* Six grid fields parameters */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">目标细分客群 / Target Audience:</span>
                          <input 
                            type="text" 
                            value={parameters.targetAudience}
                            onChange={(e) => setParameters(prev => ({ ...prev, targetAudience: e.target.value }))}
                            className="bg-transparent text-white font-extrabold border-none focus:outline-none w-full text-xs font-sans"
                          />
                        </div>

                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">每日流量预估 / Traffic Daily:</span>
                          <input 
                            type="number" 
                            value={parameters.expectedDailyTraffic}
                            onChange={(e) => setParameters(prev => ({ ...prev, expectedDailyTraffic: Number(e.target.value) }))}
                            className="bg-transparent text-[#07C2E3] font-extrabold border-none focus:outline-none w-full text-xs"
                          />
                        </div>

                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">周边直接竞品数 / Competitors:</span>
                          <input 
                            type="number" 
                            value={parameters.estimatedCompetitors}
                            onChange={(e) => setParameters(prev => ({ ...prev, estimatedCompetitors: Number(e.target.value) }))}
                            className="bg-transparent text-rose-400 font-extrabold border-none focus:outline-none w-full text-xs"
                          />
                        </div>

                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">基准商铺月租 / Rent per sqm:</span>
                          <div className="flex items-center">
                            <span className="mr-0.5 text-slate-400">￥</span>
                            <input 
                              type="number" 
                              value={parameters.rentSqM}
                              onChange={(e) => setParameters(prev => ({ ...prev, rentSqM: Number(e.target.value) }))}
                              className="bg-transparent text-white font-extrabold border-none focus:outline-none w-20 text-xs"
                            />
                            <span className="text-slate-500 text-[9px]">/㎡/月</span>
                          </div>
                        </div>

                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">设定毛利指数 / Gross Margin:</span>
                          <div className="flex items-center">
                            <input 
                              type="number" 
                              value={parameters.targetGrossMargin}
                              onChange={(e) => setParameters(prev => ({ ...prev, targetGrossMargin: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                              className="bg-transparent text-emerald-400 font-extrabold border-none focus:outline-none w-10 text-xs"
                            />
                            <span className="text-slate-500 text-[9px] font-bold">%</span>
                          </div>
                        </div>

                        <div className="bg-[#0a0b0d] p-3 rounded-2xl border border-slate-900 space-y-1">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">项目风险评级 / Risk Evaluation:</span>
                          <span className="text-white block font-sans font-extrabold text-[11px] select-text">{parameters.riskGrade}</span>
                        </div>
                      </div>
                    </div>

                    {/* PHASE 2: INTERACTIVE SVG BIM CAD LAYOUT AND SHEET */}
                    <div id="bim-layout-blueprint" className="bg-[#121316] border border-[#232427] rounded-3xl p-5 shadow-lg space-y-5 text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2d2e30] pb-3.5 gap-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#07C2E3]" />
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">阶段 2: 3D 装配式房屋结构 CAD / BIM Blueprint</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5">自动转换为装配式房屋模块，可无缝移交施工队伍。滑动参数立即重构绘图明细！</p>
                          </div>
                        </div>

                        {/* Layer selection controls */}
                        <div className="flex bg-[#070809] border border-slate-800 p-0.5 rounded-lg text-[9px] font-extrabold uppercase shrink-0 font-mono">
                          {['walls', 'electricity', 'plumbing', 'furniture'].map(lay => (
                            <button
                              key={lay}
                              type="button"
                              onClick={() => setSelectedBimLayer(lay as any)}
                              className={`px-2 py-1 rounded cursor-pointer ${selectedBimLayer === lay ? 'bg-indigo-600 font-black text-white' : 'text-slate-550 hover:text-white'}`}
                            >
                              {lay === 'walls' ? '墙布局' : lay === 'electricity' ? '电气(强电)' : lay === 'plumbing' ? '给给水' : '吧台家具'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive drafting canvas split: LHS CAD layout rendering, RHS: detailed material takeoff rows */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                        
                        {/* 1. Vector Blueprint SVG */}
                        <div className="md:col-span-6 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between items-center relative aspect-square">
                          <span className="absolute top-2.5 left-2.5 text-[8.5px] text-[#07C2E3] font-mono uppercase tracking-widest font-black flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-[#07C2E3] animate-pulse" /> GRID SCALE: 1:50 / ACTIVE
                          </span>

                          {/* SVG drafting */}
                          <svg viewBox="0 0 240 240" className="w-full h-full max-h-[190px] text-emerald-500 font-mono select-none">
                            {/* Blue grid helper lines */}
                            <defs>
                              <pattern id="grid_patt" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1d4ed8" strokeWidth="0.15" strokeOpacity="0.4" />
                              </pattern>
                            </defs>
                            <rect width="240" height="240" fill="url(#grid_patt)" />

                            {/* Outer walls frame */}
                            <rect x="15" y="15" width="210" height="210" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                            <rect x="14" y="14" width="212" height="212" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3,3" />

                            {/* Internal Rooms Partition - kitchen area */}
                            <line x1="15" y1="120" x2="140" y2="120" stroke="#94a3b8" strokeWidth="2" />
                            <line x1="140" y1="120" x2="140" y2="15" stroke="#94a3b8" strokeWidth="2" />
                            
                            {/* Kitchen label */}
                            <text x="35" y="65" fill="#64748b" fontSize="8" fontWeight="bold">PREP KITCHEN (45㎡)</text>
                            
                            {/* Dining zone */}
                            <text x="50" y="180" fill="#64748b" fontSize="8" fontWeight="bold">DINING AREA ({storeSizeSqM - 45}㎡)</text>

                            {/* Modular pre-fab bar layout (Layer dependent colors) */}
                            <rect 
                              x="148" 
                              y="30" 
                              width="65" 
                              height="75" 
                              fill={selectedBimLayer === 'furniture' ? 'rgba(7, 194, 227, 0.15)' : 'none'} 
                              stroke={selectedBimLayer === 'furniture' ? '#07C2E3' : '#64748b'} 
                              strokeWidth="1.5" 
                              rx="3" 
                            />
                            <text x="155" y="70" fill={selectedBimLayer === 'furniture' ? '#07C2E3' : '#64748b'} fontSize="7" fontWeight="black">PRE-FAB BAR</text>

                            {/* Tables dots (diningTableCount controls rendering) */}
                            {Array.from({ length: Math.min(diningTableCount, 8) }).map((_, dIdx) => {
                              const xPos = 40 + (dIdx % 3) * 50;
                              const yPos = 145 + Math.floor(dIdx / 3) * 35;
                              return (
                                <g key={dIdx} className="hover:scale-105 transition-transform duration-100">
                                  {/* Table top rectangle */}
                                  <rect 
                                    x={xPos} 
                                    y={yPos} 
                                    width="22" 
                                    height="14" 
                                    fill={selectedBimLayer === 'furniture' ? 'rgba(95, 122, 235, 0.15)' : 'none'} 
                                    stroke={selectedBimLayer === 'furniture' ? '#5f7aba' : '#64748b'} 
                                    strokeWidth="1.2" 
                                    rx="2" 
                                  />
                                  {/* Chairs left and right */}
                                  <circle cx={xPos - 4} cy={yPos + 7} r="2.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
                                  <circle cx={xPos + 26} cy={yPos + 7} r="2.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
                                </g>
                              );
                            })}

                            {/* Strong-Electrical Power lines path (Layer dependent highlight) */}
                            <path 
                              d="M 15 25 L 120 25 L 120 115 L 210 115" 
                              fill="none" 
                              stroke={selectedBimLayer === 'electricity' ? '#eab308' : '#27272a'} 
                              strokeWidth={selectedBimLayer === 'electricity' ? 1.8 : 0.8} 
                              strokeDasharray={selectedBimLayer === 'electricity' ? 'none' : '2,2'}
                            />
                            {selectedBimLayer === 'electricity' && (
                              <>
                                <circle cx="120" cy="25" r="3" fill="#eab308" />
                                <circle cx="210" cy="115" r="3" fill="#eab308" />
                              </>
                            )}

                            {/* Plumbing pipes paths (Layer dependent water highlight) */}
                            {Array.from({ length: plumbingNodes }).map((_, pIdx) => {
                              const yPipe = 40 + pIdx * 35;
                              return (
                                <g key={pIdx}>
                                  <path
                                    d={`M 15 ${yPipe} L 95 ${yPipe}`}
                                    fill="none"
                                    stroke={selectedBimLayer === 'plumbing' ? '#06b6d4' : '#27272a'}
                                    strokeWidth={selectedBimLayer === 'plumbing' ? 1.8 : 0.8}
                                  />
                                  {selectedBimLayer === 'plumbing' && (
                                    <circle cx="95" cy={yPipe} r="3" fill="#06b6d4" />
                                  )}
                                </g>
                              );
                            })}
                          </svg>

                          {/* Dimensions Slider Widgets */}
                          <div className="w-full space-y-2.5 pt-2 border-t border-slate-900 text-[10px] font-mono leading-none font-semibold">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">房屋使用面积 / Store Size:</span>
                              <span className="text-[#07C2E3] font-bold">{storeSizeSqM} ㎡</span>
                            </div>
                            <input 
                              type="range" 
                              min="40" 
                              max="180" 
                              value={storeSizeSqM}
                              onChange={(e) => setStoreSizeSqM(Number(e.target.value))}
                              className="w-full accent-[#07C2E3] h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />

                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">双客位木质餐桌桌数 / Dining Tables:</span>
                              <span className="text-indigo-400 font-bold">{diningTableCount} 组</span>
                            </div>
                            <input 
                              type="range" 
                              min="2" 
                              max="12" 
                              value={diningTableCount}
                              onChange={(e) => setDiningTableCount(Number(e.target.value))}
                              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                            
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">冷热上下水源节点数 / Water Outlets:</span>
                              <span className="text-cyan-400 font-bold">{plumbingNodes} 路</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="6" 
                              value={plumbingNodes}
                              onChange={(e) => setPlumbingNodes(Number(e.target.value))}
                              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 2. Materials Takeoff BOM List */}
                        <div className="md:col-span-6 flex flex-col justify-between">
                          <div className="bg-[#0a0b0d] rounded-2xl p-4 border border-slate-900 space-y-3 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin text-left">
                            <h4 className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest font-mono">
                              🛠️ 模块化装配式材料明细 / BIM Material Takeoff
                            </h4>
                            
                            <div className="space-y-2 text-[9.5px] font-mono font-medium leading-relaxed">
                              {bimTakeoffs.map((item, idx) => (
                                <div key={idx} className="border-b border-slate-950 pb-2 space-y-1">
                                  <div className="flex justify-between items-start font-bold text-white">
                                    <span className="truncate max-w-[155px]">{item.name}</span>
                                    <span className="text-slate-200">
                                      {item.count} {item.unit} &times; ￥{item.unitPrice}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-slate-500 text-[8.5px]">
                                    <span className="truncate max-w-[165px] italic text-slate-400 select-all">{item.desc}</span>
                                    <span className="text-slate-350 font-bold">
                                      ￥{(item.count * item.unitPrice).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* BIM Subtotal */}
                          <div className="mt-3.5 bg-gradient-to-r from-indigo-950/15 to-slate-950 p-4 border border-slate-900 rounded-2xl flex items-center justify-between font-mono select-none">
                            <div>
                              <span className="text-[9px] text-slate-500 block uppercase font-bold">装配式精装总决底开支 / BIM Subtotal:</span>
                              <span className="text-xs font-black text-white hover:text-[#07C2E3] transition-colors">
                                ￥{totalBimCost.toLocaleString()} RMB
                              </span>
                            </div>
                            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400 font-bold">
                              已锁定 B2B 采购价
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* PHASE 3: GAME THEORY NEGOTIATION LOG MATRIX */}
                    <div id="scm-negotiator" className="bg-[#121316] border border-[#232427] rounded-3xl p-5 shadow-lg space-y-5 text-left select-none">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2d2e30] pb-3.5 gap-2">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#07C2E3] bg-[#07C2E3]/15 rounded-full p-0.5" />
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">阶段 3: 供应链多轮博弈意价谈判 / Game Theory Negotiator</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5">自研博弈论决策模型。AI采购员与设备总供应商反复拉锯谈判，达到极致压缩开支目的。</p>
                          </div>
                        </div>

                        {/* Strategy selecting buttons */}
                        <div className="flex bg-[#070809] border border-slate-800 p-0.5 rounded-lg text-[9px] font-black uppercase shrink-0 font-mono">
                          {[
                            { code: 'cooperative', label: '友好合作式' },
                            { code: 'strategic', label: '平衡战术式' },
                            { code: 'mercenary', label: '极限砍价式' }
                          ].map(opt => (
                            <button
                              key={opt.code}
                              type="button"
                              onClick={() => setNegotiationStrategy(opt.code as any)}
                              className={`px-2 py-1 rounded cursor-pointer ${negotiationStrategy === opt.code ? 'bg-[#07C2E3] font-black text-slate-950' : 'text-slate-400 hover:text-white'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Negotiation display */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch text-xs font-mono">
                        
                        {/* Interactive transcript log chat */}
                        <div className="md:col-span-7 bg-[#070809] border border-[#1b1d20] p-4 rounded-2xl h-56 overflow-y-auto space-y-3.5 scrollbar-thin text-left leading-relaxed">
                          <div className="text-[9.5px] text-slate-500 uppercase tracking-widest font-black border-b border-slate-900 pb-1.5 leading-none">
                            🤝 谈判进程底稿 / LOG: Bidding Thread
                          </div>

                          <div className="space-y-3 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-[9px] text-amber-450 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 1:</span>
                              <p className="text-slate-400 bg-slate-950 p-2 rounded-lg leading-relaxed select-text">
                                &ldquo;根据您选定的 85 ㎡ 精装一站式物料配额清单，基准采购批发总原价为 **￥185,000 RMB** (包含吧台、不锈钢配件、主板吊具)。&rdquo;
                              </p>
                            </div>

                            {negotiationStrategy === 'cooperative' && (
                              <>
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] text-[#07C2E3] font-bold block">AI 采购助手 Stuart (Host SCM) &middot; 阶段 2:</span>
                                  <p className="text-slate-200 bg-[#07C2E3]/5 p-2 rounded-lg leading-relaxed inline-block text-left select-all">
                                    &ldquo;我们代表多租户连锁总部发起集采订单，我们将保证在30天内支付账款。希望给予 15% 长期战略性折扣退让？&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] text-emerald-400 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 3:</span>
                                  <p className="text-emerald-350 bg-emerald-950/10 p-2 rounded-lg leading-relaxed select-text">
                                    &ldquo;【友好折让成交】鉴于贵司良好的信用评估，我们同意给予 15% 核心返还折扣。最终让利签约价: **￥157,250**，交货期 10 天！&rdquo;
                                  </p>
                                </div>
                              </>
                            )}

                            {negotiationStrategy === 'strategic' && (
                              <>
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] text-[#07C2E3] font-bold block">AI 采购助手 Stuart (Host SCM) &middot; 阶段 2:</span>
                                  <p className="text-slate-200 bg-[#07C2E3]/5 p-2 rounded-lg leading-relaxed inline-block text-left select-all">
                                    &ldquo;原报价 18.5万 明显高于京东工业大客户均值。按双流向博弈公比，我们发起投标，要求直减 30%。否则我们将路由订单至常熟装配厂。&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] text-amber-450 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 3:</span>
                                  <p className="text-slate-400 bg-slate-950 p-2 rounded-lg leading-relaxed select-text">
                                    &ldquo;直降 30% 将导致制造排班倒挂。我们进行折中反馈，最高能配合减免 20% 并免费赠送仓储。&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] text-[#07C2E3] font-bold block">AI 采购助手 Stuart (Host SCM) &middot; 阶段 4:</span>
                                  <p className="text-slate-200 bg-[#07C2E3]/5 p-2 rounded-lg leading-relaxed inline-block text-left select-all">
                                    &ldquo;我们接受 24% 压缩降让。我们将锁定 5 组连锁扩店合意清单。希望当天打款出运。&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] text-emerald-400 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 5:</span>
                                  <p className="text-emerald-350 bg-emerald-950/10 p-2 rounded-lg leading-relaxed select-text">
                                    &ldquo;【协议达成】接受 24% 直省合同！最终价: **￥140,600**，含包邮。排期 15 天内交付入库完成。&rdquo;
                                  </p>
                                </div>
                              </>
                            )}

                            {negotiationStrategy === 'mercenary' && (
                              <>
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] text-[#07C2E3] font-bold block">AI 采购助手 Stuart (Host SCM) &middot; 阶段 2:</span>
                                  <p className="text-slate-200 bg-[#07C2E3]/5 p-2 rounded-lg leading-relaxed inline-block text-left select-all">
                                    &ldquo;【强极限压榨】检测到您厂多批原材料库压高位，我们只接受 35% 扣点价格，否则自动撤标引入次级外协低价代工。&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] text-amber-450 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 3:</span>
                                  <p className="text-slate-400 bg-slate-950 p-2 rounded-lg leading-relaxed select-text">
                                    &ldquo;这个价格低于直接制造材料开款成本。恕无法配合达成！&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] text-[#07C2E3] font-bold block">AI 采购助手 Stuart (Host SCM) &middot; 阶段 4:</span>
                                  <p className="text-slate-200 bg-[#07C2E3]/5 p-2 rounded-lg leading-relaxed inline-block text-left select-all">
                                    &ldquo;我们将通过 Adyen 接口预锁定 500,000 元备用保证金作为开信，并承担长途破损风险。要求 32% 打折，否则一小时后流标。&rdquo;
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] text-emerald-400 font-bold block">供应商机器人 (Wholesale Corp Bot) &middot; 阶段 5:</span>
                                  <p className="text-emerald-350 bg-emerald-950/10 p-2 rounded-lg leading-relaxed select-text">
                                    &ldquo;【勉强妥协达成】经分厂特授，同意极限放血扣底 32%！成交签约价: **￥125,800**。由于物料紧缺转厂，交期推迟至 28 天交付！&rdquo;
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Visual statistics comparison */}
                        <div className="md:col-span-5 bg-[#0a0b0d] rounded-2xl p-4 border border-slate-900 flex flex-col justify-between space-y-4 text-left">
                          <div className="space-y-3 flex-1 flex flex-col justify-center">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none mb-1">
                              ⚖️ 对客省费测算 / Negotiation Ledger
                            </h4>

                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">供应商最初一口价 / Baseline:</span>
                                <span className="text-slate-400 font-bold line-through">￥{scmNegotiationData.baselineSum.toLocaleString()}</span>
                              </div>

                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-350 font-extrabold">博弈谈判后最终签约价 / Deal:</span>
                                <span className="text-emerald-400 font-black font-mono">￥{scmNegotiationData.negotiatedSum.toLocaleString()}</span>
                              </div>

                              <div className="flex justify-between items-center text-[10.5px]">
                                <span className="text-slate-350 font-extrabold">AI 采购特省比例 / Net Saving:</span>
                                <span className="text-[#07C2E3] font-black font-mono">-{scmNegotiationData.savingsPct}% OFF</span>
                              </div>

                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">预计设备排单出货期 / Lead Time:</span>
                                <span className="text-indigo-400 font-bold font-mono">{scmNegotiationData.expectedDelivery} 个工作日</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[9px] text-slate-400 leading-relaxed font-sans font-medium">
                            <span className="text-amber-450 font-bold">⚠️ 博弈论建议：</span> 采用 “极限砍价” 能大额节省支出，但这通常会导致供应商拖长备货周期，适合储备期长、对开张时间不苛求的店面。
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* PHASE 4: GOVERNMENT LICENSING RPA REGISTRY FORM */}
                    <div className="bg-[#121316] border border-[#232427] rounded-3xl p-5 shadow-lg space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-[#2d2e30] pb-3.5">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#07C2E3]" />
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">阶段 4: 政府工商、消防及食品卫生 RPA 智能报批材料 / Regulatory RPA</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5">自动填报政务资料表格。系统直接收集隐藏参数，一键完成开店前工商预审。</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#07C2E3]/15 border border-[#07C2E3]/25 px-2 py-0.5 rounded-full text-[#07C2E3] font-bold font-mono">
                          REGULATORY RPA
                        </span>
                      </div>

                      {/* Official government application form */}
                      <div className="bg-[#0c0d10] border border-stone-800 p-5 rounded-2xl space-y-4 relative font-sans text-xs select-text">
                        
                        {/* Emblem Mock Header */}
                        <div className="flex items-center justify-between border-b border-[#2d2e30] pb-3 select-none">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                              <span className="text-xs">🇨🇳</span>
                            </div>
                            <div className="text-left leading-none">
                              <h4 className="text-[10px] font-extrabold text-[#07C2E3] font-mono leading-none">统一商户主体资格在线申请预审底表</h4>
                              <span className="text-[8px] text-slate-500 font-mono">State Administration for Market Regulation (RPA Gateway)</span>
                            </div>
                          </div>
                          <span className="text-[8.5px] text-indigo-400 font-mono font-bold">FORM-ID: SAMR-440305-RPA</span>
                        </div>

                        {/* Interactive fields list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-medium">
                          <div className="space-y-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">法定代表人姓名 / Applicant Name</label>
                            <input 
                              type="text" 
                              value={rpaRegistryForm.repName}
                              onChange={(e) => setRpaRegistryForm(prev => ({ ...prev, repName: e.target.value }))}
                              className="w-full bg-[#070809] border border-[#1f2124] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-[#07C2E3]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">法定代表人身份证号 / Representative National ID</label>
                            <input 
                              type="text" 
                              value={rpaRegistryForm.repId}
                              onChange={(e) => setRpaRegistryForm(prev => ({ ...prev, repId: e.target.value }))}
                              className="w-full bg-[#070809] border border-[#1f2124] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-[#07C2E3] font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">拟开办注册资本额度 / Registered Capital</label>
                            <input 
                              type="text" 
                              value={rpaRegistryForm.regCapital}
                              onChange={(e) => setRpaRegistryForm(prev => ({ ...prev, regCapital: e.target.value }))}
                              className="w-full bg-[#070809] border border-[#1f2124] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-[#07C2E3]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">申报物理常驻注册地址 / Proposed Registry Address</label>
                            <input 
                              type="text" 
                              value={rpaRegistryForm.registeredDistrict}
                              onChange={(e) => setRpaRegistryForm(prev => ({ ...prev, registeredDistrict: e.target.value }))}
                              className="w-full bg-[#070809] border border-[#1f2124] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-[#07C2E3]"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">登记范围与经营品类规范 / Target Scope of Trade Operation</label>
                            <textarea 
                              value={rpaRegistryForm.businessScope}
                              rows={2}
                              onChange={(e) => setRpaRegistryForm(prev => ({ ...prev, businessScope: e.target.value }))}
                              className="w-full bg-[#070809] border border-[#1f2124] rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:outline-[#07C2E3] font-sans"
                            />
                          </div>
                        </div>

                        {/* Interactive Signature Box */}
                        <div className="border-t border-slate-900 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                          <div className="space-y-2">
                            <label className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                              ✍️ 签署中方代表人电子印鉴 (请在此框内输入您的真实名字授权 RPA 行动)
                            </label>
                            <input
                              type="text"
                              value={rpaSignedName}
                              onChange={(e) => setRpaSignedName(e.target.value)}
                              placeholder="例如：张建华"
                              className="bg-[#070809] border-b border-indigo-500 py-1 px-2 text-xs text-white italic font-serif tracking-widest text-center w-64 focus:outline-none placeholder-slate-700"
                            />
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] text-slate-450">
                              <input 
                                type="checkbox" 
                                checked={rpaCheckboxAccepted} 
                                onChange={(e) => setRpaCheckboxAccepted(e.target.checked)}
                                className="accent-[#07C2E3] rounded"
                              />
                              <span>本人声明所填表彰均属真实准确 / Self-Declaration</span>
                            </label>
                            
                            <button
                              type="button"
                              disabled={!rpaSignedName || !rpaCheckboxAccepted || rpaSubmitted}
                              onClick={() => {
                                setRpaSubmitted(true);
                              }}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-wide uppercase shadow-sm transition-all cursor-pointer ${
                                rpaSubmitted 
                                  ? 'bg-emerald-950 border border-emerald-900 text-emerald-400' 
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {rpaSubmitted ? '✓ RPA 工商预审材料提交成功！' : '⚡ 授权 RPA 安全推送至工商局预审'}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* PHASE 5: FINANCIAL PRO-FORMA SENSITIVITY AND ROI MATRICES */}
                    <div className="bg-[#121316] border border-[#232427] rounded-3xl p-5 shadow-lg space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-[#2d2e30] pb-3.5">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[#07C2E3]" />
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-white">阶段 5: ROI 盈亏测算与现金流 pro-forma 电子表格 / Financials</h3>
                            <p className="text-[9px] text-slate-400 mt-0.5">直接测算运营指标，模拟回本时间。拖拉客单、流量及雇员参数立绘盈余大表。</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#07C2E3]/15 border border-[#07C2E3]/25 px-2 py-0.5 rounded-full text-[#07C2E3] font-bold font-mono">
                          ROI METRICS
                        </span>
                      </div>

                      {/* Financial chart / spreadsheet split */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch text-xs font-mono">
                        
                        {/* 1. Sliders parameters input */}
                        <div className="md:col-span-4 bg-[#0a0b0d] rounded-2xl p-4 border border-slate-900 space-y-4 flex flex-col justify-center text-[10.5px]">
                          <h4 className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">
                            🎛️ 敏感性参数拖动 / Sensitivity Sliders
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">自估客单价 / Avg Ticket:</span>
                                <span className="text-[#07C2E3] font-bold">￥{avgCustomerSpend} 元</span>
                              </div>
                              <input 
                                type="range" 
                                min="15" 
                                max="150" 
                                value={avgCustomerSpend}
                                onChange={(e) => setAvgCustomerSpend(Number(e.target.value))}
                                className="w-full accent-[#07C2E3] h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">预设月销量 / Monthly Volume:</span>
                                <span className="text-[#07C2E3] font-bold">{monthlyVolumeSales} 笔单</span>
                              </div>
                              <input 
                                type="range" 
                                min="1000" 
                                max="15000" 
                                value={monthlyVolumeSales}
                                step="200"
                                onChange={(e) => setMonthlyVolumeSales(Number(e.target.value))}
                                className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">在岗物理员工数 / Physical Staff:</span>
                                <span className="text-indigo-400 font-bold">{staffCount} 人</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="15" 
                                value={staffCount}
                                onChange={(e) => setStaffCount(Number(e.target.value))}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Computational Ledger sheet output */}
                        <div className="md:col-span-8 bg-[#0a0b0d] border border-slate-900 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                          <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none">
                            🧾 pro-forma 营业盈亏平衡表 / Sensitivity Sheet
                          </h4>
                          
                          <div className="space-y-2 text-[10px] leading-relaxed">
                            <div className="flex justify-between border-b border-slate-950 pb-1.5">
                              <span className="text-slate-500">预计月营业流水收入 / Est. Monthly Revenue:</span>
                              <span className="text-white font-extrabold font-mono">￥{financials.revenue.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-950 pb-1.5">
                              <span className="text-slate-500">产品配餐制售原材料成本 / Est. Cost of Goods (COGS):</span>
                              <span className="text-slate-300 font-bold font-mono">￥{financials.cogs.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-950 pb-1.5">
                              <span className="text-slate-500">南山区商铺租金扣除 / Estimated Rent (85㎡):</span>
                              <span className="text-slate-300 font-bold font-mono">￥{financials.rent.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-950 pb-1.5">
                              <span className="text-slate-500">全班物理员工薪酬支出 / Est. Wage & Staff (FTEs):</span>
                              <span className="text-slate-300 font-bold font-mono">￥{financials.wages.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-950 pb-1.5">
                              <span className="text-slate-500">水电煤气、刷卡费及营销 / Marketing, Power & Fees:</span>
                              <span className="text-slate-300 font-bold font-mono">￥{financials.otherCost.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between border-b border-zinc-900 pb-1.5 pt-1 lg:text-xs">
                              <span className="text-slate-350 font-black">每日账结累计预估净利润 / Monthly Net Profit:</span>
                              <span className="text-emerald-400 font-black font-mono">￥{financials.netProfit.toLocaleString()} 元</span>
                            </div>

                            <div className="flex justify-between pt-1 select-none">
                              <span className="text-indigo-400 font-extrabold">预计收回开店成本期 / Payback Period:</span>
                              <span className="text-indigo-400 font-black font-mono tracking-wider">{financials.paybackMonths} 个月</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* RIGHT SMALL AREA - COLLABORATION TIMELINE LOGS AND METRIC STATS */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* CORE STORE DESIGNED SUMMARY PANEL */}
                    <div className="bg-gradient-to-br from-[#121316] to-[#041c21] border border-slate-800 p-5 rounded-3xl space-y-4">
                      <div className="space-y-1 text-left select-none">
                        <span className="text-[9.5px] font-mono text-[#07C2E3] font-black tracking-widest uppercase block">
                          Store Profile Draft
                        </span>
                        <h3 className="text-base font-black text-white">{workspaceName}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">经营行业类目：时尚轻食连锁 / Food Presets</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3.5 space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">拟定店面名称 / Edit Name</label>
                          <input 
                            type="text" 
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="bg-slate-950/60 border border-slate-900 rounded-lg px-2.5 py-1.5 text-xs text-white w-full focus:outline-none focus:border-[#07C2E3]"
                          />
                        </div>

                        <div className="space-y-1 select-none">
                          <label className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">核查起航开售大类渠道 / Active Channels</label>
                          <div className="flex flex-wrap gap-1">
                            {selectedChannels.map((ch, idx) => (
                              <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#07C2E3]">
                                ✓ {ch}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 select-none">
                          <label className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-semibold block">自愈合规检测哨兵 / Agent Check</label>
                          <div className="space-y-1.5 font-mono text-[9px] leading-none">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>CEO 执政智能体</span>
                              <span className="text-emerald-400 font-bold">● ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>选址及评估智能体</span>
                              <span className="text-emerald-400 font-bold">● ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>3D BIM装修设计师</span>
                              <span className="text-emerald-400 font-bold">● ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>商物采购博弈智能体</span>
                              <span className="text-emerald-400 font-bold">● ONLINE</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 select-none">
                        <button
                          type="button"
                          onClick={handleDeploySaaSPlatform}
                          className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md cursor-pointer"
                        >
                          🚀 下发布署：同步多租户 SaaS 后台
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => setActiveStep(0)}
                          className="w-full text-center mt-3 text-[10px] text-slate-500 hover:text-white transition-colors underline cursor-pointer font-bold"
                        >
                          不满意？返回重新一句话调整
                        </button>
                      </div>
                    </div>

                    {/* REGULATORY FIRE SAFETY COMPLIANCE WARNING */}
                    <div className="bg-[#121316] border border-[#232427] p-5 rounded-3xl space-y-3 font-sans text-left text-xs text-slate-350 flex flex-col justify-between">
                      <div className="font-extrabold text-[#07C2E3] flex items-center gap-1.5 uppercase font-mono">
                        <Flame className="w-4 h-4 text-[#07C2E3] animate-pulse" /> 消防、安全注册及法务预审 / GDPR compliance
                      </div>
                      
                      <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                        根据欧盟 GDPR 法规以及深圳特殊轻食防火排潮规范，店内的 BIM 水电强电线路已通过自动验算，安全隔离级别达 AES-256，保障商户运营无忧。已为您自动配备消防应急灯配线。
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* LOWER FOOTER */}
      <footer className="py-6 border-t border-[#1f2124] px-8 text-center select-none bg-[#070809]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-slate-650">
          <span>AI BUSINESS OS MULTI-AGENT COMPILER © 2026</span>
          <span className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>HUMAN IN THE LOOP CONTROL</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
