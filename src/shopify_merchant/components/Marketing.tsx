import React, { useState } from "react";
import { MarketingCampaign, MarketingAutomation, DiscountCode } from "../types";
import { Megaphone, RefreshCw, Plus, CheckCircle, Ticket, Compass, ArrowUpRight, Zap, Ban } from "lucide-react";

interface MarketingProps {
  campaigns: MarketingCampaign[];
  automations: MarketingAutomation[];
  discountCodes: DiscountCode[];
  onMarketingChange: () => void;
}

export default function Marketing({ campaigns, automations, discountCodes, onMarketingChange }: MarketingProps) {
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(15);
  const [minPurchase, setMinPurchase] = useState(50);
  const [useLimit, setUseLimit] = useState(500);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      alert("Please specify a code name");
      return;
    }
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch("/api/sconti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type, value, minPurchase, useLimit })
      });
      const data = await res.json();
      if (data.success) {
        onMarketingChange();
        setSuccess(`Promotional coupon code [${code.toUpperCase()}] successfully populated to DB!`);
        setShowCodeForm(false);
        setCode("");
      } else {
        alert(data.message || "Could not publish promo code");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📣 营销中心 (Marketing & Promos)</h2>
          <p className="text-xs text-gray-500 mt-1">Configure automated postcheckout workflows, track digital search campaigns, or issue commercial codes.</p>
        </div>

        <button
          onClick={() => {
            setShowCodeForm(!showCodeForm);
            setSuccess("");
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showCodeForm ? "取消发布" : "生成优惠礼品券 (Deploy Promo Code)"}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Code creation form */}
      {showCodeForm && (
        <form onSubmit={handleCreatePromo} className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-indigo-500" />
              SaaS Discount Creator (发布优惠码)
            </h3>
            <span className="text-[10px] text-gray-400">STATEFUL COMPILING</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Promotional Code Word</label>
              <input
                type="text"
                placeholder="e.g. FLASH25"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500 font-mono font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Deduction Method</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Deduction (€)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Deduction Value</label>
              <input
                type="number"
                value={value}
                onChange={e => setValue(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Minimum Order Purchase (€)</label>
              <input
                type="number"
                value={minPurchase}
                onChange={e => setMinPurchase(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Total Maximum Use Count limit</label>
              <input
                type="number"
                value={useLimit}
                onChange={e => setUseLimit(parseInt(e.target.value) || 100)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Confirm and Deploy coupon
            </button>
          </div>
        </form>
      )}

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ad Campaigns metrics list (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 px-1">
            <Compass className="w-4 h-4 text-indigo-500" />
            营销渠道指标 (Active Campaign Metrics)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(camp => {
              const roi = camp.spend > 0 ? (camp.sales / camp.spend).toFixed(1) : "N/A";
              return (
                <div key={camp.id} className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        camp.type === "social" ? "bg-indigo-50 text-indigo-800" : "bg-emerald-50 text-emerald-800"
                      }`}>
                        {camp.type} channel
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 mt-1.5">{camp.name}</h4>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded flex items-center gap-0.5">
                      ACTIVE <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Total conversions</span>
                      <span className="text-sm font-bold text-gray-800">{camp.conversions} conversions</span>
                    </div>
                    <div className="text-center border-l border-gray-100 pl-2">
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Spend budget</span>
                      <span className="text-sm font-bold text-gray-800">€{camp.spend} / €{camp.budget || "∞"}</span>
                    </div>
                    <div className="text-center border-l border-gray-100 pl-2">
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">ROI ratio</span>
                      <span className="text-sm font-black text-indigo-650">{roi}x return</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/10 p-2 border border-indigo-100/50 rounded flex justify-between text-xs text-gray-700">
                    <span>Gross Generated Sales:</span>
                    <span className="font-bold">€{camp.sales.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Automations card panel */}
          <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              <span>SaaS Checkout Marketing Automations Trigger Flows</span>
              <span className="text-[10px] text-indigo-600 font-mono">2 active triggers</span>
            </div>

            <div className="divide-y divide-gray-100">
              {automations.map(aut => (
                <div key={aut.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-bold text-gray-900">{aut.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Trigger Event: <span className="font-mono text-gray-700">{aut.triggerEvent}</span> (Delay: {aut.delayHours} hour)
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-700">Sent: {aut.sentCount} customers</div>
                      <div className="text-[10px] text-gray-400">Open rate: {aut.openRate}%</div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 uppercase">
                      ENABLED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Promo database grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 px-1">
            <Ticket className="w-4 h-4 text-indigo-500" />
            已配置防伪优惠码 (Active Discount Codes)
          </h3>

          <div className="space-y-3 max-h-132 overflow-y-auto pr-1">
            {discountCodes.map(dc => (
              <div key={dc.id} className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs space-y-2 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-black text-sm text-gray-900 tracking-wider bg-gray-105 border border-gray-200 px-2.5 py-0.5 rounded">
                      {dc.code}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-2">
                      Rules: Min ord: €{dc.minPurchase}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600 block">
                      {dc.type === "percentage" ? `-${dc.value}%` : `-€${dc.value}`}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-1">
                      Limit: {dc.useCount} / {dc.useLimit}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Expires: {dc.endDate}</span>
                  <span className={`font-bold uppercase ${dc.status === "active" ? "text-emerald-600" : "text-gray-400"}`}>
                    ● {dc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
