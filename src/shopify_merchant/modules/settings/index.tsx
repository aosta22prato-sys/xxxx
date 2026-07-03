/**
 * Premium Adaptive Settings HUD Panel (Architecture Lock v1.0)
 * Style Reference: Stripe, Shopify, Apple, Linear.
 * 100% Pure Chinese (No bilingual translations), High Interactivity, Grid-based HUD Cards.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, CreditCard, Users, Shield, Sliders, MapPin, 
  Database, Layout, Globe, RefreshCw, CheckCircle2, ChevronRight,
  ArrowRight, Lock, Trash2, Cpu, Zap, Radio, Check, Laptop, ShieldCheck
} from 'lucide-react';
import { useShopStore } from '../../stores/shopStore';
import { useAuthStore } from '../../stores/authStore';
import { useLayoutStore } from '../../stores/layoutStore';

export default function SettingsView() {
  const { settings, updateSettings } = useShopStore();
  const { currentUser, collaborators, addCollaborator } = useAuthStore();
  const { setCurrentTab } = useLayoutStore();

  const [toast, setToast] = useState<string | null>(null);

  // High-Tech Setting States
  const [intelligentMute, setIntelligentMute] = useState(true);
  const [aiRuleGate, setAiRuleGate] = useState(true);
  const [streamDeduplication, setStreamDeduplication] = useState(true);
  const [encryptDatabase, setEncryptDatabase] = useState(false);
  const [networkLatency, setNetworkLatency] = useState('11ms');

  // New collaborator form
  const [collabName, setCollabName] = useState('');
  const [collabEmail, setCollabEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('staff');

  // Translation locales list 
  const [activeLocales, setActiveLocales] = useState([
    { code: 'zh', name: '国域中文', flag: '枢纽' },
    { code: 'en', name: '欧盟英文', flag: '就绪' },
    { code: 'ja', name: '日本和风', flag: '就绪' }
  ]);
  const [newLocaleCode, setNewLocaleCode] = useState('fr');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('基本配置层已更新');
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabName || !collabEmail) return;
    addCollaborator({
      name: collabName,
      email: collabEmail,
      role: selectedRole as any,
      permissions: ['inventory_read']
    });
    setCollabName('');
    setCollabEmail('');
    triggerToast('新协务授权成功');
  };

  const handleAddLocale = () => {
    const names: Record<string, string> = {
      fr: '法国香榭',
      de: '德国柏林',
      it: '意大利米兰',
      es: '西班牙马德里'
    };
    if (activeLocales.some(l => l.code === newLocaleCode)) {
      triggerToast('翻译译链已就绪');
      return;
    }
    setActiveLocales([...activeLocales, { code: newLocaleCode, name: names[newLocaleCode] || newLocaleCode, flag: '新增' }]);
    triggerToast('新国域映射链增加');
  };

  const measureLatency = () => {
    setNetworkLatency('...');
    setTimeout(() => {
      const ping = Math.floor(Math.random() * 8) + 8;
      setNetworkLatency(`${ping}ms`);
      triggerToast('云节点重刷自检成功');
    }, 600);
  };

  return (
    <div id="settings-hud" className="space-y-6 font-sans antialiased text-neutral-800 max-w-7xl mx-auto p-1 relative select-none">
      
      {/* Dynamic Toast Popup */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className="fixed top-5 right-5 z-50 bg-neutral-950 text-white text-[11px] font-bold py-2.5 px-4 rounded-xl shadow-xl border border-neutral-800 flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-[#008060]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION - CLEAN MINIMAL STYLE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200/60 pb-5 gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900">
            店铺设置
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">管理您店铺的全局基本设置、协作成员及语言区域配置</p>
        </div>
      </div>

      {/* GRID LAYOUT FOR PREMIUM MULTI-COLUMN DESIGN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: PRIMARY CARD BLOCK (8/12 SPAWN) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* CARD 1: GENERAL PHYSICAL CONFIGURATION */}
          <div className="bg-white border border-[#e3e3e3] rounded-2xl p-5 shadow-3xs space-y-4 hover:border-neutral-300 transition-colors">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold text-neutral-900 border-l-[3px] border-[#008060] pl-2">商号物理配置</span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">TENANT SCHEMA</span>
            </div>

            <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">商号公称门牌</label>
                <input
                  type="text"
                  required
                  value={settings.shopName}
                  onChange={(e) => updateSettings({ shopName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">客服联络邮箱</label>
                <input
                  type="email"
                  required
                  value={settings.shopEmail}
                  onChange={(e) => updateSettings({ shopEmail: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">分拨基底结算本币</label>
                <select
                  value={settings.currency}
                  onChange={(e) => {
                    const mappedCur = e.target.value;
                    const symbols: Record<string, string> = { EUR: '€', USD: '$', CNY: '¥' };
                    updateSettings({ currency: mappedCur, currencySymbol: symbols[mappedCur] || '€' });
                    triggerToast(`核心本币标定: ${mappedCur}`);
                  }}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-all font-medium"
                >
                  <option value="CNY">人民币结算 (¥ CNY)</option>
                  <option value="EUR">欧盟欧元 (€ EUR)</option>
                  <option value="USD">美元账户结算 ($ USD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">基础货物保价邮资</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-semibold text-neutral-450">{settings.currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={settings.shippingStandardRate}
                    onChange={(e) => updateSettings({ shippingStandardRate: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 pl-8 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-all font-mono font-bold"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#008060] hover:bg-[#006e52] active:bg-[#005d45] text-white text-[11.5px] font-black px-4 py-2 rounded-lg transition-colors cursor-pointer active:scale-97 select-none shadow-3xs"
                >
                  确认物理保存
                </button>
              </div>
            </form>
          </div>

          {/* CARD 2: COOPERATOR & PERMISSION MANAGEMENT */}
          <div className="bg-white border border-[#e3e3e3] rounded-2xl p-5 shadow-3xs space-y-4 hover:border-neutral-300 transition-colors">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold text-neutral-900 border-l-[3px] border-[#008060] pl-2">协务团队与后勤体系</span>
              <span className="text-[10px] font-mono text-[#008060] font-bold">NODE SECURITY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Add New Collaborator Form Section */}
              <form onSubmit={handleAddCollaborator} className="md:col-span-5 space-y-3 border-r-0 md:border-r border-neutral-150 pr-0 md:pr-5">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-neutral-400 block uppercase block">姓名</span>
                  <input
                    type="text"
                    required
                    placeholder="请输入协务姓名"
                    value={collabName}
                    onChange={(e) => setCollabName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-neutral-400 block uppercase block">管理邮箱</span>
                  <input
                    type="email"
                    required
                    placeholder="请输入授权邮箱"
                    value={collabEmail}
                    onChange={(e) => setCollabEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-neutral-400 block uppercase block">控制权限阈值</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-all"
                  >
                    <option value="admin">系统主管 (物理只写)</option>
                    <option value="staff">一般后勤 (一般只读)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-lg active:scale-97 transition-all cursor-pointer block text-center shadow-3xs"
                >
                  签署发放令牌
                </button>
              </form>

              {/* Connected Active Collaborators Grid */}
              <div className="md:col-span-7 space-y-2">
                <span className="text-[10px] font-black text-neutral-450 uppercase block tracking-wider mb-2.5">当前已核签节点 ({1 + collaborators.length})</span>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border border-neutral-200/50 rounded-xl bg-neutral-50/40">
                    <div className="truncate pr-2.5">
                      <span className="text-xs font-black text-neutral-900 block truncate">{currentUser.name}</span>
                      <span className="text-[9px] font-mono text-neutral-400 block mt-0.5 truncate">{currentUser.email}</span>
                    </div>
                    <span className="text-[9px] bg-neutral-950 text-white font-extrabold px-2.5 py-0.5 rounded-md shrink-0">
                      主理人
                    </span>
                  </div>

                  {collaborators.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-neutral-150 rounded-xl bg-white hover:border-neutral-250 transition-colors">
                      <div className="truncate pr-2.5">
                        <span className="text-xs font-extrabold text-neutral-800 block truncate">{col.name}</span>
                        <span className="text-[9px] font-mono text-neutral-450 block mt-0.5 truncate">{col.email}</span>
                      </div>
                      <span className="text-[9px] bg-[#008060]/15 text-[#008060] font-black px-2.5 py-0.5 rounded-md shrink-0">
                        {col.role === 'admin' ? '系统主管' : '后勤协作'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: GEOGRAPHIC LOCATIONS & REAL-TIME DISTRIBUTION LOCKS */}
          <div className="bg-white border border-[#e3e3e3] rounded-2xl p-5 shadow-3xs space-y-4 hover:border-neutral-300 transition-colors">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold text-neutral-900 border-l-[3px] border-[#008060] pl-2">地中物理调拨仓网</span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">WAREHOUSE NODES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 border border-neutral-150 rounded-xl bg-neutral-50/20 hover:border-neutral-250 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-900">巴黎核心分流主仓</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">主储备仓</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10.5px]">
                  <span className="text-neutral-450 font-bold">物理定位: Zone 9, Paris</span>
                  <span className="text-neutral-800 font-mono font-extrabold">延迟: 14ms</span>
                </div>
                <div className="mt-2 text-[9.5px] text-neutral-400 border-t border-neutral-100 pt-2 flex justify-between items-center">
                  <span>分配负载 12.5%</span>
                  <span className="text-emerald-600 font-bold">物理正常</span>
                </div>
              </div>

              <div className="p-4 border border-neutral-150 rounded-xl bg-neutral-50/20 hover:border-neutral-250 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-900">东京港物理备用港</span>
                  <span className="text-[9px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-bold">自提调配</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10.5px]">
                  <span className="text-neutral-450 font-bold">物理定位: Shiba-koen, Tokyo</span>
                  <span className="text-neutral-800 font-mono font-extrabold">延迟: 112ms</span>
                </div>
                <div className="mt-2 text-[9.5px] text-neutral-400 border-t border-neutral-100 pt-2 flex justify-between items-center">
                  <span>分配负载 2.8%</span>
                  <span className="text-neutral-500 font-bold">离线负载阀</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CYBER HIGH-TECH PANEL (4/12 SPAWN) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* CARD 5: TRANSACTION GATEWAYS */}
          <div className="bg-white border border-[#e3e3e3] rounded-2xl p-5 shadow-3xs space-y-4 hover:border-neutral-300 transition-colors">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold text-neutral-900 border-l-[3px] border-[#008060] pl-2">交易结算渠道</span>
               <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">GATEWAYS</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: '微信支付渠道 (WeChat)', type: '微信直连支付' },
                { name: '支付宝交易接口 (Alipay)', type: '支付宝官方通道' },
                { name: '国际商户结汇 (Stripe Hub)', type: '国际信用卡支付 (Stripe)' }
              ].map((gate, i) => (
                <div 
                  key={i} 
                  className="p-3 border border-neutral-150 rounded-xl hover:bg-neutral-50/10 hover:border-neutral-250 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-neutral-850 block">{gate.name}</span>
                    <span className="text-[9.5px] text-neutral-400 block mt-0.5">{gate.type}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[9.5px] text-emerald-600 font-black">就绪</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 6: TRANSLATION CORE */}
          <div className="bg-white border border-[#e3e3e3] rounded-2xl p-5 shadow-3xs space-y-4 hover:border-neutral-300 transition-colors">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs font-extrabold text-neutral-900 border-l-[3px] border-[#008060] pl-2">国域翻译及翻译树</span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">LOCALES</span>
            </div>

            <div className="space-y-2">
              {activeLocales.map((loc) => (
                <div key={loc.code} className="p-3 border border-neutral-150 rounded-xl flex items-center justify-between hover:bg-neutral-50/20">
                  <div>
                    <span className="text-xs font-bold text-neutral-900">{loc.name}</span>
                    <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">编译树完备 (/{loc.code})</span>
                  </div>
                  <span className="text-[9px] bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded">
                    {loc.flag}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2.5">
              <div>
                <span className="text-[10.5px] font-bold text-neutral-800 block">一键加载映射</span>
                <span className="text-[9px] text-neutral-400 block">调用 LLM 将商品及订单自动投送翻译网格</span>
              </div>
              
              <div className="flex gap-2.5">
                <select
                  value={newLocaleCode}
                  onChange={(e) => setNewLocaleCode(e.target.value)}
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#008060] font-medium"
                >
                  <option value="fr">法国香榭 (fr)</option>
                  <option value="de">德国柏林 (de)</option>
                  <option value="it">意大利米兰 (it)</option>
                  <option value="es">西班牙马德里 (es)</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddLocale}
                  className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 rounded-lg active:scale-97 transition-all cursor-pointer whitespace-nowrap shadow-3xs"
                >
                  分拨路由
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
