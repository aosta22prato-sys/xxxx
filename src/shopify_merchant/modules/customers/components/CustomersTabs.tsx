import React from 'react';
import { Users2 } from 'lucide-react';

interface CustomersTabsProps {
  customerFilter: string;
  setCustomerFilter: (val: any) => void;
  filteredCount: number;
}

export default function CustomersTabs({ customerFilter, setCustomerFilter, filteredCount }: CustomersTabsProps) {
  const tabs = [
    { id: 'All', label: '全部' },
    { id: 'VIP', label: 'VIP' },
    { id: 'Returning', label: '老客户' },
    { id: 'B2B', label: '企业' }
  ];

  return (
    <div className="flex bg-white border border-neutral-200 rounded-lg p-1.5 items-center justify-between shadow-xs select-none">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const active = customerFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCustomerFilter(tab.id)}
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
        <Users2 className="w-3 h-3 text-neutral-500" />
        <span>建档人数: {filteredCount} 名</span>
      </div>
    </div>
  );
}
