import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Mail, Phone, Calendar, ShoppingBag, 
  Plus, Edit, Trash2, ShieldCheck, ClipboardCheck, Sparkles, AlertCircle 
} from 'lucide-react';
import { Customer, Order } from '../../../types';
import { useOrderStore } from '../../../stores/orderStore';
import { useCustomerStore } from '../../../stores/customerStore';
import { useShopStore } from '../../../stores/shopStore';

interface CustomerDetailViewProps {
  customerId: string;
  onBack: () => void;
}

export default function CustomerDetailView({ customerId, onBack }: CustomerDetailViewProps) {
  const { customers, updateCustomer, deleteCustomer } = useCustomerStore();
  const { orders } = useOrderStore();
  const { settings } = useShopStore();

  const customer = customers.find(c => c.id === customerId);

  // Address Dialog Local States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Italy');
  const [zip, setZip] = useState('');

  // Editing Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState(customer?.firstName || '');
  const [editLastName, setEditLastName] = useState(customer?.lastName || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');
  const [editPhone, setEditPhone] = useState(customer?.phone || '');
  const [editNotes, setEditNotes] = useState(customer?.notes || '');

  // Tag Input Local State
  const [newTag, setNewTag] = useState('');

  if (!customer) {
    return (
      <div className="p-8 text-center bg-white border border-neutral-200 rounded-lg">
        <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-xs font-mono text-neutral-500">客户账户或档案未找到</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded text-xs font-mono">
          返回目录
        </button>
      </div>
    );
  }

  // Filter orders by customer email or name
  const customerOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === customer.email.toLowerCase() ||
           o.customerName.toLowerCase() === `${customer.firstName} ${customer.lastName}`.toLowerCase()
  );

  const currencySymbol = settings.currencySymbol || '€';

  // Addresses fallback
  const addresses = customer.addresses || [
    { id: 'addr-default', isDefault: true, addressLines: 'Via Montenapoleone 8', city: 'Milano', country: 'Italy', zipCode: '20121' }
  ];

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine || !city || !zip) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
      addressLines: addressLine,
      city,
      country,
      zipCode: zip
    };

    updateCustomer(customer.id, {
      addresses: [...addresses, newAddr]
    });

    // Reset Form
    setAddressLine('');
    setCity('');
    setZip('');
    setShowAddressModal(false);
  };

  const handleRemoveAddress = (addressId: string) => {
    const updated = addresses.filter(a => a.id !== addressId);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    updateCustomer(customer.id, { addresses: updated });
  };

  const handleSaveProfile = () => {
    updateCustomer(customer.id, {
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
      phone: editPhone,
      notes: editNotes
    });
    setIsEditingProfile(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const clean = newTag.trim().toLowerCase();
    if (!customer.tags.includes(clean)) {
      updateCustomer(customer.id, {
        tags: [...customer.tags, clean]
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateCustomer(customer.id, {
      tags: customer.tags.filter(t => t !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight font-mono">
                {customer.firstName} {customer.lastName}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                customer.segment === 'VIP' ? 'bg-[#fff5f5] text-red-650 border border-red-200' :
                customer.segment === 'Returning' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                customer.segment === 'B2B' ? 'bg-neutral-905 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {customer.segment} 级尊
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">注册时间: 2026年3月12日 // CRM ID: {customer.id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <a
            href={`mailto:${customer.email}`}
            className="bg-white border border-neutral-300 text-neutral-700 font-mono font-bold text-[10px] px-3.5 py-2 rounded hover:bg-neutral-50 transition-colors uppercase"
          >
            发送促活邮件
          </a>
          <button
            onClick={() => {
              if (confirm('是否确定要冻结此客户账号？该客户将无法在前端店面结账。')) {
                alert('客户账号已成功冻结');
              }
            }}
            className="bg-white border border-red-250 text-red-600 font-mono font-bold text-[10px] px-3.5 py-2 rounded hover:bg-red-50 transition-colors uppercase"
          >
            冻结买家账号
          </button>
        </div>
      </div>

      {/* TWO COLUMNS BENTO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CRITICAL TRANSACTIONAL DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 👤 CUSTOMER LIFE PROFILE BOX */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-150 pb-3 mb-4">
              <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                主体会员档案
              </h3>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs text-indigo-650 font-bold hover:underline flex items-center space-x-1 font-mono"
              >
                <Edit className="w-3 h-3" />
                <span>{isEditingProfile ? '取消' : '修改主体资料'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">名 (First Name)</label>
                    <input 
                      type="text" 
                      value={editFirstName} 
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">姓 (Last Name)</label>
                    <input 
                      type="text" 
                      value={editLastName} 
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">电子邮件地址</label>
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase text-neutral-500 mb-1">手机联络电话</label>
                    <input 
                      type="text" 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase text-neutral-500 mb-1">对公机构名称 (可选)</label>
                  <input 
                    type="text" 
                    value={customer.company || ''} 
                    disabled
                    className="w-full bg-neutral-100 border border-neutral-250 text-neutral-400 rounded px-2.5 py-1.5 cursor-not-allowed"
                  />
                  <p className="text-[9px] text-neutral-400 mt-0.5">如需变更关联 B2B 信用机构，请在新开发的公司治理页对公分配。</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-neutral-900 text-white font-bold px-4 py-2 rounded text-[10px] uppercase tracking-wide"
                  >
                    保存修订
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs font-mono text-neutral-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-neutral-900 font-bold">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{customer.phone || '未绑定联络电话'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>最近登录: 12 小时前 IP: 93.12.190.1</span>
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-150 rounded-lg p-3 text-xs font-mono space-y-1">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">隶属 B2B 实体关联</span>
                  {customer.company ? (
                    <div>
                      <p className="font-bold text-neutral-800">{customer.company}</p>
                      <span className="text-[10px] text-indigo-750 block mt-1 hover:underline cursor-pointer">
                        绑定合约信息 → Net 30/60 有效
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic text-[11px] block">标准 B2C 普通直销个人客户</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 📦 ADDRESS LIST CARD */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-150 pb-3 mb-4">
              <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neutral-700" />
                物流送货地址 ({addresses.length})
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs text-indigo-650 font-bold hover:underline flex items-center space-x-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>录入新发货驻地</span>
              </button>
            </div>

            {showAddressModal && (
              <form onSubmit={handleAddAddressSubmit} className="bg-neutral-50 border border-neutral-250 p-4 rounded-lg mb-4 space-y-3 font-mono text-xs animate-fadeIn">
                <h4 className="font-bold">新增配送地址信息</h4>
                <div>
                  <label className="block text-[8px] uppercase text-neutral-500 mb-1">街道和门牌号 (Address Line)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Via Montenapoleone 12"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">城市 (City)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Milano"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">国家 (Country)</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">邮编 (ZIP)</label>
                    <input
                      type="text"
                      required
                      placeholder="20121"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-1.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="p-1.5 bg-white border border-neutral-250 rounded text-[9px] font-bold"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="p-1.5 bg-neutral-900 text-white rounded text-[9px] font-bold"
                  >
                    确定添加
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-neutral-150 p-3 rounded-lg flex items-start justify-between bg-neutral-25/30 hover:bg-neutral-50 transition-all font-mono text-xs">
                  <div>
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="font-bold text-neutral-800">{addr.addressLines}</span>
                      {addr.isDefault && (
                        <span className="bg-neutral-901 text-white text-[7px] tracking-wide uppercase px-1 py-0.2 rounded">默认主地址</span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500">{addr.city}, {addr.country}, {addr.zipCode}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(addr.id)}
                    className="text-neutral-400 hover:text-red-600 p-1 rounded"
                    title="删除此地址"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🛒 HISTORIC ORDERS TABLE */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-150 pb-3 mb-4">
              <ShoppingBag className="w-4 h-4 text-neutral-700" />
              历史归属订单列表 ({customerOrders.length} 件)
            </h3>

            {customerOrders.length === 0 ? (
              <div className="p-6 text-center text-neutral-450 italic font-mono text-[11px]">
                该买家暂无任何成交单项记录。
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase">
                      <th className="py-2">订单编号</th>
                      <th className="py-2">交易日期</th>
                      <th className="py-2">结算状态</th>
                      <th className="py-2 text-right">毛利额 / 贡献</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((ord) => (
                      <tr key={ord.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <td className="py-2.5 font-bold text-indigo-650 hover:underline cursor-pointer">{ord.name}</td>
                        <td className="py-2.5 text-neutral-550">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            ord.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-neutral-100 text-neutral-500'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-neutral-800">
                          {currencySymbol}{ord.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: METRICS INDEX & TAG COHORTS */}
        <div className="space-y-6">
          
          {/* STATS OVERVIEW */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider border-b border-neutral-150 pb-3">
              价值核对清单
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center font-mono">
              <div className="bg-neutral-25 border border-black/5 p-3 rounded-lg">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">累计购买量</span>
                <p className="text-lg font-bold text-neutral-900 mt-1">{customer.ordersCount} 笔已交割</p>
              </div>
              <div className="bg-neutral-25 border border-black/5 p-3 rounded-lg">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">累计购买额</span>
                <p className="text-lg font-bold text-neutral-900 mt-1">{currencySymbol}{customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-[#008060] font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>客群价值预测 (CLV)</span>
              </div>
              <p className="text-emerald-950 leading-relaxed text-[11px]">
                根据 LTV 算法推演，该客户流失概率极低 (Low Risk)，预计未来 90 日内仍有追加下单可能。
              </p>
            </div>
          </div>

          {/* TAGS CLUSTERING CONTAINER */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider border-b border-neutral-150 pb-3">
              客户分类标签群
            </h3>

            <div className="flex flex-wrap gap-1">
              {customer.tags && customer.tags.length > 0 ? (
                customer.tags.map((tag) => (
                  <span key={tag} className="bg-neutral-50 hover:bg-neutral-100 hover:text-black border border-neutral-200.5 pl-2.5 pr-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-600 flex items-center space-x-1 uppercase group">
                    <span>{tag}</span>
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-450 hover:text-red-650 opacity-60 hover:opacity-100 transition-opacity ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-neutral-400 italic text-[11px] font-mono">该买家目前暂不含特殊标签 tags</span>
              )}
            </div>

            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                placeholder="键入新特征标签并按回车..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 bg-neutral-25 border border-neutral-250 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-black font-mono"
              />
              <button
                type="submit"
                className="bg-neutral-900 hover:bg-black text-white px-3 py-1.5 rounded text-[11px] font-bold"
              >
                添加
              </button>
            </form>
          </div>

          {/* CRM INTERACTIVE LOGS TIMELINE */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-wider border-b border-neutral-150 pb-3">
              顾问记录时间线 (CRM Timeline)
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="relative pl-5 border-l border-neutral-200 space-y-3.5 pb-2.5">
                
                {/* TIMELINE DOT 1 */}
                <div className="relative">
                  <div className="absolute -left-[24.5px] top-1 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                  <p className="font-bold text-neutral-800">首单成交记录建立</p>
                  <p className="text-[10px] text-neutral-400">2026年6月16日 // 系统指令完成</p>
                </div>

                {/* TIMELINE DOT 2 */}
                <div className="relative">
                  <div className="absolute -left-[24.5px] top-1 w-2 h-2 rounded-full bg-neutral-400 ring-4 ring-neutral-50" />
                  <p className="font-bold text-neutral-800">对公结算 B2B 意向核定</p>
                  <p className="text-[10px] text-neutral-400">2026年4月5日 // 操作主管：Admin</p>
                </div>

                {/* TIMELINE DOT 3 */}
                <div className="relative">
                  <div className="absolute -left-[24.5px] top-1 w-2 h-2 rounded-full bg-neutral-400 ring-4 ring-neutral-50" />
                  <p className="font-bold text-neutral-800">客户新会员档案卡建立</p>
                  <p className="text-[10px] text-neutral-400">2026年3月12日 // 自动化建立</p>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
