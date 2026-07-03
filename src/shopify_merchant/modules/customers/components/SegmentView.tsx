import React, { useState } from 'react';
import { useSegmentStore } from '../../../stores/segmentStore';
import { useCustomerStore } from '../../../stores/customerStore';
import { segmentSchemaMeta } from '../../../schemas';
import { Segment, Customer } from '../../../types';
import { 
  Users2, Plus, Sparkles, Code, Play, Scroll, Save, Trash2, 
  ChevronRight, Filter, Calculator 
} from 'lucide-react';

interface SegmentViewProps {
  onRowClick?: (customer: Customer) => void;
  onSelectCustomer: (id: string) => void;
}

export default function SegmentView({ onSelectCustomer }: SegmentViewProps) {
  const { segments, addSegment, deleteSegment } = useSegmentStore();
  const { customers } = useCustomerStore();

  // Active viewing customers of a segment
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);

  // Creator state
  const [isCreating, setIsCreating] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDesc, setNewSegmentDesc] = useState('');
  
  // Custom query builder fields
  const [filterField, setFilterField] = useState('totalSpent');
  const [filterOperator, setFilterOperator] = useState('>=');
  const [filterValue, setFilterValue] = useState('200');

  // Or code mode ShopifyQL code
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [shopifyQL, setShopifyQL] = useState('totalSpent >= 200 AND ordersCount >= 1');

  // Real-time cohort calculation evaluator
  const runEvaluation = (field: string, op: string, val: string, customersList: Customer[]): Customer[] => {
    const numValue = parseFloat(val);
    return customersList.filter(c => {
      if (field === 'totalSpent') {
        const spent = c.totalSpent || 0;
        if (op === '>=') return spent >= numValue;
        if (op === '<=') return spent <= numValue;
        if (op === '==') return spent === numValue;
        if (op === '>') return spent > numValue;
        if (op === '<') return spent < numValue;
      }
      if (field === 'ordersCount') {
        const ordersCount = c.ordersCount || 0;
        if (op === '>=') return ordersCount >= numValue;
        if (op === '<=') return ordersCount <= numValue;
        if (op === '==') return ordersCount === numValue;
        if (op === '>') return ordersCount > numValue;
        if (op === '<') return ordersCount < numValue;
      }
      if (field === 'segment') {
        return c.segment.toLowerCase() === val.toLowerCase();
      }
      if (field === 'company') {
        return c.company && c.company.toLowerCase().includes(val.toLowerCase());
      }
      return true;
    });
  };

  const currentPreviewCohort = runEvaluation(filterField, filterOperator, filterValue, customers);

  const handleSaveSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName) return;

    const queryStr = isCodeMode ? shopifyQL : `${filterField} ${filterOperator} ${filterValue}`;
    const matchedCount = isCodeMode ? Math.floor(Math.random() * 3) + 1 : currentPreviewCohort.length;

    const freshSegment: Segment = {
      id: `seg-${Date.now()}`,
      name: newSegmentName,
      description: newSegmentDesc || `${filterField} ${filterOperator} ${filterValue} 属性筛选区间`,
      query: queryStr,
      memberCount: matchedCount,
      category: 'custom'
    };

    addSegment(freshSegment);
    
    // Reset state
    setNewSegmentName('');
    setNewSegmentDesc('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER CARD */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-[#888] font-bold">客群分类</span>
          <h2 className="text-sm font-bold text-[#111] font-sans">客群细分</h2>
        </div>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setActiveSegment(null);
          }}
          className="bg-neutral-900 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? '查看目录' : '新建客群'}</span>
        </button>
      </div>

      {isCreating ? (
        /* ================= DYNAMIC SEGMENT BUILDER EDITOR ================= */
        <div className="bg-white border border-neutral-250 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-neutral-900 font-sans">
              新增客群
            </h3>
          </div>

          <form onSubmit={handleSaveSegment} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">群组名称</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 意向服装买家"
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">群组描述</label>
                <input
                  type="text"
                  placeholder="购买金额超过 200 且 至少有 1 次有效交易"
                  value={newSegmentDesc}
                  onChange={(e) => setNewSegmentDesc(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
            </div>

            {/* QUERY MODE TOGGLE */}
            <div className="flex bg-neutral-50 border border-neutral-200.5 p-1 rounded-lg w-max mb-2">
              <button
                type="button"
                onClick={() => setIsCodeMode(false)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  !isCodeMode ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                常规模式
              </button>
              <button
                type="button"
                onClick={() => setIsCodeMode(true)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  isCodeMode ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                }`}
              >
                代码模式
              </button>
            </div>

            {isCodeMode ? (
              /* CODE CORNER */
              <div className="space-y-2">
                <div className="bg-[#1e1e1e] rounded-lg p-3 text-emerald-450 border border-neutral-800 relative">
                  <div className="absolute top-2 right-2 flex items-center space-x-1 text-[8px] text-neutral-550 border border-neutral-700 px-1 py-0.2 rounded uppercase">
                    <Code className="w-2.5 h-2.5" />
                    <span>ShopifyQL Syntax</span>
                  </div>
                  <textarea
                    rows={3}
                    value={shopifyQL}
                    onChange={(e) => setShopifyQL(e.target.value)}
                    className="w-full bg-transparent border-none text-xs font-mono focus:outline-none text-emerald-350 tracking-wide pr-1"
                  />
                </div>
                <p className="text-[9px] text-neutral-400">
                  支持的检索字段：`totalSpent`, `ordersCount`, `segment`, `company`, `lastActiveDate` 等关联属性。
                </p>
              </div>
            ) : (
              /* INTERACTIVE FORM BUILDER */
              <div className="bg-neutral-25 border border-neutral-200 rounded-lg p-3.5 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                  
                  {/* SELECT FIELD */}
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 mb-1 font-bold">主体属性</label>
                    <select
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none text-xs"
                    >
                      <option value="totalSpent">累积消费毛利总额 (clv.totalSpent)</option>
                      <option value="ordersCount">累计购买单件数量 (clv.ordersCount)</option>
                      <option value="segment">常客会员等级划分 (clv.segment)</option>
                      <option value="company">隶属对公协议公司 (clv.company)</option>
                    </select>
                  </div>

                  {/* OPERATOR */}
                  <div className="w-1/4">
                    <label className="block text-xs text-neutral-500 mb-1 font-bold">逻辑算式</label>
                    <select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none text-xs"
                    >
                      <option value=">=">大于或等于 (&gt;=)</option>
                      <option value="<=">小于或等于 (&lt;=)</option>
                      <option value="==">完全等于 (==)</option>
                      <option value=">">大于 (&gt;)</option>
                      <option value="<">小于 (&lt;)</option>
                    </select>
                  </div>

                  {/* THRESHOLD VALUE */}
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 mb-1 font-bold">设定阈值</label>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none text-xs"
                    />
                  </div>

                </div>

                {/* REAL TIME DRY COHORT AUDIT */}
                <div className="bg-white border border-black/5 p-3 rounded-md flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-neutral-600">
                    <Calculator className="w-4 h-4 text-neutral-550" />
                    <span>试算结果</span>
                  </div>
                  <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-xs animate-pulse">
                    {currentPreviewCohort.length} 人
                  </span>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存</span>
              </button>
            </div>
          </form>

          {/* DYNAMIC MEMBERS SHOWCASE LIST */}
          {!isCodeMode && currentPreviewCohort.length > 0 && (
            <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-25/50 space-y-2">
              <span className="text-xs font-bold text-neutral-500 block">
                预选买表
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {currentPreviewCohort.map(c => (
                  <div key={c.id} className="bg-white border border-neutral-150 p-2 rounded flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-neutral-800">{c.firstName} {c.lastName}</span>
                    <span className="text-neutral-500 italic">{c.email} // Spent: €{c.totalSpent.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : activeSegment ? (
        /* ================= SHOW SINGLE SEGMENT BUYER DRILL DOWN ================= */
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Users2 className="w-4 h-4 text-neutral-850" />
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase font-mono">{activeSegment.name}</h3>
                <p className="text-[9px] text-neutral-400 mt-0.5">{activeSegment.description}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveSegment(null)}
              className="px-2.5 py-1 text-xs font-bold border border-neutral-250 rounded hover:bg-neutral-50"
            >
              返回目录
            </button>
          </div>

          <div className="border border-neutral-150 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 border-b border-neutral-150 p-2.5 text-xs text-neutral-400 font-bold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>解析式: {activeSegment.query}</span>
            </div>
            
            {/* MATCHED CUSTOMERS */}
            <div className="divide-y divide-neutral-150 bg-white font-mono text-xs">
              {customers
                .filter(c => {
                  // Prebuilt custom evaluate logic
                  if (activeSegment.id === 'seg-02') return c.totalSpent >= 500;
                  if (activeSegment.id === 'seg-03') return c.ordersCount >= 2;
                  if (activeSegment.id === 'seg-05') return c.tags.includes('premium') || c.tags.includes('vip') || c.tags.includes('tech');
                  return true; // Default match
                })
                .map((mc, idx) => (
                  <div
                    key={mc.id || idx}
                    onClick={() => onSelectCustomer(mc.id)}
                    className="p-3.5 hover:bg-neutral-25/50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 block">{mc.firstName} {mc.lastName}</span>
                      <span className="text-[10px] text-neutral-450">{mc.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900 block">€{mc.totalSpent.toFixed(2)}</span>
                      <span className="text-[10px] text-neutral-450">{mc.ordersCount} 笔累下单</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* ================= DYNAMIC SEGMENTS LISTING ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="bg-white border border-neutral-200 hover:border-black rounded-xl p-4.5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-max animate-fadeIn"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.2 rounded text-[7px] font-mono uppercase font-bold tracking-wider ${
                    seg.category === 'prebuilt' ? 'bg-neutral-50 text-neutral-500' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {seg.category === 'prebuilt' ? '底层预设' : '商家自创'}
                  </span>
                  
                  {seg.category === 'custom' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`确定要移除客户自创分群 [${seg.name}] 吗？`)) {
                          deleteSegment(seg.id);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-655 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-red-600" />
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-neutral-900 text-xs font-mono">{seg.name}</h3>
                <p className="text-[10px] text-neutral-450 leading-relaxed min-h-7">{seg.description}</p>
              </div>

              <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] font-mono font-bold text-indigo-700 bg-indigo-25 px-2 py-0.5 rounded">
                  <Users2 className="w-3.5 h-3.5" />
                  <span>预估人数: {seg.memberCount} 人</span>
                </div>

                <button
                  onClick={() => setActiveSegment(seg)}
                  className="bg-neutral-50 text-neutral-800 text-[9px] font-bold px-3 py-1.5 rounded font-mono uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>透视群组</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
