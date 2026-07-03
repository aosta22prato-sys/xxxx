/**
 * Atelier Noir & Shopify Styled CRM Orders Hub
 * Clean black & white design with exact brand green highlights (#008060).
 * Highly interactive, single-language Chinese interface tailored for elite merchants.
 */

import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { usePanelStore } from '../../stores/panelStore';
import { useShopStore } from '../../stores/shopStore';
import { useProductStore } from '../../stores/productStore';
import { Order, OrderItem } from '../../types';
import { OrderEvents, NotificationEvents, eventBus } from '../../events';
import { MOCK_PRODUCT_SVGS } from '../../data/mockData';
import { 
  Search, ShieldAlert, BadgeInfo, Tag, Plus, CheckCircle, 
  ArrowLeft, Smartphone, Mail, Globe, Sparkles, Send, 
  Printer, ArrowRightLeft, Check, Compass, Trash2, Archive, 
  ChevronRight, CircleAlert, MoreHorizontal, User, Phone, 
  Clock, X, ArrowUpRight, Share2, Clipboard, FileText, CheckCircle2,
  SlidersHorizontal, Truck, Calendar, Activity, Cpu, Coins, Lock, RefreshCw, Radio, LayoutGrid, List
} from 'lucide-react';
import { useLayoutStore } from '../../stores/layoutStore';
import { GlassCard3D, CyberBadge, HoloViewport } from '../../components/3d-component-library';

// Pure Chinese labels for categories matching screenshot exactly
interface TabCategory {
  key: 'All' | 'pending' | 'unfulfilled' | 'fulfilled' | 'completed';
  label: string;
  count: number;
  icon: any;
}

export default function OrdersView() {
  const { orders, orderFilter, setOrderFilter, addOrder, updateOrder, deleteOrder } = useOrderStore();
  const { togglePreview } = usePanelStore();
  const { settings } = useShopStore();
  const { products } = useProductStore();

  // Input controller states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Standard layout view mode
  const [viewMode, setViewMode] = useState<'3d-grid' | 'table'>('table');
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isTwinScannerActive, setIsTwinScannerActive] = useState(true);

  // Tab category filter
  const [currentTab, setCurrentTab] = useState<'All' | 'pending' | 'unfulfilled' | 'fulfilled' | 'completed'>('All');
  const [aiFilterActive, setAiFilterActive] = useState<boolean>(false);

  // Quick Action Sheet overlay selectors
  const [actionMenuOrder, setActionMenuOrder] = useState<Order | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [shareModalOrder, setShareModalOrder] = useState<Order | null>(null);

  // Delivery Modal Fields
  const [carrier, setCarrier] = useState('DHL');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Creation / Form drawer
  const [isCreating, setIsCreating] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productId: '',
    price: '328.00',
    quantity: '1',
    notes: '',
    tags: [] as string[]
  });

  // Printing State
  const [printedOrder, setPrintedOrder] = useState<Order | null>(null);

  // Auto-enrich order dataset to have realistic high-end phone numbers and metadata on launch
  useEffect(() => {
    const updated = orders.map(o => {
      let changed = false;
      const copy = { ...o };
      if (!copy.customerPhone) {
        if (o.customerName.includes('Marcus')) copy.customerPhone = '138 0013 5689';
        else if (o.customerName.includes('Clara')) copy.customerPhone = '139 2041 2211';
        else if (o.customerName.includes('Soren')) copy.customerPhone = '137 3829 8890';
        else if (o.customerName.includes('Ada')) copy.customerPhone = '136 2294 3322';
        else copy.customerPhone = '135 1294 7710';
        changed = true;
      }
      if (!copy.tags) {
        if (o.customerName.includes('Marcus')) copy.tags = ['VIP'];
        else if (o.customerName.includes('Soren')) copy.tags = ['样品单'];
        else copy.tags = [];
        changed = true;
      }
      if (!copy.aiValue) {
        copy.aiValue = o.total > 200 ? '高价值客户' : '常规客户';
        changed = true;
      }
      if (!copy.aiRisk) {
        if (o.customerName.includes('Clara')) {
          copy.aiRisk = '同一客户24小时下单5次';
        } else {
          copy.aiRisk = '良好';
        }
        changed = true;
      }
      return copy;
    });

    const isSame = JSON.stringify(orders.map(o => o.customerPhone)) === JSON.stringify(updated.map(o => o.customerPhone));
    if (!isSame) {
      useOrderStore.getState().setOrders(updated);
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0 && !scannedOrder) {
      setScannedOrder(orders[0]);
    }
  }, [orders, scannedOrder]);

  // Handle Order Addition Safeguards
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerName) {
      eventBus.emit(NotificationEvents.CREATED, { text: '⚠️ 请输入买家尊姓大名' });
      return;
    }

    const priceNum = parseFloat(newOrderForm.price) || 120.00;
    const qtyNum = parseInt(newOrderForm.quantity) || 1;
    const matchedProd = products.find(p => p.id === newOrderForm.productId) || products[0] || {
      id: 'fallback-01',
      title: 'Waterproof Adventure Pack',
      price: 120.00,
      images: ['backpack']
    };

    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      name: `#${1020 + orders.length}`,
      customerName: newOrderForm.customerName,
      customerEmail: newOrderForm.customerEmail || 'client@ateliernoir.com',
      customerPhone: newOrderForm.customerPhone || '138 0000 0000',
      items: [
        {
          productId: matchedProd.id,
          title: matchedProd.title,
          quantity: qtyNum,
          price: priceNum,
          image: matchedProd.images[0] || 'backpack'
        }
      ],
      subtotal: priceNum * qtyNum,
      tax: Math.round(priceNum * qtyNum * 0.12 * 100) / 100,
      shipping: 20.00,
      total: priceNum * qtyNum + 20.00,
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      createdAt: '今天 14:32',
      notes: newOrderForm.notes,
      tags: newOrderForm.tags,
      aiRisk: '良好',
      aiValue: priceNum * qtyNum > 200 ? '高价值客户' : '常规客户'
    };

    addOrder(newOrd);
    eventBus.emit(OrderEvents.CREATED, newOrd);
    eventBus.emit(NotificationEvents.CREATED, { text: `✅ 订单 ${newOrd.name} 录入成功` });
    setIsCreating(false);
    
    // Reset fields
    setNewOrderForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      productId: '',
      price: '328.00',
      quantity: '1',
      notes: '',
      tags: []
    });
  };

  // Archive order
  const handleArchiveOrder = (orderId: string) => {
    updateOrder(orderId, { isArchived: true });
    eventBus.emit(NotificationEvents.CREATED, { text: '📁 该笔订单已安全归档，从主视区隐藏' });
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
    setActionMenuOrder(null);
  };

  // Toggle paid status
  const handleMarkAsPaid = (orderId: string) => {
    updateOrder(orderId, { paymentStatus: 'paid' });
    eventBus.emit(NotificationEvents.CREATED, { text: '✓ 订单清账完成，已记为支付到账' });
    setActionMenuOrder(null);
    const updated = orders.find(o => o.id === orderId);
    if (updated && selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: 'paid' });
    }
  };

  const handleQuickStatusChange = (orderId: string, type: 'finish' | 'archive' | 'unfulfill') => {
    if (type === 'unfulfill') {
      updateOrder(orderId, { fulfillmentStatus: 'unfulfilled', carrier: undefined, trackingNumber: undefined });
      eventBus.emit(NotificationEvents.CREATED, { text: '🔄 订单已重置为待发货、待指运状态' });
    } else if (type === 'finish') {
      updateOrder(orderId, { paymentStatus: 'paid' });
      eventBus.emit(NotificationEvents.CREATED, { text: '✓ 订单以商服渠道名义标记清算' });
    } else if (type === 'archive') {
      updateOrder(orderId, { isArchived: true });
      eventBus.emit(NotificationEvents.CREATED, { text: '📁 该单据已被隐藏归档' });
    }
  };

  // Execute Tracking Submission
  const handleFulfillOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    if (!trackingNumber.trim()) {
      eventBus.emit(NotificationEvents.CREATED, { text: '⚠️ 请正确录入承保物流运单号' });
      return;
    }

    updateOrder(trackingModalOrder.id, {
      fulfillmentStatus: 'fulfilled',
      carrier,
      trackingNumber
    });

    eventBus.emit(NotificationEvents.CREATED, { text: `✈ 成功标记发货！单号: ${trackingNumber}` });
    
    // Simulating auto shipment SMS alert dispatch
    setTimeout(() => {
      eventBus.emit(NotificationEvents.CREATED, { 
        text: `📲 物流提单已下发至 ${trackingModalOrder.customerPhone || '客户号码'}，通知短信已自动分发。` 
      });
    }, 1500);

    setTrackingModalOrder(null);
    setTrackingNumber('');
    setActionMenuOrder(null);
    if (selectedOrder?.id === trackingModalOrder.id) {
      setSelectedOrder({
        ...selectedOrder,
        fulfillmentStatus: 'fulfilled',
        carrier,
        trackingNumber
      });
    }
  };

  // Send Order notification trigger mimicking realistic messaging
  const handleSendNotification = (type: 'whatsapp' | 'email' | 'sms' | 'copy' | 'pdf', o: Order) => {
    const channelNames = {
      whatsapp: 'WhatsApp',
      email: 'Email 邮件',
      sms: '短信通道',
      copy: '剪贴板',
      pdf: 'PDF 账册'
    };

    setTimeout(() => {
      eventBus.emit(NotificationEvents.CREATED, {
        text: type === 'copy' 
          ? `📋 订单链接及格式单据已成功一键提取并收纳至剪贴板` 
          : `✉️ 成功连通系统专属发送端：订单通知确认书已发送至 ${channelNames[type]}`
      });
      setShareModalOrder(null);
    }, 800);
  };

  // Calculate high-fidelity metrics
  const totalCount = orders.filter(o => !o.isArchived).length;
  // Calculate category based counts
  const unpaidCount = orders.filter(o => !o.isArchived && o.paymentStatus === 'pending').length;
  const unfulfilledCount = orders.filter(o => !o.isArchived && o.fulfillmentStatus === 'unfulfilled').length;
  const fulfilledCount = orders.filter(o => !o.isArchived && o.fulfillmentStatus === 'fulfilled').length;
  const completedCount = orders.filter(o => !o.isArchived && o.paymentStatus === 'paid' && o.fulfillmentStatus === 'fulfilled').length;

  const categories: TabCategory[] = [
    { key: 'All', label: '全部', count: 128, icon: Archive }, // matches screenshot card counters verbatim
    { key: 'pending', label: '待付款', count: 12, icon: Clock },
    { key: 'unfulfilled', label: '待发货', count: 18, icon: Truck },
    { key: 'fulfilled', label: '已发货', count: 56, icon: CheckCircle },
    { key: 'completed', label: '已完成', count: 42, icon: CheckCircle2 }
  ];

  // Filters logic
  const filteredOrders = orders.filter(o => {
    if (o.isArchived) return false;

    // AI filter action click overrides
    if (aiFilterActive) {
      if (o.fulfillmentStatus !== 'unfulfilled') return false;
    }

    // Category selectors
    if (currentTab !== 'All') {
      if (currentTab === 'pending' && o.paymentStatus !== 'pending') return false;
      if (currentTab === 'unfulfilled' && o.fulfillmentStatus !== 'unfulfilled') return false;
      if (currentTab === 'fulfilled' && o.fulfillmentStatus !== 'fulfilled') return false;
      if (currentTab === 'completed' && (o.fulfillmentStatus !== 'fulfilled' || o.paymentStatus !== 'paid')) return false;
    }

    // Search query multi fields matcher
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const numMatch = o.name.toLowerCase().includes(q) || o.id.includes(q);
      const nameMatch = o.customerName.toLowerCase().includes(q);
      const emailMatch = o.customerEmail?.toLowerCase().includes(q);
      const phoneMatch = o.customerPhone?.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
      return numMatch || nameMatch || emailMatch || phoneMatch;
    }

    return true;
  });

  // Function to map key keys to aesthetic visual tags or luxury graphic shapes
  const renderProductBadge = (imgKey: string) => {
    // Beautiful premium shadows matching Atelier Noir
    const svgContent = MOCK_PRODUCT_SVGS[imgKey as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.backpack;
    return (
      <div 
        className="w-11 h-11 rounded-lg bg-neutral-50 border border-neutral-150 p-1 flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 transition-transform"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  };

  // Pure clean layout representing perfect Shopify details
  if (printedOrder) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-3xl p-8 my-6 space-y-6 shadow-xl animate-fadeIn text-neutral-900 font-sans select-none">
        <div className="flex justify-between items-start border-b border-neutral-100 pb-5">
          <div>
            <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs font-mono mb-2">AN</div>
            <h2 className="text-sm font-bold tracking-widest text-black uppercase font-mono">ATELIER NOIR</h2>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest">BOUTIQUE CRM SEED INVOICE</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest py-0.5 px-2 bg-neutral-150 text-neutral-800 rounded-full">INVOICE</span>
            <p className="text-sm font-bold text-neutral-900 mt-2 font-mono">结存账单: {printedOrder.name}</p>
            <p className="text-[11px] text-neutral-400 font-mono mt-1">发票日期: 明细记账</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-600">
          <div>
            <h4 className="font-bold text-neutral-900 border-b border-neutral-100 pb-1 mb-1.5">致阁下顾客</h4>
            <p className="text-neutral-950 font-bold">{printedOrder.customerName}</p>
            <p className="mt-0.5">{printedOrder.customerPhone}</p>
            <p className="mt-0.5">{printedOrder.customerEmail}</p>
          </div>
          <div className="text-right">
            <h4 className="font-bold text-neutral-900 border-b border-neutral-100 pb-1 mb-1.5">签发商户</h4>
            <p className="text-neutral-950 font-bold">Atelier Noir Online Studio</p>
            <p className="mt-0.5">services@ateliernoir.com</p>
          </div>
        </div>

        <div className="border border-neutral-150 rounded-xl overflow-hidden pb-1">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <th className="p-3">购货品目</th>
                <th className="p-3 text-center">数量</th>
                <th className="p-3 text-right">单价</th>
                <th className="p-3 text-right text-neutral-950">小计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {printedOrder.items.map((item, idx) => (
                <tr key={idx} className="text-neutral-800">
                  <td className="p-3 font-sans font-medium text-neutral-900">{item.title}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">€{item.price.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-neutral-900">€{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-end">
          <div className="w-56 text-xs font-mono text-neutral-500 space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span>合计金额</span>
              <span className="text-neutral-900">€{printedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>系统附税 (12%)</span>
              <span className="text-neutral-900">€{printedOrder.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>高宽保价运宿费</span>
              <span className="text-neutral-900">€{printedOrder.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-300 pt-2 text-sm font-extrabold text-neutral-950">
              <span>实核清算金</span>
              <span className="text-[#008060]">€{printedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 text-neutral-500 font-mono text-[10px] text-center p-3 rounded-xl leading-relaxed">
          Atelier Noir 对流合规明细收记。凡售艺术皮件，自到货之日起14日支持原盒高规格无损退换。
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
          <button 
            type="button"
            onClick={() => setPrintedOrder(null)}
            className="px-4 py-2 border border-neutral-250 text-xs font-mono text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            返回单证册
          </button>
          
          <button 
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-2 hover:bg-black active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>执行激光打印</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 select-none animate-fadeIn max-w-5xl mx-auto pb-10">
      
      {/* 🔝 HEADER SECTION - EXACT MATCH WITH SCREENSHOT */}
      <div className="flex items-center justify-between pb-2 pt-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#202223] font-sans">
            订单
          </h1>
          <p className="text-xs font-semibold text-[#6D7175] mt-1">
            查看和管理所有销售订单及资金状态
          </p>
        </div>
        
        <div className="flex items-center space-x-2.5">
          {/* View Toggler Switch */}
          <div className="flex bg-neutral-100 rounded-md p-0.5 border border-neutral-200">
            <button
              onClick={() => {
                setViewMode('table');
                eventBus.emit(NotificationEvents.CREATED, { text: '📊 已切换为列表视图' });
              }}
              className={`p-1 rounded transition-all ${
                viewMode === 'table'
                  ? 'bg-neutral-900 text-white shadow-3xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setViewMode('3d-grid');
                eventBus.emit(NotificationEvents.CREATED, { text: '🔮 已启用 3D 卡片网格' });
              }}
              className={`p-1 rounded transition-all flex items-center gap-1 ${
                viewMode === '3d-grid'
                  ? 'bg-[#07C2E3] text-black shadow-3xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="3D卡片网格"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-mono leading-none font-bold">3D</span>
            </button>
          </div>

          <button 
            onClick={() => {
              setAiFilterActive(!aiFilterActive);
              if (!aiFilterActive) {
                setCurrentTab('unfulfilled');
                eventBus.emit(NotificationEvents.CREATED, { text: '🧠 AI 已筛选出近24h滞存未妥发货单' });
              } else {
                setCurrentTab('All');
              }
            }}
            className={`relative p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 flex items-center justify-center`}
            title="AI 助手"
          >
            <Sparkles className="w-5 h-5 text-neutral-800" />
            <span className="absolute -top-1 -right-1.5 bg-neutral-900 border border-white text-white font-mono font-extrabold text-[8px] px-1 py-0.2 rounded-md leading-none">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-neutral-400" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-xs placeholder-neutral-400 outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200 transition-all font-medium text-neutral-800"
            placeholder="搜索订单号、客户、手机号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-xs text-neutral-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button 
          onClick={() => {
            setSearchQuery('');
            setAiFilterActive(false);
            setCurrentTab('All');
            eventBus.emit(NotificationEvents.CREATED, { text: '🔄 筛选已快速清除' });
          }}
          className="w-12 h-12 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          title="清除所有过滤"
        >
          <SlidersHorizontal className="w-4.5 h-4.5 text-neutral-600" />
        </button>
      </div>

      {/* 📊 HORIZONTAL CATEGORY CARDS CARD-BY-CARD FLOW */}
      <div className="overflow-x-auto scrollbar-none -mx-2 px-2 pb-2">
        <div className="flex space-x-3 min-w-[520px]">
          {categories.map((cat) => {
            const isSelected = currentTab === cat.key && !aiFilterActive;
            const CatIcon = cat.icon;
            const count = cat.key === 'All' ? totalCount : 
                         cat.key === 'pending' ? unpaidCount :
                         cat.key === 'unfulfilled' ? unfulfilledCount :
                         cat.key === 'fulfilled' ? fulfilledCount : completedCount;
            return (
              <div
                key={cat.key}
                onClick={() => {
                  setAiFilterActive(false);
                  setCurrentTab(cat.key);
                }}
                className={`flex-1 min-w-[100px] h-24 bg-white border rounded-2xl p-3 flex flex-col justify-between relative transition-all duration-150 cursor-pointer active:scale-97 select-none ${
                  isSelected 
                    ? 'border-neutral-900 ring-1 ring-neutral-900 shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-350 hover:shadow-3xs'
                }`}
              >
                {/* Top Row: Icon */}
                <div className="flex items-center justify-between text-neutral-800">
                  <CatIcon className={`w-4.5 h-4.5 ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`} />
                </div>
                
                {/* Bottom Row: Text and count */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 block truncate">{cat.label === '全部' ? '全部订单' : cat.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold font-sans text-neutral-950 leading-none">{count}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-350 absolute bottom-3.5 right-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔮 ULTRA-MINIMAL SELECTED ORDER ACTION BAR */}
      {scannedOrder && (
        <div className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#008060] animate-pulse" />
            <span className="text-xs font-black text-neutral-900 font-sans">
              已选订单：{scannedOrder.name}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {scannedOrder.customerName} (¥{scannedOrder.total.toFixed(2)})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedOrder(scannedOrder);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 active:scale-98 transition-all text-xs font-bold rounded-lg cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-300" />
              <span>查看账单详情</span>
            </button>

            {scannedOrder.fulfillmentStatus === 'unfulfilled' ? (
              <button
                onClick={() => {
                  setTrackingModalOrder(scannedOrder);
                  setCarrier('DHL');
                  setTrackingNumber('');
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#008060] text-white hover:bg-opacity-90 active:scale-98 transition-all text-xs font-black rounded-lg cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-white" />
                <span>立即发货</span>
              </button>
            ) : (
              <button
                onClick={() => handleArchiveOrder(scannedOrder.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 active:scale-98 transition-all text-xs font-bold rounded-lg cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-neutral-500" />
                <span>一键归档存储</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ⚡ AI WARNING INTENTIONAL BAR */}
      <div 
        onClick={() => {
          setAiFilterActive(true);
          setCurrentTab('unfulfilled');
          eventBus.emit(NotificationEvents.CREATED, { text: '🧠 已筛选出近24h滞存未妥发货单' });
        }}
        className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
          aiFilterActive 
            ? 'bg-neutral-900 text-white border border-neutral-900' 
            : 'bg-[#F4F5F6] hover:bg-neutral-150 border border-transparent'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <Sparkles className="w-4.5 h-4.5 text-neutral-800 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-xs font-black tracking-tight text-neutral-800 block">AI 提醒</span>
            <p className="text-[11px] font-sans text-neutral-600 font-semibold">
              {unfulfilledCount} 个订单超过 24 小时未发货，建议尽快处理
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
      </div>

      {/* 🧾 RETAIL HIGH-END CARDS LIST */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#E1E3E5] rounded-xl p-10 text-center text-neutral-400 text-xs font-mono shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <p>没有找到相关订单</p>
          </div>
        ) : viewMode === '3d-grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((ord, idx) => {
              const isUnfulfilled = ord.fulfillmentStatus === 'unfulfilled';
              const sumQty = ord.items.reduce((acc, x) => acc + x.quantity, 0);
              const isScanned = scannedOrder?.id === ord.id;

              const renderStatusBadge3D = () => {
                if (ord.paymentStatus === 'pending') {
                  return <CyberBadge text="待付款" color="#FFC453" pulse={true} />;
                }
                if (ord.fulfillmentStatus === 'unfulfilled') {
                  return <CyberBadge text="待发货" color="#008060" pulse={true} />;
                }
                if (ord.fulfillmentStatus === 'fulfilled' && ord.paymentStatus === 'paid') {
                  return <CyberBadge text="已完成" color="#008060" />;
                }
                return <CyberBadge text="已发货" color="#9C6ADE" />;
              };

              return (
                <div key={ord.id} onClick={() => setScannedOrder(ord)}>
                  <GlassCard3D
                    title={ord.name}
                    tag={ord.customerName}
                    isDark={false}
                    accentColor={isScanned ? '#008060' : '#E4E4E7'}
                    delay={idx * 0.05}
                  >
                    <div className="space-y-3 cursor-pointer">
                      {/* Header Row */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-extrabold text-neutral-900">
                              {ord.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              #{ord.id.substring(0, 6)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-500">
                            <span className="text-neutral-700">
                              {ord.customerName}
                            </span>
                            {ord.customerPhone && (
                              <span className="font-mono text-[11px] text-neutral-400">
                                {ord.customerPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {renderStatusBadge3D()}
                      </div>

                      {/* Middle products grid preview */}
                      <div className="flex items-center justify-between py-2 border-y border-neutral-100">
                        <div className="flex -space-x-2 overflow-hidden">
                          {ord.items.slice(0, 3).map((it, pidx) => (
                            <div 
                              key={pidx} 
                              className="w-10 h-10 rounded-xl border bg-neutral-50 border-neutral-200 p-1 flex items-center justify-center relative hover:scale-110 transition-transform"
                            >
                              <div 
                                className="w-full h-full flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[it.image as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.backpack }}
                              />
                            </div>
                          ))}
                          {ord.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[9px] font-bold text-neutral-500 z-10 self-center ml-2">
                              +{ord.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider font-mono text-neutral-400">
                            共 {sumQty} 件商品
                          </p>
                          <p className="text-base font-extrabold text-neutral-900">
                            ¥{ord.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions inside 3D Card */}
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-400">
                          {ord.createdAt?.includes('T') ? ord.createdAt.split('T')[0] : ord.createdAt}
                        </span>

                        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2 py-1 rounded-md text-[10px] font-bold transition-all bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200"
                          >
                            账详情
                          </button>
                          {isUnfulfilled ? (
                            <button
                              onClick={() => {
                                setTrackingModalOrder(ord);
                                setCarrier('DHL');
                                setTrackingNumber('');
                              }}
                              className="px-2 py-1 bg-[#008060] text-white hover:bg-[#006045] font-black rounded-md text-[10px] transition-all"
                            >
                              发货
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchiveOrder(ord.id)}
                              className="px-2 py-1 border border-neutral-200 text-neutral-650 hover:text-red-650 hover:border-red-100 rounded-md text-[10px] font-bold"
                            >
                              归档
                            </button>
                          )}
                          <button
                            onClick={() => setActionMenuOrder(ord)}
                            className="p-1 rounded-md hover:bg-neutral-500/10 text-neutral-500"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard3D>
                </div>
              );
            })}
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isUnfulfilled = ord.fulfillmentStatus === 'unfulfilled';
            const sumQty = ord.items.reduce((acc, x) => acc + x.quantity, 0);

            // Dynamic core badge matching exact status guide
            const renderStatusBadge = () => {
              if (ord.paymentStatus === 'pending') {
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFC453]/15 text-[#9E6000] border border-[#FFC453]/30">
                    💰 待付款
                  </span>
                );
              }
              if (ord.fulfillmentStatus === 'unfulfilled') {
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#0070F0]/10 text-[#0070F0] border border-[#0070F0]/15">
                    📦 待发货
                  </span>
                );
              }
              if (ord.fulfillmentStatus === 'fulfilled' && ord.paymentStatus === 'paid') {
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#008060]/10 text-[#008060] border border-[#008060]/15">
                    ✓ 已完成
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#9C6ADE]/10 text-[#9C6ADE] border border-[#9C6ADE]/15">
                  ✈ 已发货
                </span>
              );
            };

            return (
              <div
                key={ord.id}
                className="bg-white border border-[#E1E3E5] rounded-xl overflow-hidden hover:border-[#008060] hover:shadow-[0_1px_5px_rgba(0,0,0,0.05)] transition-all duration-200 relative group flex flex-col p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              >
                <div 
                  onClick={() => {
                    setScannedOrder(ord);
                    setSelectedOrder(ord);
                  }}
                  className="cursor-pointer flex items-center justify-between gap-4"
                >
                  {/* Left Column info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-base font-extrabold text-[#202223] block leading-none">
                      {ord.name}
                    </span>
                    <div className="space-y-1 text-xs text-[#6D7175]">
                      <div className="flex items-center space-x-1.5 font-bold text-neutral-800">
                        <span>{ord.customerName}</span>
                        {ord.customerPhone && (
                          <span className="text-neutral-500 font-mono tracking-tight font-medium">
                            {ord.customerPhone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 font-medium">{sumQty} 件商品</p>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-[#6D7175] font-mono pt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{ord.createdAt?.includes('T') ? `${ord.createdAt.split('T')[0]} ${ord.createdAt.split('T')[1].substring(0, 5)}` : ord.createdAt}</span>
                    </div>
                  </div>

                  {/* Middle Column Item images */}
                  <div className="flex items-center space-x-2 overflow-hidden shrink-0">
                    {ord.items.slice(0, 3).map((it, idx) => (
                      <div key={idx} className="w-14 h-14 bg-neutral-50 border border-[#E1E3E5] rounded-xl overflow-hidden p-1 flex items-center justify-center relative hover:scale-105 transition-transform">
                        <div 
                          className="w-full h-full flex items-center justify-center p-0.5"
                          dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[it.image as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.backpack }}
                        />
                      </div>
                    ))}
                    {ord.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-neutral-50 border border-[#E1E3E5] flex items-center justify-center text-[10px] font-bold text-[#6D7175] z-0">
                        +{ord.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Right Column billing */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5 min-h-[70px]">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuOrder(ord);
                      }}
                      className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer self-end"
                    >
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>

                    <div className="text-right space-y-1.5 mt-auto">
                      <p className="font-extrabold text-base text-[#202223] font-sans">
                        ¥{ord.total.toFixed(2)}
                      </p>
                      <div className="flex justify-end">
                        {renderStatusBadge()}
                      </div>
                    </div>
                  </div>

                </div>

                {/* 🔒 HOVER UTILITY CONTROLS - MINIMAL BUT POWERFUL */}
                <div className="bg-neutral-50/45 border-t border-[#e1e3e5] pt-3 mt-1 text-xs flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[10px] text-[#A1A1A9] font-sans tracking-tight">快捷账管选项</span>
                  <div className="flex space-x-1.5">
                    <button 
                      onClick={() => setActionMenuOrder(ord)}
                      className="px-2.5 py-1 text-[11px] text-neutral-800 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 font-semibold"
                    >
                      更多
                    </button>
                    {isUnfulfilled ? (
                      <button 
                        onClick={() => {
                          setTrackingModalOrder(ord);
                          setCarrier('DHL');
                          setTrackingNumber('');
                        }}
                        className="px-2.5 py-1 text-[11px] text-white bg-neutral-900 border border-neutral-950 rounded-lg hover:bg-black font-bold"
                      >
                        发货
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleArchiveOrder(ord.id)}
                        className="px-2.5 py-1 text-[11px] text-neutral-600 border border-neutral-200 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold"
                      >
                        归档
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 🛎️ ACTION TRIGGER SHEET FOR 5 CORE ACTIONS */}
      {actionMenuOrder && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-3xs z-[120] flex items-end justify-center animate-fadeIn select-none shadow-3xl"
          onClick={() => setActionMenuOrder(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl overflow-hidden shadow-2xl p-4 space-y-4 animate-slideInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 font-mono">账款与履约选项: {actionMenuOrder.name}</h3>
                <p className="text-[10px] text-neutral-400">Atelier Noir 极简操作台面</p>
              </div>
              <button onClick={() => setActionMenuOrder(null)} className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-neutral-100 font-sans text-xs">
              
              {/* Action 1: Full Details Drawer */}
              <button 
                onClick={() => {
                  setSelectedOrder(actionMenuOrder);
                  setActionMenuOrder(null);
                }}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>查看订单明细</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Action 2: Multi Channel Sending Share Modal */}
              <button 
                onClick={() => {
                  setShareModalOrder(actionMenuOrder);
                  setActionMenuOrder(null);
                }}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>发送订单确认书 (WhatsApp/Email/短信...)</span>
                <Send className="w-4 h-4 text-[#008060]" />
              </button>

              {/* Action 3: DHL courier tracker placement */}
              {actionMenuOrder.fulfillmentStatus === 'unfulfilled' ? (
                <button 
                  onClick={() => {
                    setTrackingModalOrder(actionMenuOrder);
                    setCarrier('DHL');
                    setTrackingNumber('');
                  }}
                  className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 text-[#008060] cursor-pointer font-bold"
                >
                  <span>添加物流单号</span>
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    updateOrder(actionMenuOrder.id, { fulfillmentStatus: 'unfulfilled', carrier: undefined, trackingNumber: undefined });
                    eventBus.emit(NotificationEvents.CREATED, { text: '🔄 物流追踪已清空，重置待发' });
                    setActionMenuOrder(null);
                  }}
                  className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 text-orange-655 cursor-pointer font-bold"
                >
                  <span>重置发货状态为 (待配货)</span>
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              )}

              {/* Action 4: Clear pending financial payment state */}
              {actionMenuOrder.paymentStatus !== 'paid' && (
                <button 
                  onClick={() => handleMarkAsPaid(actionMenuOrder.id)}
                  className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 text-[#008060] cursor-pointer font-bold"
                >
                  <span>手动标记买家已付清结清</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {/* Action 5: Print slip */}
              <button 
                onClick={() => {
                  setPrintedOrder(actionMenuOrder);
                  setActionMenuOrder(null);
                }}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>下载与打印高级 PDF 收款条</span>
                <Printer className="w-4 h-4 text-neutral-800" />
              </button>

              {/* Secure archive */}
              <button 
                onClick={() => handleArchiveOrder(actionMenuOrder.id)}
                className="w-full text-left py-3.5 hover:bg-red-50 hover:text-red-700 flex items-center justify-between px-2 cursor-pointer text-neutral-500"
              >
                <span>收纳归档</span>
                <Archive className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ✈️ EXPRESS LOGISTICS ASSIGN MODAL */}
      {trackingModalOrder && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-3xs z-[130] flex items-center justify-center p-4 animate-fadeIn select-none"
          onClick={() => setTrackingModalOrder(null)}
        >
          <form 
            onSubmit={handleFulfillOrderSubmit}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm font-extrabold text-neutral-950 font-serif">物流申报及发货通关</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1 font-mono">填写以连通自动物流追踪短信服务</p>
            </div>

            <div className="space-y-3 TEXT-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-500 font-bold block text-[10px] uppercase font-mono">选择服务商 / Carrier</label>
                <select 
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                >
                  <option value="DHL">DHL Express</option>
                  <option value="顺丰速运">顺丰速运 SF (特快保价)</option>
                  <option value="FedEx">FedEx International</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 font-bold block text-[10px] uppercase font-mono">运单追踪号码 / Trailing No</label>
                <input
                  type="text"
                  required
                  placeholder="如 TRACK123456"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:border-neutral-900"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button 
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2 border text-neutral-550 hover:bg-neutral-50 rounded-xl"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl font-bold font-mono transition-transform active:scale-95 cursor-pointer"
              >
                确认已交寄发货
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✉️ MULTI-CHANNEL SHARE PRE-CONFIRM MODAL */}
      {shareModalOrder && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-3xs z-[130] flex items-center justify-center p-4 animate-fadeIn select-none"
          onClick={() => setShareModalOrder(null)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm font-extrabold text-neutral-950 font-serif">发送订单通知</h3>
              <p className="text-[10.5px] text-neutral-400 mt-1">选择发送通知的联系渠道：</p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-neutral-100 font-sans text-xs">
              <button 
                onClick={() => handleSendNotification('whatsapp', shareModalOrder)}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button 
                onClick={() => handleSendNotification('email', shareModalOrder)}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>电子邮件 (Email)</span>
                <Mail className="w-4 h-4 text-neutral-400" />
              </button>
              <button 
                onClick={() => handleSendNotification('sms', shareModalOrder)}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>手机短信 (SMS)</span>
                <Smartphone className="w-4 h-4 text-neutral-400" />
              </button>
              <button 
                onClick={() => handleSendNotification('copy', shareModalOrder)}
                className="w-full text-left py-3.5 hover:bg-neutral-50 flex items-center justify-between px-2 cursor-pointer font-bold"
              >
                <span>复制订单链接</span>
                <Clipboard className="w-4 h-4 text-[#008060]" />
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button 
                type="button" 
                onClick={() => setShareModalOrder(null)} 
                className="px-4 py-2 border hover:bg-neutral-50 rounded-xl"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 FULL DETAILED OVERLAY LAYOUT SHEET (FIVE-BLOCK CORE LAYOUT SPECIFICATION) */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-3xs z-[100] flex justify-end animate-fadeIn select-none"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="p-4 border-b sticky top-0 bg-white z-15 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-sm font-bold font-mono text-neutral-900">订单档案: {selectedOrder.name}</h3>
                  <p className="text-[10px] text-neutral-400">Atelier Noir 高级买手档记录</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive Details Grid (Classic 5 Blocks Layout!) */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto font-sans text-xs">
              
              {/* BLOCK 1: Title and Core Action Overview */}
              <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold font-mono text-neutral-950">{selectedOrder.name}</span>
                  <div className="flex space-x-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedOrder.fulfillmentStatus === 'unfulfilled' 
                        ? 'bg-[#e6f4f0] text-[#008060]' 
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {selectedOrder.fulfillmentStatus === 'unfulfilled' ? '待发货' : '已交寄'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedOrder.paymentStatus === 'paid' 
                        ? 'bg-neutral-100 text-neutral-800 border' 
                        : 'bg-red-50 text-red-655'
                    }`}>
                      {selectedOrder.paymentStatus === 'paid' ? '已清算' : '等待核实'}
                    </span>
                  </div>
                </div>
                
                {/* AI Value / Risk alerts embedded quietly */}
                <div className="pt-2 border-t border-neutral-200/50 flex justify-between text-[10.5px]">
                  <span className="text-neutral-500">客户价值: <span className="text-[#008060] font-bold">{selectedOrder.aiValue || '高价值客户'}</span></span>
                  <span className="text-neutral-500">合规判定: <span className="text-neutral-950 font-bold">{selectedOrder.aiRisk || '良好'}</span></span>
                </div>
              </div>

              {/* BLOCK 2: Customer Bio Information block */}
              <div className="border border-neutral-150 rounded-2xl p-4 bg-white shadow-3xs space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">客户信息档案</span>
                
                <div className="space-y-2 divide-y divide-neutral-100">
                  <div className="flex justify-between items-center pt-1.5 first:pt-0">
                    <span className="text-neutral-400">买方姓名</span>
                    <span className="font-extrabold text-neutral-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-neutral-400">电邮回邮</span>
                    <span className="font-mono text-neutral-800 select-all">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-neutral-400">联络手机号</span>
                    <span className="font-mono text-neutral-800 select-all">{selectedOrder.customerPhone || '未知'}</span>
                  </div>
                </div>
              </div>

              {/* BLOCK 3: Items Product Showcase block */}
              <div className="border border-neutral-150 rounded-2xl p-4 bg-white shadow-3xs space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">明细购货项目</span>
                
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b border-neutral-100 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-2.5">
                        {renderProductBadge(item.image)}
                        <div>
                          <p className="font-extrabold text-neutral-900 font-sans tracking-tight">{item.title}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">单价: €{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className="font-serif font-extrabold text-neutral-950">× {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCK 4: Fulfillment Logistics block */}
              <div className="border border-neutral-150 rounded-2xl p-4 bg-white shadow-3xs space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">配送跟踪明细</span>

                {selectedOrder.carrier ? (
                  <div className="space-y-2 divide-y divide-neutral-100 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-400">承运企业</span>
                      <span className="font-bold text-neutral-900">{selectedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-400">承保速递单号</span>
                      <span className="font-mono font-bold text-neutral-900 select-all">{selectedOrder.trackingNumber}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-neutral-500 font-mono">
                      🚚 交易处于承运动态追踪中，最新轨迹可通过 5G 基站自动回传。
                    </div>
                  </div>
                ) : (
                  <div className="py-2 space-y-2.5">
                    <p className="text-neutral-400 font-mono text-[11px]">该笔订单当前尚未录入承保物流方案。</p>
                    <button 
                      onClick={() => {
                        setTrackingModalOrder(selectedOrder);
                        setCarrier('DHL');
                        setTrackingNumber('');
                      }}
                      className="w-full py-2 border border-neutral-250 bg-neutral-950 text-white rounded-xl font-bold font-mono text-center hover:bg-black transition-colors"
                    >
                      立即录入物流单号 ➔
                    </button>
                  </div>
                )}
              </div>

              {/* BLOCK 5: Payments details block */}
              <div className="border border-neutral-150 rounded-2xl p-4 bg-white shadow-3xs space-y-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono font-bold">支付与清算明细</span>
                
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">货款小计</span>
                    <span className="text-neutral-900">€{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount ? (
                    <div className="flex justify-between text-neutral-550">
                      <span className="font-sans">扣除折扣 Code</span>
                      <span className="text-red-655">-€{selectedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">税金 / VAT</span>
                    <span className="text-neutral-900">€{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">运宿费</span>
                    <span className="text-neutral-900">€{selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 font-extrabold text-[#008060] text-sm">
                    <span className="font-sans">总结算金</span>
                    <span>€{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Sticky Interactive bar supporting quick direct dispatching */}
            <div className="p-4 border-t sticky bottom-0 bg-white grid grid-cols-3 gap-2 shrink-0">
              <button 
                onClick={() => setShareModalOrder(selectedOrder)}
                className="py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>分发单据</span>
              </button>
              
              <button 
                onClick={() => {
                  setPrintedOrder(selectedOrder);
                }}
                className="py-2.5 border border-neutral-250 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印 PDF</span>
              </button>

              <button 
                onClick={() => {
                  if (selectedOrder.fulfillmentStatus === 'unfulfilled') {
                    setTrackingModalOrder(selectedOrder);
                    setCarrier('DHL');
                    setTrackingNumber('');
                  } else {
                    handleQuickStatusChange(selectedOrder.id, 'unfulfill');
                    setSelectedOrder(null);
                  }
                }}
                className="py-2.5 bg-neutral-950 hover:bg-black text-white rounded-xl text-xs font-bold text-center cursor-pointer"
              >
                {selectedOrder.fulfillmentStatus === 'unfulfilled' ? '添加物流 ➔' : '重置待发'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUICK HANDLED FLOATING PLUS IN THE VIEW PORT DIRECT ACCESS DRAWER AND QUICK SAVE */}
      {isCreating && (
        <div 
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-3xs z-[100] flex justify-end animate-fadeIn select-none"
          onClick={() => setIsCreating(false)}
        >
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-neutral-110 rounded text-neutral-500 hover:text-black">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900 font-mono">手工补录票据</h3>
                  <p className="text-[10px] text-neutral-400 font-mono">ATELIER NOIR CRM AUDITING ENTRY</p>
                </div>
              </div>
              <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-4 space-y-4 flex-1 text-xs">
              
              <div className="space-y-1">
                <label className="text-neutral-520 block font-bold font-mono">买家尊称 (人名)</label>
                <input
                  type="text"
                  required
                  placeholder="如: 张先生"
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none focus:border-black text-xs"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-520 block font-bold font-mono">电子邮件</label>
                <input
                  type="email"
                  placeholder="如: user@ateliernoir.com"
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none focus:border-black text-xs"
                  value={newOrderForm.customerEmail}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-520 block font-bold font-mono">手机号口径</label>
                <input
                  type="text"
                  placeholder="如: 138-0013-5689"
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none focus:border-black text-xs"
                  value={newOrderForm.customerPhone}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-520 block font-bold font-mono">选配核心商品款式</label>
                <select 
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none focus:border-black text-xs"
                  value={newOrderForm.productId}
                  onChange={(e) => {
                    const picked = products.find(p => p.id === e.target.value);
                    setNewOrderForm({ 
                      ...newOrderForm, 
                      productId: e.target.value,
                      price: picked ? picked.price.toString() : '328.00'
                    });
                  }}
                >
                  <option value="">-- 选择在录款式 --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (单价: €{p.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-neutral-520 block font-bold font-mono">决算币值单价</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-xl bg-white outline-none"
                    value={newOrderForm.price}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-520 block font-bold font-mono">买物数量</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded-xl bg-white outline-none"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-520 block font-bold font-mono">订单私密备注</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none h-16 resize-none"
                  placeholder="备注任何对物流防损或特殊包装的指教..."
                  value={newOrderForm.notes}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end pt-3">
                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-center active:scale-95 transition-all text-xs font-mono"
                >
                  确认归档核准此交易 单 ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Plus indicator to open clean entry form */}
      <div className="fixed bottom-20 right-6 z-40">
        <button
          onClick={() => setIsCreating(true)}
          className="w-11 h-11 bg-neutral-900 border border-neutral-950 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="新增订单补录"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
