import React from 'react';
import { Box, LayoutGrid, List } from 'lucide-react';

interface ProductsTabsProps {
  productFilter: string;
  setProductFilter: (val: any) => void;
  filteredCount: number;
  viewMode?: 'table' | 'grid';
  setViewMode?: (mode: 'table' | 'grid') => void;
}

export default function ProductsTabs({ 
  productFilter, 
  setProductFilter, 
  filteredCount,
  viewMode = 'grid',
  setViewMode
}: ProductsTabsProps) {
  const tabs = [
    { id: 'All', label: '全部产品' },
    { id: 'active', label: '上架中' },
    { id: 'draft', label: '草稿箱' },
    { id: 'archived', label: '已下架' }
  ];

  return (
    <div className="flex bg-white border border-neutral-200 rounded-lg p-1.5 items-center justify-between shadow-xs select-none">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const active = productFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setProductFilter(tab.id)}
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
      
      <div className="flex items-center space-x-4">
        {/* Toggle View Mode Switcher */}
        {setViewMode && (
          <div className="flex bg-neutral-100 rounded-md p-0.5 border border-neutral-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-neutral-900 shadow-3xs font-bold'
                  : 'text-neutral-455 hover:text-neutral-900'
              }`}
              title="列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-all flex items-center ${
                viewMode === 'grid'
                  ? 'bg-[#008060] text-white shadow-3xs font-bold'
                  : 'text-neutral-455 hover:text-neutral-900'
              }`}
              title="卡片网格"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-1 font-mono text-[9px] text-neutral-400">
          <Box className="w-3 h-3 text-neutral-500" />
          <span>总项: {filteredCount} Pcs</span>
        </div>
      </div>
    </div>
  );
}
