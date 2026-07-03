import React, { useState } from "react";
import { DevApp, DevLog } from "../types";
import { 
  Code, Plus, RotateCcw, Shield, Check, Flame, ChevronRight, 
  Terminal, Network, ShieldCheck, Play, HelpCircle, Save, 
  Settings, Key, Layers, ArrowRight, ShieldAlert, BookOpen, AlertCircle
} from "lucide-react";

interface DeveloperHubProps {
  devApps: DevApp[];
  devLogs: DevLog[];
  onDevChange: () => void;
}

export default function DeveloperHub({ devApps, devLogs, onDevChange }: DeveloperHubProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [descr, setDescr] = useState("");
  const [redirect, setRedirect] = useState("");
  const [webhook, setWebhook] = useState("");

  const [activeDebugApp, setActiveDebugApp] = useState<DevApp | null>(null);
  const [secrVisible, setSecrVisible] = useState<{ [key: string]: boolean }>({});
  
  // Custom Webhook Management states
  const [editingWebhookAppId, setEditingWebhookAppId] = useState<string | null>(null);
  const [editingWebhookUrl, setEditingWebhookUrl] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["order.placed", "product.created"]);

  // OAuth SSO Simulation Wizard states
  const [ssoAppId, setSsoAppId] = useState("");
  const [ssoDomain, setSsoDomain] = useState("alessandro-design-italy.myshopify.com");
  const [ssoScopes, setSsoScopes] = useState<string[]>(["read_products", "read_orders", "write_discounts"]);
  const [oauthStep, setOauthStep] = useState<"choose" | "confirm" | "complete">("choose");
  const [issuedToken, setIssuedToken] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  // Guide Toggle state
  const [showDevGuide, setShowDevGuide] = useState(true);

  const availableWebhookEvents = [
    { key: "order.placed", label: "order.placed (订单创建排产)" },
    { key: "order.refunded", label: "order.refunded (订单退款补偿)" },
    { key: "product.created", label: "product.created (商品铺架更新)" },
    { key: "supply.received", label: "supply.received (大货采购入库)" },
    { key: "discount.created", label: "discount.created (促销码分发)" }
  ];

  const handleCreateDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("请填写应用代号");
      return;
    }
    try {
      const res = await fetch("/api/developer/app/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          description: descr, 
          redirectUri: redirect || "http://localhost:3000/oauth/callback", 
          webhookUrl: webhook || "https://httpbin.org/post" 
        })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        setName("");
        setDescr("");
        setRedirect("");
        setWebhook("");
        setShowCreateForm(false);
        alert("开发者沙箱应用成功构建！");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Sandbox vs Production keys
  const toggleEnvironment = async (app: DevApp) => {
    const nextStatus = app.status === "sandbox" ? "production" : "sandbox";
    if (!window.confirm(`确认将应用切换到 [${nextStatus === "production" ? "生产环境 (Production)" : "沙箱调试 (Sandbox)"}] 吗？`)) return;
    
    try {
      const res = await fetch("/api/developer/app/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: app.id,
          status: nextStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        alert(`凭证环境已换切至: ${nextStatus.toUpperCase()}。请刷新重连对接网关。`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update dynamic Webhook registries
  const handleUpdateWebhook = async (appId: string) => {
    if (!editingWebhookUrl) {
      alert("Webhook 接收地址不能为空");
      return;
    }
    try {
      const res = await fetch("/api/developer/app/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          webhookUrl: editingWebhookUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        setEditingWebhookAppId(null);
        alert("Webhook 监听网关和事件包成功更新！");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish to Store review process (pending)
  const handlePublish = async (appId: string) => {
    if (!window.confirm("确认将此沙箱程序提交至官方应用中心审核？上架后公网店铺均能检索激活该模块。")) return;
    try {
      const res = await fetch("/api/developer/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        alert("提交评审成功！该应用已以 [草稿/Pending] 状态推至应用市场。请切换至‘超级管理员’或‘运营管理员’角色，在应用市场的上架审核中心内点击‘批准’以完成最终部署。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Active testing pings triggering automated custom payloads
  const testWebhookTrigger = async (appId: string, customEvent: string) => {
    try {
      const res = await fetch("/api/developer/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, eventName: customEvent })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        alert(`已向此应用推送了事件 [${customEvent}] 的 mock 报文。请查阅右侧 API Webhook 审计日志！`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Execute SSO Single Sign-On and Access Handshake OAuth
  const handleSimulateOAuth = async () => {
    if (!ssoAppId) {
      alert("请选择要授权的注册应用");
      return;
    }
    setOauthLoading(true);
    try {
      const res = await fetch("/api/developer/oauth/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: ssoAppId,
          scopeList: ssoScopes,
          merchantDomain: ssoDomain
        })
      });
      const data = await res.json();
      if (data.success) {
        onDevChange();
        setIssuedToken(data.accessToken);
        setOauthStep("complete");
        alert("单点免密登录 (SSO OAuth-SaaS) 握手成功！");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">💻 开放平台与开发者中心 (SaaS Developer Partner Center)</h2>
          <p className="text-xs text-gray-500 mt-1">
            注册外部独立应用，配置 API 路由，自定义 Webhook 监听范围，模拟商户免密 SSO 握手或正式打包上架。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDevGuide(!showDevGuide)}
            className="px-3 py-2 bg-white hover:bg-gray-150 border border-gray-250 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            {showDevGuide ? "隐藏接入指南" : "查看 API 文档"}
          </button>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? "收起面板" : "注册外部应用 (Register)"}
          </button>
        </div>
      </div>

      {/* Embedded Developer SDK Guide & API Documentation */}
      {showDevGuide && (
        <div className="bg-slate-900 rounded-2xl p-6 text-gray-200 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              SaaS B2B & Core REST API 开发者文档 (Platform SDK)
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono font-bold px-2.5 py-0.5 rounded-full">
              Sovereign API v2.4.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed">
            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800/50">
              <span className="font-bold text-gray-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                1. 单点登录与 OAuth2 集成
              </span>
              <p className="text-gray-400">
                平台支持标准的 <code>OAuth2</code> 协议握手。企业级插件可通过重定向回调流程向本 ERP 请求受限数据读取范围，凭证将生成安全的非对称 <code>JWT Bearer Token</code> 用于每次请求验签。
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800/50">
              <span className="font-bold text-gray-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                2. 事件触发式 Webhook 机制
              </span>
              <p className="text-gray-400">
                当系统发生核心变化（如：<code>order.placed</code>、<code>supply.received</code>）时，内建基于 Kafka Event Broker 的推送机制将以标准 JSON 结构实时派送给下方配置的端点，重试上限可达5次。
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800/50">
              <span className="font-bold text-gray-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                3. 沙箱测试 vs 正式上架
              </span>
              <p className="text-gray-400">
                新建应用自带 <code>Sandbox</code> 沙箱隔离密钥。联调完成后点击“上架”推至应用市场审批。管理员可在上架后发表评级反馈，保障商户体验。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deploy App Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateDev} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-505" />
              注册外部拓展应用插件 / REST 订阅者
            </h3>
            <span className="text-[9px] text-amber-800 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg uppercase">
              Sandbox Setup Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">拓展程序代号 (App Name)</label>
              <input
                type="text"
                placeholder="例如: 智能海运物流直配专家"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg focus:outline-indigo-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">OAuth2 登录回调地址 (Redirect URL)</label>
              <input
                type="url"
                placeholder="https://mycorp.com/oauth/callback"
                value={redirect}
                onChange={e => setRedirect(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg focus:outline-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Webhook 物流报文推送地址 (Delivery URL)</label>
              <input
                type="url"
                placeholder="https://api.mycorp.com/dispatched-webhooks"
                value={webhook}
                onChange={e => setWebhook(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg focus:outline-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">简短介绍描述 (Summary description)</label>
              <input
                type="text"
                placeholder="例如: 一键在 Medusa 直接订舱，同步提单至海运中台核心链路..."
                value={descr}
                onChange={e => setDescr(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="text-right border-t border-gray-100 pt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              一键创建安全沙箱应用
            </button>
          </div>
        </form>
      )}

      {/* Main operational panel layouts split into lists/simulation configs and dynamic logs terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sandbox applications listing (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Sandbox Application List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <Network className="w-4 h-4 text-indigo-500" />
              我的开发者应用清单 (SaaS Workspace Registry)
            </h3>

            {devApps.length === 0 ? (
              <div className="bg-white border border-gray-150 p-8 rounded-xl text-center text-xs text-gray-400">
                您尚未创建过外部应用资质。点击右上角“注册外部应用”即可启用！
              </div>
            ) : (
              <div className="space-y-4">
                {devApps.map(app => {
                  const isSecVisible = secrVisible[app.id] || false;
                  const isEditingWebhook = editingWebhookAppId === app.id;
                  
                  return (
                    <div key={app.id} className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs space-y-4">
                      
                      {/* Name, descriptions and Env badge */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-gray-900">{app.name}</h4>
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-mono font-bold px-1.5 rounded">
                              {app.version}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1">{app.description}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleEnvironment(app)}
                            className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border cursor-pointer transition-all ${
                              app.status === "sandbox"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                            title="点击切换运行密钥环境"
                          >
                            {app.status} Mode (Toggle)
                          </button>
                        </div>
                      </div>

                      {/* Credentials Block (ClientID / Secrets) */}
                      <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 space-y-2.5 text-xs text-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">REST Client ID</span>
                          <span className="font-mono font-bold text-gray-800 bg-white border border-gray-200 px-1.5 rounded">{app.clientId}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">REST Client Secret</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-800 font-semibold">
                              {isSecVisible ? app.clientSecret : "••••••••••••••••••••••••••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSecrVisible({ ...secrVisible, [app.id]: !isSecVisible })}
                              className="text-[10px] text-indigo-600 hover:underline cursor-pointer font-bold"
                            >
                              {isSecVisible ? "隐藏" : "显示密钥"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Webhook Configuration Editor */}
                      <div className="border border-indigo-50 bg-indigo-50/20 p-3.5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-indigo-900 font-bold flex items-center gap-1 uppercase tracking-wide">
                            <Settings className="w-3.5 h-3.5 text-indigo-500" />
                            API Webhook 路由监控端口 (Gateway Endpoint)
                          </span>
                          {!isEditingWebhook ? (
                            <button
                              onClick={() => {
                                setEditingWebhookAppId(app.id);
                                setEditingWebhookUrl(app.webhookUrl);
                              }}
                              className="text-[10px] text-indigo-700 font-extrabold hover:underline cursor-pointer"
                            >
                              配置端点
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingWebhookAppId(null)}
                                className="text-[10px] text-gray-500 font-bold hover:underline cursor-pointer"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleUpdateWebhook(app.id)}
                                className="text-[10px] text-indigo-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <Save className="w-3 h-3" /> 保存
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingWebhook ? (
                          <div className="space-y-2">
                            <input
                              type="url"
                              value={editingWebhookUrl}
                              onChange={e => setEditingWebhookUrl(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-indigo-200 rounded-lg focus:outline-indigo-500 font-mono"
                              required
                            />
                            
                            {/* Scope Event checkboxes */}
                            <div className="space-y-1 pt-1">
                              <span className="text-[9px] text-gray-400 font-bold uppercase block">注册特定事件通道:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {availableWebhookEvents.map(evt => (
                                  <label key={evt.key} className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={selectedScopes.includes(evt.key)}
                                      onChange={() => {
                                        setSelectedScopes(prev => 
                                          prev.includes(evt.key) ? prev.filter(x => x !== evt.key) : [...prev, evt.key]
                                        );
                                      }}
                                      className="rounded text-indigo-600 focus:ring-0" 
                                    />
                                    {evt.key}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-gray-600 space-y-1">
                            <div className="font-mono">
                              端点: <span className="font-bold text-gray-800">{app.webhookUrl || "None"}</span>
                            </div>
                            <div className="text-[10px] text-indigo-700 font-semibold">
                              监听事件范围: [{selectedScopes.join(", ")}]
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Webhook simulated firing pings & certify request row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                        {/* Event list selection */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">模拟推送:</span>
                          <div className="flex gap-1">
                            {selectedScopes.map(sc => (
                              <button
                                key={sc}
                                onClick={() => testWebhookTrigger(app.id, sc)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 font-semibold text-[10px] text-gray-600 rounded-md cursor-pointer transition-colors"
                              >
                                发送 {sc}
                              </button>
                            ))}
                          </div>
                        </div>

                        {app.status === "sandbox" && (
                          <button
                            onClick={() => handlePublish(app.id)}
                            className="px-3.5 py-1.5 text-[10px] bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            提交上架审核
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: OAuth SSO Connection Simulation Gateway wizard */}
          {devApps.length > 0 && (
            <div className="bg-white border border-indigo-150 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                SaaS SDK Single Sign-On 模拟网关 (OAuth SSO Handshake Suite)
              </h3>

              {oauthStep === "choose" && (
                <div className="space-y-4">
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    此功能模拟商户在第三方插件中点击 “连接到 Shopify / Medusa ERP” 产生的标准三方 SSO 鉴权回调机制。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block">选择目标对接应用 (Target App)</label>
                      <select
                        value={ssoAppId}
                        onChange={e => setSsoAppId(e.target.value)}
                        className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold"
                      >
                        <option value="">-- 选择开发完成的应用 --</option>
                        {devApps.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block">目标商户店铺域名 (Merchant domain)</label>
                      <input
                        type="text"
                        value={ssoDomain}
                        onChange={e => setSsoDomain(e.target.value)}
                        className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-gray-500 block">授权读取范围 (Requested Scopes):</span>
                    <div className="flex flex-wrap gap-2">
                      {["read_products", "read_orders", "write_discounts", "read_customers", "read_inventory"].map(scp => (
                        <button
                          key={scp}
                          type="button"
                          onClick={() => {
                            setSsoScopes(prev => 
                              prev.includes(scp) ? prev.filter(x => x !== scp) : [...prev, scp]
                            );
                          }}
                          className={`px-2 py-1 rounded-md text-[9px] font-bold border cursor-pointer ${
                            ssoScopes.includes(scp)
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-white text-gray-400 border-gray-200"
                          }`}
                        >
                          {scp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!ssoAppId) {
                        alert("请先选择开发应用");
                        return;
                      }
                      setOauthStep("confirm");
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    下一步: 触发 SSO 授权协商 (Trigger Handshake)
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {oauthStep === "confirm" && (
                <div className="bg-slate-55 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-900">模拟商户端授权征询 (Consent Screen)</h4>
                      <p className="text-[10px] text-indigo-700">店铺 {ssoDomain} 正在请求连接应用权限：</p>
                    </div>
                  </div>

                  <div className="bg-white border border-indigo-150 p-3 rounded-lg text-[11px] text-gray-700 space-y-1.5">
                    <div className="font-semibold text-gray-800">该应用申请访问以下模块:</div>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                      {ssoScopes.map(sc => (
                        <li key={sc} className="font-mono">
                          {sc} (授予权限)
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 justify-end pt-2">
                    <button
                      onClick={() => setOauthStep("choose")}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                    >
                      取销
                    </button>
                    <button
                      onClick={handleSimulateOAuth}
                      disabled={oauthLoading}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                    >
                      {oauthLoading ? "SSO授权中..." : "授权并下发 JWT Bearer Token"}
                    </button>
                  </div>
                </div>
              )}

              {oauthStep === "complete" && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3.5 text-emerald-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">握手成功！密钥已存入分析日志</h4>
                      <p className="text-[10px] text-emerald-700">Access grant verified with signature validation payload.</p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-150 p-3 rounded-lg text-[10px] font-mono text-gray-800 break-all select-all space-y-1">
                    <span className="text-[9px] text-gray-400 font-sans block font-bold uppercase">JWT Bearer Access Token:</span>
                    {issuedToken}
                  </div>

                  <button
                    onClick={() => {
                      setOauthStep("choose");
                      setIssuedToken("");
                    }}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold block ml-auto transition-colors cursor-pointer"
                  >
                    重置鉴权并重新联调
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Diagnostic logs terminals (1 col) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <Terminal className="w-4 h-4 text-indigo-500 font-semibold" />
            API & Webhook 审计日志中心
          </h3>

          <div className="bg-gray-900 text-gray-100 rounded-2xl p-4 shadow-xl space-y-3 max-h-132 overflow-y-auto border border-gray-800">
            {devLogs.length > 0 ? (
              devLogs.map((log, lidx) => (
                <div key={log.id || lidx} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-400 font-mono">
                      {log.type === "oauth_sso_handshake" ? "🔑 SSO_OAUTH" : "📡 WEBHOOK_REQ"}
                    </span>
                    <span className="text-gray-500 font-mono text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-emerald-400 font-bold bg-emerald-950 px-1 rounded">STATUS 200 OK</span>
                    <span className="text-gray-400">延时: {log.durationMs}ms</span>
                  </div>

                  <pre className="font-mono text-[9px] bg-black/40 p-2.5 rounded text-indigo-200 overflow-x-auto leading-relaxed whitespace-pre font-semibold">
                    {log.payload}
                  </pre>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 leading-relaxed font-sans">
                自动化诊断监测器已就绪。<br />点击左侧 “发送” 模拟 Webhook 核心报文或触发 SSO Handshake，此处将实时展示序列化后的 B2B 签名包。
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
