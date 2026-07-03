import React, { useState } from "react";
import { User, SysLog, UserRole } from "../types";
import { ShieldAlert, Shield, HelpCircle, Power, UserCheck, Key, ListCollapse, BookOpen } from "lucide-react";

interface SettingsProps {
  users: User[];
  currentUser: User;
  sysLogs: SysLog[];
  onRoleSwitch: (role: UserRole, email: string) => void;
}

export default function Settings({ users, currentUser, sysLogs, onRoleSwitch }: SettingsProps) {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLogs = sysLogs.filter(log => {
    return filterType === "all" || log.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">⚙️ 设置中心 (Settings & RBAC Security)</h2>
        <p className="text-xs text-gray-500 mt-1">Configure user accounts permission protocols, switch ERP roles, and inspect physical database audit trails.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: RBAC switch controllers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 px-1">
            <Shield className="w-5 h-5 text-indigo-500" />
            企业级 RBAC 角色切换 (Switch Active ERP Role)
          </h3>

          <div className="space-y-3">
            {users.map(u => {
              const isActive = currentUser.role === u.role;
              return (
                <div
                  key={u.id}
                  onClick={() => onRoleSwitch(u.role, u.email)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isActive
                      ? "bg-indigo-55 border-indigo-250 shadow-md ring-2 ring-indigo-500/20"
                      : "bg-white border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{u.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{u.email}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded uppercase ${
                      isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {u.role}
                    </span>
                    {isActive && (
                      <span className="text-[9px] text-emerald-600 font-bold block mt-1.5 flex items-center gap-0.5 justify-end">
                        <UserCheck className="w-3.5 h-3.5" /> ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50/50 border border-amber-150 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              SaaS Rule Authorization Controls
            </h4>
            <p className="text-[10px] text-amber-700 leading-normal">
              SaaS admin menus and modules toggle visibility dynamically depending on active token privileges. Restricting non-finance staff from clearing credit books prevents internal leak factors.
            </p>
          </div>
        </div>

        {/* Right Side: Log Auditor panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              SaaS Platform Audit Trails (审计日志)
            </h3>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs py-1.5 px-3 bg-white border border-gray-200 rounded cursor-pointer"
            >
              <option value="all">All logs</option>
              <option value="auth">Authentication</option>
              <option value="db">DB queries</option>
              <option value="api">API Gateways</option>
              <option value="app">Apps ecosystem</option>
              <option value="supply">Procurements</option>
              <option value="audit">Security audits</option>
            </select>
          </div>

          {/* Table feed */}
          <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-gray-100 max-h-132 overflow-y-auto">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        log.level === "error" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        log.level === "warn" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-indigo-50/50 text-indigo-700 border border-indigo-100/50"
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Channel: {log.type}</span>
                    </div>

                    <p className="font-semibold text-gray-850 leading-relaxed">{log.message}</p>
                    <div className="text-[10px] text-gray-450 font-mono">
                      User: {log.user} <span className="text-gray-300">|</span> Client: {log.ip}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
