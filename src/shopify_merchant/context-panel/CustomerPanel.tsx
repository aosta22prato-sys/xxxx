import React from 'react';
import { Customer } from '../types';

interface CustomerPanelProps {
  activeCustomer: Customer;
  handleNotesChange: (notes: string) => void;
}

export default function CustomerPanel({
  activeCustomer,
  handleNotesChange,
}: CustomerPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg flex items-center space-x-3 shadow-xs">
        <div className="w-10 h-10 rounded bg-[#1a1a1a] text-white text-xs font-bold flex items-center justify-center font-mono uppercase">
          {activeCustomer.firstName.substring(0,1)}{activeCustomer.lastName.substring(0,1)}
        </div>
        <div>
          <h3 className="font-bold text-neutral-900 text-sm">{activeCustomer.firstName} {activeCustomer.lastName}</h3>
          <p className="text-[10px] text-neutral-400 font-mono italic">{activeCustomer.email}</p>
        </div>
      </div>

      {/* Retail metrics */}
      <div className="bg-white border border-[#e3e3e3] p-3.5 rounded-lg space-y-2.5">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">RETAIL METRICS</h4>
        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="bg-neutral-50 border border-neutral-200.5 p-2 rounded">
            <span className="text-[10px] text-[#616161]">Total spent</span>
            <p className="font-bold mt-1 text-sm">€{activeCustomer.totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200.5 p-2 rounded">
            <span className="text-[10px] text-[#616161]">Sessions</span>
            <p className="font-bold mt-1 text-sm">{activeCustomer.ordersCount} sessions</p>
          </div>
        </div>
      </div>

      {/* Profile Annotations */}
      <div className="bg-white border border-[#e3e3e3] p-3.5 rounded-lg space-y-2.5">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">INTERNAL ACCOUNT NOTES</h4>
        <textarea
          rows={4}
          defaultValue={activeCustomer.notes || `No custom staff annotations yet. Assigned segment group: ${activeCustomer.segment}`}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="w-full bg-[#f8f8f8] text-[11px] leading-relaxed border border-neutral-300 rounded p-2 text-black focus:outline-none focus:ring-1 focus:ring-black pr-1"
        />
        <p className="text-[9px] text-neutral-400">Notes auto save locally upon modification.</p>
      </div>
    </div>
  );
}
