import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  Shield, 
  Mail, 
  UserCheck, 
  X, 
  Trash2, 
  Calendar,
  Layers,
  Clock,
  Briefcase
} from 'lucide-react';
import { IndustryType } from '../../types';

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Store Manager' | 'Staff Cashier' | 'Audit Auditor' | 'Marketing Planner';
  phone: string;
  status: 'online' | 'on_shift' | 'offline' | 'on_break';
  joinedDate: string;
  activeShift: string;
}

interface EmployeeCenterProps {
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function EmployeeCenter({ selectedIndustry, addLog }: EmployeeCenterProps) {
  const [employees, setEmployees] = useState<EmployeeItem[]>([
    { id: 'emp-1', name: '李明 (Ming Li)', email: 'ming.li@vitesse.com', role: 'Administrator', phone: '+86 138-0000-1111', status: 'online', joinedDate: '2026-01-10', activeShift: '全天总值班 (09:00 - 18:00)' },
    { id: 'emp-2', name: '王芳 (Jane Wang)', email: 'jane.wang@vitesse.com', role: 'Store Manager', phone: '+86 139-2222-3333', status: 'on_shift', joinedDate: '2026-02-15', activeShift: '日常巡查班 (13:00 - 21:00)' },
    { id: 'emp-3', name: '张强 (Aaron Zhang)', email: 'aaron.z@vitesse.com', role: 'Staff Cashier', phone: '+86 137-4444-5555', status: 'on_break', joinedDate: '2026-03-01', activeShift: '早间结账班 (08:30 - 16:30)' },
    { id: 'emp-4', name: '陈静 (Clara Chen)', email: 'clara.c@vitesse.com', role: 'Marketing Planner', phone: '+86 136-6666-7777', status: 'offline', joinedDate: '2026-04-20', activeShift: '--' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Administrator' | 'Store Manager' | 'Staff Cashier' | 'Audit Auditor' | 'Marketing Planner'>('Staff Cashier');
  const [newPhone, setNewPhone] = useState('');
  const [newShift, setNewShift] = useState('常规白班 (09:00 - 18:00)');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newEmp: EmployeeItem = {
      id: `emp-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      phone: newPhone || '+86 135-0000-0000',
      status: 'offline',
      joinedDate: new Date().toISOString().split('T')[0],
      activeShift: newShift
    };

    setEmployees([...employees, newEmp]);
    addLog(
      'System Operator',
      'Employee Onboarded',
      `Add human employee "${newEmp.name}" with security role: [${newEmp.role}]. Sent credentials invite email.`,
      'success'
    );

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewRole('Staff Cashier');
    setNewPhone('');
    setNewShift('常规白班 (09:00 - 18:00)');
    setShowAddModal(false);
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove human team member "${name}"? This terminates active OAuth tokens.`)) {
      setEmployees(employees.filter(e => e.id !== id));
      addLog(
        'System Operator',
        'Employee Decommissioned',
        `Deauthorized team member "${name}" and deleted workplace security profiles.`,
        'warning'
      );
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const query = searchQuery.toLowerCase();
    return emp.name.toLowerCase().includes(query) || 
           emp.email.toLowerCase().includes(query) || 
           emp.role.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Header operations bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 font-display text-base">企业员工中心 (WMS Staff Registry)</h3>
            <p className="text-xs text-slate-500 mt-0.5">管理当前空间内的物理真实雇员、店员或者外部财务审计师，查看其排班及系统安全准入状态。</p>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="搜索员工名字/职务..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 px-3 py-1.5 rounded-xl text-xs w-48 font-mono"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>录入新店员/雇员</span>
            </button>
          </div>
        </div>

        {/* Invite Form Overlay modal view */}
        {showAddModal && (
          <form onSubmit={handleAddEmployee} className="p-5 bg-slate-50 border border-indigo-100 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                新增员工档案 & 分配专属通道权限
              </h4>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">员工真名</label>
                <input 
                  type="text" 
                  required 
                  placeholder="例如: 张雪" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">电子邮箱 / 登录凭据</label>
                <input 
                  type="email" 
                  required 
                  placeholder="例如: xue.zhang@yourcompany.com" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">企业安全角色</label>
                <select 
                  value={newRole} 
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-800 font-medium"
                >
                  <option value="Staff Cashier">普通店员 Cashier</option>
                  <option value="Store Manager">分店经理 Manager</option>
                  <option value="Marketing Planner">运营推手 Planner</option>
                  <option value="Audit Auditor">三方审计监察 Auditor</option>
                  <option value="Administrator">超级系统超管 Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">联系电话</label>
                <input 
                  type="text" 
                  placeholder="+86 135-0000-0000" 
                  value={newPhone} 
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">规定出勤排班 (Shift Plan)</label>
                <select
                  value={newShift}
                  onChange={e => setNewShift(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="常规白班 (09:00 - 18:00)">常规白班 (09:00 - 18:00)</option>
                  <option value="早班收银 (08:30 - 16:30)">早班收银 (08:30 - 16:30)</option>
                  <option value="晚间值班 (14:00 - 22:00)">晚间值班 (14:00 - 22:00)</option>
                  <option value="弹性专案制 (--)" >弹性专案制 (自由出勤)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-150">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-rose-500 font-bold text-xs px-4 py-2 cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-200 cursor-pointer"
              >
                分发激活激活邀约
              </button>
            </div>
          </form>
        )}

        {/* Employees Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left bg-slate-50">
                <th className="p-3 pl-4">员工姓名</th>
                <th className="p-3">电子邮箱</th>
                <th className="p-3">系统安全角色</th>
                <th className="p-3">活跃状态</th>
                <th className="p-3">日常排班</th>
                <th className="p-3">入职日期</th>
                <th className="p-3 pr-4 text-right">管理操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors text-xs">
                  <td className="p-3 pl-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-black text-center flex items-center justify-center text-[10px]">
                      {emp.name.substring(0, 1)}
                    </div>
                    {emp.name}
                  </td>
                  <td className="p-3 font-mono text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      {emp.email}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      <Shield className="w-3 h-3 text-slate-400" />
                      {emp.role === 'Administrator' && '👑 超级管理员'}
                      {emp.role === 'Store Manager' && '👔 店铺经理'}
                      {emp.role === 'Staff Cashier' && '🛒 普通收银店员'}
                      {emp.role === 'Audit Auditor' && '🔍 外部财务审计'}
                      {emp.role === 'Marketing Planner' && '📣 市场推广经理'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="flex items-center gap-1.5 font-semibold text-[10px]">
                      {emp.status === 'online' && (
                        <>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className="text-emerald-700 uppercase">在线 · 活动</span>
                        </>
                      )}
                      {emp.status === 'on_shift' && (
                        <>
                          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                          <span className="text-sky-700 uppercase">当前当班中</span>
                        </>
                      )}
                      {emp.status === 'on_break' && (
                        <>
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          <span className="text-amber-700 uppercase">就餐休息</span>
                        </>
                      )}
                      {emp.status === 'offline' && (
                        <>
                          <span className="w-1.5 h-1.5 bg-slate-305 rounded-full bg-slate-400"></span>
                          <span className="text-slate-500 uppercase">离线</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      {emp.activeShift}
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">{emp.joinedDate}</td>
                  <td className="p-3 pr-4 text-right">
                    <button
                      onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                      className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="注销此员工"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-xs text-slate-400 italic">
                    <Users className="w-10 h-10 mx-auto text-slate-205 text-slate-300 mb-2" />
                    没有找到匹配的员工档案。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
