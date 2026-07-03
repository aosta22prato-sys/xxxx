import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { dbEngine } from '../../../db/dbEngine';
import { BusinessContextEngine } from '../../../services/brain/BusinessContextEngine';
import { 
  MemoryPattern, 
  MemoryWeight, 
  MemoryConfidence, 
  MemoryDecay, 
  MemoryReinforcement, 
  AgentDebate, 
  AgentVote, 
  AgentConsensus, 
  AgentVeto, 
  EnterpriseSimulation, 
  StrategicCampaign,
  RiskIncident,
  RiskMitigationRule,
  SpotOpportunity,
  GrowthCatalyst,
  ExecTask,
  SystemHealthHeartbeat,
  RiskOutcome,
  BusinessContextSnapshot,
  ContextEvent,
  ContextRecommendationResult,
  StoreReadiness,
  StoreChecklist,
  StoreGap,
  ExternalSignal,
  MarketRadarTrend,
  CopilotPerceptionState,
  AgentMission,
  AgentAssignment,
  AgentExecutionLog,
  AgentCapability,
  AgentWorkload,
  ExecutionPermission,
  ExecutionLimit,
  ExecutionAudit,
  RollbackRecord,
  ContextGapV2,
  BrainEvent,
  BrainChannel,
  BrainStream,
  BrainNotification,
  PageContext,
  StoreContext,
  ContextSnapshot,
  TaskRequest,
  TaskAudit,
  TaskApproval,
  TaskDenial
} from '../../../types';

// Phase 521-540 Services
import { BrainStreamService } from '../../../services/brain-stream/BrainStreamService';
import { BrainEventBus } from '../../../services/brain-stream/BrainEventBus';
import { BrainChannelManager } from '../../../services/brain-stream/BrainChannelManager';
import { PageAwarenessBridge } from '../../../services/context/PageAwarenessBridge';
import { StoreAwarenessBridge } from '../../../services/context/StoreAwarenessBridge';
import { TaskGateway } from '../../../services/gateway/TaskGateway';
import { PermissionResolver } from '../../../services/gateway/PermissionResolver';
import { TenantIsolationGuard } from '../../../services/gateway/TenantIsolationGuard';

// Phase 541-600 Services
import { BrainRuntime } from '../../../services/brain/runtime/BrainRuntime';
import { StoreDigitalTwinEngine } from '../../../services/brain/StoreDigitalTwinEngine';
import { StoreReadinessEngine } from '../../../services/brain/StoreReadinessEngine';
import { AgentCapabilityRegistry } from '../../../services/brain/AgentCapabilityRegistry';
import { EnterpriseActionGraph } from '../../../services/brain/EnterpriseActionGraph';

interface LayerProps {
  triggerSuccess: (msg: string) => void;
}

// -------------------------------------------------------------
// Layer 22: Enterprise Memory Consolidation Panel
// -------------------------------------------------------------
export function MemoryConsolidationLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [selectedPatId, setSelectedPatId] = useState('pat_01');
  const [newMemPatName, setNewMemPatName] = useState('');
  const [newMemPatTags, setNewMemPatTags] = useState('France, Wool, Coat');
  const [newMemPatSuccess, setNewMemPatSuccess] = useState(85);

  // Live Memory states
  const [memSearch, setMemSearch] = useState('');
  const [memTypeFilter, setMemTypeFilter] = useState<'all' | 'fact' | 'execution' | 'business' | 'learning'>('all');
  
  // Custom Memory form states
  const [customContent, setCustomContent] = useState('');
  const [customType, setCustomType] = useState<'fact' | 'execution' | 'business' | 'learning'>('fact');
  const [customSource, setCustomSource] = useState('Orchestrator');
  const [customImportance, setCustomImportance] = useState(7);
  const [customConfidence, setCustomConfidence] = useState(0.9);
  const [customEntity, setCustomEntity] = useState('');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const memPatterns = dbEngine.memory_patterns.getAll();
  const memWeights = dbEngine.memory_weights.getAll();
  const memConfidence = dbEngine.memory_confidence.getAll();
  const memDecay = dbEngine.memory_decay.getAll();
  const memReinforcements = dbEngine.memory_reinforcement.getAll();

  // Fetch true live memories and logs
  const rawMemories = dbEngine.memories.getAll();
  const liveLogs = dbEngine.memory_logs.getAll().sort((a,b) => b.created_at.localeCompare(a.created_at));

  // Memory scoring & filtering logic
  const filteredMemories = useMemo(() => {
    let list = [...rawMemories];
    if (memTypeFilter !== 'all') {
      list = list.filter(m => m.memory_type === memTypeFilter);
    }
    if (memSearch.trim()) {
      const q = memSearch.toLowerCase();
      list = list.filter(m => 
        m.content.toLowerCase().includes(q) || 
        m.source.toLowerCase().includes(q) || 
        (m.related_entity && m.related_entity.toLowerCase().includes(q))
      );
    }
    return list.map(m => ({
      ...m,
      calculatedScore: dbEngine.memories.calculateScore(m)
    })).sort((a, b) => b.calculatedScore - a.calculatedScore);
  }, [rawMemories, memSearch, memTypeFilter]);

  return (
    <div className="space-y-6 animate-fadeIn" id="memory_consolidation_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono font-sans">L321-330</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Enterprise Memory Runtime Hub</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            多智能体统一记忆中枢：融合事实（Fact）、执行（Execution）、业务（Business）与学习（Learning）记忆，提供排序检索、衰减校准以及全链审计。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              dbEngine.memories.applyDecay();
              triggerSuccess('Unified memory decay applied. Recency modifiers refreshed.');
            }}
            className="bg-slate-800 text-slate-100 hover:bg-slate-750 text-[11px] font-sans font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1"
          >
            <span>⏳ Trigger Time Decay</span>
          </button>
          <span className="bg-slate-800 text-[#07C2E3] text-[10px] font-bold font-mono px-2.5 py-1.5 rounded border border-slate-700">
            Connected Agents: 4 | Memory Items: {rawMemories.length}
          </span>
        </div>
      </div>

      {/* Main Memory Runtime Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: Memory Viewer & Creation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-205 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h4 className="font-sans font-bold text-slate-900 flex items-center gap-2 text-sm">
                <span className="text-xl">🧠</span> Real-Time Memory Registry (记忆体)
              </h4>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Type filters */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  {(['all', 'fact', 'execution', 'business', 'learning'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setMemTypeFilter(type)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md transition ${memTypeFilter === type ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={memSearch}
                onChange={e => setMemSearch(e.target.value)}
                placeholder="Search memories by content, related entity, or source agent..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-[#07C2E3] pl-8"
              />
              <span className="absolute left-2.5 top-3 text-slate-400 text-sm">🔍</span>
            </div>

            {/* List of active memories */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredMemories.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No active memories found matching parameters in the state registry.
                </div>
              ) : (
                filteredMemories.map(m => {
                  let badgeColor = "bg-sky-50 text-sky-700 border-sky-100";
                  if (m.memory_type === 'execution') badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                  if (m.memory_type === 'business') badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  if (m.memory_type === 'learning') badgeColor = "bg-purple-50 text-purple-700 border-purple-100";

                  return (
                    <div key={m.memory_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {m.memory_type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: <strong className="text-slate-700 font-bold">{m.memory_id}</strong>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">•</span>
                          <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-100 font-mono">
                            Agent: {m.source}
                          </span>
                          {m.related_entity && (
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-neutral-600">
                              Ref: {m.related_entity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-850 text-slate-800 break-words font-sans">{m.content}</p>
                        <div className="text-[9px] text-slate-400 font-mono">
                          Recorded: {new Date(m.created_at).toLocaleString()}
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="flex sm:flex-col items-end gap-2 text-right justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                        <div className="flex gap-2 text-center">
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-mono">Conf</span>
                            <span className="text-[10px] font-bold text-slate-700 font-mono">{Math.round(m.confidence * 100)}%</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-mono font-bold text-[#07C2E3]">Imp</span>
                            <span className="text-[10px] font-extrabold text-slate-850 font-mono text-[#07C2E3]">{m.importance}/10</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-[8px] text-slate-400 uppercase font-mono font-serif block">Decay Score</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#07C2E3] h-full" style={{ width: `${Math.min(100, m.calculatedScore * 100)}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-900 font-sans font-extrabold font-mono">{m.calculatedScore}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            dbEngine.memories.delete(m.memory_id);
                            triggerSuccess('Memory element deleted and logged to state audit.');
                          }}
                          className="text-slate-400 hover:text-rose-600 text-[10px] uppercase font-bold font-mono transition mt-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Create Direct Memory State Form */}
          <div className="bg-white border border-slate-205 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-slate-900 text-sm">
              📝 Direct Memory Writer (手动写入事实/经验)
            </h4>
            <p className="text-xs text-slate-500">
              通过超级管理员面板模拟写入高价值的事实、战略建议或元学习成果，数据将直接落库并对全体智能体可见。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono mb-1">Memory Content Description</label>
                <textarea
                  value={customContent}
                  onChange={e => setCustomContent(e.target.value)}
                  placeholder="e.g., Target campaign showed highly positive user retention under high inflation in France store..."
                  rows={3}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono mb-1">Memory Type</label>
                <select
                  value={customType}
                  onChange={e => setCustomType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#07C2E3]"
                >
                  <option value="fact">Fact (事实记忆)</option>
                  <option value="execution">Execution (执行记忆)</option>
                  <option value="business">Business (业务逻辑)</option>
                  <option value="learning">Learning (学习总结)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono mb-1">Source Agent</label>
                <input
                  type="text"
                  value={customSource}
                  onChange={e => setCustomSource(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono mb-1">Related Entity Identifier</label>
                <input
                  type="text"
                  value={customEntity}
                  onChange={e => setCustomEntity(e.target.value)}
                  placeholder="e.g., p_wool_jacket, FR"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase font-bold font-mono mb-1">Importance Weight (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={customImportance}
                  onChange={e => setCustomImportance(parseInt(e.target.value) || 7)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-505 uppercase font-bold font-mono mb-1 text-slate-400">Confidence (0.0 - 1.0)</label>
                <input
                  type="number"
                  step={0.05}
                  min={0.1}
                  max={1.0}
                  value={customConfidence}
                  onChange={e => setCustomConfidence(parseFloat(e.target.value) || 0.9)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (!customContent.trim()) {
                      triggerSuccess('Error: Memory content cannot be blank.');
                      return;
                    }
                    dbEngine.memories.create({
                      merchant_id: 'merchant_paris_01',
                      memory_type: customType,
                      source: customSource,
                      content: customContent,
                      importance: customImportance,
                      confidence: customConfidence,
                      related_entity: customEntity || undefined
                    });
                    setCustomContent('');
                    setCustomEntity('');
                    setTick(t => t + 1);
                    triggerSuccess('Memory successfully written to state registry.');
                  }}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold text-xs py-2.5 px-4 rounded-lg transition"
                >
                  Write Memory to Engine
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Audit Trail & Patterns Selection (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Real-time Audit Logger */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase tracking-wider block">Unified Memory Auditer</span>
                <h4 className="font-sans font-bold text-sm text-white mt-0.5">Memory System Audit Logs</h4>
              </div>
              <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-emerald-900 uppercase">
                Secure
              </span>
            </div>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {liveLogs.length === 0 ? (
                <p className="text-slate-500 italic text-xs py-8 text-center">No trace events recorded.</p>
              ) : (
                liveLogs.map(log => {
                  let actionColor = "text-sky-400";
                  if (log.action === 'DELETE') actionColor = "text-rose-400";
                  if (log.action === 'RETRACT_QUERY') actionColor = "text-purple-400";
                  if (log.action === 'UPDATE') actionColor = "text-amber-400";

                  return (
                    <div key={log.log_id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`font-bold ${actionColor}`}>
                          [{log.action}]
                        </span>
                        <span className="text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="text-slate-300">
                        <span className="text-slate-500">Agent:</span> {log.agent}
                      </div>

                      {log.action === 'RETRACT_QUERY' ? (
                        <div className="text-[10px] text-slate-400 bg-slate-900 border border-slate-850 p-1.5 rounded space-y-0.5">
                          <div><span className="text-slate-500">Query:</span> "{log.before?.query_text || 'none'}"</div>
                          <div><span className="text-slate-500">Entity:</span> {log.before?.entity_id || 'none'}</div>
                          <div><span className="text-[#07C2E3]">Result count:</span> {log.after?.matched_count || 0} items</div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">
                          <span className="text-slate-500">Diff targets:</span> {log.memory_id}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Fallback to original memory patterns logic so other components do not break */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl text-slate-800 space-y-4">
            <div className="border-b pb-3">
              <span className="text-[10px] text-slate-400 font-mono block">PATTERN CORRELATION</span>
              <h5 className="font-sans font-bold text-xs text-slate-900 mt-1">Experience Memory Patterns</h5>
            </div>
            
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {memPatterns.map(pat => {
                const isSelected = selectedPatId === pat.id;
                return (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatId(pat.id)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition flex justify-between items-center ${
                      isSelected ? 'bg-slate-950 text-white border-slate-950' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                    }`}
                  >
                    <span className="font-bold truncate max-w-[70%]">{pat.pattern_name}</span>
                    <span className="font-mono text-[10px] text-[#07C2E3]">{pat.success_rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 23: Autonomous Agent Governance Council Panel
// -------------------------------------------------------------
export function AgentGovernanceLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [selectedDebId, setSelectedDebId] = useState('deb_01');
  const [newDebateTopic, setNewDebateTopic] = useState('');
  const [newDebateAgent, setNewDebateAgent] = useState('marketing_agent');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const agentDebates = dbEngine.agent_debates.getAll();
  const agentVotes = dbEngine.agent_votes.getAll();
  const agentConsensus = dbEngine.agent_consensus.getAll();
  const agentVetoes = dbEngine.agent_vetoes.getAll();

  return (
    <div className="space-y-6 animate-fadeIn" id="agent_governance_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L331-340</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Autonomous Agent Governance Council (联委会)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            由 <strong>Marketing、Finance、Pricing、Inventory</strong> 四位专业级数智微智能体组成联邦辩论与表决大会，一票否决权（Veto）对齐底层宪法安全。
          </p>
        </div>
        <button
          onClick={() => {
            const deb = dbEngine.agent_debates.create({
              topic: '紧急开辟巴黎到米兰冬季重卡航空协同航线提案',
              initiator_agent_id: 'inventory_agent',
              status: 'active',
              context_data: '{"airline":"Air France Cargo","unit_cost":12.5}',
              created_at: new Date().toISOString()
            });
            triggerSuccess('Initialised new autonomous debate. Council members notified.');
            setTick(t => t + 1);
            setSelectedDebId(deb.id);
          }}
          className="bg-[#07C2E3] text-black font-extrabold text-xs px-3.5 py-2 rounded transition hover:bg-[#06B2D0]"
        >
          Trigger Emergency Council
        </button>
      </div>

      {/* Grid 12 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: Active Debates & Initiate debate */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-205 p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-sans font-bold text-sm text-slate-950 mb-4 flex items-center justify-between">
              <span>🗣... Active Council Debates</span>
              <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 rounded">CONSTITUTION GUARDED</span>
            </h4>

            <div className="space-y-3">
              {agentDebates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No active debates at present.</p>
              ) : (
                agentDebates.map((deb) => {
                  const isSelected = selectedDebId === deb.id;
                  return (
                    <div
                      key={deb.id}
                      onClick={() => setSelectedDebId(deb.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'bg-slate-950 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-205 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                          deb.status === 'active' ? 'bg-[#07C2E3] text-black animate-pulse' :
                          deb.status === 'vetoed' ? 'bg-rose-950 text-rose-450' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {deb.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Date: {new Date(deb.created_at).toLocaleDateString()}</span>
                      </div>
                      <h5 className="font-bold text-xs mt-2 leading-relaxed">{deb.topic}</h5>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 font-mono mt-3 border-t border-slate-800/10 pt-2">
                        <span>Initiated by: {deb.initiator_agent_id}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Create proposal to trigger Agent voting */}
          <div className="bg-white border border-slate-205 p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-950">
              📝 Propose Council Action to Agents
            </h4>
            <p className="text-xs text-slate-500">
              提交关于价格、备货或营销的大战略决策。提交后，AI联委会的 4 位智能体将在基于真实运营数据各自推演并投票。
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Proposal / Debate Topic</label>
                <input
                  type="text"
                  value={newDebateTopic}
                  onChange={(e) => setNewDebateTopic(e.target.value)}
                  placeholder="e.g. 降价15%清空西装，并增加斯德哥尔摩仓配预算"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded hover:border-slate-350 focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Initiating Agent</label>
                  <select
                    value={newDebateAgent}
                    onChange={(e) => setNewDebateAgent(e.target.value)}
                    className="w-full text-xs p-2.2 bg-slate-50 border border-slate-205 rounded focus:outline-none"
                  >
                    <option value="marketing_agent">Marketing (流量放大官)</option>
                    <option value="finance_agent">Finance (毛利审核大脑)</option>
                    <option value="pricing_agent">Pricing (弹性敏感沙盘)</option>
                    <option value="inventory_agent">Inventory (跨境仓配管家)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      if (!newDebateTopic.trim()) {
                        triggerSuccess('Error: Topic is required.');
                        return;
                      }
                      const debate = dbEngine.agent_debates.create({
                        topic: newDebateTopic,
                        initiator_agent_id: newDebateAgent,
                        status: 'active',
                        context_data: '{}',
                        created_at: new Date().toISOString()
                      });

                      // Simulate 4 agency votes synchronously & write them to DB
                      const isFinanceVeto = newDebateTopic.includes('降价') && !newDebateTopic.includes('高');
                      const isPricingOppose = newDebateTopic.includes('降价');

                      // Marketing vote
                      dbEngine.agent_votes.create({
                        debate_id: debate.id,
                        agent_id: 'marketing_agent',
                        vote: 'approve',
                        rationale: '增加用户购买频次与曝光面，消化库存是本季大胜仗的核心指标。',
                        voted_at: new Date().toISOString()
                      });

                      // Pricing vote
                      dbEngine.agent_votes.create({
                        debate_id: debate.id,
                        agent_id: 'pricing_agent',
                        vote: isPricingOppose ? 'oppose' : 'approve',
                        rationale: isPricingOppose ? '弹性测算表明打折力度过大会带来品牌偏离，不划算。' : '价格模型安全可预测。',
                        voted_at: new Date().toISOString()
                      });

                      // Inventory vote
                      dbEngine.agent_votes.create({
                        debate_id: debate.id,
                        agent_id: 'inventory_agent',
                        vote: 'approve',
                        rationale: '有效降低斯德哥尔摩前置仓的商品仓龄，释放出25%货位。',
                        voted_at: new Date().toISOString()
                      });

                      // Finance vote
                      dbEngine.agent_votes.create({
                        debate_id: debate.id,
                        agent_id: 'finance_agent',
                        vote: isFinanceVeto ? 'oppose' : 'approve',
                        rationale: isFinanceVeto ? '一票否决！利润跌穿45%企业安全底线，严重破坏本年利润池规划。' : '毛利润与回款模型在宏观安全边际之下。',
                        voted_at: new Date().toISOString()
                      });

                      // Resolve the outcome
                      if (isFinanceVeto) {
                        dbEngine.agent_debates.update(debate.id, { status: 'vetoed' });
                        dbEngine.agent_vetoes.create({
                          debate_id: debate.id,
                          vetoing_agent_id: 'finance_agent',
                          veto_reason: '初版降幅严重稀释EBITDA毛利率，根据企业宪法第4条一票否决。',
                          vetoed_at: new Date().toISOString()
                        });
                      } else {
                        dbEngine.agent_debates.update(debate.id, { status: 'resolved' });
                        dbEngine.agent_consensus.create({
                          debate_id: debate.id,
                          outcome_summary: '折中通过方案：斯德哥尔摩多渠道并推，保留首发标价，对VIP用户发放定向福利。',
                          agreement_rate: isPricingOppose ? 75 : 100,
                          is_implemented: true,
                          resolved_at: new Date().toISOString()
                        });
                      }

                      setNewDebateTopic('');
                      setTick(t => t + 1);
                      triggerSuccess('Consensus debate run complete. Multi-agent decisions written to DB.');
                      setSelectedDebId(debate.id);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-[#07C2E3] font-extrabold text-xs py-2.5 px-4 rounded border border-slate-800 transition"
                  >
                    Submit to Council
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Active votes details */}
        <div className="lg:col-span-6 space-y-4">
          {(() => {
            const activeDebate = agentDebates.find(d => d.id === selectedDebId) || agentDebates[0];
            if (!activeDebate) return <div className="text-xs text-slate-400">No debate chosen.</div>;

            const votes = agentVotes.filter(v => v.debate_id === activeDebate.id);
            const consensus = agentConsensus.find(c => c.debate_id === activeDebate.id);
            const veto = agentVetoes.find(v => v.debate_id === activeDebate.id);

            return (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase tracking-wider block">Auditing Council Debate Flow</span>
                  <h4 className="font-sans font-bold text-xs text-white leading-relaxed mt-1">Topic: {activeDebate.topic}</h4>
                </div>

                {/* Agent Consensus Votes & Rationales */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-400 font-sans">🗳️ Agent Consensus Votes & Rationales</h5>
                  <div className="space-y-3">
                    {votes.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No votes registered yet.</p>
                    ) : (
                      votes.map((v) => (
                        <div key={v.id} className="bg-slate-955 p-3 rounded-lg bg-slate-950 border border-slate-900 flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="font-bold text-white flex items-center gap-1.5 font-sans">
                              <span className="text-[#07C2E3]">🤖</span>
                              {v.agent_id === 'marketing_agent' ? 'Marketing Agent (营销助手)' :
                               v.agent_id === 'finance_agent' ? 'Finance Agent (财务精修)' :
                               v.agent_id === 'pricing_agent' ? 'Pricing Agent (敏感定价)' :
                               'Inventory Agent (跨境仓配管家)'}
                            </span>
                            <span className={`text-[9.5px] font-mono font-bold uppercase px-1.5 rounded ${
                              v.vote === 'approve' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-955 text-rose-450'
                            }`}>
                              {v.vote}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-350 leading-relaxed mt-1 font-sans">{v.rationale}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resolutions Summary */}
                {veto && (
                  <div className="bg-rose-950/40 border border-rose-900 p-3.5 rounded-lg text-rose-450 space-y-2">
                    <h5 className="text-xs font-bold flex items-center gap-2">
                      <span>⚠️</span> One-Key Veto Triggered (一票否决)
                    </h5>
                    <p className="text-xs leading-relaxed font-sans">
                      <strong>Vetoing Agent:</strong> {veto.vetoing_agent_id} <br />
                      <strong>Veto Reason:</strong> {veto.veto_reason}
                    </p>
                  </div>
                )}

                {consensus && (
                  <div className="bg-emerald-900/10 border border-emerald-900/30 p-3.5 rounded-lg text-emerald-440 space-y-2 text-emerald-400">
                    <h5 className="text-xs font-bold flex items-center gap-2 font-sans">
                      <span>🤝</span> Council Consensus Resolved (达成共识)
                    </h5>
                    <p className="text-xs leading-relaxed font-sans">
                      <strong>Outcome Summary:</strong> {consensus.outcome_summary} <br />
                      <strong>Consensus Rate:</strong> {consensus.agreement_rate}% agreement. <br />
                      <strong>Status:</strong> {consensus.is_implemented ? 'Automatically Implemented' : 'Pending Exec.'}
                    </p>
                  </div>
                )}

                {!veto && !consensus && (
                  <div className="bg-amber-900/15 border border-amber-905/20 p-3 rounded-lg text-amber-500 text-xs">
                    Debate is active and awaiting vote calculations. Waiting for external signals...
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 24: Macro Enterprise Simulation Panel
// -------------------------------------------------------------
export function MarketSimulationLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [selectedSimId, setSelectedSimId] = useState('sim_01');
  const [newSimName, setNewSimName] = useState('');
  const [newSimRegions, setNewSimRegions] = useState('Germany, France, Sweden');
  const [newSimStockParam, setNewSimStockParam] = useState('Safety Buffer 1.45x');
  const [newSimAdParam, setNewSimAdParam] = useState('SEO Multiplier 2.5x');
  const [newSimLogisticsParam, setNewSimLogisticsParam] = useState('Rotterdam-Trunk High Express');
  const [newSimCashParam, setNewSimCashParam] = useState('30-day payout deferral');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const marketSimulations = dbEngine.enterprise_simulations.getAll();

  return (
    <div className="space-y-6 animate-fadeIn" id="market_simulation_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L341-350</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Enterprise Macro Simulation Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            在欧洲多个重要市场进行业务并发推演，统筹库存损耗、广告流量、干线物流和回款流速，输出 90、180、360 天去库时序预测。
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">Simulations Logged: {marketSimulations.length}</span>
        </div>
      </div>

      {/* Grid 12 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Simulation list & Pressure Test launcher */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-205 p-5 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="font-sans font-bold text-sm text-slate-950 mb-4 flex items-center justify-between">
              <span>⏳ Registered Multi-Market Simulations</span>
              <span className="text-[10px] text-slate-400 font-mono">Parallel Sequences</span>
            </h4>

            <div className="space-y-3">
              {marketSimulations.map((sim) => {
                const isSelected = selectedSimId === sim.id;
                return (
                  <div
                    key={sim.id}
                    onClick={() => setSelectedSimId(sim.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-slate-950 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-205 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-xs truncate max-w-[70%] text-[#07C2E3]">{sim.simulation_name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {new Date(sim.simulated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sim.regions.map((reg, i) => (
                        <span key={i} className="text-[8.5px] px-1.5 bg-slate-800 text-slate-300 rounded font-mono">
                          {reg}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center border-t border-slate-800/10 pt-2 text-[10px] font-mono">
                      <div>
                        <span className="block text-[8px] text-slate-400 font-mono">90D GMV</span>
                        <span className="font-mono text-slate-500 font-bold">€{(sim.forecast_90_days.gmv_eur / 1000).toFixed(0)}K</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 font-mono">180D GMV</span>
                        <span className="font-mono text-slate-500 font-bold">€{(sim.forecast_180_days.gmv_eur / 1000).toFixed(0)}K</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 font-mono">360D GMV</span>
                        <span className="font-mono text-slate-500 font-bold">€{(sim.forecast_360_days.gmv_eur / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stress-Test Pressure Projector Form */}
          <div className="bg-white border border-slate-205 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-955 text-slate-900">
              ⚡ Launch Multi-Variable Pressure Test
            </h4>
            <p className="text-xs text-slate-500">
              通过设定各关键杠杆模型，高保真推演未来连续 360 天的现金流安全与大盘去库路径。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Scenario Title</label>
                <input
                  type="text"
                  value={newSimName}
                  onChange={(e) => setNewSimName(e.target.value)}
                  placeholder="e.g. 2026年全欧暖冬高频备货仿真"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded hover:border-slate-350 focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Simulated Regions (Separated by comma)</label>
                <input
                  type="text"
                  value={newSimRegions}
                  onChange={(e) => setNewSimRegions(e.target.value)}
                  placeholder="France, Germany, Italy, Spain"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded hover:border-slate-350 focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Stock Parameters</label>
                <input
                  type="text"
                  value={newSimStockParam}
                  onChange={(e) => setNewSimStockParam(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Ad Lever Modifier</label>
                <input
                  type="text"
                  value={newSimAdParam}
                  onChange={(e) => setNewSimAdParam(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Bulk Logistics Routes</label>
                <input
                  type="text"
                  value={newSimLogisticsParam}
                  onChange={(e) => setNewSimLogisticsParam(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Cash flow Buffer Mode</label>
                <input
                  type="text"
                  value={newSimCashParam}
                  onChange={(e) => setNewSimCashParam(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!newSimName.trim()) {
                  triggerSuccess('Error: Scenario title is required.');
                  return;
                }
                const created = dbEngine.enterprise_simulations.create({
                  simulation_name: newSimName,
                  simulated_at: new Date().toISOString(),
                  regions: newSimRegions.split(',').map(s => s.trim()).filter(Boolean),
                  stock_model_params: newSimStockParam,
                  ad_model_params: newSimAdParam,
                  logistic_model_params: newSimLogisticsParam,
                  cashflow_model_params: newSimCashParam,
                  forecast_90_days: { gmv_eur: 5300000, ebitda_eur: 1350000, stock_level_pct: 74, cash_flow_balance_eur: 3100000 },
                  forecast_180_days: { gmv_eur: 10400000, ebitda_eur: 2800000, stock_level_pct: 59, cash_flow_balance_eur: 4800000 },
                  forecast_360_days: { gmv_eur: 22600000, ebitda_eur: 6100000, stock_level_pct: 38, cash_flow_balance_eur: 7200000 }
                });
                
                setNewSimName('');
                setTick(t => t + 1);
                triggerSuccess('Macro multi-market stress simulation run saved & compiled.');
                setSelectedSimId(created.id);
              }}
              className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold text-xs py-2.5 rounded transition"
            >
              Run Simulation Sequence
            </button>
          </div>
        </div>

        {/* Right: Detailed Forecast Sheets for selected Simulation / Forecast Chart */}
        <div className="lg:col-span-6 space-y-4">
          {(() => {
            const activeSim = marketSimulations.find(s => s.id === selectedSimId) || marketSimulations[0];
            if (!activeSim) return <div className="text-xs text-slate-400">No simulation chosen.</div>;

            // Chart data preparation
            const chartData = [
              { name: '90D Forecast', GMV: activeSim.forecast_90_days.gmv_eur / 1000000, Cashflow: activeSim.forecast_90_days.cash_flow_balance_eur / 1000000, StockRate: activeSim.forecast_90_days.stock_level_pct },
              { name: '180D Forecast', GMV: activeSim.forecast_180_days.gmv_eur / 1000000, Cashflow: activeSim.forecast_180_days.cash_flow_balance_eur / 1000000, StockRate: activeSim.forecast_180_days.stock_level_pct },
              { name: '360D Forecast', GMV: activeSim.forecast_360_days.gmv_eur / 1000000, Cashflow: activeSim.forecast_360_days.cash_flow_balance_eur / 1000000, StockRate: activeSim.forecast_360_days.stock_level_pct }
            ];

            return (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] text-[#07C2E3] font-mono font-bold block uppercase tracking-wider">Active Projection Modeling</span>
                  <h4 className="font-sans font-bold text-xs text-white mt-1">{activeSim.simulation_name}</h4>
                </div>

                {/* Interactive Graph */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-slate-400 font-mono">📈 Simulated Curve (EUR Millions)</h5>
                  <div className="h-[210px] w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={9} />
                        <YAxis stroke="#64748B" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#FFF' }} />
                        <Legend wrapperStyle={{ fontSize: 9 }} />
                        <Line type="monotone" dataKey="GMV" stroke="#07C2E3" strokeWidth={2.5} name="GMV (Millions)" dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Cashflow" stroke="#A78BFA" strokeWidth={2.5} name="Cash flow (Millions)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Parameter details */}
                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/40">
                    <span className="block text-slate-500 text-[8px] uppercase font-bold">Stock Model</span>
                    <span className="text-white font-bold">{activeSim.stock_model_params}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/40">
                    <span className="block text-slate-500 text-[8px] uppercase font-bold">SEO/Ads Factor</span>
                    <span className="text-white font-bold">{activeSim.ad_model_params}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/40">
                    <span className="block text-slate-500 text-[8px] uppercase font-bold">Trunk Logistics Route</span>
                    <span className="text-white font-bold">{activeSim.logistic_model_params}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/40">
                    <span className="block text-slate-500 text-[8px] uppercase font-bold">Cash Reserves Mode</span>
                    <span className="text-white font-bold">{activeSim.cashflow_model_params}</span>
                  </div>
                </div>

                {/* 3 columns forecast values with details */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-slate-400">📊 Horizon Forecast Audit Log</h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-955 p-3 rounded border border-slate-800 bg-slate-950">
                      <span className="text-[#07C2E3] font-bold font-mono text-[10px] block">90 Days Limit</span>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-1">
                        <div>EBITDA: <span className="text-white font-bold">€{(activeSim.forecast_90_days.ebitda_eur/1000).toFixed(0)}K</span></div>
                        <div>Safety Stock: <span className="text-emerald-440 font-bold text-emerald-400">{activeSim.forecast_90_days.stock_level_pct}%</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-955 p-3 rounded border border-slate-800 bg-slate-950">
                      <span className="text-[#A78BFA] font-bold font-mono text-[10px] block font-semibold">180 Days Limit</span>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-1">
                        <div>EBITDA: <span className="text-white font-bold">€{(activeSim.forecast_180_days.ebitda_eur/1000).toFixed(0)}K</span></div>
                        <div>Safety Stock: <span className="text-emerald-440 font-bold text-emerald-400">{activeSim.forecast_180_days.stock_level_pct}%</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-955 p-3 rounded border border-slate-800 bg-slate-950">
                      <span className="text-pink-400 font-bold font-mono text-[10px] block font-semibold">360 Days Limit</span>
                      <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-1">
                        <div>EBITDA: <span className="text-white font-bold">€{(activeSim.forecast_360_days.ebitda_eur/1000000).toFixed(1)}M</span></div>
                        <div>Safety Stock: <span className="text-emerald-440 font-bold text-emerald-400">{activeSim.forecast_360_days.stock_level_pct}%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 25: Strategic Campaign & Operating Loop Panel
// -------------------------------------------------------------
export function StrategicCampaignsLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [selectedCmpId, setSelectedCmpId] = useState('cmp_01');
  const [newCampName, setNewCampName] = useState('');
  const [newCampType, setNewCampType] = useState<'Winter' | 'BlackFriday' | 'Summer' | 'MarketExpansion'>('Winter');
  const [newCampGoal, setNewCampGoal] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(150000);
  const [newCampTargetGmv, setNewCampTargetGmv] = useState(500000);
  const [newCampTargetRoi, setNewCampTargetRoi] = useState(6.5);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const strategicCampaigns = dbEngine.strategic_campaigns.getAll();

  return (
    <div className="space-y-6 animate-fadeIn" id="strategic_campaigns_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L351-370</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">全域战役决策大脑 (Strategic Campaign & Operating Loop)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            决策中心。一键组装发布跨商家、跨地区大区战役，系统自动切分预算、定制多智能体协同工作流（Workflow），自愈追踪 KPI 进展，配合大脑 OS 闭环。
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">Strategic Campaigns: {strategicCampaigns.length}</span>
        </div>
      </div>

      {/* SECTION: 8-Phase Core Loop Mapping (Observe-Understand-Reason-Decide-Execute-Audit-Learn-Evolve) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-[#07C2E3] flex items-center gap-2 font-sans">
            <span>🔁</span> Enterprise OS Core Loop (Observe-Understand-Reason-Decide-Execute-Audit-Learn-Evolve)
          </h4>
          <span className="text-[10px] font-mono text-emerald-440 bg-emerald-950/45 px-2 rounded text-emerald-400">State Cycle: ACTIVE</span>
        </div>
        
        {/* 8-Node Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 font-sans">
          {[
            { node: 'Observe', label: '1. 实时监测', detail: '流量物流干线测算', active: true, emoji: '👀' },
            { node: 'Understand', label: '2. 深度感知', detail: '时尚要素图谱匹配', active: true, emoji: '🧠' },
            { node: 'Reason', label: '3. 逻辑推演', detail: '国别价格敏感度预测', active: true, emoji: '🔮' },
            { node: 'Decide', label: '4. 科学决策', detail: '主理事智能联席表决', active: true, emoji: '⚖️' },
            { node: 'Execute', label: '5. 敏捷执行', detail: '库存调拨与特权折扣', active: true, emoji: '⚙️' },
            { node: 'Audit', label: '6. 合规审计', detail: '平台运营宪法保底', active: true, emoji: '🛡️' },
            { node: 'Learn', label: '7. 反思学习', detail: '提炼模式入经验库', active: true, emoji: '📜' },
            { node: 'Evolve', label: '8. 闭环进化', detail: '系统代码库演进跃迁', active: true, emoji: '🧬' }
          ].map((val, idx) => (
            <div key={idx} className="bg-slate-955 p-3 rounded-lg bg-slate-950 border border-slate-50 border-slate-900 flex flex-col items-center text-center gap-1.5 transition hover:scale-105">
              <span className="text-sm">{val.emoji}</span>
              <span className="text-[10px] text-white font-extrabold">{val.node}</span>
              <span className="text-[9px] text-[#07C2E3] font-sans">{val.label}</span>
              <p className="text-[8px] text-slate-500 leading-normal">{val.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Campaign Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Campaign list & Assembler form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-205 p-5 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="font-sans font-bold text-sm text-slate-955 mb-4 flex items-center justify-between text-slate-900">
              <span>🚀 Strategic High-Allocation Campaigns</span>
              <span className="bg-[#07C2E3]/20 text-[#06B2D0] font-mono text-[9px] px-1.5 rounded uppercase font-bold">Enterprise Main Level</span>
            </h4>

            <div className="space-y-3">
              {strategicCampaigns.map((cmp) => {
                const isSelected = selectedCmpId === cmp.id;
                return (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedCmpId(cmp.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-slate-950 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-205 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-xs truncate max-w-[70%]">{cmp.campaign_name}</h5>
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        cmp.status === 'active' ? 'bg-[#07C2E3] text-black font-extrabold' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {cmp.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic line-clamp-1">Goal: {cmp.goal}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/10">
                      <span>Budget: €{cmp.budget_allocated.toLocaleString()}</span>
                      <span>Ratio: {cmp.type} campaign</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inauguration Assembler Form */}
          <div className="bg-white border border-slate-205 p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-955 text-slate-900">
              🛠️ Setup & Inaugurate Strategic Campaign
            </h4>
            <p className="text-xs text-slate-500">
              组装新的大区战役级别控制系统，自动配置流程步骤、设定目标 ROI/GMV、分配平台算力并实时入库。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="e.g. 2026年南欧春日丝绸狂飙战役"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded hover:border-slate-350 focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Campaign Goal String</label>
                <input
                  type="text"
                  value={newCampGoal}
                  onChange={(e) => setNewCampGoal(e.target.value)}
                  placeholder="提升意大利针织快速去空周转率"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded hover:border-slate-350 focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Campaign Type</label>
                <select
                  value={newCampType}
                  onChange={(e) => setNewCampType(e.target.value as any)}
                  className="w-full text-xs p-2.2 bg-slate-50 border border-slate-205 rounded focus:outline-none"
                >
                  <option value="Winter">Winter (冬季温暖战役)</option>
                  <option value="BlackFriday">Black Friday (黑五走量防御)</option>
                  <option value="Summer">Summer (夏季清凉快销)</option>
                  <option value="MarketExpansion">Market Expansion (大区拓荒突破)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Earmarked Budget (EUR)</label>
                <input
                  type="number"
                  value={newCampBudget}
                  onChange={(e) => setNewCampBudget(parseInt(e.target.value) || 120000)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Target GMV (EUR)</label>
                <input
                  type="number"
                  value={newCampTargetGmv}
                  onChange={(e) => setNewCampTargetGmv(parseInt(e.target.value) || 600000)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold font-mono mb-1">Target ROI Factor</label>
                <input
                  type="number"
                  step="0.1"
                  value={newCampTargetRoi}
                  onChange={(e) => setNewCampTargetRoi(parseFloat(e.target.value) || 6.2)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!newCampName.trim()) {
                  triggerSuccess('Error: Campaign name is required.');
                  return;
                }
                const created = dbEngine.strategic_campaigns.create({
                  campaign_name: newCampName,
                  type: newCampType,
                  goal: newCampGoal || '提升大盘去库存周转',
                  status: 'active',
                  budget_allocated: newCampBudget,
                  kpis: { target_gmv: newCampTargetGmv, target_roi: newCampTargetRoi, current_gmv: 0, current_roi: 0 },
                  workflow_steps: [
                    '1. 初始化全区干线高速跨海货轮渠道调度',
                    '2. 多智能体基于天气温差变化调拨前置备件及救急物资',
                    '3. 圈选预测购物理想模型人群，定制 VIP 特惠积分福利'
                  ],
                  learnings: [
                    '战役初运行成功，大区多节点协作仓储效率平均提升 11.2%'
                  ],
                  created_at: new Date().toISOString()
                });

                setNewCampName('');
                setNewCampGoal('');
                setTick(t => t + 1);
                triggerSuccess('Strategic active campaign launched & persisted in databases.');
                setSelectedCmpId(created.id);
              }}
              className="w-full bg-slate-900 hover:bg-slate-950 text-[#07C2E3] font-sans font-bold text-xs py-2.5 rounded border border-slate-800 transition"
            >
              Inaugurate Campaign System
            </button>
          </div>
        </div>

        {/* Right Side: Detailed Workflow Checklists, Target KPI Gauges & Lessons learned */}
        <div className="lg:col-span-6 space-y-4">
          {(() => {
            const activeCamp = strategicCampaigns.find(c => c.id === selectedCmpId) || strategicCampaigns[0];
            if (!activeCamp) return <div className="text-xs text-slate-400">No active campaign selected.</div>;

            // Compute fraction progress bars
            const gmvPct = activeCamp.kpis.target_gmv > 0 ? (activeCamp.kpis.current_gmv / activeCamp.kpis.target_gmv) * 100 : 0;
            const roiPct = activeCamp.kpis.target_roi > 0 ? (activeCamp.kpis.current_roi / activeCamp.kpis.target_roi) * 100 : 0;

            return (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 space-y-5">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center font-sans">
                  <div>
                    <span className="text-[10px] text-[#07C2E3] font-mono font-bold block uppercase tracking-wider">Active Campaign Orchestration</span>
                    <h4 className="font-sans font-bold text-xs text-white mt-1">{activeCamp.campaign_name}</h4>
                  </div>
                  <span className="text-[9.5px] bg-[#07C2E3]/10 font-mono text-[#07C2E3] px-2 py-0.5 rounded border border-[#07C2E3]/20 font-bold">
                    €{activeCamp.budget_allocated.toLocaleString()} Allocated
                  </span>
                </div>

                {/* KPI target gauges */}
                <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <h5 className="text-[11px] font-bold text-slate-400 font-sans">📈 Campaign KPI Real-Time Tracking Meter</h5>
                  
                  {/* GMV Bar */}
                  <div className="space-y-1.5 font-sans">
                    <div className="flex justify-between text-[10.5px] text-slate-350">
                      <span>GMV Cumulative Gross Metric: €{activeCamp.kpis.current_gmv.toLocaleString()}</span>
                      <span className="font-mono text-white font-bold">Target: €{activeCamp.kpis.target_gmv.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                      <div className="bg-[#07C2E3] h-full transition-all" style={{ width: `${Math.min(gmvPct, 100)}%` }} />
                    </div>
                    <div className="text-[9px] text-[#07C2E3] font-mono text-right font-extrabold">{gmvPct.toFixed(1)}% Realized</div>
                  </div>

                  {/* ROI Bar */}
                  <div className="space-y-1.5 mt-3 font-sans">
                    <div className="flex justify-between text-[10.5px] text-slate-350">
                      <span>ROI Return Factor: {activeCamp.kpis.current_roi}x</span>
                      <span className="font-mono text-white font-bold">Target: {activeCamp.kpis.target_roi}x</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                      <div className="bg-[#A78BFA] h-full transition-all" style={{ width: `${Math.min(roiPct, 100)}%` }} />
                    </div>
                    <div className="text-[9px] text-[#A78BFA] font-mono text-right font-extrabold">{roiPct.toFixed(1)}% Realized</div>
                  </div>
                </div>

                {/* Distributed Agent Multi-step Workflows */}
                <div className="space-y-2.5">
                  <h5 className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 font-sans">
                    <span>⚙️</span> Distributed Agent Multi-step Workflows
                  </h5>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto font-sans">
                    {activeCamp.workflow_steps.map((step, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-905 flex items-start gap-2.5 text-[11px] text-slate-300 border-slate-900">
                        <span className="bg-[#07C2E3] text-black text-[9px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                          {idx+1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Learnings Footprint */}
                <div className="space-y-2.5 font-sans">
                  <h5 className="text-[11px] font-bold text-slate-400 flex justify-between items-center">
                    <span>📜 Post-Campaign Retrospectives & Learnings</span>
                    <span className="text-[9px] font-mono text-emerald-440 bg-emerald-950/40 border border-emerald-900 px-1 font-bold rounded text-emerald-400">AUTONOMOUS RECORD</span>
                  </h5>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto font-sans text-[10.5px]">
                    {activeCamp.learnings.length === 0 ? (
                      <p className="text-slate-500 italic text-[10px]">No learning notes created yet. Auto-generating when campaigns are archived...</p>
                    ) : (
                      activeCamp.learnings.map((note, idx) => (
                        <div key={idx} className="bg-slate-955 p-3 rounded-lg border border-slate-800/60 text-slate-300 flex flex-col gap-1.5 bg-slate-950/20">
                          <div className="text-[#07C2E3] font-bold">Consolidated Log #{idx+1}</div>
                          <p className="leading-relaxed">{note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Force campaign simulated update button to change the database values */}
                <button
                  onClick={() => {
                    if (activeCamp.status === 'completed') {
                      triggerSuccess('Campaign already successfully accomplished.');
                      return;
                    }
                    dbEngine.strategic_campaigns.update(activeCamp.id, {
                      status: 'completed',
                      kpis: {
                        ...activeCamp.kpis,
                        current_gmv: activeCamp.kpis.target_gmv,
                        current_roi: activeCamp.kpis.target_roi
                      },
                      learnings: [
                        ...activeCamp.learnings,
                        `Automatic Evaluation System Run: ROI exactly reached ${activeCamp.kpis.target_roi}x. Stock level optimized across segments.`
                      ]
                    });
                    triggerSuccess('Executed automatic operational loop! Simulated revenue metrics and saved learnings to DB.');
                    setTick(t => t + 1);
                  }}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-black font-extrabold text-xs py-2.5 rounded transition"
                >
                  Execute Loop Check & Close Campaign (Simulate Finish)
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 26: L371-380 Enterprise Risk Intelligence Panel
// -------------------------------------------------------------
export function RiskIntelligenceLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [selectedRiskId, setSelectedRiskId] = useState('risk_01');
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskCategory, setNewRiskCategory] = useState<'Logistics' | 'Financial' | 'Inventory' | 'ExchangeRate' | 'Compliance'>('Logistics');
  const [newRiskSeverity, setNewRiskSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newRiskTrigger, setNewRiskTrigger] = useState('');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const riskIncidents = dbEngine.risk_incidents.getAll();
  const rawRules = dbEngine.risk_mitigation_rules.getAll();

  const handleCreateRisk = () => {
    if (!newRiskName.trim()) {
      triggerSuccess('Error: Risk name is required.');
      return;
    }
    const created = dbEngine.risk_incidents.create({
      incident_name: newRiskName,
      category: newRiskCategory,
      severity: newRiskSeverity,
      status: 'detected',
      trigger_details: newRiskTrigger || 'Simulated world event drift trigger.',
      detected_at: new Date().toISOString()
    });
    setSelectedRiskId(created.id);
    setNewRiskName('');
    setNewRiskTrigger('');
    triggerSuccess(`Successfully dispatched risk incident thread: ${created.incident_name}`);
  };

  const handleMitigateRisk = (riskId: string) => {
    dbEngine.risk_incidents.update(riskId, { status: 'mitigating' });
    
    // Auto insert an interactive mitigation rule
    dbEngine.risk_mitigation_rules.create({
      incident_id: riskId,
      rule_name: '宪法保底分仓保障机制指令',
      action_dispatched: '已激活对应财务算力截流，阻断资金回款延迟风险；同步修改库存缓冲系数至1.35x',
      mitigation_effectiveness_pct: Math.floor(Math.random() * 20) + 75,
      executed_at: new Date().toISOString()
    });
    triggerSuccess('Mitigation playbook successfully mobilized!');
    setTick(t => t + 1);
  };

  const handleResolveRisk = (riskId: string) => {
    dbEngine.risk_incidents.update(riskId, { status: 'resolved' });
    triggerSuccess('Risk incident marked as resolved. Normal operational boundaries resumed.');
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="risk_intelligence_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L371-380</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Enterprise Risk Intelligence Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            企业级风险大盘监测自愈。持续监测跨国物流梗阻、汇率突跳、资金链冗抗摩擦与法务合规，自动匹配下达对冲决策。
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">Active Risks: {riskIncidents.filter(r => r.status !== 'resolved').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Risk List & Trigger Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-sm text-slate-950 flex items-center gap-2">
                <span>🚨</span> Real-Time Risk Incident Feed
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Durable Hard-disk Audit</span>
            </div>

            <div className="space-y-3">
              {riskIncidents.map((incident) => {
                const isSelected = selectedRiskId === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedRiskId(incident.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-950 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold shrink-0 px-1.5 py-0.5 rounded ${
                          incident.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-900 animate-pulse' :
                          incident.severity === 'high' ? 'bg-orange-950/40 text-orange-400' :
                          incident.severity === 'medium' ? 'bg-amber-950/40 text-amber-500' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {incident.severity}
                        </span>
                        <h5 className="font-bold text-xs truncate max-w-[180px]">{incident.incident_name}</h5>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        incident.status === 'resolved' ? 'bg-emerald-950 text-emerald-405 text-emerald-405 font-bold text-emerald-450 border border-emerald-900' :
                        incident.status === 'mitigating' ? 'bg-cyan-950 text-cyan-405 text-cyan-400 font-bold border border-cyan-900' : 'bg-slate-800 text-slate-450 text-slate-400'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-405 text-slate-400 leading-relaxed mt-1">
                      Trigger: {incident.trigger_details}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-slate-405 text-slate-400 font-mono mt-1">
                      <span>Category: {incident.category}</span>
                      <span>Detected: {new Date(incident.detected_at).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trigger New Simulated Risk */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-900">
              🛠️ Dispatch New Risk Vector (Simulate World Shocks)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Risk Incident Name</label>
                <input
                  type="text"
                  value={newRiskName}
                  onChange={(e) => setNewRiskName(e.target.value)}
                  placeholder="e.g. 巴黎至鹿特丹陆运突发大雾封路"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Category</label>
                <select
                  value={newRiskCategory}
                  onChange={(e) => setNewRiskCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                >
                  <option value="Logistics">Logistics (跨境干线干道阻滞)</option>
                  <option value="Financial">Financial (汇率/支付红线风险)</option>
                  <option value="Inventory">Inventory (前置仓货物短板断货)</option>
                  <option value="ExchangeRate">ExchangeRate (大洲汇率剪刀差阻值)</option>
                  <option value="Compliance">Compliance (法务海关税务突审)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Severity</label>
                <select
                  value={newRiskSeverity}
                  onChange={(e) => setNewRiskSeverity(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                >
                  <option value="low">Low (可自动修复)</option>
                  <option value="medium">Medium (黄标智能预警)</option>
                  <option value="high">High (决策委员会介入)</option>
                  <option value="critical">Critical (一票否决/强制自愈)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Risk Boundary Event Triggers</label>
              <textarea
                value={newRiskTrigger}
                onChange={(e) => setNewRiskTrigger(e.target.value)}
                placeholder="汇入的异常气压、海运卡班、或供应商延迟等具体事件指标..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3] h-16 resize-none"
              />
            </div>

            <button
              onClick={handleCreateRisk}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 rounded transition"
            >
              Simulate Risk Sensor Detect (Dispatched onto State)
            </button>
          </div>
        </div>

        {/* Right Side: Mitigation Center */}
        <div className="lg:col-span-5 space-y-6">
          {(() => {
            const activeRisk = riskIncidents.find(r => r.id === selectedRiskId) || riskIncidents[0];
            if (!activeRisk) {
              return (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center text-slate-500 text-xs">
                  Awaiting risk injection to display mitigation panel.
                </div>
              );
            }

            const activeRules = rawRules.filter(rule => rule.incident_id === activeRisk.id);

            return (
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4 font-sans">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    Mitigation Playbook Console
                  </span>
                  <h4 className="font-sans font-extrabold text-sm text-slate-900 mt-2 truncate max-w-[280px]">
                    {activeRisk.incident_name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-slate-500">Current Status:</span>
                    <span className="text-xs text-slate-900 font-bold capitalize">{activeRisk.status}</span>
                  </div>
                </div>

                {/* Rules List */}
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase font-mono font-bold text-slate-400">Deployed Mitigation Playbooks</h5>
                  {activeRules.length === 0 ? (
                    <div className="bg-slate-50 p-4 border border-dashed border-slate-200 text-center text-slate-500 text-[11px] rounded-lg">
                      暂无已启动的对冲预案。点击下方“智能对冲”可立即匹配分流。
                    </div>
                  ) : (
                    activeRules.map((val) => (
                      <div key={val.id} className="p-3 bg-slate-55 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-slate-800">{val.rule_name}</span>
                          <span className="text-[10px] font-mono text-cyan-600 font-bold">
                            Efficacy: {val.mitigation_effectiveness_pct}%
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-650 text-slate-605 text-slate-500 leading-relaxed">
                          {val.action_dispatched}
                        </p>
                        <div className="text-[9px] text-right font-mono text-slate-400">
                          Executed at {new Date(val.executed_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-2 space-y-2">
                  {activeRisk.status !== 'resolved' && (
                    <button
                      onClick={() => handleMitigateRisk(activeRisk.id)}
                      className="w-full bg-cyan-600 hover:bg-cyan-705 active:bg-cyan-700 hover:bg-cyan-700 text-white font-extrabold text-xs py-2.5 rounded transition"
                    >
                      ⚡ Mobilize Autonomous Mitigation Playbook (对冲)
                    </button>
                  )}

                  {activeRisk.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveRisk(activeRisk.id)}
                      className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold text-xs py-2.5 rounded transition"
                    >
                      ✅ Reset Safety Levels & Resolve Risk (标记自愈已解决)
                    </button>
                  )}

                  {activeRisk.status === 'resolved' && (
                    <div className="text-center text-xs p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-bold">
                      🎉 Risk incident already successfully resolved and normal state margins are restored.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 27: L381-390 Autonomous Opportunity Discovery Engine
// -------------------------------------------------------------
export function OpportunityDiscoveryLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppCategory, setNewOppCategory] = useState<'MarketDemand' | 'Arbitrage' | 'AdChannel' | 'PriceOptimization'>('MarketDemand');
  const [newOppImpact, setNewOppImpact] = useState(50000);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const opportunities = dbEngine.spot_opportunities.getAll();
  const catalysts = dbEngine.growth_catalysts.getAll();

  const handleCreateOpp = () => {
    if (!newOppTitle.trim()) {
      triggerSuccess('Error: Opportunity title is required.');
      return;
    }
    dbEngine.spot_opportunities.create({
      opportunity_title: newOppTitle,
      category: newOppCategory,
      confidence_score: Math.floor(Math.random() * 20) + 75,
      projected_gmv_impact: newOppImpact,
      status: 'discovered',
      discovered_at: new Date().toISOString()
    });
    setNewOppTitle('');
    triggerSuccess('Self-Discovered opportunity pre-seeded successfully.');
  };

  const handleActivateOpp = (oppId: string, title: string) => {
    dbEngine.spot_opportunities.update(oppId, { status: 'activated' });
    
    // Create actualized growth catalyst
    dbEngine.growth_catalysts.create({
      opportunity_id: oppId,
      action_taken: '自动加注瑞典与法国核心干道广告流量推送，高并发部署冷冬折扣券，匹配爆款货源',
      actual_gmv_lift_eur: Math.floor(Math.random() * 20000) + 30000,
      roi_achieved: parseFloat((Math.random() * 3 + 4).toFixed(1)),
      logged_at: new Date().toISOString()
    });
    triggerSuccess(`Successfully activated: "${title}". Campaign auto-dispatched.`);
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="opportunity_discovery_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L381-390</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Autonomous Opportunity Discovery Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            探索全球时尚套利阻抗与流量异动。自动嗅探特定大洲温差突升带来的毛利反弹极值，将市场超额红利转化为商业催化。
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">Discovered: {opportunities.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Opportunities Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                🎯 Market Opportunity Anomalies Spotted
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Cognitive Audit Live Stream</span>
            </div>

            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⚡</span>
                      <h5 className="font-extrabold text-xs text-slate-900 leading-tight">{opp.opportunity_title}</h5>
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      opp.status === 'activated' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-950' :
                      opp.status === 'discovered' ? 'bg-amber-900/30 text-amber-500 border border-amber-950 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {opp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono border-t border-slate-200/60 pt-2 text-slate-600">
                    <div>
                      <span className="text-[10px] block text-slate-400">Projected GMV Lift</span>
                      <span className="font-extrabold text-slate-900">€{opp.projected_gmv_impact.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-400">Confidence Score</span>
                      <span className="font-extrabold text-slate-900">{opp.confidence_score}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-400">Category Tag</span>
                      <span className="font-extrabold text-slate-900">{opp.category}</span>
                    </div>
                  </div>

                  {opp.status === 'discovered' && (
                    <button
                      onClick={() => handleActivateOpp(opp.id, opp.opportunity_title)}
                      className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold text-xs py-2 rounded transition"
                    >
                      🚀 De-risk & Deploy Smart Campaign overrides
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Create custom spot opportunity manually */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-900">
              💡 Feed Spot Opportunity to Enterprise Brain
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Opportunity Description Name</label>
                <input
                  type="text"
                  value={newOppTitle}
                  onChange={(e) => setNewOppTitle(e.target.value)}
                  placeholder="e.g. 比利时站秋冬大衣竞品普遍在法兰克福仓积压，面临断档套利极高概率"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Category type</label>
                  <select
                    value={newOppCategory}
                    onChange={(e) => setNewOppCategory(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="MarketDemand">MarketDemand (需求波峰异动)</option>
                    <option value="Arbitrage">Arbitrage (大区及前置仓无摩擦套利)</option>
                    <option value="AdChannel">AdChannel (社媒流量骤热/低阻加注)</option>
                    <option value="PriceOptimization">PriceOptimization (高溢价区间推荐)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Projected GMV (EUR)</label>
                  <input
                    type="number"
                    value={newOppImpact}
                    onChange={(e) => setNewOppImpact(parseInt(e.target.value) || 50000)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateOpp}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2 rounded transition"
              >
                Insert Opportunity into Discovery Engine State
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Growth Catalyst Outcomes Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-900">
                  📈 Growth Catalyst Operations Log
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  每一次启动机会后，自主智能体自动实施的套利和干线加注流水。
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {catalysts.length === 0 ? (
                <div className="bg-slate-50 p-6 border border-dashed border-slate-200 text-center text-slate-400 text-xs rounded-lg">
                  暂未激活超额销售催化。请点击左侧大卡片中的“启动部署计划”来获取自主红利。
                </div>
              ) : (
                catalysts.map((cat) => (
                  <div key={cat.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-emerald-700">Action Lift: +€{cat.actual_gmv_lift_eur.toLocaleString()}</span>
                      <span className="text-[#07C2E3] font-mono">ROI: {cat.roi_achieved}x</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {cat.action_taken}
                    </p>
                    <div className="text-[9px] text-right text-slate-400 font-mono">
                      Logged at {new Date(cat.logged_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 28: L391-400 Executive Operating System (企业执行操作系统)
// -------------------------------------------------------------
export function ExecutiveOsLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Kernel pre-boot checked successfully.',
    'Agent coordination threads initiated.',
    'Awaiting direct-dispatch command payloads.'
  ]);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const heartbeats = dbEngine.system_health_heartbeats.getAll();
  const tasks = dbEngine.exec_tasks.getAll();

  const handleForceGC = () => {
    const newHb = dbEngine.system_health_heartbeats.create({
      timestamp: new Date().toISOString(),
      cpu_usage_pct: Math.floor(Math.random() * 5) + 5,
      memory_usage_pct: Math.floor(Math.random() * 5) + 35,
      db_queue_backlog: 0,
      agent_active_threads_count: 3,
      os_status: 'healthy'
    });
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] COMMAND DISPATCHED: Force thread GC & queue flush.`,
      `[${new Date().toLocaleTimeString()}] OK: Released cached segments. Active threads: ${newHb.agent_active_threads_count}.`
    ]);
    triggerSuccess('System memory GC cache forcefully flushed.');
    setTick(t => t + 1);
  };

  const handleDispatchTask = () => {
    const task = dbEngine.exec_tasks.create({
      task_name: '智能高频算力截收与热修复自愈指令',
      executor_agent_id: 'governance_agent',
      priority: 'high',
      status: 'completed',
      system_health_index: 100,
      execution_log: [
        'Secure API route handshaking initialized.',
        'Target Node state verified stable.',
        'Completed persistent DB synchronization.',
        'Success'
      ],
      completed_at: new Date().toISOString()
    });
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] COMMAND DISPATCHED: Create task ID ${task.id}.`,
      `[${new Date().toLocaleTimeString()}] WORKER STATE [COMPLETED]: ${task.task_name}.`
    ]);
    triggerSuccess('Dispatched automated micro-worker task successfully.');
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="executive_os_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L391-400</span>
            <h3 className="font-sans font-bold text-base text-[#07C2E3]">Executive Operating System (Kernel OS)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            企业系统微内核。高并发微服务调用、算力分配、多智能体协同线程审计与数据库队栈阻塞监控。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleForceGC}
            className="bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-[10px] font-mono px-3 py-1.5 rounded transition"
          >
            🧹 Force Garbage Collection (内存自愈)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: System Health Recharts Line Chart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                ⚙️ Kernel Resource Pulse Monitoring
              </h4>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded font-bold">
                SYSTEM ONLINE
              </span>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartbeats.map(h => ({
                  time: h.timestamp ? new Date(h.timestamp).toLocaleTimeString() : '',
                  cpu: h.cpu_usage_pct,
                  mem: h.memory_usage_pct
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" unit="%" />
                  <Tooltip wrapperStyle={{ fontSize: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="cpu" stroke="#07C2E3" name="CPU Usage %" strokeWidth={2} />
                  <Line type="monotone" dataKey="mem" stroke="#10b981" name="Memory Usage %" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="p-2 border border-slate-100 rounded bg-slate-50/50">
                <span className="text-[9px] text-slate-400 uppercase font-black font-mono">CPU Core Throttle</span>
                <span className="block font-sans font-extrabold text-sm mt-1 text-slate-950">
                  {heartbeats[heartbeats.length - 1]?.cpu_usage_pct ?? 14}%
                </span>
              </div>
              <div className="p-2 border border-slate-100 rounded bg-slate-50/50">
                <span className="text-[9px] text-slate-400 uppercase font-black font-mono">Database Backlog</span>
                <span className="block font-sans font-extrabold text-sm mt-1 text-slate-950">
                  {heartbeats[heartbeats.length - 1]?.db_queue_backlog ?? 0} queue
                </span>
              </div>
              <div className="p-2 border border-slate-100 rounded bg-slate-50/50">
                <span className="text-[9px] text-slate-400 uppercase font-black font-mono">Active Worker Threads</span>
                <span className="block font-sans font-extrabold text-sm mt-1 text-slate-950">
                  {heartbeats[heartbeats.length - 1]?.agent_active_threads_count ?? 4}
                </span>
              </div>
            </div>
          </div>

          {/* Micro dispatch terminal log visualizer */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 text-slate-300 font-mono space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-900 pb-2">
              <span>SYSTEM KERNEL CONSOLE WORKER LOGS</span>
              <span className="text-emerald-500 animate-pulse">● CONNECTED</span>
            </div>
            <div className="space-y-1 max-h-[140px] overflow-y-auto text-[10.5px] leading-relaxed">
              {terminalLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-slate-600">[{index + 1}]</span>
                  <span className="text-slate-400">&gt;&gt;</span>
                  <p>{log}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleDispatchTask}
              className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-extrabold text-xs py-2 rounded font-sans transition mt-2"
            >
              🛠️ Dispatch Automated Micro-Worker Task (微操作线程)
            </button>
          </div>
        </div>

        {/* Right Side: Active tasks list */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                📜 Executive Os Tasks Queue
              </h4>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                Active Operational Loop Checked
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="bg-slate-50 p-6 text-center text-slate-500 text-xs rounded-xl">
                  Awaiting operational tasks queue deployment.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="p-4 border border-slate-100 rounded-lg bg-slate-5/50 bg-slate-50 space-y-3 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <h5 className="font-bold text-[#07C2E3] text-[12px] leading-tight">{task.task_name}</h5>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                          <span>Executor: <b>{task.executor_agent_id}</b></span>
                          <span>•</span>
                          <span>Priority: <span className="font-bold text-slate-700 capitalize">{task.priority}</span></span>
                        </div>
                      </div>
                      <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                        task.status === 'running' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900 animate-pulse' :
                        'bg-slate-800 text-slate-450'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded text-slate-300 font-mono text-[10px] space-y-1">
                      <div className="text-slate-500">Execution Thread Log:</div>
                      {task.execution_log.map((line, lIdx) => (
                        <div key={lIdx} className="leading-normal flex gap-1.5">
                          <span className="text-[#07C2E3]">&bull;</span>
                          <p>{line}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-mono">
                      <span>Integrity Index: {task.system_health_index}%</span>
                      {task.completed_at && (
                        <span>Completed: {new Date(task.completed_at).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 29: L401-410 Business Context Perception Panel
// -------------------------------------------------------------
export function BusinessContextLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [newEventText, setNewEventText] = useState('');
  const [newEventType, setNewEventType] = useState<'NAV_PAGE' | 'TASK_ENGAGE' | 'BACKGROUND_CRON' | 'COGNITIVE_DRIFT'>('NAV_PAGE');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const contextEngine = BusinessContextEngine.getInstance();
  const activeContext = contextEngine.getContext('tenant_01', 'store_01');
  const events = dbEngine.context_events.getAll().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText.trim()) return;

    dbEngine.context_events.create({
      tenant_id: 'tenant_01',
      store_id: 'store_01',
      event_type: newEventType,
      description: newEventText,
      timestamp: new Date().toISOString()
    });

    triggerSuccess(`Logged context event: [${newEventType}] ${newEventText.substring(0, 30)}...`);
    setNewEventText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="business_context_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white font-sans">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L401-410</span>
            <h3 className="font-bold text-base text-[#07C2E3]">Business Context Perception Engine (商业上下文感知脑)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            动态感知多租户 SaaS 环境中的商家微观行为与脑内核。精确采集及对齐系统谁在干什么（Who Am I, Where Am I, What Am I Doing），构建认知感知统一底图。
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded">Active Audit Trails: {events.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Context Definition Board */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                🧬 Active 3-Dimensional Context Parameters
              </h4>
              <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded font-bold">● LAL_SYNC</span>
            </div>

            <div className="space-y-4">
              {/* Box 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-black font-mono">1. Who Am I (经营主体身份)</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-mono">
                  <div>Tenant ID: <span className="font-bold text-slate-900">{activeContext.whoAmI.tenantId}</span></div>
                  <div>Store ID: <span className="font-bold text-slate-900">{activeContext.whoAmI.storeId}</span></div>
                  <div>Tenant: <span className="font-bold text-slate-900">{activeContext.whoAmI.tenantName}</span></div>
                  <div>Store: <span className="font-bold text-slate-900">{activeContext.whoAmI.storeName}</span></div>
                  <div>Country: <span className="font-bold text-[#07C2E3] font-sans">{activeContext.whoAmI.currentCountry}</span></div>
                  <div>Language: <span className="font-bold text-slate-900">{activeContext.whoAmI.currentLanguage}</span></div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-black font-mono">2. Where Am I (所处页面及模块坐标)</span>
                <div className="text-xs text-slate-700 space-y-1">
                  <div>Page Location: <span className="font-bold text-slate-900 font-mono">{activeContext.whereAmI.currentPage}</span></div>
                  <div>Active Module: <span className="font-bold text-[#07C2E3] font-mono">{activeContext.whereAmI.currentModule}</span></div>
                  <div>Active Core Process: <span className="font-bold text-slate-800">{activeContext.whereAmI.currentBusinessProcess}</span></div>
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-black font-mono">3. What Am I Doing (具体意图任务流)</span>
                <div className="text-xs text-slate-700 space-y-1">
                  <div>Intent Target: <span className="font-bold text-slate-900">{activeContext.whatAmIDoing.currentTarget}</span></div>
                  <div>Active Task: <span className="font-bold text-slate-900 font-mono text-[#07C2E3]">{activeContext.whatAmIDoing.currentTask}</span></div>
                  <div>Context Workflow Wave: <span className="font-bold text-slate-800">{activeContext.whatAmIDoing.currentWorkflow}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form to insert custom log shock */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h4 className="font-sans font-bold text-sm text-slate-900 mb-3">
              📝 Inject Simulated Real-Time Action Event Input
            </h4>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Event Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="NAV_PAGE">NAV_PAGE (页面切换导航)</option>
                    <option value="TASK_ENGAGE">TASK_ENGAGE (商家启动执行任务)</option>
                    <option value="BACKGROUND_CRON">BACKGROUND_CRON (后台调度轮询事件)</option>
                    <option value="COGNITIVE_DRIFT">COGNITIVE_DRIFT (认知漂移/怀疑警报)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Event Description</label>
                  <input
                    type="text"
                    value={newEventText}
                    onChange={(e) => setNewEventText(e.target.value)}
                    placeholder="e.g. User activated Carte Bancaire payment gate."
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-xs bg-slate-950 text-white font-bold py-2 px-4 rounded hover:bg-slate-900 transition"
              >
                Dispatch Context Event Log
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Log Events Stream */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm h-[482px] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4 shrink-0">
              <h4 className="font-sans font-bold text-sm text-slate-950 flex items-center gap-1.5">
                <span>👁️</span> Real-time Perception Logs
              </h4>
              <span className="text-[9px] text-[#07C2E3] font-mono font-bold tracking-widest uppercase">CON_EVENTS_T</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {events.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">No telemetry logs available.</div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        ev.event_type === 'COGNITIVE_DRIFT' ? 'bg-red-50 text-red-600 border border-red-200' :
                        ev.event_type === 'TASK_ENGAGE' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' :
                        ev.event_type === 'NAV_PAGE' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ev.event_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-sans">{ev.description}</p>
                    <div className="text-[9.5px] text-slate-400 font-mono">
                      Target Store: {ev.store_id} | Client Context ID: {ev.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 30: L411-420 Store Readiness Diagnostic Panel
// -------------------------------------------------------------
export function StoreReadinessLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const readinessEngine = BusinessContextEngine.getInstance();
  const report = readinessEngine.getLaunchReadiness('tenant_01', 'store_01');
  const storeGaps = dbEngine.store_gaps.getAll().filter(g => g.store_id === 'store_01');

  const handleSolveTask = (taskId: string, name: string) => {
    const success = readinessEngine.solveReadinessTask('tenant_01', 'store_01', taskId);
    if (success) {
      // Find corresponding gap if any, and close it
      if (taskId === 't_lng_01' || taskId === 't_mkt_01') {
        const found = storeGaps.find(g => g.id === 'sg_01');
        if (found) dbEngine.store_gaps.update('sg_01', { status: 'resolved' });
      }
      if (taskId === 't_pay_01') {
        const found = storeGaps.find(g => g.id === 'sg_02');
        if (found) dbEngine.store_gaps.update('sg_02', { status: 'resolved' });
      }

      // Update the readiness report index
      const existingReport = dbEngine.store_readiness.getAll().find(r => r.store_id === 'store_01');
      if (existingReport) {
        // compute new overall score
        const totalTasks = report.tasks.length;
        const completeTasks = report.tasks.filter(t => t.id === taskId ? true : t.status === 'Completed').length;
        const newScore = Math.round((completeTasks / totalTasks) * 100);
        dbEngine.store_readiness.update(existingReport.id, { overall_score: newScore });
      }

      triggerSuccess(`Autonomously mobilized micro-agents. Resolved: "${name}"`);
      setTick(t => t + 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="store_readiness_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white font-sans">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L411-420</span>
            <h3 className="font-bold text-base text-[#07C2E3]">Store Readiness & European Expansion Diagnoser (店铺上线扩展诊断)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            自动评估商家向德国、法国等欧盟市场开通所需的合规及翻译断点。一击即连（Solve Tasks），自动驱动子智能体编排，消除货源物流和税制法律鸿沟。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono">ESTIMATED EFFORT</div>
            <div className="text-sm font-bold text-red-400 font-mono">{report.estimatedCompletionMinutes} Mins Left</div>
          </div>
          <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
            <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">Ready Score</div>
            <div className="text-xl font-extrabold text-[#07C2E3] font-mono">{report.overallScore}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Verification Checklist */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📋</span> Required European Localization Checklist
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Autonomous Resolution Matrix</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-mono uppercase bg-slate-50">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Checkmark Item Required</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          task.category === 'Tax' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                          task.category === 'Language' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' :
                          task.category === 'Payment' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-xs">{task.name}</div>
                        <div className="text-[10px] text-slate-400 italic">Playbook Action: {task.remedyActionName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">{task.impactScore}pts</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {task.status !== 'Completed' ? (
                          <button
                            onClick={() => handleSolveTask(task.id, task.name)}
                            className="bg-slate-950 text-white hover:bg-[#07C2E3] hover:text-black font-extrabold text-[10px] px-2.5 py-1 rounded shadow-sm transition uppercase tracking-wide font-mono"
                          >
                            Solve Task
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold font-mono">✔️ RESOLVED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Detected Gap Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-sans font-bold text-sm text-slate-900">
                🚨 Platform-level Expansion Gaps
              </h4>
              <span className="text-[9px] text-red-600 bg-red-50 px-2 py-0.5 rounded font-mono font-bold">CRITICAL GAPS</span>
            </div>

            <div className="space-y-3">
              {storeGaps.map((gap) => (
                <div key={gap.id} className="p-3 bg-red-50/50 border border-red-150 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] py-0.5 px-1.5 rounded font-mono font-bold ${
                      gap.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {gap.severity.toUpperCase()} SEVERITY
                    </span>
                    <span className={`text-[10px] font-bold ${gap.status === 'resolved' ? 'text-emerald-600' : 'text-red-600 animate-pulse'}`}>
                      {gap.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 leading-snug">{gap.gap_type}</div>
                  <div className="p-2 bg-white border border-slate-200 rounded text-[11px] text-slate-600 leading-relaxed font-mono">
                    <span className="font-semibold text-red-600">Remedy:</span> {gap.remedy_directive}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 31: L421-430 External Intelligence Signals Network Panel
// -------------------------------------------------------------
export function ExternalIntelligenceLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState<'Google Trends' | 'TikTok Trends' | 'European Weather' | 'Competitor Watch' | 'SocioEconomic'>('Google Trends');
  const [newSentiment, setNewSentiment] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [newImpact, setNewImpact] = useState(1.10);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const signals = dbEngine.external_signals.getAll();

  const handleHarvestSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dbEngine.external_signals.create({
      source: newSource,
      signal_title: newTitle,
      sentiment: newSentiment,
      impact_coefficient: Number(newImpact),
      signal_value: newValue || '+12.5% demand change',
      harvested_at: new Date().toISOString()
    });

    triggerSuccess(`Harvested external business signal into DB: "${newTitle.substring(0, 20)}..."`);
    setNewTitle('');
    setNewValue('');
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="external_signals_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white font-sans">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L421-430</span>
            <h3 className="font-bold text-base text-[#07C2E3]">External Intelligence Radar Network (外部实时情报感官)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            不间断嗅探全网环境刺激源。包括谷歌趋势热搜词增长、TikTok流行短视频热度、中欧瞬发寒潮气象警报及Zalando等核心竞品的实时变价与对冲系数。
          </p>
        </div>
        <div>
          <span className="bg-slate-800 text-[#07C2E3] text-[10px] font-mono px-2 py-1 rounded font-bold">Harvester Agent: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Harvest Input Form */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-950 flex items-center gap-1.5">
              <span>📡</span> Harvest Real-time World Shock
            </h4>

            <form onSubmit={handleHarvestSignal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Signal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 慕尼黑出现入冬以来最强冷空气气流"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="Google Trends">Google Trends</option>
                    <option value="TikTok Trends">TikTok Trends</option>
                    <option value="European Weather">European Weather</option>
                    <option value="Competitor Watch">Competitor Watch</option>
                    <option value="SocioEconomic">SocioEconomic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Sentiment</label>
                  <select
                    value={newSentiment}
                    onChange={(e) => setNewSentiment(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="positive">Positive (高转化红利)</option>
                    <option value="neutral">Neutral (平稳波动度)</option>
                    <option value="negative">Negative (阻碍/竞品倾销)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Impact Coefficient</label>
                <input
                  type="number"
                  step="0.05"
                  value={newImpact}
                  onChange={(e) => setNewImpact(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Signal Metric / Observed Value</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. +142% MoM search growth"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <button
                type="submit"
                className="w-full text-xs bg-slate-950 text-white font-bold py-2 px-4 rounded hover:bg-[#07C2E3] hover:text-black transition uppercase font-mono tracking-wider font-extrabold"
              >
                Harvest Shock & Mutate DB
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active External Signal Grid */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
            <h4 className="font-sans font-bold text-sm text-slate-950">
              ⚡ Live Harvested Environmental Signals
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signals.map((sig) => (
                <div key={sig.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 font-extrabold">{sig.source.toUpperCase()}</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded ${
                        sig.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        sig.sentiment === 'negative' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sig.sentiment.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 leading-snug">{sig.signal_title}</div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2 text-[11px] font-mono">
                    <span className="text-slate-500">Value: <span className="font-bold text-slate-800">{sig.signal_value}</span></span>
                    <span className="text-[#07C2E3] font-bold">Impact Multiplier: {sig.impact_coefficient}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 32: L431-450 Fashion Market Trend Radar Panel
// -------------------------------------------------------------
export function MarketRadarLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const trends = dbEngine.market_radar_trends.getAll();

  const handleUpdateMomentum = (id: string, current: number, direction: 'up' | 'down') => {
    const delta = direction === 'up' ? 2.5 : -2.5;
    const nextVal = Math.min(100, Math.max(-50, Number((current + delta).toFixed(1))));
    let status: 'SURGING' | 'STABLE' | 'DECAYING' = 'STABLE';
    if (nextVal > 25) status = 'SURGING';
    if (nextVal < 0) status = 'DECAYING';

    dbEngine.market_radar_trends.update(id, {
      momentum_pct: nextVal,
      radar_status: status,
      last_updated: new Date().toISOString()
    });

    triggerSuccess(`Recalibrated fashion momentum weight: ${nextVal}% for Trend Node ${id}`);
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="market_radar_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white font-sans">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L431-450</span>
            <h3 className="font-bold text-base text-[#07C2E3]">European Fashion Market Trend Radar (欧洲时尚大盘雷达)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            自主追踪并聚合法国、德国、比利时、荷兰主流时尚标签的区域热力及增量速度。对变频消费周期极度敏感。高管可调控和增强特定趋势权重。
          </p>
        </div>
        <div>
          <span className="bg-slate-805 text-amber-400 text-[10px] border border-amber-900 px-2 py-1 rounded font-mono">Active Nodes Monitored: 4</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-sans font-bold text-sm text-slate-950">
            📊 Trend Heat Index & Dynamic Flow
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Real DB Persistence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <span className="bg-slate-900 text-[#07C2E3] font-bold text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {item.country_code} REGION
                </span>
                <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  item.radar_status === 'SURGING' ? 'bg-emerald-50 text-emerald-600 border border-emerald-250 animate-pulse' :
                  item.radar_status === 'DECAYING' ? 'bg-red-50 text-red-600 border border-red-250' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.radar_status}
                </span>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-black font-mono">Style Category</div>
                <div className="font-extrabold text-slate-950 text-xs mt-0.5 leading-normal truncate">{item.style_category}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center py-2 bg-white border border-slate-150 rounded-lg font-mono">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Heat Index</div>
                  <div className="text-sm font-extrabold text-slate-900">{item.style_heat_index}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Momentum Velocity</div>
                  <div className={`text-sm font-extrabold ${item.momentum_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.momentum_pct >= 0 ? '+' : ''}{item.momentum_pct}%
                  </div>
                </div>
              </div>

              {/* Adjust momentum slider controls */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-405 text-slate-400 uppercase font-bold font-mono">Tactical Recalibrator</div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleUpdateMomentum(item.id, item.momentum_pct, 'down')}
                    className="p-1 px-2.5 bg-slate-900 text-white font-extrabold rounded hover:bg-slate-800 text-[10px] font-mono transition"
                  >
                    -2.5%
                  </button>
                  <span className="text-[10.5px] text-slate-500 font-mono shrink-0">Tune weight</span>
                  <button
                    onClick={() => handleUpdateMomentum(item.id, item.momentum_pct, 'up')}
                    className="p-1 px-2.5 bg-[#07C2E3] text-black font-extrabold rounded hover:bg-[#06B2D0] text-[10px] font-mono transition"
                  >
                    +2.5%
                  </button>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 font-mono">
                Refreshed: {new Date(item.last_updated).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layer 33: L451-470 Copilot Mind Perception Core Panel
// -------------------------------------------------------------
export function CopilotCoreLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const perceptions = dbEngine.copilot_perception_states.getAll();

  const handleSimulateInference = (id: string, activeIntent: string) => {
    // Randomize active intent trigger logs
    dbEngine.context_events.create({
      tenant_id: 'tenant_01',
      store_id: 'store_01',
      event_type: 'TASK_ENGAGE',
      description: `Copilot Mind core successfully executed server-side inference on intent: [${activeIntent}]. Dispatched neural orchestrator step.`,
      timestamp: new Date().toISOString()
    });

    dbEngine.copilot_perception_states.update(id, {
      confidence: Math.min(100, Math.floor(Math.random() * 8) + 92),
      updated_at: new Date().toISOString()
    });

    triggerSuccess(`Successfully ran Copilot mind inference engine for: "${activeIntent}"`);
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="copilot_core_layer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white font-sans">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded font-mono">L451-470</span>
            <h3 className="font-bold text-base text-[#07C2E3]">Copilot Multimodally Aligned Core (Copilot 多模态感知核心)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sidekick 的服务器端感知底座。整合图片、语音、点击轨迹及多模态触发器，预测店主的模糊经营意图（AI Intent Parsing），生成自愈调度动作栈。
          </p>
        </div>
        <div>
          <span className="bg-emerald-950 text-emerald-450 border border-emerald-900 text-emerald-400 text-[10px] font-mono px-2.5 py-1 rounded font-extrabold uppercase animate-pulse">Perception Node: COMPLIANT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Neural Decision Flow Graphic */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-sans font-bold text-sm text-slate-950">
                🧭 Server-Side Intent Parser & Decision Pipeline
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Inference Flow</span>
            </div>

            {perceptions.map((p) => (
              <div key={p.id} className="space-y-5 text-xs font-sans">
                {/* Intent Node Header */}
                <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">Identified Core Intent</span>
                    <div className="font-bold text-slate-950 text-sm tracking-wide font-mono mt-0.5">{p.active_intent}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">Parser Confidence</span>
                    <div className="font-extrabold text-emerald-600 text-sm font-mono mt-0.5">{p.confidence}%</div>
                  </div>
                </div>

                {/* Multimodal input triggers */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold font-mono flex items-center gap-1.5">
                    <span>⚡</span> Multi-modal Environmental Triggers (感知输入)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {p.multimodal_triggers.map((trigger, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 text-slate-350 text-[11px] leading-relaxed border border-slate-800 rounded font-mono text-slate-300">
                        • {trigger}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Pipeline steps */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold font-mono flex items-center gap-1.5">
                    <span>🛠️</span> Dispatched Orchestrator Steps (执行决策树动作)
                  </span>
                  <div className="space-y-2">
                    {p.orchestrator_next_actions.map((action, idx) => (
                      <div key={idx} className="p-3 bg-cyan-950/20 text-[#07C2E3] border border-cyan-850/30 rounded flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">Step 0{idx + 1}:</span>
                        <p className="font-medium text-[11.5px] leading-relaxed font-sans">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Mind Trigger button */}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono">Last Synchronized: {new Date(p.updated_at).toLocaleTimeString()}</span>
                  <button
                    onClick={() => handleSimulateInference(p.id, p.active_intent)}
                    className="bg-slate-950 text-white hover:bg-slate-900 text-[10px] font-extrabold font-mono px-4 py-2 rounded shadow-sm transition uppercase tracking-wider"
                  >
                    Run Brain Inference
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Design Architecture Explanation Block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 text-xs font-sans space-y-4">
            <h4 className="font-bold text-sm text-[#07C2E3] border-b border-slate-800 pb-2">
              📑 Copernicus Intent Core Logic (底座架构)
            </h4>

            <div className="space-y-3 text-slate-400 leading-relaxed font-sans">
              <p>
                <strong>感知-对齐-自治自治循环：</strong> Sidekick 从店主提问或操作页面中提取多维感知后，并不是写死的前端控制流，而是注入到此 L451-470 内核参数层。
              </p>
              <p>
                脑内核评估置信度比率。一旦置信度超 <strong>90%</strong>，自动编排任务至指令。
              </p>

              <div className="p-3 bg-slate-900 border border-slate-805 rounded text-[11px] font-mono text-slate-300">
                <span className="text-[#07C2E3] font-bold">Input Stream:</span> Multimodal Touch, Catalog Gaps, Weather signals.<br/>
                <span className="text-[#07C2E3] font-bold">Outputs:</span> Active parsed intents on the database state.<br/>
                <span className="text-[#07C2E3] font-bold">Business Margin Value:</span> Avoid hardwired rules, dynamic conversion uplifts restored securely.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Layer 34: L471-480 Agent Workforce Runtime Card Panel
// -------------------------------------------------------------
export function AgentRuntimeLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  // Form states to dispatch dynamic missions
  const [role, setRole] = useState<'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent'>('MarketingAgent');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>('P2');
  const [payloadStr, setPayloadStr] = useState('{"target": "EU", "scope_value": "Optimal Promotion"}');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const workloads = dbEngine.agent_workloads.getAll();
  const capabilities = dbEngine.agent_capabilities.getAll();
  const missions = dbEngine.agent_missions.getAll();
  const execLogs = dbEngine.agent_execution_logs.getAll().sort((a, b) => b.logged_at.localeCompare(a.logged_at));

  const handleDispatchMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please fill in a mission title.');
      return;
    }

    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payloadStr);
    } catch {
      alert('Invalid payload JSON. Defaulting to empty object.');
    }

    // 1. Create the new Agent Mission
    const newMission = dbEngine.agent_missions.create({
      agent_role: role,
      mission_title: title,
      status: 'EXECUTING',
      priority,
      started_at: new Date().toISOString(),
      payload: parsedPayload
    });

    // 2. Insert corresponding assignment
    dbEngine.agent_assignments.create({
      mission_id: newMission.id,
      agent_id: `agent_sp_${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      target_module: `Autonomous Action [${role}]`,
      workload_pct: 35
    });

    // 3. Increment agent workload tasks count and CPU load
    const matchedWorkload = workloads.find(w => w.agent_role === role);
    if (matchedWorkload) {
      dbEngine.agent_workloads.update(matchedWorkload.id, {
        current_tasks_count: matchedWorkload.current_tasks_count + 1,
        cpu_allocation_pct: Math.min(100, matchedWorkload.cpu_allocation_pct + 15),
        system_state: matchedWorkload.cpu_allocation_pct + 15 > 75 ? 'BUSY' : 'IDLE'
      });
    }

    // 4. Log execution details
    dbEngine.agent_execution_logs.create({
      agent_role: role,
      action_type: 'WRITE_TABLE',
      affected_tables: ['agent_missions', 'exec_tasks'],
      description: `Dispatched brand new autonomous campaign: ${title}`,
      generated_value_eur: Math.floor(Math.random() * 8000) + 1500,
      logged_at: new Date().toISOString()
    });

    setTitle('');
    triggerSuccess(`Successfully dispatched autonomous workspace for ${role}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-[#07C2E3]/15 text-slate-800 px-2 py-0.5 rounded font-extrabold">Layer 471-480 // Operations</span>
          <h2 className="font-sans font-black text-xl text-slate-950 mt-1 flex items-center gap-2">
            <span>🤖</span> Agent Workforce Runtime (智能体运行时)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-sans">
            Here, active full-stack AI agents are registered, monitored, and tasked. This panel maps which agent reads which table, who triggers who, what operations they execute, and what quantified margin values they generate in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] p-2 bg-slate-50 rounded border border-slate-100 shrink-0">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 font-bold">WORKFORCE CPU: OK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Columns: Agent Workload Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agent Registry Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              📂 Active Agent Staff & Resource Workloads
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workloads.map((item) => {
                const caps = capabilities.filter(c => c.agent_role === item.agent_role);
                const activeMissions = missions.filter(m => m.agent_role === item.agent_role && m.status === 'EXECUTING');

                return (
                  <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-mono font-bold text-[#07C2E3] text-xs">{item.agent_role}</h4>
                        <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-black font-mono mt-0.5 ${
                          item.system_state === 'BUSY' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.system_state}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">#{item.id}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-y border-slate-200/60 py-2">
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px]">Active Tasks</span>
                        <strong className="text-slate-800 text-xs">{item.current_tasks_count} tasks</strong>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px]">CPU Alloc</span>
                        <strong className="text-slate-800 text-xs">{item.cpu_allocation_pct}%</strong>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px]">Memory Alloc</span>
                        <strong className="text-slate-800 text-xs">{item.memory_allocation_mb} MB</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="block text-[8px] text-slate-400 font-mono uppercase">Key Capability mapped:</span>
                      {caps.map(c => (
                        <div key={c.id} className="text-[10.5px] font-sans text-slate-700 leading-tight">
                          💡 <strong>{c.capability_name}</strong>: {c.description}
                        </div>
                      ))}
                    </div>

                    {activeMissions.length > 0 && (
                      <div className="bg-cyan-50/50 border border-cyan-100 p-2 rounded text-[10px] font-sans">
                        <span className="text-[#06B2D0] font-bold block mb-0.5">⚡ Running Mission:</span>
                        {activeMissions.map(m => (
                          <div key={m.id} className="text-slate-705 truncate">
                            &bull; {m.mission_title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Running Mission Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🎯 Active Missions Hub
            </h3>

            {missions.length === 0 ? (
              <p className="text-xs text-slate-400 font-sans italic py-4 text-center">No missions are currently running.</p>
            ) : (
              <div className="space-y-3">
                {missions.map((m) => (
                  <div key={m.id} className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">[{m.id}]</span>
                        <span className="text-xs font-mono font-bold text-[#07C2E3] uppercase">{m.agent_role}</span>
                        <span className={`text-[8px] font-extrabold px-1 text-white bg-slate-950 font-mono rounded-sm`}>
                          {m.priority}
                        </span>
                      </div>
                      <p className="font-sans font-bold text-xs text-slate-800">{m.mission_title}</p>
                      <span className="block text-[9px] text-slate-400 font-mono">Started: {new Date(m.started_at).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9.5px] px-2 py-0.5 rounded font-mono font-extrabold ${
                        m.status === 'EXECUTING' ? 'bg-cyan-150 text-cyan-800 bg-cyan-100 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Dispatch New & Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dispatch Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span>🚀</span> Dispatch Autonomous Agent Mission
            </h3>

            <form onSubmit={handleDispatchMission} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Executor Agent Staff</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                >
                  <option value="MarketingAgent">MarketingAgent (营销推广战略)</option>
                  <option value="InventoryAgent">InventoryAgent (库存智能调配)</option>
                  <option value="PricingAgent">PricingAgent (价格弹性利润平衡)</option>
                  <option value="CustomerAgent">CustomerAgent (客户分析与尺码回溯)</option>
                  <option value="FinanceAgent">FinanceAgent (国际税率与OSS合规)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Mission Directive / Slogan</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Conduct compliance alignment for France rollout"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="P1">P1 (Immediate Critical)</option>
                    <option value="P2">P2 (Standard Operation)</option>
                    <option value="P3">P3 (Opportunistic Yield)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Payload Variables (JSON)</label>
                  <input
                    type="text"
                    value={payloadStr}
                    onChange={(e) => setPayloadStr(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#07C2E3] text-black font-black hover:bg-[#06B2D0] p-2.5 rounded font-sans uppercase transition tracking-wider text-xs"
              >
                Dispatch Agent Into Runtime &rarr;
              </button>
            </form>
          </div>

          {/* Runtime Execution Logs & EUR Generated */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 space-y-4">
            <h3 className="font-sans font-bold text-xs text-[#07C2E3] uppercase tracking-wider border-b border-slate-800 pb-2">
              📋 Real-time Execution Audit stream (带商业增益记录)
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {execLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-900 border border-slate-850 rounded text-[11px] font-sans space-y-1">
                  <div className="flex justify-between items-start font-mono text-[10px]">
                    <span className="text-[#07C2E3] font-bold">{log.agent_role}</span>
                    <span className="text-slate-500">{new Date(log.logged_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 leading-normal">{log.description}</p>
                  <div className="pt-1.5 flex justify-between items-center font-mono text-[9px] text-slate-500 border-t border-slate-850/50">
                    <span>ACTION: {log.action_type}</span>
                    {log.generated_value_eur > 0 && (
                      <span className="text-emerald-400 font-extrabold bg-emerald-900/40 px-1.5 py-0.5 rounded">
                        +{log.generated_value_eur} EUR Value
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Layer 35: L481-490 Agent Coordination Engine (Dispute Arbitration)
// -------------------------------------------------------------
export function AgentCoordinationLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  // New Vote Input states
  const [selectedVoter, setSelectedVoter] = useState<'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent'>('CustomerAgent');
  const [votePosition, setVotePosition] = useState<'APPROVE' | 'REJECT' | 'APPROVE_WITH_REVISION'>('APPROVE');
  const [voteReason, setVoteReason] = useState('');

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const debates = dbEngine.agent_debates.getAll();
  const votes = dbEngine.agent_votes.getAll();
  const consensus = dbEngine.agent_consensus.getAll();

  const handleCastVote = (e: React.FormEvent, debateId: string) => {
    e.preventDefault();
    if (!voteReason.trim()) {
      alert('Please specify your vote justification.');
      return;
    }

    dbEngine.agent_votes.create({
      debate_id: debateId,
      agent_role: selectedVoter,
      vote_position: votePosition,
      reason: voteReason,
      timestamp: new Date().toISOString()
    });

    setVoteReason('');
    triggerSuccess(`Agent ${selectedVoter} casted position: ${votePosition} successfully!`);
  };

  const handleResolveDebate = (debateId: string) => {
    // 1. Gather all votes for this debate
    const debateVotes = votes.filter(v => v.debate_id === debateId);
    
    // Calculate custom consensus based on casted data
    const findsVeto = debateVotes.some(v => v.vote_position === 'REJECT');
    const findsRevision = debateVotes.find(v => v.vote_position === 'APPROVE_WITH_REVISION');

    let resolution = 'Consensus Model approved.';
    let approvedRulesList = ['Universal consensus achieved across active nodes.'];

    if (findsVeto) {
      if (findsRevision) {
        resolution = `Dispute Resolved via Arbitration: Finance Veto overridden by Pricing Sweet-spot model at 5% Markdown combined with optimized bundle shipping.`;
        approvedRulesList = [
          'Enforce dynamic 5% price reduction strictly',
          'Deploy bundle logistics routing to protect net unit margins > 45%'
        ];
      } else {
        resolution = `Debate Rejected: Absolute finance/budget limits violated. Proposed -20% slash reverted to base index.`;
        approvedRulesList = ['Marketing promotion suspended pending compliance restructurings'];
      }
    } else {
      resolution = `Debate resolved successfully. Harmonized discount levels of 12% rolled out globally.`;
      approvedRulesList = ['Establish global TikTok trend tracking campaign', 'Apply 12% discount to outer wool coats items'];
    }

    // 2. Overwrite the debates table status
    dbEngine.agent_debates.update(debateId, {
      status: 'RESOLVED',
      compromising_summary: resolution,
      resolved_at: new Date().toISOString()
    });

    // 3. Insert into agent_consensus
    dbEngine.agent_consensus.create({
      debate_id: debateId,
      final_decision_summary: resolution,
      confidence_rating_pct: 94,
      approved_rules: approvedRulesList
    });

    // 4. Log the output and generate a value
    dbEngine.agent_execution_logs.create({
      agent_role: 'PricingAgent',
      action_type: 'WRITE_TABLE',
      affected_tables: ['agent_debates', 'agent_consensus'],
      description: `BOARD CONVENED RESOLUTION // resolved Alpaca Knitwear pricing promotion strategy dispute with consensus. Enforced compromised price floor.`,
      generated_value_eur: 14000,
      logged_at: new Date().toISOString()
    });

    triggerSuccess('Board Council successfully convened! Compromised decision dispatched across store.');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-[10px] font-mono uppercase bg-[#07C2E3]/15 text-slate-800 px-2 py-0.5 rounded font-extrabold">Layer 481-490 // Coordination</span>
        <h2 className="font-sans font-black text-xl text-slate-950 mt-1 flex items-center gap-2">
          <span>⚖️</span> Agent Coordination & Dispute Arbitration (智能体协同引擎)
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl font-sans">
          When autonomous business units propose conflicting operations (e.g. <strong>Marketing wants a 20% price cut</strong> for high TikTok traffic, but <strong>Finance vetoes it</strong> due to margin limits, and <strong>Pricing suggests a 5% compromise</strong>), the Board Council is automatially convened to resolve the deadlock into a harmonized consensus rule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Active Disputes & Voting Transcripts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🚨 Active Agent Boardroom Debates
            </h3>

            {debates.map((item) => {
              const debateVotes = votes.filter(v => v.debate_id === item.id);
              const debateConsensus = consensus.find(c => c.debate_id === item.id);

              return (
                <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Debate ID: #{item.id}</span>
                      <h4 className="font-sans font-bold text-xs text-slate-950 mt-0.5">{item.issue_title}</h4>
                      <span className="block text-[10px] text-slate-50 distribution font-mono mt-1">Initiated by: {item.initiator}</span>
                    </div>
                    <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${
                      item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Voting Dialog Matrix */}
                  <div className="space-y-3 pl-3 border-l-2 border-slate-200/80">
                    <span className="block text-[9px] text-slate-400 font-mono uppercase tracking-widest">Active Voter Arguments</span>
                    {debateVotes.map((v) => (
                      <div key={v.id} className="p-2.5 bg-white border border-slate-100 rounded text-xs space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-slate-800 font-bold">&bull; {v.agent_role}</span>
                          <span className={`px-1.5 rounded text-[8px] font-extrabold ${
                            v.vote_position === 'APPROVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            v.vote_position === 'REJECT' ? 'bg-red-50 text-red-700 border border-red-100 font-black' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {v.vote_position}
                          </span>
                        </div>
                        <p className="text-slate-650 leading-relaxed font-sans">{v.reason}</p>
                      </div>
                    ))}
                  </div>

                  {/* Consensus Output Section */}
                  {item.status === 'RESOLVED' && debateConsensus && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        ✅ Consensus Established (置信度 Rating: {debateConsensus.confidence_rating_pct}%)
                      </span>
                      <p className="text-emerald-950 font-sans italic">&quot;{debateConsensus.final_decision_summary}&quot;</p>
                      <div className="pt-2 border-t border-emerald-100 space-y-1">
                        <span className="block text-[9px] text-emerald-600 uppercase font-mono tracking-wider font-extrabold">Auto-generated Store Rules:</span>
                        {debateConsensus.approved_rules.map((rule, idx) => (
                          <div key={idx} className="text-[10.5px] text-emerald-900 font-mono flex items-center gap-1">
                            <span>&bull;</span> {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.status !== 'RESOLVED' && (
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => handleResolveDebate(item.id)}
                        className="bg-slate-950 text-white hover:bg-slate-900 font-black font-mono text-[10px] px-4 py-2 rounded shadow transition uppercase tracking-wider"
                      >
                        Convene Council & Arbitrate &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cast Vote to Debate Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🗳️ Introduce Agent Position Argument
            </h3>

            {debates.filter(deb => deb.status === 'OPEN').length === 0 ? (
              <p className="text-xs text-slate-400 font-sans italic py-4 text-center">
                All disputes have been arbitrated. No open debates currently requiring inputs.
              </p>
            ) : (
              <form onSubmit={(e) => handleCastVote(e, debates.find(deb => deb.status === 'OPEN')!.id)} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Debating Agent</label>
                  <select
                    value={selectedVoter}
                    onChange={(e) => setSelectedVoter(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  >
                    <option value="MarketingAgent">MarketingAgent (营销部)</option>
                    <option value="InventoryAgent">InventoryAgent (物流仓储部)</option>
                    <option value="PricingAgent">PricingAgent (定价统筹部)</option>
                    <option value="CustomerAgent">CustomerAgent (客户运营部)</option>
                    <option value="FinanceAgent">FinanceAgent (财务核算中心)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Vote Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['APPROVE', 'REJECT', 'APPROVE_WITH_REVISION'].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setVotePosition(pos as any)}
                        className={`p-2 border rounded font-mono text-[9px] font-black transition ${
                          votePosition === pos
                            ? 'bg-[#07C2E3]/20 border-[#07C2E3] text-slate-900 font-black'
                            : 'bg-white border-slate-200 text-slate-505'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">Position Justification (Reason)</label>
                  <textarea
                    rows={4}
                    value={voteReason}
                    onChange={(e) => setVoteReason(e.target.value)}
                    placeholder="Provide pricing parameters, compliance laws, or inventory levels to justify..."
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#07C2E3]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#07C2E3] text-black font-black hover:bg-[#06B2D0] p-2.5 rounded font-sans uppercase transition tracking-wider text-xs"
                >
                  Cast Position Into Board &rarr;
                </button>
              </form>
            )}
          </div>

          {/* Theoretical board graph card */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 text-xs font-sans space-y-3">
            <h4 className="font-bold text-xs text-[#07C2E3] uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <span>🧬</span> Dynamic Multi-Agent Consensus Graph
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
              Our system avoids hard-coded priorities. When dispute loops trigger (Veto detected), the system maps variables against are lational state database to identify compromised pricing thresholds. If no consensus can be formed automatically, budget operations are frozen under Phase 491 governance limits automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Layer 36: L491-500 Autonomous Execution Governance (Compliance controls)
// -------------------------------------------------------------
export function ExecutionGovernanceLayer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const permissions = dbEngine.execution_permissions.getAll();
  const limits = dbEngine.execution_limits.getAll();
  const audits = dbEngine.execution_audits.getAll().sort((a, b) => b.logged_at.localeCompare(a.logged_at));
  const rollbacks = dbEngine.rollback_records.getAll();

  const handleToggleManualOverride = (permissionId: string, currentVal: boolean) => {
    dbEngine.execution_permissions.update(permissionId, {
      requires_manual_approval: !currentVal,
      governance_check_status: !currentVal ? 'WARNING' : 'PASS'
    });
    triggerSuccess('Overwrote permission threshold successfully. State synchronization updated.');
  };

  const handleTriggerRollback = (auditId: string) => {
    const auditObj = audits.find(x => x.id === auditId);
    if (!auditObj) return;

    // 1. Mark as RESOLVED_BY_ADMIN
    dbEngine.execution_audits.update(auditId, {
      status: 'RESOLVED_BY_ADMIN'
    });

    // 2. Subtract budget used for the corresponding agent to zero (self-healer)
    const affectedAgent = auditObj.agent_role;
    const limitObj = limits.find(l => l.agent_role === affectedAgent);
    if (limitObj) {
      dbEngine.execution_limits.update(limitObj.id, {
        current_used_budget_eur: 0,
        updated_at: new Date().toISOString()
      });
    }

    // 3. Create a rollback record
    dbEngine.rollback_records.create({
      tenantId: 'tenant_default',
      proposalId: 'prop_governance_self_heal',
      timestamp: new Date().toISOString(),
      rollbackReason: `Violating spend governance: "${auditObj.action_summary}"`,
      actionsTaken: ['Rollback budget to €0', 'Revert transaction state'],
      restoredMetrics: { 
        'Safety Status': 'SECURE', 
        'Revenue Outflow Prevented': '€' + (limitObj ? limitObj.current_used_budget_eur : 0) 
      },
      estimatedRollbackCost: 0,
      status: 'success',
      source: 'Governor Engine',
      evidenceId: 'ev_governance_auto',
      validationId: 'val_governance_auto',
      approvalId: 'app_governance_auto',
      executionId: auditObj.affected_row_id || 'exec_governance_auto',
      
      // Modern Governance Rollback fields
      audit_id: auditId,
      reverted_by: 'Governor Engine (Compliance Overlord)',
      revert_payload_snapshot: { action: auditObj.action_summary, affected_agent: affectedAgent },
      reverted_at: new Date().toISOString()
    });

    // 4. Log the rollback
    dbEngine.agent_execution_logs.create({
      agent_role: affectedAgent,
      action_type: 'EXECUTE_CALC',
      affected_tables: ['execution_audits', 'execution_limits'],
      description: `ROLLBACK SAFE TRANSACTION // Governor Engine rolled back action: "${auditObj.action_summary}" for violating spend governance. Reverted allocated and used budgets back to €0 safely.`,
      generated_value_eur: 0,
      logged_at: new Date().toISOString()
    });

    triggerSuccess(`Successfully dispatched dynamic rollback for ${affectedAgent}! Funds restored.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-[10px] font-mono uppercase bg-[#07C2E3]/15 text-slate-800 px-2 py-0.5 rounded font-extrabold">Layer 491-500 // Compliance Governance</span>
        <h2 className="font-sans font-black text-xl text-slate-950 mt-1 flex items-center gap-2">
          <span>🛡️</span> Autonomous Execution Governance (自治执行治理)
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl font-sans">
          This is the compliance firewall. Because autonomous agents modify prices, commit procurement inventory, and dispatch coupons, our governance layer imposes hourly budget constraints, minimum rating thresholds, and instantaneous rollback switches to restore and protect capital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Permission matrices & spending caps */}
        <div className="lg:col-span-6 space-y-6">
          {/* Permission threshold controller */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🔑 Agent Permission Threshold Controller
            </h3>

            <div className="space-y-3">
              {permissions.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-400">[{p.action_key}]</span>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm font-mono ${
                        p.governance_check_status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                        p.governance_check_status === 'RESTRICTED' ? 'bg-red-100 text-red-00 border border-red-205 text-red-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {p.governance_check_status}
                      </span>
                    </div>
                    <span className="block text-[11px] text-slate-700 font-sans mt-1">Executor: <strong>{p.agent_role}</strong></span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">Min required confidence: {p.min_confidence_pct}%</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleManualOverride(p.id, p.requires_manual_approval)}
                      className={`text-[10px] font-black font-mono p-2 py-1.5 rounded border transition ${
                        p.requires_manual_approval
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      }`}
                    >
                      {p.requires_manual_approval ? '🔒 Requires Approval' : '🔓 Fully Autonomic'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Budget constraints */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              💸 Hourly Budget & Change Counters (风险额度拦截)
            </h3>

            <div className="space-y-3.5">
              {limits.map((l) => {
                const percentage = Math.min(100, Math.round((l.current_used_budget_eur / l.max_hourly_budget_eur) * 100));

                return (
                  <div key={l.id} className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#07C2E3]">{l.agent_role}</span>
                      <span className="font-mono text-slate-500 font-bold">
                        {l.current_used_budget_eur} EUR used / {l.max_hourly_budget_eur} Limit
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentage > 80 ? 'bg-red-500' : percentage > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Daily Changes count cap: {l.max_daily_changes_count} changes</span>
                      <span>Updated: {new Date(l.updated_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Execution audit history logs & Rollback Safe hooks */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🚨 Active Governance Audit Logs & Rollbacks
            </h3>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {audits.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-slate-50 border border-slate-250/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">Audit ID: #{a.id}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <strong className="text-xs font-mono text-slate-800">{a.agent_role}</strong>
                        <span className={`text-[8px] font-black font-mono px-1.5 py-0.5 rounded-sm ${
                          a.risk_rating === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse font-black' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {a.risk_rating} Risk
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      a.status === 'RESOLVED_BY_ADMIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-normal font-sans">{a.action_summary}</p>
                  <span className="block text-[9.5px] text-slate-400 font-mono">Timestamp: {new Date(a.logged_at).toLocaleString()}</span>

                  {a.status === 'AUDITED' && a.risk_rating === 'HIGH' && (
                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => handleTriggerRollback(a.id)}
                        className="bg-red-650 text-white hover:bg-red-700 font-black font-mono text-[9px] px-3 py-1.5 rounded transition uppercase border border-red-700 flex items-center gap-1 bg-red-600 shadow-sm"
                      >
                        ⚡ Revert Action (Rollback safely)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rollbacks history audit log */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 space-y-3 text-xs font-sans">
            <h4 className="font-bold text-xs text-[#07C2E3] uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <span>🔄</span> Immutable Rollback Safe Registry
            </h4>

            {rollbacks.length === 0 ? (
              <p className="text-slate-400 italic font-mono text-[11px] py-2">No rollbacks have been compiled yet.</p>
            ) : (
              <div className="space-y-2">
                {rollbacks.map((r) => (
                  <div key={r.id} className="p-2 bg-slate-900 border border-slate-850 rounded font-mono text-[10.5px] space-y-1">
                    <div className="flex justify-between text-slate-400 font-bold">
                      <span>TX ROLLBACK: {r.id}</span>
                      <span>{new Date(r.reverted_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200">Reverted Audit row #{r.audit_id}</p>
                    <span className="block text-[9.5px] text-emerald-400">Trigger actor: {r.reverted_by}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Layer 37: L501-520 Business Context Engine 2.0 (Sidekick Gateway metadata)
// -------------------------------------------------------------
export function ContextEngineV2Layer({ triggerSuccess }: LayerProps) {
  const [tick, setTick] = useState(0);
  const [healingGapId, setHealingGapId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const gaps = dbEngine.context_gaps_v2.getAll();
  const checklists = dbEngine.store_checklists.getAll();
  const storeReadinessList = dbEngine.store_readiness.getAll();
  const activeReadiness = storeReadinessList[0] || { id: 's_readiness_01', overall_score: 82 };

  const handleSelfHealGap = (gapId: string) => {
    const matchedGap = gaps.find(g => g.id === gapId);
    if (!matchedGap) return;

    setHealingGapId(gapId);

    // Simulate multi-agent self-healing loop compilation time
    setTimeout(() => {
      // 1. Mark the target gap as FIXED
      dbEngine.context_gaps_v2.update(gapId, {
        status: 'FIXED'
      });

      // 2. Map corresponding checklist name and mark as completed
      let sckName = '';
      if (matchedGap.gap_code === 'GAP_VAT_FR') {
        sckName = 'OSS VAT System European Registry Registration';
      } else if (matchedGap.gap_code === 'GAP_LNG_FR') {
        sckName = 'French Language Checkout Asset Translation';
      } else if (matchedGap.gap_code === 'GAP_PAY_FR') {
        sckName = 'Carte Bancaire Local Checkout payment rail overlay';
      }

      if (sckName) {
        const matchedSck = checklists.find(c => c.item_name === sckName);
        if (matchedSck) {
          dbEngine.store_checklists.update(matchedSck.id, {
            status: 'completed'
          });
        }
      }

      // 3. Increment Overall store readiness score
      const currentScore = activeReadiness.overall_score;
      const boostedScore = Math.min(100, currentScore + matchedGap.readiness_hit_pct);
      
      if (activeReadiness && 'id' in activeReadiness && activeReadiness.id) {
        dbEngine.store_readiness.update(activeReadiness.id, {
          overall_score: boostedScore,
          assessment_date: new Date().toISOString()
        });
      }

      // 4. Log completion to execution logs
      dbEngine.agent_execution_logs.create({
        agent_role: matchedGap.remedy_agent,
        action_type: 'WRITE_TABLE',
        affected_tables: ['context_gaps_v2', 'store_checklists'],
        description: `SELF HEALING RESOLVED // dispatched dynamic translation and localized payment overlays automatically. France sales channel cured.`,
        generated_value_eur: matchedGap.impact_loss_eur_mo,
        logged_at: new Date().toISOString()
      });

      setHealingGapId(null);
      triggerSuccess(`Successfully healing compiled for: "${matchedGap.gap_name}"! Overall readiness rose to ${boostedScore}%.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <span className="text-[10px] font-mono uppercase bg-[#07C2E3]/15 text-slate-800 px-2 py-0.5 rounded font-extrabold">Layer 501-520 // Gateway Context</span>
        <h2 className="font-sans font-black text-xl text-slate-950 mt-1 flex items-center gap-2">
          <span>🔌</span> Business Context Engine 2.0 (Sidekick Readiness Cockpit)
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl font-sans">
          This is the entrance gate and assessment brain for our upcoming Sidekick. The Context Engine 2.0 continuously calculates gaps based on the following diagnostic matrix: <strong>&quot;What is missing? Why is it missing? Which agent can fix it? What is the impact loss in EUR?&quot;</strong> Let's execute autonomous self-healers before launch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Store Readiness overall score visual and checklists */}
        <div className="lg:col-span-4 space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 text-center space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Store Integrity Readiness</span>
            
            <div className="inline-flex items-center justify-center relative p-5 bg-slate-900 border border-slate-800 rounded-full w-28 h-28 mx-auto shadow-inner">
              <span className="text-3xl font-black font-sans text-cyan-400">{activeReadiness.overall_score}%</span>
            </div>

            <div className="text-xs text-slate-300 leading-normal max-w-xs mx-auto font-sans">
              {activeReadiness.overall_score >= 90 ? (
                <span className="text-emerald-400 font-extrabold font-sans">🔥 STORE COMPLIANCE READY! Sidekick Connector fully authorized for deployment.</span>
              ) : activeReadiness.overall_score >= 70 ? (
                <span className="text-amber-400 font-bold font-sans">⚠️ Warning: Gaps discovered on localized targets. Action recommended.</span>
              ) : (
                <span className="text-red-400 font-bold font-sans">🚨 Critical Gaps! Compliance barriers locked. Shop cannot capture global traffic.</span>
              )}
            </div>
          </div>

          {/* Underlay checklist requirements */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              📜 Active Localization Checklists (France Rollout)
            </h3>

            <div className="space-y-2.5">
              {checklists.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 border border-slate-150 rounded">
                  <div className="space-y-0.5 max-w-[210px]">
                    <span className="block font-medium text-slate-850 truncate">{item.item_name}</span>
                    <span className="block text-[8px] text-slate-400 font-mono tracking-wider uppercase">{item.category} &bull; Weight {item.weight}%</span>
                  </div>
                  <span className={`text-[8.5px] font-black font-mono px-1.5 py-0.5 rounded-sm ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-[#C16D00] bg-amber-50'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Gaps list and "Deploy Self-Healer Code" button */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              🔌 Context Gaps V2 & Remediation Matrices
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gaps.map((g) => (
                <div key={g.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">GAP CODE: {g.gap_code}</span>
                      <span className={`text-[8px] font-extrabold px-1 font-mono rounded ${
                        g.priority === 'P1' ? 'bg-red-950 text-red-100' : 'bg-slate-950 text-white'
                      }`}>
                        {g.priority}
                      </span>
                    </div>

                    <h4 className="font-sans font-black text-xs text-slate-950 leading-tight">{g.gap_name}</h4>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                      <strong>Missing reason:</strong> {g.why_missing}
                    </p>

                    {/* Monetary matrix indicators */}
                    <div className="grid grid-cols-2 gap-2 text-center text-[10.5px] font-mono border-t border-slate-200/50 pt-2 bg-slate-100/50 p-2 rounded">
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase">Impact revenue loss</span>
                        <strong className="text-red-500 font-black">-€{g.impact_loss_eur_mo} / mo</strong>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase">Readiness impact</span>
                        <strong className="text-[#07C2E3] font-black">-{g.readiness_hit_pct}% impact</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center gap-2">
                    <span className="text-[9px] text-[#06B2D0] font-mono font-bold">HEALER: {g.remedy_agent}</span>
                    
                    {g.status === 'FIXED' ? (
                      <span className="text-[9.5px] font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                        &bull; HEALED (FIXED)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelfHealGap(g.id)}
                        disabled={healingGapId !== null}
                        className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold font-mono text-[9px] px-3.5 py-1.5 rounded transition uppercase border border-slate-900 shadow disabled:opacity-50"
                      >
                        {healingGapId === g.id ? 'Compiling healer...' : '🔧 Auto-Heal code'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Context 2.0 summary guidelines card */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 space-y-3 text-xs font-sans">
            <h4 className="font-bold text-xs text-[#07C2E3] uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <span>🧬</span> Dynamic Multi-Agent Self-Healing Paradigm (自治自愈自对齐)
            </h4>
            <div className="space-y-2 text-slate-400 leading-relaxed text-[11.5px] font-sans">
              <p>
                In the Context Engine 2.0 paradigm, the upcoming Shopify Sidekick is connected to autonomous self-healing loops. When Gaps are discovered, the shop does not merely diagnostic report: instead, the corresponding remedy agents automatically compile localized tax routers, translates product properties, and patches checkout Payment APIs.
              </p>
              <p>
                Once all Gaps are healed, the overall score reaches <strong>100%</strong>, dynamically unlocking safe, cross-border multi-currency transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// =============================================================
// Layer 38: Phase 521-540 - Enterprise Brain Finalization Cockpit (企业大脑自治闭环)
// =============================================================
export function BrainFinalizationLayer({ triggerSuccess }: LayerProps) {
  const [activeTab, setActiveTab] = useState<'stream_bus' | 'awareness_bridge' | 'task_gateway' | 'brain_runtime' | 'digital_twin' | 'readiness_v2' | 'agent_registry' | 'action_graph'>('stream_bus');
  const [tick, setTick] = useState(0);

  // Phase 541-600 Runtime & Action Graph custom states
  const [runtimePageShift, setRuntimePageShift] = useState('orders');
  const [customNodeLabel, setCustomNodeLabel] = useState('Manual audit of logistics latency');
  const [customNodeType, setCustomNodeType] = useState<'GOAL' | 'STRATEGY' | 'WORKFLOW' | 'AGENT' | 'TASK' | 'OUTCOME' | 'LEARNING'>('LEARNING');
  const [registryTestAgent, setRegistryTestAgent] = useState('CEO Sophia');
  const [registryTestCost, setRegistryTestCost] = useState(12000);

  // Event bus form states
  const [simEventType, setSimEventType] = useState<BrainEvent['event_type']>('STRATEGY_PLANNED');
  const [simPriority, setSimPriority] = useState<BrainEvent['priority']>('INFO');
  const [simMessage, setSimMessage] = useState('Strategic campaign drafted for upcoming Winter cold-wave peak.');
  const [simRemedy, setSimRemedy] = useState('Observe hourly conversion fluctuations on the high-luxury coat listings.');

  // Context Bridge form states
  const [virtualPageType, setVirtualPageType] = useState('settings_markets');
  const [virtualModule, setVirtualModule] = useState('store_setup');
  const [virtualContextKey, setVirtualContextKey] = useState('market_activation');

  // Task Gateway form states
  const [clientTenantId, setClientTenantId] = useState('tenant_default');
  const [clientStoreId, setClientStoreId] = useState('store_default');
  const [gatewayAgentRole, setGatewayAgentRole] = useState<'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent'>('MarketingAgent');
  const [gatewayActionType, setGatewayActionType] = useState<TaskRequest['task_action_type']>('REPLENISH_STOCK');
  const [estimatedCost, setEstimatedCost] = useState(150);
  const [isMaliciousChecked, setIsMaliciousChecked] = useState(false);

  useEffect(() => {
    // Automatically preseed and bind listeners
    BrainChannelManager.ensureDefaultChannelsAndStreams();
    const unsub = dbEngine.subscribe('all', () => setTick((t) => t + 1));
    return unsub;
  }, []);

  // Fetch db objects
  const events = dbEngine.brain_events.getAll().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const streams = dbEngine.brain_streams.getAll();
  const channels = dbEngine.brain_channels.getAll();
  const notifications = dbEngine.brain_notifications.getAll().sort((a, b) => new Date(b.dispatched_at).getTime() - new Date(a.dispatched_at).getTime()).slice(0, 5);

  const activePage = PageAwarenessBridge.getCurrentPageContext();
  const storeContext = StoreAwarenessBridge.getStoreContext();
  const snapshots = dbEngine.context_snapshots.getAll().sort((a, b) => new Date(b.snapshot_time).getTime() - new Date(a.snapshot_time).getTime()).slice(0, 8);

  const requests = dbEngine.task_requests.getAll().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const audits = dbEngine.task_audits.getAll().sort((a, b) => new Date(b.audited_at).getTime() - new Date(a.audited_at).getTime()).slice(0, 8);
  const denialsList = dbEngine.task_denials.getAll().sort((a,b)=> new Date(b.denied_at).getTime() - new Date(a.denied_at).getTime());

  const handleSimulateDispatch = () => {
    BrainStreamService.emitEvent(
      simEventType,
      simMessage,
      simPriority,
      simRemedy || undefined,
      { triggered_manually: true, timestamp: new Date().toISOString() }
    );
    triggerSuccess('Standardized Brain Event broadcasted instantly over the Message Bus!');
  };

  const handleSimulatePageShift = () => {
    PageAwarenessBridge.setCurrentPageContext(
      virtualPageType,
      virtualModule,
      virtualContextKey,
      { emulated_by: 'Admin Context Emulator' }
    );
    // Capture snapshot with md5
    PageAwarenessBridge.captureSnapshot(
      `https://shopify.com/admin/${virtualModule}/${virtualPageType}`,
      { utm_source: 'ecos_bridge' },
      ['client-active-tab', 'locale-FR']
    );
    triggerSuccess('Viewport page focus shifted successfully! Snapshot integrity verified.');
  };

  const handleSubmitSecureGate = () => {
    const res = TaskGateway.submitTaskRequest(
      clientTenantId,
      clientStoreId,
      gatewayAgentRole,
      gatewayActionType,
      'User',
      { admin_initiated: true, budget_limit_check: true },
      estimatedCost
    );

    if (res.status === 'DENIED') {
      const lastDenial = dbEngine.task_denials.getAll()
        .filter(d => d.task_request_id === res.id)
        .sort((a, b) => new Date(b.denied_at).getTime() - new Date(a.denied_at).getTime())[0];
      triggerSuccess(`🛑 TRANSACTION BLOCKED: ${lastDenial?.violated_rule_code} - ${lastDenial?.denial_reason}`);
    } else {
      triggerSuccess(`✅ SECURE TRANSACTION APPROVED: Isolation valid, permissions verified, €${estimatedCost} debited.`);
    }
  };

  const handleToggleMalicious = (checked: boolean) => {
    setIsMaliciousChecked(checked);
    if (checked) {
      setClientTenantId('tenant_malicious_attacker');
      setClientStoreId('store_compromised_vault');
    } else {
      setClientTenantId('tenant_default');
      setClientStoreId('store_default');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-extrabold">
              Phase 521-540 // ECOS Autonomous Completion
            </span>
            <h2 className="font-sans font-black text-xl text-slate-950 mt-1 flex items-center gap-2">
              <span>🌌</span> Enterprise Brain Finalization Console
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl font-sans leading-relaxed">
              This panel represents the <strong>standardized endpoints and safety gateways</strong> completing the functional closure of our Enterprise Brain. Instead of continuing to append new Layer structures, we isolate, bridge, and stream all decisions into a unified <strong>Brain Stream API, Page &amp; Store Awareness Bridge, and Task Gateway Isolation interface</strong>. This guarantees production isolation while preparing the brain for native Shopify Sidekick integration.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0 max-w-full">
            {(
              [
                { id: 'stream_bus', label: '1. Stream API', emoji: '📢' },
                { id: 'awareness_bridge', label: '2. Awareness Bridge', emoji: '👁️' },
                { id: 'task_gateway', label: '3. Task Gateway', emoji: '🔒' },
                { id: 'brain_runtime', label: '4. Brain Runtime', emoji: '⚡' },
                { id: 'digital_twin', label: '5. Digital Twin', emoji: '♊' },
                { id: 'readiness_v2', label: '6. Readiness 2.0', emoji: '📊' },
                { id: 'agent_registry', label: '7. Agent Limits', emoji: '💂' },
                { id: 'action_graph', label: '8. Action Graph', emoji: '📐' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE SCREEN */}
      {activeTab === 'stream_bus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: STREAM STATUS & SUBSCRIBER CHANNELS */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stream pipelines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                📢 Active Throughput Streams
              </h3>
              <div className="space-y-3">
                {streams.map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-150 rounded-lg flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-slate-900 leading-tight">{s.stream_name}</span>
                      <div className="flex gap-2 text-[9px] font-mono text-slate-400">
                        <span>Rate: {s.data_throughput_kb.toFixed(1)} KB/s</span>
                        <span>&bull;</span>
                        <span>Dispatched: {s.total_events_dispatched} evts</span>
                      </div>
                    </div>
                    <button
                      onClick={() => BrainChannelManager.toggleStream(s.id, s.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                        s.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-00'
                      }`}
                    >
                      {s.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriber Channels */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                📡 Unified Broadcast Channels
              </h3>
              <div className="space-y-3">
                {channels.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-150 rounded-lg flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-slate-900">{c.channel_name}</span>
                      <span className="block text-[9px] font-mono text-cyan-605 bg-cyan-50 px-1 py-0.5 rounded self-start w-fit">
                        ID: {c.channel_code} &bull; Subscribers: {c.subscribers_count}
                      </span>
                    </div>
                    <button
                      onClick={() => BrainChannelManager.toggleChannel(c.id, c.channel_status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                        c.channel_status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.channel_status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE PANEL: REALTIME EVENT DISPATCH SIMULATOR */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 border-slate-105">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  🌌 Test-bed: Stream Message Bus Dispatcher
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Emulate Brain Engine Outputs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Code (Type)</label>
                  <select
                    value={simEventType}
                    onChange={(e) => setSimEventType(e.target.value as any)}
                    className="w-full text-xs p-2 bg-slate-55 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                  >
                    <option value="STRATEGY_PLANNED">🧠 STRATEGY_PLANNED</option>
                    <option value="GOAL_CREATED">🚩 GOAL_CREATED</option>
                    <option value="GOAL_COMPLETED">✅ GOAL_COMPLETED</option>
                    <option value="BUDGET_WARN">⚠️ BUDGET_WARN</option>
                    <option value="ANOMALY">🚨 ANOMALY_ALERT</option>
                    <option value="STORE_GAP_FOUND">🔌 STORE_GAP_FOUND</option>
                    <option value="COMPLIANCE_PASS">🛡️ COMPLIANCE_PASS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Threat/Priority Level</label>
                  <select
                    value={simPriority}
                    onChange={(e) => setSimPriority(e.target.value as any)}
                    className="w-full text-xs p-2 bg-[#F8FAFC] border border-slate-202 rounded focus:outline-none"
                  >
                    <option value="INFO">🟢 INFO - Nominal telemetry</option>
                    <option value="MEDIUM">🟡 MEDIUM - Advisory audit needed</option>
                    <option value="HIGH">🟠 HIGH - Serious operational shift</option>
                    <option value="CRITICAL">🔴 CRITICAL - Immediate compliance breach risk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Message payload</label>
                <input
                  type="text"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="E.g., Winter pricing indices matched 95% target margin compliance"
                  className="w-full text-xs p-2 bg-slate-55 border border-slate-202 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Autonomous Remediation advice</label>
                <input
                  type="text"
                  value={simRemedy}
                  onChange={(e) => setSimRemedy(e.target.value)}
                  placeholder="Recommended action recommendation..."
                  className="w-full text-xs p-2 bg-slate-55 border border-slate-202 rounded focus:outline-none"
                />
              </div>

              <button
                onClick={handleSimulateDispatch}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
              >
                ⚡ Emit Event to Brain Stream Bus
              </button>
            </div>

            {/* RECENT NOTIFICATION DISTRIBUTED QUEUES */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                📬 Dynamic Channel Dispatches &amp; Delivery Statuses
              </h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No subscriber notifications dispatched yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-slate-150 rounded flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="block text-[11px] text-slate-800 leading-normal">{n.notification_content}</span>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                          <span className="text-[#07C2E3] font-bold">{n.destination_channel}</span>
                          <span>&bull;</span>
                          <span>{new Date(n.dispatched_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 py-0.5 rounded">
                        {n.delivery_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STREAM HISTORY LOG */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="font-sans font-bold text-xs text-cyan-400 uppercase tracking-wider">
                  🪵 Realtime Unified Stream Telemetry Logs
                </h3>
                <span className="text-[9px] font-mono text-slate-500">Live API Feeds</span>
              </div>
              
              {events.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 italic">No events generated. Emit a test event above!</div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {events.map((e) => (
                    <div key={e.id} className="p-3 bg-slate-950/60 rounded border border-slate-800/80 hover:border-slate-700/60 transition flex justify-between items-start gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded ${
                            e.priority === 'CRITICAL' ? 'bg-red-950 text-red-100 border border-red-800' :
                            e.priority === 'HIGH' ? 'bg-amber-950 text-amber-100 border border-amber-805' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {e.priority}
                          </span>
                          <span className="text-[#07C2E3] font-bold font-mono text-[10px]">{e.event_type}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Timestamp: {new Date(e.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-300 font-sans tracking-wide leading-relaxed">{e.message}</p>
                        {e.recommended_action && (
                          <span className="block text-[10.5px] text-cyan-303 italic">
                            &bull; Recommended Alignment: {e.recommended_action}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 block self-stretch shrink-0">
                        {e.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'awareness_bridge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: ACTIVE PAGE CONTEXT & STATE */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active page representation */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                👁️ Active Viewport Tracking State
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg space-y-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-cyan-606 bg-cyan-50 px-1.5 py-0.5 rounded font-extrabold uppercase">
                    Page context resolved
                  </span>
                  <h4 className="font-sans font-black text-sm text-slate-900 mt-1">
                    {activePage ? activePage.page_type.toUpperCase() : 'NO ACTIVE NAVIGATION'}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 py-1">
                    <span className="text-slate-400">Module Area:</span>
                    <strong className="text-slate-850 font-mono text-[11px]">{activePage?.module || 'None'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 py-1">
                    <span className="text-slate-400">Context Identifier:</span>
                    <strong className="text-slate-850 font-mono text-[11px]">{activePage?.context_key || 'None'}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Last Telemetry Sweep:</span>
                    <span className="text-slate-500 text-[10px]">
                      {activePage ? new Date(activePage.last_visited_at).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store general parameters */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  🏥 Environment compliance context
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded font-black font-mono ${
                  storeContext.compliance_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  Score: {storeContext.compliance_score}%
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 font-sans">
                <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-150 rounded">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-slate-800">Locale &amp; Currency</span>
                    <span className="block text-[9px] text-slate-400 font-mono">France Region Parameters</span>
                  </div>
                  <span className="font-mono font-bold bg-slate-200 text-slate-800 px-1 rounded">
                    {storeContext.locale} &bull; {storeContext.base_currency}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-155 rounded">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-slate-800">VAT Registered</span>
                    <span className="block text-[9px] text-slate-400 font-mono">European Commission registration</span>
                  </div>
                  <button
                    onClick={() => StoreAwarenessBridge.updateStoreContext(storeContext.id, { is_vat_registered: !storeContext.is_vat_registered })}
                    className={`text-[9.5px] font-mono font-black border px-2 py-0.5 rounded transition ${
                      storeContext.is_vat_registered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {storeContext.is_vat_registered ? 'TRUE (REGISTERED)' : 'FALSE (WARNING)'}
                  </button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2 border border-[#E2E8F0] rounded">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-slate-800">EU shipping destinations</span>
                    <span className="block text-[9px] text-slate-400 font-mono">Configures localized zones</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => StoreAwarenessBridge.updateStoreContext(storeContext.id, { shipping_zones_count: Math.max(1, storeContext.shipping_zones_count - 1) })}
                      className="px-1.5 bg-slate-200 text-slate-700 font-bold border border-slate-300 rounded hover:bg-slate-300"
                    >
                      -
                    </button>
                    <span className="font-mono font-extrabold text-slate-800 px-1">{storeContext.shipping_zones_count}</span>
                    <button
                      onClick={() => StoreAwarenessBridge.updateStoreContext(storeContext.id, { shipping_zones_count: storeContext.shipping_zones_count + 1 })}
                      className="px-1.5 bg-slate-200 text-slate-700 font-bold border border-slate-300 rounded hover:bg-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION ROUTE SIMULATION & CRYPTO SNAPSHOTS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  🗺️ Simulator: Shopify Admin Viewport Router Bridge
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Emulate Client Activity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Router View Path</label>
                  <select
                    value={virtualPageType}
                    onChange={(e) => {
                      setVirtualPageType(e.target.value);
                      if (e.target.value === 'settings_markets') {
                        setVirtualModule('store_setup');
                        setVirtualContextKey('market_activation');
                      } else if (e.target.value === 'products_translate') {
                        setVirtualModule('catalog_localization');
                        setVirtualContextKey('product_translation_overlay');
                      } else {
                        setVirtualModule('sales_channels');
                        setVirtualContextKey('social_checkout_rail');
                      }
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="settings_markets">🔧 Settings &gt; Markets</option>
                    <option value="products_translate">🌐 Catalog &gt; Translate</option>
                    <option value="checkout_payment">💳 Settings &gt; Payment Gateways</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Module Code</label>
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-650 truncate uppercase">
                    {virtualModule}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Context Key</label>
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] text-slate-650 truncate uppercase">
                    {virtualContextKey}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSimulatePageShift}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
              >
                🛰️ Transition View Context &amp; Snapshot State
              </button>
            </div>

            {/* CONTEXT SNAPSHOT TIMELINE HISTORY */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  📜 Context snapshot ledger (Sha integrity hash validation)
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Cryptographically isolated and audited</span>
              </div>

              {snapshots.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No context snapshots taken yet. Simulate a route shift above!</p>
              ) : (
                <div className="space-y-3.5">
                  {snapshots.map((s) => (
                    <div key={s.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded flex justify-between items-center gap-4 text-xs">
                      <div className="space-y-1.5 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 uppercase bg-slate-200 px-1.5 py-0.5 rounded text-[9.5px]">
                            {s.associated_page_type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Time: {new Date(s.snapshot_time).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-600 space-y-0.5 font-sans">
                          <p><strong>Captured URI:</strong> {s.captured_elements.url}</p>
                          <p><strong>Bound states:</strong> {s.captured_elements.stateIdentifiers.join(', ')}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className="block text-[10px] font-mono bg-cyan-50 border border-cyan-200 text-cyan-800 px-2 py-0.5 rounded font-black">
                          {s.integrity_hash}
                        </span>
                        <span className="text-[8.5px] uppercase font-bold text-slate-400 font-sans">SHA Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'task_gateway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: ACTIVE IDENTITY PARAMETERS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                🔒 Enterprise Gateway Handshaking Isolation
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg space-y-3.5 text-xs text-slate-700 font-sans">
                <div className="space-y-1 border-b border-slate-150 pb-2">
                  <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">Gateway target isolated tenancy</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div>
                      <span className="block text-slate-400">TENANT ID</span>
                      <strong className="text-slate-805">tenant_default</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">STORE ID</span>
                      <strong className="text-slate-805">store_default</strong>
                    </div>
                  </div>
                </div>

                {/* Threat injection emulator */}
                <div className="space-y-4 pt-1">
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-800 uppercase tracking-wide flex items-center gap-1">
                        ⚠️ Threat model injector
                      </span>
                      <input
                        type="checkbox"
                        checked={isMaliciousChecked}
                        onChange={(e) => handleToggleMalicious(e.target.checked)}
                        className="w-3.5 h-3.5 text-rose-600 border-slate-300 focus:ring-rose-500 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-rose-700 leading-normal font-sans">
                      Toggle this to <strong>intentionally mock a malicious cross-tenant hijacking attack</strong>. When checked, clicking submit request to execution gateway will demonstrate automatic Isolation Shield blockage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE BUDGET LIMITS LEFT */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                💰 Agent spending quotas
              </h3>

              <div className="space-y-3 text-xs">
                {dbEngine.execution_limits.getAll().length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No budget limits constructed.</p>
                ) : (
                  dbEngine.execution_limits.getAll().map((l) => (
                    <div key={l.id} className="p-3 bg-slate-50 border border-slate-150 rounded flex justify-between items-center text-xs">
                      <div>
                        <span className="block font-bold text-slate-900 leading-none">{l.agent_role}</span>
                        <span className="block text-[9.5px] text-slate-400 font-mono mt-1">
                          Limit Cap: €{l.max_hourly_budget_eur}
                        </span>
                      </div>
                      <div className="text-right">
                        <strong className="block text-slate-800 font-mono">€{l.current_used_budget_eur} used</strong>
                        <span className="text-[8.5px] uppercase font-bold text-slate-400">Hourly Deductions</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TASK EXECUTION & AUDITING LOGS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  🛡️ Simulator: Submit secure agent task request
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Pass secure isolation gateway</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent Target</label>
                  <select
                    value={gatewayAgentRole}
                    onChange={(e) => setGatewayAgentRole(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="MarketingAgent">🤖 MarketingAgent</option>
                    <option value="InventoryAgent">🤖 InventoryAgent</option>
                    <option value="PricingAgent">🤖 PricingAgent</option>
                    <option value="CustomerAgent">🤖 CustomerAgent</option>
                    <option value="FinanceAgent">🤖 FinanceAgent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action execution type</label>
                  <select
                    value={gatewayActionType}
                    onChange={(e) => setGatewayActionType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  >
                    <option value="REPLENISH_STOCK">📦 REPLENISH_STOCK</option>
                    <option value="ADJUST_PRICE">📈 ADJUST_PRICE</option>
                    <option value="CREATE_COUPON">🎫 CREATE_COUPON</option>
                    <option value="CREATE_MARKET">🌍 CREATE_MARKET</option>
                    <option value="TRIGGER_ROLLBACK">⏪ TRIGGER_ROLLBACK</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Outflow (EUR)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded border border-slate-200 text-xs font-mono space-y-1">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans font-bold">Calling client identifiers:</span>
                <p className="text-slate-700"><strong>CALLING_TENANT:</strong> {clientTenantId}</p>
                <p className="text-slate-705"><strong>CALLING_STORE:</strong> {clientStoreId}</p>
              </div>

              <button
                onClick={handleSubmitSecureGate}
                className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
              >
                🔒 Submit Secure isolation transaction
              </button>
            </div>

            {/* BLOCK / REJECTION FOOTPRINTS */}
            {denialsList.length > 0 && (
              <div className="bg-rose-50 border-rose-200 p-5 rounded-xl border space-y-4">
                <h3 className="font-sans font-black text-xs text-rose-950 uppercase tracking-wider border-b border-rose-200 pb-2">
                  🚨 Isolated Security Threats &amp; Denial Footprints
                </h3>
                <div className="space-y-3">
                  {denialsList.map(d => (
                    <div key={d.id} className="p-3.5 bg-white border border-rose-200 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <strong className="block text-rose-800 uppercase font-mono font-black text-[10px] tracking-wide">
                          Violation: {d.violated_rule_code}
                        </strong>
                        <p className="text-slate-700 leading-normal mt-1">{d.denial_reason}</p>
                        <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                          Blocked At: {new Date(d.denied_at).toLocaleTimeString()} &bull; Enforced by: {d.denied_by}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-0.5 rounded font-black shrink-0 self-start">
                        BLOCKED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CRYPTO SECURITY AUDIT FOOTPRINTS */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-sans font-bold text-xs text-slate-950 uppercase tracking-wider">
                  📜 Isolation and safety diagnostic audit records
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Cryptographic audit tracks validated</span>
              </div>

              {audits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No executions have passed the safe audit gates yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {audits.map((a) => (
                    <div key={a.id} className="p-3.5 bg-slate-50 border border-slate-150 rounded flex justify-between items-start gap-4 text-xs">
                      <div className="space-y-1.5 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#C16D00] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0">
                            VERIFIED BY: {a.audited_by}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(a.audited_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 leading-relaxed font-sans">
                          {a.audit_message}
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-mono font-bold mt-1">
                          <span className={a.tenant_isolation_passed ? 'text-emerald-600' : 'text-rose-600'}>
                            {a.tenant_isolation_passed ? '✓ TENANT_ISOLATION_PASSED' : '✗ TENANT_ISOLATION_FAILED'}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className={a.permission_resolved_passed ? 'text-emerald-600' : 'text-rose-600'}>
                            {a.permission_resolved_passed ? '✓ PERMISSIONS_OK' : '✗ PERMISSIONS_BLOCKED'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className="block text-[9.5px] font-mono bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded font-bold truncate max-w-[140px]">
                          {a.governor_signature}
                        </span>
                        <span className="text-[8.5px] uppercase font-bold text-slate-400 font-sans">Gov Signature</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'brain_runtime' && (() => {
        const liveRuntime = BrainRuntime.getOrCreateRuntimeState('tenant_default', 'store_default');
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  ⚡ Brain Focus Parameters
                </h3>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2">
                    <span className="block text-[8.5px] font-mono uppercase text-slate-400">Current Focused Page Focus</span>
                    <strong className="block text-slate-900 text-sm font-mono">{liveRuntime.current_page_type}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2">
                    <span className="block text-[8.5px] font-mono uppercase text-slate-400">Active Campaign Goal ID</span>
                    <strong className="block text-slate-950 font-mono">{liveRuntime.active_goal_id || 'N/A (Pending Active Target)'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2">
                    <span className="block text-[8.5px] font-mono uppercase text-slate-400">Active Workflow Loop Instance</span>
                    <strong className="block text-slate-950 font-mono">{liveRuntime.active_workflow_id || 'N/A (Awaiting Execution Sequence)'}</strong>
                  </div>
                  <div className="p-3 bg-slate-55 flex justify-between items-center bg-slate-50 border border-slate-150 rounded-lg p-3">
                    <div>
                      <span className="block text-[8.5px] font-mono uppercase text-slate-400">System Core Health Load</span>
                      <strong className={`block text-xs uppercase font-extrabold ${
                        liveRuntime.system_load_status === 'HEALED' ? 'text-emerald-600' : liveRuntime.system_load_status === 'WARNING' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {liveRuntime.system_load_status}
                      </strong>
                    </div>
                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        liveRuntime.system_load_status === 'HEALED' ? 'bg-emerald-400' : liveRuntime.system_load_status === 'WARNING' ? 'bg-amber-400' : 'bg-rose-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        liveRuntime.system_load_status === 'HEALED' ? 'bg-emerald-500' : liveRuntime.system_load_status === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider">
                    🌌 Emulator: Shifting Focused Location State
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Sync Page Focus &amp; Goals</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  In production, whenever the platform Administrator or a Shopify Storefront user shifts pages, the operating system registers the focused path so that intelligence models automatically load contextual parameters.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Focused Page</label>
                    <select
                      value={runtimePageShift}
                      onChange={(e) => setRuntimePageShift(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                    >
                      <option value="dashboard">📊 Dashboard Home</option>
                      <option value="products">🛒 Products List</option>
                      <option value="settings_tax">🇪🇺 EU Tax &amp; OSS Settings</option>
                      <option value="shipping_matrices">🚚 Logistic Carrier Configurations</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <button
                      onClick={() => {
                        BrainRuntime.triggerStateShift('tenant_default', 'store_default', {
                          current_page_type: runtimePageShift
                        });
                        triggerSuccess(`Sync core focus shifted to: ${runtimePageShift}`);
                      }}
                      className="bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
                    >
                      ⚡ Shift Location and Recalculate Focus
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                  <div className="border border-slate-150 rounded-lg p-4 space-y-3 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                      🚨 Live High-Severity Incidents
                    </h4>
                    <div className="space-y-2">
                      {liveRuntime.detected_risks.map((r, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded flex justify-between items-center text-xs">
                          <div>
                            <span className="block font-bold text-slate-900">{r.label}</span>
                            <span className="block text-[8px] font-mono text-indigo-500 mt-0.5">CODE: {r.code}</span>
                          </div>
                          <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded shrink-0 ${
                            r.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {r.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-4 space-y-3 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                      🛠️ Detected Readiness Gaps &amp; Action Directives
                    </h4>
                    <div className="space-y-2">
                      {liveRuntime.detected_gaps.map((g, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{g.label}</span>
                            <span className="text-[8px] font-mono bg-cyan-100 text-cyan-800 px-1 py-0.5 rounded">GAP: {g.code}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">{g.remediation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === 'digital_twin' && (() => {
        const twin = StoreDigitalTwinEngine.getOrCreateDigitalTwin('tenant_default', 'store_default');
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  ♊ Digital Twin Synchronization
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-lg border flex justify-between items-center bg-slate-50/50">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono">STATUS</span>
                      <strong className={`block text-sm uppercase font-black ${
                        twin.twin_status === 'SYNCED' ? 'text-emerald-600' : 'text-amber-500'
                      }`}>
                        {twin.twin_status}
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        StoreDigitalTwinEngine.forceSynchronize(twin.id);
                        triggerSuccess('Twin synchronised back to clean compliance standard! Re-checked live webhook limits.');
                      }}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] rounded transition uppercase"
                    >
                      Sync Now
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] text-slate-400 uppercase font-mono">Snapshot Metadata</span>
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded space-y-2 font-mono text-[10px]">
                      <p className="flex justify-between text-slate-600">
                        <span>Last Evaluated:</span>
                        <strong className="text-slate-800">{new Date(twin.last_snapshot_at).toLocaleTimeString()}</strong>
                      </p>
                      <p className="flex justify-between text-slate-600">
                        <span>Storefront Host:</span>
                        <strong className="text-[#07C2E3] underline truncate max-w-[150px]">{twin.snapshot_data.storefront_url}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  📊 Dynamic Mirror Snapshot Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Product Catalogs</span>
                    <strong className="text-xl text-slate-900 block font-mono">{twin.snapshot_data.products_count} Items</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Matched Orders</span>
                    <strong className="text-xl text-slate-900 block font-mono">{twin.snapshot_data.active_orders_count} Orders</strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Active Currencies</span>
                    <strong className="text-slate-900 block font-mono font-bold">{twin.snapshot_data.currencies.join(', ')}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1.5">
                  <div className="p-4 border border-slate-150 rounded-lg bg-slate-50/20">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2 flex items-center gap-1">
                      🔌 Gateway Carrier Modules
                    </h4>
                    <div className="space-y-2">
                      {twin.snapshot_data.payment_gateways.map((g, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">{g.name}</span>
                          <span className={`text-[8.5px] font-bold border px-1.5 py-0.5 rounded ${
                            g.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {g.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-slate-150 rounded-lg bg-slate-50/20">
                    <h4 className="font-bold text-slate-905 border-[#F1F5F9] border-b border-slate-100 pb-1.5 mb-2 flex items-center gap-1">
                      📦 Active Autopilot Ext. Apps &amp; Legal Policies
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-705">
                      <p><span className="text-slate-400 font-mono text-[10px] inline-block w-16">APPS:</span> {twin.snapshot_data.installed_apps.slice(0, 3).join(', ')}...</p>
                      <p><span className="text-slate-400 font-mono text-[10px] inline-block w-16">POLICIES:</span> {twin.snapshot_data.legal_policies.join(', ')}</p>
                      <p><span className="text-slate-400 font-mono text-[10px] inline-block w-16">REGIONS:</span> {twin.snapshot_data.enabled_markets.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === 'readiness_v2' && (() => {
        const scorecard = StoreReadinessEngine.evaluateStoreReadiness('tenant_default', 'store_default');
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  🛡️ Core Readiness 2.0 Scorecard
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-center space-y-1">
                    <span className="block text-[8.5px] font-mono text-slate-400 uppercase">Average Launch Readiness</span>
                    <strong className="block text-3xl font-black font-mono text-slate-900">{scorecard.launch_score}%</strong>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-center space-y-1">
                    <span className="block text-[8.5px] font-mono text-slate-400 uppercase">Average Growth Readiness</span>
                    <strong className="block text-3xl font-black font-mono text-slate-900">{scorecard.growth_score}%</strong>
                  </div>

                  {scorecard.eu_ready_score < 70 && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                      <span className="block text-[9px] font-bold text-rose-800 uppercase flex items-center gap-1">⚠️ EU Compliance At Risk</span>
                      <p className="text-[10px] text-rose-700 leading-normal">Lack of official EU VAT registration cuts off major Euro payments and triggers checkout drops.</p>
                      <button
                        onClick={() => {
                          StoreReadinessEngine.triggerAutonomicHeal('tenant_default', 'store_default', 'ACTIVATE_VAT');
                          triggerSuccess('Autonomic Repair: Registered VAT under EU OSS. Compliance rating raised to 95%!');
                        }}
                        className="w-full bg-[#07C2E3] text-black font-extrabold text-[10px] p-2 rounded transition"
                      >
                        Autonomic Repair: Activate VAT
                      </button>
                    </div>
                  )}

                  {scorecard.eu_ready_score >= 70 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-lg text-xs space-y-1 text-emerald-800">
                      <strong className="block">✓ EU Integration Active</strong>
                      <p className="text-[10px] leading-normal text-emerald-700">VAT OSS configuration is complete. EU cross-border shipping zones activated.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  📐 Six Major Autonomic Business Dimensions
                </h3>

                <div className="space-y-4 pt-1">
                  {[
                    { label: 'General Launch Readiness', score: scorecard.launch_score, icon: '🚀', desc: 'Baseline products and checkout capability' },
                    { label: 'Expansion & Growth Capability', score: scorecard.growth_score, icon: '📈', desc: 'Omnichannel routing and marketing pipelines' },
                    { label: 'European & VAT Compliance', score: scorecard.eu_ready_score, icon: '🇪🇺', desc: 'One Stop Shop Customs and Tax configuration' },
                    { label: 'Multilingual & Localization', score: scorecard.loc_ready_score, icon: '🌐', desc: 'Translations indexes and local carrier mappings' },
                    { label: 'System Autonomic Automation', score: scorecard.auto_ready_score, icon: '🧱', desc: 'Self-repair trigger configuration ratios' },
                    { label: 'Decision intelligence & AI', score: scorecard.ai_ready_score, icon: '🧠', desc: 'Cognitive models and metadata richness levels' }
                  ].map((dim, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{dim.icon}</span> {dim.label}
                        </span>
                        <strong className="font-mono text-slate-805">{dim.score}%</strong>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-[#07C2E3] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dim.score}%` }}
                        ></div>
                      </div>
                      <span className="block text-[10px] text-slate-400">{dim.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === 'agent_registry' && (() => {
        const workforce = AgentCapabilityRegistry.getWorkforceAgents();
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  💂 Registered Agent Capabilities &amp; Quotas (Governance)
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {workforce.map((spec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                        <strong className="text-slate-905">{spec.name}</strong>
                        <span className="text-[9px] font-mono text-slate-400">{spec.permission_level}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-600 leading-normal">
                          <span className="text-slate-400 font-mono text-[9px]">CAPABILITIES:</span> {spec.assigned_capabilities.join(', ')}
                        </p>
                        <p className="text-slate-600 leading-normal">
                          <span className="text-slate-400 font-mono text-[9px]">LIMITATIONS:</span> {spec.limitations[0]}
                        </p>
                        <p className="text-slate-600 flex justify-between font-mono text-[10px]">
                          <span>BUDGET CAP: €{spec.max_authorized_budget_eur}</span>
                          <span className="text-indigo-600 font-bold">{spec.associated_risk_category} RISK</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider">
                    🛡️ Simulator: Registry Restriction Validation
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Governor Boundary Test</span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  In our enterprise OS layout, whenever Shopify Sidekick commands an Agent, ECOS filters the execution parameters against the Registry to block high-risk moves automatically.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Agent Role</label>
                    <select
                      value={registryTestAgent}
                      onChange={(e) => setRegistryTestAgent(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                    >
                      {workforce.map((w, idx) => (
                        <option key={idx} value={w.role}>{w.role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Task Budget Outflow (EUR)</label>
                    <input
                      type="number"
                      value={registryTestCost}
                      onChange={(e) => setRegistryTestCost(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const validation = AgentCapabilityRegistry.checkComplianceAndLog(
                      registryTestAgent,
                      registryTestCost,
                      'AUTONOMIC_CAMPAIGN_OUTFLOW'
                    );
                    if (validation.allowed) {
                      triggerSuccess(`✓ TRANSACTION APPROVED: ${validation.reason}`);
                    } else {
                      triggerSuccess(`🛑 INTERACTION BLOCKED: ${validation.reason}`);
                    }
                  }}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
                >
                  🛡️ Test Task Boundary Allowance
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === 'action_graph' && (() => {
        const graph = EnterpriseActionGraph.getOrCreateActionGraph('tenant_default', 'store_default');
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider border-b border-slate-100 pb-2">
                  📐 Real-time Causal trace Nodes
                </h3>
                <div className="space-y-3.5 text-xs">
                  <p className="text-xs text-slate-500 leading-normal">
                    This tracks why and how every platform outcome took place. You can dynamic-inject customized trace parameters below to log active auditing steps.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit Step Node Type</label>
                    <select
                      value={customNodeType}
                      onChange={(e) => setCustomNodeType(e.target.value as any)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none font-mono"
                    >
                      <option value="GOAL">🔴 GOAL</option>
                      <option value="STRATEGY">🟠 STRATEGY</option>
                      <option value="WORKFLOW">🟡 WORKFLOW</option>
                      <option value="AGENT">🟢 AGENT</option>
                      <option value="TASK">🔵 TASK</option>
                      <option value="OUTCOME">🟣 OUTCOME</option>
                      <option value="LEARNING">⚪ LEARNING</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step Action Label</label>
                    <input
                      type="text"
                      value={customNodeLabel}
                      onChange={(e) => setCustomNodeLabel(e.target.value)}
                      placeholder="Audit Step description..."
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      EnterpriseActionGraph.appendExecutionNode('tenant_default', 'store_default', {
                        id: `node_custom_${Math.random().toString(36).substring(2, 9)}`,
                        node_type: customNodeType,
                        label: customNodeLabel,
                        status: 'SUCCESS',
                        reference_id: 'cust_01',
                        timestamp: new Date().toISOString()
                      }, 'node_strategy_strat_01', 'ENGAGED_IN');
                      triggerSuccess('Custom step appended causally to Strategic Execution Trace Graph!');
                    }}
                    className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-black font-black font-sans text-xs p-2.5 rounded-lg transition uppercase tracking-wider"
                  >
                    ⚡ Append Step to Trace Graph
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-950 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-xs text-cyan-400 uppercase tracking-wider">
                    🌌 Traceability: Strategic execution flow trace graph
                  </h3>
                  <span className="text-[9px] text-slate-400 font-mono">Causal Links Map</span>
                </div>

                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {graph.nodes.map((node, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-start gap-3.5 justify-between">
                      <div className="space-y-1.5 font-sans">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded shrink-0 ${
                            node.node_type === 'GOAL' ? 'bg-rose-950/20 text-rose-400 border-rose-900/40' :
                            node.node_type === 'STRATEGY' ? 'bg-amber-950/20 text-amber-400 border-amber-900/40' :
                            node.node_type === 'WORKFLOW' ? 'bg-yellow-950/20 text-yellow-400 border-yellow-900/40' :
                            node.node_type === 'AGENT' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/40' :
                            node.node_type === 'TASK' ? 'bg-blue-950/20 text-blue-400 border-blue-900/40' :
                            node.node_type === 'OUTCOME' ? 'bg-purple-950/20 text-purple-400 border-purple-900/40' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {node.node_type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(node.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-200">{node.label}</p>
                        <span className="text-[9.5px] font-mono text-slate-400 block pt-1">REFERENCE: {node.reference_id} &bull; COMPLIANCE STATUS: {node.status}</span>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-[14px]">🪐</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


