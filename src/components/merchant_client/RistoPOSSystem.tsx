import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Smartphone, 
  Printer, 
  Clock, 
  Plus, 
  Minus, 
  Check, 
  AlertTriangle, 
  DollarSign, 
  QrCode, 
  Heart, 
  ChevronRight, 
  RefreshCw, 
  Shuffle, 
  Compass, 
  Cpu, 
  Award, 
  Trash2, 
  Truck, 
  Calendar,
  Lock,
  Globe,
  Bell,
  X
} from 'lucide-react';
import { ProductItem, OrderItem } from '../../types';

interface RistoPOSSystemProps {
  products: ProductItem[];
  orders: OrderItem[];
  onUpdateProducts: (updated: ProductItem[]) => void;
  onUpdateOrders: (updated: OrderItem[]) => void;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  selectedIndustry: string;
}

interface RestaurantTable {
  id: string;
  name: string;
  status: 'Libero' | 'Prenotato' | 'Occupato' | 'Da pulire';
  currentOrderId: string | null;
  currentItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  coverCount: number;
  waiterId?: string;
}

interface Reservation {
  id: string;
  name: string;
  time: string;
  covers: number;
  tableId?: string;
  source: 'TheFork' | 'OpenTable' | 'Telefono';
  status: 'Pending' | 'Confirmed' | 'Seated';
}

interface DeliveryOrder {
  id: string;
  source: 'Just Eat' | 'Deliveroo' | 'Uber Eats' | 'Glovo' | 'Sito Web';
  items: { name: string; quantity: number }[];
  total: number;
  status: 'Nuovo' | 'In Preparazione' | 'Pronto' | 'Spedito';
  createdAt: string;
}

export default function RistoPOSSystem({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
  addLog,
  selectedIndustry
}: RistoPOSSystemProps) {
  // Navigation Tabs matching 7 MVP + 1 European Specialized modules
  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'tables' | 'kds' | 'reservations' | 'aggregati' | 'report' | 'fiscal'>('pos');
  
  // Tables state initialized with local variables
  const [tables, setTables] = useState<RestaurantTable[]>([
    { id: 'T-01', name: 'Tavolo 1 (2 pax)', status: 'Occupato', currentOrderId: 'R-1004', currentItems: [{ productId: 'p1', name: 'Pizza Margherita (经典玛格丽特配罗勒)', price: 8.50, quantity: 2, notes: 'Extra Mozzarella di Bufala' }, { productId: 'p2', name: 'Lasagne alla Bolognese (意式经典肉酱千层面)', price: 12.00, quantity: 1 }], coverCount: 2 },
    { id: 'T-02', name: 'Tavolo 2 (4 pax)', status: 'Libero', currentOrderId: null, currentItems: [], coverCount: 4 },
    { id: 'T-03', name: 'Tavolo 3 (2 pax)', status: 'Prenotato', currentOrderId: null, currentItems: [], coverCount: 2 },
    { id: 'T-04', name: 'Tavolo 4 (6 pax)', status: 'Occupato', currentOrderId: 'R-1005', currentItems: [{ productId: 'p3', name: 'Tagliata di Manzo (基安蒂经典安格斯牛排)', price: 24.50, quantity: 3, notes: 'Medium rare (三分熟)' }, { productId: 'p4', name: 'Chianti Classico DOCG (红葡萄酒)', price: 32.00, quantity: 1 }], coverCount: 5 },
    { id: 'T-05', name: 'Tavolo 5 (4 pax)', status: 'Da pulire', currentOrderId: null, currentItems: [], coverCount: 0 },
    { id: 'T-06', name: 'Tavolo 6 (2 pax)', status: 'Libero', currentOrderId: null, currentItems: [], coverCount: 0 },
    { id: 'T-07', name: 'Tavolo 7 (8 pax - Privé)', status: 'Libero', currentOrderId: null, currentItems: [], coverCount: 0 },
    { id: 'T-08', name: 'Tavolo 8 (4 pax)', status: 'Occupato', currentOrderId: 'R-1006', currentItems: [{ productId: 'p1', name: 'Pizza Margherita ( 玛格丽特)', price: 8.50, quantity: 1 }, { productId: 'p5', name: 'Tiramisù della Casa (自制经典提拉米苏)', price: 6.50, quantity: 1 }], coverCount: 1 }
  ]);

  const [activeTableId, setActiveTableId] = useState<string>('T-01');

  // Reservations state (TheFork / OpenTable)
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'RES-01', name: 'Giuseppe Verdi', time: '19:30', covers: 2, tableId: 'T-03', source: 'TheFork', status: 'Confirmed' },
    { id: 'RES-02', name: 'Prof. Bianchi', time: '20:00', covers: 4, tableId: 'T-02', source: 'Telefono', status: 'Confirmed' },
    { id: 'RES-03', name: 'Alice Smith (Tourist)', time: '20:30', covers: 2, tableId: 'T-06', source: 'OpenTable', status: 'Pending' }
  ]);

  // Delivery aggregator API order streams (Deliveroo, Uber Eats, Just Eat, Glovo)
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    { id: 'DEL-9921', source: 'Deliveroo', items: [{ name: 'Pizza Diavola (辣萨拉米披萨)', quantity: 2 }, { name: 'Coca Cola Zero', quantity: 2 }], total: 21.00, status: 'Nuovo', createdAt: '19:10' },
    { id: 'DEL-3820', source: 'Uber Eats', items: [{ name: 'Risotto ai Funghi Porcini (牛肝菌意式炖饭)', quantity: 1 }, { name: 'Panna Cotta (意式奶酪杯)', quantity: 1 }], total: 20.50, status: 'In Preparazione', createdAt: '19:05' },
    { id: 'DEL-1049', source: 'Just Eat', items: [{ name: 'Spaghetti alle Vongole (经典新鲜白葡萄酒蚬子面)', quantity: 2 }], total: 28.00, status: 'Pronto', createdAt: '18:50' },
    { id: 'DEL-8841', source: 'Glovo', items: [{ name: 'Calzone Fritto (油炸披萨饺)', quantity: 1 }], total: 10.00, status: 'Nuovo', createdAt: '19:15' }
  ]);

  // KDS kitchen queue (Comande Cucina)
  const [kdsOrders, setKdsOrders] = useState<any[]>([
    { id: 'KDS-101', table: 'Tavolo 1', items: [{ name: 'Pizza Margherita', quantity: 2, notes: 'Extra Mozzarella' }, { name: 'Lasagne alla Bolognese', quantity: 1 }], type: '堂食', status: 'In Preparazione', time: '15 Min fa' },
    { id: 'KDS-102', table: 'Tavolo 4', items: [{ name: 'Tagliata di Manzo', quantity: 3, notes: 'Medium rare' }], type: '堂食', status: 'Nuovo', time: '5 Min fa' },
    { id: 'KDS-103', table: 'Glovo-DEL-8841', items: [{ name: 'Calzone Fritto', quantity: 1 }], type: '外卖', status: 'Nuovo', time: '2 Min fa' }
  ]);

  // QR Mobile Customer Simulator Popup
  const [showQRSimulator, setShowQRSimulator] = useState<boolean>(false);
  const [simSelectedTableId, setSimSelectedTableId] = useState<string>('T-02');
  const [simCart, setSimCart] = useState<{ [k: string]: number }>({});
  const [simStep, setSimStep] = useState<'browse' | 'success'>('browse');

  // Fiscal Receipt State & Agenzia delle Entrate Z-Closure logs (Italian Tax Law)
  const [fiscalReceipts, setFiscalReceipts] = useState<any[]>([
    { id: 'SCONTR-2026-0038', time: '13:12', total: 29.00, table: 'Tavolo 1', taxCode: 'RT 48A92813', lotteriaCode: '9XJ3L10Q' },
    { id: 'SCONTR-2026-0037', time: '12:45', total: 56.50, table: 'Tavolo 4', taxCode: 'RT 48A92813', lotteriaCode: 'XY81K09W' }
  ]);
  const [isFiscallyConnecting, setIsFiscallyConnecting] = useState<boolean>(false);

  // New Reservation Form
  const [newResName, setNewResName] = useState<string>('');
  const [newResTime, setNewResTime] = useState<string>('20:00');
  const [newResCovers, setNewResCovers] = useState<number>(2);
  const [newResSource, setNewResSource] = useState<'TheFork' | 'OpenTable' | 'Telefono'>('Telefono');

  // Interactive cart inside POS view for ACTIVE selected table
  const selectedTable = tables.find(t => t.id === activeTableId) || tables[0];

  // Helper menu catalog of local food items (Bilingual Italian / Chinese)
  const menuCatalog = [
    { id: 'm1', name: 'Pizza Margherita (玛格丽特披萨)', price: 8.50, category: 'Le Pizze', desc: 'Salsa di pomodoro, mozzarella fior di latte, basilico fresco, olio EVO' },
    { id: 'm2', name: 'Pizza Diavola (恶魔辣肠披萨)', price: 10.00, category: 'Le Pizze', desc: 'Pomodoro, mozzarella, salame piccante italiano, origano' },
    { id: 'm3', name: 'Spaghetti alla Carbonara (经典黑椒培根面)', price: 13.50, category: 'I Primi', desc: 'Guanciale croccante, tuorlo d\'uovo, pecorino romano DOP, pepe nero' },
    { id: 'm4', name: 'Tagliata di Manzo (托斯卡纳安格斯牛排)', price: 24.50, category: 'I Secondi', desc: 'Contorno di rucola, pomodorini secchi e scaglie di Grana Padano' },
    { id: 'm5', name: 'Frittura di Calamari (意式香炸鱿鱼圈)', price: 16.00, category: 'Antipasti', desc: 'Calamari freschi fritti dorati serviti con maionese al limone' },
    { id: 'm6', name: 'Tiramisù della Casa (手工提拉米苏)', price: 6.50, category: 'I Dolci', desc: 'Mascarpone, savoiardi inzuppati nel caffè espresso, polvere di cacao' },
    { id: 'm7', name: 'Panna Cotta al Lamone (树莓潘纳哥特奶酪)', price: 5.50, category: 'I Dolci', desc: 'Panna cotta artigianale con coulis fresco di lamponi wild' },
    { id: 'm8', name: 'Acqua Minerale Gasata 75cl (含气矿泉水)', price: 3.00, category: 'Bevande', desc: 'San Pellegrino DOC' },
    { id: 'm9', name: 'Chianti Classico Chiantigiana (基安蒂经典红酒)', price: 32.00, category: 'Bevande', desc: 'Sangiovese blend, vino rosso corposo toscano' }
  ];

  // 1. Core POS Ordering Handlers
  const handleAddToTableCart = (menuItem: typeof menuCatalog[0], customNotes = '') => {
    // Force open table if free/dirty
    setTables(prev => prev.map(t => {
      if (t.id === activeTableId) {
        let updatedItems = [...t.currentItems];
        const existing = updatedItems.find(item => item.productId === menuItem.id);
        
        if (existing) {
          updatedItems = updatedItems.map(item => 
            item.productId === menuItem.id 
              ? { ...item, quantity: item.quantity + 1, notes: customNotes || item.notes } 
              : item
          );
        } else {
          updatedItems.push({
            productId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            notes: customNotes
          });
        }
        
        return {
          ...t,
          status: 'Occupato',
          currentItems: updatedItems,
          coverCount: t.coverCount === 0 ? 2 : t.coverCount // Assure basic cover count
        };
      }
      return t;
    }));
    
    addLog('RistoPOS', '餐台加菜', `餐台 「${selectedTable.name}」 成功点入 1份「${menuItem.name}」`, 'info');
  };

  const handleAdjustTableItemQty = (productId: string, delta: number) => {
    setTables(prev => prev.map(t => {
      if (t.id === activeTableId) {
        const updated = t.currentItems.map(item => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        }).filter(Boolean) as any[];

        return {
          ...t,
          currentItems: updated,
          status: updated.length === 0 ? 'Da pulire' : 'Occupato'
        };
      }
      return t;
    }));
  };

  // Switch tables (换桌)
  const handleSwitchTablePlace = (fromTableId: string, toTableId: string) => {
    const fromTable = tables.find(t => t.id === fromTableId);
    const toTable = tables.find(t => t.id === toTableId);
    
    if (!fromTable || !toTable) return;
    if (toTable.status !== 'Libero') {
      addLog('RistoPOS', '换桌拒绝', `目标餐桌「${toTable.name}」非空闲状态，不能交换`, 'warning');
      return;
    }

    setTables(prev => prev.map(t => {
      if (t.id === fromTableId) {
        return { ...t, status: 'Da pulire', currentItems: [], currentOrderId: null, coverCount: 0 };
      }
      if (t.id === toTableId) {
        return { 
          ...t, 
          status: 'Occupato', 
          currentItems: fromTable.currentItems, 
          currentOrderId: fromTable.currentOrderId || `R-${Date.now().toString().slice(-4)}`,
          coverCount: fromTable.coverCount
        };
      }
      return t;
    }));

    addLog('RistoPOS', '点单换桌成功', `已将「${fromTable.name}」换至「${toTable.name}」，挂账消费和出餐要求无缝迁移。`, 'success');
  };

  // Merge tables (合单 / 拼桌)
  const handleMergeTables = (targetId: string, destId: string) => {
    const sourceTable = tables.find(t => t.id === targetId);
    const destTable = tables.find(t => t.id === destId);
    if (!sourceTable || !destTable) return;

    setTables(prev => prev.map(t => {
      if (t.id === targetId) {
        return { ...t, status: 'Da pulire', currentItems: [], currentOrderId: null, coverCount: 0 };
      }
      if (t.id === destId) {
        // Merge item accounts
        const mergedList = [...destTable.currentItems];
        sourceTable.currentItems.forEach(srcItem => {
          const match = mergedList.find(i => i.productId === srcItem.productId);
          if (match) {
            match.quantity += srcItem.quantity;
          } else {
            mergedList.push({ ...srcItem });
          }
        });

        return {
          ...t,
          status: 'Occupato',
          currentItems: mergedList,
          coverCount: t.coverCount + sourceTable.coverCount
        };
      }
      return t;
    }));

    addLog('RistoPOS', '拼桌合单合流', `已把餐台「${sourceTable.name}」的点单项目成功合并至「${destTable.name}」中统一付款。`, 'success');
  };

  // Table status setter
  const handleSetTableStatus = (tableId: string, nextStatus: 'Libero' | 'Da pulire' | 'Prenotato') => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { 
          ...t, 
          status: nextStatus,
          currentItems: nextStatus === 'Libero' ? [] : t.currentItems,
          coverCount: nextStatus === 'Libero' ? 0 : t.coverCount
        };
      }
      return t;
    }));
    addLog('RistoPOS', '台位状态变更', `已将桌号「${tableId}」的状态变更为「${nextStatus}」`, 'info');
  };

  // Send Active table items to Kitchen KDS
  const handleSendToKitchenKDS = () => {
    if (selectedTable.currentItems.length === 0) return;

    const newKdsId = `KDS-${Date.now().toString().slice(-3)}`;
    const newKdsItem = {
      id: newKdsId,
      table: selectedTable.name,
      items: selectedTable.currentItems.map(i => ({ name: i.name, quantity: i.quantity, notes: i.notes })),
      type: '堂食',
      status: 'Nuovo',
      time: 'Iniziato'
    };

    setKdsOrders(prev => [newKdsItem, ...prev]);
    addLog('RistoKDS', '小票传送成功', `已向后厨 KDS 传输「${selectedTable.name}」的追加点单小票，共 ${selectedTable.currentItems.length} 道佳肴。`, 'success');
  };

  // Pay/Checkout table items, support Split billing (分单) or Full payment (买单)
  const handleCheckoutTable = (tableId: string, payStyle: 'full' | 'split') => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.currentItems.length === 0) return;

    const subtotal = table.currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const copertoFee = table.coverCount * 2.0; // 意大利典型的服务费/餐位费 Coperto (每人大约 1.50 ~ 2.50 欧)
    const activeVat = subtotal * 0.10; // 欧盟餐饮标准10%增值税
    const grandTotal = subtotal + copertoFee + activeVat;

    // Send Italian Local Fiscal Telematico
    const scontrCode = `SCONTR-2026-00${fiscalReceipts.length + 39}`;
    const newFiscalObj = {
      id: scontrCode,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: payStyle === 'split' ? grandTotal / 2 : grandTotal,
      table: table.name,
      taxCode: 'RT 48A92813',
      lotteriaCode: Math.random().toString(36).substr(2, 8).toUpperCase()
    };

    setFiscalReceipts(prev => [newFiscalObj, ...prev]);

    // Update global store orders for financial reconciliation
    const orderItemsMapped = table.currentItems.map(i => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity
    }));

    const globalOrder: OrderItem = {
      id: `RST-${Date.now().toString().slice(-8)}`,
      customerName: `${table.name} 堂食结算${payStyle === 'split' ? ' (1/2 分账比例支付)' : ''}`,
      contact: '意大利餐饮端 POS',
      total: payStyle === 'split' ? grandTotal / 2 : grandTotal,
      status: 'Completed',
      createdAt: new Date().toLocaleString(),
      riskScore: 0,
      paymentMethod: 'Nexi POS - 国际插卡结算',
      items: orderItemsMapped
    };

    onUpdateOrders([globalOrder, ...orders]);

    if (payStyle === 'full') {
      setTables(prev => prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            status: 'Da pulire',
            currentItems: [],
            currentOrderId: null,
            coverCount: 0
          };
        }
        return t;
      }));
      addLog('RistoPOS', '全额结算买单', `餐位「${table.name}」完成全额付欧。总金额: €${grandTotal.toFixed(2)} (含餐位费 Coperto: €${copertoFee.toFixed(2)} + 10% VAT: €${activeVat.toFixed(2)})，小票和扣税单就绪。`, 'success');
    } else {
      // Split 1/2
      setTables(prev => prev.map(t => {
        if (t.id === tableId) {
          // decrement quantities or just halve the prices
          const updatedItems = t.currentItems.map(item => ({
            ...item,
            quantity: Math.max(1, Math.ceil(item.quantity / 2))
          }));
          return {
            ...t,
            currentItems: updatedItems,
            coverCount: Math.max(1, Math.ceil(t.coverCount / 2))
          };
        }
        return t;
      }));
      addLog('RistoPOS', '分账分单部分结算', `餐位「${table.name}」分单 1/2 额度支付成功，已扣减一半账目并打印第一张合规小票：€${(grandTotal/2).toFixed(2)}`, 'success');
    }
  };

  // Reservatons - seats booking (预订安排)
  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim()) return;

    // Auto find an empty table matching covers
    const emptyTable = tables.find(t => t.status === 'Libero' && t.currentItems.length === 0);

    const matchTableId = emptyTable?.id;

    const newRes: Reservation = {
      id: `RES-0${reservations.length + 1}`,
      name: newResName,
      time: newResTime,
      covers: newResCovers,
      tableId: matchTableId,
      source: newResSource,
      status: 'Confirmed'
    };

    setReservations(prev => [...prev, newRes]);
    
    // Set table state to Prenotato
    if (matchTableId) {
      setTables(prev => prev.map(t => {
        if (t.id === matchTableId) {
          return { ...t, status: 'Prenotato' };
        }
        return t;
      }));
    }

    addLog('RistoBookings', '预订录入并排座', `成功录入来自 ${newResSource} 的订座：${newResName} (${newResCovers}人，预约时间: ${newResTime})。自动绑定空闲餐位「${emptyTable?.name || '候补区'}」`, 'success');
    setNewResName('');
  };

  const handleSeatCustomer = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'Seated' } : r));

    setTables(prev => prev.map(t => {
      if (t.id === res.tableId) {
        return {
          ...t,
          status: 'Occupato',
          coverCount: res.covers,
          currentOrderId: `R-${Date.now().toString().slice(-4)}`
        };
      }
      return t;
    }));

    addLog('RistoPOS', '引领顾客入座', `预订贵宾「${res.name}」抵达门店，已妥善引领其到「Tavolo ${res.tableId?.replace('T-','') || '候补' }」餐台入座开台！`, 'success');
  };

  // QR self-order simulations
  const handleSimulateQRClientOrder = () => {
    // Collect from simCart
    const orderItems: any[] = [];
    let logSummary: string[] = [];

    Object.entries(simCart).forEach(([itemId, qty]) => {
      const match = menuCatalog.find(m => m.id === itemId);
      if (match && qty > 0) {
        orderItems.push({
          productId: match.id,
          name: match.name,
          price: match.price,
          quantity: qty,
          notes: 'QR扫码线上下单'
        });
        logSummary.push(`${match.name} x${qty}`);
      }
    });

    if (orderItems.length === 0) return;

    // Apply to selected table
    setTables(prev => prev.map(t => {
      if (t.id === simSelectedTableId) {
        return {
          ...t,
          status: 'Occupato',
          currentItems: [...t.currentItems, ...orderItems],
          coverCount: t.coverCount === 0 ? 3 : t.coverCount
        };
      }
      return t;
    }));

    // Trigger kitchen comande queue automatically!
    const newKdsId = `KDS-${Date.now().toString().slice(-3)}`;
    const newKdsItem = {
      id: newKdsId,
      table: tables.find(t => t.id === simSelectedTableId)?.name || '未知桌号',
      items: orderItems.map(i => ({ name: i.name, quantity: i.quantity, notes: i.notes })),
      type: '扫码自助',
      status: 'Nuovo',
      time: 'Iniziato'
    };
    setKdsOrders(prev => [newKdsItem, ...prev]);

    addLog('QR Self Service', '移动端自助加塞', `桌台「${simSelectedTableId}」顾客通过智能每桌二维码下单成功！点单明细：[${logSummary.join(', ')}]。已透传至厨房 KDS 直接开始烹饪`, 'success');

    setSimStep('success');
    setSimCart({});
  };

  // Accept Third Party aggregator delivery order (Deliveroo/Just Eat / Glovo)
  const handleAcceptDeliveryGroup = (orderId: string) => {
    setDeliveryOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'In Preparazione' } : o));
    const order = deliveryOrders.find(o => o.id === orderId);
    if (!order) return;

    // Inject to Kitchen queue
    const kdsItem = {
      id: `KDS-${orderId.slice(-3)}`,
      table: `${order.source}-${orderId}`,
      items: order.items,
      type: '外卖',
      status: 'In Preparazione',
      time: 'Appena accettato'
    };
    setKdsOrders(prev => [kdsItem, ...prev]);

    addLog('Delivery Hub', '接单成功', `已接收来自 ${order.source} 的外卖呼叫 [${orderId}]，自动对接厨房 KDS 拼板出厂，无需服务员手动二次录入。`, 'success');
  };

  // Daily Fiscal Z-Closure simulation (欧洲/意大利极为核心的 Chiusura Giornaliera Telematico Z)
  const handleSimulateDailyFiscalZ = () => {
    setIsFiscallyConnecting(true);
    addLog('Fiscal Bridge', '连接本地税控硬件', '开机轮询：正在通过 RS232 串口或局域网 IP 与 Nexi / Custom S.p.A. 财税存储打印一体机连接...', 'info');

    setTimeout(() => {
      const todayTotal = fiscalReceipts.reduce((sum, r) => sum + r.total, 0);
      setIsFiscallyConnecting(false);
      
      addLog('Fiscal Revenue', '财政发票Z日结申报成功', `Chiusura Fiscale Z38290 已成功封账发出！今日门市完税申报额: €${todayTotal.toFixed(2)}，经由高保密数据链顺利发送至意大利税务总局 (Agenzia delle Entrate) 网关。`, 'success');
    }, 2500);
  };

  // Total income stats for report tab
  const totalIncomingEuro = fiscalReceipts.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[850px] shadow-2xl text-slate-100 flex flex-col gap-6 font-sans">
      
      {/* Header section with European Localized Badging */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider font-mono">RISTO-OS SAAS</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              🇮🇹 欧洲标准 (EU/Italian) 餐饮与桌位管理系统
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            🍕 智慧意餐 POS 运营工作台 <span className="text-xs bg-slate-800 text-slate-300 font-normal py-0.5 px-2 rounded-full">Server Version: Cassa Telematico v4.22</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-4xl">
            专为欧洲/意大利中高端餐厅定制的多功能智能前厅中台。覆盖 **开台点菜、桌位布局平面图、手机扫码自主点单、厨房 KDS 端、外卖多平台聚合（Aggregatori Takeaway）与 Agenzia delle Entrate (意大利税务总局) 税控直连** 手册。
          </p>
        </div>

        {/* Demo helpers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQRSimulator(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs text-white rounded-xl shadow-md transition-all font-bold cursor-pointer"
          >
            <Smartphone className="w-4 h-4 animate-pulse" />
            <span>📲 模拟顾客扫码点餐</span>
          </button>

          <button
            onClick={handleSimulateDailyFiscalZ}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-700 hover:bg-rose-600 active:scale-95 text-xs text-white rounded-xl shadow-md transition-all font-bold cursor-pointer"
            disabled={isFiscallyConnecting}
          >
            {isFiscallyConnecting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>🇮🇹 XML 税控Z日结 (Fiscale)</span>
          </button>
        </div>
      </div>

      {/* Primary Subtabs Selector */}
      <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('pos')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'pos' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-rose-500" />
          <span>餐点收银</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tables')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'tables' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>桌台管理</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kds')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'kds' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span>厨房 KDS</span>
          {kdsOrders.filter(k => k.status === 'Nuovo').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('reservations')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'reservations' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>预订系统</span>
        </button>

        <button
          onClick={() => setActiveSubTab('aggregati')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'aggregati' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-cyan-400" />
          <span>外卖聚合</span>
          {deliveryOrders.filter(d => d.status === 'Nuovo').length > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[8px] bg-cyan-500 text-slate-950 font-black font-sans leading-none">
              {deliveryOrders.filter(d => d.status === 'Nuovo').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('fiscal')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'fiscal' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-teal-400" />
          <span>税控及票据</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'report' ? 'bg-zinc-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>基础报表</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB WRAPPERS */}
      
      {/* 1. POS TAB */}
      {activeSubTab === 'pos' && (
        <div id="ristorante-pos-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          
          {/* Left panel: Active table ticket cart */}
          <div className="lg:col-span-5 bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">当前餐台小票 / Conto</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="font-extrabold text-sm text-white">
                      {selectedTable.name} ({selectedTable.status})
                    </h3>
                  </div>
                </div>

                {/* Table Quick Switche dropdown */}
                <select
                  value={activeTableId}
                  onChange={(e) => setActiveTableId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 font-bold outline-none"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} [{t.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Table billing current items */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {selectedTable.currentItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2 select-none">
                    <p className="text-lg">🥣</p>
                    <p className="text-xs font-bold text-slate-400">该餐位暂未点餐开单</p>
                    <p className="text-[10px] text-slate-500">点击右侧的经典菜单，直接添加菜品</p>
                  </div>
                ) : (
                  selectedTable.currentItems.map((item, index) => (
                    <div key={index} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs">{item.name}</span>
                          {item.notes && (
                            <span className="text-[9px] bg-rose-950/40 text-rose-300 border border-rose-900/40 px-1.5 font-bold rounded">
                              {item.notes}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-emerald-400 block mt-1">€{item.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg">
                          <button
                            onClick={() => handleAdjustTableItemQty(item.productId, -1)}
                            className="p-1 px-1.5 hover:bg-slate-800 rounded-l-lg text-slate-400 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleAdjustTableItemQty(item.productId, 1)}
                            className="p-1 px-1.5 hover:bg-slate-800 rounded-r-lg text-slate-400 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calculations drawer */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              {selectedTable.currentItems.length > 0 && (
                <div className="space-y-1.5 font-mono text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>餐位费 Coperto (€2.00 x {selectedTable.coverCount}口):</span>
                    <span className="text-white">€{(selectedTable.coverCount * 2.0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>食品与酒水小计 sub:</span>
                    <span className="text-white">€{selectedTable.currentItems.reduce((s,i) => s + (i.price*i.quantity),0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>餐馆增值税 VAT (10%):</span>
                    <span className="text-white">€{(selectedTable.currentItems.reduce((s,i) => s + (i.price*i.quantity),0) * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-800 my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="font-extrabold text-white text-xs">合计总金 Conto Totale:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      €{(
                        selectedTable.currentItems.reduce((s,i) => s + (i.price*i.quantity),0) * 1.10 + 
                        selectedTable.coverCount * 2.0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons for active table billing */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSendToKitchenKDS}
                  disabled={selectedTable.currentItems.length === 0}
                  className="py-2.5 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-rose-500" />
                  <span>传送后厨 KDS</span>
                </button>

                <button
                  onClick={() => handleCheckoutTable(activeTableId, 'full')}
                  disabled={selectedTable.currentItems.length === 0}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 disabled:opacity-40 transition-all cursor-pointer shadow"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Nexi 结账买单</span>
                </button>
              </div>

              {selectedTable.currentItems.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCheckoutTable(activeTableId, 'split')}
                    className="py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-extrabold text-center hover:text-white cursor-pointer"
                    title="分账平分付款"
                  >
                    ⚖️ 预分账部分开单 (分账/2)
                  </button>
                  <button
                    onClick={() => {
                      if(confirm('确定要全额红字退单并退款吗？')) {
                        setTables(prev => prev.map(t => t.id === activeTableId ? { ...t, currentItems: [], status: 'Da pulire', coverCount: 0 } : t));
                        addLog('RistoPOS', '红字退单结算成功', `已在 POS 终端上对 「${selectedTable.name}」 进行了一键清空退款。`, 'error');
                      }
                    }}
                    className="py-2 bg-slate-950 hover:bg-red-950 hover:border-red-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-extrabold text-center hover:text-rose-400 cursor-pointer"
                  >
                    🔴 撤销开单 / 退款
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Culinary Menu layout */}
          <div className="lg:col-span-7 bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-sm text-white">📖 Menu Trattoria / 经典意式餐单</h3>
                <span className="text-[10px] text-slate-500 font-semibold">价格均为欧元价格 (€)</span>
              </div>

              {/* Menu Categories quickbar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4 select-none">
                {['Le Pizze', 'I Primi', 'I Secondi', 'Antipasti', 'Bevande'].map((cat) => (
                  <div key={cat} className="p-1 text-center bg-slate-900 border border-slate-850 rounded-lg text-[10px] font-bold text-slate-300">
                    {cat}
                  </div>
                ))}
              </div>

              {/* Menu list scrolls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {menuCatalog.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddToTableCart(item)}
                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500 text-left rounded-xl transition-all flex flex-col justify-between h-[85px] cursor-pointer group active:scale-98"
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="font-bold text-xs font-mono text-emerald-400">€{item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-normal mt-0.5 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu helper details */}
            <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl mt-4 text-[10px] text-slate-500 leading-relaxed text-left">
              <span className="font-bold text-slate-400 uppercase tracking-widest font-mono block">💡 操作提示：</span>
              点击上述任意意式菜品，系统会自动将其追加到当前选取的餐台（当前为：{selectedTable.name}）账单中。如果桌号为空闲状态，将自动开台（Occupato）。
            </div>
          </div>
        </div>
      )}

      {/* 2. TABLES TAB */}
      {activeSubTab === 'tables' && (
        <div id="ristorante-tables-tab" className="space-y-5 animate-fadeIn">
          {/* Main indicators bar */}
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-800 block" />
                <span>空闲 ({tables.filter(t => t.status === 'Libero').length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-slate-800 block" />
                <span>用餐中 ({tables.filter(t => t.status === 'Occupato').length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-slate-800 block" />
                <span>已预订 ({tables.filter(t => t.status === 'Prenotato').length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-slate-800 block" />
                <span>待清洁 ({tables.filter(t => t.status === 'Da pulire').length})</span>
              </div>
            </div>

            {/* Switch tables control helper */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">桌台智能操控:</span>
              <button
                onClick={() => {
                  const activeOccupied = tables.find(t => t.status === 'Occupato');
                  const emptyLibero = tables.find(t => t.status === 'Libero');
                  if (activeOccupied && emptyLibero) {
                    handleSwitchTablePlace(activeOccupied.id, emptyLibero.id);
                  } else {
                    addLog('RistoPOS', '换桌失败', '没有用餐中或没有完全空余的位桌，无法模拟换桌。', 'warning');
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:text-white hover:bg-slate-850 cursor-pointer"
              >
                🔄 快速换桌 (Switch)
              </button>
              <button
                onClick={() => {
                  const o1 = tables.filter(t=>t.status==='Occupato')[0];
                  const o2 = tables.filter(t=>t.status==='Occupato')[1];
                  if (o1 && o2) {
                    handleMergeTables(o1.id, o2.id);
                  } else {
                    addLog('RistoPOS', '合单失败', '现场少于两桌在用餐中（Occupato），请先添加菜品开多桌台。', 'warning');
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:text-white hover:bg-slate-850 cursor-pointer"
              >
                🔗 拼桌合单 (Merge)
              </button>
            </div>
          </div>

          {/* Table Interactive Layout Map */}
          <div className="bg-slate-950 p-6 border border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-5 flex items-center gap-2">
              🧭 Mappa della Sala / 餐台平面排版图 <span className="text-xs text-slate-400 font-normal">(点击餐台开点单或变更状态)</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
              {tables.map((t) => {
                const totalDue = t.currentItems.reduce((s,i)=>s+(i.price*i.quantity), 0);
                const isSelected = activeTableId === t.id;

                let cardBg = 'bg-slate-900 border-slate-800 hover:border-slate-700';
                if (t.status === 'Occupato') cardBg = 'bg-red-950/35 border-red-900/60 hover:border-red-800';
                if (t.status === 'Prenotato') cardBg = 'bg-purple-950/20 border-purple-900/50 hover:border-purple-800';
                if (t.status === 'Da pulire') cardBg = 'bg-yellow-950/20 border-yellow-900/50 hover:border-yellow-800';
                if (isSelected) cardBg += ' ring-2 ring-rose-500';

                return (
                  <div
                    key={t.id}
                    className={`p-4 border rounded-2xl flex flex-col justify-between h-[150px] relative transition-all ${cardBg}`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-black text-white text-sm">{t.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        t.status === 'Libero' ? 'bg-emerald-950/55 text-emerald-400' :
                        t.status === 'Occupato' ? 'bg-red-950/70 text-red-400 animate-pulse' :
                        t.status === 'Prenotato' ? 'bg-purple-950/70 text-purple-400' : 'bg-yellow-950/70 text-yellow-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="py-2 text-left space-y-1 select-none">
                      {t.status === 'Occupato' && t.currentItems.length > 0 ? (
                        <>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {t.currentItems.map(i=>i.name.split(' (')[0]).join(', ')}
                          </div>
                          <div className="text-[11px] font-extrabold text-emerald-400 font-mono">
                            消费: €{(totalDue*1.10 + t.coverCount*2.0).toFixed(2)}
                          </div>
                        </>
                      ) : t.status === 'Prenotato' ? (
                        <div className="text-[10px] text-purple-300 font-bold">
                          预约时间: 19:30
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">桌铺目前完全落座空置</span>
                      )}
                    </div>

                    {/* Quick controls inside layout card */}
                    <div className="flex gap-1.5 mt-2 border-t border-slate-800/60 pt-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveTableId(t.id);
                          setActiveSubTab('pos');
                        }}
                        className="flex-1 p-1 bg-slate-950 border border-slate-800 rounded text-[9px] font-bold hover:text-white text-slate-400 text-center cursor-pointer"
                      >
                        点餐/结账
                      </button>

                      {t.status === 'Da pulire' && (
                        <button
                          onClick={() => handleSetTableStatus(t.id, 'Libero')}
                          className="px-2 py-1 bg-emerald-900 border border-emerald-800 rounded text-[9px] font-black hover:text-white text-emerald-300 text-center cursor-pointer"
                          title="做卫生完成"
                        >
                          🧼 作干扫
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. KITCHEN KDS TAB */}
      {activeSubTab === 'kds' && (
        <div id="kitchen-kds-tab" className="space-y-4 animate-fadeIn">
          <div className="bg-slate-950 p-3 border border-slate-800 rounded-2xl flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">🔥 Monitor Cucina (KDS) / 厨房及传菜监控屏</h3>
            <span className="text-xs text-slate-500 font-bold">由前厅自动排号传送，点击一键变更制作进度</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kdsOrders.length === 0 ? (
              <div className="col-span-3 py-16 bg-slate-950 border border-slate-800 text-center text-slate-500 rounded-2xl">
                🍳 暂无需要制作的厨房传菜订单。堂食下单或外卖接单将在这里自动发出！
              </div>
            ) : (
              kdsOrders.map((k, index) => (
                <div key={index} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2 w-full">
                      <div>
                        <span className="text-[10px] bg-rose-950 text-rose-400 font-black px-1.5 py-0.5 rounded mr-1">
                          {k.type}
                        </span>
                        <span className="font-extrabold text-white text-xs">{k.table}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 tracking-wider font-mono">{k.time}</span>
                    </div>

                    <div className="space-y-1.5 py-1 text-left">
                      {k.items.map((i: any, iIdx: number) => (
                        <div key={iIdx} className="flex justify-between text-xs text-slate-300 font-bold border-b border-slate-900 pb-1">
                          <span>{i.name}</span>
                          <span className="text-white font-mono font-extrabold">x{i.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between w-full">
                    <span className={`text-[10px] font-extrabold ${
                      k.status === 'Nuovo' ? 'text-red-400 animate-pulse' :
                      k.status === 'In Preparazione' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {k.status === 'Nuovo' ? '🚨 等待制作' : k.status === 'In Preparazione' ? '👩‍🍳 烹饪中' : '✅ 制作完毕'}
                    </span>

                    <div className="flex gap-1.5">
                      {k.status === 'Nuovo' && (
                        <button
                          onClick={() => {
                            setKdsOrders(prev => prev.map((item, idx) => idx === index ? { ...item, status: 'In Preparazione' } : item));
                            addLog('RistoKDS', '厨房开始备料', `后厨领受「${k.table}」的任务并开始制作。`, 'info');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded text-[10px] font-black cursor-pointer"
                        >
                          开始做
                        </button>
                      )}
                      
                      {k.status === 'In Preparazione' && (
                        <button
                          onClick={() => {
                            setKdsOrders(prev => prev.map((item, idx) => idx === index ? { ...item, status: 'Pronto' } : item));
                            addLog('RistoKDS', '菜品备齐呼叫', `「${k.table}」的餐点全部烹饪备齐！已通知传菜员(Runner)端菜呼叫。`, 'success');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black cursor-pointer"
                        >
                          出餐
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setKdsOrders(prev => prev.filter((_, idx) => idx !== index));
                          addLog('RistoKDS', '传菜出厂清理', '菜品已装运出传菜台，KDS 小票自动清除归档', 'info');
                        }}
                        className="p-1 bg-slate-900 border border-slate-800 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                        title="删除传菜小票"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. RESERVATIONS TAB */}
      {activeSubTab === 'reservations' && (
        <div id="ristorante-reservations-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          
          {/* Booking inputs form (Left panel: 40%) */}
          <div className="lg:col-span-5 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-4">✍️ 电话与在线订座排队录入</h3>

            <form onSubmit={handleAddReservation} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">预约主客尊称 (Cliente Name)</label>
                <input
                  type="text"
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  placeholder="如: Dr. Mario Rossi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">到店客数 (Covers)</label>
                  <input
                    type="number"
                    value={newResCovers}
                    onChange={(e) => setNewResCovers(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">到店时间 (Ora Appuntamento)</label>
                  <input
                    type="text"
                    value={newResTime}
                    onChange={(e) => setNewResTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">渠道来源 / Canale</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['TheFork', 'OpenTable', 'Telefono'] as const).map(source => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setNewResSource(source)}
                      className={`py-1.5 border rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                        newResSource === source ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {source === 'TheFork' ? '🍴 TheFork' : source === 'OpenTable' ? '📖 OpenTable' : '📞 电话下单'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-xs text-white font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>录入预订并自动排位</span>
              </button>
            </form>
          </div>

          {/* Reservations List displays */}
          <div className="lg:col-span-7 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-4">📅 Registro Prenotazioni / 今日订座大底簿</h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {reservations.map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{r.name}</span>
                      <span className="text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {r.source === 'TheFork' ? '🍴 TheFork' : r.source === 'OpenTable' ? '📖 OpenTable' : '📞 电话'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      预约席: {r.covers} 人 • 派单餐台: <span className="font-mono text-cyan-400 font-extrabold">{r.tableId || '暂未排座'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {r.time}
                    </span>

                    {r.status === 'Confirmed' ? (
                      <button
                        onClick={() => handleSeatCustomer(r.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer transition-all"
                      >
                        引领迎客入座
                      </button>
                    ) : r.status === 'Seated' ? (
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                        ✓ 已入座餐饮中
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40 animate-pulse">
                        待确认
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. TAKEAWAY AGGREGATOR TAB */}
      {activeSubTab === 'aggregati' && (
        <div id="ristorante-delivery-tab" className="space-y-4 animate-fadeIn">
          
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-white">🛵 Multi-Platform Delivery Aggregator / 欧洲外卖渠道聚合中枢</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                整合 Deliveroo, Just Eat, Uber Eats, Glovo 四大本地外卖。订单在此流式汇聚，点击接单即刻自动送达厨房后厨烹饪！
              </p>
            </div>
            
            {/* Simulation trigger */}
            <button
              onClick={() => {
                const platforms = ['Deliveroo', 'Uber Eats', 'Just Eat', 'Glovo'] as const;
                const picked = platforms[Math.floor(Math.random() * platforms.length)];
                const foods = [
                  { name: 'Pizza Diavola (辣肠披萨)', quantity: 1 },
                  { name: 'Spaghetti alla Carbonara (培根面)', quantity: 2 },
                  { name: 'Tiramisù della Casa (提拉米苏)', quantity: 1 }
                ];
                const totalVal = Math.floor(Math.random() * 20) + 15;
                const newId = `DEL-${Math.floor(Math.random() * 8999) + 1000}`;
                
                const newDel: DeliveryOrder = {
                  id: newId,
                  source: picked,
                  items: foods.slice(0, Math.floor(Math.random()*2)+1),
                  total: totalVal,
                  status: 'Nuovo',
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setDeliveryOrders(prev => [newDel, ...prev]);
                addLog('Delivery Aggregator', '外卖渠道进单', `【${picked}】渠道突然涌入一笔紧急线上外卖订单 [${newId}]！`, 'warning');
              }}
              className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-850 rounded-xl text-xs font-black cursor-pointer"
            >
              模拟突发一笔外卖单 (Glovo / Deliveroo)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryOrders.map((d) => (
              <div key={d.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div className="text-left space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-950 ${
                      d.source === 'Deliveroo' ? 'bg-[#00cdbc]' : 
                      d.source === 'Uber Eats' ? 'bg-[#5fb35f] text-white' : 
                      d.source === 'Just Eat' ? 'bg-[#f45a00] text-white' : 'bg-[#fec42e]'
                    }`}>
                      {d.source}
                    </span>
                    <span className="font-extrabold text-white text-xs">{d.id}</span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5">
                    {d.items.map((it, idx) => (
                      <div key={idx}>• {it.name} <span className="font-bold text-white font-mono">x{it.quantity}</span></div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    下单时间: {d.createdAt} • 线上打款: <span className="font-mono text-emerald-400 font-extrabold">€{d.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    d.status === 'Nuovo' ? 'bg-red-950 text-red-500 border border-red-900/40 animate-pulse' :
                    d.status === 'In Preparazione' ? 'bg-amber-950 text-amber-500 border border-amber-900/40' : 'bg-emerald-950 text-emerald-500'
                  }`}>
                    {d.status === 'Nuovo' ? '待接单 (New)' : d.status === 'In Preparazione' ? '制作中 (Cooking)' : '已交付骑士'}
                  </span>

                  {d.status === 'Nuovo' && (
                    <button
                      onClick={() => handleAcceptDeliveryGroup(d.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-black cursor-pointer transition-all active:scale-95 shadow"
                    >
                      接单传送后厨
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 6. FISCAL TICKET RECIEPTS TAB (Italian Tax law specialized) */}
      {activeSubTab === 'fiscal' && (
        <div id="ristorante-fiscal-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          
          <div className="lg:col-span-5 bg-slate-950 p-4 border border-slate-800 rounded-2xl text-left space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <span className="p-1.5 bg-rose-950 text-rose-400 rounded">🇮🇹</span>
              <div>
                <h3 className="font-extrabold text-sm text-white">Scontrino Fiscale & Lotteria</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">意大利小票和财政网络认证模块</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <p>
                根据 **Agenzia delle Entrate** 税控法规，每笔在意大利餐厅发生的面对面支付都必须通过具备 telematico 证书的 RT 收银终端将日销售数据向官局申报。
              </p>
              
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850 space-y-1.5 text-[11px] text-slate-400 select-none">
                <span className="font-bold text-slate-300 block">🟢 发票参数详情 (Parametri Fiscale):</span>
                <div>• **税务登记器**: CUSTOM S.p.A. Model II-RT</div>
                <div>• **注册编号 (Invio Telematico)**: M5829AS8210</div>
                <div>• **主要网点税号 (P.IVA)**: IT 01829381029</div>
                <div>• **税控代扣税率**: 10% (Alimentare) / 22% (Alcool)</div>
              </div>

              <div className="p-3 bg-red-950/25 border border-red-900/30 rounded-xl space-y-1">
                <h4 className="font-bold text-red-400 text-xs flex items-center gap-1">🎟️ Lotteria degli Scontrini (小票抽奖)</h4>
                <p className="text-[10px] text-slate-400">
                  意大利推出的全民购买小票抽奖。顾客可出示个人抽奖条码，本系统支付完会生成带有 8 位唯一抽奖代号（如 9XJ3L10Q）的税控条文，并回流至国家奖金池。
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-sm text-white">🎫 Agenzia delle Entrate 已核销小票目录</h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">Real-time Scontrino RT Logs</span>
            </div>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {fiscalReceipts.map((f, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-xs flex items-center justify-between text-slate-300">
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{f.id}</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 font-black px-1.5 py-0.5 rounded uppercase font-sans tracking-wide">
                        Transmesso (已上报)
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      终端税号 Code: <span className="text-slate-300 font-bold">{f.taxCode}</span> • 抽奖 Lotteria: <span className="text-rose-400 uppercase font-black">{f.lotteriaCode}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="text-sm font-extrabold font-mono text-emerald-400 block">€{f.total.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500">{f.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Print trigger and guidelines */}
            <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
              <span className="text-slate-500">连接状态: 🟢 Custom RT Printer Online</span>
              <button
                onClick={() => {
                  addLog('Printer RT', '打印完税物理小票', '向厨房热敏机 CUSTOM 92A 呼叫打印。', 'info');
                  alert('正在通过 Custom Telematica RT 终端打印出真实的物理完税小票，带有 Agenzia delle Entrate 数字签名及 2D 条码。');
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl active:scale-95 transition-all text-xs cursor-pointer"
              >
                🖨️ 打印任意历史小票
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 7. BASIC REPORT TAB */}
      {activeSubTab === 'report' && (
        <div id="ristorante-reports-tab" className="space-y-5 animate-fadeIn">
          
          {/* Bento-grid visual stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">日营业客流总计 / Incasso del Giorno</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-500 font-mono">€{totalIncomingEuro.toFixed(2)}</span>
                <span className="text-xs text-emerald-400 font-bold">▲ +14.2% VS Leri</span>
              </div>
              <p className="text-[10px] text-slate-400">结合当班收银买单、分单及线上已支付结账完税总和</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">餐台每单客单价 / Scontrino Medio</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-400 font-mono">€{(totalIncomingEuro / (fiscalReceipts.length || 1)).toFixed(2)}</span>
                <span className="text-xs text-emerald-400 font-bold">▲ +5.6% 上周</span>
              </div>
              <p className="text-[10px] text-slate-400">平均每单意大利客人的均摊总额度（含 Coperto 附加费）</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">今日桌台翻台率 / Tasso di Rotazione</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-400 font-mono">2.8 回合</span>
                <span className="text-xs text-amber-400 font-bold">● 持平昨日</span>
              </div>
              <p className="text-[10px] text-slate-400">通过桌座「用餐中」到「清洁完成」闭环自动统计所得转数</p>
            </div>
          </div>

          {/* Sitemaps of food item sales */}
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-4 flex items-center gap-2">
              📊 Classifica Vendite Piatti / 意式经典菜品销量排行榜
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Pizza Margherita (玛格丽特)', count: 42, percentage: '88%', revenue: 357.00 },
                { name: 'Spaghetti alla Carbonara (经典培根面)', count: 29, percentage: '65%', revenue: 391.50 },
                { name: 'Tagliata di Manzo (基安蒂经典安格斯牛排)', count: 18, percentage: '45%', revenue: 441.00 },
                { name: 'Tiramisù della Casa (自制提拉米苏)', count: 15, percentage: '38%', revenue: 97.50 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-bold">
                    <span>{idx + 1}. {item.name}</span>
                    <span className="font-mono text-emerald-400 font-extrabold">{item.count} 份 (营收: €{item.revenue.toFixed(2)})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-600 rounded-full" 
                      style={{ width: item.percentage }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}


      {/* ========================================================================= */}
      {/* PHONE/SMARTPHONE CUSTOMER QR SIMULATOR DIALOG POPUP */}
      {showQRSimulator && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-4 text-left relative overflow-hidden transition-all duration-300 shadow-2xl">
            
            {/* Header phone simulator */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-400">顾客手机扫码自助点单模拟器</span>
              </div>
              <button
                onClick={() => {
                  setShowQRSimulator(false);
                  setSimStep('browse');
                }}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {simStep === 'browse' ? (
              <div className="space-y-3.5">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono mb-1">选取的餐台编码 / Tavolo Selezionato</span>
                  <select
                    value={simSelectedTableId}
                    onChange={(e) => setSimSelectedTableId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-white"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Micro Item Adding deck */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {menuCatalog.slice(0, 4).map(item => (
                    <div key={item.id} className="bg-slate-950 border border-slate-900 rounded-xl p-2 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-white block truncate max-w-[170px]">{item.name}</span>
                        <span className="text-emerald-400 font-semibold font-mono">€{item.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSimCart(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                          className="w-5 h-5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 flex items-center justify-center cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold font-mono text-white">
                          {simCart[item.id] || 0}
                        </span>
                        <button
                          onClick={() => setSimCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                          className="w-5 h-5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 flex items-center justify-center cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
                    <span>应收款 / Totale:</span>
                    <span className="font-extrabold text-white">
                      €{Object.entries(simCart).reduce((sum, [itemId, qty]) => {
                        const match = menuCatalog.find(m => m.id === itemId);
                        return sum + (match ? match.price * qty : 0);
                      }, 0).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleSimulateQRClientOrder}
                    disabled={Object.values(simCart).reduce((sum, q) => sum + q, 0) === 0}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all disabled:opacity-45 cursor-pointer text-center"
                  >
                    🚀 下单发送至后厨及POS账单
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3.5 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white">Comanda Inviata! 下单成功</h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    顾客的自助菜单已通过实时 WebSockets/长连接 通讯推入 POS 收银台对应的桌台 #{simSelectedTableId} 中，并已经向厨房 KDS 拼上并出单！
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSimStep('browse');
                    setShowQRSimulator(false);
                  }}
                  className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  我知道了
                </button>
              </div>
            )}

            {/* Design cues */}
            <div className="bg-slate-950/60 p-2 text-[9px] text-slate-500 rounded-lg mt-3 text-center border border-slate-850 select-none">
              每张桌台物理摆放独立专属二维码，顾客无需等待服务员即可自助加菜开单。
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
