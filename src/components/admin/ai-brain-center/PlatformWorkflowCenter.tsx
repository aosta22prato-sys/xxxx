import React, { useState } from 'react';
import { Play, Plus, Trash2, ArrowRight, Layers, HelpCircle, Terminal, Check } from 'lucide-react';
import { WorkflowNode } from '../../../types';

interface PlatformWorkflowCenterProps {
  addLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function PlatformWorkflowCenter({ addLog }: PlatformWorkflowCenterProps) {
  const [visualNodes, setVisualNodes] = useState<WorkflowNode[]>([
    { id: 'v1', type: 'trigger', title: 'Order Placed', status: 'idle', details: 'Triggers when a new customer checkout succeeds.' },
    { id: 'v2', type: 'ai_decision', title: 'Verify Inventory Levels', status: 'idle', details: 'Fulfillment agent maps stock allocations.' },
    { id: 'v3', type: 'condition', title: 'Is High Risk Fraud?', status: 'idle', details: 'Analyze credit and spatial parameters.' },
    { id: 'v4', type: 'action', title: 'Acknowledge Logistic Courier', status: 'idle', details: 'Trigger shipping label creation via DHL.' }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('v1');
  const [visualWorkflowLogs, setVisualWorkflowLogs] = useState<string[]>([]);
  const [isVisualRunning, setIsVisualRunning] = useState(false);
  const [currentVisualIndex, setCurrentVisualIndex] = useState(-1);

  const runVisualWorkflowSimulator = () => {
    if (isVisualRunning) return;

    setIsVisualRunning(true);
    setCurrentVisualIndex(0);
    setVisualWorkflowLogs([
      `[INIT] Booting visual sandbox workflow-instance-sim.`,
      `[INIT] Validating connections to ${visualNodes.length} active process nodes.`
    ]);
    addLog('Workflow Engine 2.0', 'Sandbox Simulation Initiated', 'Running interactive flowchart dry run.', 'tool');

    const executeVisualStep = (index: number) => {
      if (index >= visualNodes.length) {
        setTimeout(() => {
          setIsVisualRunning(false);
          setCurrentVisualIndex(-1);
          setVisualWorkflowLogs(prev => [
            ...prev,
            `[SUCCESS] Visual workflow pipeline compiled with 0 errors. Trigger events registered. Hot-deployed to Shopify SaaS tier successfully.`
          ]);
          addLog('Workflow Engine 2.0', 'Simulator Sandbox Stable', 'Finished dry run cleanly. All event webhooks verified.', 'success');
        }, 1200);
        return;
      }

      setCurrentVisualIndex(index);
      const currentNode = visualNodes[index];
      
      const detailsMap: Record<string, string> = {
        'trigger': `[Captured Trigger] Customer checkout emitted storefront event '${currentNode.title}'. Spawning autonomous micro-agents.`,
        'ai_decision': `[AI Reasoning Step] AI analyzed database states and current supplier metrics. Optimizing dispatch coordinates.`,
        'condition': `[Fulfillment Gate Rule] Check evaluation criteria for '${currentNode.title}'. Result: PASSED. Executing webhook branch.`,
        'action': `[MCP Hook Fired] REST API connection stable. Automated dispatch completed via FedEx/DHL logistics.`
      };

      const customDetail = detailsMap[currentNode.type] || `[Executing Node] Step details: "${currentNode.title}" - ${currentNode.details}`;

      setVisualWorkflowLogs(prev => [
        ...prev,
        `[Node ${index + 1}: ${currentNode.title}] ${customDetail}`
      ]);

      setTimeout(() => {
        executeVisualStep(index + 1);
      }, 1500); 
    };

    executeVisualStep(0);
  };

  const addVisualNode = (type: 'trigger' | 'ai_decision' | 'condition' | 'action') => {
    const typesMap = {
      trigger: { title: 'New Storefront Event', details: 'Fires automatically on predefined storefront actions.' },
      ai_decision: { title: 'Gemini Deep AI Step', details: 'AI processes context weights using server-side Gemini SDK.' },
      condition: { title: 'Conditional Safety Gate', details: 'Evaluate customer metrics (e.g., threat limits, VIP tier).' },
      action: { title: 'Enterprise Action Dispatcher', details: 'Trigger connected microservices, logs or REST hooks.' }
    };
    const newNode: WorkflowNode = {
      id: 'v_' + Date.now(),
      type,
      title: typesMap[type].title,
      status: 'idle',
      details: typesMap[type].details
    };
    setVisualNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    addLog('System Operator', 'Workflow Node Appended', `Added custom ${type.toUpperCase()} node to sandbox designer canvas.`, 'info');
  };

  const deleteVisualNode = (id: string) => {
    if (visualNodes.length <= 1) return;
    setVisualNodes(prev => {
      const remaining = prev.filter(n => n.id !== id);
      setSelectedNodeId(remaining[remaining.length - 1]?.id || null);
      return remaining;
    });
    addLog('System Operator', 'Workflow Node Removed', `Deleted node id: ${id} from sequence.`, 'warning');
  };

  const updateVisualNode = (id: string, fields: Partial<WorkflowNode>) => {
    setVisualNodes(prev => prev.map(n => n.id === id ? { ...n, ...fields } : n));
  };

  const loadPresetWorkflow = (presetName: string) => {
    if (presetName === 'triage') {
      setVisualNodes([
        { id: 'p_1', type: 'trigger', status: 'idle', title: 'Customer Return Requested', details: 'Fires when client requests refunds.' },
        { id: 'p_2', type: 'ai_decision', status: 'idle', title: 'Evaluate Threat and Risk Status', details: 'AI maps fraud risk score heuristics.' },
        { id: 'p_3', type: 'condition', status: 'idle', title: 'If Risk Score < 35%', details: 'Auto routing gate depending on calculated risk.' },
        { id: 'p_4', type: 'action', status: 'idle', title: 'Approve & Create Back-to-stock Label', details: 'Dispatches DHL transit coordinates to client.' }
      ]);
      setSelectedNodeId('p_1');
      addLog('Workflow Engine 2.0', 'Triage Preset Loaded', 'Loaded Return Triage workflow structure into visual canvas.', 'success');
    } else {
      setVisualNodes([
        { id: 'p_a', type: 'trigger', status: 'idle', title: 'Low Inventory Alert Trigger', details: 'Fires when SKU units <= threshold limit.' },
        { id: 'p_b', type: 'ai_decision', status: 'idle', title: 'Determine Distributor Allocation', details: 'Gemini optimizes procurement price quotes.' },
        { id: 'p_c', type: 'condition', status: 'idle', title: 'If Margin Tier > 40%', details: 'Ensures target threshold margins are fully safe.' },
        { id: 'p_d', type: 'action', status: 'idle', title: 'Submit PO Webhook To Supplier', details: 'Fires automatic webhook restock request.' }
      ]);
      setSelectedNodeId('p_a');
      addLog('Workflow Engine 2.0', 'Restock Preset Loaded', 'Loaded Inventory Auto-Restock workflow structure into visual canvas.', 'success');
    }
  };

  const editingNode = visualNodes.find(n => n.id === selectedNodeId);

  return (
    <div id="tab-visual-workflows-panel" className="space-y-6 animate-fadeIn text-slate-800">
      
      {/* Header overview banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Visual Workflow Editor Canvas v2.0</span>
          <h3 className="text-xl font-bold font-display">n8n-Style Multi-Agent Pipelines</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-xl">
            Configure automated operational logic visually. Wire custom storefront trigger nodes, Gemini decision routers, criteria evaluations, and third-party REST hook actions.
          </p>
        </div>
        
        {/* Presets loader options */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => loadPresetWorkflow('triage')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-[10px] px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Load Preset: Auto-Triage Support Flow
          </button>
          <button
            onClick={() => loadPresetWorkflow('restock')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3 py-2 rounded-xl shadow-lg shadow-indigo-950/20 transition-colors cursor-pointer"
          >
            Load Preset: Auto-Restock Flow
          </button>
        </div>
      </div>

      {/* Splits content layout: Canvas Workflow on left, property editor on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Canvas) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6 min-h-[500px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="text-left">
              <h4 className="font-bold text-slate-800 text-sm">Interactive Sequence Builder</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Click any flowchart node module below to edit its properties or logic parameters.</p>
            </div>

            {/* Run Sandbox Button */}
            <button
              onClick={runVisualWorkflowSimulator}
              disabled={isVisualRunning}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isVisualRunning ? 'Sandbox Executing...' : 'Test Run Sandbox (Dry Run)'}</span>
            </button>
          </div>

          {/* Flow Diagram Stage */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 px-4">
            <div className="w-full max-w-md space-y-5 relative">
              {visualNodes.map((node, i) => {
                const isSelected = selectedNodeId === node.id;
                const isStepActive = isVisualRunning && i === currentVisualIndex;
                const isStepPassed = isVisualRunning && i < currentVisualIndex;
                
                let cardBorder = isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-305 bg-white';
                if (isStepActive) {
                  cardBorder = 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20 animate-pulse';
                } else if (isStepPassed) {
                  cardBorder = 'border-emerald-500 bg-emerald-50/10';
                }

                return (
                  <div key={node.id} className="relative flex flex-col items-center">
                    {/* Node Card */}
                    <div
                      onClick={() => !isVisualRunning && setSelectedNodeId(node.id)}
                      className={`w-full border-2 rounded-2xl p-4 transition-all shadow-sm flex items-center justify-between relative cursor-pointer group ${cardBorder}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                          node.type === 'trigger' ? 'bg-orange-100 text-orange-700' :
                          node.type === 'ai_decision' ? 'bg-indigo-100 text-indigo-700' :
                          node.type === 'condition' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {node.type === 'trigger' && '⚡'}
                          {node.type === 'ai_decision' && '🧠'}
                          {node.type === 'condition' && '⚖️'}
                          {node.type === 'action' && '🔌'}
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Node {i+1} &bull; {node.type}</span>
                          <h5 className="font-bold text-slate-800 text-xs mt-0.5">{node.title}</h5>
                        </div>
                      </div>

                      {/* Status indicator badge */}
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                        {isStepActive ? 'EXECUTING' : isStepPassed ? 'SUCCESS' : 'IDLE'}
                      </span>
                    </div>

                    {/* Flow arrow indicator */}
                    {i < visualNodes.length - 1 && (
                      <div className="w-0.5 h-5 bg-slate-200 my-1 flex items-center justify-center relative">
                        <div className="absolute bottom-[-2px] w-1.5 h-1.5 border-r-2 border-b-2 border-slate-300 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Quick Creator node drawer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">🛠️ Canvas Actions</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Compile custom modular actions into the system sequence chain.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                disabled={isVisualRunning}
                onClick={() => addVisualNode('trigger')}
                className="px-3 py-1.5 border border-orange-250 bg-orange-50 text-orange-700 hover:bg-orange-100 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                + Trigger
              </button>
              <button
                disabled={isVisualRunning}
                onClick={() => addVisualNode('ai_decision')}
                className="px-3 py-1.5 border border-indigo-250 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                + AI Decision
              </button>
              <button
                disabled={isVisualRunning}
                onClick={() => addVisualNode('condition')}
                className="px-3 py-1.5 border border-blue-250 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                + Rule Check
              </button>
              <button
                disabled={isVisualRunning}
                onClick={() => addVisualNode('action')}
                className="px-3 py-1.5 border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                + Webhook Action
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Property editor & Compiler logs) */}
        <div className="md:col-span-4 space-y-6">
          {/* Node detailed properties editor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-4">
            <h4 className="font-bold text-slate-800 text-sm pb-2.5 border-b border-slate-100">Node Properties Inspector</h4>

            {editingNode ? (
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500 font-mono text-[10px]">
                  <span>NODE_ID: </span><span className="font-bold text-indigo-600 font-mono">{editingNode.id}</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node Header Name</label>
                  <input
                    type="text"
                    required
                    value={editingNode.title}
                    disabled={isVisualRunning}
                    onChange={(e) => updateVisualNode(editingNode.id, { title: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 shrink-0 font-display font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Functional Overview & Parameters</label>
                  <textarea
                    rows={3}
                    required
                    value={editingNode.details}
                    disabled={isVisualRunning}
                    onChange={(e) => updateVisualNode(editingNode.id, { details: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-505"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 font-normal">Active sequence status &bull; {editingNode.status}</p>
                  <button
                    onClick={() => deleteVisualNode(editingNode.id)}
                    disabled={isVisualRunning || visualNodes.length <= 1}
                    className="p-1 px-3 bg-red-50 text-red-650 rounded-lg hover:bg-red-100 border border-red-200/50 transition-colors text-[10px] font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Node</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic py-6">Select a sequence chart node module from the canvas to trace parameters.</p>
            )}
          </div>

          {/* Live Debug sandbox logs terminal */}
          <div className="bg-[#121314] text-zinc-300 border border-slate-800 rounded-2xl p-5 shadow-xl text-left space-y-3 font-mono text-[10px] flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-100 border-b border-zinc-800 pb-2">
                <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="font-sans font-black uppercase text-[10px] text-zinc-400 tracking-wider">SANDBOX COMPILER CONSOLE</span>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {visualWorkflowLogs.length > 0 ? (
                  visualWorkflowLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-relaxed whitespace-pre-line text-[9px] font-normal text-slate-400">
                      &gt; {log}
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 italic">No output logs standard. Execute Sandbox Simulation above.</div>
                )}
              </div>
            </div>

            <div className="bg-zinc-950 p-2 border border-zinc-850/60 rounded text-[9px] text-zinc-500 leading-normal font-normal">
              ✔ Complete data-flow safety verified: sandbox executes perfectly isolated. Hot-deployed files are automatically bundled.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
