import React from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { MOCK_PRODUCT_SVGS } from '../data/mockData';

interface OrderPanelProps {
  activeOrder: Order;
  handleFulfillOrder: () => void;
  handleRefundOrder: () => void;
}

export default function OrderPanel({
  activeOrder,
  handleFulfillOrder,
  handleRefundOrder,
}: OrderPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e3e3e3] p-4.5 rounded-lg space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm tracking-tight">{activeOrder.name}</span>
          <span className="text-[10px] text-neutral-400 font-mono">
            {new Date(activeOrder.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
            activeOrder.paymentStatus === 'paid' 
              ? 'bg-[#e2ffe9] text-[#125828] border border-[#b2e7bc]' 
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {activeOrder.paymentStatus}
          </span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
            activeOrder.fulfillmentStatus === 'fulfilled' 
              ? 'bg-[#e2ffe9] text-[#125828] border border-[#b2e7bc]' 
              : 'bg-[#fff0e2] text-[#863e00] border border-[#f5cbab]'
          }`}>
            {activeOrder.fulfillmentStatus}
          </span>
        </div>
      </div>

      {/* Buyer info */}
      <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg space-y-2.5">
        <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest">Customer Details</h4>
        <div>
          <p className="font-semibold text-neutral-900">{activeOrder.customerName}</p>
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{activeOrder.customerEmail}</p>
        </div>
        {activeOrder.notes && (
          <div className="bg-neutral-50 p-2.5 border border-neutral-200.5 rounded text-neutral-600 leading-relaxed text-[11px]">
            <strong>Notes:</strong> {activeOrder.notes}
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg space-y-3 shadow-xs">
        <h4 className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest">Ordered Items ({activeOrder.items.length})</h4>
        <div className="divide-y divide-[#f1f1f1]">
          {activeOrder.items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border border-neutral-200 bg-neutral-100 rounded flex items-center justify-center">
                  <div dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[it.image as keyof typeof MOCK_PRODUCT_SVGS || 'wallet'] }} />
                </div>
                <div>
                  <p className="font-medium text-black truncate max-w-[170px]">{it.title}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">Qty: {it.quantity} × €{it.price.toFixed(2)}</span>
                </div>
              </div>
              <span className="font-semibold font-mono">€{(it.quantity * it.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f1f1f1] pt-2 space-y-1.5 text-[11px]">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="font-mono">€{activeOrder.subtotal.toFixed(2)}</span>
          </div>
          {activeOrder.discountAmount && (
            <div className="flex justify-between text-[#125828] font-medium">
              <span>Discount ({activeOrder.discountCode})</span>
              <span className="font-mono">-€{activeOrder.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-500">
            <span>Tax (19% VAT)</span>
            <span className="font-mono">€{activeOrder.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Artisan Shipping</span>
            <span className="font-mono">€{activeOrder.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-[#1a1a1a] text-xs pt-1.5 border-t border-dashed border-[#e3e3e3]">
            <span>Invoice Total</span>
            <span className="font-mono">€{activeOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {activeOrder.fulfillmentStatus === 'unfulfilled' && (
          <button 
            onClick={handleFulfillOrder}
            className="shopify-btn-primary w-full text-center py-2 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Fulfill and Ship Item</span>
          </button>
        )}
        {activeOrder.paymentStatus === 'paid' && (
          <button 
            onClick={handleRefundOrder}
            className="shopify-btn-secondary w-full text-center py-2"
          >
            Process Return Refund
          </button>
        )}
      </div>
    </div>
  );
}
