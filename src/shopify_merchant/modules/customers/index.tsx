import React, { useState, useEffect } from 'react';
import { useCustomerStore } from '../../stores/customerStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { usePanelStore } from '../../stores/panelStore';
import { useShopStore } from '../../stores/shopStore';
import { Customer } from '../../types';
import { CustomerEvents, NotificationEvents, eventBus } from '../../events';
import { customerSchemaMeta } from '../../schemas';
import DataGrid from '../../components/ui/DataGrid';
import { commerceAPI } from '../../../services/CommerceAPIClient';

// Modular Subviews
import CustomersHeader from './components/CustomersHeader';
import CustomersTabs from './components/CustomersTabs';
import CustomerForm from './components/CustomerForm';
import CustomerDetailView from './components/CustomerDetailView';
import SegmentView from './components/SegmentView';
import CompanyView from './components/CompanyView';

// Icons
import { 
  Users2, Sparkles, Building2, Search, Filter, Trash2, 
  Tag, Download, CheckCircle, RefreshCcw, UserPlus 
} from 'lucide-react';

export default function CustomersView() {
  const { customers, customerFilter, setCustomerFilter, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  const { currentTab, setCurrentTab } = useLayoutStore();
  const { togglePreview } = usePanelStore();
  const { settings } = useShopStore();

  // Root CRM workspaces tabs
  // 'list' | 'segments' | 'companies'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'list' | 'segments' | 'companies'>('list');

  // Active detail page route (null if not inspecting a single customer deep profile)
  const [activeDeepCustomerId, setActiveDeepCustomerId] = useState<string | null>(null);

  // Creating manual customer state
  const [isCreating, setIsCreating] = useState(false);

  // Advanced Filtering local states
  const [spentMin, setSpentMin] = useState<string>('');
  const [ordersMin, setOrdersMin] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');

  // Row selection for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBatchTools, setShowBatchTools] = useState(false);
  const [batchTagInput, setBatchTagInput] = useState('');

  const currencySymbol = settings.currencySymbol || '€';

  // Synchronize dynamic rail tab selected from LHS to this view tab
  useEffect(() => {
    if (currentTab === 'segments') {
      setActiveWorkspaceTab('segments');
    } else if (currentTab === 'customers') {
      setActiveWorkspaceTab('list');
    }
  }, [currentTab]);

  // Master customer filtered collection
  const filteredCustomers = customers.filter((c) => {
    // Left-sidebar segment filters mapper
    if (customerFilter !== 'All' && c.segment !== customerFilter) return false;

    // Advanced Input selectors matching criteria:
    if (spentMin && (c.totalSpent < parseFloat(spentMin))) return false;
    if (ordersMin && (c.ordersCount < parseInt(ordersMin))) return false;
    if (cityFilter && c.addresses && !c.addresses.some(a => a.city.toLowerCase().includes(cityFilter.toLowerCase()))) return false;
    if (tagFilter && (!c.tags || !c.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase().trim()))) return false;

    // Text search query index
    if (searchString) {
      const query = searchString.toLowerCase();
      const matchName = `${c.firstName} ${c.lastName}`.toLowerCase().includes(query);
      const matchEmail = c.email.toLowerCase().includes(query);
      const matchPhone = c.phone?.toLowerCase().includes(query) || false;
      const matchCompany = c.company?.toLowerCase().includes(query) || false;
      const matchNotes = c.notes?.toLowerCase().includes(query) || false;
      
      if (!matchName && !matchEmail && !matchPhone && !matchCompany && !matchNotes) return false;
    }

    return true;
  });

  const handleCreateSubmit = async (formData: any) => {
    const freshCustomer: Customer = {
      id: `cust-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      ordersCount: 0,
      totalSpent: 0,
      tags: ['manual-add'],
      segment: formData.segment || 'All',
      company: formData.company || '',
      notes: formData.notes || '',
      addresses: [
        { id: `addr-new-${Date.now()}`, isDefault: true, addressLines: 'Core Street 1', city: 'Milan', country: 'Italy', zipCode: '20121' }
      ]
    };

    addCustomer(freshCustomer);
    await commerceAPI.saveCustomers([...customers, freshCustomer]);

    eventBus.emit(CustomerEvents.CREATED, freshCustomer);
    eventBus.emit(NotificationEvents.CREATED, {
      text: `👤 录入新客户: [${freshCustomer.firstName} ${freshCustomer.lastName}]`
    });

    setIsCreating(false);
  };

  const toggleRowSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`是否确定批量下线移除选中的 ${selectedIds.length} 位买家？`)) {
      selectedIds.forEach(id => {
        deleteCustomer(id);
      });
      setSelectedIds([]);
      alert('批量操作成功：关联买家档案已下线');
    }
  };

  const handleBatchAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTagInput.trim() || selectedIds.length === 0) return;
    
    selectedIds.forEach(id => {
      const match = customers.find(c => c.id === id);
      if (match) {
        const updatedTags = Array.from(new Set([...(match.tags || []), batchTagInput.trim().toLowerCase()]));
        updateCustomer(id, { tags: updatedTags });
      }
    });

    setBatchTagInput('');
    alert(`成功为选择的 ${selectedIds.length} 名客户打上标签`);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Phone,Segment,OrdersCount,TotalSpent,Company\n';
    const rows = filteredCustomers.map(c => 
      `"${c.id}","${c.firstName} ${c.lastName}","${c.email}","${c.phone || ''}","${c.segment}","${c.ordersCount}","${c.totalSpent}","${c.company || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atelier_customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If inspection layout is loaded
  if (activeDeepCustomerId) {
    return (
      <CustomerDetailView 
        customerId={activeDeepCustomerId}
        onBack={() => setActiveDeepCustomerId(null)}
      />
    );
  }

  if (isCreating) {
    return (
      <CustomerForm 
        onBack={() => setIsCreating(false)}
        onSubmit={handleCreateSubmit}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn font-sans pb-10">
      
      {/* Header section with smart subtitle */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 
            onClick={() => {
              useLayoutStore.getState().toggleQuickNav(true);
            }}
            className="text-[20px] font-extrabold tracking-tight text-neutral-900 font-sans cursor-pointer hover:opacity-85 active:scale-98 transition-all inline-block select-none"
          >
            客户 ➔
          </h1>
          <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
            管理你的品牌客户
          </p>
        </div>
      </div>

      {/* 🚀 TOP CRM DESKS CARD TABS NAVIGATION - PRESET HIGHEST DESIGN SYNERGY WITH PRODUCTS & ORDERS */}
      <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1 select-none">
        {/* CUSTOMERS LIST CARD */}
        <div
          onClick={() => setActiveWorkspaceTab('list')}
          className={`flex flex-col items-center justify-between p-2 rounded-lg border w-14 h-[60px] shrink-0 text-center transition-all duration-150 cursor-pointer active:scale-95 ${
            activeWorkspaceTab === 'list'
              ? 'border-neutral-900 bg-neutral-900 text-white font-bold ring-1 ring-neutral-950/10 shadow-3xs'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
          }`}
        >
          <Users2 className={`w-3.5 h-3.5 ${activeWorkspaceTab === 'list' ? 'text-white' : 'text-neutral-450'}`} />
          <span className="text-[9px] font-sans font-medium tracking-tight truncate w-full">核心客户</span>
          <span className={`text-[9.5px] font-bold font-mono leading-none ${activeWorkspaceTab === 'list' ? 'text-white' : 'text-neutral-400'}`}>
            {customers.length}
          </span>
        </div>

        {/* COHORTS SEGMENTS CARD */}
        <div
          onClick={() => {
            setActiveWorkspaceTab('segments');
            setCurrentTab('segments');
          }}
          className={`flex flex-col items-center justify-between p-2 rounded-lg border w-14 h-[60px] shrink-0 text-center transition-all duration-150 cursor-pointer active:scale-95 ${
            activeWorkspaceTab === 'segments'
              ? 'border-neutral-900 bg-neutral-900 text-white font-bold ring-1 ring-neutral-950/10 shadow-3xs'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeWorkspaceTab === 'segments' ? 'text-white' : 'text-neutral-450'}`} />
          <span className="text-[9px] font-sans font-medium tracking-tight truncate w-full">客群分析</span>
          <span className={`text-[9.5px] font-bold font-mono leading-none ${activeWorkspaceTab === 'segments' ? 'text-white' : 'text-neutral-400'}`}>
            3
          </span>
        </div>

        {/* B2B COOPORATES CARD */}
        <div
          onClick={() => {
            setActiveWorkspaceTab('companies');
            setCurrentTab('customers');
          }}
          className={`flex flex-col items-center justify-between p-2 rounded-lg border w-14 h-[60px] shrink-0 text-center transition-all duration-150 cursor-pointer active:scale-95 ${
            activeWorkspaceTab === 'companies'
              ? 'border-neutral-900 bg-neutral-900 text-white font-bold ring-1 ring-neutral-950/10 shadow-3xs'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
          }`}
        >
          <Building2 className={`w-3.5 h-3.5 ${activeWorkspaceTab === 'companies' ? 'text-white' : 'text-neutral-450'}`} />
          <span className="text-[9px] font-sans font-medium tracking-tight truncate w-full">对公 B2B</span>
          <span className={`text-[9.5px] font-bold font-mono leading-none ${activeWorkspaceTab === 'companies' ? 'text-white' : 'text-neutral-400'}`}>
            2
          </span>
        </div>
      </div>

      {/* ================= WORKSPACE INTERCHANGE ================= */}
      {activeWorkspaceTab === 'segments' && (
        <SegmentView onSelectCustomer={(id) => setActiveDeepCustomerId(id)} />
      )}

      {activeWorkspaceTab === 'companies' && (
        <CompanyView onSelectCustomer={(id) => setActiveDeepCustomerId(id)} />
      )}

      {activeWorkspaceTab === 'list' && (
        <div className="space-y-4">
          
          {/* Decoupled header card */}
          <CustomersHeader onAddClick={() => setIsCreating(true)} />

          {/* DYNAMIC METADATA ADVANCED FILTERS MODULE */}
          <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-xs space-y-3 font-mono text-xs">
            
            {/* Search + Clear query */}
            <div className="flex flex-col md:flex-row gap-2.5">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="搜索客户姓名、邮件地址、所在城市、对公企业、备注等..."
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  className="w-full bg-white border border-neutral-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all text-neutral-900 font-sans"
                />
              </div>

              {/* Action utilities */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-white hover:bg-neutral-50 border border-neutral-200 font-bold font-mono text-[10px] px-4 py-2.5 rounded-2xl uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                  title="导出当前筛选出的买家至 CSV"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>导出报表 ({filteredCustomers.length})</span>
                </button>

                {(spentMin || ordersMin || cityFilter || tagFilter || searchString) && (
                  <button
                    onClick={() => {
                      setSpentMin('');
                      setOrdersMin('');
                      setCityFilter('');
                      setTagFilter('');
                      setSearchString('');
                    }}
                    className="text-red-650 font-bold text-[10px] uppercase cursor-pointer hover:underline pl-2 shrink-0"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {/* Sub Filter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] font-sans">
              <div>
                <label className="block text-[8px] uppercase text-neutral-400 mb-1 font-bold font-mono">最小消费毛利额</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={spentMin}
                  onChange={(e) => setSpentMin(e.target.value)}
                  className="w-full bg-neutral-25 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:bg-white text-xs text-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase text-neutral-400 mb-1 font-bold font-mono">成交订单单数</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={ordersMin}
                  onChange={(e) => setOrdersMin(e.target.value)}
                  className="w-full bg-neutral-25 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:bg-white text-xs text-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase text-neutral-400 mb-1 font-bold font-mono">经营驻点城市</label>
                <input
                  type="text"
                  placeholder="e.g. Milano"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-neutral-25 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:bg-white text-xs text-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase text-neutral-400 mb-1 font-bold font-mono">包含标签属性</label>
                <input
                  type="text"
                  placeholder="e.g. vip"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full bg-neutral-25 border border-neutral-200 rounded-xl p-2 focus:outline-none focus:bg-white text-xs text-neutral-800"
                />
              </div>
            </div>

          </div>

          {/* BATCH ACTION CONTROLLER BAR */}
          {selectedIds.length > 0 && (
            <div className="bg-neutral-900 text-white rounded-lg px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-450" />
                <span className="font-bold">已选择 {selectedIds.length} 位核心买家档案</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleBatchAddTag} className="flex bg-neutral-800 rounded border border-neutral-700/50">
                  <input
                    type="text"
                    required
                    placeholder="批量打上特定标签..."
                    value={batchTagInput}
                    onChange={(e) => setBatchTagInput(e.target.value)}
                    className="bg-transparent border-none text-[11px] px-2 py-1 text-white focus:outline-none"
                  />
                  <button type="submit" className="px-3 bg-neutral-700 hover:bg-neutral-600 rounded-r text-[10px] font-bold">应用</button>
                </form>
                
                <button
                  onClick={handleBatchDelete}
                  className="bg-red-700 hover:bg-red-655 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>注销所选档案</span>
                </button>

                <button
                  onClick={() => setSelectedIds([])}
                  className="text-neutral-400 hover:text-white font-medium cursor-pointer pl-1.5"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* Decoupled tabs filter label bar */}
          <CustomersTabs 
            customerFilter={customerFilter}
            setCustomerFilter={setCustomerFilter}
            filteredCount={filteredCustomers.length}
          />

          {/* PRESTIGE CUSTOMERS MANUAL DIRECTORY RENDERER */}
          {/* Mobile/Iframe Cards View (md:hidden) */}
          <div className="md:hidden space-y-2.5">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center space-y-2 shadow-3xs">
                <span className="text-3xl">🗂️</span>
                <p className="text-xs font-mono text-neutral-400 uppercase">没有检索到任何买家档案 (CUSTOMER_EMPTY_STATE)</p>
              </div>
            ) : (
              filteredCustomers.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setActiveDeepCustomerId(c.id)}
                  className="bg-white border border-neutral-200/85 rounded-lg p-3.5 hover:shadow-2xs active:scale-99 transition-all cursor-pointer flex flex-col gap-2.5 relative group shadow-3xs"
                >
                  <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                    <div className="font-extrabold text-neutral-900 text-xs flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowSelect(c.id);
                        }}
                        className="w-3.5 h-3.5 accent-neutral-900 border-neutral-300 rounded cursor-pointer mr-1"
                      />
                      <span className="hover:text-[#008060]">{c.firstName} {c.lastName}</span>
                    </div>
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold leading-none ${
                        c.segment === 'VIP' ? 'bg-red-50 text-red-650 border border-red-200' :
                        c.segment === 'Returning' ? 'bg-[#008060]/10 text-[#008060] border border-[#008060]/20' :
                        c.segment === 'B2B' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-550'
                      }`}>
                        {c.segment}
                      </span>
                    </div>
                  </div>
                  
                  {/* Secondary Grid Details */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-neutral-500 font-sans">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-neutral-400 uppercase font-mono tracking-tight font-bold">电子邮件</span>
                      <span className="font-semibold text-neutral-800 mt-0.5 truncate">{c.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-neutral-400 uppercase font-mono tracking-tight font-bold">联席机构</span>
                      <span className="font-semibold text-neutral-800 mt-0.5 truncate italic">{c.company || '个人客户'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-neutral-400 uppercase font-mono tracking-tight font-bold">下单总单数</span>
                      <span className="font-semibold text-neutral-800 mt-0.5">{c.ordersCount} 笔已交单</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-neutral-400 uppercase font-mono tracking-tight font-bold">累计成交毛利</span>
                      <span className="font-semibold text-neutral-950 mt-0.5 font-mono">{currencySymbol}{c.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Bottom Line Controls */}
                  <div className="border-t border-neutral-50 pt-2 flex items-center justify-between text-[8.5px] text-neutral-400 font-mono">
                    <span>档案ID: #{String(c.id).substring(0, 10)}</span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDeepCustomerId(c.id);
                        }}
                        className="px-2 py-1 bg-neutral-900 text-white hover:bg-neutral-800 rounded font-bold text-[8px] uppercase cursor-pointer"
                      >
                        深入透视
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreview('customer', c.id);
                        }}
                        className="px-2 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-250 rounded font-bold text-[8px] text-[#616161] hover:text-[#1a1a1a] cursor-pointer"
                      >
                        右看
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Spreadsheet table (hidden md:block) */}
          <div className="hidden md:block bg-white border border-neutral-250 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse divide-y divide-neutral-200">
                <thead>
                  <tr className="bg-neutral-25 text-neutral-450 uppercase text-[10px]">
                    <th className="px-4 py-3 text-center w-10">选择</th>
                    <th className="px-4 py-3">买家贵宾姓名</th>
                    <th className="px-4 py-3 font-sans">账户电子邮件</th>
                    <th className="px-4 py-3">分群分轨</th>
                    <th className="px-4 py-3">联席对公机构</th>
                    <th className="px-4 py-3 text-right">下单总单数</th>
                    <th className="px-4 py-3 text-right">累计成交毛利</th>
                    <th className="px-4 py-3 text-center w-28">操作面板</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-neutral-400 italic">
                        未检索到任何符合上述精准筛选条件的买家档案
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr 
                        key={c.id}
                        className="hover:bg-neutral-25/50 transition-colors cursor-pointer group"
                      >
                        {/* TICK BOX CHECKBOX */}
                        <td 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowSelect(c.id);
                          }}
                          className="px-4 py-3.5 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(c.id)}
                            onChange={() => {}} // Controlled manually
                            className="w-3.5 h-3.5 accent-neutral-900 border-neutral-320 rounded cursor-pointer"
                          />
                        </td>

                        {/* NAME */}
                        <td 
                          onClick={() => setActiveDeepCustomerId(c.id)}
                          className="px-4 py-3.5 font-bold text-neutral-900 group-hover:text-[#008060]"
                        >
                          {c.firstName} {c.lastName}
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-3.5 text-neutral-600 font-sans">{c.email}</td>

                        {/* SEGMENT BADGE */}
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            c.segment === 'VIP' ? 'bg-red-50 text-red-650 border border-red-200' :
                            c.segment === 'Returning' ? 'bg-[#008060]/10 text-[#008060] border border-[#008060]/20' :
                            c.segment === 'B2B' ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-550'
                          }`}>
                            {c.segment}
                          </span>
                        </td>

                        {/* COMPANY */}
                        <td className="px-4 py-3.5 text-neutral-450 italic font-mono truncate max-w-xs select-all">
                          {c.company || '个人非对公'}
                        </td>

                        {/* ORDERS COUNT */}
                        <td className="px-4 py-3.5 text-right font-bold text-neutral-750">
                          {c.ordersCount} 笔已交单
                        </td>

                        {/* TOTAL SPENT */}
                        <td className="px-4 py-3.5 text-right font-bold text-neutral-950">
                          {currencySymbol}{c.totalSpent.toFixed(2)}
                        </td>

                        {/* OPERATION ACTION */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDeepCustomerId(c.id);
                              }}
                              className="px-2 py-1 bg-neutral-900 text-white hover:bg-neutral-800 rounded font-bold font-mono text-[9px] uppercase cursor-pointer"
                            >
                              深入透视
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePreview('customer', c.id);
                              }}
                              className="px-2 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-250 rounded font-bold font-mono text-[9px] text-[#616161] hover:text-[#1a1a1a] cursor-pointer"
                              title="在右侧第3栏抽屉滑出快捷视效看板"
                            >
                              右看
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
