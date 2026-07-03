import React, { useState } from "react";
import { Supplier, SupplyOrder, Product } from "../types";
import { Truck, Landmark, Plus, RefreshCw, Star, CircleAlert, CheckCircle } from "lucide-react";

interface SupplyChainProps {
  suppliers: Supplier[];
  supplyOrders: SupplyOrder[];
  products: Product[];
  onSupplyChange: () => void;
}

export default function SupplyChain({ suppliers, supplyOrders, products, onSupplyChange }: SupplyChainProps) {
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [cost, setCost] = useState(12.5);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !selectedSupplier) {
      alert("Please select product SKU and Supplier");
      return;
    }
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch("/api/supply-chain/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          quantity: parseInt(quantity.toString()) || 50,
          cost: parseFloat(cost.toString()) || 10,
          supplierName: selectedSupplier
        })
      });
      const data = await res.json();
      if (data.success) {
        onSupplyChange();
        setSuccess(`Successfully completed procurement! Stock level for SKU [${sku}] increased by ${quantity} units.`);
        // Reset
        setQuantity(100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">🚚 供应链中心 (Supply Chain Center)</h2>
        <p className="text-xs text-gray-500 mt-1">Acquire manufacturing parts, manage delivery records, and clear replenishment invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Supplier Directory list */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 px-1">
            <Truck className="w-4 h-4 text-indigo-500" />
            认证供应商目录 (Supplier Directory)
          </h3>

          <div className="space-y-3">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-900">{sup.name}</span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {sup.rating}
                  </div>
                </div>

                <div className="text-[11px] text-gray-600">
                  <div>Contact: <span className="font-semibold text-gray-800">{sup.contact}</span></div>
                  <div>Phone: <span className="font-semibold font-mono text-gray-700">{sup.phone}</span></div>
                  <div className="truncate">Email: <span className="font-mono text-gray-500">{sup.email}</span></div>
                </div>

                <div className="border-t border-gray-100 pt-2 text-[10px] text-gray-400 flex justify-between">
                  <span>Categories: {sup.productsCount} types</span>
                  <span className="text-indigo-600 font-semibold bg-indigo-50/50 px-1">VERIFIED CORP</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50/50 border border-amber-150 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <CircleAlert className="w-4 h-4 text-amber-500" />
              Procurement Alert thresholds
            </h4>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              When a SKU's stock count falls below 15 units, the Sidekick AI automatically alerts the procurement pool.
            </p>
          </div>
        </div>

        {/* Right column: Action Restock form && History list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Restock Form widget */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-105 pb-3">
              <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin duration-5000" />
              SaaS Procurement Replenishment (供应链补货)
            </h3>

            {success && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-4 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRestockSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">Select product SKU to Restock</label>
                <select
                  value={sku}
                  onChange={e => {
                    setSku(e.target.value);
                    // auto fill cost
                    const targetProd = products.find(p => p.sku === e.target.value);
                    if (targetProd) setCost(targetProd.cost);
                  }}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
                  required
                >
                  <option value="">-- Choose inventory model --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.name} (SKU: {p.sku}, Stock: {p.stock} left)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">Supplier to Procure From</label>
                <select
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
                  required
                >
                  <option value="">-- Choose supplier block --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">Procurement Quantity</label>
                <input
                  type="number"
                  min="5"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 10)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">Material Cost Per Unit (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={e => setCost(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="md:col-span-2 pt-2 text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Processing transaction..." : "Dispatch procurement restock (Debit Balance Booked)"}
                </button>
              </div>
            </form>
          </div>

          {/* Past procurement list */}
          <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Procurements & Replenishments Ledger history
            </div>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {supplyOrders.map(ord => (
                <div key={ord.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{ord.supplierName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{ord.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Procured: {ord.items.map(it => `${it.quantity}x ${it.sku} (at €${it.cost}/ea)`).join(", ")}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-600">-€{ord.total.toFixed(2)}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-teal-50 text-teal-800 uppercase mt-1 inline-block">
                      {ord.status}
                    </span>
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
