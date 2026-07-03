import React, { useState } from 'react';
import { useCompanyStore } from '../../../stores/companyStore';
import { useCustomerStore } from '../../../stores/customerStore';
import { useShopStore } from '../../../stores/shopStore';
import { B2BCompany, B2BContact } from '../../../types';
import { companySchemaMeta } from '../../../schemas';
import { 
  Building2, Plus, Edit, ShieldCheck, CreditCard, Scroll, 
  MapPin, Users, Coins, ArrowLeft, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface CompanyViewProps {
  onSelectCustomer: (id: string) => void;
}

export default function CompanyView({ onSelectCustomer }: CompanyViewProps) {
  const { companies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  const { customers } = useCustomerStore();
  const { settings } = useShopStore();

  const currencySymbol = settings.currencySymbol || '€';

  // Active viewing/editing company detail
  const [activeCompany, setActiveCompany] = useState<B2BCompany | null>(null);

  // Corporate registry form
  const [isCreating, setIsCreating] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [paymentTerm, setPaymentTerm] = useState<'Net 35' | 'Net 30' | 'Net 60' | 'Due on receipt'>('Net 30');
  const [creditLimit, setCreditLimit] = useState(5000);

  // Corporate location local state
  const [locations, setLocations] = useState<string[]>([
    'Main HQ - Milan Boutique Store',
    'Secondary Hub - Logistics Centre Berlin'
  ]);
  const [newLocationInput, setNewLocationInput] = useState('');

  // Adding personnel local state
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactRole, setNewContactRole] = useState<'admin' | 'buyer'>('buyer');

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !businessId || !contactName) return;

    const term = paymentTerm as 'Net 30' | 'Net 60' | 'Due on receipt';

    const freshCorp: B2BCompany = {
      id: `comp-${Date.now()}`,
      name: companyName,
      businessId,
      location,
      primaryContactName: contactName,
      primaryContactEmail: contactEmail,
      ordersCount: 0,
      totalSpent: 0,
      paymentTerm: term,
      creditLimit: Number(creditLimit) || 5000,
      catalogId: 'cat-std-wholesale',
      contacts: [
        { customerId: `corp-cust-${Date.now()}`, name: contactName, email: contactEmail, role: 'admin' }
      ]
    };

    addCompany(freshCorp);

    // Reset Form
    setCompanyName('');
    setBusinessId('');
    setContactEmail('');
    setContactName('');
    setIsCreating(false);
  };

  const handleUpdateActiveField = (field: Partial<B2BCompany>) => {
    if (!activeCompany) return;
    const updated = { ...activeCompany, ...field };
    setActiveCompany(updated);
    updateCompany(activeCompany.id, field);
  };

  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactEmail || !activeCompany) return;

    const freshPersonnel: B2BContact = {
      customerId: `cust-user-${Date.now()}`,
      name: newContactName,
      email: newContactEmail,
      role: newContactRole
    };

    const updatedContacts = [...activeCompany.contacts, freshPersonnel];
    handleUpdateActiveField({ contacts: updatedContacts });

    // Reset Form dialog
    setNewContactName('');
    setNewContactEmail('');
    setShowContactModal(false);
  };

  const handleRemovePersonnel = (customerId: string) => {
    if (!activeCompany) return;
    const updatedContacts = activeCompany.contacts.filter(c => c.customerId !== customerId);
    handleUpdateActiveField({ contacts: updatedContacts });
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    setLocations([...locations, newLocationInput.trim()]);
    setNewLocationInput('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* SECTION BANNER HEADLINE */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-[#888] font-bold">对公合作</span>
          <h2 className="text-sm font-bold text-[#111] font-sans">企业管理</h2>
        </div>
        {!activeCompany && (
          <button
            onClick={() => {
              setIsCreating(!isCreating);
            }}
            className="bg-neutral-900 hover:bg-black text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? '查看目录' : '新增企业'}</span>
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white border border-neutral-250 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-2 border-b border-neutral-100 pb-2.5">
            <Building2 className="w-4 h-4 text-indigo-650" />
            <h3 className="text-xs font-sans font-bold text-neutral-900">
              新增企业
            </h3>
          </div>

          <form onSubmit={handleCreateCompany} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">企业全称</label>
                <input
                  type="text"
                  required
                  placeholder="Nexus Apparel S.p.A."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">官方税号</label>
                <input
                  type="text"
                  required
                  placeholder="IT-069018AA"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">经营地址</label>
                <input
                  type="text"
                  placeholder="Milano, Italy"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">代表姓名</label>
                <input
                  type="text"
                  placeholder="Mario Rossi"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">授权邮箱</label>
                <input
                  type="email"
                  placeholder="mario.rossi@nexus.it"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">记账账期</label>
                <select
                  value={paymentTerm}
                  onChange={(e: any) => setPaymentTerm(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                >
                  <option value="Net 30">周期30天结算 (Net 30)</option>
                  <option value="Net 60">周期60天结算 (Net 60)</option>
                  <option value="Due on receipt">即结到款发货 (Due on receipt)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1 font-bold">授信额度</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                创建协议
              </button>
            </div>
          </form>
        </div>
      ) : activeCompany ? (
        /* ================= B2B COMPLEX DETAILS EXPLORE PAGE ================= */
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex items-center space-x-3 border-b border-neutral-150 pb-4">
            <button
              onClick={() => setActiveCompany(null)}
              className="p-1.5 hover:bg-neutral-150 rounded-lg text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-neutral-900 font-mono italic">{activeCompany.name}</h3>
                <span className="bg-neutral-900 text-white font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  B2B Master Profile
                </span>
              </div>
              <p className="text-[10px] text-neutral-450 font-mono mt-0.5">商业税区注册码: {activeCompany.businessId} // 协议驻地: {activeCompany.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT AREA: MASTER ACCOUNT POLICIES */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* B2B COMPANY SPEC CONTEXT */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#008060]" />
                  对公清算核心协议条约
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  
                  {/* SELECT TERMS */}
                  <div className="bg-neutral-25 border border-neutral-200 p-3 rounded-lg space-y-2">
                    <span className="text-[9px] uppercase text-neutral-400 font-bold block">现行账期结算条约 (Payment Terms)</span>
                    <select
                      value={activeCompany.paymentTerm}
                      onChange={(e: any) => handleUpdateActiveField({ paymentTerm: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                    >
                      <option value="Net 30">Net 30 (30天对账结算期)</option>
                      <option value="Net 60">Net 60 (60天宽限授信期)</option>
                      <option value="Due on receipt">款到承运 (Due on receipt)</option>
                    </select>
                  </div>

                  {/* CREDIT LINES */}
                  <div className="bg-neutral-25 border border-neutral-200 p-3 rounded-lg space-y-2">
                    <span className="text-[9px] uppercase text-neutral-400 font-bold block">循环商户信用额限制 (Credit Limit)</span>
                    <div className="flex items-center space-x-1.5 focus-within:ring-1 focus-within:ring-black">
                      <span className="text-neutral-500 font-bold">€</span>
                      <input
                        type="number"
                        value={activeCompany.creditLimit}
                        onChange={(e) => handleUpdateActiveField({ creditLimit: Number(e.target.value) })}
                        className="w-full bg-transparent border-none text-xs font-bold text-neutral-900 focus:outline-none focus:ring-0 focus:border-none p-1"
                      />
                    </div>
                  </div>

                </div>

                {/* WHOLESALE PRICING CATALOG ASSOCIATION */}
                <div className="bg-neutral-50/50 border border-neutral-200 p-4 rounded-xl font-mono text-xs space-y-3">
                  <span className="text-[9px] uppercase text-neutral-500 font-extrabold tracking-wider block">批次专属折扣商品价格表 (Catalogs Mappings)</span>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-white border border-neutral-200 p-3 rounded-lg">
                    <div>
                      <p className="font-bold text-neutral-800">Premium Leather & Office Wholesale Catalog</p>
                      <p className="text-[10px] text-neutral-500">已映射目录：直降35%阶梯批发底价 // 锁定特定系列目录</p>
                    </div>
                    <select
                      value={activeCompany.catalogId || 'cat-std-wholesale'}
                      onChange={(e) => handleUpdateActiveField({ catalogId: e.target.value })}
                      className="bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1 text-[11px] focus:outline-none font-bold"
                    >
                      <option value="cat-premium-wholesale">👑 特别高尊大客户批发价(35% Off)</option>
                      <option value="cat-tech-corporate">💼 科技定制对公阶梯价(25% Off)</option>
                      <option value="cat-fashion-retail">👗 快反服装供应链批发底价(50% Off)</option>
                      <option value="cat-std-wholesale">🏷️ 常规合伙人合作批发价(15% Off)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* PERSONNEL ROLES MATRICES */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-neutral-600" />
                    企业买方往来团队及权限体系
                  </h4>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-xs text-indigo-650 font-bold hover:underline flex items-center space-x-1 font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加往来代表</span>
                  </button>
                </div>

                {showContactModal && (
                  <form onSubmit={handleAddPersonnel} className="bg-neutral-50 border border-neutral-250 p-4 rounded-lg space-y-3 font-mono text-xs animate-fadeIn">
                    <h5 className="font-bold text-neutral-800">建立往来买手权限账号</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase text-neutral-500 mb-1">代表姓名 (Personnel Name)</label>
                        <input
                          type="text"
                          required
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase text-neutral-500 mb-1">往来邮箱 (Core Email)</label>
                        <input
                          type="email"
                          required
                          value={newContactEmail}
                          onChange={(e) => setNewContactEmail(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase text-neutral-500 mb-1">授予买手权责级别 (Representative Roles)</label>
                      <select
                        value={newContactRole}
                        onChange={(e: any) => setNewContactRole(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                      >
                        <option value="admin">组织首席管理员 (Master Admin - 拥有充值、买单及增删人全权)</option>
                        <option value="buyer">限制买手代表 (Restricted Buyer - 仅有在授信额度下采购提货权)</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setShowContactModal(false)}
                        className="px-2 py-1 bg-white border border-neutral-250 rounded text-[9px] font-bold"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="px-2 py-1 bg-neutral-900 text-white rounded text-[9px] font-bold"
                      >
                        确立代表并授权
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-450 text-[10px]">
                        <th className="py-2">买方代表</th>
                        <th className="py-2">联络邮箱</th>
                        <th className="py-2">授予角色</th>
                        <th className="py-2 text-right">管理操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCompany.contacts.map((contact, idx) => (
                        <tr key={contact.customerId || idx} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-2.5 font-bold text-neutral-800">{contact.name}</td>
                          <td className="py-2.5 text-neutral-500">{contact.email}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              contact.role === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {contact.role === 'admin' ? '主承运代表' : '买手授权人'}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleRemovePersonnel(contact.customerId)}
                              className="text-red-650 font-bold hover:underline"
                            >
                              移出组织
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR: FINANCIAL CREDIT LINES & BUSINESS OUTLETS */}
            <div className="space-y-6">
              
              {/* ACCUMULATIVE BALANCES */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider border-b border-neutral-150 pb-2">
                  财务结算授信看板
                </h4>
                <div className="text-center font-mono py-2 bg-neutral-25 border border-black/5 rounded-xl space-y-1">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">大客户B2B累计消费总毛利额</span>
                  <p className="text-xl font-bold text-neutral-950 font-mono">
                    {currencySymbol}{activeCompany.totalSpent.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-neutral-450 block font-mono">累计成交对公账单数: {activeCompany.ordersCount} 笔</span>
                </div>

                <div className="bg-[#008060]/5 border border-[#008060]/20 p-3 rounded-lg text-xs font-mono space-y-1.5 text-neutral-800">
                  <div className="flex items-center space-x-1 font-bold">
                    <Scroll className="w-4 h-4 text-[#008060]" />
                    <span>欠款挂账及支用预警</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    当前对公账单已承运 €0.00，信用额度可用率 100%。本周期账期结算合规率完美 (A级企业客群)。
                  </p>
                </div>
              </div>

              {/* LOCATIONS/FACILITIES LISTING */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider border-b border-neutral-150 pb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  协议交货地点 / 机构驻地
                </h4>

                <div className="space-y-2">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="border border-neutral-150 p-2.5 rounded bg-neutral-25/20 text-xs font-mono text-neutral-700">
                      🏢 <span className="font-bold">{loc}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddLocation} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 法兰克福发货仓"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    className="flex-1 bg-neutral-25 border border-neutral-250 rounded px-2 py-1 focus:outline-none text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-black text-white px-2.5 py-1 rounded text-[10px] uppercase font-bold"
                  >
                    添加
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ================= COMPANIES DIRECTORY TABLE ================= */
        <div className="bg-white border border-neutral-250 rounded-xl shadow-xs overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-250 bg-neutral-25 text-neutral-450 text-[10px]">
                  <th className="px-4 py-3">企业全称</th>
                  <th className="px-4 py-3">官方税号</th>
                  <th className="px-4 py-3">经营地址</th>
                  <th className="px-4 py-3">企业代表</th>
                  <th className="px-4 py-3">授信账期</th>
                  <th className="px-4 py-3 text-right">累计购额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {companies.map((entry) => (
                  <tr 
                    key={entry.id} 
                    onClick={() => setActiveCompany(entry)}
                    className="hover:bg-neutral-25/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5 font-bold text-neutral-900 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-neutral-400" />
                      <span className="hover:underline">{entry.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-600">{entry.businessId}</td>
                    <td className="px-4 py-3.5 text-neutral-500">{entry.location}</td>
                    <td className="px-4 py-3.5 font-bold text-neutral-800">{entry.primaryContactName}</td>
                    <td className="px-4 py-3.5">
                      <span className="bg-neutral-900 text-white font-bold text-[8px] uppercase tracking-wide px-2 py-0.5 rounded">
                        {entry.paymentTerm}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-neutral-950">
                      {currencySymbol}{entry.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
