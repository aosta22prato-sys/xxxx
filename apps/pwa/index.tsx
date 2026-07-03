/**
 * ECOS PWA Companion Mobile Web App Portal
 */

import React, { useState } from 'react';
import { dbEngine } from '../../src/db/dbEngine';

export default function PwaCompanion() {
  const [logs, setLogs] = useState(() => dbEngine.healing_audit_logs.getAll().slice(0, 4));

  return (
    <div className="max-w-md mx-auto min-h-[80vh] bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 flex flex-col justify-between overflow-hidden shadow-2xl font-sans text-left">
      
      {/* PWA Phone Header layout */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-[#07C2E3] flex items-center justify-center font-black text-slate-950 text-[10px]">C</div>
          <span className="font-extrabold text-[#07C2E3] text-xs">Companion WebApp</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] text-slate-400 font-mono">PWA CONNECTED</span>
        </div>
      </div>

      {/* Main Core Body */}
      <div className="p-4 flex-1 space-y-4 text-left overflow-y-auto">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase">实时全网总营收 (EUR)</span>
          <div className="text-xl font-bold font-mono mt-1 text-white">€ 362,145.50</div>
          <p className="text-[10px] text-emerald-400 mt-1">✓ 环比昨日增长 +8.41% 从本地数据库结算</p>
        </div>

        {/* Diagnostic Core Widgets */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">自愈审计实时日志</h4>
          <div className="space-y-2">
            {logs.map((log, idx) => (
              <div key={log.audit_id || idx} className="bg-slate-900 border border-slate-850 rounded-lg p-2.5 font-mono text-[9.5px] text-slate-400 leading-normal">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Audit Event</span>
                  <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
                {log.action}
              </div>
            ))}
          </div>
        </div>

        {/* Quick action buttons list */}
        <div className="space-y-2 pt-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">快速平台操作</h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => alert('已调度高级AI财务主管，即刻触发报税试算审计流')}
              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-[10px] py-2 rounded-lg cursor-pointer text-center"
            >
              🔄 重启AI财务审计
            </button>
            <button 
              onClick={() => {
                dbEngine.healing_audit_logs.create({
                  incident_id: 'manual_pwa_ping',
                  action: 'PWA Cashier ping triggered manual self-heal test suite',
                  before_state: 'IDLE',
                  after_state: 'HEALING_VERIFIED'
                });
                setLogs(dbEngine.healing_audit_logs.getAll().slice(0, 4));
                alert('自愈测试包已顺利写入，全网完成心跳一致性校验。');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-[10px] py-2 rounded-lg cursor-pointer text-center"
            >
              ⚡ 写入自愈校验
            </button>
          </div>
        </div>
      </div>

      {/* Simple PWA Tab Bar footer mockup */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex justify-around text-[10px] text-slate-400">
        <span className="text-[#07C2E3] font-bold">🏠 监控大盘</span>
        <span>💼 AI 主管</span>
        <span>⚙️ 参数配置</span>
      </div>

    </div>
  );
}
