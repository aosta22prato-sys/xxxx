import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Wifi, 
  WifiOff, 
  CreditCard, 
  DollarSign, 
  QrCode, 
  User, 
  Users, 
  Settings, 
  Printer, 
  Maximize2, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Check, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Zap, 
  Barcode, 
  X, 
  FileText, 
  Mail, 
  Cpu, 
  Sparkles, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { ProductItem, OrderItem } from '../../types';

interface POSSystemProps {
  products: ProductItem[];
  orders: OrderItem[];
  onUpdateProducts: (updated: ProductItem[]) => void;
  onUpdateOrders: (updated: OrderItem[]) => void;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  selectedIndustry: string;
}

interface Cashier {
  id: string;
  name: string;
  pin: string;
  role: 'Admin' | 'Cashier' | 'Store Manager';
  status: 'Active' | 'Inactive';
  salesCount: number;
}

interface CartItem {
  product: ProductItem;
  quantity: number;
}

export default function POSSystem({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
  addLog,
  selectedIndustry
}: POSSystemProps) {
  // Device Type Simulator ('ipad' | 'iphone')
  const [deviceType, setDeviceType] = useState<'ipad' | 'iphone'>('ipad');
  
  // Offline State Mode
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<{ cart: CartItem[]; timestamp: string; cashierId: string; total: number; id: string }[]>([]);
  
  // Hardware status triggers
  const [isCardReaderConnected, setIsCardReaderConnected] = useState<boolean>(true);
  const [isPrinterConnected, setIsPrinterConnected] = useState<boolean>(true);
  const [isScannerConnected, setIsScannerConnected] = useState<boolean>(true);

  // Cashier State Management
  const [cashiers, setCashiers] = useState<Cashier[]>([
    { id: 'CSH-001', name: '王经理 (Admin)', pin: '1234', role: 'Admin', status: 'Active', salesCount: 42 },
    { id: 'CSH-002', name: '李阿美 (Staff)', pin: '5678', role: 'Cashier', status: 'Active', salesCount: 19 },
    { id: 'CSH-003', name: '张小杰 (Staff)', pin: '9012', role: 'Cashier', status: 'Active', salesCount: 8 }
  ]);
  const [activeCashier, setActiveCashier] = useState<Cashier | null>(null);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  
  // Cashier management subtab
  const [showCashierModal, setShowCashierModal] = useState<boolean>(false);
  const [newCashierName, setNewCashierName] = useState<string>('');
  const [newCashierPin, setNewCashierPin] = useState<string>('');
  const [newCashierRole, setNewCashierRole] = useState<'Admin' | 'Cashier' | 'Store Manager'>('Cashier');

  // Interactive core cart and product grids
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Scanning feedback state
  const [scanningFeedback, setScanningFeedback] = useState<boolean>(false);
  const [scannedProductName, setScannedProductName] = useState<string>('');

  // Checkout flows
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'receipt'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'scan' | null>(null);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<OrderItem | null>(null);
  
  // Simulated receipt printing logs
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [emailForReceipt, setEmailForReceipt] = useState<string>('');
  const [receiptSentMessage, setReceiptSentMessage] = useState<string>('');

  // Auto categories compiled from real inventory
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || '其它').filter(Boolean)))];

  // Auto pin checkout login effect
  useEffect(() => {
    if (pinInput.length === 4) {
      const matched = cashiers.find(c => c.pin === pinInput && c.status === 'Active');
      if (matched) {
        setActiveCashier(matched);
        setPinInput('');
        setPinError(false);
        addLog('POS Terminal', '员工刷卡登录', `收银员「${matched.name}」已解锁 POS 收银系统终端，开始当班销售`, 'success');
      } else {
        setPinError(true);
        setPinInput('');
        addLog('POS Terminal', '安全校验失败', '非合规工号PIN输入尝试：销售端登录拒绝', 'error');
        // Clear error after a short bounce
        setTimeout(() => setPinError(false), 1500);
      }
    }
  }, [pinInput, cashiers]);

  // Sync Offline Queue Completed orders once connection is established
  const handleOfflineSync = () => {
    if (offlineQueue.length === 0) return;
    
    addLog('POS Sync Bridge', '启动离线数据同步', `检测到有 ${offlineQueue.length} 笔等待入账的离线销售订单，开始合并...`, 'info');
    
    let updatedProducts = [...products];
    const newOrders: OrderItem[] = [];

    offlineQueue.forEach((offlineOrder) => {
      // 1. Decrement inventory
      offlineOrder.cart.forEach((item) => {
        updatedProducts = updatedProducts.map(p => {
          if (p.id === item.product.id) {
            const newStock = Math.max(0, p.stock - item.quantity);
            const lowStock = newStock <= p.minStockThreshold;
            return {
              ...p,
              stock: newStock,
              status: newStock === 0 ? 'Out of Stock' : lowStock ? 'Low Stock' : 'In Stock'
            };
          }
          return p;
        });
      });

      // 2. Map items
      const orderItems = offlineOrder.cart.map(item => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      // 3. Craft OrderItem
      const newOrder: OrderItem = {
        id: offlineOrder.id,
        customerName: `离线散客 (门市店点单)`,
        contact: '+00 00000000',
        total: offlineOrder.total,
        status: 'Completed',
        createdAt: offlineOrder.timestamp,
        riskScore: 0,
        paymentMethod: '离线收银并网/现金结算',
        items: orderItems,
        shippingAddress: '门市线下内场点单提货'
      };
      newOrders.push(newOrder);
    });

    // Bulk push
    onUpdateProducts(updatedProducts);
    onUpdateOrders([...newOrders, ...orders]);
    setOfflineQueue([]);
    
    addLog('POS Sync Bridge', '离线订单同步完成', `成功合并 ${newOrders.length} 个本地离线订单！线上线下库存与财物账单已全部核准同步`, 'success');
  };

  // Add to cart
  const handleAddToCart = (product: ProductItem) => {
    if (product.stock === 0) {
      addLog('POS Application', '加购未果', '抱歉，当前门店或线上物理库存不足，无法进行收收银点击加码！', 'warning');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          addLog('POS Terminal', '达到满额配额限制', `商品 ${product.name} 达到最大可用物理真实库存`, 'warning');
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Adjust item qty in cart
  const handleAdjustQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.product.stock) {
          addLog('POS Terminal', '超额库存阻拦', '无法加入更多数量，超过物理库存量限制', 'warning');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Total Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const vatRate = 0.20; // 欧盟20%增值税
  const cartTax = cartSubtotal * vatRate;
  const cartTotal = cartSubtotal + cartTax;

  // Simulate Instant Barcode Laser Scanner Gun (条码扫描枪)
  const handleSimulateBarcodeScan = () => {
    if (!isScannerConnected) {
      addLog('POS Hardware', '扫描枪未接入', '请先在底部【硬件控制器】中开启扫描枪连入！', 'warning');
      return;
    }
    
    // Pick a random available product in active list
    const available = products.filter(p => p.stock > 0);
    if (available.length === 0) {
      addLog('POS Scanner', '无货商品', '所有商品库存均为空，无法匹配扫描扣除', 'warning');
      return;
    }
    
    const randomProduct = available[Math.floor(Math.random() * available.length)];
    setScannedProductName(randomProduct.name);
    setScanningFeedback(true);
    handleAddToCart(randomProduct);
    
    addLog('POS Barcode Scanner', '条码枪扫射入库', `红外投射成功！条码「${randomProduct.sku}」扫射成功，已加购：${randomProduct.name}`, 'info');
    
    setTimeout(() => {
      setScanningFeedback(false);
    }, 1800);
  };

  // Perform checkout cashier transaction
  const handleProcessCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('payment');
    setPaymentMethod(null);
    setCashReceived('');
  };

  const handleSelectPaymentMethod = (method: 'card' | 'cash' | 'scan') => {
    if (method === 'card' && !isCardReaderConnected) {
      addLog('POS Hardware', '刷卡机未就绪', '当前 Adyen 读卡器硬件连接异常，请插拔检查或换现金支付结算', 'error');
      return;
    }
    setPaymentMethod(method);
    if (method === 'cash') {
      setCashReceived(Math.ceil(cartTotal).toString());
    }
  };

  // Complete Payment Action
  const handleCompletePayment = () => {
    if (!paymentMethod) return;
    
    setPaymentProcessing(true);
    
    const timestamp = new Date().toLocaleString();
    const orderNo = `POS-${Date.now().toString().slice(-8)}`;

    setTimeout(() => {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const finalOrderItem: OrderItem = {
        id: orderNo,
        customerName: '线下门市零售散客',
        contact: '+00 门市收银',
        total: cartTotal,
        status: 'Completed',
        createdAt: timestamp,
        riskScore: 2, // Low retail risk
        paymentMethod: paymentMethod === 'cash' ? '门市现金找零' : paymentMethod === 'card' ? 'Adyen 零售插卡付' : '扫码结算通道',
        items: orderItems,
        shippingAddress: '门市面售自提'
      };

      if (isOnline) {
        // ONLINE: Update Global database and inventories immediately
        const updatedProducts = products.map(p => {
          const cartItem = cart.find(item => item.product.id === p.id);
          if (cartItem) {
            const newStock = Math.max(0, p.stock - cartItem.quantity);
            const isLow = newStock <= p.minStockThreshold;
            return {
              ...p,
              stock: newStock,
              status: newStock === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'
            } as ProductItem;
          }
          return p;
        });

        onUpdateProducts(updatedProducts);
        onUpdateOrders([finalOrderItem, ...orders]);
        
        addLog('POS Terminal', '现场支付核销完成', `流水 [${orderNo}] 支付成功！线上线下库存已连通实时核销：[${cart.map(i => `${i.product.name}*${i.quantity}`).join(', ')}]`, 'success');
      } else {
        // OFFLINE: Save to Offline pending list
        const offlineOrder = {
          id: orderNo,
          cart: [...cart],
          timestamp,
          cashierId: activeCashier?.id || 'Unknown',
          total: cartTotal
        };
        setOfflineQueue(prev => [...prev, offlineOrder]);
        addLog('POS Offline Engine', '离线销售记账成功', `断网模式营业：销售记录已保存到本地沙盒序列！并网后将自动回流。`, 'warning');
      }

      // Record Sales count for current cashier
      if (activeCashier) {
        setCashiers(prev => prev.map(c => 
          c.id === activeCashier.id 
            ? { ...c, salesCount: c.salesCount + 1 } 
            : c
        ));
      }

      setLastCreatedOrder(finalOrderItem);
      setPaymentProcessing(false);
      setCheckoutStep('receipt');
      setCart([]);
    }, 1200); // simulated hardware delay
  };

  // Simulated Receipts Printers
  const handlePrintReceipt = () => {
    if (!isPrinterConnected) {
      addLog('POS Hardware', '纸卷用尽或打印机未联通', '打印指令受阻，请确保桌面有线热敏收据打印机已就绪', 'error');
      return;
    }
    setIsPrinting(true);
    addLog('POS Thermal Printer', '热敏打印指令下发', `正在向 Bixolon SRP350 吐纸：收据流水为 [${lastCreatedOrder?.id}]`, 'info');
    setTimeout(() => {
      setIsPrinting(false);
      addLog('POS Thermal Printer', '热敏收据已切纸发出', `切刀成功释放，顾客线下热敏小票顺利流出。`, 'success');
    }, 2000);
  };

  const handleSendEmailReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForReceipt) return;
    setReceiptSentMessage('Sending...');
    setTimeout(() => {
      setReceiptSentMessage(`电子收据已成功投递至: ${emailForReceipt}`);
      addLog('POS Mail Server', '发送电子发票收据', `顾客电子邮箱接入，系统自动同步发送 PDF 账单给 [${emailForReceipt}]`, 'success');
      setEmailForReceipt('');
    }, 1000);
  };

  // Add Cashier account handler
  const handleCreateCashier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashierName || newCashierPin.length !== 4) {
      return;
    }
    const newId = `CSH-00${cashiers.length + 1}`;
    const entry: Cashier = {
      id: newId,
      name: `${newCashierName} (Staff)`,
      pin: newCashierPin,
      role: newCashierRole,
      status: 'Active',
      salesCount: 0
    };
    setCashiers(prev => [...prev, entry]);
    addLog('Staff Manager', '新增POS操作员授权', `建立新收银账号：${newCashierName} (Role: ${newCashierRole})，PIN生效并解锁权限。`, 'success');
    setNewCashierName('');
    setNewCashierPin('');
    setShowCashierModal(false);
  };

  // Filter products matching search and selected category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : (p.category === selectedCategory || (!p.category && selectedCategory === '其它'));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 min-h-[850px] shadow-sm font-sans text-slate-800 flex flex-col gap-6">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-zinc-950 text-white rounded-lg text-xs font-black font-mono shadow-sm">SMART POS V4</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Retail Checkout Tunnel</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">智慧门市收银 & 点单终端</h2>
          <p className="text-xs text-slate-500 mt-1">
            本模块深度模拟在 iPad 或 iPhone 前端机上运转的商业零售收单引擎。真实对接店铺 SKU，付款时即时销除全网库存并更新财物流水。
          </p>
        </div>

        {/* Real-time Connection status controller */}
        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-200/60 border border-slate-200 p-1.5 rounded-2xl items-center gap-1.5 select-none">
            <button
              onClick={() => {
                setIsOnline(true);
                addLog('POS Terminal', '通信并网成功', 'POS 回归 5G 冗余网络，激活主动轮询入账，库存实时映射。', 'success');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isOnline ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>联机模式 (Online)</span>
            </button>
            <button
              onClick={() => {
                setIsOnline(false);
                addLog('POS Terminal', '通信切换为离线受阻状态', 'POS 切换到离线模式。在失去因特网环境时仍可稳定销售。销售在队列中缓存，并网后可再次点击同步。', 'warning');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                !isOnline ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>断网模式 (Offline)</span>
            </button>
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleOfflineSync}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all animate-pulse"
              title="合并离线账期并更新物理库房"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>核销并网 ({offlineQueue.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Switch layout controls */}
      <div className="flex justify-between items-center bg-white border border-slate-200/85 p-3 rounded-2xl mb-1">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-500">
            📺 终端机型模拟:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setDeviceType('ipad')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                deviceType === 'ipad' ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>iPad 横屏板</span>
            </button>
            <button
              onClick={() => setDeviceType('iphone')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                deviceType === 'iphone' ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 竖屏端</span>
            </button>
          </div>
        </div>

        {activeCashier && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-150 rounded-xl border border-slate-200 text-xs">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-500 font-medium">当班人:</span>
              <span className="font-bold text-slate-800">{activeCashier.name}</span>
              <span className="text-[10px] text-slate-400">({activeCashier.role})</span>
            </div>
            
            <button
              onClick={() => {
                setActiveCashier(null);
                setPinInput('');
                addLog('POS Terminal', '终端注销锁定', '当前收银员注销并退出系统，POS 已上锁以防越权操作。', 'info');
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
            >
              锁定终端
            </button>

            <button
              onClick={() => setShowCashierModal(true)}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>员工权限</span>
            </button>
          </div>
        )}
      </div>

      {/* RENDER DYNAMIC TERMINAL DECK FRAME */}
      <div className="flex justify-center items-center py-6 bg-slate-900 border-4 border-slate-950 rounded-[40px] shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Abstract design elements for simulation screen */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 absolute left-4" />
          <div className="w-16 h-1 bg-zinc-800 rounded-full" />
        </div>

        {/* DEVICE CONTENT AREA */}
        <div 
          className={`bg-slate-100 overflow-hidden relative border-8 border-black shadow-inner transition-all duration-300 ${
            deviceType === 'ipad' 
              ? 'w-full max-w-[1024px] h-[640px] rounded-2xl' 
              : 'w-[400px] h-[720px] rounded-[36px]'
          }`}
        >
          {/* Status bar top */}
          <div className="h-7 bg-zinc-950 text-white flex justify-between items-center px-6 text-xs select-none">
            <span className="font-bold flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-cyan-400" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {/* Status dynamic indicators */}
            <div className="flex items-center gap-3">
              {scanningFeedback && (
                <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded animate-pulse tracking-wide italic">
                  🔴 紅外雷射掃射中
                </span>
              )}
              
              <div className="flex items-center gap-1 text-[10px]">
                {isOnline ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Wifi className="w-3 h-3" /> 联机中
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                    <WifiOff className="w-3 h-3" /> 散离待网
                  </span>
                )}
              </div>
              <div className="w-5 h-2.5 border border-zinc-500 rounded-sm p-0.5 flex items-center">
                <div className="h-full w-4 bg-emerald-400 rounded-2xs" />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">99%</span>
            </div>
          </div>

          {/* INTERNAL ROUTING - STAFF LOCKSCREEN STATE OR ACTIVE MAIN PANEL */}
          {!activeCashier ? (
            /* PIN ENTRY LOCKSCREEN */
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-center items-center text-white px-8">
              <div className="text-center space-y-4 max-w-sm w-full">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto border-2 border-slate-700 shadow-xl">
                  <Lock className={`w-8 h-8 ${pinError ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">POS Terminal Locked</h3>
                  <p className="text-xs text-slate-400 mt-1">请输入 4 位数字密码解锁该收银工作台</p>
                </div>

                <div className="space-y-4">
                  {/* Pin Dot indicator indicator */}
                  <div className="flex justify-center gap-4 py-2">
                    {[1, 2, 3, 4].map(idx => (
                      <div 
                        key={idx} 
                        className={`w-4.5 h-4.5 rounded-full border-2 transition-all duration-150 ${
                          pinInput.length >= idx 
                            ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_8px_#34d399]' 
                            : pinError 
                              ? 'border-red-500 bg-red-950/20 animate-shake' 
                              : 'border-slate-500 bg-slate-950/30'
                        }`}
                      />
                    ))}
                  </div>

                  {pinError && (
                    <p className="text-xs text-red-400 font-bold animate-pulse">
                      ❌ PIN 密码输入错误，请重新审核
                    </p>
                  )}

                  {/* 3x4 Number visual grid */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          if (pinInput.length < 4) setPinInput(prev => prev + num);
                        }}
                        className="h-12 rounded-xl bg-slate-850 hover:bg-slate-800 active:scale-95 transition-all text-sm font-extrabold cursor-pointer border border-slate-800 flex items-center justify-center hover:border-slate-700"
                        title={`输入 ${num}`}
                      >
                        {num}
                      </button>
                    ))}
                    
                    {/* Clear */}
                    <button
                      onClick={() => setPinInput('')}
                      className="h-12 rounded-xl bg-slate-950/40 hover:bg-slate-800 active:scale-95 transition-all text-xs font-bold text-slate-400 cursor-pointer flex items-center justify-center border border-slate-800/50"
                    >
                      C
                    </button>
                    {/* Zero */}
                    <button
                      onClick={() => {
                        if (pinInput.length < 4) setPinInput(prev => prev + '0');
                      }}
                      className="h-12 rounded-xl bg-slate-850 hover:bg-slate-800 active:scale-95 transition-all text-sm font-extrabold cursor-pointer border border-slate-800 hover:border-slate-700 flex items-center justify-center"
                    >
                      0
                    </button>
                    {/* Backspace delete */}
                    <button
                      onClick={() => setPinInput(prev => prev.slice(0, -1))}
                      className="h-12 rounded-xl bg-slate-950/40 hover:bg-slate-800 active:scale-95 transition-all text-xs font-bold text-slate-400 cursor-pointer flex items-center justify-center border border-slate-800/50"
                      title="退格"
                    >
                      Del
                    </button>
                  </div>

                  {/* Built-in default notes */}
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 select-none text-[10px] text-slate-500 text-left leading-relaxed space-y-0.5">
                    <p className="font-bold text-slate-400">💡 演示机出厂激活PIN：</p>
                    <p>• 管理员: <span className="font-mono text-emerald-400 font-extrabold">1234</span> (超级主管核销账目)</p>
                    <p>• 收银员: <span className="font-mono text-emerald-400 font-extrabold">5678</span> (标准挂单发卡权限)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE APPLICATION WRAPPER */
            <div className="absolute inset-x-0 top-7 bottom-0 flex flex-col bg-slate-100">
              
              {/* CART CHECKOUT MULTI STEP DECK */}
              {checkoutStep === 'cart' ? (
                /* STEP 1: PRODUCTS BROWSE AND CART WORKSPACE */
                <div className={`flex-1 flex overflow-hidden ${deviceType === 'iphone' ? 'flex-col' : ''}`}>
                  
                  {/* Left Side: Order Cart checkout ledger (iPad: 40% width, iPhone: adaptive) */}
                  <div className={`bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0 ${
                    deviceType === 'ipad' ? 'w-[380px]' : 'h-1/2 w-full'
                  }`}>
                    
                    {/* Cart Header */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                          {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                        <span className="font-bold text-xs text-slate-700">购物车点单明细</span>
                      </div>
                      <button
                        onClick={() => setCart([])}
                        disabled={cart.length === 0}
                        className="text-[10px] text-slate-400 hover:text-rose-500 transition-all font-bold disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                        title="清空当前点单"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>一键排空</span>
                      </button>
                    </div>

                    {/* Cart Scroll list */}
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-[350px] md:max-h-none">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none pt-12">
                          <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 text-slate-300 flex items-center justify-center mb-2">
                            🛒
                          </div>
                          <span className="text-[11px] text-slate-400 font-bold block">现收购物车为空</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">请扫描或点击右侧产品添加商品</span>
                          
                          {/* Fast add button */}
                          <button
                            onClick={handleSimulateBarcodeScan}
                            className="mt-3 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] text-slate-600 hover:bg-slate-200 transition-all font-bold cursor-pointer active:scale-95"
                          >
                            ⚡️ 快速激光扫描加购
                          </button>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div 
                            key={item.product.id} 
                            className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 flex items-center justify-between text-xs"
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <span className="font-bold text-slate-800 block truncate">{item.product.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">SKU: {item.product.sku}</span>
                              <span className="text-[11px] font-extrabold text-slate-700 font-mono mt-0.5">
                                €{item.product.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Qty adjust counts */}
                            <div className="flex items-center gap-2">
                              {/* Quantity Adjustment buttons */}
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                                <button
                                  onClick={() => handleAdjustQuantity(item.product.id, -1)}
                                  className="p-1 px-1.5 focus:outline-none hover:bg-slate-100 rounded-l-lg transition-colors cursor-pointer"
                                  title="减少数量"
                                >
                                  <Minus className="w-3 h-3 text-slate-500" />
                                </button>
                                <span className="px-2 text-xs font-mono font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleAdjustQuantity(item.product.id, 1)}
                                  className="p-1 px-1.5 focus:outline-none hover:bg-slate-100 rounded-r-lg transition-colors cursor-pointer"
                                  title="增加数量"
                                >
                                  <Plus className="w-3 h-3 text-slate-500" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveFromCart(item.product.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                                title="移出点单"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Sub totals & action drawer on bottom left */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2.5">
                      <div className="space-y-1.5 text-xs text-slate-500 font-mono">
                        <div className="flex justify-between">
                          <span>小计金额 Subtotal:</span>
                          <span className="text-slate-800 font-bold">€{cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>增值税 VAT (20%):</span>
                          <span className="text-slate-800 font-bold">€{cartTax.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-1" />
                        <div className="flex justify-between text-sm">
                          <span className="font-black text-slate-800">应付款 Total:</span>
                          <span className="font-extrabold text-emerald-600">€{cartTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleProcessCheckout}
                        disabled={cart.length === 0}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer disabled:opacity-50 active:scale-95 transition-all text-xs shadow-md"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>现场收银 / 点单结算</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Side: Grid of available products */}
                  <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 p-3 gap-3">
                    
                    {/* Category selectors header */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 select-none no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap transition-all cursor-pointer ${
                            selectedCategory === cat 
                              ? 'bg-zinc-900 text-white shadow-sm' 
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search and scanner quickbar */}
                    <div className="flex gap-2 shrink-0">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="搜索门市商品、材质、或输入SKU编号..."
                          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-zinc-800"
                        />
                      </div>

                      <button
                        onClick={handleSimulateBarcodeScan}
                        className="px-3 bg-zinc-850 hover:bg-zinc-850 hover:opacity-90 active:scale-95 rounded-xl text-white font-bold text-[10px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0 border border-zinc-700"
                        title="条码枪红外模拟"
                      >
                        <Barcode className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="hidden sm:inline">扫描商品</span>
                      </button>
                    </div>

                    {/* Products Grid list scrollable */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      {filteredProducts.length === 0 ? (
                        <div className="h-full bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl">🔍</span>
                          <p className="text-[11px] font-bold text-slate-400 mt-2">未发现任何过滤匹配的门市商品</p>
                          <p className="text-[9px] text-slate-400">请尝试更换检索关键字，或添加新商品</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-6">
                          {filteredProducts.map((p) => {
                            const isLow = p.stock <= p.minStockThreshold;
                            const isOut = p.stock === 0;

                            return (
                              <button
                                key={p.id}
                                onClick={() => handleAddToCart(p)}
                                disabled={isOut}
                                className={`p-2 bg-white border border-slate-200 hover:border-zinc-800 active:scale-97 transition-all rounded-xl text-left flex flex-col justify-between h-[115px] cursor-pointer shadow-2xs group relative ${
                                  isOut ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 select-none">
                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-bold uppercase tracking-tight block truncate max-w-[85px]">
                                      {p.category || '其它'}
                                    </span>
                                    
                                    {isOut ? (
                                      <span className="text-[8px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-black font-sans leading-none shrink-0">
                                        售空
                                      </span>
                                    ) : isLow ? (
                                      <span className="text-[8px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-black font-sans leading-none shrink-0 animate-pulse">
                                        预警
                                      </span>
                                    ) : null}
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-800 tracking-tight mt-1 group-hover:text-emerald-600 line-clamp-2 leading-tight">
                                    {p.name}
                                  </h4>
                                </div>

                                <div className="flex justify-between items-end mt-1.5 border-t border-slate-100 pt-1.5 w-full">
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    库:{p.stock}
                                  </span>
                                  <span className="text-xs font-black font-mono text-zinc-900">
                                    €{p.price.toFixed(2)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              ) : checkoutStep === 'payment' ? (
                /* STEP 2: PAYMENT METHOD DECK */
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
                  <div className="max-w-md w-full bg-white border border-slate-200 p-5 rounded-2xl shadow-lg space-y-4 text-left">
                    <div className="flex justify-between items-center pb-3 border-b border-secondary">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-800">门市快速结算收款</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">请指导顾客选择适合的媒介结算</p>
                      </div>
                      <button
                        onClick={() => setCheckoutStep('cart')}
                        disabled={paymentProcessing}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 cursor-pointer"
                        title="取消付款返回"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total Amount Display */}
                    <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-3.5 text-center shadow-inner">
                      <span className="text-[10px] text-zinc-400 block tracking-widest uppercase">应收款 (Total Due)</span>
                      <span className="text-2xl font-black font-mono text-emerald-400">€{cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Method selector boxes */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod('card')}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'card' 
                            ? 'bg-zinc-900 border-zinc-950 text-white shadow-md' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#07C2E3]' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">插卡/刷卡</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod('cash')}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'cash' 
                            ? 'bg-zinc-900 border-zinc-950 text-white shadow-md' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <DollarSign className={`w-5 h-5 ${paymentMethod === 'cash' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">现金收款</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod('scan')}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'scan' 
                            ? 'bg-zinc-900 border-zinc-950 text-white shadow-md' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <QrCode className={`w-5 h-5 ${paymentMethod === 'scan' ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">扫码支付</span>
                      </button>
                    </div>

                    {/* Cash Tendered Sub-panel */}
                    {paymentMethod === 'cash' && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2.5 animate-fadeIn">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">
                            实收现钞 (Cash Tendered)
                          </label>
                          <div className="flex gap-2 mt-1">
                            <span className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 text-xs font-bold">€</span>
                            <input
                              type="number"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        {/* Fast change buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {[5, 10, 20, 50, 100].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setCashReceived(val.toString());
                              }}
                              className="px-2.5 py-1 text-[10px] bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-200 cursor-pointer"
                            >
                              +{val}
                            </button>
                          ))}
                        </div>

                        {parseFloat(cashReceived) >= cartTotal && (
                          <div className="flex justify-between items-center text-xs font-bold p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                            <span className="text-slate-500">应退找零 (Change Due):</span>
                            <span className="text-emerald-600 font-mono text-sm font-extrabold">
                              €{(parseFloat(cashReceived) - cartTotal).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* QR SCAN SPECIFICS */}
                    {paymentMethod === 'scan' && (
                      <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl flex items-center justify-between gap-4 animate-fadeIn">
                        <div className="space-y-0.5 max-w-[200px]">
                          <span className="text-[9px] bg-indigo-950 border border-indigo-900 text-indigo-400 px-1 rounded-sm uppercase tracking-wider font-bold">
                            Alipay / WeChat / PayPal
                          </span>
                          <p className="text-[10px] text-zinc-300 leading-tight">客户可通过微信或支付宝等扫描电子屏幕或附带纸卡聚合二维码快速结算</p>
                        </div>
                        <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0">
                          <div className="w-full h-full bg-neutral-200 rounded flex items-center justify-center text-zinc-800">
                            QR
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Reader terminal simulator interface */}
                    {paymentMethod === 'card' && (
                      <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl flex items-center gap-3 animate-fadeIn">
                        <div className="p-2 rounded bg-slate-800 flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-[#07C2E3]." />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] text-slate-400 block font-bold leading-none">TERMINAL HARDWARE READY</span>
                          <span className="text-xs font-bold text-slate-200 block mt-1">Adyen PAX - 欧洲零售联名终端</span>
                          <span className="text-[10px] text-slate-500 block">请顾客把卡片轻贴射频触控板或将其滑入插槽</span>
                        </div>
                      </div>
                    )}

                    {/* Submit footer trigger buttons */}
                    <div className="pt-2">
                      <button
                        onClick={handleCompletePayment}
                        disabled={!paymentMethod || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < cartTotal)) || paymentProcessing}
                        className="w-full h-11 bg-zinc-950 hover:bg-zinc-850 active:scale-95 transition-all text-white font-extrabold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        {paymentProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>正在和 Adyen 分配网核算支付...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>确认结算，打印/发送账单</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* STEP 3: TRANSACTION SUCCESS & RECEIPT INVOICE DRAWER */
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
                  <div className="max-w-md w-full bg-white border border-slate-200 p-5 rounded-2xl shadow-lg space-y-4 text-left">
                    
                    {/* Tick box success circle */}
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-xl">
                        <Check className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-800">支付交易完成 [并网销账]</h3>
                      <p className="text-[10px] text-slate-400">
                        收据单号: <span className="font-mono font-bold text-slate-700">{lastCreatedOrder?.id}</span>
                      </p>
                    </div>

                    {/* Real invoice layout details */}
                    <div className="border border-slate-200/90 rounded-xl bg-slate-50 p-3 space-y-2.5 font-sans leading-relaxed text-slate-700">
                      
                      <div className="border-b border-dashed border-slate-300 pb-2.5 text-center text-[10px] space-y-1 select-none">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">ECOS 门市商业零售收据</h4>
                        <p className="text-slate-400">{lastCreatedOrder?.createdAt}</p>
                        <p className="text-slate-400">收银操作员: {activeCashier?.name}</p>
                      </div>

                      {/* Item loop list */}
                      <div className="space-y-1.5 text-[11px] font-mono leading-relaxed max-h-[140px] overflow-y-auto">
                        {lastCreatedOrder?.items?.map((item, id) => (
                          <div key={id} className="flex justify-between">
                            <span className="truncate pr-4">{item.name} x {item.quantity || item.qty || 1}</span>
                            <span className="shrink-0">€{((item.price) * (item.quantity || item.qty || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-slate-300 pt-2 text-[11px] font-mono leading-relaxed space-y-0.5">
                        <div className="flex justify-between">
                          <span>税前小计 Subtotal:</span>
                          <span>€{(lastCreatedOrder?.total ? (lastCreatedOrder.total / 1.20) : 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>欧盟统一增值税 VAT (20%):</span>
                          <span>€{(lastCreatedOrder?.total ? (lastCreatedOrder.total - (lastCreatedOrder.total / 1.20)) : 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-xs text-slate-800">
                          <span>全额总计 Total:</span>
                          <span>€{lastCreatedOrder?.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span>支付媒介 (Payment Method):</span>
                          <span>{lastCreatedOrder?.paymentMethod}</span>
                        </div>
                      </div>

                    </div>

                    {/* Printer and emailing controllers */}
                    <div className="space-y-2.5 select-none text-xs">
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handlePrintReceipt}
                          disabled={isPrinting}
                          className="flex items-center justify-center gap-1.5 h-10 bg-slate-100 hover:bg-slate-200 enabled:active:scale-97 text-slate-700 font-extrabold rounded-xl border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Printer className={`w-3.5 h-3.5 ${isPrinting ? 'animate-bounce' : ''}`} />
                          <span>{isPrinting ? '正在打印收据...' : '打印热敏小票'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setCheckoutStep('cart');
                            addLog('POS Terminal', '解锁新点单会话', '开始迎接下一趟门售收银事务', 'info');
                          }}
                          className="flex items-center justify-center gap-1 my-0 border bg-zinc-950 border-zinc-900 text-white hover:bg-zinc-850 active:scale-95 transition-all font-bold h-10 rounded-xl cursor-pointer"
                        >
                          <span>接续下一单</span>
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Electronic Invoice e-receipt */}
                      <form onSubmit={handleSendEmailReceipt} className="bg-slate-50 p-2.5 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#07C2E3]" />
                            <span>发送电子收据 PDF 到邮箱</span>
                          </label>
                          {receiptSentMessage && (
                            <span className="text-[10px] text-emerald-600 font-bold">{receiptSentMessage}</span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="email"
                            value={emailForReceipt}
                            onChange={(e) => setEmailForReceipt(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                            placeholder="customer@example.eu"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-750 text-white text-[10px] font-black px-3.5 rounded-lg active:scale-95 transition-all shrink-0 cursor-pointer"
                          >
                            发送
                          </button>
                        </div>
                      </form>

                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Outer buttons designs on side of the tablet frame */}
        <div className="absolute top-24 -right-1.5 w-[6px] h-12 bg-zinc-800 rounded-l" />
        <div className="absolute top-40 -right-1.5 w-[6px] h-16 bg-zinc-800 rounded-l" />
      </div>

      {/* HARDWARE AND CASHIERS PRESET TRIGGERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-1 bg-slate-100 p-4 rounded-2xl border border-slate-200/60 select-none">
        
        {/* Hardware Devices simulator switches */}
        <div className="space-y-2 text-left">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>智能 POS 物理硬件配属面板</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">配置收银台所挂连的有线和蓝牙物理商用设备，仿真插拔与报错阻断</p>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            
            <button
              onClick={() => {
                setIsCardReaderConnected(!isCardReaderConnected);
                addLog('POS Hardware', 'Adyen刷卡机物理重组', `Adyen 读卡器连接状态调校为：${!isCardReaderConnected ? '接入' : '挂起'}`, 'warning');
              }}
              className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs transition-all cursor-pointer ${
                isCardReaderConnected 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[9px] font-bold">Adyen 读卡器</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isCardReaderConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-650'}`}>
                {isCardReaderConnected ? 'ONLINE' : 'DISCONNECT'}
              </span>
            </button>

            <button
              onClick={() => {
                setIsPrinterConnected(!isPrinterConnected);
                addLog('POS Hardware', '自备热敏打印机挂接', `热敏纸打印连接调校为：${!isPrinterConnected ? '在线联通' : '离线拔除'}`, 'warning');
              }}
              className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs transition-all cursor-pointer ${
                isPrinterConnected 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
              }`}
            >
              <Printer className="w-5 h-5" />
              <span className="text-[9px] font-bold">收据热敏打印机</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isPrinterConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-650'}`}>
                {isPrinterConnected ? 'ONLINE' : 'DISCONNECT'}
              </span>
            </button>

            <button
              onClick={() => {
                setIsScannerConnected(!isScannerConnected);
                addLog('POS Hardware', '激光条码枪线路调整', `红外条码扫描模组连接状态：${!isScannerConnected ? '已接入' : '离线拔除'}`, 'warning');
              }}
              className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-1 text-xs transition-all cursor-pointer ${
                isScannerConnected 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                  : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
              }`}
            >
              <Barcode className="w-5 h-5" />
              <span className="text-[9px] font-bold">红外条码扫描枪</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isScannerConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-650'}`}>
                {isScannerConnected ? 'ONLINE' : 'DISCONNECT'}
              </span>
            </button>

          </div>
        </div>

        {/* Cashier logs ledger review */}
        <div className="space-y-2 text-left">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5 animate-fadeIn">
            <Users className="w-4 h-4 text-[#07C2E3]" />
            <span>当班收银日志与流水指标</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">查看当前授权在 POS 柜面从事挂卡核销、现金存取的员工流水记录</p>
          
          <div className="bg-white border border-slate-200 rounded-xl max-h-[110px] overflow-y-auto p-2.5 space-y-2">
            {cashiers.map((c) => (
              <div key={c.id} className="flex justify-between items-center text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  <span className="font-extrabold text-slate-700">{c.name}</span>
                  <span className="bg-slate-100 px-1 text-slate-400 rounded scale-90">{c.id}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span>Pin: <span className="font-mono bg-slate-50 px-1 border select-text font-bold">{c.pin}</span></span>
                  <span className="font-extrabold text-indigo-600">销售件数: {c.salesCount} 件</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CASHIER CREATION MODAL MODAL */}
      {showCashierModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[9999] select-none text-left p-4">
          <div className="bg-white border border-slate-250 p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative animate-scaleUp">
            
            <button
              onClick={() => setShowCashierModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>授权新门店收银账号 & 密码</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">赋予前台 iPad 一卡解锁 POS 并结账的安全职责</p>
            </div>

            <form onSubmit={handleCreateCashier} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">员工姓名 (Staff Name)</label>
                <input
                  type="text"
                  required
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  placeholder="如: 王美美"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold">设置 4 位解锁 PIN 码</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  pattern="\d{4}"
                  value={newCashierPin}
                  onChange={(e) => setNewCashierPin(e.target.value)}
                  placeholder="1234 (四个纯数字)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold">选择操作角色</label>
                <select
                  value={newCashierRole}
                  onChange={(e) => setNewCashierRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer"
                >
                  <option value="Cashier">Cashier (仅收银及找零)</option>
                  <option value="Store Manager">Store Manager (支持主管核退订单)</option>
                  <option value="Admin">Admin (超级全权限主管)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-zinc-950 hover:bg-zinc-850 active:scale-95 transition-all text-white font-extrabold rounded-xl cursor-pointer"
              >
                新增授权账号
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
