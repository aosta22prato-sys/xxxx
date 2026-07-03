import React, { useState } from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Search, 
  Eye, 
  CheckSquare, 
  Download,
  Percent,
  X
} from 'lucide-react';
import { OrderItem } from '../../types';

interface SalesCenterProps {
  orders: OrderItem[];
  companyName: string;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

interface ChannelShare {
  channel: string;
  count: number;
  sales: number;
  percentage: string;
  color: string;
}

export default function SalesCenter({ orders, companyName, addLog }: SalesCenterProps) {
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<(OrderItem & { channel: string; paymentStatus: string }) | null>(null);
  const [reviewOrder, setReviewOrder] = useState<(OrderItem & { channel: string; paymentStatus: string }) | null>(null);

  // Initialize simulated orders with mapped channels
  const [localOrders, setLocalOrders] = useState<(OrderItem & { channel: string; paymentStatus: string })[]>(() => {
    const channels = ['官方网店', 'Amazon', 'eBay', 'TikTok Shop', 'POS门店'];
    return orders.map((o, idx) => {
      const channel = channels[idx % channels.length];
      const paymentStatus = o.status === 'Refunded' || o.status === 'Refund Requested' 
        ? '已退款' 
        : o.status === 'Shipped' || o.status === 'AI Confirmed' 
          ? '已支付' 
          : '待支付';
      return { ...o, channel, paymentStatus };
    });
  });

  // Calculate stats based on current orders state
  const totalSalesVal = localOrders.reduce((sum, o) => o.status !== 'Refunded' ? sum + o.total : sum, 0);
  const orderCount = localOrders.length;
  const customerCount = Array.from(new Set(localOrders.map(o => o.customerName))).length;
  const averageOrderValue = orderCount > 0 ? totalSalesVal / orderCount : 0;

  // 7-day trend calculations
  const trendData = [
    { label: '06-02', count: 12, sales: 2400 },
    { label: '06-03', count: 18, sales: 3600 },
    { label: '06-04', count: 15, sales: 2900 },
    { label: '06-05', count: 24, sales: 4800 },
    { label: '06-06', count: 21, sales: 4100 },
    { label: '06-07', count: 28, sales: 5800 },
    { label: '06-08', count: orderCount, sales: totalSalesVal }
  ];

  // Channel distribution
  const channelData: ChannelShare[] = [
    { channel: '官方网店', count: localOrders.filter(o => o.channel === '官方网店').length, sales: localOrders.filter(o => o.channel === '官方网店').reduce((sum, o) => sum + o.total, 0), percentage: '35%', color: '#07C2E3' },
    { channel: 'Amazon', count: localOrders.filter(o => o.channel === 'Amazon').length, sales: localOrders.filter(o => o.channel === 'Amazon').reduce((sum, o) => sum + o.total, 0), percentage: '25%', color: '#06B2D0' },
    { channel: 'eBay', count: localOrders.filter(o => o.channel === 'eBay').length, sales: localOrders.filter(o => o.channel === 'eBay').reduce((sum, o) => sum + o.total, 0), percentage: '15%', color: '#059BBC' },
    { channel: 'TikTok Shop', count: localOrders.filter(o => o.channel === 'TikTok Shop').length, sales: localOrders.filter(o => o.channel === 'TikTok Shop').reduce((sum, o) => sum + o.total, 0), percentage: '15%', color: '#10b981' },
    { channel: 'POS门店', count: localOrders.filter(o => o.channel === 'POS门店').length, sales: localOrders.filter(o => o.channel === 'POS门店').reduce((sum, o) => sum + o.total, 0), percentage: '10%', color: '#6b7280' }
  ];

  // Actions trigger function
  const handleViewOrder = (order: OrderItem & { channel: string; paymentStatus: string }) => {
    setSelectedOrder(order);
    addLog('Sales Center', '查看订单', `打开订单 [#${order.id}] 详情页`, 'info');
  };

  const handleRefundReview = (order: OrderItem & { channel: string; paymentStatus: string }) => {
    setReviewOrder(order);
    addLog('Sales Center', '退款审核', `启动订单 [#${order.id}] 的退款审核流`, 'warning');
  };

  const handleApproveRefund = (orderId: string, approve: boolean) => {
    setLocalOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: approve ? 'Refunded' : 'Shipped',
          paymentStatus: approve ? '已退款' : '已支付'
        };
      }
      return o;
    }));
    setReviewOrder(null);
    addLog(
      'Sales Center', 
      '退款决策', 
      approve 
        ? `批准订单 [#${orderId}] 退款申请，执行退款原路返回` 
        : `拒绝订单 [#${orderId}] 退款申请，单据恢复为已支付状态`, 
      approve ? 'success' : 'info'
    );
  };

  const handleExportOrder = (order: OrderItem & { channel: string; paymentStatus: string }) => {
    addLog('Sales Center', '导出订单', `成功导出了单据 [#${order.id}] 的国际化配单票据`, 'success');
    
    // Simulate real text-file download
    const fileContent = `ORDER EXPORT DEED\n==================\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nContact: ${order.contact}\nChannel: ${order.channel}\nAmount: $${order.total.toFixed(2)}\nCreated At: ${order.createdAt}\nPayment: ${order.paymentStatus}\nStatus: ${order.status}\n`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order_${order.id}_receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = () => {
    addLog('Sales Center', '批量导出', `成功批量导出了 ${localOrders.length} 个订单流记录`, 'success');
    
    let fileContent = `SALES RECORD EXPORT\n==================\n`;
    localOrders.forEach(order => {
      fileContent += `[${order.id}] ${order.customerName} - $${order.total.toFixed(2)} [${order.channel}] - ${order.createdAt}\n`;
    });
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders
  const filteredOrders = localOrders.filter(o => {
    const matchesChannel = filterChannel === 'All' || o.channel === filterChannel;
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-900 select-none font-sans animate-fadeIn text-left p-1">
      
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            销售中心 · SALES
          </h2>
          <p className="text-[10px] text-[#07C2E3] font-mono font-bold mt-0.5 tracking-wider uppercase">
            TRADE_CORE_LEDGER • READY
          </p>
        </div>
        <button
          onClick={handleExportAll}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出报表</span>
        </button>
      </div>

      {/* 第一行：今日核心指标 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: 销售额 */}
        <div id="stat-sales" className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">今日销售额</span>
            <div className="w-8 h-8 rounded-lg bg-[#e6fafc] flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-[#07C2E3]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-black font-mono text-slate-900">${totalSalesVal.toFixed(2)}</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-medium">全平台跨渠道统计总和</div>
        </div>

        {/* KPI 2: 总交易订单数 */}
        <div id="stat-orders" className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">今日订单</span>
            <div className="w-8 h-8 rounded-lg bg-[#e6fafc] flex items-center justify-center">
              <ShoppingCart className="w-4.5 h-4.5 text-[#07C2E3]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-black font-mono text-slate-900">{orderCount} 笔</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-medium">线上独立站与实体渠道</div>
        </div>

        {/* KPI 3: 今日客户 */}
        <div id="stat-customers" className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">今日客户</span>
            <div className="w-8 h-8 rounded-lg bg-[#e6fafc] flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-[#07C2E3]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-black font-mono text-slate-900">{customerCount} 人</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-medium">去重买家及访客登记数</div>
        </div>

        {/* KPI 4: 客单价 */}
        <div id="stat-aov" className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">客单价</span>
            <div className="w-8 h-8 rounded-lg bg-[#e6fafc] flex items-center justify-center">
              <Percent className="w-4.5 h-4.5 text-[#07C2E3]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-black font-mono text-slate-900">${averageOrderValue.toFixed(2)}</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-medium">笔均实付平均水平</div>
        </div>

      </div>

      {/* 第二行：7日销售趋势图 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-slate-800 text-sm">7日销售趋势图</h3>
          <span className="text-[10px] text-slate-400 font-mono">06-02 TO 06-08</span>
        </div>
        
        {/* SVG 折线图 */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full animate-fadeIn" viewBox="0 0 500 170" preserveAspectRatio="none">
            {/* 辅助网格线 */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="130" x2="500" y2="130" stroke="#f1f5f9" strokeWidth="1" />
            
            {/* 渐变阴影 */}
            <defs>
              <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07C2E3" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#07C2E3" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            <path 
              d="M 10 130 Q 80 100 160 110 T 320 60 T 490 35 L 490 150 L 10 150 Z" 
              fill="url(#salesTrendGrad)" 
            />

            {/* 趋势曲线 */}
            <path 
              d="M 10 130 Q 80 100 160 110 T 320 60 T 490 35" 
              fill="none" 
              stroke="#07C2E3" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />

            {/* 节点气泡 */}
            <circle cx="10" cy="130" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="85" cy="103" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="160" cy="110" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="240" cy="85" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="320" cy="60" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="405" cy="45" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
            <circle cx="490" cy="35" r="4.5" fill="#07C2E3" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-bold font-mono border-t border-slate-50 pt-3">
          {trendData.map((d, idx) => (
            <span key={idx}>{d.label}</span>
          ))}
        </div>
      </div>

      {/* 第三行：渠道销售占比 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="font-bold text-slate-800 text-sm">渠道销售占比</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {channelData.map((c, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs font-bold text-slate-700">{c.channel}</span>
              </div>
              <div className="mt-3">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">销售比：{c.percentage}</div>
                <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: c.percentage, backgroundColor: c.color }}
                  />
                </div>
              </div>
              <div className="mt-2.5 flex justify-between text-[9px] text-slate-400 font-medium">
                <span>{c.count} 笔订单</span>
                <span className="font-mono">${c.sales.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第四行：最近销售订单表格 */}
      <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm flex flex-col">
        
        {/* 表格标题及筛选工具栏 */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">最近销售订单</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">提供明细数据筛选，并支持对异常失败单据执行强制介入或发货补齐操作。</p>
          </div>
          
          {/* 条件筛选器 */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 搜索 */}
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索订单/客户..." 
                className="bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* 渠道筛选 */}
            <select 
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-bold"
            >
              <option value="All">所有渠道</option>
              <option value="官方网店">官方网店</option>
              <option value="Amazon">Amazon</option>
              <option value="eBay">eBay</option>
              <option value="TikTok Shop">TikTok Shop</option>
              <option value="POS门店">POS门店</option>
            </select>

            {/* 状态筛选 */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-bold"
            >
              <option value="All">所有状态</option>
              <option value="Pending">待执行</option>
              <option value="AI Confirmed">执行中</option>
              <option value="Shipped">已完成</option>
              <option value="Refund Requested">退款中</option>
              <option value="Refunded">已退款</option>
            </select>

          </div>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="p-3 w-20">订单号</th>
                <th className="p-3">客户</th>
                <th className="p-3">渠道</th>
                <th className="p-3">金额</th>
                <th className="p-3">支付状态</th>
                <th className="p-3">订单状态</th>
                <th className="p-3">创建时间</th>
                <th className="p-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  let badgeColorClass = 'bg-slate-100 text-slate-500';
                  let statusTextDisplay = '待执行'; 
                  
                  // Map order statuses
                  if (order.status === 'Pending') {
                    badgeColorClass = 'bg-amber-50 text-amber-700 border-amber-100';
                    statusTextDisplay = '待执行';
                  } else if (order.status === 'AI Confirmed') {
                    badgeColorClass = 'bg-sky-50 text-[#07C2E3] border-sky-100';
                    statusTextDisplay = '执行中';
                  } else if (order.status === 'Shipped') {
                    badgeColorClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    statusTextDisplay = '已完成';
                  } else if (order.status === 'Refund Requested') {
                    badgeColorClass = 'bg-orange-50 text-orange-700 border-orange-100';
                    statusTextDisplay = '退款中';
                  } else if (order.status === 'Refunded') {
                    badgeColorClass = 'bg-rose-50 text-rose-700 border-rose-100';
                    statusTextDisplay = '已退款';
                  }

                  let payColorClass = 'text-amber-600 bg-amber-50/60';
                  if (order.paymentStatus === '已支付') {
                    payColorClass = 'text-emerald-600 bg-emerald-50/60';
                  } else if (order.paymentStatus === '已退款') {
                    payColorClass = 'text-rose-600 bg-rose-50/60';
                  }

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">#{order.id}</td>
                      <td className="p-3 text-slate-900 font-bold">{order.customerName}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                          {order.channel}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-900 font-bold">${order.total.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${payColorClass}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${badgeColorClass}`}>
                          {statusTextDisplay}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[10px] font-mono">{order.createdAt}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleViewOrder(order)}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1 px-2 rounded-md font-bold text-[10px] transition-all active:scale-95 cursor-pointer"
                          >
                            查看
                          </button>
                          
                          <button 
                            onClick={() => handleRefundReview(order)}
                            className={`py-1 px-2 rounded-md font-bold text-[10px] transition-all active:scale-95 cursor-pointer ${
                              order.status === 'Refunded' 
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
                            }`}
                            disabled={order.status === 'Refunded'}
                          >
                            退款审核
                          </button>

                          <button 
                            onClick={() => handleExportOrder(order)}
                            className="bg-[#e6fafc] hover:bg-[#bef1fa] text-[#07C2E3] border border-cyan-100 py-1 px-2 rounded-md font-bold text-[10px] transition-all active:scale-95 cursor-pointer"
                          >
                            导出
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    没有找到符合筛选条件的订单记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 订单明细查看 Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl p-5 relative animate-fadeIn">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 text-sm">
              <span className="text-[#07C2E3]">●</span>
              <span>单据流详情明细 [#{selectedOrder.id}]</span>
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>客户名称:</span>
                <span className="col-span-2 text-slate-900">{selectedOrder.customerName}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>联络方式:</span>
                <span className="col-span-2 text-slate-900 font-mono">{selectedOrder.contact}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>销售渠道:</span>
                <span className="col-span-2">
                  <span className="bg-slate-100 text-slate-700 font-semibold py-0.5 px-1.5 rounded">{selectedOrder.channel}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>实收金额:</span>
                <span className="col-span-2 text-slate-900 font-bold font-mono">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>支付状态:</span>
                <span className="col-span-2 text-slate-900 font-bold">{selectedOrder.paymentStatus}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>订单状态:</span>
                <span className="col-span-2 text-slate-900 font-bold">{selectedOrder.status}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>风险评级:</span>
                <span className={`col-span-2 font-bold font-mono ${selectedOrder.riskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {selectedOrder.riskScore} / 100
                </span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>下单时间:</span>
                <span className="col-span-2 text-slate-500 font-mono">{selectedOrder.createdAt}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-50 pt-4">
              <button 
                onClick={() => handleExportOrder(selectedOrder)}
                className="bg-[#e6fafc] hover:bg-[#bef1fa] text-[#07C2E3] py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer"
              >
                导出票据
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-950 hover:bg-slate-900 text-white py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 退款审核 Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-150 rounded-xl max-w-md w-full shadow-2xl p-5 relative animate-fadeIn">
            <button 
              onClick={() => setReviewOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 text-sm text-rose-600">
              <span>⚠️</span>
              <span>退款审核决策 [#{reviewOrder.id}]</span>
            </h3>
            
            <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/60 mb-4 text-slate-700 text-xs leading-relaxed">
              <p className="font-bold mb-1 text-rose-700">退款请权说明：</p>
              <p>买家 <span className="font-bold">{reviewOrder.customerName}</span> 请求全额退还金额 <span className="font-bold font-mono">${reviewOrder.total.toFixed(2)}</span>。在执行确认后，款项将按支付渠道路径原路返还。</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>交易渠道:</span>
                <span className="col-span-2 text-slate-900">{reviewOrder.channel}</span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>风险评分:</span>
                <span className={`col-span-2 font-bold font-mono ${reviewOrder.riskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {reviewOrder.riskScore} (无异常盗刷风险)
                </span>
              </div>
              <div className="grid grid-cols-3 text-slate-500 font-bold">
                <span>当前状态:</span>
                <span className="col-span-2 text-slate-900 font-bold">{reviewOrder.status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-50 pt-4">
              <button 
                onClick={() => handleApproveRefund(reviewOrder.id, false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer"
              >
                驳回申请 (维持发货)
              </button>
              <button 
                onClick={() => handleApproveRefund(reviewOrder.id, true)}
                className="bg-rose-600 hover:bg-rose-700 text-white py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer"
              >
                同意退款
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
