import React, { useState } from "react";
import { FinanceRecord } from "../types";
import { Landmark, ArrowUpRight, ArrowDownRight, Printer, FileText, CheckCircle, Scale, Coins } from "lucide-react";

interface FinancesProps {
  finances: FinanceRecord[];
}

export default function Finances({ finances }: FinancesProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState<FinanceRecord | null>(null);

  // Totals calculations
  const totalIncome = finances.filter(f => f.type === "income" || f.type === "app_purchase" ? f.amount > 0 : false).reduce((acc, f) => acc + f.amount, 0);
  const totalRefund = finances.filter(f => f.type === "refund").reduce((acc, f) => acc + f.amount, 0);
  const totalExpenses = finances.filter(f => f.amount < 0 && f.type !== "refund").reduce((acc, f) => acc + f.amount, 0);
  const netMargin = totalIncome + totalRefund + totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">💰 财务中心 (Finances & Ledger)</h2>
        <p className="text-xs text-gray-500 mt-1">Audit merchant legal invoice sheets, calculate revenue margins, and process commercial payouts.</p>
      </div>

      {/* Aggregate metrics balance strips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Gross Sales Ingest</span>
            <div className="text-xl font-bold text-gray-900">€{totalIncome.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-lg">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Refund Deductions</span>
            <div className="text-xl font-bold text-rose-600">€{totalRefund.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-lg">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Platform & Logistics Expenses</span>
            <div className="text-xl font-bold text-orange-650">€{totalExpenses.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg text-emerald-850">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-500 font-bold block uppercase tracking-wider">SaaS Payout Net Margin</span>
            <div className="text-xl font-bold text-indigo-900">€{netMargin.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Scale className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Ledger List */}
      <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
          <span>Enterprise Transaction ledger (自动记账对账单)</span>
          <span className="text-[10px] text-indigo-600 font-mono">Click row to preview printable merchant invoice</span>
        </div>

        <div className="divide-y divide-gray-100 max-h-160 overflow-y-auto">
          {finances.map(rec => (
            <div
              key={rec.id}
              onClick={() => setShowInvoiceModal(rec)}
              className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    rec.amount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {rec.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{rec.date}</span>
                </div>
                <div className="text-xs font-semibold text-gray-800">{rec.description}</div>
                <div className="text-[9px] text-gray-400 font-mono">Row Index: {rec.id}</div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div className="text-xs font-bold font-mono">
                  {rec.amount > 0 ? "+" : ""}{rec.amount.toFixed(2)} EUR
                </div>
                <div className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {rec.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Invoice Modal overlay printable view */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden p-6 space-y-6">
            
            {/* Invoice Top metadata */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">SaaS Transaction Invoice</h3>
                <span className="text-xs text-gray-400 font-mono">NO: INV-{showInvoiceModal.id.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-indigo-700 block">Medusa ✕ Shopify Platform</span>
                <span className="text-[10px] text-gray-400 block">Date of issue: {showInvoiceModal.date}</span>
              </div>
            </div>

            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-650">
              <div>
                <span className="font-bold text-gray-800 uppercase text-[9px] block">Billed To (Client):</span>
                <p className="mt-1">Alessandro Rossi / Vincenza Bianchi</p>
                <p>Digital Checkout Client Group</p>
                <p className="font-mono">VAT: IT08930218939</p>
              </div>
              <div>
                <span className="font-bold text-gray-800 uppercase text-[9px] block">Issued From (SaaS Merchant):</span>
                <p className="mt-1">Shopify Medusa Enterprise ERP Platform</p>
                <p>Sandboxed Cloud Run Container</p>
                <p className="font-mono">ID: {showInvoiceModal.id}</p>
              </div>
            </div>

            {/* Invoiced items list detail */}
            <div className="border border-gray-150 rounded-lg p-3 space-y-2 bg-gray-50 text-xs">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold border-b border-gray-200 pb-1.5">
                <span>Description / Particulars</span>
                <span>Subtotal (EUR)</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 py-1">
                <span>{showInvoiceModal.description}</span>
                <span className="font-mono">{showInvoiceModal.amount.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Standard Value Added Tax (VAT 22%)</span>
                <span>Included in gross</span>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                  ● BANK LEDGER CLEAR
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Grand Total Amount Paid</span>
                <span className="text-lg font-black text-gray-900 font-mono">{showInvoiceModal.amount.toFixed(2)} EUR</span>
              </div>
            </div>

            {/* Footer action */}
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowInvoiceModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-xs cursor-pointer"
              >
                Close Invoice
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
