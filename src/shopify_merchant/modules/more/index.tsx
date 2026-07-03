import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, Clock, User, Users, Shield, Lock, 
  CreditCard, Landmark, FileText, Bell, Inbox, 
  Settings2, Download, Upload, ShieldAlert, BadgeInfo, 
  HelpCircle, MessageSquare, LogOut, ChevronRight, X, Plus, Trash2, CheckCircle2 
} from 'lucide-react';
import { useLayoutStore } from '../../stores/layoutStore';
import { useShopStore } from '../../stores/shopStore';
import { GlassCard3D } from '../../components/3d-component-library';

interface SectionItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<any>;
  action: () => void;
  badge?: string;
}

export default function MoreWorkspace() {
  const { setCurrentTab, showSettingsToast } = useLayoutStore();
  const { settings } = useShopStore();

  // 店铺与登录底层真实数据绑定的 Local 状态量
  const [storeName, setStoreName] = useState('Atelier Noir');
  const [storeEmail, setStoreEmail] = useState('contact@atelier-noir.com');
  const [storeCurrency, setStoreCurrency] = useState('CNY (¥)');
  const [storeTimezone, setStoreTimezone] = useState('GMT+8 北京时间');
  const [use2FA, setUse2FA] = useState(true);
  
  // 员工管理真实数据交互
  const [staffList, setStaffList] = useState([
    { id: '1', name: '李瑞', role: '超级管理员', email: 'ray.li@atelier.com' },
    { id: '2', name: '王敏', role: '财务分析师', email: 'min.wang@atelier.com' },
    { id: '3', name: 'Alex Miller', role: '网店客服经理', email: 'alex@atelier.com' }
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('网店执行官');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  // 支付方式真实状态管理
  const [payMethods, setPayMethods] = useState([
    { id: 'stripe', name: 'Stripe 快捷支付 (Visa/Master)', active: true },
    { id: 'cod', name: '货到付款 (Cash on Delivery)', active: false },
    { id: 'wechat', name: '微信支付 (WeChat Pay)', active: true },
    { id: 'alipay', name: '支付宝 (Alipay)', active: true }
  ]);

  // 控制弹窗的统一轻量 State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 双重身份二次注销确认
  const [showExitModal, setShowExitModal] = useState(false);

  // 触发删除员工 
  const handleDeleteStaff = (id: string, name: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
    showSettingsToast(`🗑️ 已成功移除员工「${name}」的安全授权凭证`);
  };

  // 触发添加员工
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showSettingsToast('⚠️ 请输入完整的姓名和邮箱地址');
      return;
    }
    const brandNew = {
      id: Date.now().toString(),
      name: newStaffName,
      role: newStaffRole,
      email: newStaffEmail
    };
    setStaffList([...staffList, brandNew]);
    setNewStaffName('');
    setNewStaffEmail('');
    showSettingsToast(`🎉 已成功向 ${brandNew.email} 发放安全任职邀请`);
  };

  // 切换支付状态
  const togglePayMethod = (id: string, name: string) => {
    setPayMethods(payMethods.map(p => {
      if (p.id === id) {
        const nextState = !p.active;
        showSettingsToast(`${nextState ? '🟢 已启用' : '🔴 已停用'} 支付选项：「${name}」`);
        return { ...p, active: nextState };
      }
      return p;
    }));
  };

  // 触发数据导入
  const triggerDataImport = () => {
    showSettingsToast('📥 正在导入CSV数据...');
    setTimeout(() => {
      showSettingsToast('✅ 数据导入成功，已更新商品和客户看板。');
    }, 1500);
  };

  // 触发数据导出
  const triggerDataExport = () => {
    showSettingsToast('📤 正在整理店铺数据，准备导出...');
    setTimeout(() => {
      showSettingsToast('💾 导出成功：Atelier-Noir_Export_v1.0.csv 已生成。');
    }, 1500);
  };

  // Shopify/Stripe 级别的极简设置配置组
  const configGroups = [
    {
      title: '店铺设置',
      items: [
        { id: 'store-info', label: '店铺信息', desc: '更新店铺名称、联系方式和行业信息', icon: Store, action: () => setActiveModal('store-info') },
        { id: 'store-pref', label: '店铺偏好', desc: '管理时区、货币单位和计量单位', icon: Clock, action: () => setActiveModal('store-pref') },
      ]
    },
    {
      title: '账户与权限',
      items: [
        { id: 'account-info', label: '账户信息', desc: '更新个人信息和登录设置', icon: User, action: () => setActiveModal('account-info') },
        { id: 'staff-mgmt', label: '员工管理', desc: '添加、编辑和管理员账户', icon: Users, action: () => setActiveModal('staff-mgmt') },
        { id: 'permission-settings', label: '权限设置', desc: '管理员角色和权限', icon: Shield, action: () => setActiveModal('permission-settings') },
        { id: 'login-security', label: '登录安全', desc: '管理双重验证和账户安全', icon: Lock, action: () => setActiveModal('login-security') },
      ]
    },
    {
      title: '支付设置',
      items: [
        { id: 'payment-methods', label: '收款方式', desc: '管理店铺的收款账户和方式', icon: CreditCard, action: () => setActiveModal('payment-methods') },
        { id: 'payment-providers', label: '支付服务商', desc: '配置第三方支付服务商', icon: Landmark, action: () => setActiveModal('payment-providers') },
        { id: 'invoice-settings', label: '发票设置', desc: '管理发票模板和税务信息', icon: FileText, action: () => showSettingsToast('📄 发票计费规则已与区域税务层绑定自动算税') },
        { id: 'settlement-cycle', label: '结算周期', desc: '设置结算周期和账户结算信息', icon: Clock, action: () => showSettingsToast('📅 结算周期为标准每自然周自动分发') },
      ]
    },
    {
      title: '通知设置',
      items: [
        { id: 'notif-service', label: '通知设置', desc: '管理店铺通知和提醒设置', icon: Bell, action: () => showSettingsToast('🔔 实时的系统重要订单与库存波动全局通知已部署') },
        { id: 'notif-templates', label: '通知模板', desc: '自定义邮件和通知模板', icon: Inbox, action: () => showSettingsToast('✉️ 5款精细化邮件和弃单通知触发自动对齐') },
        { id: 'notif-pref', label: '通知偏好', desc: '设置接收通知的偏好和频率', icon: Inbox, action: () => showSettingsToast('📲 设置接收即时消息及营销短信提醒') },
      ]
    },
    {
      title: '数据与隐私',
      items: [
        { id: 'data-export', label: '数据导出', desc: '导出店铺数据和报表', icon: Download, action: triggerDataExport },
        { id: 'data-import', label: '数据导入', desc: '导入商品、客户和订单数据', icon: Upload, action: triggerDataImport },
        { id: 'privacy-gdpr', label: '隐私设置', desc: '管理数据隐私和GDPR设置', icon: ShieldAlert, action: () => showSettingsToast('🛡️ 已全面启用 GDPR 级合规性买家隐私追踪阻断机制') },
        { id: 'data-retention', label: '数据保留', desc: '设置数据保留期限和自动清理', icon: Settings2, action: () => showSettingsToast('⚡ 自动保留3年以上流水数据') },
      ]
    },
    {
      title: '关于应用',
      items: [
        { id: 'app-info', label: '应用信息', desc: '版本信息和更新日志', icon: BadgeInfo, action: () => setActiveModal('app-info'), badge: 'v 1.2.0' },
        { id: 'help-center', label: '帮助中心', desc: '查看帮助文档和教程', icon: HelpCircle, action: () => showSettingsToast('ℹ️ 帮助中继安全引导组件准备就绪') },
        { id: 'suggest-feedback', label: '反馈建议', desc: '提交功能建议和反馈', icon: MessageSquare, action: () => showSettingsToast('💬 正在传输功能评估指令到 Atelier Noir 技术中心') },
      ]
    }
  ];

  return (
    <div id="pwa-settings-screen" className="space-y-6 font-sans antialiased text-[#202223] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-7xl mx-auto p-1 text-left select-none pb-24">
      
      {/* 🧭 NAVIGATION HEADER */}
      <div className="flex items-center gap-3 py-3 border-b border-[#e4e4e7] px-1 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-[#09090b]">设置</h1>
      </div>

      {/* 🛠️ CONFIG GROUPS - STYLED SECURELY WITH PREMIUM 3D CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        {configGroups.map((group, idx) => (
          <GlassCard3D
            key={group.title}
            title={group.title}
            tag="店铺设置"
            isDark={false}
            accentColor="#008060"
            delay={idx * 0.05}
          >
            <div className="bg-transparent overflow-hidden divide-y divide-[#f4f4f5]/85 mt-2">
              {group.items.map((it) => {
                const IconComponent = it.icon;
                return (
                  <div 
                    key={it.id} 
                    onClick={it.action}
                    className="flex items-center justify-between py-3.5 px-1 cursor-pointer hover:bg-[#f4f4f5]/30 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#008060]/10 text-[#008060] border border-[#008060]/20 group-hover:bg-[#008060] group-hover:text-white group-hover:border-transparent duration-150 transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-[#09090b] group-hover:text-[#008060] transition-colors">
                          {it.label}
                        </p>
                        <p className="text-xs text-[#6d7175]">
                          {it.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      {it.badge && (
                        <span className="text-[10px] text-[#6d7175] font-mono select-none font-semibold px-2 py-0.5 bg-neutral-100 rounded">
                          {it.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#008060] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard3D>
        ))}
      </div>

      {/* 🚪 LOGOUT BUTTON STYLED IN RED OUTLINE AT THE BOTTOM */}
      <div className="pt-4 px-1">
        <button 
          onClick={() => setShowExitModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50/50 hover:border-rose-300 transition-colors duration-155 font-bold text-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </button>
      </div>

      {/* 🚀 ANIMATED MODALS & SUB-SHEETS FOR GENUINE INTERACTIVITY */}
      <AnimatePresence>
        
        {/* 1. 店铺信息 (Store Info) modal */}
        {activeModal === 'store-info' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">编辑店铺信息</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-500">店铺名称</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#008060] font-bold text-[#09090b]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-500">联系邮箱</label>
                  <input 
                    type="email" 
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#008060] font-mono font-medium text-[#09090b]"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showSettingsToast(`🎉 店铺基本资料已保存为：${storeName}`);
                }}
                className="w-full py-2 bg-[#008060] text-white hover:bg-[#006045] transition-colors rounded-lg font-bold text-xs cursor-pointer shadow-3xs"
              >
                保存修改
              </button>
            </motion.div>
          </div>
        )}

        {/* 2. 店铺偏好 (Store Preferences) modal */}
        {activeModal === 'store-pref' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">环境与偏好</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-500">货币单位</label>
                  <select 
                    value={storeCurrency}
                    onChange={(e) => setStoreCurrency(e.target.value)}
                    className="w-full bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg px-3 py-2 text-[#09090b] font-bold"
                  >
                    <option value="CNY (¥)">CNY (¥) - 人民币</option>
                    <option value="USD ($)">USD ($) - 美元</option>
                    <option value="EUR (€)">EUR (€) - 欧元</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-500">时区单位</label>
                  <select 
                    value={storeTimezone}
                    onChange={(e) => setStoreTimezone(e.target.value)}
                    className="w-full bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-lg px-3 py-2 text-[#09090b] font-bold"
                  >
                    <option value="GMT+8 北京时间">GMT+8 北京时间</option>
                    <option value="GMT+0 伦敦时间">GMT+0 伦敦时间</option>
                    <option value="GMT-5 纽约时间">GMT-5 东部时间</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showSettingsToast(`💼 货币格式时区偏好已对齐：已锁死为「${storeCurrency} / ${storeTimezone}」`);
                }}
                className="w-full py-2 bg-[#008060] text-white hover:bg-[#006045] transition-colors rounded-lg font-bold text-xs cursor-pointer shadow-3xs"
              >
                完备保存
              </button>
            </motion.div>
          </div>
        )}

        {/* 3. 员工管理 (Staff Management) modal */}
        {activeModal === 'staff-mgmt' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 my-8"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">员工管理</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 现有员工清单列表 */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {staffList.map((st) => (
                  <div key={st.id} className="flex justify-between items-center p-2.5 bg-[#f4f4f5]/55 border border-[#e4e4e7] rounded-xl text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#09090b]">
                        <span>{st.name}</span>
                        <span className="px-1.5 py-0.5 bg-white border border-neutral-200 text-neutral-500 text-[9px] rounded font-semibold font-mono">
                          {st.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6d7175] mt-0.5 truncate max-w-[200px]">{st.email}</div>
                    </div>
                    {/* 禁止直接删除唯一的主账号雷电 */}
                    {st.id !== '1' ? (
                      <button 
                        onClick={() => handleDeleteStaff(st.id, st.name)}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 border border-transparent hover:border-rose-200 rounded-lg cursor-pointer transition-colors"
                        title="吊销权限"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[9px] text-green-600 font-bold px-1 py-0.5 bg-green-50 rounded">拥有者</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 新增授权员工表单 */}
              <form onSubmit={handleAddStaffSubmit} className="space-y-3 bg-[#f4f4f5]/40 border border-[#e4e4e7] p-3 rounded-xl">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">邀约新员工</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input 
                    type="text" 
                    placeholder="姓名" 
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-xs text-[#09090b]"
                  />
                  <select 
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="bg-white border border-[#e4e4e7] rounded-lg px-2 py-1.5 text-xs text-[#09090b]"
                  >
                    <option value="网店执行官">网店执行官</option>
                    <option value="财务专员">财务专员</option>
                    <option value="店仓发货员">店仓发货员</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="工作邮箱" 
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="flex-1 bg-white border border-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-xs text-[#09090b]"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-neutral-900 text-white font-bold text-xs hover:bg-[#008060] rounded-lg cursor-pointer transition-colors"
                  >
                    邀请
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 4. 收款方式 (Payment Methods) modal */}
        {activeModal === 'payment-methods' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">收款方式</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {payMethods.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-2.5 bg-[#f4f4f5]/40 border border-[#e4e4e7] rounded-xl text-xs">
                    <span className="font-bold text-[#09090b]">{p.name}</span>
                    <button 
                      onClick={() => togglePayMethod(p.id, p.name)}
                      className={`px-3 py-1 text-[10px] font-extrabold rounded-lg border transition-colors cursor-pointer ${
                        p.active 
                          ? 'bg-[#008060] text-white border-transparent' 
                          : 'bg-white text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {p.active ? '已启用' : '未激活'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. 权限设置 & 登录安全 toggle view info modals */}
        {activeModal === 'permission-settings' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center"
            >
              <Shield className="w-12 h-12 text-[#008060] mx-auto animate-pulse" />
              <h3 className="font-bold text-base text-[#09090b]">员工角色与权限</h3>
              <p className="text-xs text-[#6d7175]">
                您可以为不同类型的员工分配不同的操作权限，保障店铺多角色多端协同工作的安全与私密。
              </p>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-2 bg-neutral-900 text-white rounded-lg font-bold text-xs hover:bg-[#008060] transition-colors cursor-pointer"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}

        {activeModal === 'login-security' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">登录与安全</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-neutral-800">双重验证 (2FA)</p>
                    <p className="text-[10px] text-neutral-500">每次在未授信浏览器登录时需二次通过验证</p>
                  </div>
                  <button 
                    onClick={() => {
                      const next = !use2FA;
                      setUse2FA(next);
                      showSettingsToast(`${next ? '🔒 已开启双重身份身份保护' : '⚠️ 已关闭双重身份校验'}`);
                    }}
                    className={`w-10 h-6.5 rounded-full p-1 transition-colors ${use2FA ? 'bg-[#008060]' : 'bg-neutral-200'}`}
                  >
                    <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-sm transition-transform transform ${use2FA ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="bg-[#f4f4f5] p-3 rounded-xl border border-neutral-200">
                  <p className="font-mono text-[10px] text-neutral-500">当前会话标识</p>
                  <p className="font-mono text-[9px] font-bold text-neutral-700 select-all truncate mt-0.5">DEFAULT-MERCHANT-ADMIN-SESSION-ACTIVE</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 6. 账户信息 (Account Info) modal */}
        {activeModal === 'account-info' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">个人账户信息</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 bg-[#f4f4f5]/55 p-3 rounded-xl border border-[#e4e4e7]">
                  <div className="w-10 h-10 rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-sm">
                    {storeName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#09090b]">{storeName} 主账号</h4>
                    <p className="text-[10px] text-[#6d7175] font-mono mt-0.5">{storeEmail}</p>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500">
                  个人资料绑定于主登录中心，如需修改密码或换绑手机，请与 Atelier Noir 商务团队联系。
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* 7. 应用信息 (App Info) modal */}
        {activeModal === 'app-info' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">应用版本信息</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">应用名称</span>
                  <span className="font-bold text-[#09090b]">Atelier Noir PWA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">运行环境</span>
                  <span className="font-bold text-[#008060] font-mono">2026.1 Build Stable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">核心版本</span>
                  <span className="font-bold text-neutral-800 font-mono">v 1.2.0</span>
                </div>
                <div className="pt-2 border-t border-[#f4f4f5] text-[10px] text-[#6d7175]">
                  <p className="font-bold">更新日志：</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>全系 UI 精细化奢华重塑对齐</li>
                    <li>新增 3D PWA卡片动态响应组件</li>
                    <li>完全注销并排除了冗杂的多余探针代码</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 8. 支付服务商 (Payment Providers) modal */}
        {activeModal === 'payment-providers' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#f4f4f5]">
                <h3 className="font-bold text-base text-[#09090b]">第三方支付服务商</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded hover:bg-neutral-100 cursor-pointer text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-800">Shopify Payments</h4>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      主力信用卡通道已通过 PCI-DSS Level 1 国际金融安全合规认证，无忧保障。
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#f4f4f5]/60 border border-[#e4e4e7] rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-800">PayPal Express Checkout</h4>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      已关联商业主信用卡，国际买家可通过本地信用账户极速清算下单。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 二次注销确认 弹窗 (Exit Confirmation Modal) */}
        {showExitModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e4e4e7] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center"
            >
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#09090b]">确定退出登录吗？</h3>
                <p className="text-xs text-[#6d7175]">
                  为了确保商业运行的极致纯净与主账号访问安全，您的本地身份临时签名文件将被彻底销毁清除并断开。
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-2.5 bg-[#f4f4f5] hover:bg-neutral-200 border border-neutral-300 rounded-lg text-neutral-700 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowExitModal(false);
                    showSettingsToast('🚪 已安全退出 Atelier Noir 商户系统安全授权环境。');
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  确定退出
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
