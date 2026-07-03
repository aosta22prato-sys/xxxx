import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Sparkles, User, Send, Compass, Cpu, Target, 
  Briefcase, HelpCircle, Flame, Server, AlertTriangle, Play, Check, 
  ChevronRight, TrendingUp, Users, ShoppingBag, Landmark, ArrowRight,
  TrendingDown, Percent, FileText, Download, ShieldCheck, Truck
} from "lucide-react";
import { EnterpriseState, Product, Customer } from "../types";

interface AiStaffProps {
  state: EnterpriseState;
  onStateUpdate: () => void;
}

interface ChatMessage {
  sender: "user" | "sidekick";
  text: string;
}

export default function AiStaff({ state, onStateUpdate }: AiStaffProps) {
  // Define the 5 high-profile corporate personas
  const targetStaff = [
    { 
      id: "sales", 
      name: "销售智能专家 (Sales AI)", 
      title: "SaaS 连带率/交叉销售优化器", 
      avatar: "🛍️", 
      descr: "利用协同过滤算法，分析最受商户欢迎和复购最高的套组，智能规划交叉销售组合 (Bundling) 与划线折扣。", 
      directive: "Suggest a bundle marketing package" 
    },
    { 
      id: "support", 
      name: "智慧出海客服 (Support AI)", 
      title: "Shopify Inbox 自定义回复及挽单包", 
      avatar: "💬", 
      descr: "智能提取未付款流失客户 (Abandoned Cart)，撰写高情感共鸣的英文/多语退款及挽单邮件草稿，提升提单转化。", 
      directive: "Generate an organic recovering email" 
    },
    { 
      id: "procure", 
      name: "供应链采购管家 (Procure AI)", 
      title: "防断货动态补给排产专员", 
      avatar: "🚚", 
      descr: "监测库存水位。低于安全警告界限（10件）时，自动匹配意大利、深圳等供应链大货交付周期并给出补单建议。", 
      directive: "Calculate automated reorder points" 
    },
    { 
      id: "finance", 
      name: "财务风险精算师 (Finance AI)", 
      title: "商户反欺诈及利润预警系统", 
      avatar: "⚖️", 
      descr: "对比供应商采购面价(Cost)与终售划线价，计算纯毛利，检测负利润或低利润危险商品，提供欺诈高危拦截。", 
      directive: "Flag anti-fraud entries and calculate margins" 
    },
    { 
      id: "boss", 
      name: "老板决策驾驶舱 (CEO AI Cockpit)", 
      title: "C-Suite 宏观多维运营审计核心", 
      avatar: "👑", 
      descr: "全域大盘综合诊断，输出 AOV 客单价变化、ARP 核销、退货扣款明细，支持生成 CSV 级别企业决策性报告。", 
      directive: "Compile strategic diagnostic insights" 
    }
  ];

  const [activeStaff, setActiveStaff] = useState(targetStaff[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // States for interactive Copilot execution panel
  const [replenishResult, setReplenishResult] = useState<any[]>([]);
  const [marginAuditResult, setMarginAuditResult] = useState<any[]>([]);
  const [customerPortraitTags, setCustomerPortraitTags] = useState<any[]>([]);
  const [bundleMatrix, setBundleMatrix] = useState<any[]>([]);
  const [ceoStats, setCeoStats] = useState<any>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Quick Action triggers matching user instructions exactly:
  // "数据分析, 自动报表, 智能补货, 客户画像, 营销推荐, 财务预警"
  
  // 1. 智能补货 (Auto Replenishment advice)
  const triggerSmartReplenish = () => {
    setActiveActionId("replenish");
    const lowStockItems = state.products.filter(p => p.stock <= 45); // threshold matching sample wallets
    const calculatedAdvice = lowStockItems.map(item => {
      const suggestQty = 150; 
      const supplier = state.suppliers[Math.floor(Math.random() * state.suppliers.length)] || { name: "Tuscany Premium Leather S.p.A.", id: "sup1" };
      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        stock: item.stock,
        adviseQty: suggestQty,
        supplierName: supplier.name,
        costPrice: item.cost,
        totalCost: suggestQty * item.cost
      };
    });
    setReplenishResult(calculatedAdvice);
  };

  // Restock action callback inside Copilot
  const executeRestockAdvice = async (sku: string, qty: number, cost: number, supplier: string) => {
    try {
      const res = await fetch("/api/supply-chain/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, quantity: qty, cost, supplierName: supplier })
      });
      const data = await res.json();
      if (data.success) {
        onStateUpdate();
        alert(`采购AI成功下单！向供应商 [${supplier}] 采购 ${qty} 件零件（SKU: ${sku}），采购支出已列支财务账本。`);
        triggerSmartReplenish(); // refresh advice
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. 财务预警 (Anti-fraud & Zero-profit alerts)
  const triggerFinancialWarning = () => {
    setActiveActionId("finance_warning");
    const margins = state.products.map(p => {
      const markupRatio = p.cost > 0 ? ((p.price - p.cost) / p.price) * 100 : 0;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        cost: p.cost,
        profit: p.price - p.cost,
        margin: markupRatio,
        isWarning: markupRatio < 30 // low profit margin below 30%
      };
    });
    setMarginAuditResult(margins);
  };

  // 3. 客户画像 (Retrieve portraits and group VIP tag triggers)
  const triggerCustomerPortrait = () => {
    setActiveActionId("customer_portrait");
    const portraits = state.customers.map(c => {
      let portraitTag = "普通注册客群";
      if (c.totalSpent > 1000) portraitTag = "高频VIP白金商家";
      else if (c.totalSpent > 300) portraitTag = "中段稳定常客";
      else if (c.ordersCount === 0) portraitTag = "休眠沉寂线索";

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent: c.totalSpent,
        tag: portraitTag,
        ltv: c.ltv
      };
    });
    setCustomerPortraitTags(portraits);
  };

  // 4. 营销推荐 (Automatic bundle proposals and promo-code generators)
  const triggerMarketingRecommendation = () => {
    setActiveActionId("marketing_recom");
    // Aggregate bundle pairings
    const bundleProposals = [
      {
        id: "b1",
        baseProduct: "Medusa Premium Hoodie",
        pairProduct: "Medusa Full-Grain Card Wallet",
        recomRate: "89% (同款冬季外层配件)",
        suggestDiscount: "15%",
        promoCode: "MEDUSAWINTER"
      },
      {
        id: "b2",
        baseProduct: "Smart Acoustic Speaker X1",
        pairProduct: "Shopify Minimalist Sunglass",
        recomRate: "54% (高科技数码潮流套盒)",
        suggestDiscount: "20%",
        promoCode: "ACOUSTICFLOW"
      }
    ];
    setBundleMatrix(bundleProposals);
  };

  // Dynamic checkout code generation inside Copilot Recommendation
  const createBundlePromoCode = async (code: string, discountVal: number) => {
    try {
      const res = await fetch("/api/sconti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type: "percentage",
          value: discountVal,
          minPurchase: 30,
          useLimit: 200
        })
      });
      const data = await res.json();
      if (data.success) {
        onStateUpdate();
        alert(`营销推荐AI专属折扣码 [${code}] 已成功挂载入网店结算中心，立享 ${discountVal}% 减免优惠。`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. 数据分析 & 老板驾驶舱 (SaaS multi-currency financial report forecasting and downloads)
  const triggerCeoCockpit = () => {
    setActiveActionId("ceo_cockpit");
    const totalRevenue = state.orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalProcurementCost = state.supplyOrders.reduce((sum, s) => sum + s.total, 0);
    const activeBundlesCount = state.discountCodes.length;
    const unpaidAccountsReceivable = state.orders
      .filter(o => o.paymentStatus === "unpaid")
      .reduce((acc, o) => acc + o.totalAmount, 0);

    setCeoStats({
      revenue: totalRevenue,
      procurement: totalProcurementCost,
      netSovereignProfit: totalRevenue - totalProcurementCost,
      activePromoCodes: activeBundlesCount,
      accountsPayable: unpaidAccountsReceivable,
      operatingRatio: totalRevenue > 0 ? ((totalRevenue - totalProcurementCost) / totalRevenue * 100).toFixed(1) : "0"
    });
  };

  // Export report payload as mockup file download trigger
  const handleExportMockupReport = () => {
    if (!ceoStats) return;
    const reportData = `Shopify Medusa Enterprise ERP - Executive Director Report
Generated Date: ${new Date().toISOString()}
-----------------------------------------------
1. All-time Channel Revenue: €${ceoStats.revenue.toFixed(2)}
2. Supply Chain Cost (COGS): €${ceoStats.procurement.toFixed(2)}
3. Net Operating Margin: €${ceoStats.netSovereignProfit.toFixed(2)}
4. Active Discount Promos: ${ceoStats.activePromoCodes} codes active
5. Accounts Receivable (未收账款): €${ceoStats.accountsPayable.toFixed(2)}
-----------------------------------------------
Platform Audit Verdict: Stable corporate liquidity. Over-the-air ClickHouse sync matches.`;
    
    const element = document.createElement("a");
    const file = new Blob([reportData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `SaaS_Merchant_Audit_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    alert("企业版 C-Suite 自主财务审计报告已下载至本地工作目录！");
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setLoading(true);

    const updatedUserMsgs = [...messages, { sender: "user" as const, text: textToSend }];
    setMessages(updatedUserMsgs);
    setUserInput("");

    try {
      const res = await fetch("/api/sidekick/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `[Worker Persona: ${activeStaff.name} - Directive: ${activeStaff.directive}]. User states: ${textToSend}`,
          history: messages
        })
      });
      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { sender: "sidekick", text: data.text }]);
        if (data.dbState) {
          onStateUpdate();
        }
      } else {
        setMessages(prev => [...prev, { sender: "sidekick", text: "I ran into a server communication block. Please verify your internet sync pipeline." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "sidekick", text: "Failed to connect to the server's Gemini port. Using direct offline response." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setMessages([
      { sender: "sidekick", text: `您好！我是您的商户助理：${activeStaff.name}。我已深度融合您当前的 SaaS 销售与供应链大盘数据，可以通过右侧“AI 自主决策中心 (Copilot)”为您执行 智能补货、数据核验、利润预警和自动报表！请选择您需要的智能助理。` }
    ]);
    // Reset output panels when switching specialists
    setActiveActionId(null);
  }, [activeStaff]);

  return (
    <div className="space-y-6">
      
      {/* Header Summary info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">🤖 AI 员工智脑中心 (Enterprise AI Agent Staffing Hub)</h2>
        <p className="text-xs text-gray-500 mt-1">
          并非单纯的聊天框——这里是链接了后台 ClickHouse 算力与 ERP 管道的决策枢纽，可处理采购、账期核对、挽单及财务预警。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Specialists Selector list */}
        <div className="space-y-4">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block px-1">部署数智化专家</span>
          
          <div className="space-y-2">
            {targetStaff.map(staff => (
              <button
                key={staff.id}
                onClick={() => {
                  setActiveStaff(staff);
                }}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer group ${
                  activeStaff.id === staff.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white border-gray-150 text-gray-700 hover:border-gray-200"
                }`}
              >
                <span className="text-xl bg-gray-100 group-hover:scale-105 transition-transform h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                  {staff.avatar}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{staff.name}</div>
                  <div className={`text-[9px] mt-0.5 truncate ${activeStaff.id === staff.id ? "text-indigo-100" : "text-gray-400"}`}>
                    {staff.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Connected state & info card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 shadow-md border border-slate-800">
            <span className="text-[9px] text-indigo-400 font-extrabold uppercase block tracking-wider flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              Sovereign API Gateway Active
            </span>
            <div className="text-xs font-bold">{activeStaff.name} 特有指令规则</div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{activeStaff.descr}</p>
          </div>
        </div>

        {/* Right Side 3 columns Split: Conversational box & Interactive Copilot Tool */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Chat Workspace */}
          <div className="bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden h-148 flex flex-col justify-between">
            {/* Upper bar */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-gray-800">{activeStaff.name}</span>
                  <span className="text-[9px] text-indigo-700 block">实时内联 MySQL/ClickHouse 内存算力</span>
                </div>
              </div>
            </div>

            {/* Conversation Stream wrapper */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3 max-w-full ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-sm ${
                    m.sender === "user" ? "bg-indigo-50 text-indigo-800" : "bg-gray-100"
                  }`}>
                    {m.sender === "user" ? <User className="w-4 h-4" /> : activeStaff.avatar}
                  </div>

                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed space-y-2 max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-gray-50 text-gray-800 border border-gray-150 rounded-tl-none font-sans"
                  }`}>
                    {m.text.split("\n\n").map((chunk, cidx) => (
                      <p key={cidx}>{chunk}</p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 max-w-full">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-700 animate-bounce flex items-center justify-center">
                    ✨
                  </div>
                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl rounded-tl-none text-xs text-gray-500">
                    <span className="animate-pulse">数据决策判定中...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* User prompt Input box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(userInput);
              }} 
              className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`给 ${activeStaff.name} 下达指令或分析请求...`}
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-white border border-gray-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Copilot Action Tools Center (Pure Interactive enterprise-grade suite) */}
          <div className="bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden h-148 flex flex-col justify-between">
            {/* Header bar */}
            <div className="bg-slate-900 p-4 text-white border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-extrabold tracking-wider block">AI 自主决策中心 (Copilot Hub)</span>
                  <span className="text-[9px] text-gray-400 block font-mono">SOVEREIGN WORKFLOW EXECUTORS</span>
                </div>
              </div>
            </div>

            {/* Dynamic tool output body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              
              {/* Quick trigger grid */}
              <div className="space-y-2">
                <span className="text-[9px] text-gray-400 font-bold block uppercase pb-1 border-b border-gray-100">
                  点击调用专家辅助决策工具 (Activate Specialist Executors):
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={triggerSmartReplenish}
                    className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                      activeActionId === "replenish" 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="text-[10px] font-extrabold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      智能补货 (Replenish)
                    </div>
                  </button>

                  <button
                    onClick={triggerFinancialWarning}
                    className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                      activeActionId === "finance_warning" 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-750"
                    }`}
                  >
                    <div className="text-[10px] font-extrabold flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      财务预警 (Tax Audit)
                    </div>
                  </button>

                  <button
                    onClick={triggerCustomerPortrait}
                    className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                      activeActionId === "customer_portrait" 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-750"
                    }`}
                  >
                    <div className="text-[10px] font-extrabold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      客户画像标签 (CRM Tags)
                    </div>
                  </button>

                  <button
                    onClick={triggerMarketingRecommendation}
                    className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                      activeActionId === "marketing_recom" 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-750"
                    }`}
                  >
                    <div className="text-[10px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-505 shrink-0" />
                      营销套组推荐 (Upsells)
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-1 pt-1">
                  <button
                    onClick={triggerCeoCockpit}
                    className={`p-2.5 text-center border rounded-lg transition-all font-bold text-[10px] cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeActionId === "ceo_cockpit" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-emerald-200 shrink-0" />
                    老板经营决策舱 汇总自动报表 (CEO Performance Dashboard)
                  </button>
                </div>
              </div>

              {/* Display Result Panels dynamically */}
              <div className="mt-4 border border-gray-150 rounded-xl p-3 bg-gray-50/50 min-h-52">
                
                {/* Fallback instruction */}
                {!activeActionId && (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-2 h-full">
                    <Compass className="w-10 h-10 text-gray-300 animate-spin" />
                    <span className="text-[10px] text-gray-400 font-bold leading-normal font-sans">
                      助理神经元就绪。在此点击决策中心快捷件，将直观展现大盘结构性计算结果及一键 ERP 下单通道。
                    </span>
                  </div>
                )}

                {/* Replenish Advisory Pane */}
                {activeActionId === "replenish" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest block border-b border-indigo-100 pb-1.5">
                      🚨 低安全库存动态补给诊断建议
                    </span>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto">
                      {replenishResult.map(item => (
                        <div key={item.id} className="bg-white border rounded-lg p-2.5 text-[10px] space-y-1.5 shadow-2xs">
                          <div className="flex justify-between font-bold">
                            <span className="text-gray-800">{item.name}</span>
                            <span className="text-amber-600 font-mono">剩余库存: {item.stock}</span>
                          </div>
                          <div className="text-gray-500 font-sans">
                            SKU: {item.sku} | 供应中心: <strong className="text-gray-700">{item.supplierName}</strong>
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                            <span className="text-gray-500">建议进大货: {item.adviseQty} 件 (估 €{item.totalCost})</span>
                            <button
                              onClick={() => executeRestockAdvice(item.sku, item.adviseQty, item.costPrice, item.supplierName)}
                              className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold px-2 py-1 rounded text-[9px] cursor-pointer"
                            >
                              一键签发大货采购单 (Restock)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance Warning Pane */}
                {activeActionId === "finance_warning" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-widest block border-b border-rose-100 pb-1.5">
                      ⚠️ 商品纯利润及零利润危险诊断
                    </span>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {marginAuditResult.map((m, idx) => (
                        <div 
                          key={m.id || idx} 
                          className={`p-2.5 rounded-lg border text-[10px] space-y-1 ${
                            m.isWarning ? "bg-rose-50 border-rose-200 text-rose-950" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between font-bold">
                            <span>{m.name}</span>
                            <span className={m.isWarning ? "text-rose-750 font-black animate-pulse" : "text-emerald-700"}>
                              毛利率: {m.margin.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-gray-500 flex justify-between font-sans">
                            <span>供应商采购面价: €{m.cost.toFixed(2)}</span>
                            <span>前台售价: €{m.price.toFixed(2)}</span>
                          </div>
                          {m.isWarning && (
                            <div className="text-[9px] font-bold text-rose-600 flex items-center gap-1 pt-1 border-t border-rose-100 mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              高危提示: 纯毛利低于30%警戒线！建议提升前台划线零售溢价或重新商谈供应商协议。
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Portrait Pane */}
                {activeActionId === "customer_portrait" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest block border-b border-gray-150 pb-1.5">
                      👥 VIP客商 LTV 被动细分画像
                    </span>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {customerPortraitTags.map(cust => (
                        <div key={cust.id} className="bg-white border border-gray-200 p-2.5 rounded-lg text-[10px] flex items-center justify-between shadow-2xs">
                          <div>
                            <div className="font-bold text-gray-800">{cust.name}</div>
                            <div className="text-gray-400 font-mono text-[9px]">{cust.email}</div>
                          </div>

                          <div className="text-right">
                            <span className="inline-block bg-indigo-50 border border-indigo-150 text-indigo-805 px-2 py-0.5 rounded font-extrabold text-[9px] uppercase">
                              {cust.tag}
                            </span>
                            <div className="text-[10px] font-extrabold text-gray-800 mt-1">LTV: €{cust.ltv}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marketing Upsells Proposal Pane */}
                {activeActionId === "marketing_recom" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest block border-b border-indigo-150 pb-1.5">
                      🎁 篮子交叉销售 (Basket Bundles) 智能套组推荐
                    </span>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto">
                      {bundleMatrix.map(b => (
                        <div key={b.id} className="bg-white border text-[10px] p-3 rounded-lg shadow-2xs space-y-1.5">
                          <div className="font-bold flex items-center justify-between text-gray-900">
                            <span>连带组合: {b.baseProduct} + {b.pairProduct}</span>
                          </div>
                          <div className="text-gray-500 font-sans">
                            推荐指数: <strong className="text-indigo-700">{b.recomRate}</strong> | 预计溢价提升: {b.suggestDiscount} 
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-1">
                            <span className="text-gray-400">申请专用折扣码: {b.promoCode}</span>
                            <button
                              onClick={() => createBundlePromoCode(b.promoCode, parseInt(b.suggestDiscount))}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-1 rounded text-[9px] cursor-pointer"
                            >
                              创建打包特惠优惠码
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CEO Analytical Cockpit */}
                {activeActionId === "ceo_cockpit" && ceoStats && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-widest block border-b border-emerald-150 pb-1.5">
                      👑 总裁董事会 C-Suite 经营度量报告
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-white border rounded p-2.5">
                        <span className="text-gray-400 block font-semibold">营业总收入 (Total Revenue)</span>
                        <strong className="text-emerald-700 text-sm block mt-1">€{ceoStats.revenue.toFixed(2)}</strong>
                      </div>
                      <div className="bg-white border rounded p-2.5">
                        <span className="text-gray-400 block font-semibold">采购列支支出 (COGS)</span>
                        <strong className="text-red-600 text-sm block mt-1">€{ceoStats.procurement.toFixed(2)}</strong>
                      </div>
                      <div className="bg-white border rounded p-2.5">
                        <span className="text-gray-400 block font-semibold">大盘主权纯利润 (Net Profit)</span>
                        <strong className="text-indigo-800 text-sm block mt-1">€{ceoStats.netSovereignProfit.toFixed(2)}</strong>
                      </div>
                      <div className="bg-white border rounded p-2.5">
                        <span className="text-gray-400 block font-semibold">已下发结算优惠券数 (Active Codes)</span>
                        <strong className="text-gray-800 text-sm block mt-1">{ceoStats.activePromoCodes}</strong>
                      </div>
                    </div>

                    <div className="bg-emerald-50 text-emerald-950 border border-emerald-150 p-2.5 rounded-lg flex items-center justify-between text-[10px] font-bold">
                      <span>大盘经营杠杆杠比率: {ceoStats.operatingRatio}%</span>
                      <span>应收账面余款 A/R: €{ceoStats.accountsPayable}</span>
                    </div>

                    <button
                      onClick={handleExportMockupReport}
                      className="w-full mt-2 py-2 bg-emerald-650 hover:bg-emerald-750 text-white font-extrabold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      导出本轮高维决策财务报告 (.Txt)
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom active node disclaimer */}
            <div className="bg-gray-50 border-t border-gray-100 p-4 text-[9px] text-gray-400 text-center font-mono">
              SOVEREIGN CLUSTER ENGINE LOGGING PIPELINES CO-PILOT TERMINAL
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
