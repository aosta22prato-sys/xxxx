import React, { useState } from 'react';
import { 
  useAppsteroStore 
} from '../../stores/appsteroStore';
import { useProductStore } from '../../stores/productStore';
import { useOrderStore } from '../../stores/orderStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { 
  ArrowLeft, Search, Star, Settings, Check, X, ShieldAlert, Coins, 
  MessageSquare, Truck, Gift, Sparkles, RefreshCw, Send, CheckCircle, 
  ArrowRight, Eye, Plus, ShoppingBag
} from 'lucide-react';

interface AppsteroViewProps {
  currentTab: string;
}

const appIcons: Record<string, any> = {
  Coins: Coins,
  MessageSquare: MessageSquare,
  Gift: Gift,
  Truck: Truck,
  Sparkles: Sparkles
};

export default function AppsteroView({ currentTab }: AppsteroViewProps) {
  const { apps, installApp, uninstallApp, updateAppConfig } = useAppsteroStore();
  const { products } = useProductStore();
  const { orders, setOrders } = useOrderStore();
  const { setCurrentTab } = useLayoutStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // 1. 客流气泡沙盒状态
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    { sender: 'agent', text: '您好，这里是客服服务，请问有什么可以帮您？' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // 2. 智能挽留拦截模拟状态
  const [showExitIntentSim, setShowExitIntentSim] = useState(false);

  // 3. 物流发货模拟状态
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [printLabel, setPrintLabel] = useState<any | null>(null);
  const [carrierType, setCarrierType] = useState('DHL');

  // 4. 星火智能文案生成状态
  const [aiSelectedProductId, setAiSelectedProductId] = useState('');
  const [aiStyle, setAiStyle] = useState('editorial_noir');
  const [aiGeneratedCopy, setAiGeneratedCopy] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // 5. 汇率换算器测试状态
  const [fxTestVal, setFxTestVal] = useState('100');

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'marketing', name: '营销' },
    { id: 'finance', name: '财务' },
    { id: 'support', name: '客服' },
    { id: 'shipping', name: '物流' },
    { id: 'ai', name: '智能' }
  ];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.includes(searchQuery) || 
                          app.tagline.includes(searchQuery) ||
                          app.description.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'marketing': return '全网营销';
      case 'finance': return '财务精算';
      case 'support': return '客户支持';
      case 'shipping': return '极速物流';
      case 'ai': return '智能大脑';
      default: return '其它';
    }
  };

  const activeAppId = currentTab.replace('app-', '');
  const activeApp = apps.find(app => app.id === activeAppId);

  // 客流气泡自动答复模拟
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = '已登记您的诉求，专席顾问将在5分钟内通过邮件为您处理。';
      if (userMsg.includes('尺码') || userMsg.includes('重') || userMsg.includes('大小')) {
        reply = '定制商品建议您提供身高端并由系统精准裁切成型，我们的系统支持极智1对1尺码调教。';
      } else if (userMsg.includes('折') || userMsg.includes('券') || userMsg.includes('优惠')) {
        reply = '新宾首单即享专享减免！您也可以关注页面弹出的出站挽留专享渠道。';
      }
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply }]);
    }, 1200);
  };

  // 批量物流履行模拟
  const handleFulfillOrders = () => {
    if (selectedOrderIds.length === 0) {
      showToast('请选择需要打单发货的订单');
      return;
    }
    const o = orders.find(ord => ord.id === selectedOrderIds[0]);
    if (!o) return;

    setPrintLabel({
      trackingNumber: `CN-${carrierType}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      orderName: o.name,
      customerName: o.customerName,
      carrier: carrierType,
      date: new Date().toLocaleDateString(),
      shipper: activeApp?.config?.senderAddress || '系统中心保税仓'
    });

    const updated = orders.map(ord => {
      if (selectedOrderIds.includes(ord.id)) {
        return { ...ord, fulfillmentStatus: 'fulfilled' as const };
      }
      return ord;
    });
    setOrders(updated);
    showToast(`成功建立 ${selectedOrderIds.length} 笔订单发货凭证并更新为已发货！`);
    setSelectedOrderIds([]);
  };

  // AI 智能文案生成模拟
  const handleGenerateCopy = () => {
    if (!aiSelectedProductId) {
      showToast('请先选择一款商品原型');
      return;
    }
    const p = products.find(prod => prod.id === aiSelectedProductId);
    if (!p) return;

    setAiGenerating(true);
    setAiGeneratedCopy('');

    setTimeout(() => {
      let text = '';
      if (aiStyle === 'editorial_noir') {
        text = `【极智美学 & 永恒质感】\n这款「${p.title}」秉持黑白中性设计精髓，纯粹精纺羊绒与无缝切缝完美结合，多余纽扣被隐藏，还原极简雕塑线条。为您打造极具力量感与知识分子的优雅骨相。`;
      } else if (aiStyle === 'hyper_minimal') {
        text = `【极简主义的硬核陈述】\n「${p.title}」通过理性接缝定义轮廓，防水高密面料可轻松应对风雨挑战。不设复杂缀饰，全衣线条流畅自然，是致敬现代建筑实用法则的标志之作。`;
      } else {
        text = `【原生态叛逆街头主义】\n「${p.title}」大胆打破刻板精致，以重磅洗水与手工流苏拼接设计，塑造解构主义粗粝美感。适合追求态度、拒绝千篇一律的独立先锋者。`;
      }
      setAiGeneratedCopy(text);
      setAiGenerating(false);
      showToast('智能极简文案已生成并适配！');
    }, 1000);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-4 text-neutral-900 select-none animate-fadeIn font-sans">
      
      {/* Toast 优雅浮窗 */}
      {toast && (
        <div className="fixed top-16 right-6 bg-[#111111] text-white text-xs px-4 py-3 rounded-md shadow-lg border border-neutral-800 z-50 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-[#008060]" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {currentTab === 'appstero' ? (
        <>
          {/* 生态大盘页头部：极致黑白，极简无噪 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e3e3e3] pb-4 gap-3 bg-white p-5 rounded-lg border border-[#e3e3e3]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 bg-[#e6f2ee] text-[#008060] text-[10px] font-bold rounded">开放生态</span>
                <span className="text-neutral-300">/</span>
                <span className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase">系统应用中心</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 mt-1">应用生态大盘</h1>
              <p className="text-xs text-neutral-500 leading-normal mt-0.5">
                为您的一键店铺装备极速价格换算、智能客服气泡、一键物流打单与 AI 文案助手。
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-[#f6f6f7] p-2.5 px-3 rounded-lg border border-[#e3e3e3] shrink-0">
              <div className="text-center px-1">
                <span className="block text-[9px] text-neutral-500 font-semibold">云服务对接</span>
                <span className="text-xs font-bold text-[#008060] block mt-0.5">已连通</span>
              </div>
              <div className="w-[1px] h-6 bg-[#e3e3e3]"></div>
              <div className="text-center px-1">
                <span className="block text-[9px] text-neutral-500 font-semibold">已启用插件</span>
                <span className="text-xs font-bold text-neutral-850 block mt-0.5">
                  {apps.filter(a => a.isInstalled).length} / {apps.length} 个
                </span>
              </div>
            </div>
          </div>

          {/* 搜索与分类导航栏 */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white p-3 rounded-lg border border-[#e3e3e3]">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === c.id 
                      ? 'bg-[#1a1a1a] text-white' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="搜索精选插件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-[#008060] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* 插件矩阵网络 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => {
              const IconComp = appIcons[app.iconName] || MessageSquare;
              return (
                <div 
                  key={app.id}
                  className="bg-white rounded-lg border border-[#e3e3e3] p-4 flex flex-col justify-between hover:border-[#008060]/50 hover:shadow-2xs transition-all duration-150"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded bg-[#1a1a1a] flex items-center justify-center text-white shrink-0">
                          <IconComp className="w-4 h-4 text-[#008060]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-neutral-900 leading-none flex items-center gap-1.5">
                            <span>{app.name}</span>
                            {app.isInstalled && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-pulse"></span>
                            )}
                          </h3>
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">{app.developer}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-[#008060] bg-[#e6f2ee] px-1.5 py-0.5 rounded border border-[#b3dccf] font-mono">
                        <Star className="w-2.5 h-2.5 fill-[#008060] text-[#008060]" />
                        <span>{app.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-semibold text-[#008060] bg-[#e6f2ee] px-2 py-0.5 rounded inline-block">
                        {getCategoryLabel(app.category)}
                      </span>
                      <p className="text-[11px] text-neutral-500 leading-relaxed pt-1 min-h-[3rem]">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    {app.isInstalled ? (
                      <>
                        <span className="text-[10px] text-[#008060] font-bold bg-[#e6f2ee] px-1.5 py-0.5 rounded border border-[#b3dccf]">已部署</span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => {
                              uninstallApp(app.id);
                              showToast(`已成功注销并停止运行：${app.name}`);
                            }}
                            className="px-2 py-1 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-[10px] rounded-lg cursor-pointer transition-colors"
                          >
                            卸载
                          </button>
                          <button
                            onClick={() => setCurrentTab(`app-${app.id}`)}
                            className="px-3 py-1 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors flex items-center space-x-1 shadow-2xs"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>配置控制</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] text-neutral-400">免费极速部署</span>
                        <button
                          onClick={() => {
                            installApp(app.id);
                            showToast(`部署成功！已启用了 “${app.name}” 插件，现可通过侧栏菜单进行精细化管控。`);
                          }}
                          className="px-3.5 py-1 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-semibold text-[10px] rounded-lg cursor-pointer transition-all shadow-2xs flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>一键部署</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* 独立精修插件设置工作台：深度对齐黑白+品牌绿，去掉废话，操作无死角 */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e3e3e3] pb-3 gap-3 bg-white p-4 rounded-lg border border-[#e3e3e3]">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setCurrentTab('appstero')}
                className="p-1 px-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
              >
                <ArrowLeft className="w-3 h-3 text-neutral-500" />
                <span className="font-semibold text-[10px]">返回生态大盘</span>
              </button>
              
              <div className="flex items-center space-x-2 bg-neutral-50 pr-3.5 rounded-lg border border-neutral-100">
                <div className="w-8 h-8 bg-[#1a1a1a] text-white flex items-center justify-center rounded-l shadow-xs">
                  {React.createElement(appIcons[activeApp?.iconName || 'MessageSquare'] || MessageSquare, { className: 'w-4 h-4 text-[#008060]' })}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 pl-2">
                    <h1 className="text-xs font-bold text-neutral-900">{activeApp?.name}</h1>
                    <span className="px-1 py-0.1 bg-[#e6f2ee] text-[#008060] text-[8px] rounded font-mono font-bold">运行中</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeApp) {
                  uninstallApp(activeApp.id);
                  setCurrentTab('appstero');
                  showToast(`已彻底关闭并物理注销 “${activeApp.name}” 的接口连结。`);
                }
              }}
              className="px-2.5 py-1 border border-neutral-200 text-neutral-500 hover:text-red-750 hover:bg-red-50 text-[10px] rounded-lg cursor-pointer transition-colors"
            >
              一键物理注销
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              
              {/* 插件1: 汇率换算器 (FX Converter) */}
              {activeAppId === 'fx-converter' && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#e3e3e3]">
                  <div className="border-b border-neutral-150 pb-2.5">
                    <h2 className="text-xs font-bold text-neutral-900">💱 汇率对账基础精算环境</h2>
                    <p className="text-[10px] text-neutral-500 mt-0.5">以欧元 (EUR) 为基准本币，自动化对齐和测试结算。如果调整后需要更新网店，请点击保存汇率。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-550 font-mono uppercase">1 EUR 兑 人民币 (CNY)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={activeApp?.config?.eurToCny || 7.82}
                        onChange={(e) => updateAppConfig('fx-converter', { eurToCny: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 font-mono font-bold focus:ring-1 focus:ring-[#008060] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-550 font-mono uppercase">1 EUR 兑 美元 (USD)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={activeApp?.config?.eurToUsd || 1.09}
                        onChange={(e) => updateAppConfig('fx-converter', { eurToUsd: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 font-mono font-bold focus:ring-1 focus:ring-[#008060] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-550 font-mono uppercase">1 EUR 兑 英镑 (GBP)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={activeApp?.config?.eurToGbp || 0.85}
                        onChange={(e) => updateAppConfig('fx-converter', { eurToGbp: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 font-mono font-bold focus:ring-1 focus:ring-[#008060] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1 border-t border-neutral-100 mt-2">
                    <input 
                      type="checkbox" 
                      id="autoSync" 
                      checked={activeApp?.config?.autoSync ?? true}
                      onChange={(e) => updateAppConfig('fx-converter', { autoSync: e.target.checked })}
                      className="rounded border-neutral-300 text-[#008060] focus:ring-[#008060] w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="autoSync" className="text-[11px] text-neutral-600 cursor-pointer">
                      自动连结欧洲央行公共大市进行每小时自动对账
                    </label>
                  </div>

                  {/* 汇率沙盒 */}
                  <div className="bg-[#f6f6f7] p-3 rounded-lg border border-neutral-200 font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-semibold text-neutral-500">汇率结算计算器 (模拟环境)</span>
                      <span className="text-[8px] bg-[#e6f2ee] text-[#008060] font-bold px-1.5 rounded uppercase">自动连通</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-1/3">
                        <span className="absolute left-2.5 top-2 text-xs text-neutral-450 font-bold">€</span>
                        <input 
                          type="number" 
                          value={fxTestVal}
                          onChange={(e) => setFxTestVal(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-lg py-1.5 pl-6 pr-2 text-xs focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                        />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="bg-white p-1 rounded-lg border border-neutral-150 text-center">
                          <span className="block text-[8px] text-neutral-400 font-bold">人民币 (CNY)</span>
                          <span className="font-bold text-xs text-neutral-850">
                            {((parseFloat(fxTestVal) || 0) * (activeApp?.config?.eurToCny || 7.82)).toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-white p-1 rounded-lg border border-neutral-150 text-center">
                          <span className="block text-[8px] text-neutral-400 font-bold">美元 (USD)</span>
                          <span className="font-bold text-xs text-neutral-850">
                            {((parseFloat(fxTestVal) || 0) * (activeApp?.config?.eurToUsd || 1.09)).toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-white p-1 rounded-lg border border-neutral-150 text-center">
                          <span className="block text-[8px] text-neutral-400 font-bold">英镑 (GBP)</span>
                          <span className="font-bold text-xs text-neutral-850">
                            {((parseFloat(fxTestVal) || 0) * (activeApp?.config?.eurToGbp || 0.85)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => showToast('核心兑换结算设置已完全保存并推至展示前端！')}
                      className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      保存汇率设定
                    </button>
                  </div>
                </div>
              )}

              {/* 插件2: 客流实时气泡 (Live Chat Bubble) */}
              {activeAppId === 'live-bubble' && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#e3e3e3]">
                  <div className="border-b border-neutral-150 pb-2.5">
                    <h2 className="text-xs font-bold text-neutral-900">💬 客流气泡外观与预置调解</h2>
                    <p className="text-[10px] text-neutral-500 mt-0.5">控制放置于前台展示网店右下角的智能微聊天框，随时在线为尊贵顾客保驾护航。</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-450 block">气泡问候寄语</label>
                      <input
                        type="text"
                        value={activeApp?.config?.greetingMsg || ''}
                        onChange={(e) => updateAppConfig('live-bubble', { greetingMsg: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#008060]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-450 block">调配品牌色系</label>
                        <div className="flex items-center space-x-2">
                          {['#008060', '#111111', '#6d7175'].map((col, idx) => {
                            const labels = ['品牌经典绿', '无极深邃黑', '典雅矿物灰'];
                            return (
                              <button
                                key={col}
                                onClick={() => {
                                  updateAppConfig('live-bubble', { bubbleColor: col });
                                  showToast(`配带聊天外观主色调已更改为: ${labels[idx]}`);
                                }}
                                className="px-2 py-1.5 border border-neutral-200 hover:border-[#008060] rounded-lg bg-white text-[10px] font-semibold flex items-center space-x-1.5 cursor-pointer transition-all"
                              >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }}></span>
                                <span>{labels[idx]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-3">
                        <input 
                          type="checkbox" 
                          id="showAvatar" 
                          checked={activeApp?.config?.showAvatar ?? true}
                          onChange={(e) => updateAppConfig('live-bubble', { showAvatar: e.target.checked })}
                          className="rounded border-neutral-300 text-[#008060] focus:ring-[#008060] w-3.5 h-3.5 cursor-pointer"
                        />
                        <label htmlFor="showAvatar" className="text-[11px] text-neutral-600 cursor-pointer">
                          在前端显示客服虚拟微缩形象头像
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 聊天沙盒模拟 */}
                  <div className="border border-[#e3e3e3] rounded-lg overflow-hidden mt-3 shadow-2xs">
                    <div className="bg-[#1a1a1a] p-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#008060]"></span>
                        <span className="text-[10px] font-semibold">气泡会话实体预览</span>
                      </div>
                      <span className="text-[9px] text-neutral-450">已载入星火智能对答</span>
                    </div>

                    <div className="p-3 bg-[#f6f6f7] h-40 overflow-y-auto space-y-2 flex flex-col text-xs">
                      {chatMessages.map((m, idx) => (
                        <div 
                          key={idx} 
                          className={`max-w-[80%] rounded-lg p-2 text-[11px] leading-relaxed ${
                            m.sender === 'agent' 
                              ? 'bg-[#e3e3e3] text-neutral-800 self-start' 
                              : 'bg-[#008060] text-white self-end'
                          }`}
                        >
                          {m.text}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="text-[9px] text-neutral-500 self-start flex items-center space-x-1 font-mono italic">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          <span>助理正在组织语言...</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-neutral-205 bg-white p-2.5 flex items-center space-x-1.5">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="模拟顾问输入（例如：推荐尺码、支持退货等）..."
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                      <button 
                        onClick={handleSendChat}
                        className="p-1 px-3 py-1.5 text-xs bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold rounded-lg cursor-pointer transition-transform active:scale-95 flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>发送</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 插件3: 智能出站挽留 (StayPop) */}
              {activeAppId === 'exit-intent' && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                  <div className="border-b border-neutral-150 pb-2.5">
                    <h2 className="text-xs font-bold text-neutral-900">🎁 智能留客促单拦截配置</h2>
                    <p className="text-[10px] text-neutral-400 mt-0.5">自动甄别鼠标滑离以及快速关闭标签等流失路径，瞬发高转化贵客定制券。</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 block">出站拦截主标语</label>
                        <input 
                          type="text" 
                          value={activeApp?.config?.popupTitle || ''}
                          onChange={(e) => updateAppConfig('exit-intent', { popupTitle: e.target.value })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 text-xs text-neutral-900 font-bold focus:ring-1 focus:ring-[#008060] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400 block">高定促单优惠面值 (%)</label>
                        <input 
                          type="number" 
                          value={activeApp?.config?.discountAmount || 15}
                          onChange={(e) => updateAppConfig('exit-intent', { discountAmount: parseInt(e.target.value) || 15 })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 text-xs text-neutral-900 font-mono focus:ring-1 focus:ring-[#008060] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-450 block">预设定核销代码 (优惠券码)</label>
                      <input 
                        type="text" 
                        value={activeApp?.config?.discountCode || ''}
                        onChange={(e) => updateAppConfig('exit-intent', { discountCode: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-neutral-900 font-mono font-bold"
                      />
                    </div>

                    <div className="bg-neutral-50 rounded p-3 border border-neutral-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-bold text-neutral-800">沙盘测试：出站实测拦截预览</h4>
                        <p className="text-[10px] text-neutral-400">点击右侧一键唤出，测试前台弹框美学配对状态。</p>
                      </div>
                      <button
                        onClick={() => setShowExitIntentSim(true)}
                        className="px-3 py-1 bg-neutral-900 hover:bg-black text-white font-bold text-[10px] rounded cursor-pointer transition-all flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>模拟拦截弹出</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 插件4: 一键物流发货 (Courier Sync) */}
              {activeAppId === 'smart-courier' && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#e3e3e3]">
                  <div className="border-b border-neutral-150 pb-2.5">
                    <h2 className="text-xs font-bold text-neutral-900">📦 物流单证批量履约控制台</h2>
                    <p className="text-[10px] text-neutral-500 mt-0.5">直接打通大盘已授权订单流水。可自定义选择订单，生成出境保价托托运面单。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-450 block">保税默认托运方</label>
                      <select 
                        value={carrierType}
                        onChange={(e) => setCarrierType(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#008060]"
                      >
                        <option value="DHL">DHL 欧洲航空速运</option>
                        <option value="FedEx">FedEx 跨太平洋联运</option>
                        <option value="SF">顺丰全港保价专线</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-450 block">默认寄件人保税仓地址</label>
                      <input 
                        type="text" 
                        value={activeApp?.config?.senderAddress || ''}
                        onChange={(e) => updateAppConfig('smart-courier', { senderAddress: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#008060]"
                      />
                    </div>
                  </div>

                  {/* 待打单订单流水 */}
                  <div className="space-y-2 mt-2">
                    <span className="text-[9px] font-bold text-neutral-450 block font-mono">待履行流水 (未发货订单)</span>
                    
                    <div className="border border-[#e3e3e3] rounded-lg overflow-hidden bg-neutral-50">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-150/50 border-b border-neutral-200 text-neutral-500 font-medium text-[10px]">
                            <th className="p-2 w-10">选择</th>
                            <th className="p-2">订单代号</th>
                            <th className="p-2">收件人</th>
                            <th className="p-2">金额</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.filter(o => o.fulfillmentStatus === 'unfulfilled').length > 0 ? (
                            orders.filter(o => o.fulfillmentStatus === 'unfulfilled').map(o => (
                              <tr key={o.id} className="border-b border-neutral-150 hover:bg-neutral-100/50">
                                <td className="p-2">
                                  <input 
                                    type="checkbox"
                                    checked={selectedOrderIds.includes(o.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedOrderIds(prev => [...prev, o.id]);
                                      else setSelectedOrderIds(prev => prev.filter(id => id !== o.id));
                                    }}
                                    className="w-3.5 h-3.5 text-[#008060] rounded focus:ring-[#008060] cursor-pointer"
                                  />
                                </td>
                                <td className="p-2 font-mono font-bold text-neutral-700">{o.name}</td>
                                <td className="p-2 font-medium">{o.customerName}</td>
                                <td className="p-2 font-mono font-semibold text-[#008060]">€ {o.total}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-5 text-center text-neutral-400 text-xs">前台暂无未发货订单流水。</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-neutral-400 font-bold font-mono">已勾选 {selectedOrderIds.length} 笔未履订单</span>
                      <button
                        onClick={handleFulfillOrders}
                        className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold text-[11px] rounded-lg transition-transform active:scale-97 cursor-pointer shadow-2xs"
                      >
                        一键批量承运打单
                      </button>
                    </div>
                  </div>

                  {/* 面单输出打印机 */}
                  {printLabel && (
                    <div className="bg-white rounded-lg border-2 border-neutral-900 p-4 font-mono text-[10px] leading-relaxed max-w-md mx-auto space-y-2 mt-4 relative shadow-md">
                      <div className="absolute right-3 top-3 text-[18px] font-black text-[#008060] border-2 border-[#008060] p-1 rounded-sm rotate-12 select-none uppercase tracking-widest text-[9px]">已保价</div>
                      <div className="border-b-2 border-neutral-900 pb-2 flex items-center justify-between">
                        <span className="text-sm font-black text-white bg-black px-1.5 rounded-xs">{printLabel.carrier}航空跨境面单</span>
                        <span>{printLabel.date}</span>
                      </div>
                      <div className="space-y-1 text-neutral-700">
                        <p><strong>跟踪面单单号:</strong> <span className="font-bold underline text-neutral-900">{printLabel.trackingNumber}</span></p>
                        <p><strong>出货商户:</strong> {printLabel.shipper}</p>
                        <p><strong>托投专柜:</strong> {printLabel.orderName}</p>
                        <p><strong>收货贵客:</strong> {printLabel.customerName}</p>
                      </div>
                      <div className="border-t border-dashed border-neutral-300 pt-1 flex justify-between text-neutral-400 text-[8px] font-bold">
                        <span>系统承载物流对齐对端完毕</span>
                        <span>Atelier OS Appstero Core</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 插件5: 星火智能文案 (Brainiac AI) */}
              {activeAppId === 'ai-writer' && (
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#e3e3e3]">
                  <div className="border-b border-neutral-150 pb-2.5">
                    <h2 className="text-xs font-bold text-neutral-900">✨ 智能货描述文案造办处</h2>
                    <p className="text-[10px] text-neutral-500 mt-0.5">选取您的货源商品，并即时一键生成极具品格深度的极简中文流丽商详描述。</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450 block">选取商品原型</label>
                        <select 
                          value={aiSelectedProductId}
                          onChange={(e) => setAiSelectedProductId(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#008060] focus:outline-none text-neutral-900 font-semibold"
                        >
                          <option value="">-- 请选择上架货品 --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450 block">拟定文本调性风格</label>
                        <select 
                          value={aiStyle}
                          onChange={(e) => setAiStyle(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#008060] focus:outline-none text-neutral-900 font-semibold"
                        >
                          <option value="editorial_noir">黑白静奢画廊风 (Editorial)</option>
                          <option value="hyper_minimal">包豪斯硬直物理解构 (Minimalist)</option>
                          <option value="street_brutalist">解构大英粗粝街头 (Brutalist)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleGenerateCopy}
                        disabled={aiGenerating}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition-all active:scale-97 shrink-0 cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        {aiGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#008060]" />
                            <span>模型提炼文思中...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#008060] animate-pulse" />
                            <span>一键提炼高级商详描述</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 文案展示框 */}
                    {aiGeneratedCopy && (
                      <div className="bg-[#f6f6f7] rounded-lg border border-neutral-200 p-3.5 text-xs whitespace-pre-wrap leading-relaxed border-[#e3e3e3]">
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 mb-2">
                          <span className="text-[9px] font-bold text-[#008060] font-mono uppercase">星火专属生成段</span>
                          <span className="text-[8px] text-neutral-400 font-mono">长度自适应平衡中</span>
                        </div>
                        <p className="text-neutral-800 text-[11px] leading-loose">{aiGeneratedCopy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: APP DEPLOYMENT INFO / QUICK TUTORIAL */}
            <div className="space-y-4">
              <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg">
                <h3 className="text-xs font-bold text-neutral-900 flex items-center space-x-1.5 border-b border-neutral-100 pb-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-[#008060]" />
                  <span>关于插件部署声明</span>
                </h3>
                
                <ul className="text-[11px] text-neutral-500 leading-relaxed space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#008060] font-bold mr-1.5">●</span>
                    <span>所有插件配置皆实时生效，直接绑定至您的商铺数据库与商品中心展示界面。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#008060] font-bold mr-1.5">●</span>
                    <span>已卸载卸载或物理注销的组件，将立刻清空前端网店注入的自定义代码快。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#008060] font-bold mr-1.5">●</span>
                    <span>如果在使用中遇到任何疑问，请随时连结在线大脑进行精细化对答。</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1a1a1a] text-white p-4 rounded-lg space-y-2.5">
                <span className="text-[9px] font-bold text-[#008060] font-mono tracking-widest uppercase block">高精生态赋能</span>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Appstero 云插件可以完美与多栏面板（1-Column, 2-Column, 3-Column）架构级联沟通，零损耗在手机大屏、平板便携端、以及桌面办公进行自适应排线。
                </p>
                <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-500 font-black">
                  <span>商物操作系统</span>
                  <span>版本 V1.4.0</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STAYPOP 智能拦截实况全景覆盖弹窗（双层防护，无死角模拟） */}
      {showExitIntentSim && (
        <div className="fixed inset-0 bg-[#111]/80 backdrop-blur-xs flex items-center justify-center z-55 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg border border-[#e3e3e3] p-6 max-w-md w-full relative shadow-2xl space-y-4 text-center">
            <button 
              onClick={() => setShowExitIntentSim(false)}
              className="absolute right-3.5 top-3.5 p-1 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-[#e6f2ee] text-[#008060] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-900">{activeApp?.config?.popupTitle || '留步，赠您专属减免折扣 💎'}</h3>
              <p className="text-[11px] text-neutral-500">别和心仪的孤品擦肩而过。为了致敬您对极简美学的追寻，专属派发专属保留核扣优惠。</p>
            </div>

            <div className="bg-[#f6f6f7] p-4 rounded-lg border border-neutral-200 border-dashed space-y-1 font-mono">
              <span className="block text-[8px] text-neutral-400 font-bold uppercase">立减核销密匙</span>
              <span className="block text-lg font-black text-[#008060] tracking-wider font-mono">{activeApp?.config?.discountCode || 'STAY15'}</span>
              <span className="block text-[10px] text-neutral-400 font-bold">付款时键入即可无门槛立享 {activeApp?.config?.discountAmount || 15}% 返现减免</span>
            </div>

            <button 
              onClick={() => {
                setShowExitIntentSim(false);
                showToast('🔑 贵宾扣减代金券已自动复制到您的付款账单。');
              }}
              className="w-full py-2.5 bg-[#1a1a1a] hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition-transform active:scale-97 cursor-pointer shadow-sm flex items-center justify-center space-x-1"
            >
              <Check className="w-4 h-4 text-[#008060]" />
              <span>立即复制并继续臻选</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
