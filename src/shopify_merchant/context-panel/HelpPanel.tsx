import React, { useState } from 'react';
import { Search, Sparkles, ChevronRight, Clock, ShoppingBag, Package, Play } from 'lucide-react';

interface HelpPanelProps {
  currentTab: string;
}

export default function HelpPanel({ currentTab }: HelpPanelProps) {
  const [helpSearch, setHelpSearch] = useState('');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const helpDocs = [
    {
      id: 'refund',
      title: '如何处理退款或退换货作业？',
      tab: 'orders',
      content: '1. 进入订单预览面板，点击下方 [Process Refund]（退款付款）\n2. 确认库存将重置。系统会自动将金额加回用户的原本付款卡片。\n3. Atelier Noir 风格提倡对退换货用户发送 10% 专属二次回购优惠代码（例如 SHOPBACK10），可以通过 Sidekick 自动撰写客制化致歉邮件。',
      time: '2 mins'
    },
    {
      id: 'csv',
      title: '批量导入订单与产品 CSV 文件说明',
      tab: 'products',
      content: '可以通过后台商品页面右上角 [Import] 导入标准 Shopify CSV 工具，Atelier Noir 的系统会智能校验 UTF-8 编码并自动排重，避免 SKU 号码产生不正常叠加。',
      time: '4 mins'
    },
    {
      id: 'tags',
      title: '提高搜索引擎 SEO 的商品描述编写技巧',
      tab: 'products',
      content: '1. 善用展示标签如 minimal, organic, raw-texturing 加强内部链接。\n2. 保留原产地详情并辅以段落描述。\n3. 使用 Sidekick AI 自动化一键生产品牌文案 (Design Copypasta)，符合极简前卫基调。',
      time: '3 mins'
    },
    {
      id: 'vip',
      title: '如何为 VIP 客户指定自动折扣编码',
      tab: 'customers',
      content: '1. 在 Customers 筛选 VIP 分群。\n2. 分配带有特定门槛（如 Min €150）的折扣券，可在 Discounts 分页配置专属代码。\n3. 您可以透过 Sidekick 输入指令：“向 VIP 群组发送优惠策略建议”。',
      time: '3 mins'
    },
    {
      id: 'pwa',
      title: 'PWA 应用離线运行与手机推送机制',
      tab: 'home',
      content: 'Atelier Noir Merchant Admin 内置 Service Worker，当处于离线/飞行模式时：\n1. 所有库存调整和订单状态更改均在本地暂存（SQLite/LocalStorage）。\n2. 重新连接互联网后，系统后台会自动向 Shopify 服务器同步所有事务，绝不漏单。',
      time: '5 mins'
    }
  ];

  const filteredHelpDocs = helpDocs.filter(doc => 
    doc.title.toLowerCase().includes(helpSearch.toLowerCase()) || 
    doc.content.toLowerCase().includes(helpSearch.toLowerCase())
  );

  const recommendedGuides = helpDocs.filter(doc => doc.tab === currentTab);

  return (
    <div className="space-y-4">
      {/* Search document box */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#616161] absolute left-3 top-3.5" />
        <input 
          type="text"
          value={helpSearch}
          onChange={(e) => setHelpSearch(e.target.value)}
          placeholder="Search merchant guides, procedures..."
          className="w-full bg-white text-xs border border-neutral-300 rounded-lg p-3 pl-8.5 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-sans shadow-xs"
        />
        {helpSearch && (
          <button 
            onClick={() => setHelpSearch('')}
            className="absolute right-3 top-3.5 text-neutral-400 hover:text-black font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Context-Aware Recommended Guides */}
      {!helpSearch && recommendedGuides.length > 0 && (
        <div className="bg-[#f2f2f2] border border-neutral-200 p-3.5 rounded-lg space-y-2.5">
          <div className="flex items-center space-x-1.5 text-[#1a1a1a]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold text-[10px] font-mono uppercase tracking-tight">Recommended for Page: {currentTab}</span>
          </div>
          <div className="space-y-1.5">
            {recommendedGuides.map(doc => (
              <button
                key={doc.id}
                onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                className="w-full text-left bg-white p-2.5 border border-neutral-200 hover:border-black rounded transition-all flex items-center justify-between font-medium group active:scale-98"
              >
                <span className="truncate pr-1">{doc.title}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${expandedDoc === doc.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Articles List */}
      <div className="space-y-2">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161] px-1">
          {helpSearch ? 'Search results' : 'Standard merchant references'} ({filteredHelpDocs.length})
        </h4>

        <div className="space-y-2">
          {filteredHelpDocs.map(doc => {
            const isExpanded = expandedDoc === doc.id;
            return (
              <div 
                key={doc.id}
                className="bg-white border border-[#e3e3e3] rounded-lg overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                  className="w-full p-3 flex justify-between items-center text-left hover:bg-neutral-50 transition-colors font-medium text-xs font-sans text-neutral-900"
                >
                  <div className="flex items-center space-x-2 pr-2">
                    {doc.tab === 'orders' ? <ShoppingBag className="w-3.5 h-3.5 text-[#616161] shrink-0" /> : <Package className="w-3.5 h-3.5 text-[#616161] shrink-0" />}
                    <span>{doc.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-neutral-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="bg-neutral-50 p-3.5 border-t border-neutral-200 space-y-2.5">
                    <p className="text-[11px] text-neutral-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {doc.content}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                      <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1" /> Reading: {doc.time}</span>
                      <span className="border border-neutral-300 px-1 py-0.2 rounded font-semibold bg-white uppercase">Tab: {doc.tab}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredHelpDocs.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              <p>No matching guides found.</p>
              <p className="text-[10px] mt-1">Try keywords like 'refund', 'tags', or 'pwa'.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Guides Embed Simulation */}
      <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg space-y-3 shadow-xs">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">VIDEO TUTORIAL</h4>
        <div className="relative rounded overflow-hidden aspect-video bg-neutral-900 flex flex-col items-center justify-center p-4 border border-neutral-700 text-white group cursor-pointer">
          <div className="absolute inset-0 bg-neutral-950/60 group-hover:bg-neutral-950/40 transition-all z-0" />
          <Play className="w-8 h-8 text-white z-10 font-bold group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold tracking-wide z-10 font-mono mt-2 text-center uppercase">Order Management Crash Course (3 Min)</span>
          <span className="text-[8px] tracking-wide text-neutral-400 font-mono z-10 mt-1">Presented by Atelier Nord Editorial Team</span>
        </div>
      </div>

      {/* Instant Support Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button 
          onClick={() => alert("📞 Live call established with representative (Simulation).")}
          className="shopify-btn-secondary py-2 font-medium flex items-center justify-center space-x-1"
        >
          <span>Instant Call</span>
        </button>
        <button 
          onClick={() => alert("💬 Launching support messaging drawer.")}
          className="shopify-btn-primary py-2 font-medium flex items-center justify-center space-x-1"
        >
          <span>Message Rep</span>
        </button>
      </div>
    </div>
  );
}
