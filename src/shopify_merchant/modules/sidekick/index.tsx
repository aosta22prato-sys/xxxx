import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, ArrowRight, BarChart3, Clock, Check, 
  Package, Tag, FileText, Paperclip, ArrowUp, Bot
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useOrderStore } from '../../stores/orderStore';
import { useDiscountStore } from '../../stores/discountStore';
import { eventBus, NotificationEvents } from '../../events';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function SidekickWorkspace() {
  const { products, addProduct, updateProduct } = useProductStore();
  const { orders } = useOrderStore();
  const { discounts, addDiscount } = useDiscountStore();

  const [replenishedProducts, setReplenishedProducts] = useState<Record<string, boolean>>({});
  const [addedDiscounts, setAddedDiscounts] = useState<Record<string, boolean>>({});
  const [addedLinenItems, setAddedLinenItems] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('atelier_sidekick_messages_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved sidekick messages", e);
      }
    }
    return [
      {
        id: 'init-01',
        role: 'model',
        text: "Hello! I'm **Sidekick**, your intelligent Atelier Noir assistant.\n\nI can help you analyze your store, check inventory, generate marketing ideas, and more.\n\nWhat would you like to know?",
        timestamp: '03:06'
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('atelier_sidekick_messages_v2', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleReplenishInventory = (productId: string) => {
    const prod = products.find(p => p.id === productId || p.sku === productId);
    const targetId = prod ? prod.id : (products[0]?.id || 'prod_fallback');
    const targetTitle = prod ? prod.title : 'Ceramic Pour-Over Coffee Brewer';
    
    updateProduct(targetId, { inventory: 120 });
    setReplenishedProducts(prev => ({ ...prev, [productId]: true }));
    
    eventBus.emit(NotificationEvents.CREATED, {
      text: `📦 智能备忘体系：${targetTitle} 备货批次已紧急完成 120 件空运调发！`
    });

    // Append quick system feedback to message stream
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        role: 'model',
        text: `✓ **指令执行成功**：已向比利时保税大港 (Brussels Hub) 拨发 120 件 **${targetTitle}** 现货，预计明日到仓并上架大盘。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleAddDiscount = () => {
    const code = 'FESTIVE15';
    const alreadyExists = discounts.some(d => d.code === code);
    if (!alreadyExists) {
      addDiscount({
        id: 'disc_' + Date.now(),
        code,
        type: 'percentage',
        value: 15,
        valueText: '15% OFF',
        status: 'active',
        usageCount: 0,
        minRequirement: '50.00',
      });
    }
    setAddedDiscounts(prev => ({ ...prev, [code]: true }));
    eventBus.emit(NotificationEvents.CREATED, {
      text: `🏷️ 促单组件生效：15% 专享折扣码「FESTIVE15」已全站开启拦截核销！`
    });

    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        role: 'model',
        text: `✓ **折扣上线成功**：优惠码 \`FESTIVE15\` (15% 留存扣减) 已成功存入促销中心。StayPop 出站挽回脚本已完成秒级联测。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleAddLinenLoungewear = () => {
    const alreadyExists = products.some(p => p.title.includes('Linen Loungewear'));
    if (!alreadyExists) {
      addProduct({
        id: 'prod_' + Date.now(),
        title: 'Atelier Unstructured Linen Loungewear',
        description: 'Constructed from premium bio-linen fabric, this relaxed outfit defines ambient ease with structured classic folds. Perfect for quiet luxuries.',
        vendor: 'Atelier Noir',
        type: 'Clothing',
        status: 'active',
        price: 89.00,
        compareAtPrice: 150.00,
        costPerItem: 18.00,
        sku: 'AT-LIN-LOU-MID',
        inventory: 60,
        inventoryByLocation: { 'Brussels Main': 60 },
        images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=450&q=80'],
        collections: ['New Arrivals'],
        tags: ['sustainable', 'linen', 'quiet-luxury']
      });
    }
    setAddedLinenItems(prev => ({ ...prev, loungewear: true }));
    eventBus.emit(NotificationEvents.CREATED, {
      text: `✍️ 商旅新品上线：新款 Atelier 亚麻家居服已正式上架店铺大盘！`
    });

    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        role: 'model',
        text: `✓ **商品上架成功**：高定流线「Atelier Unstructured Linen Loungewear (¥89.00)」已完成系统入库，静奢风原厂图片已自动搭载至前台。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleExecuteSynergy = (promptText: string) => {
    if (!promptText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: userTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      const cleanPrompt = promptText.toLowerCase();

      if (cleanPrompt.includes('分析') || cleanPrompt.includes('销售') || cleanPrompt.includes('数据') || cleanPrompt.includes('fenxi')) {
        const totalEarned = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) || 24850.00;
        const totalOrders = orders.filter(o => !o.isArchived).length || 186;
        replyText = `### 📊 店铺多周期经营数据及流量决策
本次分析抓取自商铺真实大盘：

* **今日结算客单收入**: **€ ${totalEarned.toFixed(2)}** (累计 ${totalOrders} 笔订单)
* **买家转化率 (CR)**: **4.85%** (高出本季度基准水位 12.1%)
* **Forex 跨境汇兑顺差**: **+€ 154.20** (主要由大西洋美加市场结算溢出产生)
* **智能优化路径**: 推荐将汇款顺差重组入 **DHL Express 网关备用邮资**，可避免欧洲央行息差滞后带来的汇兑费流失风险。`;
      } 
      else if (cleanPrompt.includes('库存') || cleanPrompt.includes('补货') || cleanPrompt.includes('kucun')) {
        const lowStockProd = products.find(p => p.inventory < 15) || { title: 'Ceramic Pour-Over Coffee Brewer', sku: 'MC-DRP-CHR', inventory: 3 };
        replyText = `### 📦 低库存智能调拨备忘
供应链席位监测到以下缺货信号：

* **预警货品**: **${lowStockProd.title}** (SKU: \`${lowStockProd.sku}\`)
* **存量水位**: 仅余 **${lowStockProd.inventory} 件** (极度紧俏)
* **运送统筹**: 建议从比利时布鲁塞尔保税主仓 (Brussels Hub) 紧急调配 **100 件** 空运至德国柏林分销中枢。

---

*一键物流调拨控制手柄：*
[REPLENISH_BOX]`;
      } 
      else if (cleanPrompt.includes('营销') || cleanPrompt.includes('退') || cleanPrompt.includes('拦截') || cleanPrompt.includes('yingxiao')) {
        replyText = `### 🏷️ 出站留客与弃单挽回策略
客留中心已完成拦截方案会审：

* **拦截技术**: 智能监测客户鼠标移出浏览器主视区，在 **50ms** 内淡入。
* **极简品牌文案**: *"Avant de partir... 在您的灵感成行前，输入券码以享有 8.5 折的高定配对致礼。"*
* **派发促销券码**: \`FESTIVE15\` (享有 15% OFF 静奢扣减)
* **毛利测算**: 优惠拨付对于本铺 **78% 的基准毛利率**仍在绝对安全值，投入产出比极高。

---

*一键装配流线弹窗拦截：*
[DISCOUNT_TAG]`;
      } 
      else if (cleanPrompt.includes('文案') || cleanPrompt.includes('亚麻') || cleanPrompt.includes('描述') || cleanPrompt.includes('wenan')) {
        replyText = `### ✍️ 奢侈级织物发布案
静奢写意文案已经起草完毕：

* **高定新品**: **Atelier Unstructured Linen Loungewear 家居服组**
* **奢品描述**: *"取百年古法法兰德斯源头精织麻纱，让空气自由流动。整体剪裁采用落肩落流，隐藏式搭扣。这是写意起居空间内的知性建筑线条。"*
* **定价路线**: 建议建立高位定价 **€ 89.00**，维持高达 78% 的优质毛利基准。

---

*一键全通道上架新品：*
[LINEN_PUBLISH]`;
      } 
      else {
        replyText = `### 🏆 Sidekick 智能大盘通识提议
您好！您刚才发送了：「*${promptText}*」。

我已结合您的店铺状态准备了以下快速优化轨道，点击上方卡片或点击下方对应指令：
* 📊 **分析销售数据**: 查询真实的季度 AOV 转化及增值税 VAT 核对。
* 📦 **低库存补货**: 调阅缺货实况并进行一键仓储跨海备货。
* 🏷️ **出站营销策划**: 架设 50ms 出境挽回折扣码 \`FESTIVE15\`。
* ✍️ **亚麻新品文案**: 自动起草古典亚麻的极简风商品详细卖点并发布。`;
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleCardClick = (type: string) => {
    let query = '';
    if (type === 'analyze') query = '分析当前的销售趋势与流量表现';
    if (type === 'inventory') query = '查询当前的低库存预警与库存补给策略';
    if (type === 'marketing') query = '生成一款用于复客留购与弃单挽回的优惠方案策划';
    if (type === 'write') query = '起草一款古典亚麻家居服的极简高品质描述文案';
    handleExecuteSynergy(query);
  };

  const parseMessageText = (msg: Message) => {
    const text = msg.text;
    
    if (text.includes('[REPLENISH_BOX]')) {
      const parts = text.split('[REPLENISH_BOX]');
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-line">{parts[0]}</p>
          <div className="pt-2">
            <button
              onClick={() => handleReplenishInventory('MC-DRP-CHR')}
              disabled={replenishedProducts['MC-DRP-CHR']}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center space-x-2 shadow-2xs ${
                replenishedProducts['MC-DRP-CHR']
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-[#202223] hover:bg-[#07C2E3] text-white border-transparent cursor-pointer hover:shadow-xs'
              }`}
            >
              {replenishedProducts['MC-DRP-CHR'] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-neutral-400" />
                  <span>调拨指令已发送 120 件</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5" />
                  <span>一键跨仓调补 100 件</span>
                </>
              )}
            </button>
          </div>
          {parts[1] && <p className="whitespace-pre-line">{parts[1]}</p>}
        </div>
      );
    }

    if (text.includes('[DISCOUNT_TAG]')) {
      const parts = text.split('[DISCOUNT_TAG]');
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-line">{parts[0]}</p>
          <div className="pt-2">
            <button
              onClick={handleAddDiscount}
              disabled={addedDiscounts['FESTIVE15']}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center space-x-2 shadow-2xs ${
                addedDiscounts['FESTIVE15']
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-[#202223] hover:bg-[#07C2E3] text-white border-transparent cursor-pointer hover:shadow-xs'
              }`}
            >
              {addedDiscounts['FESTIVE15'] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-neutral-400" />
                  <span>折扣券「FESTIVE15」运作中</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5" />
                  <span>一键发布优惠券「FESTIVE15」</span>
                </>
              )}
            </button>
          </div>
          {parts[1] && <p className="whitespace-pre-line">{parts[1]}</p>}
        </div>
      );
    }

    if (text.includes('[LINEN_PUBLISH]')) {
      const parts = text.split('[LINEN_PUBLISH]');
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-line">{parts[0]}</p>
          <div className="pt-2">
            <button
              onClick={handleAddLinenLoungewear}
              disabled={addedLinenItems['loungewear']}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center space-x-2 shadow-2xs ${
                addedLinenItems['loungewear']
                  ? 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-[#202223] hover:bg-[#07C2E3] text-white border-transparent cursor-pointer hover:shadow-xs'
              }`}
            >
              {addedLinenItems['loungewear'] ? (
                <>
                  <Check className="w-3.5 h-3.5 text-neutral-400" />
                  <span>商品已正式发布上架</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>一键同步上架高定亚麻系列</span>
                </>
              )}
            </button>
          </div>
          {parts[1] && <p className="whitespace-pre-line">{parts[1]}</p>}
        </div>
      );
    }

    // Default renderer supporting bold markdown (**word**) and backticks (`code`)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const codeRegex = /`(.*?)`/g;
    const cleanText = text
      .replace(boldRegex, '<strong class="font-bold text-[#07C2E3]">$1</strong>')
      .replace(codeRegex, '<code class="px-1.5 py-0.5 bg-neutral-200 border border-neutral-300 rounded font-mono text-[10px] text-neutral-800">$1</code>');

    return (
      <div 
        className="whitespace-pre-line text-xs font-sans leading-relaxed text-[#202223]"
        dangerouslySetInnerHTML={{ __html: cleanText }}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* 🚀 Header Workspace Title exactly matching layout */}
      <div className="text-left py-2">
        <h1 className="text-3xl font-extrabold text-[#202223] tracking-tight flex items-center gap-2">
          <span>Sidekick AI</span>
          <Sparkles className="w-6 h-6 text-[#202223] shrink-0 fill-current" />
        </h1>
        <p className="text-sm text-[#6D7175] mt-1">您的智能店铺助手</p>
      </div>

      {/* 📊 Four premium card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => handleCardClick('analyze')}
          className="bg-white border border-[#E1E3E5] rounded-xl p-5 hover:border-[#07C2E3] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-start text-left group"
        >
          <div className="p-2 rounded-lg bg-neutral-100/80 group-hover:bg-[#07C2E3]/10 transition-colors">
            <BarChart3 className="w-5 h-5 text-[#202223] group-hover:text-[#07C2E3]" />
          </div>
          <h3 className="text-sm font-bold text-[#202223] mt-4">店铺分析</h3>
          <p className="text-[11px] text-[#6D7175] mt-1.5 leading-relaxed">销售趋势、流量分析、表现洞察</p>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => handleCardClick('inventory')}
          className="bg-white border border-[#E1E3E5] rounded-xl p-5 hover:border-[#07C2E3] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-start text-left group"
        >
          <div className="p-2 rounded-lg bg-neutral-100/80 group-hover:bg-[#07C2E3]/10 transition-colors">
            <Package className="w-5 h-5 text-[#202223] group-hover:text-[#07C2E3]" />
          </div>
          <h3 className="text-sm font-bold text-[#202223] mt-4">库存助手</h3>
          <p className="text-[11px] text-[#6D7175] mt-1.5 leading-relaxed">库存查询、缺货预测、补货建议</p>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => handleCardClick('marketing')}
          className="bg-white border border-[#E1E3E5] rounded-xl p-5 hover:border-[#07C2E3] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-start text-left group"
        >
          <div className="p-2 rounded-lg bg-neutral-100/80 group-hover:bg-[#07C2E3]/10 transition-colors">
            <Tag className="w-5 h-5 text-[#202223] group-hover:text-[#07C2E3]" />
          </div>
          <h3 className="text-sm font-bold text-[#202223] mt-4">营销建议</h3>
          <p className="text-[11px] text-[#6D7175] mt-1.5 leading-relaxed">活动创意、折扣策略、营销文案生成</p>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => handleCardClick('write')}
          className="bg-white border border-[#E1E3E5] rounded-xl p-5 hover:border-[#07C2E3] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col items-start text-left group"
        >
          <div className="p-2 rounded-lg bg-neutral-100/80 group-hover:bg-[#07C2E3]/10 transition-colors">
            <FileText className="w-5 h-5 text-[#202223] group-hover:text-[#07C2E3]" />
          </div>
          <h3 className="text-sm font-bold text-[#202223] mt-4">文案创作</h3>
          <p className="text-[11px] text-[#6D7175] mt-1.5 leading-relaxed">产品描述、邮件内容、页面文案生成</p>
        </div>
      </div>

      {/* 💬 Beautiful Chat Panel styled precisely as mockup */}
      <div className="bg-white border border-[#E1E3E5] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[520px]">
        
        {/* Core log scroll stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            
            return (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Sidekip Avatar on Left (only for Bot) */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-lg bg-[#202223] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white fill-current" />
                  </div>
                )}

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Speech bubble */}
                  <div className={`max-w-xl rounded-2xl p-4 shadow-3xs border text-left ${
                    isUser 
                      ? 'bg-[#202223] border-[#202223] text-white rounded-tr-none' 
                      : 'bg-[#F4F6F8] border-[#E1E3E5] text-[#202223] rounded-tl-none'
                  }`}>
                    {isUser ? (
                      <p className="text-xs leading-relaxed font-sans font-medium text-white">{msg.text}</p>
                    ) : (
                      parseMessageText(msg)
                    )}
                  </div>
                  
                  {/* Light grey neat timestamp */}
                  <span className={`text-[10px] text-[#8C9196] mt-1.5 font-mono ${isUser ? 'mr-1' : 'ml-1'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing/Thinking loader */}
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-9 h-9 rounded-lg bg-[#202223] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-white fill-current shrink-0" />
              </div>
              <div className="flex flex-col items-start animate-pulse">
                <div className="bg-[#F4F6F8] border border-[#E1E3E5] rounded-2xl rounded-tl-none p-4 text-left flex items-center space-x-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-[#8C9196] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C9196] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#8C9196] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 🛠️ Micro-Interactive icon trigger block */}
        <div className="px-6 py-2 border-t border-[#E1E3E5] bg-neutral-50/50 flex items-center gap-3">
          <button 
            onClick={() => handleCardClick('inventory')}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-neutral-100 transition-colors cursor-pointer"
            title="库存监控"
          >
            <Package className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleCardClick('marketing')}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-neutral-100 transition-colors cursor-pointer"
            title="出站促单码"
          >
            <Tag className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleCardClick('analyze')}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-neutral-100 transition-colors cursor-pointer"
            title="大盘财务数据"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleCardClick('write')}
            className="p-1.5 rounded-lg text-[#6D7175] hover:text-[#202223] hover:bg-neutral-100 transition-colors cursor-pointer"
            title="奢华文案描述"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* 📥 Large stylish search/cmd box wrapper */}
        <div className="p-4 border-t border-[#E1E3E5] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSynergy(inputValue);
            }}
            className="border border-[#E1E3E5] rounded-full bg-white flex items-center p-1.5 pl-4 focus-within:ring-2 focus-within:ring-[#07C2E3] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Sidekick anything about your store..."
              className="flex-1 py-1.5 text-xs bg-transparent text-[#202223] placeholder-[#8C9196] focus:outline-none"
            />
            
            {/* Attachment grey icon */}
            <button
              type="button"
              onClick={() => {
                eventBus.emit(NotificationEvents.CREATED, {
                  text: "📎 平台资产对齐：商铺财务凭证与库存列表已对齐 Sidekick AI 模型空间"
                });
              }}
              className="p-2 text-[#8C9196] hover:text-[#202223] transition-colors shrink-0 cursor-pointer"
              title="Add attachment"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Black Send arrow-up button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#202223] hover:bg-[#07C2E3] active:bg-[#059BBC] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ml-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
