import React from 'react';
import { Plus } from 'lucide-react';
import { useLayoutStore } from '../../../stores/layoutStore';

interface OrdersHeaderProps {
  onAddClick: () => void;
}

export default function OrdersHeader({ onAddClick }: OrdersHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 pb-3">
      <div>
        <span 
          onClick={() => useLayoutStore.getState().toggleQuickNav(true)}
          className="text-[10px] font-sans tracking-widest text-[#888] font-bold cursor-pointer hover:text-neutral-900 transition-all inline-block select-none"
        >
          货单履约 ➔
        </span>
        <h2 
          onClick={() => useLayoutStore.getState().toggleQuickNav(true)}
          className="text-sm font-bold tracking-tight text-[#111] font-sans cursor-pointer hover:text-neutral-900 transition-all select-none"
        >
          订单流水 ➔
        </h2>
      </div>
      <button
        onClick={onAddClick}
        className="bg-neutral-900 hover:bg-black text-white hover:shadow-xs text-xs px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>新建</span>
      </button>
    </div>
  );
}
