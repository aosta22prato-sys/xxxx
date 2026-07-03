import React, { useState } from "react";
import { AppMarketItem, AppReview } from "../types";
import { 
  DownloadCloud, Check, HelpCircle, Star, Filter, ShieldAlert, Key, 
  Globe, EyeOff, RotateCcw, ThumbsUp, Send, Settings, ShieldCheck, 
  Trash2, Layers, AlertCircle, Sparkles, MessageSquare, Info
} from "lucide-react";

interface AppMarketProps {
  appMarket: AppMarketItem[];
  currentUserRole: string;
  currentUserName: string;
  onAppChange: () => void;
}

export default function AppMarket({ appMarket, currentUserRole, currentUserName, onAppChange }: AppMarketProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [installStatusFilter, setInstallStatusFilter] = useState<"all" | "installed" | "uninstalled">("all");
  const [upgradingAppId, setUpgradingAppId] = useState<string | null>(null);
  
  // App Details slide-over / Modal states
  const [selectedApp, setSelectedApp] = useState<AppMarketItem | null>(null);
  
  // Add Review form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const categories = [
    { key: "all", label: "全部 (All)" },
    { key: "Analytics & Statistics", label: "数据分析" },
    { key: "Store Architecture & Sync", label: "多渠道同步" },
    { key: "AI Marketing & Conversion", label: "AI智能化" },
    { key: "Customers & Customer Service", label: "智慧客服" }
  ];

  // List only approved apps for standard view, but allow pending apps to be displayed in an admin auditing panel
  const standardApps = appMarket.filter(app => {
    const matchesCat = activeCategory === "all" || app.category === activeCategory;
    const matchesInstall = 
      installStatusFilter === "all" ? true :
      installStatusFilter === "installed" ? app.isInstalled : !app.isInstalled;
    
    return app.status === "approved" && matchesCat && matchesInstall;
  });

  const pendingApps = appMarket.filter(app => app.status === "pending");

  const handleInstall = async (appId: string) => {
    try {
      const res = await fetch("/api/apps/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId })
      });
      const data = await res.json();
      if (data.success) {
        onAppChange();
        if (selectedApp?.id === appId) {
          setSelectedApp(prev => prev ? { ...prev, isInstalled: true, licenseKey: data.app.licenseKey } : null);
        }
        alert(`应用成功激活！已配置云端高安全企业 License 授权 Key。`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUninstall = async (appId: string) => {
    if (!window.confirm("确定卸载此应用吗？其对应的 SaaS 数据同步及 API 服务将立即禁用。")) return;
    try {
      const res = await fetch("/api/apps/uninstall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId })
      });
      const data = await res.json();
      if (data.success) {
        onAppChange();
        if (selectedApp?.id === appId) {
          setSelectedApp(prev => prev ? { ...prev, isInstalled: false, licenseKey: undefined } : null);
        }
        alert("应用卸载完毕，实例已剔除集群。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgrade = (appId: string) => {
    setUpgradingAppId(appId);
    setTimeout(() => {
      setUpgradingAppId(null);
      alert("集群热升级成功！热更新已完成在 v2.4.0 主节点。");
    }, 1500);
  };

  // Submit dynamic rating review
  const handleAddReview = async (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("请填写评价内容");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/apps/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          userName: currentUserName || "商户管理员",
          rating: newRating,
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        onAppChange();
        // Update local modal state
        setSelectedApp(data.app);
        setNewComment("");
        setNewRating(5);
        alert("评价成功发表！感谢反馈，评分已同步大盘算力。");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Admin audit approvals
  const handleAudit = async (appId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/apps/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, approveOrder: action })
      });
      const data = await res.json();
      if (data.success) {
        onAppChange();
        alert(action === "approve" ? "外部开发者应用审核通过！已上线应用市场公网发布。" : "应用已被打回/注销。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdminOrOperator = currentUserRole === "admin" || currentUserRole === "operator";

  return (
    <div className="space-y-6">
      
      {/* Upper header summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🔌 应用中心市场 (SaaS Add-on Marketplace)</h2>
          <p className="text-xs text-gray-500 mt-1">
            扩展一键发货、ClickHouse 数据高算力同步、多渠道 Shopify ERP 联动及 specialized AI Agent 伴侣。
          </p>
        </div>

        {/* Short filtering state switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-150">
          <button
            onClick={() => setInstallStatusFilter("all")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              installStatusFilter === "all" ? "bg-indigo-50 text-indigo-700" : "text-gray-550 hover:bg-gray-50"
            }`}
          >
            全部插件
          </button>
          <button
            onClick={() => setInstallStatusFilter("installed")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              installStatusFilter === "installed" ? "bg-indigo-50 text-indigo-700" : "text-gray-550 hover:bg-gray-50"
            }`}
          >
            已安装 ({appMarket.filter(a => a.isInstalled).length})
          </button>
          <button
            onClick={() => setInstallStatusFilter("uninstalled")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              installStatusFilter === "uninstalled" ? "bg-indigo-50 text-indigo-700" : "text-gray-550 hover:bg-gray-50"
            }`}
          >
            未激活
          </button>
        </div>
      </div>

      {/* Category Tabs row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest shrink-0 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          分类过滤:
        </span>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border cursor-pointer ${
              activeCategory === cat.key
                ? "bg-indigo-650 text-white border-indigo-650 shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-150"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Admin exclusive: Pending audit app developer listings */}
      {isAdminOrOperator && pendingApps.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200/70 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            开发者应用上架评审中心 (Super Admin Approval Queues)
          </h3>
          <p className="text-[11px] text-amber-700">
            以下为由本地开发者注册，测试资质完整，发布至应用市场的沙箱应用。通过审核后，所有商户均可即时访问并安装。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApps.map(app => (
              <div key={app.id} className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                <div className="flex gap-3">
                  <span className="text-3xl bg-amber-50 border border-amber-100 rounded-lg h-12 w-12 flex items-center justify-center shrink-0">
                    🔌
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{app.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Developer App ID: {app.id}</p>
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{app.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Awaiting Review
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAudit(app.id, "reject")}
                      className="px-2.5 py-1 text-[10px] bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded cursor-pointer"
                    >
                      不予通过
                    </button>
                    <button
                      onClick={() => handleAudit(app.id, "approve")}
                      className="px-3 py-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      批准上架 (Approve)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Standard Approved apps grid */}
      {standardApps.length === 0 ? (
        <div className="bg-white border border-gray-150 p-12 text-center rounded-2xl text-gray-400 text-xs">
          没有满足当前过滤选择的上架插件应用。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardApps.map(app => (
            <div 
              key={app.id} 
              className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              
              {/* Card Main Info layout */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl bg-gray-50 border border-gray-100 rounded-xl h-14 w-14 flex items-center justify-center shrink-0">
                    {app.logo}
                  </span>
                  {app.isInstalled && (
                    <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      已安装
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {app.name}
                    </h4>
                    <span className="text-[9px] bg-gray-100 text-gray-500 font-mono font-bold px-1 rounded ml-2">
                      {app.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <span>Developer: {app.developer}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-500 font-bold gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {app.rating}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed min-h-8">
                  {app.description}
                </p>
              </div>

              {/* Bottom operational and pricing links bar */}
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-gray-400 font-bold block uppercase">许可价格 (Price)</span>
                  <span className="text-xs font-black text-gray-900">
                    {app.price > 0 ? `€${app.price.toFixed(2)}/月` : "免费激活"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setNewComment("");
                      setNewRating(5);
                    }}
                    className="px-2.5 py-1.5 text-[10px] bg-white border border-gray-250 hover:bg-gray-100 text-gray-700 font-bold rounded-lg transition-all cursor-pointer"
                  >
                    查看详情
                  </button>

                  {app.isInstalled ? (
                    <button
                      onClick={() => handleUninstall(app.id)}
                      className="px-2.5 py-1.5 text-[10px] bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      卸载
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInstall(app.id)}
                      className="px-3 py-1.5 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      安装
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* App Details slide-over background modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Header portion */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-start justify-between">
              <div className="flex gap-4">
                <span className="text-5xl bg-white border border-gray-200 rounded-xl h-16 w-16 shadow-xs flex items-center justify-center">
                  {selectedApp.logo}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-gray-900">{selectedApp.name}</h3>
                    <span className="text-[10px] bg-indigo-55 px-2 py-0.2 rounded font-mono font-extrabold bg-indigo-100 text-indigo-800">
                      Version {selectedApp.version}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-semibold">
                    Developer Partner: {selectedApp.developer}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {selectedApp.rating} ({selectedApp.reviews.length} 评价)
                    </span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                      {selectedApp.price > 0 ? `€${selectedApp.price.toFixed(2)}/月` : "永久免费"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                ✕ 关闭
              </button>
            </div>

            {/* Scrollable content partition */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Product Specifications and Details block */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <Info className="w-4 h-4 text-indigo-500" />
                  独立插件介绍 (App Specifications)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed pt-1.5">
                  {selectedApp.description}
                </p>
              </div>

              {/* Verified License panel */}
              {selectedApp.isInstalled && (
                <div className="bg-indigo-50 border border-indigo-200/50 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-indigo-950">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block flex items-center gap-1">
                      <Key className="w-4 h-4 text-indigo-600" />
                      SaaS Active License Authorized
                    </span>
                    <p className="text-[11px] text-indigo-700">
                      This token grants secure API syncing privileges between CRM webhooks and backend workers.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-extrabold bg-indigo-100 px-3 py-1 rounded text-indigo-900 border border-indigo-200 select-all">
                    {selectedApp.licenseKey || "LICENSE_KEY_INJECTED"}
                  </span>
                </div>
              )}

              {/* Reviews & Feedback segment */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  商户评价列表 ({selectedApp.reviews.length})
                </h4>

                {selectedApp.reviews.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    暂无商户评价。欢迎您安装此插件，测试后留下首份运营回馈。
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedApp.reviews.map(rev => (
                      <div key={rev.id} className="bg-gray-50/50 border border-gray-150 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-800">{rev.userName}</span>
                          <span className="text-gray-400 font-mono font-normal text-[10px]">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-650 leading-relaxed font-sans">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add feedback rating form */}
              {selectedApp.isInstalled && (
                <form onSubmit={(e) => handleAddReview(e, selectedApp.id)} className="bg-white border border-gray-150 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[11px] font-bold text-gray-800">发表商户评价 (Leave a Review)</span>
                    <span className="text-[10px] text-gray-400">已授权实名证书评定</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-[11px] font-semibold text-gray-600 shrink-0">点击评分 (Rating):</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(starIdx => (
                        <button
                          key={starIdx}
                          type="button"
                          onClick={() => setNewRating(starIdx)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              starIdx <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      placeholder="请客观描述对接顺畅度、API 同步速率或客服AI的实用水平..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-indigo-500 focus:bg-white min-h-16 resize-none"
                      required
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submittingReview ? "正在发表..." : "提交运营反馈"}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Modal footer controls */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-mono font-bold">
                Licensed to Medusa Node Client
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={selectedApp.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-[11px] bg-white border border-gray-250 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  访问开发管网
                </a>

                {selectedApp.isInstalled ? (
                  <>
                    <button
                      onClick={() => handleUpgrade(selectedApp.id)}
                      disabled={upgradingAppId === selectedApp.id}
                      className="px-3 py-1.5 text-[11px] bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 font-bold rounded-lg cursor-pointer"
                    >
                      {upgradingAppId === selectedApp.id ? "正在升级..." : "热升级"}
                    </button>
                    <button
                      onClick={() => handleUninstall(selectedApp.id)}
                      className="px-3 py-1.5 text-[11px] bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold rounded-lg cursor-pointer"
                    >
                      卸载应用
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInstall(selectedApp.id)}
                    className="px-5 py-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    立即安装
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
