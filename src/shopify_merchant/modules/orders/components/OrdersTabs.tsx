import React from 'react';
import { Receipt } from 'lucide-react';

interface OrdersTabsProps {
  orderFilter: string;
  setOrderFilter: (val: any) => void;
  filteredCount: number;
}

export default function OrdersTabs({ orderFilter, setOrderFilter, filteredCount }: OrdersTabsProps) {
  const tabs = [
    { id: 'All', label: '全部订单' },
    { id: 'paid', label: '已清算 (Paid)' },
    { id: 'pending', label: '等待对账 (Pending)' },
    { id: 'unfulfilled', label: '未发货' },
    { id: 'fulfilled', label: '已配送' }
  ];

  return (
    <div className="flex bg-white border border-neutral-200 rounded-lg p-1.5 items-center justify-between shadow-xs select-none">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const active = orderFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setOrderFilter(tab.id)}
              className={`px-3 py-1 font-mono text-[10px] font-bold rounded uppercase transition-colors ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-550 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center space-x-1 font-mono text-[9px] text-neutral-400">
        <Receipt className="w-3 h-3 text-neutral-500" />
        <span>总合同: {filteredCount} 件</span>
      </div>
    </div>
  );
}
