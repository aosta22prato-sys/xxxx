import React, { useEffect, useState } from 'react';
import { useWebhookStore } from '../../stores/webhookStore';
import { webhookSchemaMeta } from '../../schemas/webhook.schema';
import { 
  Terminal, ShieldCheck, Key, Globe, Eye, EyeOff, Plus, Trash2, 
  Send, RefreshCw, Radio, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function WebhookView() {
  const { 
    apiKeys, webhooks, logs, hydrate, addApiKey, deleteApiKey, 
    addWebhook, updateWebhookStatus, deleteWebhook, triggerWebhookSimulation 
  } = useWebhookStore();

  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'logs'>('keys');
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'all_write' | 'read_only'>('all_write');

  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newTopic, setNewTopic] = useState<'orders/create' | 'products/update' | 'customers/redact' | 'carts/update'>('orders/create');
  const [newUrl, setNewUrl] = useState('');
  const [newFormat, setNewFormat] = useState<'json' | 'xml'>('json');

  const [revealSecrets, setRevealSecrets] = useState<Record<string, boolean>>({});
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [lastSimulatorResult, setLastSimulatorResult] = useState<any>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const keySuffix = Math.random().toString(16).substring(2, 6);
    const freshKey = {
      id: 'key_' + Date.now(),
      name: newKeyName,
      keyPrefix: 'shpat_live_' + keySuffix,
      secretMask: `shpat_live_${keySuffix}_••••••••••••••••••••` + Math.random().toString(16).substring(2, 6),
      scope: newKeyScope,
      status: 'active' as const,
      createdAt: new Date().toISOString()
    };

    addApiKey(freshKey);
    setNewKeyName('');
    setShowAddKey(false);
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const freshWebhook = {
      id: 'wh_' + Date.now(),
      topic: newTopic,
      addressUrl: newUrl,
      format: newFormat,
      signingSecret: 'whsec_' + Math.random().toString(16).substring(2, 14),
      status: 'active' as const,
      createdAt: new Date().toISOString()
    };

    addWebhook(freshWebhook);
    setNewUrl('');
    setShowAddWebhook(false);
  };

  const handleToggleSecret = (id: string) => {
    setRevealSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTriggerMock = (whId: string) => {
    setSimulatingId(whId);
    setLastSimulatorResult(null);
    setTimeout(() => {
      try {
        const freshLog = triggerWebhookSimulation(whId);
        setLastSimulatorResult(freshLog);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setSimulatingId(null);
      }
    }, 800);
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">接口网钩</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">开放平台</h2>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-lg space-x-1 font-sans">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1 rounded text-xs transition-all cursor-pointer ${activeTab === 'keys' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'}`}
          >
            访问令牌
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3 py-1 rounded text-xs transition-all cursor-pointer ${activeTab === 'webhooks' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'}`}
          >
            订阅列表
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1 rounded text-xs transition-all cursor-pointer ${activeTab === 'logs' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'}`}
          >
            递送日志
          </button>
        </div>
      </div>

      {/* ACCESS TOKENS TAB PANEL */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-bold">令牌列表 ({apiKeys.length})</span>
            <button
              onClick={() => setShowAddKey(!showAddKey)}
              className="bg-black text-white hover:bg-neutral-800 font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>生成密钥</span>
            </button>
          </div>

          {showAddKey && (
            <form onSubmit={handleCreateKey} className="bg-neutral-50 border p-3.5 rounded-lg space-y-3.5 animate-slideDown max-w-md">
              <span className="font-bold text-neutral-800">生成授权密钥</span>
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-neutral-500">密钥名称 *</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g. ERP读取权限"
                  className="border rounded px-2.5 py-1.5 bg-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-neutral-500">授予权限</label>
                <select
                  value={newKeyScope}
                  onChange={e => setNewKeyScope(e.target.value as any)}
                  className="border rounded px-2 py-1.5 bg-white text-xs focus:outline-none text-neutral-700 font-sans"
                >
                  <option value="all_write">所有权限</option>
                  <option value="read_only">只读权限</option>
                </select>
              </div>
              <div className="flex space-x-2 pt-1.5">
                <button type="submit" className="bg-neutral-900 text-white font-bold px-3.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer">
                  确认生成
                </button>
                <button type="button" onClick={() => setShowAddKey(false)} className="border font-bold px-3.5 py-1.5 rounded-lg hover:bg-neutral-100">取消</button>
              </div>
            </form>
          )}

          <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-neutral-50 border-b text-[10px] text-neutral-400">
                  <th className="p-3">名称</th>
                  <th className="p-3">令牌前缀</th>
                  <th className="p-3">授予权限</th>
                  <th className="p-3">状态</th>
                  <th className="p-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {apiKeys.map(k => (
                  <tr key={k.id} className="hover:bg-neutral-50/50 transition-all font-mono">
                    <td className="p-3 font-bold text-neutral-900 font-sans">{k.name}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2 bg-neutral-50 p-1 px-2 rounded border w-fit">
                        <span>{revealSecrets[k.id] ? k.secretMask.replace(/•/g, 'x') : k.secretMask}</span>
                        <button onClick={() => handleToggleSecret(k.id)} className="text-neutral-400 hover:text-black cursor-pointer">
                          {revealSecrets[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="neutral">{k.scope === 'all_write' ? '读写' : '只读'}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="success">已启</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => deleteApiKey(k.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WEBHOOKS CHANNELS TAB PANEL */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-bold">网钩配置 ({webhooks.length})</span>
            <button
              onClick={() => setShowAddWebhook(!showAddWebhook)}
              className="bg-black text-white hover:bg-neutral-800 font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加网钩</span>
            </button>
          </div>

          {showAddWebhook && (
            <form onSubmit={handleCreateWebhook} className="bg-neutral-50 border p-3.5 rounded-lg space-y-3.5 animate-slideDown max-w-lg">
              <span className="font-bold text-neutral-800">新增网钩配接</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-500">触发事件 *</label>
                  <select
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value as any)}
                    className="border rounded p-1.5 bg-white text-xs focus:outline-none font-sans"
                  >
                    <option value="orders/create">orders/create (订单创建)</option>
                    <option value="products/update">products/update (货品变动)</option>
                    <option value="customers/redact">customers/redact (客户验证)</option>
                    <option value="carts/update">carts/update (购物车更新)</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-500">格式类型</label>
                  <select
                    value={newFormat}
                    onChange={e => setNewFormat(e.target.value as any)}
                    className="border rounded p-1.5 bg-white text-xs focus:outline-none text-neutral-700"
                  >
                    <option value="json">JSON 字符串</option>
                    <option value="xml">XML 格式节点</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-neutral-500">接收端 URL *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://api.yourcloud.com/sync"
                  className="border rounded px-2.5 py-1.5 bg-white text-xs focus:outline-none"
                />
              </div>
              <div className="flex space-x-2 pt-1.5">
                <button type="submit" className="bg-neutral-900 text-white font-bold px-3.5 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer">
                  保存网钩
                </button>
                <button type="button" onClick={() => setShowAddWebhook(false)} className="border font-bold px-3.5 py-1.5 rounded-lg hover:bg-neutral-100">取消</button>
              </div>
            </form>
          )}

          {/* Webhook listings & Interactive simulators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webhooks.map(w => (
              <div key={w.id} className="bg-white border rounded-lg p-3.5 space-y-3.5 hover:shadow-xs transition-shadow relative">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-neutral-900">{w.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={w.status === 'active' ? 'success' : 'neutral'}>
                      {w.status === 'active' ? '启用' : '暂停'}
                    </Badge>
                    <select
                      value={w.status}
                      onChange={e => updateWebhookStatus(w.id, e.target.value as any)}
                      className="border rounded text-[10px] p-0.5 bg-neutral-50 outline-none"
                    >
                      <option value="active">启用</option>
                      <option value="paused">暂停</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px] text-neutral-600">
                  <div className="truncate">URL: <span className="font-bold text-neutral-800">{w.addressUrl}</span></div>
                  <div>协议: <span className="text-neutral-800 font-bold uppercase">{w.format}</span></div>
                  <div className="truncate">密钥: <span className="bg-neutral-50 rounded p-0.5 px-1 border">{w.signingSecret}</span></div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <button
                    onClick={() => deleteWebhook(w.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center space-x-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>删除</span>
                  </button>

                  <button
                    onClick={() => handleTriggerMock(w.id)}
                    disabled={simulatingId === w.id}
                    className="bg-neutral-950 hover:bg-black disabled:bg-neutral-200 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <Send className={`w-3 h-3 ${simulatingId === w.id ? 'animate-bounce' : 'text-emerald-400'}`} />
                    <span>{simulatingId === w.id ? '发送中...' : '网钩测试'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated response log box */}
          {lastSimulatorResult && (
            <div className="bg-neutral-950 text-neutral-400 border border-neutral-800 p-3.5 rounded-xl text-xs space-y-2 animate-slideDown">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                <Terminal className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>测试结果</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-200">
                <div>事件: <span className="text-emerald-400 font-bold">{lastSimulatorResult.topic}</span></div>
                <div>状态: <span className="text-emerald-400 font-bold">{lastSimulatorResult.statusCode} OK</span></div>
                <div>体积: <span className="text-indigo-400 font-bold">{lastSimulatorResult.payloadSize}</span></div>
                <div>延迟: <span className="text-indigo-400 font-bold">{lastSimulatorResult.responseTimeMs}ms</span></div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* AUDIT LOGS TIMELINES TAB PANEL */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400 font-bold">发送历史 ({logs.length})</span>
            <span className="text-neutral-400 text-xs">安全留存最高 50 条纪录</span>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden text-neutral-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 border-b text-[10px]">
                  <th className="p-3">日志编号</th>
                  <th className="p-3">具体事件</th>
                  <th className="p-3">网络状态</th>
                  <th className="p-3">体积</th>
                  <th className="p-3">响应耗时</th>
                  <th className="p-3 text-right">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3 text-neutral-400">{log.id}</td>
                    <td className="p-3 text-indigo-600 font-bold">{log.topic}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center space-x-1 font-bold ${log.statusCode === 200 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {log.statusCode === 200 ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{log.statusCode}</span>
                      </span>
                    </td>
                    <td className="p-3">{log.payloadSize}</td>
                    <td className="p-3 text-neutral-500">{log.responseTimeMs} ms</td>
                    <td className="p-3 text-right text-neutral-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
