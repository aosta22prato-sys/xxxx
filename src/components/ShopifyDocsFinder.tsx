import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Code, 
  Terminal, 
  ArrowRight, 
  Check, 
  Compass, 
  FileCode,
  Globe,
  RefreshCw,
  Copy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ShopifyDocsFinderProps {
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function ShopifyDocsFinder({ addLog }: ShopifyDocsFinderProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('graphql');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const QUICK_PRESETS = [
    { title: '查找 GraphQL 商品创建 Mutation', query: 'mutation productCreate to spawn active variants in Shopify Admin API', cat: 'graphql' },
    { title: '查看 Node.js Webhook 验签代码', query: 'Verify Shopify webhook HMAC SHA256 signatures in Express router middleware', cat: 'webhooks' },
    { title: '展示 Liquid 库存降级色块警告', query: 'Best Dawn theme dynamic variant inventory indicator badge snippet with colors', cat: 'liquid' },
    { title: '获取 GraphQL 批量数据调取 (Bulk Query)', query: 'Using massive Bulk Operations API query using GraphQL for complete catalog export', cat: 'graphql' }
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string, customCat?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (customQuery || query).trim();
    const finalCat = customCat || category;
    if (!finalQuery) return;

    setLoading(true);
    setResult('');
    addLog(
      'Developer Terminal',
      'Consulting Shopify Hub',
      `Fetching dev reference templates and schemas from Shopify Docs regarding: "${finalQuery}".`,
      'info'
    );

    try {
      const response = await fetch('/api/gemini/shopify-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, category: finalCat })
      });

      if (!response.ok) {
        throw new Error('API server returned a validation fault');
      }

      const data = await response.json();
      setResult(data.text);
      setIsSimulated(!!data.simulated);
      
      addLog(
        'Gemini Docs Assistant',
        'Reference Rendered',
        `Retrieved fully functional template code containing standard structure schema.`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      setResult('### 🛑 Error fetching manual details\nFailed to sync with local developer routing. Ensure local server endpoint is online and try again.');
    } finally {
      setLoading(false);
    }
  };

  const executePreset = (p: typeof QUICK_PRESETS[0]) => {
    setQuery(p.query);
    setCategory(p.cat);
    handleSearch(undefined, p.query, p.cat);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left font-sans animate-fadeIn">
      
      {/* Top Welcome Title */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <BookOpen className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Shopify Dev Docs Assistant</span>
          </div>
          <h3 className="text-xl font-bold font-display">Shopify 智能开发文档查找器</h3>
          <p className="text-xs text-[#d1d5db] font-normal leading-relaxed max-w-xl">
            输入任何关于 Shopify GraphQL 字段、HMAC 签名验签、或者 Liquid 的语法疑问。由 Gemini 大模型实时翻译并生成极其规范、无多余客套的可编译代码片段。
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-850 border border-slate-750 p-2.5 rounded-xl font-mono">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">API VERSION: <b className="text-white">2024-04 (Latest)</b></span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Search input &Presets Selector */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Compass className="w-4 h-4 text-indigo-650" /> 检索查找面板 (Manual Control)
          </h4>

          <form onSubmit={(e) => handleSearch(e)} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">接口类别分类 (Category)</label>
              <div className="flex gap-1.5">
                {[
                  { key: 'graphql', label: 'GraphQL API', icon: Code },
                  { key: 'webhooks', label: 'Webhook (HMAC)', icon: Globe },
                  { key: 'liquid', label: 'Liquid 模板', icon: FileCode },
                ].map(cat => {
                  const isSelected = category === cat.key;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold shadow-sm' 
                          : 'bg-slate-50 border-transparent text-[#475569] hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[9px] font-black">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">查询开发指令 / 问题描述</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)}
                  placeholder="例如: mutation to create product with inventory..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-xs text-slate-800 placeholder-slate-400 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all" 
                />
                
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 text-white hover:bg-indigo-705 rounded-lg disabled:opacity-40 transition-opacity cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick presets list */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">推荐常用开发查询实例:</span>
            <div className="space-y-1.5">
              {QUICK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => executePreset(p)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-900 rounded-lg text-[11px] font-medium border border-transparent transition-all flex items-start gap-1.5 text-xs cursor-pointer italic"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Output details view */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-[500px] flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> API 文档返回端面 (Shopify Developer Hub Result)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">格式化 Markdown 可执行结构。支持直接一键复制代码块，配合 Gemini 精准推理。</p>
              </div>

              {result && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-1 px-2.5 bg-slate-50 border hover:bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600">已复制!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制全部</span>
                      </>
                    )}
                  </button>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isSimulated ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isSimulated ? 'Simulated Fallback' : 'Gemini Active'}
                  </span>
                </div>
              )}
            </div>

            {/* Document markdown parsing content body */}
            <div className="text-slate-850 font-normal leading-relaxed text-xs overflow-y-auto max-h-[550px] p-2 prose prose-slate">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs text-slate-400 font-bold animate-pulse">Gemini 正在编译整理最新 Shopify API 文档...</p>
                </div>
              ) : result ? (
                <div className="markdown-body text-slate-800">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 text-slate-405 text-slate-400">
                  <Code className="w-12 h-12 text-slate-205 text-slate-300" />
                  <div className="space-y-1">
                    <p className="font-bold">查询控制台闲置</p>
                    <p className="text-[11px] max-w-sm">输入指令或点击左下角常用开发参数实例，获取格式精确的可编译 REST/GraphQL 全量 payload 模板。</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>LLM Model: <b className="text-slate-550 border-r border-slate-200 pr-2">gemini-3.5-flash</b></span>
            <span>Api specifications: <b className="text-slate-550">GraphQL Admin v2024-04</b></span>
          </div>

        </div>

      </div>

    </div>
  );
}
