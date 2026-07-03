import React, { useEffect, useState } from 'react';
import { useShopifyQlStore } from '../../stores/shopifyqlStore';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { 
  Terminal, Play, Star, BookOpen, Layers, RefreshCw, 
  HelpCircle, Sparkles, CheckCircle2, TrendingUp, Table, Info
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function ShopifyQlView() {
  const { 
    reports, activeQuery, queryResult, loading, error, 
    hydrateReports, setActiveQuery, addReport, deleteReport, runActiveQuery 
  } = useShopifyQlStore();

  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showDirectives, setShowDirectives] = useState(true);

  useEffect(() => {
    hydrateReports();
  }, [hydrateReports]);

  useEffect(() => {
    if (reports.length > 0 && !activeReportId) {
      setActiveReportId(reports[0].id);
      setActiveQuery(reports[0].shopifyQL);
    }
  }, [reports, activeReportId]);

  useEffect(() => {
    // Run initial query on mount
    runActiveQuery();
  }, []);

  const handleSelectReport = (id: string, ql: string) => {
    setActiveReportId(id);
    setActiveQuery(ql);
    // Auto execute to maintain reactive feel
    setTimeout(() => {
      runActiveQuery();
    }, 100);
  };

  const handleRunQuery = () => {
    runActiveQuery();
  };

  // Dynamically analyze columns in queryResult to render best fitting Recharts mapping
  const renderVisualChart = () => {
    if (!queryResult || queryResult.rows.length === 0) return null;

    const cols = queryResult.columns;
    const rows = queryResult.rows;

    const hasMonth = cols.includes('month');
    const hasGrossSales = cols.includes('sum(gross_sales)') || cols.includes('gross_sales');
    const hasNetSales = cols.includes('sum(net_sales)') || cols.includes('net_sales');
    const hasQuantity = cols.includes('sum(quantity)') || cols.includes('quantity');
    const hasCountry = cols.includes('billing_country');
    const hasAvgOrder = cols.includes('avg(order_value)') || cols.includes('avg_order_value');

    const chartData = rows.map((r, i) => {
      // Unify keys for charting libraries
      return {
        name: r.month || r.product_title || r.billing_country || `Item-${i}`,
        'Gross Sales (€)': r['sum(gross_sales)'] || r.gross_sales || 0,
        'Net Sales (€)': r['sum(net_sales)'] || r.net_sales || 0,
        'Qty Sold (units)': r['sum(quantity)'] || r.quantity || 0,
        'Average Order Value': r['avg(order_value)'] || r.avg_order_value || 0
      };
    });

    if (hasMonth) {
      // Monthly Revenue Chart - Elegant Area Chart
      return (
        <div className="h-56 w-full animate-fadeIn pt-2 relative min-w-0 min-h-0">
          <ResponsiveContainer width="100%" height={224}>
            <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="grossColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="netColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#4b5563' }} />
              <YAxis tick={{ fontSize: 9, fill: '#4b5563' }} />
              <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="Gross Sales (€)" stroke="#111111" strokeWidth={2} fillOpacity={1} fill="url(#grossColor)" />
              <Area type="monotone" dataKey="Net Sales (€)" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#netColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (hasCountry || hasAvgOrder) {
      return (
        <div className="h-56 w-full animate-fadeIn pt-2 relative min-w-0 min-h-0">
          <ResponsiveContainer width="100%" height={224}>
            <BarChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#4b5563' }} />
              <YAxis tick={{ fontSize: 9, fill: '#4b5563' }} />
              <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Bar dataKey="Average Order Value" fill="#111111" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Default bar catalog quantity
    return (
      <div className="h-56 w-full animate-fadeIn pt-2 relative min-w-0 min-h-0">
        <ResponsiveContainer width="100%" height={224}>
          <BarChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#4b5563' }} />
            <YAxis tick={{ fontSize: 9, fill: '#4b5563' }} />
            <Tooltip contentStyle={{ fontSize: '10px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            <Bar dataKey="Gross Sales (€)" fill="#111111" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">数据查询</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">查询引擎</h2>
        </div>
        <div className="flex space-x-1.5 font-sans">
          <button
            onClick={() => setShowDirectives(!showDirectives)}
            className="border hover:bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center space-x-1 font-bold cursor-pointer text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>词典</span>
          </button>
          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 px-3.5 py-1.5 rounded-lg flex items-center space-x-1 font-bold cursor-pointer transition-all text-xs"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'text-emerald-400'}`} />
            <span>执行</span>
          </button>
        </div>
      </div>

      {/* Database Schema Dictionary Guide drawer */}
      {showDirectives && (
        <div className="bg-neutral-50 border p-3.5 rounded-lg space-y-3 animate-slideDown">
          <div className="flex justify-between items-center border-b pb-1">
            <span className="font-mono font-bold text-neutral-700 flex items-center space-x-1">
              <Info className="w-4 h-4 text-indigo-500" />
              <span>Sartorial Store Schema Fields Guide</span>
            </span>
            <button onClick={() => setShowDirectives(false)} className="text-neutral-400 hover:text-black">Hide</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono leading-relaxed">
            <div className="bg-white border rounded p-2.5">
              <div className="font-bold text-black border-b pb-1 mb-1 text-[11px]">Table 1: `sales` column index</div>
              <ul className="list-disc pl-4 space-y-0.5 text-neutral-600">
                <li><span className="font-semibold text-neutral-800">month</span> (text format: '2026-06')</li>
                <li><span className="font-semibold text-neutral-800">product_title</span> (text format: SPU Name)</li>
                <li><span className="font-semibold text-neutral-800">gross_sales</span> / <span className="font-semibold text-neutral-800">net_sales</span> (currency metric numbers)</li>
                <li><span className="font-semibold text-neutral-800">quantity</span> (unit integer count)</li>
                <li><span className="font-semibold text-neutral-800">billing_country</span> (checkout location string)</li>
              </ul>
            </div>
            <div className="bg-white border rounded p-2.5">
              <div className="font-bold text-black border-b pb-1 mb-1 text-[11px]">Table 2: `customers` column index</div>
              <ul className="list-disc pl-4 space-y-0.5 text-neutral-600">
                <li><span className="font-semibold text-neutral-800">billing_country</span> (location segmentation string)</li>
                <li><span className="font-semibold text-neutral-800">customer_count</span> (unique customer buyer counts)</li>
                <li><span className="font-semibold text-neutral-800">avg_order_value</span> (average transaction spent number)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* Reports Selector & Custom Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded-lg p-3.5 space-y-3.5 shadow-xs">
            <span className="font-mono text-neutral-600 font-bold uppercase block text-[10px] border-b pb-1.5">Pre-configured ShopifyQL Queries</span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {reports.map(r => (
                <div
                  key={r.id}
                  onClick={() => handleSelectReport(r.id, r.shopifyQL)}
                  className={`p-2.5 border rounded-lg cursor-pointer transition-all ${
                    activeReportId === r.id 
                      ? 'border-neutral-900 bg-neutral-950/5' 
                      : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold text-neutral-900 line-clamp-1 mb-0.5">{r.name}</div>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed mb-1.5">{r.description}</p>
                  <div className="bg-neutral-100 rounded p-1 font-mono text-[9px] text-[#555] truncate">{r.shopifyQL}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="bg-white border rounded-lg p-3.5 space-y-2 shadow-xs">
            <span className="font-mono text-neutral-600 font-bold uppercase block text-[10px]">ShopifyQL Command Buffer</span>
            <textarea
              rows={4}
              value={activeQuery}
              onChange={e => setActiveQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] text-[#4ade80] p-3 rounded-lg font-mono text-[11px] outline-none focus:ring-1 focus:ring-black border leading-relaxed"
            />
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded text-[11px] font-mono">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Query Result Canvas */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Recharts chart drawing panel */}
          <div className="bg-white border rounded-lg p-4 shadow-xs space-y-2">
            <span className="font-mono text-neutral-600 font-bold uppercase block text-[10px]">ShopifyQL Analytics visual graphizer</span>
            {queryResult ? renderVisualChart() : (
              <div className="h-56 flex items-center justify-center font-mono text-neutral-400">
                Execute a ShopifyQL query above to render visual charts here ...
              </div>
            )}
          </div>

          {/* Data list grid table panel */}
          <div className="bg-white border rounded-lg p-4 shadow-xs space-y-3 overflow-x-auto">
            <span className="font-mono text-neutral-600 font-bold uppercase block text-[10px]">Tabulated matching records ({queryResult?.totalCount || 0} rows)</span>
            {queryResult && queryResult.rows.length > 0 ? (
              <table className="w-full text-left font-mono text-[10px] min-w-[500px]">
                <thead>
                  <tr className="bg-neutral-50 border-b text-neutral-400 text-[8px] uppercase tracking-wider">
                    {queryResult.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150">
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
                      {queryResult.columns.map((col, cIdx) => {
                        const val = row[col];
                        return (
                          <td key={cIdx} className="p-2.5 font-semibold text-neutral-800">
                            {typeof val === 'number' && !col.includes('month') ? `€${val.toLocaleString()}` : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-neutral-400 font-mono py-10">0 active index matches. Run query to retrieve catalog metrics.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
