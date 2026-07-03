import React, { useState, useEffect } from "react";
import { 
  TrendingUp, ShoppingBag, Percent, Users, Layers, Activity, 
  Play, Pause, RefreshCw, Layers3, Flame, AlertCircle, ArrowDown,
  ArrowUp, DollarSign, Wallet, ShieldCheck, Heart, Sparkles
} from "lucide-react";
import { EnterpriseState } from "../types";

interface DashboardProps {
  state: EnterpriseState;
  refreshState: () => void;
}

export default function Dashboard({ state, refreshState }: DashboardProps) {
  const [pipelinePlaying, setPipelinePlaying] = useState(true);
  const [kafkaQueueSize, setKafkaQueueSize] = useState(14);
  const [clickhouseIngestRate, setClickhouseIngestRate] = useState(142);
  const [redisHits, setRedisHits] = useState(99.4);
  const [liveLog, setLiveLog] = useState<string[]>([]);

  // 1. 今日已支付销售额 (Today's Paid Sales)
  const paidOrders = state.orders.filter(o => o.paymentStatus === "paid");
  const paidSalesSum = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 2. 订单总数 (All orders registered)
  const totalOrdersCount = state.orders.length;

  // 3. 支付率 (Payment Completion Rate)
  const paymentRatePercent = totalOrdersCount > 0 
    ? parseFloat(((paidOrders.length / totalOrdersCount) * 100).toFixed(1)) 
    : 100.0;

  // 4. 客单价 (Average paid Order Value)
  const calculatedAOV = paidOrders.length > 0 
    ? parseFloat((paidSalesSum / paidOrders.length).toFixed(2)) 
    : 0.00;

  // 5. 库存预警 (Items with low stock in warehouse <= 50 units)
  const lowStockWarningCount = state.products.filter(p => p.stock <= 50).length;

  // 6. 应收账款 (Accounts Receivable - unpaid or partially paid orders total amount)
  const accountsReceivableAmount = state.orders
    .filter(o => o.paymentStatus === "unpaid" || o.paymentStatus === "partially_refunded")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // 7. 利润率 / 毛利率 (Dynamic Gross Profit Margin calculated from COGS vs selling prices)
  let totalRevenueVolume = 0;
  let totalCOGSVolume = 0;
  paidOrders.forEach(o => {
    totalRevenueVolume += o.totalAmount;
    o.items.forEach(itm => {
      // Look up matched product cost
      const prod = state.products.find(p => p.sku === itm.sku);
      const matchedCost = prod ? prod.cost : (itm.price * 0.4); // fallback cost if item not found
      totalCOGSVolume += (matchedCost * itm.quantity);
    });
  });
  const grossProfitAmount = totalRevenueVolume - totalCOGSVolume;
  const grossProfitMarginRate = totalRevenueVolume > 0 
    ? parseFloat(((grossProfitAmount / totalRevenueVolume) * 100).toFixed(1)) 
    : 62.8;

  // 8. 新增客户 (Active customer records count)
  const totalCustomersCount = state.customers.length;

  // 9. 复购率 (Cohort Retention Rate - customers with more than 1 registered order)
  const returningCustomersCount = state.customers.filter(c => c.ordersCount > 1).length;
  const repeatPurchaseRate = state.customers.length > 0 
    ? parseFloat(((returningCustomersCount / state.customers.length) * 100).toFixed(1)) 
    : 34.8;

  useEffect(() => {
    if (!pipelinePlaying) return;

    const interval = setInterval(() => {
      // simulate ClickHouse and Kafka streams ingestion
      setKafkaQueueSize(prev => Math.max(2, prev + Math.floor(Math.random() * 7) - 3));
      setClickhouseIngestRate(prev => Math.max(80, prev + Math.floor(Math.random() * 20) - 10));
      setRedisHits(prev => Math.min(100, Math.max(98.5, prev + (Math.random() * 0.2 - 0.1))));

      // Add a simulated live event log
      const actions = [
        "Ingested ClickStream action: User searched 'wallet' via semantic AI.",
        "Kafka partition [Offset: 1402] replicated successfully to replica-01.",
        "Analytical aggregation completed for metrics 'AOV' in 2.1ms.",
        "Redis cache refreshed for index 'all_products'.",
        "Kafka worker successfully logged Webhook delivery to Developer Hub.",
        "Heartbeat health: ClickHouse cluster response status stable."
      ];
      const randomEvent = actions[Math.floor(Math.random() * actions.length)];
      setLiveLog(prev => [ `[${new Date().toLocaleTimeString()}] ${randomEvent}`, ...prev.slice(0, 4) ]);

      // Periodically refresh server state
      refreshState();
    }, 5000);

    return () => clearInterval(interval);
  }, [pipelinePlaying, refreshState]);

  // Initial logs
  useEffect(() => {
    setLiveLog([
      `[${new Date().toLocaleTimeString()}] System: Kafka ClickStream analytics connection established.`,
      `[${new Date().toLocaleTimeString()}] ClickHouse: Initialized fast merge-tree indexes.`,
      `[${new Date().toLocaleTimeString()}] DB: Synchronized memory ledger from db.json.`
    ]);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Real-time ingestion toolbar */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            ClickHouse & Kafka 实时流式分析大盘 (Real-time Synced Indicators)
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            管道每 5 秒轮巡。实时解析出海商户 Kafka 事件、ClickHouse 内存聚合，并穿透算得最新复购率和供应链利润损益。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPipelinePlaying(!pipelinePlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              pipelinePlaying 
                ? "bg-amber-700 hover:bg-amber-800 text-white" 
                : "bg-white hover:bg-amber-100 text-amber-950 border border-amber-200"
            }`}
          >
            {pipelinePlaying ? (
              <>
                <Pause className="w-3 h-3" /> 暂停轮询
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> 开始轮询
              </>
            )}
          </button>

          <button
            onClick={() => {
              refreshState();
              setKafkaQueueSize(18);
            }}
            className="p-2 bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg transition-colors cursor-pointer"
            title="手动刷新大盘数据 (Sync Database)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Numerical Indicators Grid (Enterprise-grade 9 indicators, dynamically calculated) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* KPI 1: 今日已支付销售额 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                今日已付销售额
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                €{paidSalesSum.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-[9px] text-emerald-600 font-bold bg-emerald-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            已支付款项实时归集
          </div>
        </div>

        {/* KPI 2: 订单总数 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                累计订单总数
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {totalOrdersCount} 单
              </div>
            </div>
          </div>
          <div className="text-[9px] text-indigo-700 font-bold bg-indigo-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            订单池索引高速 Merge
          </div>
        </div>

        {/* KPI 3: 支付率 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                订单支付成功率
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {paymentRatePercent}%
              </div>
            </div>
          </div>
          <div className="text-[9px] text-sky-700 font-bold bg-sky-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            风控秒级反拨校验
          </div>
        </div>

        {/* KPI 4: 客单价 AOV */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                平均订单客单价 (AOV)
              </span>
              <div className="text-sm font-black text-gray-900 mt-1">
                €{calculatedAOV.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-[9px] text-rose-700 font-bold bg-rose-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            客群均值符合预期
          </div>
        </div>

        {/* KPI 5: 库存预警数量 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                低安全水警戒类目
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {lowStockWarningCount} 款
              </div>
            </div>
          </div>
          <div className="text-[9px] text-amber-800 font-bold bg-amber-50/50 px-2 py-0.5 rounded mt-2 flex items-center gap-0.5 max-w-max">
            低于50件自动报警
          </div>
        </div>

        {/* KPI 6: 应收账款 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                未结应收账金累算
              </span>
              <div className="text-md font-black text-gray-900 mt-1">
                €{accountsReceivableAmount.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-[9px] text-amber-700 font-bold bg-amber-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            应收账款池跟催诊断
          </div>
        </div>

        {/* KPI 7: 动态毛利率 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                实销产品综合毛利率
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {grossProfitMarginRate}%
              </div>
            </div>
          </div>
          <div className="text-[9px] text-sky-850 font-bold bg-emerald-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            穿透扣减大货采购底价
          </div>
        </div>

        {/* KPI 8: 新增客户数 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                累计活跃商户总量
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {totalCustomersCount} 户
              </div>
            </div>
          </div>
          <div className="text-[9px] text-amber-700 font-bold bg-amber-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            LTV 全局活跃中台映射
          </div>
        </div>

        {/* KPI 9: 复购率 */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">
                活跃商户二次复购率
              </span>
              <div className="text-lg font-black text-gray-900 mt-0.5">
                {repeatPurchaseRate}%
              </div>
            </div>
          </div>
          <div className="text-[9px] text-teal-800 font-bold bg-teal-50/50 px-2 py-0.5 rounded mt-2 max-w-max">
            多订单留存客户计算
          </div>
        </div>

      </div>

      {/* Advanced Telemetry & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ClickHouse Metric pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-150 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-505" />
              SaaS Operational Pipeline Status (Kafka / ClickHouse Kafka Buffer)
            </h4>
            <span className="text-[9px] font-mono text-gray-400 uppercase">PG_MERGE_TREE_CLUSTER</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-150 text-center">
              <span className="text-xs text-gray-500 font-medium">Kafka Buffer Backlog</span>
              <div className="text-lg font-bold text-indigo-600 mt-1 animate-pulse">{kafkaQueueSize} events</div>
              <span className="text-[9px] text-gray-400">Partitioned: 4 nodes</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-150 text-center">
              <span className="text-xs text-gray-500 font-medium">ClickHouse Ingest Rate</span>
              <div className="text-lg font-bold text-emerald-600 mt-1">{clickhouseIngestRate} req/s</div>
              <span className="text-[9px] text-gray-400">Indexed raw block writes</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-150 text-center">
              <span className="text-xs text-gray-500 font-medium">Redis Cache Hits</span>
              <div className="text-lg font-bold text-amber-600 mt-1">{redisHits.toFixed(2)}%</div>
              <span className="text-[9px] text-gray-400">Avg response: 1.2ms</span>
            </div>
          </div>

          {/* Graphic visualization */}
          <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50/30">
            <span className="text-xs text-gray-500 font-semibold block mb-2">Real-time Traffic Volume (ClickStream last 12 hrs)</span>
            <div className="h-32 flex items-end gap-1.5 pt-2">
              {[34, 45, 29, 60, 52, 78, 88, 65, 80, 95, 70, 110, 125, 140, 105, 118, 130, 122, 145].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm hover:from-teal-400 hover:to-teal-300 transition-all cursor-pointer animate-fade-in"
                    style={{ height: `${(val / 160) * 100}%` }}
                    title={`Hour ${idx+1}: ${val} hits`}
                  />
                  <span className="text-[8px] text-gray-400 mt-1">{idx + 1}h</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live system operations feed */}
        <div className="bg-gray-900 text-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
                Kafka Stream Ingest Console
              </h4>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="font-mono text-[11px] space-y-2 max-h-56 overflow-y-auto pt-1 text-gray-300">
              {liveLog.length > 0 ? (
                liveLog.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    <span className="text-emerald-400 font-semibold">&gt;</span> <span className="text-gray-300">{log}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Waiting for next data partition flush...</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3 mt-4 text-[10px] text-gray-400 flex items-center justify-between font-mono">
            <span>Aggregates: SQL MergeTree</span>
            <span className="text-gray-500">Node ID: med_cluster_node_0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
