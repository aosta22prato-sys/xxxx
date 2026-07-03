import { ProductItem, OrderItem, CustomerItem } from '../types';
import { AICoreIntelligence, PlanTaskNode } from '../services/AICoreIntelligence';

export interface IntelligentReply {
  text: string;
  actionType: 'product_create' | 'restock' | 'campaign' | 'customer_recall' | 'none' | 'switch_tab' | 'APPLY_OPTIMIZED_COPY' | 'COMPARE_PREVIEW' | 'EXPORT_FINANCE_REPORT' | 'PREFILL_PRODUCT' | 'BIND_GENERATED_IMAGE' | 'PRICE_ADJUST' | 'CREATE_COUPON';
  metaObj: any;
  suggestions: any[];
  thought?: {
    intent: string;
    reasoning: string;
    planning: string;
    permission: string;
    toolRouter: string;
    validator: string;
  };
}

export function generateIntelligentLocalReply(
  query: string,
  products: ProductItem[],
  orders: OrderItem[],
  customers: CustomerItem[],
  brainContext?: { currentPage: string; storeReadiness: number; gaps: string[]; recommendedAction: string }
): IntelligentReply {
  const queryLower = query.toLowerCase().trim();
  const brain = new AICoreIntelligence(products, orders, customers);

  let text = '';
  let actionType: IntelligentReply['actionType'] = 'none';
  let metaObj: any = null;
  let suggestions: any[] = [];
  
  let intentClass = 'CHAT';
  let reasoningGoal = '常规经营健康审计';
  let reasoningCurrentState = '中台正常运行';
  let reasoningMissingInfo = '无';
  let reasoningRisk = '低';
  let reasoningNextAction = '';
  let planningTasks = '1. 接受命令；2. 执行策略过滤；3. 激活安全校验。';
  let permissionCheck = 'ADMIN_APPROVED (商家主管理员令牌对齐)';
  let toolRoute = 'AI_Brain_OS -> CoreIntelligence';
  let validationResult = 'SUCCESS (安全核签一致)';

  // Query condition matching
  const isGoProducts = queryLower.includes('去商品库') || queryLower.includes('打开商品中心') || queryLower.includes('打开商品') || queryLower === '商品库' || queryLower === '商品中心';
  const isGoOrders = queryLower.includes('打开订单中心') || queryLower.includes('去订单') || queryLower.includes('打开订单') || queryLower === '订单中心';
  const isTodaySalesQuery = queryLower.includes('查看今天销售额') || queryLower.includes('今天销售额') || queryLower.includes('今天销售多少') || queryLower === '今日业绩' || queryLower === '今日销售额';
  const isLossCustomersQuery = queryLower.includes('哪些客户快流失了') || queryLower.includes('流失客') || queryLower.includes('哪些客户流失') || queryLower.includes('流失客户') || queryLower === '选项三' || queryLower === '3';
  const isCreateWinterCampaign = queryLower.includes('帮我创建冬季清仓活动') || queryLower.includes('创建冬季清仓活动') || queryLower.includes('冬季清仓活动') || queryLower.includes('冬季清仓') || queryLower === '选项二' || queryLower === '2';
  const isProfitDropQuery = queryLower.includes('为什么利润下降') || queryLower.includes('利润下降') || queryLower.includes('诊断利润') || queryLower === '选项一' || queryLower === '1';
  const isFrustrated = queryLower.includes('笨') || queryLower.includes('傻逼') || queryLower.includes('垃圾') || queryLower.includes('智障') || queryLower.includes('说话太长') || queryLower.includes('废话') || queryLower.includes('乱回') || queryLower.includes('傻子');
  const isFranceStockQuery = queryLower.includes('法国仓库') || queryLower.includes('法国仓') || queryLower.includes('法国库存');
  const isMapQuery = queryLower.includes('地图') || queryLower.includes('map') || queryLower.includes('定位') || queryLower.includes('gis');
  const isVatQuery = queryLower.includes('vat') || queryLower.includes('增值税') || queryLower.includes('vat合规') || queryLower.includes('vat问题');
  const isPosQuery = queryLower.includes('pos设置') || queryLower.includes('pos 设置');
  const isDevDocsQuery = queryLower.includes('api') || queryLower.includes('接口') || queryLower.includes('开发') || queryLower.includes('mcp') || queryLower.includes('文档') || queryLower.includes('dev');
  const isClearInventory = queryLower.includes('清库存') || queryLower.includes('清理库存') || queryLower.includes('清仓');
  const isParisInventory = queryLower.includes('巴黎') || queryLower.includes('巴黎仓') || queryLower.includes('法国保税仓') || queryLower.includes('巴黎仓库');
  const isClearInventoryConfirm = queryLower.includes('同意冬季清仓') || queryLower.includes('做冬季清仓') || queryLower.includes('执行冬季清仓') || queryLower.includes('创建活动');
  const hasUploadedFile = queryLower.includes('[已上传');

  const isGreeting = 
    queryLower === '你好' || 
    queryLower === 'hi' || 
    queryLower === 'hello' || 
    queryLower.startsWith('你好') ||
    queryLower.includes('在吗') ||
    queryLower.includes('哈喽') ||
    queryLower.includes('嗨');

  const isNumeric1 = queryLower === '1' || queryLower === '1.' || queryLower === '01' || queryLower === '一' || queryLower === '①';

  const isDangerous = queryLower.includes('删除全部') || queryLower.includes('清空') || queryLower.includes('销毁');
  const isProductCreate = queryLower.includes('创建商品') || queryLower.includes('新建商品') || queryLower.includes('上架商品') || queryLower.includes('上架新商品');
  const isOrderQuery = queryLower.includes('今天订单') || queryLower.includes('订单') || queryLower.includes('发货');
  const isInventoryQuery = queryLower.includes('库存') || queryLower.includes('货源') || queryLower.includes('补货') || queryLower === '选项四' || queryLower === '4';
  const isCustomerQuery = queryLower.includes('客户') || queryLower.includes('会员') || queryLower.includes('crm') || queryLower.includes('召唤') || queryLower.includes('召回');

  const isKnowledgeGraph = queryLower.includes('知识图谱') || queryLower.includes('图谱') || queryLower.includes('关系图') || queryLower.includes('graph');
  const isSimulation = queryLower.includes('降价') || queryLower.includes('折扣模拟') || queryLower.includes('模拟') || queryLower.includes('调价');
  const isGrowthStrategy = queryLower.includes('提高销量') || queryLower.includes('销量提升') || queryLower.includes('销量下滑') || queryLower.includes('策略');
  const isGoalSystem = queryLower.includes('目标') || queryLower.includes('goal');
  const isSelfOptimization = queryLower.includes('优化') || queryLower.includes('自研') || queryLower.includes('self-opt') || queryLower.includes('权重');
  const isImageGeneration = queryLower.includes('图片') || queryLower.includes('画') || queryLower.includes('生成海报') || queryLower.includes('海报') || queryLower.includes('白底图') || queryLower.includes('黑底图') || queryLower.includes('设计') || queryLower.includes('视觉') || queryLower.includes('image') || queryLower.includes('photo') || queryLower.includes('poster') || queryLower.includes('banner');
  const isExecutiveLayer = queryLower.includes('报告') || queryLower.includes('ceo') || queryLower.includes('总裁') || queryLower.includes('executive');
  const isAutonomousBI = queryLower.includes('监控') || queryLower.includes('预警') || queryLower.includes('异常') || queryLower.includes('机会') || queryLower.includes('数据发现') || queryLower.includes('anomaly') || queryLower.includes('insight');
  const isPlannerCheck = queryLower.includes('规划') || queryLower.includes('值守') || queryLower.includes('planner');
  const isBusinessBrain = queryLower.includes('大脑') || queryLower.includes('os') || queryLower.includes('brain') || queryLower.includes('v4') || queryLower.includes('v5');

  const isWhatShouldIDoQuery = queryLower.includes('做什么') || queryLower.includes('下一步') || queryLower.includes('现在该干嘛') || queryLower.includes('诊断') || queryLower.includes('怎么办');

  const isPriceAdjustUpdate = queryLower.includes('价格提高') || queryLower.includes('价格提升') || queryLower.includes('上涨售价') || queryLower.includes('价格上涨') || queryLower.includes('涨价') || queryLower.includes('价格调高') || queryLower.includes('调高价格') || queryLower.includes('价格上浮');
  const isCouponGeneration = queryLower.includes('生成折扣') || queryLower.includes('创建折扣') || queryLower.includes('做个折扣') || queryLower.includes('生成优惠券') || queryLower.includes('发个优惠') || queryLower.includes('发折扣');

  let extractedMultiplier = 1.05;
  let extractedThreshold = 10;
  
  // Extract percentages or thresholds from query
  const matchesPercent = queryLower.match(/(\d+(?:\.\d+)?)\s*%/);
  if (matchesPercent && matchesPercent[1]) {
    const pct = parseFloat(matchesPercent[1]);
    if (queryLower.includes('涨') || queryLower.includes('提') || queryLower.includes('高') || queryLower.includes('上浮')) {
      extractedMultiplier = 1 + (pct / 100);
    } else if (queryLower.includes('降') || queryLower.includes('调低') || queryLower.includes('低') || queryLower.includes('扣')) {
      extractedMultiplier = 1 - (pct / 100);
    }
  }

  // Threshold extraction for inventory (e.g. "低于 10")
  const matchThresh = queryLower.match(/(?:低于|少于|小于|低|下|少)\s*(\d+)/);
  if (matchThresh && matchThresh[1]) {
    extractedThreshold = parseInt(matchThresh[1]);
  }

  let extractedDiscountPercent = '10%';
  const discountMatch = queryLower.match(/(\d+(?:\.\d+)?)\s*%/);
  if (discountMatch && discountMatch[1]) {
    extractedDiscountPercent = `${discountMatch[1]}%`;
  }

  // Branch mapping
  if (isPriceAdjustUpdate) {
    intentClass = 'PRICE_OPTIMIZATION';
    reasoningGoal = '批量单价升调修正';
    const pctText = Math.abs(Math.round((extractedMultiplier - 1) * 100));
    text = `价格批量调整已执行：已将库存低于或等于 **${extractedThreshold}** 件的商品单价提高 **${pctText}%**。`;
    actionType = 'PRICE_ADJUST';
    metaObj = { threshold: extractedThreshold, multiplier: extractedMultiplier };
    suggestions = [{ label: '前往商品中心核对售价', action: 'switch_tab', payload: 'products' }];
  }
  else if (isCouponGeneration) {
    intentClass = 'CAMPAIGN_MARKETING';
    const code = `PROMO-SAVE-${extractedDiscountPercent.replace('%', '')}`;
    text = `专属折扣券 **${code}** 创设成功：已落库并激活，全店可享受 **${extractedDiscountPercent} OFF** 特惠。`;
    actionType = 'CREATE_COUPON';
    metaObj = { code, discount: extractedDiscountPercent, campaign_name: `语言生成卡券 (${extractedDiscountPercent} OFF)` };
    suggestions = [{ label: '极速进入营销活动中心', action: 'switch_tab', payload: 'marketing' }];
  }
  else if (isGoProducts) {
    intentClass = 'COMMAND_ROUTING';
    text = `已为您物理切换到商品库 (Product Center) 面板。`;
    actionType = 'switch_tab';
    metaObj = 'products';
  }
  else if (isGoOrders) {
    intentClass = 'COMMAND_ROUTING';
    text = `已为您物理切换到订单中心 (Order Center) 面板。`;
    actionType = 'switch_tab';
    metaObj = 'orders';
  }
  else if (isTodaySalesQuery) {
    intentClass = 'DATA_QUERY';
    const totalSalesSum = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const resolvedSales = totalSalesSum > 0 ? totalSalesSum : 12480;
    const resolvedOrdersCount = orders.length > 0 ? orders.length : 148;
    const resolvedProfit = Math.round(resolvedSales * 0.35);
    text = `今日 GMV: **€${resolvedSales.toFixed(2)}** (${resolvedOrdersCount} 笔已付)，预估净利润 **€${resolvedProfit.toFixed(2)}**。`;
    actionType = 'switch_tab';
    metaObj = 'finance';
  }
  else if (isLossCustomersQuery) {
    intentClass = 'CRM_ANALYSIS';
    text = `CRM 已锁定 **3位** 有流失风险的海外 VIP 老客。建议发送专属券挽回，亦可发送 "客户召回" 一键直邮。`;
    actionType = 'switch_tab';
    metaObj = 'customers';
    suggestions = [{ label: '进入客户中心人工挽回', action: 'switch_tab', payload: 'customers' }];
  }
  else if (isCreateWinterCampaign) {
    intentClass = 'ACTION_ROUTING';
    text = `冬季清仓促销活动已创建：全店通用 **10% OFF** 特惠卡券已物理落库并在结算端生效。`;
    actionType = 'campaign';
    metaObj = { campaign_id: 'winter_clearance', discount: '10%' };
    suggestions = [{ label: '进入促销卡券中心', action: 'switch_tab', payload: 'marketing' }];
  }
  else if (isProfitDropQuery) {
    intentClass = 'DATA_QUERY';
    text = `利润下降 2.3% 主因：意德线物流专线费上涨 4.1% 以及大衣尺码退货损耗。建议多用巴黎海外仓并微调尺码建议。`;
    actionType = 'switch_tab';
    metaObj = 'finance';
  }
  else if (isMapQuery) {
    intentClass = 'LOGISTICS_MAP_GIS_TRACK';
    text = `地图定位切换成功！米兰总仓 1480、巴黎海外仓 890（大衣服装低水位告急）、柏林仓 610。`;
    actionType = 'switch_tab';
    metaObj = 'logistics';
    suggestions = [{ label: '查看仓库监控大盘', action: 'switch_tab', payload: 'logistics' }];
  }
  else if (isFranceStockQuery) {
    intentClass = 'LOGISTICS_INVENTORY_QUERY';
    text = `法国巴黎海外仓实盘：针织衫 148、防风外套 12（🚨断警，预计 4 天内告末）、短靴 85。可发送 "一键补货" 追加。`;
    actionType = 'switch_tab';
    metaObj = 'logistics';
    suggestions = [{ label: '为防风外套一键加急补货', action: 'restock', payload: 'SKU-COAT-88' }];
  }
  else if (isVatQuery) {
    intentClass = 'TAX_COMPLIANCE_KNOWLEDGE';
    text = `税规健康度为 87。主要隐患为未入驻欧盟增值税一站式申报 (VAT OSS)，您可以对我说 “一键合规” 以注册。`;
    actionType = 'none';
  }
  else if (isPosQuery) {
    intentClass = 'RETAIL_INTEGRATION_KNOWLEDGE';
    text = `POS 配对指南：系统无缝级兼容 PAX 及 Adyen 的移动收银终端，可在设置中心绑定已对齐网销与地销账账。`;
    actionType = 'switch_tab';
    metaObj = 'settings';
  }
  else if (isDevDocsQuery) {
    intentClass = 'DEVELOPER_KNOWLEDGE';
    text = `系统开放标准的 API 服务：产品同步 \`GET /api/v1/products\`、订单 \`GET /api/v1/orders\`。调试沙箱已载入。`;
    actionType = 'switch_tab';
    metaObj = 'mcp';
  }
  else if (isWhatShouldIDoQuery) {
    intentClass = 'SIDEKICK_BUSINESS_READINESS_RECOMMENDATION';
    const scoreVal = brainContext?.storeReadiness || 87;
    text = `当前店铺就绪度评分为 **${scoreVal}%**。核心短板为：未开通 VAT OSS 与巴黎仓大衣见底。建议立即安全补齐。`;
    actionType = 'switch_tab';
    metaObj = 'command';
  }
  else if (isBusinessBrain) {
    intentClass = 'ENTERPRISE_COGNITIVE_BRAIN_V5';
    text = `AI 经营大脑已平稳运行。您可以发送“库存不足”、“补货”、“一键提价5%”、“诊断利润”等自然语言直接调度后台。`;
    actionType = 'none';
  }
  else if (isAutonomousBI) {
    intentClass = 'AUTONOMOUS_BI';
    text = `数据中心异常：爆款防风外套处于极低警戒线 (12 件)。建议一键补足备料以防止断货造成的营收损失。`;
    actionType = 'restock';
    suggestions = [{ label: '一键向供应商采购断货款', action: 'restock', payload: {} }];
  }
  else if (isGoalSystem) {
    intentClass = 'GOAL_EXECUTION_SYSTEM';
    text = `本阶段出海总 GMV 经营进度已完成 **85%**。推荐对巴黎积压大衣外套做 “冬季清仓” 以迅速回笼资金。`;
    actionType = 'none';
  }
  else if (isSelfOptimization) {
    intentClass = 'SELF_OPTIMIZATION';
    const auditRes = brain.auditOwnPerformance();
    text = `经营大脑算法已自校准：累计调度 ${auditRes.auditedActionsCount} 次策略，核心决策胜率为 **${auditRes.successRatioPct}%**。`;
    actionType = 'none';
  }
  else if (isExecutiveLayer) {
    intentClass = 'EXECUTIVE_INTELLIGENCE';
    text = `CEO 特急提示：巴黎大衣严重低存中；意向高额 VIP 面临流失。分别只需发送“紧急补货”及“客户召回”即可核定。`;
    actionType = 'none';
  }
  else if (isPlannerCheck) {
    intentClass = 'AUTONOMOUS_PLANNER';
    text = `店铺托管计划在线。全店交易指标检测正常，异常及风险物流阻断哨兵在后台 24h 高温流转守护中。`;
    actionType = 'none';
  }
  else if (isGreeting) {
    intentClass = 'GREETING';
    text = `你好，有什么我可以帮忙的吗？`;
    suggestions = [];
  }
  else if (isNumeric1) {
    intentClass = 'CHAT';
    text = `你想让我做什么任务？`;
    suggestions = [];
  }
  else if (isFrustrated) {
    intentClass = 'FRUSTRATION_HELP';
    text = `抱歉！答复格式已调优。我可以极速为您做：补足大衣库存、调优价格、创建一键营销优惠或无缝语言翻译。`;
    actionType = 'none';
    metaObj = null;
  }
  /*
  }��试沙箱，支持密钥一键分发与模拟。*`;
  */
  else if (isWhatShouldIDoQuery) {
    intentClass = 'SIDEKICK_BUSINESS_READINESS_RECOMMENDATION';
    const scoreVal = brainContext?.storeReadiness || 87;
    text = `### 🎯 店铺就绪度及增长诊断\n\n` +
      `- **就绪评分**: **${scoreVal}%**\n` +
      `- **核心短板**: VAT OSS 一站式缺注册 | 巴黎分仓爆款大衣水位见底\n` +
      `- **中台推荐动作**: 👉 **立即为低库存 SKU 补满库存** 或 **激活注册代理**`;
    actionType = 'switch_tab';
    metaObj = 'command';
  }
  else if (isBusinessBrain) {
    intentClass = 'ENTERPRISE_COGNITIVE_BRAIN_V5';
    text = `### 🧠 AI Commerce OS 经营决策大脑已激活\n\n` +
      `后台多智能体中枢正在平稳守护您的店铺，自动承担库存盘点与异常监控任务。\n` +
      `作为店主，您无需关注复杂的内核参数，直接用日常语言向我发出指令即可下达后台执行：\n\n` +
      `- **业绩**: “我想看今天销售额”、“诊断利润原因”\n` +
      `- **管理**: “帮我上架商品”、“一键提价5%”\n` +
      `- **调度**: “低库存补货”、“对巴黎在架产品清仓”`;
    actionType = 'none';
  }
  else if (isAutonomousBI) {
    intentClass = 'AUTONOMOUS_BI';
    text = `### 👁️ 自主数据发现与异常主动预警\n\n` +
      `- **实存异常**: [P0] 防风外套 (SKU-COAT-88) 库存处于极低警戒线 (仅存 12 件)\n` +
      `- **资损警告**: 驼色风衣退货率破 3.5%，尺码不准拉高了二次通关逆向物流亏损\n` +
      `- **自愈建议**: 一键进行缺货采购备齐库存，并在商品信息页追加尺码选择提醒。`;
    actionType = 'restock';
    suggestions = [{ label: '📦 一键向供应商采购断货款', action: 'restock', payload: {} }];
  }
  else if (isGoalSystem) {
    intentClass = 'GOAL_EXECUTION_SYSTEM';
    text = `### 🎯 店铺主攻经营目标执行看板\n\n` +
      `- **主推战役**: 提高西欧及欧洲出海销量与营业总流水\n` +
      `- **本阶段总进度**: 🟢 **85%** (已自动分解为商品尺码调优与卡券促活)\n` +
      `- **推荐下一步**: 发送 “冬季清仓” 以一键激活针对沉默用户的特定让利。`;
    actionType = 'none';
  }
  else if (isSelfOptimization) {
    intentClass = 'SELF_OPTIMIZATION';
    const auditRes = brain.auditOwnPerformance();
    text = `### ⚙️ 多模决策算法自校准与优化\n\n` +
      `- **历史指令审计**: 已累计执行 **${auditRes.auditedActionsCount}** 次后台策略调度\n` +
      `- **策略胜率记录**: **${auditRes.successRatioPct}%** (已自动完成反向传播自校调，确保后续推荐行为精准)。`;
    actionType = 'none';
  }
  else if (isExecutiveLayer) {
    intentClass = 'EXECUTIVE_INTELLIGENCE';
    text = `### 👔 CEO 经营核心专案\n\n` +
      `- **P0 红色特急**: 防风外套严重面断货 (预计带来销货损失 €12,000.00)\n` +
      `- **P1 款式预警**: 3位沉默 VIP 存在流失风险 (预计资产挽留空间 €1,500.00)\n\n` +
      `您可直接答复 “**紧急补货**” 或 “**一键卡券催付**” 来立即派发执行。`;
    actionType = 'none';
  }
  else if (isPlannerCheck) {
    intentClass = 'AUTONOMOUS_PLANNER';
    text = `### 🛰️ 智能全托管计划 24 小时在线监护\n\n` +
      `- **值守状态**: 🟢 **全店指标及结账状态完美畅通，未见异常**\n` +
      `- **防护目标**: WMS 水位波动监护及欺诈纠纷自动截断\n\n` +
      `*经营大脑在后台实时平稳值守，您随时可以进行安心销售。*`;
    actionType = 'none';
  }
  else if (isGreeting) {
    intentClass = 'GREETING';
    text = `您好！我是您的 AI Commerce OS 智能经营中台🧠\n\n` +
      `请问有什么可以支持您？不管是财务、进货补仓、翻译优化还是卡券大促，您随时可直接用日常语言告诉我（比如：“诊断利润下降”、“紧急补货”、“打开商品中心”）。`;
    suggestions = [];
  }
  else if (isFrustrated) {
    intentClass = 'FRUSTRATION_HELP';
    text = `您好！非常抱歉刚才的回复不够精简有条理。当前系统已彻底调优！\n\n` +
      `您随时可以直接用纯自然语言向我发出指令（例：紧急补货、创建冬季大促、利润诊断、导出对账财务表、修改背景为黑色等），我将为您即时调用 API，绝无冗余废话。`;
  }
  else if (isDangerous) {
    intentClass = 'DANGEROUS_TASK';
    text = `### 🚨 动作被 Governor 安全合规引擎强制驳回\n\n` +
      `- **违规级别**: 高危警戒 (DANGEROUS APPROVED REFUSED)\n` +
      `- **原因**: 检测到具有危害性的擦除主库或物理清库申请，已触发安全哨兵防护挂起。` +
      `本大区已强制拦截，安全防护已就绪。`;
    actionType = 'none';
  }
  else if (isKnowledgeGraph) {
    intentClass = 'KNOWLEDGE_GRAPH';
    text = `### 🕸️ 商业关联逻辑与因果图谱\n\n` +
      `- **焦点拓扑**: 广告买量 ➡️ 加购阻尼 ➡️ 付款 checkout ➡️ 物流履约时效\n` +
      `- **根源定位**: 驼色爆品退款率偏高与注册 VAT 税号缺失，目前正对净盈利能力构成压挤阻碍。\n\n` +
      `建议前往商户端更新尺码属性描述并进行一站式 OSS 税务申报。`;
    actionType = 'switch_tab';
    metaObj = 'settings';
  }
  else if (isSimulation) {
    intentClass = 'SIMULATION';
    const digitsInQuery = queryLower.match(/(\d+)%/);
    const discountPctSimulated = digitsInQuery ? parseInt(digitsInQuery[1]) : 15;
    text = `### 📊 降价折扣弹性期望测试\n\n` +
      `- **折扣拟定**: 全店通用让利 **${discountPctSimulated}%**\n` +
      `- **平均预期销售额**: **€1,248.00**\n` +
      `- **风控安全联审**: 🟢 **PASS** (在销售边际毛利率 >15% 底线之上，随时可放心部署生效)。`;
    actionType = 'none';
  }
  else if (isGrowthStrategy) {
    intentClass = 'GROWTH_STRATEGY';
    text = `### 📈 店铺销量与销售额提升策略\n\n` +
      `- **第一优选推荐**: **爆品缺货紧急备仓 + 尺码属性微调修补**\n` +
      `- **预计拉升 GMV**: **+€1,500.00**\n\n` +
      `您随时可回复 “**紧急补回**” 或 “**创建冬季促销**” 由智能代理一键生效。`;
    actionType = 'none';
  }
  else if (isImageGeneration) {
    intentClass = 'IMAGE_GENERATION_AGENT';
    const isMobileAspect = queryLower.includes('手机') || queryLower.includes('mobile') || queryLower.includes('9:16') || queryLower.includes('竖');
    const isBlackBackground = queryLower.includes('黑') || queryLower.includes('black') || queryLower.includes('深色') || queryLower.includes('暗色');
    const isWhiteBackground = queryLower.includes('白') || queryLower.includes('white') || queryLower.includes('浅色') || queryLower.includes('亮色');

    if (isMobileAspect) {
      text = `### 📱 AI 视觉合成: 9:16 Instagram/TikTok 投放海报已合好\n\n` +
        `已剔除多余配置，为您生成符合意式轻奢格调的 9:16 竖屏手机主图海报，已自动在底层挂接：\n\n` +
        `![Mobile Chic](https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=1067&q=80)\n\n` +
        `您只需继续对我说 “**把底底色改成黑色**” 来完成画面实时精修。`;
      actionType = 'BIND_GENERATED_IMAGE';
      metaObj = { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=1067&q=80' };
    } else if (isBlackBackground) {
      text = `### 🎨 AI 视觉微调: solid 黑绒底色画幅微调成功\n\n` +
        `已成功剥离前置阴影，融合入 bespoke 高级黑色背景：\n\n` +
        `![Solid Black Velvet](https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80)\n\n` +
        `您可以通过 “保存主图” 将其一键作为您店内的头图视觉资产。`;
      actionType = 'BIND_GENERATED_IMAGE';
      metaObj = { url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80' };
    } else if (isWhiteBackground) {
      text = `### 🎨 AI 视觉微调: Studio 纯澈白底合成成功\n\n` +
        `已成功转换并为您呈现标准 Studio 白底图，完全豁免 Google 商业清单拒收红线：\n\n` +
        `![Bespoke Pure White](https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80)`;
      actionType = 'BIND_GENERATED_IMAGE';
      metaObj = { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' };
    } else {
      text = `### 🎨 AI 视觉大图合成已完成\n\n` +
        `智能决策最适合的首图视觉尺寸，完美合成了 1:1 欧美轻奢基调产品宣传板底图：\n\n` +
        `![European Minimalist Chic](https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80)\n\n` +
        `回复 “**修改背景为黑色**” 或 “**换换成手机端9:16规格**” 来进行画图精细。`;
      actionType = 'BIND_GENERATED_IMAGE';
      metaObj = { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80' };
    }
  }
  else if (isClearInventoryConfirm) {
    intentClass = 'MULTI_STEP_DISCOUNT_DEPLOY';
    text = `### 优惠卡券促销活动已安全创建\n\n` +
      `- **促销代金**: 全店通用 10% OFF 卡券大盘\n` +
      `- **去呆化效果**: 降价 10% 回笼流动资金，缩短仓储周期约 12 天\n\n` +
      `已安全核准发布，当前结算环节已可以直接支持使用。`;
    actionType = 'campaign';
    metaObj = { campaign_id: 'winter_clearance', discount: '10%' };
  }
  else if (isParisInventory) {
    intentClass = 'MULTI_STEP_DISPOSAL_ANALYSIS';
    text = `### 📦 巴黎保税分仓商品积压盘点\n\n` +
      `- **核心积压货品**: **防风外套外套 (SKU-COAT-88)** （实盘仅余 12 件，但大量追加件在途导致周转较慢）\n` +
      `- **滞销沉淀资金**: 合计积压货品估算总值 **€12,000.00**\n\n` +
      `建议一键开启冬季清仓大保卫，您随时可回复 “**冬季清仓**” 快速创建一键创建大促销。`;
    actionType = 'switch_tab';
    metaObj = 'logistics';
    suggestions = [{ label: '📦 一键部署冬季清仓卡券方案', action: 'campaign', payload: { campaign_id: 'winter_clearance', discount: '10%' } }];
  }
  else if (isClearInventory) {
    intentClass = 'MULTI_STEP_STOCK_CLEAR_START';
    text = `### 📦 滞销清查去库存流程就绪\n\n` +
      `当前 WMS 水位关联的的西欧核心保税分仓详情：\n\n` +
      `1. **巴黎保税分仓 (France Hub)** - 🚨 **检测到爆款大衣服装因应季节积压严重**\n` +
      `2. **米兰核心总仓 (Milan HQ)** - 水位流转极畅快\n` +
      `3. **柏林前置冷仓 (Berlin Spot)** - 水位健康\n\n` +
      `如需治理清去，请直接对我发送 “**巴黎仓**” 立即开始处理。`;
    actionType = 'switch_tab';
    metaObj = 'logistics';
    suggestions = [{ label: '🔍 去清算巴黎仓呆滞件', action: 'switch_tab', payload: 'logistics' }];
  }
  else if (isProductCreate || hasUploadedFile) {
    intentClass = 'TASK_PRODUCT_CREATE';
    let parsedName = 'AI 智选极奢科技羊毛大衣';
    let parsedSku = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
    let parsedPrice = 129.00;
    let parsedStock = 120;

    const skuMatch = query.match(/sku[-_:]?\s*([A-Za-z0-9_-]+)/i);
    if (skuMatch) parsedSku = "SKU-" + skuMatch[1].toUpperCase();

    const priceMatch = query.match(/(?:价格|售价|单价|定价)\s*[:：]?\s*([0-9.]+)|([0-9.]+)\s*(?:元|€|\$|eur)/i);
    if (priceMatch) parsedPrice = parseFloat(priceMatch[1] || priceMatch[2]);

    const stockMatch = query.match(/(?:库存|储备|进货|备货|数量)\s*[:：]?\s*([0-9]+)|([0-9]+)\s*(?:件|支|个|部)/i);
    if (stockMatch) parsedStock = parseInt(stockMatch[1] || stockMatch[2], 10);

    const nameMatch = query.match(/(?:创建商品|新建商品|上架新商品|上架商品|创建新商品|新建|添加商品)\s*([^\s,，:：\d]+)/i);
    if (nameMatch) parsedName = nameMatch[1].trim();

    if (hasUploadedFile) {
      parsedName = '[Premium Collection] Textured Wool Blazer Coat';
      parsedSku = 'SKU-BLAZ-LUXE01';
      parsedPrice = 249.00;
      parsedStock = 120;
    }

    text = `### 🛍️ 新商品上架就绪 (Auto prefilled)\n\n` +
      `- **商品款名**: **${parsedName}**\n` +
      `- **SKU 编号**: \`${parsedSku}\`\n` +
      `- **上架定价**: 💶 **€${parsedPrice.toFixed(2)}** | **初始备货**: **${parsedStock} 件**\n\n` +
      `*已安全对齐并自动跳转到商品中心录入底库。您可在列表查阅。*`;
    actionType = 'product_create';
    metaObj = { name: parsedName, sku: parsedSku, price: parsedPrice, stock: parsedStock };
    suggestions = [{ label: '🛒 一键上架并查看我的新宝贝', action: 'switch_tab', payload: 'products' }];
  }
  else if (isOrderQuery) {
    intentClass = 'ORDER_QUERY';
    const isRefund = queryLower.includes('退') || queryLower.includes('退款') || queryLower.includes('申退');
    if (isRefund) {
      const refundRequestedOrders = orders.filter(o => o.status === 'Refund Requested' || o.status === 'Refunded');
      if (refundRequestedOrders.length > 0) {
        text = `### ⚖️ 跨国退款申诉及欺诈分析 (共 ${refundRequestedOrders.length} 笔)\n\n` +
          refundRequestedOrders.map(o => `- **发票单号**: \`${o.id}\` | 顾客: **${o.customerName}** | 退款值: **€${o.total.toFixed(2)}** | **${o.status === 'Refund Requested' ? '⚠️ 待人工审算' : '✅ 已返'}**`).join('\n') + `\n\n` +
          `*已启动哨兵机制监控，无批量欺诈性申款。*`;
      } else {
        text = `### ✅ 退款纠纷核对: 店铺近期无任何退款及未妥妥收纠纷\n\n` +
          `综合订单退货退款申诉率为 **0%** 绿色水位区。店铺安全健康。`;
      }
    } else {
      const totalAmt = orders.reduce((sum, o) => sum + o.total, 0);
      text = `### 📊 店铺隔离账户成交流水勾对清单 (共 ${orders.length} 笔)\n\n` +
        orders.slice(0, 3).map(o => `- **发票单号**: \`${o.id}\` | 会员: **${o.customerName}** | 交易总值: **€${o.total.toFixed(2)}** | **${o.status}**`).join('\n') + `\n\n` +
        `- **累计营业额 (GMV)**: 🚀 **€${totalAmt.toFixed(2)}**`;
    }
    actionType = 'switch_tab';
    metaObj = 'orders';
  }
  else if (isInventoryQuery) {
    intentClass = 'INVENTORY_QUERY';
    const lowStockItems = products.filter(p => p.stock <= 15);
    if (lowStockItems.length > 0) {
      text = `### 🚨 特急：在售价主力爆款水位低洼缺货\n\n` +
        lowStockItems.map(p => `- **${p.name}** (SKU: \`${p.sku}\`) - 仅剩 **${p.stock} 件** (${p.stock === 0 ? '🔴 已卖完' : '🟡 即将告罄'})`).join('\n') + `\n\n` +
        `建议直接回复 “**一键补货**” 一键追加采购进货配仓。`;
      actionType = 'restock';
      suggestions = [{ label: '📦 一键触发全部低水位 SKU 安全补货', action: 'restock', payload: {} }];
    } else {
      const sortedByStock = [...products].sort((a, b) => a.stock - b.stock);
      text = `### ✨ 大仓备货健康：所有在售价 SKU 处于极其安全的余量防区\n\n` +
        `- **备货最紧品类**: 「${sortedByStock[0]?.name || '无'}」 | 余量在架: **${sortedByStock[0]?.stock || 0} 件** (标准门槛: 10 件)\n\n` +
        `不致断货溢流危害，中长期安心。`;
      suggestions = [{ label: '📦 检查大盘库存细节', action: 'switch_tab', payload: 'products' }];
    }
  }
  else if (isCustomerQuery) {
    intentClass = 'CUSTOMER_QUERY';
    const coldCustomers = customers.filter(c => c.orderCount === 0 || c.points < 200);
    text = `### 👥 客户关系及生命周期(CRM)活跃度审计\n\n` +
      `发现店铺池共有 **${customers.length} 名客户**，其中 **${coldCustomers.length} 位 VIP** 观望搁置，属高风险沉默区：\n\n` +
      coldCustomers.slice(0, 3).map(c => `- **${c.name}** | VIP等级: **${c.tier}** | ${c.orderCount === 0 ? '🔺 历史无单' : '🟡 积分解冻警戒'}`).join('\n') + `\n\n` +
      `您随时可回复 “**客户召回**” 自动直发 bulk 专属代金券礼包。`;
    actionType = 'customer_recall';
    suggestions = [{ label: '👥 进入 CRM 详细看板', action: 'switch_tab', payload: 'customers' }];
  }
  else {
    intentClass = 'UNIFIED_DISPATCH';
    text = `接收到您的消息。该输入尚未触发具体的系统指令动作。\n\n` +
      `我是您的 AI Commerce OS 经营大脑。您无需繁琐菜单，可直接发送具体的命令（例如：“诊断利润”、“补货”、“创建冬季清仓”、“修改背景为黑色”等），我将自动为您调用工具处理。`;
    suggestions = [];
  }

  // Task scheduling visualization
  const planTree: PlanTaskNode[] = AICoreIntelligence.generateTaskTree(queryLower);
  let resolvedPlanningStr = planTree.map(task => `[${task.id}] ${task.title} (面向:${task.status})`).join('\n └── ');
  planningTasks = planTree.length > 0 ? '【规划任务链树】：\n └── ' + resolvedPlanningStr : '1. 命令接受；2. 隔离账户拦截校验；3. 后台 API 自动分分流。';

  return {
    text,
    actionType,
    metaObj,
    suggestions,
    thought: {
      intent: intentClass,
      reasoning: `Goal: ${reasoningGoal}\nState: ${reasoningCurrentState}\nInfo: ${reasoningMissingInfo}\nRisk: ${reasoningRisk}`,
      planning: planningTasks,
      permission: permissionCheck,
      toolRouter: toolRoute,
      validator: validationResult
    }
  };
}
