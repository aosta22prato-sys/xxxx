import React from 'react';
import { Tag } from 'lucide-react';

interface DiscountsSummaryBarProps {
  totalCount: number;
}

export default function DiscountsSummaryBar({ totalCount }: DiscountsSummaryBarProps) {
  return (
    <div className="flex bg-white border border-neutral-200 rounded-lg p-2.5 items-center justify-between shadow-xs select-none">
      <span className="text-xs text-neutral-500 font-bold flex items-center space-x-1">
        <Tag className="w-3.5 h-3.5 text-neutral-600 mr-1" />
        <span>策略列表</span>
      </span>
      <div className="flex items-center space-x-1 font-mono text-xs text-neutral-400">
        <span>类型: {totalCount} 款</span>
      </div>
    </div>
  );
}
