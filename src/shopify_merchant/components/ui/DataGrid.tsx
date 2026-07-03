/**
 * Dynamic DataGrid - Level 10 Dynamic Component Segment
 * Formulates high-fidelity lists and tables from schema column definitions automatically.
 * Supports sorting, responsive alignments, live filtering, and detail drawers.
 */

import React, { useState, useMemo } from 'react';
import { SchemaColumnMeta } from '../../schemas';
import { Search, ArrowUpDown, ChevronDown, RefreshCw, BarChart } from 'lucide-react';
import { Badge } from './Badge';

interface DataGridProps {
  columns: SchemaColumnMeta[];
  records: any[];
  searchPlaceholder?: string;
  onRowClick?: (record: any) => void;
  currencySymbol?: string;
  defaultSortKey?: string;
}

export default function DataGrid({
  columns,
  records,
  searchPlaceholder = '对当前列表进行对账搜索...',
  onRowClick,
  currencySymbol = '€',
  defaultSortKey
}: DataGridProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>(defaultSortKey || columns[0]?.key || '');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Cross-column high-fidelity filter helper
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matcher = query.toLowerCase();
      if (!matcher) return true;
      
      return Object.keys(rec).some((k) => {
        const val = rec[k];
        if (val === null || val === undefined) return false;
        
        // Deep search within item lists if needed
        if (Array.isArray(val)) {
          return val.some(item => String(item).toLowerCase().includes(matcher));
        }
        if (typeof val === 'object') {
          return Object.values(val).join(' ').toLowerCase().includes(matcher);
        }
        return String(val).toLowerCase().includes(matcher);
      });
    });
  }, [records, query]);

  // Sorting Routine
  const sortedRecords = useMemo(() => {
    if (!sortKey) return filteredRecords;

    const sorted = [...filteredRecords];
    sorted.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      // Handle strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      // Handle numbers/booleans
      return sortAsc ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1);
    });

    return sorted;
  }, [filteredRecords, sortKey, sortAsc]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const renderCellContent = (record: any, col: SchemaColumnMeta) => {
    const val = record[col.key];

    if (val === undefined || val === null) {
      return <span className="text-neutral-300">-</span>;
    }

    switch (col.type) {
      case 'badge':
        const badgeColors: Record<string, 'success' | 'warning' | 'error' | 'indigo' | 'neutral'> = {
          active: 'success',
          paid: 'success',
          fulfilled: 'success',
          cleared: 'success',
          published: 'success',
          improved: 'success',
          
          pending: 'warning',
          draft: 'warning',
          scheduled: 'warning',
          unfulfilled: 'warning',
          
          refunded: 'neutral',
          expired: 'neutral',
          archived: 'neutral',
          paused: 'neutral'
        };
        const variant = badgeColors[String(val).toLowerCase()] || 'neutral';
        return <Badge variant={variant}>{String(val).toUpperCase()}</Badge>;

      case 'currency':
        return <span className="font-mono font-bold text-neutral-900">{currencySymbol}{Number(val).toFixed(2)}</span>;

      case 'date':
        return <span className="font-mono text-[10px] text-neutral-500">{new Date(val).toLocaleDateString()}</span>;

      case 'number':
        return <span className="font-mono font-semibold text-neutral-800">{val}</span>;

      default:
        return <span className="text-neutral-700">{String(val)}</span>;
    }
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Search and control bar */}
      <div className="flex items-center justify-between gap-2 select-none">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-neutral-200/80 rounded-2xl px-2.5 py-2.5 pl-10 text-xs focus:ring-1 focus:ring-black focus:outline-none font-sans"
          />
        </div>
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-neutral-400 shrink-0 bg-white border border-neutral-200/80 rounded-2xl px-3 py-2.5">
          <BarChart className="w-3 h-3 text-neutral-500" />
          <span>匹配: {sortedRecords.length}/{records.length}</span>
        </div>
      </div>

      {/* Responsive View - Mobile/Iframe Cards Stack vs Desktop Table */}
      {sortedRecords.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center space-y-2 shadow-3xs">
          <span className="text-3xl">🗂️</span>
          <p className="text-xs font-mono text-neutral-400 uppercase">没有检索到匹配的数据项 (STANDBY_EMPTY_STATE)</p>
        </div>
      ) : (
        <>
          {/* Mobile/Iframe Cards View (md:hidden) */}
          <div className="md:hidden space-y-2.5">
            {sortedRecords.map((record, recIdx) => {
              const firstCol = columns[0];
              const otherCols = columns.slice(1);
              const badgeCol = otherCols.find(c => c.type === 'badge');
              const displayCols = otherCols.filter(c => c.type !== 'badge');

              return (
                <div 
                  key={record.id || recIdx}
                  onClick={() => onRowClick && onRowClick(record)}
                  className="bg-white border border-neutral-200/85 rounded-lg p-3.5 hover:shadow-2xs active:scale-99 transition-all cursor-pointer flex flex-col gap-2.5 relative group shadow-3xs"
                >
                  <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                    <div className="font-extrabold text-neutral-900 text-xs flex items-center space-x-1">
                      {renderCellContent(record, firstCol)}
                    </div>
                    {badgeCol && (
                      <div>
                        {renderCellContent(record, badgeCol)}
                      </div>
                    )}
                  </div>
                  
                  {/* Secondary Grid Details */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-neutral-500 font-sans">
                    {displayCols.slice(0, 4).map((col) => (
                      <div key={col.key} className="flex flex-col">
                        <span className="text-[8px] text-neutral-400 uppercase font-mono tracking-tight font-bold">{col.label}</span>
                        <span className="font-semibold text-neutral-800 mt-0.5 truncate">{renderCellContent(record, col)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom Line Controls */}
                  <div className="border-t border-neutral-50 pt-2 flex items-center justify-between text-[8.5px] text-neutral-400 font-mono">
                    <span>标识: #{String(record.id).substring(0, 10)}</span>
                    <span className="text-neutral-500 font-bold hover:text-black">点击详情 →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] layout-fixed">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-200 font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                    {columns.map((col) => (
                      <th key={col.key} className="p-3">
                        {col.sortable ? (
                          <button
                            onClick={() => toggleSort(col.key)}
                            className="flex items-center space-x-1 font-bold tracking-wider uppercase text-neutral-400 hover:text-black transition-colors"
                          >
                            <span>{col.label}</span>
                            <ArrowUpDown className="w-2.5 h-2.5 text-neutral-400 hover:text-black" />
                          </button>
                        ) : (
                          <span className="font-bold tracking-wider uppercase">{col.label}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee]">
                  {sortedRecords.map((record, index) => (
                    <tr
                      key={record.id || index}
                      onClick={() => onRowClick && onRowClick(record)}
                      className="hover:bg-neutral-50/70 transition-colors cursor-pointer"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="p-3 align-middle">
                          {renderCellContent(record, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
