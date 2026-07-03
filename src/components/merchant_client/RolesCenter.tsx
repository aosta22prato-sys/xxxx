import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Settings, 
  Check, 
  X, 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  Coins,
  Activity,
  Award
} from 'lucide-react';
import { IndustryType } from '../../types';

interface RolePermissions {
  id: string;
  name: string;
  codename: string;
  description: string;
  modules: Record<string, boolean>; // Module key -> has permission
}

interface RolesCenterProps {
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function RolesCenter({ selectedIndustry, addLog }: RolesCenterProps) {
  const [roles, setRoles] = useState<RolePermissions[]>([
    {
      id: 'r-admin',
      name: '超级系统管理员 (Administrator)',
      codename: 'super_admin',
      description: '全系统控制权限，包含结算审计、支付密码调校、API Key重写以及AI雇员解雇权。',
      modules: { sales: true, products: true, orders: true, logistics: true, payments: true, marketing: true, finance: true, knowledge: true, config: true }
    },
    {
      id: 'r-manager',
      name: '分支机构店长 (Store Manager)',
      codename: 'store_manager',
      description: '管理店铺订单履行、低水位货架调拨，以及微调特定 AI 雇员的 System Prompt 指令词。',
      modules: { sales: true, products: true, orders: true, logistics: true, payments: false, marketing: true, finance: false, knowledge: true, config: false }
    },
    {
      id: 'r-accountant',
      name: '企业财务核轧员 (Financial Auditor)',
      codename: 'financial_auditor',
      description: '拥有销售流水监控、财务中心审计看板、自动轧账、 Stipe/PayPal 订单退银操作核销特权。',
      modules: { sales: true, products: false, orders: false, logistics: false, payments: true, marketing: false, finance: true, knowledge: false, config: false }
    },
    {
      id: 'r-clerk',
      name: '柜面/收银专员 (Staff Clerk)',
      codename: 'staff_clerk',
      description: '纯线下柜台 POS 级别收银和手动开单，无法进行系统级的 API Key 重连或后台资产修改。',
      modules: { sales: true, products: true, orders: true, logistics: false, payments: false, marketing: false, finance: false, knowledge: false, config: false }
    }
  ]);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('r-admin');
  const [showAddRole, setShowAddRole] = useState(false);

  // Form states
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const MODULES_INFO = [
    { key: 'sales', name: '销售中心 (Sales)', icon: TrendingUp },
    { key: 'products', name: '商品中心 (Products)', icon: ShoppingBag },
    { key: 'orders', name: '订单中心 (Orders)', icon: ShoppingCart },
    { key: 'logistics', name: '物流中心 (Logistics)', icon: Truck },
    { key: 'payments', name: '支付中心 (Payments)', icon: CreditCard },
    { key: 'marketing', name: '营销中心 (Marketing)', icon: Coins },
    { key: 'finance', name: '财务中心 (Finance)', icon: Coins },
    { key: 'knowledge', name: '知识库中心 (RAG Knowledge)', icon: Settings },
    { key: 'config', name: '企业设置管理 (Config)', icon: Award },
  ];

  const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (roleId: string, moduleKey: string) => {
    const updated = roles.map(r => {
      if (r.id === roleId) {
        const currentVal = !!r.modules[moduleKey];
        return {
          ...r,
          modules: {
            ...r.modules,
            [moduleKey]: !currentVal
          }
        };
      }
      return r;
    });
    setRoles(updated);
    addLog(
      'System Monitor',
      'Security Policy Altered',
      `Modified permission rules for role [${activeRole.codename.toUpperCase()}]: toggled access for module [${moduleKey}].`,
      'info'
    );
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const newR: RolePermissions = {
      id: `r-custom-${Date.now()}`,
      name: newRoleName,
      codename: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      description: newRoleDesc || 'Customized security access role rules.',
      modules: { sales: true, products: false, orders: false, logistics: false, payments: false, marketing: false, finance: false, knowledge: false, config: false }
    };

    setRoles([...roles, newR]);
    setSelectedRoleId(newR.id);
    addLog(
      'System Operator',
      'Created Custom Security Role',
      `Defined security credentials role "${newR.name}" in workspace ACL database.`,
      'success'
    );

    setNewRoleName('');
    setNewRoleDesc('');
    setShowAddRole(false);
  };

  const handleDeployPolicy = () => {
    addLog(
      'System Operator',
      'ACL Policies Synchronized',
      `Successfully generated JWT authentication configurations containing live permission scopes and synced across active API routes.`,
      'success'
    );
    alert('Security policies deployed successfully! All active user tokens have been synchronized.');
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Banner and Description */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Access Control List (ACL)</span>
          <h3 className="text-xl font-bold font-display">角色权限与安全准入 Matrix</h3>
          <p className="text-xs text-[#d1d5db] font-normal leading-relaxed max-w-xl">
            对不同岗位的职能人员设定精确的安全边界。每个角色限制其可访问的系统前后台功能卡片，避免非授权进行财务和高敏感的 API 调取。
          </p>
        </div>

        <button 
          onClick={handleDeployPolicy}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg shadow-indigo-950/20 tracking-wider h-max cursor-pointer"
        >
          分发并生效全局安全政策
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Roles Selector list */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">系统角色列表</span>
            <button 
              onClick={() => setShowAddRole(true)}
              className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新建角色
            </button>
          </div>

          {showAddRole && (
            <form onSubmit={handleCreateRole} className="p-3 bg-slate-50 border border-indigo-100 rounded-xl space-y-3 animate-fadeIn text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 mb-1">角色名称</label>
                <input 
                  type="text" 
                  required 
                  placeholder="例如: 临时质检员" 
                  value={newRoleName} 
                  onChange={e => setNewRoleName(e.target.value)}
                  className="w-full bg-white border rounded p-1.5 focus:ring-1 focus:ring-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 mb-1">功能权限描述</label>
                <input 
                  type="text" 
                  placeholder="例如: 专门审查服装款式，没有修改其它货架权利" 
                  value={newRoleDesc} 
                  onChange={e => setNewRoleDesc(e.target.value)}
                  className="w-full bg-white border rounded p-1.5 focus:ring-1 focus:ring-indigo-505" 
                />
              </div>
              <div className="flex justify-end gap-1 text-[10px]">
                <button type="button" onClick={() => setShowAddRole(false)} className="text-slate-500 py-1 px-2 cursor-pointer">取消</button>
                <button type="submit" className="bg-indigo-600 text-white font-bold py-1 px-3 rounded-lg cursor-pointer">创建</button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {roles.map((r) => {
              const worksAsActive = selectedRoleId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all text-xs font-semibold flex items-center justify-between border cursor-pointer ${
                    worksAsActive 
                      ? 'bg-indigo-50 border-indigo-150 text-indigo-950 ring-1 ring-indigo-100 font-bold' 
                      : 'hover:bg-slate-50 border-transparent text-[#475569]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className={`w-3.5 h-3.5 ${worksAsActive ? 'text-indigo-600' : 'text-slate-405'}`} />
                    <span>{r.name}</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-60">#{r.codename}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column - Precision Permissions Matrix */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slide-100 pb-3 flex items-center gap-2 text-slate-800">
            <Lock className="w-4 h-4 text-indigo-600 animate-pulse" />
            <h4 className="font-bold text-xs uppercase tracking-wider font-mono">
              配置角色：{activeRole.name}
            </h4>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-lg italic leading-relaxed">
            &ldquo;{activeRole.description}&rdquo;
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">细分系统模块权限明细开关:</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {MODULES_INFO.map(mod => {
                const isEnabled = !!activeRole.modules[mod.key];
                const Icon = mod.icon;

                return (
                  <div 
                    key={mod.key} 
                    onClick={() => handleTogglePermission(activeRole.id, mod.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isEnabled 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-slate-50/50 border-slate-150'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[12px] font-semibold ${isEnabled ? 'text-slate-800 font-bold' : 'text-slate-450 text-slate-400 line-through'}`}>
                        {mod.name}
                      </span>
                    </div>

                    <div className="relative">
                      {/* Check toggle switch styled */}
                      <button 
                        type="button" 
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none flex items-center ${isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-200 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>当前已授予 {Object.values(activeRole.modules).filter(Boolean).length} / {MODULES_INFO.length} 项功能入口。</span>
            </div>
            <span>安全标准：等级三(企业高合规)</span>
          </div>

        </div>

      </div>

    </div>
  );
}
