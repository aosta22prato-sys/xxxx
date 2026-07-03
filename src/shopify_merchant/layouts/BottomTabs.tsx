/**
 * Bottom Tabs Navigation - Level 10 Layout Component
 * Dedicated purely to mobile bottom tab buttons.
 */

import React from 'react';
import { Home, ShoppingBag, Package, Users, MoreHorizontal } from 'lucide-react';
import { StoreSettings } from '../types';
import { translate } from '../utils/i18n';

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: StoreSettings;
}

export default function BottomTabs({ activeTab, onTabChange, settings }: BottomTabsProps) {
  return (
    <footer className="bg-white border-t border-neutral-200 px-3 py-2.5 flex items-center justify-around shrink-0 z-20">
      {[
        { tab: 'home', icon: Home, label: translate('home', settings) },
        { tab: 'orders', icon: ShoppingBag, label: translate('orders', settings) },
        { tab: 'products', icon: Package, label: translate('products', settings) },
        { tab: 'customers', icon: Users, label: translate('customers', settings) },
        { tab: 'more', icon: MoreHorizontal, label: translate('more', settings) },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`flex flex-col items-center flex-1 py-1 transition-all cursor-pointer ${
              isActive ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
            }`}
          >
            <Icon className="w-4.5 h-4.5 mb-1" />
            <span className="text-[9px] font-medium font-sans uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </footer>
  );
}
