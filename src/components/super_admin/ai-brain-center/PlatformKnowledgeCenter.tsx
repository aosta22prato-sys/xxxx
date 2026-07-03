import React, { useState, useEffect } from 'react';
import { 
  Database, CheckCircle, Plus, Sparkles, Globe, 
  Cpu, Layers, Zap, Play, Activity, AlertTriangle, Code, 
  FileText, ArrowRight, Loader2, RefreshCw, Layers3, Check, Scale 
} from 'lucide-react';
import { KnowledgeDoc, IndustryType } from '../../../types';

interface PlatformKnowledgeCenterProps {
  tenantDB: Record<string, any>;
  setTenantDB: React.Dispatch<React.SetStateAction<any>>;
  selectedIndustry: IndustryType;
  addLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

interface StructuredRule {
  rule_id: string;
  domain: string;
  rule_title: string;
  state_dependencies: Array<{ metric: string; alert_threshold: string }>;
  conditions: string[];
  actions: Array<{ action_name: string; execution_parameters: Record<string, any> }>;
  exceptions: string[];
}

export default function PlatformKnowledgeCenter({
  tenantDB,
  setTenantDB,
  selectedIndustry,
  addLog
}: PlatformKnowledgeCenterProps) {
  // 子选单
  const [ragTab, setRagTab] = useState<'rag3' | 'playground' | 'firecrawl' | 'rag1'>('rag3');

  // RAG 状态
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  // 爬虫状态
  const [crawlUrl, setCrawlUrl] = useState('https://shopify.com/legal/cross-border-logistics');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [scrapedMarkdown, setScrapedMarkdown] = useState('');
  const [scrapedMetadata, setScrapedMetadata] = useState<any>(null);

  const currentIndustryData = tenantDB[selectedIndustry] || { knowledge: [], products: [] };
  
  // 核心运行环境指标数据
  const liveTelemetry = {
    refund_rate: "12.4%",
    risk_level: "风控高",
    inventory_alert_threshold: "< 10 件",
    current_stock_level: currentIndustryData.products?.[0]?.stock !== undefined ? `${currentIndustryData.products[0].stock} 件` : "6 件",
    current_product_price: currentIndustryData.products?.[0]?.price !== undefined ? `€${currentIndustryData.products[0].price}` : "€159.00",
    freight_volatility_multiplier: "1.18x",
    ebitda_safety_margin: "35.0%"
  };

  const [structuredPolicies, setStructuredPolicies] = useState<StructuredRule[]>([
    {
      rule_id: "rule_rag_01",
      domain: "refund",
      rule_title: "退款风控拦截与商户资金保护规则",
      state_dependencies: [
        { metric: "refund_rate", alert_threshold: "< 12.0%" },
        { metric: "risk_level", alert_threshold: "常规风控" }
      ],
      conditions: [
        "order_age <= 14 天",
        "product_not_used == true",
        "country_origin === France"
      ],
      actions: [
        { 
          action_name: "allow_refund_reversal", 
          execution_parameters: { store_wallet_currency: "EUR", reverse_transit_carrier: "DHL Express" } 
        }
      ],
      exceptions: [
        "electronics_unsealed == true (deduct 15%)",
        "vip_customer_tier == premium"
      ]
    },
    {
      rule_id: "rule_rag_02",
      domain: "logistics",
      rule_title: "物流运损成本自适应价格调整规则",
      state_dependencies: [
        { metric: "freight_volatility_multiplier", alert_threshold: "> 1.15x" },
        { metric: "ebitda_safety_margin", alert_threshold: ">= 35.0%" }
      ],
      conditions: [
        "freight_base_increase > 15%",
        "Alpine_road_blocked == true",
        "current_stock_level < 10 units"
      ],
      actions: [
        { 
          action_name: "trigger_yield_pricing_markup", 
          execution_parameters: { markup_factor: 1.048, database_target: "Botble CMS tables" } 
        },
        {
          action_name: "reroute_logistics_corridor",
          execution_parameters: { alternative_channel: "Maritime Corridor", detour_penalty: "+120km" }
        }
      ],
      exceptions: [
        "contracted_freight_hedging == true"
      ]
    }
  ]);

  const [selectedRuleId, setSelectedRuleId] = useState<string>("rule_rag_01");
  const selectedRule = structuredPolicies.find(r => r.rule_id === selectedRuleId) || structuredPolicies[0];
  const [ruleEditorContent, setRuleEditorContent] = useState(JSON.stringify(selectedRule, null, 2));

  useEffect(() => {
    if (selectedRule) {
      setRuleEditorContent(JSON.stringify(selectedRule, null, 2));
    }
  }, [selectedRuleId, structuredPolicies]);

  // 沙盒模拟状态
  const [playgroundScenario, setPlaygroundScenario] = useState('french_vip_refund');
  const [playgroundScenarioDesc, setPlaygroundScenarioDesc] = useState('法国站 VIP 账户退款判定：此时退款率触发指标过载，系统计算例外条款并调用自愈行动。');
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [playgroundLogs, setPlaygroundLogs] = useState<string[]>([]);
  const [playOutcome, setPlayOutcome] = useState<{
    status: 'APPROVED' | 'REJECTED' | 'CONDITIONAL_DISPATCH';
    actionTaken: string;
    details: string;
  } | null>(null);

  // 抓取流程
  const handleFirecrawlScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl.trim()) return;

    setIsCrawling(true);
    setCrawlLogs([
      `连接规则爬取网关...`,
      `访问解析路径: ${crawlUrl}`,
      `提取语义，过滤多余元素并打包...`
    ]);

    try {
      const resp = await fetch("/api/gemini/firecrawl-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: crawlUrl })
      });

      const data = await resp.json();
      if (data.success) {
        setScrapedMarkdown(data.markdown);
        setScrapedMetadata(data.metadata);
        setCrawlLogs(prev => [
          ...prev, 
          `成功下载并提炼规则内容！`,
          `域标识: ${data.metadata.primaryDomain}`,
          `提取出合格限值条件: ${data.metadata.ruleCount} 条`
        ]);
        addLog(
          '智能规则抓取',
          '网页规则解析成功',
          `提取网页规则自适应转换成功。`,
          'success'
        );
      } else {
        alert("抓取失败: " + (data.error || "错误"));
      }
    } catch (err: any) {
      alert("抓取组件异常: " + err.message);
    } finally {
      setIsCrawling(false);
    }
  };

  // 编译 RAG 规约
  const [isCompilingRule, setIsCompilingRule] = useState(false);
  const handleCompileToRAG3 = async () => {
    const textToCompile = scrapedMarkdown || newDocContent;
    if (!textToCompile.trim()) {
      alert("请编写或抓取要提炼的页面公文。");
      return;
    }

    setIsCompilingRule(true);
    addLog('知识编译器', '编译规则条目', `开始将运营文书翻译为结构化决策 JSON。`, 'info');

    try {
      const resp = await fetch("/api/gemini/policy-to-structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docText: textToCompile,
          domainHint: crawlUrl.includes("refund") ? "refund" : "logistics"
        })
      });

      const data = await resp.json();
      if (data.success && data.policy) {
        const compiled: StructuredRule = data.policy;
        compiled.rule_id = `rule_compiled_${Date.now().toString().slice(-4)}`;
        
        setStructuredPolicies(prev => [compiled, ...prev]);
        setSelectedRuleId(compiled.rule_id);
        setRagTab('rag3');
        
        addLog(
          '知识编译器',
          '决策规约编译成功',
          `成功编译并载入运行库: ${compiled.rule_title}`,
          'success'
        );
      } else {
        alert("编译解析失败: " + (data.error || "未知"));
      }
    } catch (err: any) {
      alert("编译器异常: " + err.message);
    } finally {
      setIsCompilingRule(false);
    }
  };

  // 保存活动规则
  const handleSaveRuleEditor = () => {
    try {
      const parsed = JSON.parse(ruleEditorContent);
      if (!parsed.rule_id || !parsed.rule_title) {
        alert("规则格式不规范：请确保定义了 rule_id 与 rule_title。");
        return;
      }

      setStructuredPolicies(prev => prev.map(r => r.rule_id === selectedRuleId ? parsed : r));
      addLog(
        '规则设置',
        '更新决策规约',
        `规则"${parsed.rule_title}"更新。`,
        'success'
      );
      alert("✅ 规则已更新至执行框架。");
    } catch (err: any) {
      alert("格式校验有误: " + err.message);
    }
  };

  // 文档导入
  const handleAddKnowledgeDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    const newDoc: KnowledgeDoc = {
      id: 'kd_custom_' + Date.now(),
      title: newDocTitle,
      category: newDocCategory || '常规',
      content: newDocContent,
      size: `${(newDocContent.length / 1024).toFixed(1)} KB`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTenantDB((prev: any) => {
      const indData = prev[selectedIndustry] || { knowledge: [], products: [] };
      return {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          knowledge: [newDoc, ...(indData.knowledge || [])]
        }
      };
    });

    setNewDocTitle('');
    setNewDocCategory('');
    setNewDocContent('');
    setShowAddDoc(false);

    addLog(
      '知识库',
      '同步索引长文档',
      `文档"${newDoc.title}"导入。`,
      'success'
    );
  };

  // 执行沙盒推理
  const executePlaygroundReasoning = () => {
    setIsPlayingBack(true);
    setPlaygroundLogs([
      `分析评估核心：载入场景中...`,
      `环境检测：自提取当前周期运营状态指标并审核...`
    ]);

    setTimeout(() => {
      setPlaygroundLogs(prev => [
        ...prev,
        `数据快照：今日退货率达到 ${liveTelemetry.refund_rate}。`,
        `数据快照：对应断货风险产品在库数量为 ${liveTelemetry.current_stock_level}。`,
        `数据快照：物流成本增幅为 ${liveTelemetry.freight_volatility_multiplier}。`
      ]);
    }, 500);

    setTimeout(() => {
      setPlaygroundLogs(prev => [
        ...prev,
        `进行规则遍历匹配...`,
        `锁定最契合运行规约: "${structuredPolicies[0].rule_title}"`,
        `锁定最契合运行规约: "${structuredPolicies[1].rule_title}"`
      ]);
    }, 1000);

    setTimeout(() => {
      if (playgroundScenario === 'french_vip_refund') {
        setPlaygroundLogs(prev => [
          ...prev,
          `判断：订单未过限额周期。`,
          `特权核算：此账户为核心VIP用户等级，符合商户保留豁免。`,
          `安全拦截：本日退款总压力严重触顶！限制直接退现原渠道，采用补偿转化对冲。`,
          `策略形成：阻断直接退款，发放等额优惠抵用券，安排DHL自动调度回收货物。`
        ]);
        setPlayOutcome({
          status: "CONDITIONAL_DISPATCH",
          actionTaken: "阻断原路现金，触发特权等额优惠红利覆盖 + 自适应物流召回",
          details: "由于退款风控系数超量（高于12%），依据特权代偿规约 rule_rag_01，自动阻断大额退现，向该高资客户注册邮箱投放 €159.00 代偿优惠凭证（RETREAT-25），同时在 DHL 建立反向收纳物流单。"
        });

        addLog(
          '沙盒执行',
          '退款拦截完成',
          `优惠等额覆盖抵冲，避免巴黎退现。`,
          'success'
        );

      } else {
        setPlaygroundLogs(prev => [
          ...prev,
          `判断：地缘极端天气交通阻断情况属实。`,
          `安全预警：里昂备用货源跌入安全补货水位。`,
          `策略形成：上调销售倍率参数护盘毛利；在途货运自主切换至近海港。`
        ]);
        
        setTenantDB((prev: any) => {
          const currentProducts = [...(prev[selectedIndustry]?.products || [])];
          if (currentProducts.length > 0) {
            const oldPrice = currentProducts[0].price || 159;
            const newPrice = parseFloat((oldPrice * 1.048).toFixed(2));
            currentProducts[0] = {
              ...currentProducts[0],
              price: newPrice,
              stock: 120
            };
            
            fetch("/api/db/save-all", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...prev,
                [selectedIndustry]: {
                  ...prev[selectedIndustry],
                  products: currentProducts
                }
              })
            }).then(r => r.json()).catch(e => console.error(e));

            return {
              ...prev,
              [selectedIndustry]: {
                ...prev[selectedIndustry],
                products: currentProducts
              }
            };
          }
          return prev;
        });

        setPlayOutcome({
          status: "APPROVED",
          actionTaken: "自适应提调售价 +4.8% 并重构运载走廊",
          details: "由于物流费率突攀至 1.18x，自适应执行保护利润，价格上调至 €166.63。保障入库调度货源 120 件。"
        });

        addLog(
          '沙盒执行',
          '价格护盘执行成功',
          `由于运保费看涨调整价格系统系数。`,
          'success'
        );
      }
      setIsPlayingBack(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-slate-900 text-left">
      
      {/* 选项切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 rounded bg-zinc-950 text-white font-bold text-xs font-mono">知识中心</span>
          <h2 className="text-sm font-bold text-slate-900"> RAG 知识规则配置</h2>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded gap-1 border border-slate-200">
          {[
            { id: 'rag3', label: '运行决策规则' },
            { id: 'playground', label: '对冲沙盒模拟' },
            { id: 'firecrawl', label: '智能海爬抓取' },
            { id: 'rag1', label: '参考长文书库' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setRagTab(t.id as any)}
              className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded ${
                ragTab === t.id
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 选单 1 */}
      {ragTab === 'rag3' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fadeIn">
          
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-zinc-950 text-white rounded-lg p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                当前运行中规约
              </span>
              <div className="space-y-1.5 border-t border-zinc-900 pt-2.5">
                {structuredPolicies.map(p => (
                  <button
                    key={p.rule_id}
                    onClick={() => setSelectedRuleId(p.rule_id)}
                    className={`w-full p-2 rounded text-left flex items-start gap-2 transition-all cursor-pointer ${
                      selectedRuleId === p.rule_id
                        ? 'bg-zinc-900 border border-zinc-700 text-white'
                        : 'bg-transparent border border-transparent text-zinc-400 hover:bg-zinc-905 focus:outline-none'
                    }`}
                  >
                    <span className="text-xs text-zinc-500">•</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{p.rule_title}</p>
                      <p className="text-[9px] font-mono text-zinc-500 mt-0.5">标识: {p.rule_id}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    const newRule: StructuredRule = {
                      rule_id: `rule_manual_${Date.now().toString().slice(-4)}`,
                      domain: "general",
                      rule_title: "自定义自适应决策规则",
                      state_dependencies: [{ metric: "risk_level", alert_threshold: "low" }],
                      conditions: ["customer_age_days >= 30 days"],
                      actions: [{ action_name: "register_general_override", execution_parameters: { custom_buffer: 0.1 } }],
                      exceptions: ["unusual_volume_spike == true"]
                    };
                    setStructuredPolicies([...structuredPolicies, newRule]);
                    setSelectedRuleId(newRule.rule_id);
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加自定义规则</span>
                </button>
              </div>
            </div>

            {/* 环境指标监测 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-200 pb-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold">自适应环境指标</span>
              </div>
              <div className="space-y-2 font-mono text-[11px]">
                {Object.entries(liveTelemetry).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center bg-white border border-slate-100 p-1.5 rounded">
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-slate-800 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between">
              
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-slate-700" />
                  <span>逻辑定义配置</span>
                </h4>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">规约名称</label>
                  <input
                    type="text"
                    value={selectedRule.rule_title}
                    onChange={(e) => {
                      const updated = { ...selectedRule, rule_title: e.target.value };
                      setStructuredPolicies(prev => prev.map(r => r.rule_id === selectedRuleId ? updated : r));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">规则代码 (JSON 格式)</label>
                  <textarea
                    rows={12}
                    value={ruleEditorContent}
                    onChange={(e) => setRuleEditorContent(e.target.value)}
                    className="w-full bg-zinc-950 text-[#07C2E3] font-mono text-xs rounded p-3 leading-relaxed focus:outline-none border border-zinc-900 shadow-inner"
                  />
                </div>

                <div className="bg-zinc-100 rounded p-3 border border-zinc-200">
                  <div className="space-y-1 text-xs text-slate-700">
                    <p className="font-bold">挂载的底层业务函数</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedRule.actions.map((act, idx) => (
                        <span key={idx} className="bg-zinc-900 text-white font-mono text-[10px] px-2 py-1 rounded border border-zinc-800 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>{act.action_name}()</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setRuleEditorContent(JSON.stringify(selectedRule, null, 2))}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-250 text-xs font-bold cursor-pointer"
                  >
                    重置
                  </button>
                  <button
                    onClick={handleSaveRuleEditor}
                    className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    同步保存
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 选单 2 */}
      {ragTab === 'playground' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-950 text-white rounded-lg p-5 space-y-3">
            <h3 className="font-bold text-xs flex items-center gap-1.5">
              <span>运营自愈对冲测试控制</span>
            </h3>
            <p className="text-xs text-zinc-400">
              触发特定的环境事件来观测并测试自适应规则的防御成效。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              
              <button
                onClick={() => {
                  setPlaygroundScenario('french_vip_refund');
                  setPlaygroundScenarioDesc('退货风控测试：退款率触发指标过载后进行例外条款判定，从而执行对冲规避路径。');
                  setPlayOutcome(null);
                  setPlaygroundLogs([]);
                }}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  playgroundScenario === 'french_vip_refund'
                    ? 'bg-zinc-900 border border-zinc-700 text-white'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <span className="text-xs font-bold text-white">退换货风控例外保障</span>
                <span className="text-[10px] text-zinc-500 truncate">测试风控例外与红利代偿机制</span>
              </button>

              <button
                onClick={() => {
                  setPlaygroundScenario('alpine_price_markup');
                  setPlaygroundScenarioDesc('异常物流调备测试：面临极端运输阻塞及价格异动下的系统价格自对冲决策。');
                  setPlayOutcome(null);
                  setPlaygroundLogs([]);
                }}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  playgroundScenario === 'alpine_price_markup'
                    ? 'bg-zinc-900 border border-zinc-700 text-white'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <span className="text-xs font-bold text-white">卡关成本价格补偿</span>
                <span className="text-[10px] text-zinc-500 truncate">测试毛利保障调率与海运接调</span>
              </button>

            </div>

            <div className="p-3 bg-zinc-900 rounded border border-zinc-800 text-xs font-mono text-zinc-300">
              {playgroundScenarioDesc}
            </div>

            <div className="flex justify-end">
              <button
                onClick={executePlaygroundReasoning}
                disabled={isPlayingBack}
                className="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-100 rounded text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                {isPlayingBack ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>自适应推理中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>执行对冲测算</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-lg p-4 h-64 overflow-y-auto">
              <span className="text-[10px] text-zinc-400 font-mono block border-b border-zinc-900 pb-1 font-bold">推理诊断轨迹:</span>
              {playgroundLogs.length === 0 ? (
                <div className="py-16 text-center text-zinc-650 text-xs font-mono">
                  等待执行对冲调试测试...
                </div>
              ) : (
                <div className="space-y-1 mt-2.5 text-left font-mono text-[11px]">
                  {playgroundLogs.map((log, id1) => {
                    let col = "text-zinc-400";
                    if (log.includes("数据快照")) col = "text-indigo-400";
                    if (log.includes("策略形成")) col = "text-emerald-400";
                    return (
                      <p key={id1} className={`${col} leading-relaxed`}>
                        {log}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between h-64">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block border-b border-slate-100 pb-1.5">最终执行自愈策略</span>
                {!playOutcome ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    无测试输出结果
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 text-xs text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">决策指令</span>
                      <p className="font-bold text-slate-900 mt-0.5">{playOutcome.actionTaken}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">决策依据</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{playOutcome.details}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 选单 3 */}
      {ragTab === 'firecrawl' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fadeIn">
          <div className="xl:col-span-5 space-y-4 text-left">
            <div className="bg-zinc-950 text-white rounded-lg p-5 space-y-3">
              <span className="text-zinc-400 font-bold text-[9px] uppercase tracking-wider block">
                规则网页抓取
              </span>
              <p className="text-xs text-zinc-400 leading-normal">
                输入法规文书或行业政策链接，爬网模块将智能过滤多余文本，转换成标准可运行逻辑。
              </p>

              <form onSubmit={handleFirecrawlScrape} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase">网页路径</label>
                  <input
                    type="url"
                    required
                    value={crawlUrl}
                    onChange={e => setCrawlUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 font-mono text-xs text-zinc-200 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCrawlUrl('https://botble.com/api/refunds-logistics-webhook')}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-[10px] text-zinc-300 py-1.5 px-2 rounded border border-zinc-800 transition-colors truncate"
                  >
                    🕸️ 退款检测接口
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrawlUrl('https://shopify.com/disruptive-routing-laws-sla')}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-[10px] text-zinc-300 py-1.5 px-2 rounded border border-zinc-800 transition-colors truncate"
                  >
                    🛍️ 分仓调运协议
                  </button>
                </div>

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isCrawling}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs py-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isCrawling ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>抓取连接中...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>抓取并同步</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 font-mono text-[10px] text-zinc-400 h-40 overflow-y-auto">
              <span className="text-zinc-500 font-bold block border-b border-zinc-900 pb-1">抓取状态日志:</span>
              {crawlLogs.length === 0 ? (
                <p className="text-zinc-600 italic mt-2">暂无任务日志。</p>
              ) : (
                <div className="space-y-1 mt-2 font-light">
                  {crawlLogs.map((log, i3) => (
                    <p key={i3}>{log}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-7 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <span className="text-xs font-bold block text-slate-800">过滤后的纯文本规格</span>
              
              <textarea
                rows={11}
                value={scrapedMarkdown || newDocContent}
                onChange={e => {
                  if (scrapedMarkdown) setScrapedMarkdown(e.target.value);
                  else setNewDocContent(e.target.value);
                }}
                placeholder="抓取提炼结果会在此显示..."
                className="w-full bg-slate-50 border border-slate-250 rounded p-2.5 font-mono text-xs focus:outline-none"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleCompileToRAG3}
                  disabled={isCompilingRule || (!scrapedMarkdown && !newDocContent)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  {isCompilingRule ? '正在编译规约...' : '一键转换为决策规则 (JSON)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 选单 4 */}
      {ragTab === 'rag1' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800">在案行业长文书参考库</span>
            </div>
            
            <button
              onClick={() => setShowAddDoc(!showAddDoc)}
              className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>导入参考公文</span>
            </button>
          </div>

          {showAddDoc && (
            <form onSubmit={handleAddKnowledgeDoc} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="文书标题"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="p-2 border border-slate-200 rounded bg-white text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="分类主题"
                  value={newDocCategory}
                  onChange={e => setNewDocCategory(e.target.value)}
                  className="p-2 border border-slate-200 rounded bg-white text-xs text-slate-900"
                />
              </div>
              <textarea
                required
                rows={5}
                placeholder="录入详细文本规程..."
                value={newDocContent}
                onChange={e => setNewDocContent(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded bg-white text-xs text-slate-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoc(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-950 text-white rounded text-xs animate-pulse"
                >
                  保存
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentIndustryData.knowledge || []).map((doc: any) => (
              <div key={doc.id} className="bg-white border border-slate-200 hover:border-slate-350 rounded p-4 space-y-2 text-left relative transition-all">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold max-w-[120px] truncate">
                    {doc.category}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">大小: {doc.size || '1.1 KB'} • {doc.lastUpdated}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-950">{doc.title}</h4>
                <p className="text-[11px] text-slate-550 leading-normal line-clamp-3">{doc.content}</p>
              </div>
            ))}
            {(currentIndustryData.knowledge || []).length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
                尚无参考长文。
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
