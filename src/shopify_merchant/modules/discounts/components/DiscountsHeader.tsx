import React from 'react';
import { Plus } from 'lucide-react';
import { useLayoutStore } from '../../../stores/layoutStore';

interface DiscountsHeaderProps {
  onAddClick: () => void;
}

export default function DiscountsHeader({ onAddClick }: DiscountsHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-0.5 pt-0.5 select-none">
      <div>
        <h1 
          onClick={() => useLayoutStore.getState().toggleQuickNav(true)}
          className="text-[20px] font-extrabold tracking-tight text-neutral-900 font-sans cursor-pointer hover:opacity-85 active:scale-98 transition-all inline-block"
        >
          折扣 ➔
        </h1>
        <p className="text-[10px] font-medium text-neutral-400 mt-0.5 font-sans">
          管理你的营销卡券
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="bg-neutral-900 hover:bg-black text-white hover:shadow-xs text-xs px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
      >
        <Plus className="w-3 h-3 text-white" />
        <span>新建</span>
      </button>
    </div>
  );
}
