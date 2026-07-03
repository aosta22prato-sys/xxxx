import React from 'react';
import { useLayoutStore } from '../../stores/layoutStore';
import { useShopStore } from '../../stores/shopStore';
import { 
  Home, ShoppingBag, Receipt, Users, Percent, Settings, X 
} from 'lucide-react';

export default function QuickNav() {
  const { currentTab, setCurrentTab, showQuickNav, toggleQuickNav } = useLayoutStore();
  const { settings } = useShopStore();

  if (!showQuickNav) return null;

  const NAV_ITEMS = [
    { id: 'home', label: '主页', icon: Home },
    { id: 'products', label: '商品', icon: ShoppingBag },
    { id: 'orders', label: '订单流水', icon: Receipt },
    { id: 'customers', label: '客户管理', icon: Users },
    { id: 'discounts', label: '折扣配置', icon: Percent },
    { id: 'settings', label: '基础设置', icon: Settings },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-3xs z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => toggleQuickNav(false)}
    >
      <div 
        className="w-full max-w-xs bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xl flex flex-col p-4 space-y-4 animate-scaleUp select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
          <span className="text-[11px] font-extrabold tracking-wide text-neutral-800 uppercase font-sans">
            快捷目录导航
          </span>
          <button 
            type="button"
            onClick={() => toggleQuickNav(false)}
            className="w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer transition-all active:scale-90"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 选项格子 */}
        <div className="grid grid-cols-2 gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentTab(item.id);
                  toggleQuickNav(false);
                }}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-250 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-white' : 'text-neutral-600'}`} />
                <span className="text-[10px] font-bold leading-tight tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
