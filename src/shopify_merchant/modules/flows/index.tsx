import React, { useEffect, useState } from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { flowSchemaMeta } from '../../schemas/flow.schema';
import { 
  Play, Settings, Layers, Star, Plus, Trash2, 
  Sparkle, AlertCircle, RefreshCw, Send, CheckCircle2, Sliders, ArrowRight
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function FlowView() {
  const { flows, hydrateFlows, updateWorkflow, addWorkflow, deleteWorkflow, simulateTrigger } = useFlowStore();
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  
  // Creation States
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState<'order_created' | 'inventory_low' | 'customer_created' | 'abandoned_checkout'>('order_created');
  
  // Editor States
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTrigger, setEditTrigger] = useState<'order_created' | 'inventory_low' | 'customer_created' | 'abandoned_checkout'>('order_created');
  const [workflowStatus, setWorkflowStatus] = useState<'active' | 'draft'>('draft');

  // Simulator States
  const [simTrigger, setSimTrigger] = useState<'order_created' | 'inventory_low' | 'customer_created' | 'abandoned_checkout'>('order_created');
  const [simValue, setSimValue] = useState('650');
  const [simLog, setSimLog] = useState<{ status: 'idle' | 'success' | 'info'; text: string } | null>(null);

  useEffect(() => {
    hydrateFlows();
  }, [hydrateFlows]);

  useEffect(() => {
    if (flows.length > 0 && !activeWorkflowId) {
      setActiveWorkflowId(flows[0].id);
    }
  }, [flows, activeWorkflowId]);

  const activeWorkflow = flows.find(f => f.id === activeWorkflowId);

  useEffect(() => {
    if (activeWorkflow) {
      setEditTitle(activeWorkflow.title);
      setEditDesc(activeWorkflow.description);
      setEditTrigger(activeWorkflow.trigger);
      setWorkflowStatus(activeWorkflow.status);
    }
  }, [activeWorkflow]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const freshWorkflow = {
      id: 'flow_' + Date.now(),
      title: newTitle,
      description: newDesc,
      status: 'draft' as const,
      trigger: newTrigger,
      conditions: [
        {
          field: newTrigger === 'order_created' ? 'order_total' as const : 'inventory_count' as const,
          operator: 'greater_than' as const,
          value: newTrigger === 'order_created' ? 200 : 5
        }
      ],
      actions: [
        {
          id: 'act_' + Date.now(),
          type: 'email' as const,
          config: {
            to: 'admin@ateliernoir.co',
            subject: `Automated Notification: ${newTitle}`,
            body: 'Shopify Flow auto trigger active transaction matching requirements.'
          }
        }
      ],
      runCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addWorkflow(freshWorkflow);
    setActiveWorkflowId(freshWorkflow.id);
    setNewTitle('');
    setNewDesc('');
    setShowCreate(false);
  };

  const handleUpdateActive = () => {
    if (!activeWorkflowId) return;
    updateWorkflow(activeWorkflowId, {
      title: editTitle,
      description: editDesc,
      trigger: editTrigger,
      status: workflowStatus
    });
    setSimLog({ status: 'success', text: 'Workflow rules successfully updated & compiled!' });
    setTimeout(() => setSimLog(null), 3000);
  };

  const handleSimulate = () => {
    setSimLog({ status: 'info', text: `Firing trigger event [${simTrigger}] with variable value: ${simValue}...` });
    setTimeout(() => {
      const result = simulateTrigger(simTrigger, { value: Number(simValue) });
      setSimLog({
        status: result.success ? 'success' : 'info',
        text: result.message
      });
    }, 800);
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">自动化</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">流程引擎</h2>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-neutral-800 transition-all font-bold cursor-pointer text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建</span>
        </button>
      </div>

      {/* Workflow Builder Form Modal */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-neutral-50 border p-4 rounded-lg space-y-3.5 animate-slideDown">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-bold text-neutral-800 flex items-center space-x-1.5">
              <Sparkle className="w-4 h-4 text-indigo-500" />
              <span>新建流程</span>
            </span>
            <button type="button" onClick={() => setShowCreate(false)} className="text-neutral-400 hover:text-black">取消</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="font-bold">流程名称 *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. 弃单召回"
                className="border bg-white rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-bold">触发事件 *</label>
              <select
                value={newTrigger}
                onChange={e => setNewTrigger(e.target.value as any)}
                className="border bg-white rounded px-2 py-1.5 focus:outline-none text-neutral-700"
              >
                <option value="order_created">订单创建</option>
                <option value="inventory_low">库存告急</option>
                <option value="customer_created">客户注册</option>
                <option value="abandoned_checkout">客户弃单</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="font-bold">规则描述 *</label>
              <input
                type="text"
                required
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="具体细节描述"
                className="border bg-white rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className="bg-neutral-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg transition-all cursor-pointer">
            保存草稿
          </button>
        </form>
      )}

      {/* Simulation Console widget */}
      <div className="bg-white border rounded-lg p-3.5 shadow-sm space-y-3.5">
        <h4 className="font-bold text-neutral-800 flex items-center space-x-1.5 border-b pb-2">
          <Play className="w-3.5 h-3.5 text-[#008060] animate-pulse" />
          <span>流程测试</span>
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-500 font-bold">触发事件:</span>
            <select
              value={simTrigger}
              onChange={e => setSimTrigger(e.target.value as any)}
              className="border rounded p-1 text-xs bg-white focus:outline-none font-sans"
            >
              <option value="order_created">订单创建</option>
              <option value="inventory_low">库存告急</option>
              <option value="customer_created">新客注册</option>
              <option value="abandoned_checkout">消费弃单</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-neutral-500 font-bold">特定阈值:</span>
            <input
              type="text"
              value={simValue}
              onChange={e => setSimValue(e.target.value)}
              className="border rounded w-20 p-1 text-xs text-center focus:outline-none"
            />
          </div>
          <button
            onClick={handleSimulate}
            className="bg-neutral-900 text-white font-bold hover:bg-neutral-800 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer"
          >
            <Send className="w-3 h-3 text-[#008060]" />
            <span>运行测试</span>
          </button>
        </div>

        {simLog && (
          <div className={`p-2.5 rounded border text-[11px] font-mono flex items-center space-x-2 animate-fadeIn ${
            simLog.status === 'success' 
              ? 'bg-[#008060]/10 border-[#008060]/20 text-[#008060]' 
              : simLog.status === 'info' 
              ? 'bg-indigo-50 border-indigo-150 text-indigo-800' 
              : 'bg-neutral-50 border-neutral-200 text-neutral-700'
          }`}>
            <RefreshCw className={`w-3.5 h-3.5 ${simLog.status === 'info' ? 'animate-spin text-indigo-500' : 'text-[#008060]'}`} />
            <span>{simLog.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* Sidebar Flow lists */}
        <div className="lg:col-span-2 space-y-2 h-[550px] overflow-y-auto pr-1">
          <span className="text-xs text-neutral-400 font-bold block mb-1">所有流程</span>
          {flows.map(f => (
            <div
              key={f.id}
              onClick={() => setActiveWorkflowId(f.id)}
              className={`p-3 border rounded-lg transition-all cursor-pointer text-left relative flex flex-col justify-between space-y-2 ${
                activeWorkflowId === f.id 
                  ? 'border-neutral-900 bg-neutral-900/5 shadow-xs' 
                  : 'bg-white hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900 line-clamp-1">{f.title}</span>
                  <Badge variant={f.status === 'active' ? 'success' : 'neutral'}>
                    {f.status === 'active' ? '开启' : '草稿'}
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2">{f.description}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#888] pt-1">
                <span>触发: {f.trigger === 'order_created' ? '订单' : f.trigger === 'inventory_low' ? '低量' : f.trigger === 'customer_created' ? '新客' : '弃单'}</span>
                <span className="font-semibold bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-700">执行: {f.runCount} 次</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic DAG Flow Visualizer & Configurator */}
        <div className="lg:col-span-3 space-y-4">
          {activeWorkflow ? (
            <div className="bg-white border rounded-lg p-4 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-neutral-800 flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>规则配置</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    deleteWorkflow(activeWorkflow.id);
                    setActiveWorkflowId(flows[0]?.id || null);
                  }}
                  className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center space-x-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                </button>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-600">流程名称</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="border rounded px-2.5 py-1 text-xs focus:outline-none font-sans font-medium"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-600">规则描述</label>
                  <input
                    type="text"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    className="border rounded px-2.5 py-1 text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pb-2.5">
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-neutral-600">触发机制</label>
                    <select
                      value={editTrigger}
                      onChange={e => setEditTrigger(e.target.value as any)}
                      className="border rounded p-1 focus:outline-none text-neutral-700 text-xs"
                    >
                      <option value="order_created">订单创建</option>
                      <option value="inventory_low">库存告急</option>
                      <option value="customer_created">买家注册</option>
                      <option value="abandoned_checkout">发生弃单</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-bold text-neutral-600">运行状态</label>
                    <select
                      value={workflowStatus}
                      onChange={e => setWorkflowStatus(e.target.value as any)}
                      className="border rounded p-1 focus:outline-none text-neutral-700 text-xs"
                    >
                      <option value="draft">备用草稿</option>
                      <option value="active">即时启用</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DAG Canvas Simulator */}
              <div className="border border-neutral-150 bg-neutral-50/50 p-4 rounded-xl relative space-y-4">
                <div className="absolute top-2 right-3 font-mono text-[8px] text-neutral-400">VISUAL SCHEMAS DAG CANVAS</div>
                
                {/* Step 1: TRIGGER */}
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-900 border text-white p-2.5 rounded-lg w-56 text-center shadow-xs">
                    <div className="font-mono text-[8px] opacity-60">事件触发 WHEN</div>
                    <div className="font-bold font-mono tracking-tight text-[11px] text-indigo-300 uppercase">{activeWorkflow.trigger}</div>
                  </div>
                  <div className="h-6 w-0.5 bg-neutral-300 align-middle"></div>
                </div>

                {/* Step 2: CONDITION */}
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-indigo-500 p-2.5 rounded-lg w-56 text-center shadow-xs">
                    <div className="font-mono text-[8px] text-neutral-400">条件规则 IF</div>
                    {activeWorkflow.conditions.map((c, i) => (
                      <div key={i} className="font-bold text-[10px] text-neutral-800 font-mono mt-0.5">
                        {c.field.toUpperCase()} {c.operator === 'greater_than' ? '>' : '<'} {c.value}
                      </div>
                    ))}
                  </div>
                  <div className="h-6 w-0.5 bg-neutral-300 align-middle"></div>
                </div>

                {/* Step 3: ACTIONS */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="font-mono text-[8px] text-neutral-400">执行动作 THEN</div>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {activeWorkflow.actions.map((act) => (
                      <div key={act.id} className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg w-52 shadow-xs text-left">
                        <div className="font-bold text-[9px] text-indigo-700 uppercase font-mono mb-1">{act.type.replace('_', ' ')}</div>
                        {act.type === 'email' && (
                          <div className="text-[10px] text-neutral-600 font-mono space-y-0.5">
                            <div>收件人: {act.config.to}</div>
                            <div className="line-clamp-1">主题: {act.config.subject}</div>
                          </div>
                        )}
                        {act.type === 'tag_customer' && (
                          <div className="text-[10px] text-neutral-600 font-mono">
                            标签: <Badge variant="neutral">{act.config.tagName}</Badge>
                          </div>
                        )}
                        {act.type === 'slack' && (
                          <div className="text-[9px] text-neutral-600 font-mono line-clamp-2">
                            通知: {act.config.body}
                          </div>
                        )}
                        {act.type === 'discount' && (
                          <div className="text-[10px] text-neutral-600 font-mono">
                            卡券: <Badge variant="success">{act.config.discountCode} (-{act.config.discountValue}%)</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleUpdateActive}
                  className="bg-black text-white hover:bg-neutral-800 font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  保存设置
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-neutral-50/50 border border-dashed rounded-lg p-10 text-center text-neutral-400 font-mono">
              Please choose or build a Flow workflow layout to visualize here.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
