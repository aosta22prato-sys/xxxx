/******************************************************** 
 * Part 1：AI 调度接口示例（后端 API 伪代码） 
 * 说明：这是 /api/ai/ask 的一个结构参考，实际实现按你们框架改写 
 ********************************************************/ 

// ==== 请求 & 响应类型 ==== 

export interface AIAskRequest { 
  tenantId: string;        // 从会话 / token 中解析 
  userId: string;          // 从会话 / token 中解析 
  currentRoute: string;    // 前端传入当前路由（例如 "/products/123"） 
  question: string;        // 用户自然语言问题 
} 

export interface AIAskResponse { 
  answer: string;          // 给前端展示的最终文本回答 
  // 可选：结构化数据（运营建议卡片等），供前端做富展示 
  data?: any; 
} 

// ==== 主入口函数示例 ==== 

export async function handleAIAsk(req: AIAskRequest): Promise<AIAskResponse> { 
  // 1. 构建 AIContext（统一从 Runtime Context Service 获取） 
  const aiContext: AIContext = await buildAIContext({ 
    tenantId: req.tenantId, 
    userId: req.userId, 
    currentRoute: req.currentRoute, 
  }); 

  // 2. 基于问题和上下文，决定需要调用哪些 Tool Service 
  //    （此处只给结构，不写死逻辑，可以后续慢慢细化） 
  const toolResults: Record<string, any> = {}; 

  // 示例：如果是问「今天怎么样」「利润怎么样」之类，走全店概览 
  if (isStoreOverviewQuestion(req.question)) { 
    toolResults['storeKpis'] = { 
      metrics: aiContext.metrics, 
    }; 
  } 

  // 示例：如果当前在商品详情页，且问题里包含「这个商品」 
  if ( 
    aiContext.ui.pageType === 'product_detail' && 
    aiContext.ui.productId && 
    isProductQuestion(req.question) 
  ) { 
    const productPerformance = await productService.getProductPerformance( 
      aiContext.ui.productId, 
      aiContext.shop.shopId, 
    ); 
    toolResults['productPerformance'] = productPerformance; 
  } 

  // 示例：如果问题里含「支付」「哪个支付最好」 
  if (isPaymentQuestion(req.question)) { 
    const recommendPaymentsResult = await paymentService.recommendPayments( 
      aiContext.shop, 
      aiContext.metrics, 
    ); 
    toolResults['paymentRecommendation'] = recommendPaymentsResult; 
  } 

  // ……此处可以继续扩展对订单、客户、库存等问题的检测和 Tool 调用 

  // 3. 准备给 LLM 的 Prompt：包括 system prompt + 用户问题 + AIContext + toolResults 
  const systemPrompt = buildSystemPrompt(aiContext, toolResults); 

  // 4. 调用大模型（LLM），生成自然语言回答 
  const llmAnswer = await callLLM({ 
    systemPrompt, 
    userQuestion: req.question, 
  }); 

  // 5. 返回结果 
  return { 
    answer: llmAnswer, 
    data: toolResults, // 可选返回，方便前端未来展示结构化卡片 
  }; 
} 

// ==== 意图判定辅助函数（示例，后续可优化为更智能逻辑） ==== 

function isStoreOverviewQuestion(q: string): boolean { 
  const s = q.toLowerCase(); 
  return ( 
    s.includes('今天怎么样') || 
    s.includes('利润怎么样') || 
    s.includes('运营情况') || 
    s.includes('生意怎么样') 
  ); 
} 

function isProductQuestion(q: string): boolean { 
  const s = q.toLowerCase(); 
  return ( 
    s.includes('这个商品') || 
    s.includes('这款产品') || 
    s.includes('这个产品') 
  ); 
} 

function isPaymentQuestion(q: string): boolean { 
  const s = q.toLowerCase(); 
  return ( 
    s.includes('支付') || 
    s.includes('付款') || 
    s.includes('哪个支付最好') || 
    s.includes('用什么收款') 
  ); 
} 

/******************************************************** 
 * Part 2：System Prompt 模板（用于 LLM） 
 * 说明： 
 *  - buildSystemPrompt 会把 AIContext + Tool 结果拼接成一段文字 
 *  - 下面是模板建议，可按你们使用的 LLM SDK 进行变量替换 
 ********************************************************/ 

export function buildSystemPrompt( 
  aiContext: AIContext, 
  toolResults: Record<string, any>, 
): string { 
  const contextJson = JSON.stringify(aiContext, null, 2); 
  const toolsJson = JSON.stringify(toolResults, null, 2); 

  return ` 
你是一个面向商家的「电商运营 AI 指挥官」，专门服务运行在我们 SaaS + Shopify 之上的店铺。 

【你的首要原则】 

在回答任何问题之前，你必须先理解并充分利用当前的上下文（AIContext）： 
- 当前店铺信息：国家、货币、行业、生命周期阶段 
- 当前用户信息：角色、权限、语言 
- 当前页面：正在操作的对象（商品 / 订单 / 客户 / 报表等） 
- 当前经营数据：销售额、订单数、库存预警、支付成功率、退款率等 

你不是一个泛用聊天机器人，而是一个「带着店铺上下文做商业决策」的运营助手。 
你给出的答案应该是： 
- 具体到当前店铺、当前市场、当前产品 / 订单 / 客户的 
- 尽量基于真实数据 and 业务规则，而不是空泛的建议 
- 有「下一步该怎么做」的建议（可以是操作步骤，也可以是配置建议） 

【当前 AI 上下文（AIContext）】 

下面是本次问题对应的 AIContext（JSON，来自后端 Runtime Context Service）： 

<AI_CONTEXT_JSON> 
${contextJson} 
</AI_CONTEXT_JSON> 

你必须严格使用这个上下文来理解店铺和当前页面的状态： 
- 不要编造上下文里不存在的字段或数据。 
- 如果某些关键信息缺失（比如成本价、目标毛利率），请先向用户询问补充信息。 
- 在你的思考中，明确区分「从上下文得到的事实」和「基于经验的推测」。 

【已调用的业务服务结果（Tool Service 返回）】 

为了帮助你回答，本次问题后端已经调用了一些业务服务（ProductService, OrderService, FinanceService, InventoryService, MarketingService, PaymentService 等），结果如下： 

<TOOL_RESULTS_JSON> 
${toolsJson} 
</TOOL_RESULTS_JSON> 

你需要： 
1. 优先使用这些真实数据来支持你的判断； 
2. 基于这些数据进行综合分析； 
3. 给出结构化、可执行的运营建议。 

如果某些你需要的数据没有在以上 JSON 里出现，你不能自己编造数字。 
如果数据确实缺失，请在回答中明确提出「缺少哪些数据」，并说明大致会如何影响判断。 

【页面 & 问题类型的处理规则】 

1. 当当前页面为「商品详情页」（aiContext.ui.pageType === 'product_detail'）时： 
   - 用户问「这个商品怎么样」「这款产品表现如何」： 
     - 请针对当前 productId 对应的商品，分析： 
       - 最近一段时间的销量、退货率、毛利率、库存健康度 
       - 该商品对整体销售的贡献 
     - 给出具体的运营建议，例如： 
       - 是否需要调价 
       - 是否适合做促销（如第二件x折、套餐） 
       - 是否存在库存风险（积压或缺货） 

2. 当当前页面为「订单详情页」（order_detail）时： 
   - 用户问「这个订单安全吗」「这笔订单有没有风险」： 
     - 请参考 OrderService 提供的风险评分 / 高风险标记等信息 
     - 分析风险原因（如地址异常、大额订单、新客户、支付渠道风险等） 
     - 给出建议下一步操作（如人工复核、延迟发货、标记高风险等） 

3. 当问题中包含「今天怎么样」「利润怎么样」「运营情况」： 
   - 请基于 MetricsContext（今日 / 本月 GMV、订单数、利润、退款率、支付成功率等） 
   - 先给出一个整体概览，再指出： 
     - 表现好的部分：哪些指标在提升 
     - 需要注意的部分：例如退款率上升、库存预警过多等 
   - 最后给出 1~3 条「今天/本周可以优先处理的事情」 

4. 当问题中包含「支付」「哪个支付最好」「用什么收款」： 
   - 请使用 PaymentService 提供的支付统计和推荐结果（如有） 
   - 根据 店铺国家 + 币种 + 行业 + 历史支付数据： 
     - 推荐 2~3 个优先启用/优先展示的支付方式 
     - 简要说明每个方式「为什么适合这家店」 
     - 提醒用户这是「建议配置」，实际开通和排序需要在后台中完成。 

【回答风格要求】 

- 语言：默认使用 aiContext.user.language 对应的语言（例如 zh-CN）。 
- 结构清晰，建议采用： 
  1）根据你店铺当前情况的简短总结 
  2）具体分析（按维度分点） 
  3）可执行建议（列出接下来可以做的 2~3 个具体操作） 
- 当你引用某个具体数字时，请尽量说明它来自哪个维度（例如「根据最近30天数据」）。 

【安全与边界】 

- 不要声称你已经「修改了店铺配置」「创建了折扣」「改动了库存」。 
  - 你只能提出建议，例如： 
    - 「建议你把这款商品价格从 X 调整到 Y」 
    - 「建议你开启某某支付方式」 
  - 是否执行这些操作，由用户在实际系统界面中自行确认。 
- 禁止生成与店铺无关的闲聊内容（如讲笑话、聊天气）。 
  - 如果用户问与业务无关的问题，请礼貌地将话题引导回店铺运营和业务数据。 

请开始你的指挥。 
  `.trim(); 
} 

/******************************************************** 
 * Part 3：callLLM 示例函数签名（仅示意） 
 * 实际实现取决于你们使用的具体 LLM 提供商 
 ********************************************************/ 

interface CallLLMParams { 
  systemPrompt: string; 
  userQuestion: string; 
} 

async function callLLM(params: CallLLMParams): Promise<string> { 
  const { systemPrompt, userQuestion } = params; 

  // 这里填你们调用大模型的具体逻辑，例如： 
  // - OpenAI / Anthropic / 自建模型 等 
  // - 把 systemPrompt 作为 system / role=system 
  // - userQuestion 作为 user / role=user 

  // 伪代码示例： 
  /* 
  const resp = await llmClient.chat.completions.create({ 
    model: 'xxx', 
    messages: [ 
      { role: 'system', content: systemPrompt }, 
      { role: 'user', content: userQuestion }, 
    ], 
  }); 
  return resp.choices[0].message.content; 
  */ 

  throw new Error('callLLMWithTools not implemented'); 
 } 
 
 /******************************************************** 
  * Part 4：更具体的 Tool Service 设计示例（建议最低实现集） 
  *    1）StoreKpiService：今天/本月怎么样？ 
  *    2）ProductService：单品运营洞察 
  ********************************************************/ 
 
 /******** 4.1 StoreKpiService（全店关键指标汇总） ********/ 
 
 export interface StoreKpis { 
   shopId: string; 
 
   // 今日 
   todaySales: number;        // 今日销售额（GMV） 
   todayOrders: number;       // 今日订单数 
   todayAvgOrderValue: number;// 今日客单价（todaySales / todayOrders，orders>0） 
 
   // 本月 
   monthSales: number;        // 本月销售额 
   monthOrders: number;       // 本月订单数 
   monthProfit: number;       // 本月利润（毛利或接近利润） 
 
   // 风险 & 健康度 
   refundRate: number;        // 退款率（比如最近30天） 
   paymentSuccessRate: number;// 支付成功率 
   lowStockCount: number;     // 库存预警（低于阈值）的SKU数量 
   churnedCustomersCount: number; // 流失客户数量（例如90天未购买） 
 
   // 其他可拓展字段... 
 } 
 
 export interface StoreKpiService { 
   getStoreKpis(shopId: string): Promise<StoreKpis>; 
 } 
 
 /******** 4.2 ProductService：增加一个“单品洞察”工具 ********/ 
 
 export interface ProductInsight { 
   productId: string; 
   title?: string; 
 
   // 最近30天表现 
   salesLast30Days: number;       // 销售额 
   ordersLast30Days: number;      // 订单数 
   unitsSoldLast30Days: number;   // 销售件数 
   refundRateLast30Days: number;  // 退货率 
   viewsLast30Days?: number;      // 浏览量（如果有） 
 
   // 利润 & 定价 
   costPerUnit?: number;          // 成本价（来自你SaaS） 
   currentPrice?: number;         // 当前售价 
   compareAtPrice?: number;       // 划线价 
   grossMarginRate?: number;      // 毛利率（基于成本+售价） 
 
   // 库存 
   inventoryQuantity?: number;    // 当前库存 
   inventoryStatus?: 'healthy' | 'low' | 'overstock'; // 基于库存规则计算出的状态 
 
   // 相对表现（可选） 
   performanceTag?: 'top_seller' | 'average' | 'low_seller'; // 相对店内其他单品 
 } 
 
 export interface ProductService { 
   // 单品运营表现 
   getProductInsight(productId: string, shopId: string): Promise<ProductInsight>; 
 
   // 前面给过的接口可以合并到这里 
   getLowStockProducts(shopId: string): Promise<ProductInsight[]>; 
 } 
 
 /******************************************************** 
  * Part 5：问题 → 工具调用决策表（开发时建议遵守） 
  * 
  * 说明： 
  *   这是给后端 / AI 工程师看的“路由表”， 
  *   当识别出某一类问题，就调用对应 service， 
  *   不要直接让 LLM「自己想」。 
  ********************************************************/ 
 
 interface ToolDecision { 
   match: (question: string, ctx: AIContext) => boolean; 
   description: string; 
   toolsToCall: string[]; // 工具/Service 列表，供实现时参考 
 } 
 
 // 决策规则示例（伪代码思想） 
 const TOOL_DECISIONS: ToolDecision[] = [ 
   { 
     description: '全店运营概览：今天怎么样 / 利润怎么样 / 运营情况', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       return ( 
         s.includes('今天怎么样') || 
         s.includes('利润怎么样') || 
         s.includes('运营情况') || 
         s.includes('最近怎么样') || 
         s.includes('生意怎么样') 
       ); 
     }, 
     toolsToCall: ['StoreKpiService.getStoreKpis'], 
   }, 
   { 
     description: '单品表现：这个商品怎么样 / 这款产品表现如何', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       const isProductQuestion = 
         s.includes('这个商品') || 
         s.includes('这款商品') || 
         s.includes('这个产品') || 
         s.includes('这款产品'); 
       return isProductQuestion && ctx.ui.pageType === 'product_detail' && !!ctx.ui.productId; 
     }, 
     toolsToCall: ['ProductService.getProductInsight'], 
   }, 
   { 
     description: '订单风险：这个订单安全吗 / 这单有没有风险', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       const isOrderSafe = 
         s.includes('这个订单安全吗') || 
         s.includes('这单安全吗') || 
         s.includes('有没有风险') || 
         s.includes('风险大不大'); 
       return isOrderSafe && ctx.ui.pageType === 'order_detail' && !!ctx.ui.orderId; 
     }, 
     toolsToCall: ['OrderService.getOrderRisk'], 
   }, 
   { 
     description: '支付方式：哪个支付最好 / 用什么收款', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       return ( 
         s.includes('支付') || 
         s.includes('收款') || 
         s.includes('哪个支付最好') || 
         s.includes('怎么收钱') 
       ); 
     }, 
     toolsToCall: ['PaymentService.recommendPayments', 'PaymentService.getPaymentStats'], 
   }, 
   { 
     description: '库存问题：库存好吗 / 库存有没有问题', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       return s.includes('库存') && (s.includes('有没有问题') || s.includes('紧张') || s.includes('多不多')); 
     }, 
     toolsToCall: ['InventoryService.getLowStockCount', 'InventoryService.getStockAlerts'], 
   }, 
   { 
     description: '最近业务增长最快：哪个业务/商品/渠道增长最快', 
     match: (q, ctx) => { 
       const s = q.toLowerCase(); 
       return s.includes('增长最快') || s.includes('长得最快') || s.includes('涨得最快'); 
     }, 
     toolsToCall: [ 
       'StoreKpiService.getStoreKpis', 
       // 这里可以再扩展一个：ReportService.getFastGrowingSegments 之类 
     ], 
   }, 
 ]; 
 
 /******************************************************** 
  * Part 6：/api/ai/ask 极简“tools 模式”写法示例 
  * （给使用 OpenAI / Anthropic function calling 的同事看） 
  ********************************************************/ 
 
 // 假设你们用的是“工具调用”模式，简化版本如下（伪逻辑）： 
 
 async function handleAIAskToolsMode(req: AIAskRequest): Promise<AIAskResponse> { 
   // 1. 构造上下文 
   const aiContext = await buildAIContext({ 
     tenantId: req.tenantId, 
     userId: req.userId, 
     currentRoute: req.currentRoute, 
   }); 
 
   // 2. 把 AIContext 作为 system 或者 as context 传给 LLM 
   // 3. 同时，把可用的“工具说明”传给 LLM，如： 
   //    - getStoreKpis 
   //    - getProductInsight 
   //    - getOrderRisk 
   //    - recommendPayments 
   //    这些工具的内部实现会调用上述 Service。 
   // 
   // 4. LLM 根据用户问题自动选择要调用哪个工具（function calling） 
   // 5. 工具返回 JSON，LLM 再基于 JSON + AIContext 生成最终回答 
   // 
   // 下面是一个抽象的伪代码，具体按你们选的 LLM SDK 改写： 
 
   const tools = [ 
     // 这里只注册“包装函数”，内部再调你自己实现的 Service 
     { 
       name: 'getStoreKpis', 
       description: '获取当前店铺的核心运营指标，用于回答“今天怎么样”“利润怎么样”等问题', 
       parameters: { type: 'object', properties: {}, required: [] }, 
       fn: async () => await storeKpiService.getStoreKpis(aiContext.shop.shopId), 
     }, 
     { 
       name: 'getProductInsight', 
       description: '获取当前商品的运营表现和库存情况，用于回答“这个商品怎么样”', 
       parameters: { type: 'object', properties: {}, required: [] }, 
       fn: async () => { 
         if (!aiContext.ui.productId) { 
           throw new Error('No current product in context'); 
         } 
         return await productService.getProductInsight(aiContext.ui.productId, aiContext.shop.shopId); 
       }, 
     }, 
     // ...再注册其他工具，如 getOrderRisk, recommendPayments, getStockAlerts 等 
   ]; 
 
   // 调 LLM 时，把 systemPrompt + aiContext + tools 一起喂进去： 
   const systemPrompt = buildSystemPrompt(aiContext, {}); // tools 结果动态生成，无需先传 
 
   const answer = await callLLMWithTools({ 
     systemPrompt, 
     userQuestion: req.question, 
     tools, // LLM 会根据需要自动调用 
   }); 
 
   return { answer }; 
 } 
 
 // callLLMWithTools 是一个抽象示例 
 // 你们可以用 OpenAI/Anthropic 等官方的 tools / function calling 机制实现 
 async function callLLMWithTools(params: { 
   systemPrompt: string; 
   userQuestion: string; 
   tools: any[]; // 工具描述 + fn 
 }): Promise<string> { 
   // 伪代码逻辑： 
   // - 把 tools 的 schema 注册给 LLM 
   // - LLM 决定调用哪个工具，返回一个 "tool_call" 
   // - 你在服务器执行 tools[i].fn()，拿到结果 
   // - 把工具执行结果再反馈给 LLM，让它生成最终自然语言回答 
 
   throw new Error('callLLMWithTools not implemented'); 
 } 
 
 /******************************************************** 
  * 总结： 
  *   到这里，你有了： 
  *   - AIContext 完整结构 
  *   - Runtime Context Service 入口及示例 
  *   - StoreKpiService / ProductService / PaymentService 等接口建议 
  *   - AI 调度接口的整体骨架（handleAIAsk） 
  *   - System Prompt 模板 
  *   - 如果要用 LLM tools/function calling 的大致结构 
  * 
  * 代理团队可以用这些作为「第一阶段 AI Commander OS」的开发蓝本： 
  *   实现完之后，你打开后台任何页面， 
  *   问「今天怎么样」「这个商品怎么样」「哪个支付最好」， 
  *   AI 都会带着上下文 + 真实数据来回答。 
  ********************************************************/
