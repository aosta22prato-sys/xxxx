import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Discount } from '../types';

interface DiscountPanelProps {
  activeDiscount: Discount;
  handleToggleDiscountStatus: () => void;
}

export default function DiscountPanel({
  activeDiscount,
  handleToggleDiscountStatus,
}: DiscountPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e3e3e3] p-4.5 rounded-lg space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <span className="px-2 py-1 bg-neutral-100 font-mono font-bold text-sm text-[#1a1a1a] border border-neutral-400 rounded uppercase">
            {activeDiscount.code}
          </span>
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold font-mono uppercase ${
            activeDiscount.status === 'active' 
              ? 'bg-[#e2ffe9] text-[#125828] border border-[#b2e7bc]' 
              : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
          }`}>
            {activeDiscount.status}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 text-base">{activeDiscount.valueText}</h3>
          <p className="text-[10px] text-[#616161] font-mono mt-0.5 uppercase tracking-wide">Promotion type: {activeDiscount.type}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border border-[#e3e3e3] p-3.5 rounded-lg space-y-2.5 shadow-xs">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">COUPON ENGAGEMENT</h4>
        <div className="flex justify-between items-center py-1">
          <span className="text-[#616161]">Total times Redeemed:</span>
          <strong className="font-mono text-base">{activeDiscount.usageCount} times</strong>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-neutral-100">
          <span className="text-[#616161]">Requires Minimum:</span>
          <span className="font-mono">{activeDiscount.minRequirement || 'No Minimum Required'}</span>
        </div>
      </div>

      {/* Campaign Action */}
      <button 
        onClick={handleToggleDiscountStatus}
        className="shopify-btn-primary w-full py-2.5 flex items-center justify-center space-x-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>{activeDiscount.status === 'active' ? 'Deactivate Discount' : 'Reactivate Promo Code'}</span>
      </button>
    </div>
  );
}
