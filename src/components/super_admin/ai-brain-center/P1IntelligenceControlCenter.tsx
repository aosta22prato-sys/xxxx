import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, ArrowRight, RotateCcw, CheckCircle, 
  AlertTriangle, Database, Activity, Lock, TrendingUp, 
  Clock, Play, UserCheck, BookOpen 
} from 'lucide-react';

interface KnowledgeNode {
  id: string;
  tenant_id: string;
  store_id: string;
  industry: string;
  name: string;
  type: string;
  category: string;
  content: string;
  confidence_score: number;
}

interface DecisionRecordItem {
  decision_id: string;
  tenant_id: string;
  store_id: string;
  title: string;
  type: 'PRICING' | 'MARKETING' | 'STOCKING' | 'LIQUIDITY' | 'LOGISTICS';
  proposed_by: string;
  rationale: string;
  created_at: string;
  estimated_gmv_impact: number;
  estimated_profit_impact: number;
  actual_gmv_impact: number | null;
  actual_profit_impact: number | null;
  confidence_score: number;
  learning_feedback: string | null;
  status: 'PROPOSED' | 'APPROVED' | 'EXECUTING' | 'EVALUATED' | 'FAILED';
}

export default function P1IntelligenceControlCenter() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecordItem[]>([]);
  
  // 选项分栏
  const [p1Section, setP1Section] = useState<'fabric' | 'retrieval' | 'decision'>('fabric');
  
  // 过滤及语义搜索
  const [queryText, setQueryText] = useState('秋冬大衣备配与特定渠道策略指南');
  const [tenantId, setTenantId] = useState('t_retail');
  const [storeId, setStoreId] = useState('store_retail');
  const [retrievedContext, setRetrievedContext] = useState<any | null>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [isolationAlarm, setIsolationAlarm] = useState<string | null>(null);

  // 干预提案表单参数
  const [decisionTitle, setDecisionTitle] = useState('法国在库防断货应急备配');
  const [decisionType, setDecisionType] = useState<'PRICING' | 'MARKETING' | 'STOCKING' | 'LIQUIDITY' | 'LOGISTICS'>('STOCKING');
  const [decisionProposedBy, setDecisionProposedBy] = useState('Sophia (供应链智脑)');
  const [decisionRationale, setDecisionRationale] = useState('区域温度骤跌，供热类大衣安全指标溢出，追加 300 件补给保障。');
  const [estGmv, setEstGmv] = useState(12000);
  const [estProfit, setEstProfit] = useState(3500);
  
  // 模型评定参数
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('');
  const [actualGmvVal, setActualGmvVal] = useState(12500);
  const [actualProfitVal, setActualProfitVal] = useState(3600);

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [nodeDraftContent, setNodeDraftContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadP1Data = async () => {
    setLoading(true);
    try {
      const resK = await fetch('/api/p1/knowledge');
      const dataK = await resK.json();
      if (dataK && dataK.nodes) {
        setNodes(dataK.nodes);
      }

      const resD = await fetch('/api/p1/decisions');
      const dataD = await resD.json();
      if (dataD) {
        setDecisions(dataD);
        if (dataD.length > 0 && !selectedDecisionId) {
          setSelectedDecisionId(dataD[0].decision_id);
        }
      }
    } catch (err) {
      console.warn('P1 Data sync warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadP1Data();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateNodeContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNodeId || !nodeDraftContent.trim()) return;

    try {
      const response = await fetch('/api/p1/knowledge/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId: editingNodeId,
          author: 'SUPER_ADMIN_CONSOLE',
          newContent: nodeDraftContent
        })
      });
      const resJson = await response.json();
      if (resJson.success) {
        triggerToast(`知识节点已被修正，并记录审计版本！`);
        setEditingNodeId(null);
        await loadP1Data();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteSemanticRetrieval = async () => {
    setIsRetrieving(true);
    setIsolationAlarm(null);
    setRetrievedContext(null);

    const isSandboxSafe = (tenantId === 't_retail' || tenantId === 't_food' || tenantId === 'shared');
    if (!isSandboxSafe) {
      setIsolationAlarm(`[提示] 触发租户越界嗅探防御，已将对应检索请求置入单密隔离沙箱。`);
    }

    try {
      const response = await fetch('/api/p1/context/semantic-retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText,
          tenantId,
          storeId,
          activeUserRole: 'super_admin'
        })
      });
      const data = await response.json();
      setRetrievedContext(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleProposeDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/p1/decisions/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 't_retail',
          storeId: 'store_retail',
          title: decisionTitle,
          type: decisionType,
          proposedBy: decisionProposedBy,
          rationale: decisionRationale,
          estimatedGmvImpact: estGmv,
          estimatedProfitImpact: estProfit
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        triggerToast(`自主对冲提案发布成功！置信系数: ${(resJson.decision.confidence_score * 100).toFixed(0)}%`);
        await loadP1Data();
        if (resJson.decision) {
          setSelectedDecisionId(resJson.decision.decision_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecisionId) return;

    try {
      const res = await fetch('/api/p1/decisions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId: selectedDecisionId,
          actualGmv: actualGmvVal,
          actualProfit: actualProfitVal
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`决策闭环对账校准完成！运行规约自更新。`);
        await loadP1Data();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg text-slate-800 p-5 space-y-6">
      
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-950 border border-slate-800 text-white rounded p-3 flex items-center gap-2 animate-slideIn text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-bold">{toastMsg}</span>
        </div>
      )}

      {/* 头部面板 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3 text-left">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            智脑规则与决策中枢
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            调试并核查业务知识、多隔离度租户上下文，并执行闭环偏差修正。
          </p>
        </div>
        
        <button 
          onClick={loadP1Data} 
          disabled={loading}
          className="flex items-center gap-1.5 p-1.5 px-3 hover:bg-slate-50 rounded border border-slate-200 text-xs font-bold transition-all text-slate-600 cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>同步缓存</span>
        </button>
      </div>

      {/* 选择 */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 bg-slate-50 p-1 rounded">
        {[
          { id: 'fabric', name: '大宪章知识库', icon: Database },
          { id: 'retrieval', name: '沙盒隔离检索', icon: Lock },
          { id: 'decision', name: '决策闭环对账', icon: TrendingUp }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = p1Section === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setP1Section(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                isActive 
                  ? 'bg-zinc-950 text-white shadow-xs' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 大宪章知识库 */}
      {p1Section === 'fabric' && (
        <div className="space-y-4 text-left animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs leading-normal font-normal text-slate-600">
            定义全局经营的底线约束参数。此处修改后规则会自动作用并约束大模型。
          </div>

          {editingNodeId && (
            <form onSubmit={handleUpdateNodeContent} className="bg-zinc-950 text-white p-4 rounded border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-xs font-bold text-[#07C2E3]">运行修改规约</span>
                <button 
                  type="button" 
                  onClick={() => setEditingNodeId(null)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  取消
                </button>
              </div>
              <textarea
                rows={2}
                required
                value={nodeDraftContent}
                onChange={e => setNodeDraftContent(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-xs text-zinc-100 font-mono focus:outline-none"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-white hover:bg-zinc-100 text-zinc-950 font-bold py-1 px-3 rounded text-xs cursor-pointer"
                >
                  保存并同步规则
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map(node => (
              <div 
                key={node.id} 
                onClick={() => {
                  setEditingNodeId(node.id);
                  setNodeDraftContent(node.content);
                }}
                className={`p-3.5 border rounded hover:border-slate-400 transition-all cursor-pointer ${editingNodeId === node.id ? 'border-zinc-900 bg-zinc-50' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-slate-100 text-slate-700 text-[9px] px-1 rounded font-bold">{node.id}</span>
                    <span className="text-slate-400 text-[10px]">{node.category}</span>
                  </div>
                  <span className="text-[10px] text-zinc-650 font-bold">
                    置信系数: {(node.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="text-xs font-bold text-slate-900">
                  {node.name}
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {node.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 租户隔离检索 */}
      {p1Section === 'retrieval' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 animate-fadeIn text-left">
          <div className="xl:col-span-5 bg-slate-50 border border-slate-200 p-4 rounded space-y-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">隔离环境设定</span>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">商户编号</label>
                <select 
                  value={tenantId}
                  onChange={e => setTenantId(e.target.value)}
                  className="w-full bg-white border border-slate-202 p-1.5 font-bold rounded text-slate-900"
                >
                  <option value="t_retail">默认零售商户 (t_retail)</option>
                  <option value="t_food">餐饮大盘商户 (t_food)</option>
                  <option value="shared">多租户公共组件 (shared)</option>
                  <option value="t_unauthorized_leak">未授权审计测试 (t_unauthorized_leak)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-550 font-semibold mb-1">店铺编号</label>
                <input
                  type="text"
                  required
                  value={storeId}
                  onChange={e => setStoreId(e.target.value)}
                  className="w-full bg-white border border-slate-202 p-1.5 font-bold rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">匹配语句</label>
                <textarea
                  rows={2}
                  required
                  value={queryText}
                  onChange={e => setQueryText(e.target.value)}
                  className="w-full bg-white border border-slate-202 p-1.5 font-normal rounded text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteSemanticRetrieval}
              disabled={isRetrieving}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2 rounded text-xs cursor-pointer text-center"
            >
              {isRetrieving ? '深度边界校验中...' : '启动沙盒检索'}
            </button>
          </div>

          <div className="xl:col-span-7 bg-white border border-slate-200 rounded flex flex-col justify-between overflow-hidden">
            <div className="bg-zinc-950 text-white p-2.5 px-4 text-xs font-mono font-bold flex items-center justify-between">
              <span>防隔离嗅探网关</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="p-4 flex-1">
              {isolationAlarm && (
                <div className="p-2.5 bg-red-50 border border-red-100 text-red-800 rounded text-xs flex items-start gap-1.5 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>{isolationAlarm}</p>
                </div>
              )}

              {retrievedContext ? (
                <div className="space-y-3 font-mono text-[10.5px]">
                  <div className="flex gap-4 border-b border-slate-100 pb-1.5 text-slate-500">
                    <div>租户标识: <span className="text-zinc-900 font-bold">{retrievedContext.tenantId}</span></div>
                    <div>拦截结果: <span className="text-emerald-600 font-bold">无越权行为，释放</span></div>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 mb-1">运行规约指令注入：</span>
                    <pre className="p-3 bg-zinc-950 text-neutral-300 rounded font-mono text-[9.5px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {retrievedContext.formattedPrompt}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded min-h-[160px]">
                  <BookOpen className="w-6 h-6 text-slate-300 mb-1" />
                  <p className="text-xs">检索展示区</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 闭环对账 */}
      {p1Section === 'decision' && (
        <div className="space-y-4 animate-fadeIn text-left text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* 录入决策提案 */}
            <form onSubmit={handleProposeDecision} className="bg-slate-50 border border-slate-200 p-4 rounded space-y-3">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                对冲干预提案
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-500 mb-0.5">决策事宜</label>
                  <input
                    type="text"
                    required
                    value={decisionTitle}
                    onChange={e => setDecisionTitle(e.target.value)}
                    className="w-full bg-white border border-slate-202 rounded p-1.5 text-slate-900 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-0.5">运行类别</label>
                    <select
                      value={decisionType}
                      onChange={e => setDecisionType(e.target.value as any)}
                      className="w-full bg-white border border-slate-202 rounded p-1.5 font-bold"
                    >
                      <option value="STOCKING">库存补配（STOCKING）</option>
                      <option value="PRICING">零售调价（PRICING）</option>
                      <option value="MARKETING">流量分仓（MARKETING）</option>
                      <option value="LIQUIDITY">资金结算（LIQUIDITY）</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">提出主体</label>
                    <input
                      type="text"
                      required
                      value={decisionProposedBy}
                      onChange={e => setDecisionProposedBy(e.target.value)}
                      className="w-full bg-white border border-slate-202 rounded p-1.5 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-0.5">预估销售变动 (€)</label>
                    <input
                      type="number"
                      required
                      value={estGmv}
                      onChange={e => setEstGmv(Number(e.target.value))}
                      className="w-full bg-white border border-slate-202 rounded p-1.5 font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">估算保全毛利 (€)</label>
                    <input
                      type="number"
                      required
                      value={estProfit}
                      onChange={e => setEstProfit(Number(e.target.value))}
                      className="w-full bg-white border border-slate-202 rounded p-1.5 font-mono text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-0.5">对冲执行逻辑</label>
                  <textarea
                    rows={1}
                    required
                    value={decisionRationale}
                    onChange={e => setDecisionRationale(e.target.value)}
                    className="w-full bg-white border border-slate-202 rounded p-1.5 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-1.5 rounded text-xs cursor-pointer transition-colors"
              >
                授权通过此项自治提案
              </button>
            </form>

            {/* 实测核对 */}
            <form onSubmit={handleEvaluateOutcome} className="bg-white border border-slate-200 p-4 rounded space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                  实际业务对账与自愈校准
                </h3>

                <p className="text-[11px] text-slate-400 leading-normal font-normal">
                  对账后系统会自动评估偏差并演进优化模型参数。
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-0.5">选择决策单号</label>
                    <select
                      value={selectedDecisionId}
                      onChange={e => setSelectedDecisionId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-202 rounded p-2 font-bold font-mono"
                    >
                      <option value="">-- 请选择要对账核对的单号 --</option>
                      {decisions.map(d => (
                        <option key={d.decision_id} value={d.decision_id}>
                          {d.decision_id} [{d.status}] - {d.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 mb-0.5">实测成交额 (€)</label>
                      <input
                        type="number"
                        required
                        value={actualGmvVal}
                        onChange={e => setActualGmvVal(Number(e.target.value))}
                        className="w-full bg-white border border-slate-202 rounded p-1.5 text-center font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-0.5">实控总毛利 (€)</label>
                      <input
                        type="number"
                        required
                        value={actualProfitVal}
                        onChange={e => setActualProfitVal(Number(e.target.value))}
                        className="w-full bg-white border border-slate-202 rounded p-1.5 text-center font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedDecisionId}
                className="w-full bg-zinc-950 hover:bg-zinc-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-1.5 rounded text-xs cursor-pointer mt-3 transition-colors"
              >
                触发偏差溯源演化校调
              </button>
            </form>

          </div>

          {/* 决策历史记录 */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs text-left">
            <h4 className="text-xs font-bold text-slate-800 mb-2">对警历史对冲指令清单</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {decisions.map(d => {
                const isEvaluated = d.status === 'EVALUATED';
                return (
                  <div key={d.decision_id} className="bg-white p-3 border border-slate-200 rounded flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap font-mono font-bold text-[9.5px]">
                        <span className="text-[#07C2E3]">{d.decision_id}</span>
                        <span className="bg-slate-100 text-slate-500 px-1 py-0.2 rounded">{d.type}</span>
                        <span className={`px-1 py-0.2 rounded ${isEvaluated ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                          {d.status === 'EVALUATED' ? '对账完成' : d.status === 'PROPOSED' ? '在审提案' : d.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-950 mt-1">{d.title}</div>
                      <p className="text-slate-500 leading-normal">{d.rationale}</p>
                    </div>

                    <div className="md:w-52 shrink-0 bg-slate-50 p-2 rounded border border-slate-150 font-mono text-[9px] space-y-0.5">
                      <div className="flex justify-between">
                        <span>预期GMV:</span>
                        <span className="text-slate-900">€{d.estimated_gmv_impact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>目前实结:</span>
                        <span className="text-slate-900">{d.actual_gmv_impact !== null ? `€${d.actual_gmv_impact}` : '待计算核结'}</span>
                      </div>
                      <div className="flex justify-between font-sans font-bold border-t border-slate-200 pt-1 mt-1 text-slate-700">
                        <span>当前可信度:</span>
                        <span className="text-emerald-700 font-bold font-mono">{(d.confidence_score*100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
