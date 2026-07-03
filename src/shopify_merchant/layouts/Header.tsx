/**
 * Ultimate Modular Header - Level 10 Layout Segment
 * Pure layout orchestration of Top Search, Sidekick, Help, and Embedded triggers.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, HelpCircle, LayoutGrid, X, Package, Settings as SettingsIcon, Download, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { usePanelStore } from '../stores/panelStore';
import { useProductStore } from '../stores/productStore';
import { useShopStore } from '../stores/shopStore';
import { useLayoutStore } from '../stores/layoutStore';

export default function Header({ onToggleAdminMode }: { onToggleAdminMode?: () => void }) {
  const { selectedPreview, togglePreview, setSelectedPreview } = usePanelStore();
  const { products } = useProductStore();
  const { settings } = useShopStore();
  const { setCurrentTab } = useLayoutStore();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // PWA State variables
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const lowercaseQuery = query.toLowerCase().trim();

  // Search products
  const matchedProducts = lowercaseQuery
    ? products.filter((p) => 
        p.title.toLowerCase().includes(lowercaseQuery) ||
        (p.description && p.description.toLowerCase().includes(lowercaseQuery)) ||
        (p.sku && p.sku.toLowerCase().includes(lowercaseQuery)) ||
        (p.vendor && p.vendor.toLowerCase().includes(lowercaseQuery)) ||
        (p.type && p.type.toLowerCase().includes(lowercaseQuery)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(lowercaseQuery)))
      )
    : [];

  // Search settings options
  const matchedSettings = lowercaseQuery
    ? [
        { label: '店铺名称 (shopName)', value: settings.shopName, actionLabel: '前往基本设置', tabKey: 'settings', keyword: ['名称', '店铺', '名字', 'name', 'shop'] },
        { label: '客服邮箱 (shopEmail)', value: settings.shopEmail, actionLabel: '前往基本设置', tabKey: 'settings', keyword: ['邮箱', 'email', '客服', 'mail'] },
        { label: '结算本币 (currency)', value: `${settings.currency} (${settings.currencySymbol || '€'})`, actionLabel: '前往本币设置', tabKey: 'settings', keyword: ['货币', '本币', '结算', 'currency', 'eur', 'usd', 'cny'] },
        { label: '保价邮资 (shippingStandardRate)', value: `${settings.currencySymbol || '€'}${settings.shippingStandardRate}`, actionLabel: '前往邮资模板', tabKey: 'settings', keyword: ['邮费', '邮资', '保价', 'shipping', 'rate'] },
        { label: '核心税率 (taxRate)', value: `${(settings.taxRate || 0) * 100}%`, actionLabel: '前往基本设置', tabKey: 'settings', keyword: ['税率', '税', 'tax'] },
        { label: '费率方案 (plan)', value: settings.plan, actionLabel: '前往方案明细', tabKey: 'settings', keyword: ['方案', '版本', '月费', '资费', '计费', 'plan'] },
        { label: '系统时区 (timezone)', value: settings.timezone, actionLabel: '前往基本设置', tabKey: 'settings', keyword: ['时区', '时间', 'timezone', 'gmt'] },
        { label: '商户语言 (language)', value: settings.language === 'zh' ? '中文' : settings.language === 'en' ? '英文' : '自适应', actionLabel: '前往语系翻译', tabKey: 'settings', keyword: ['语言', '多语', '翻译', 'zh', 'en', 'language'] }
      ].filter((s) => 
        s.label.toLowerCase().includes(lowercaseQuery) ||
        s.value.toLowerCase().includes(lowercaseQuery) ||
        s.keyword.some((k) => k.toLowerCase().includes(lowercaseQuery))
      )
    : [];

  const hasResults = matchedProducts.length > 0 || matchedSettings.length > 0;

  const handleProductClick = (productId: string) => {
    setCurrentTab('products');
    setSelectedPreview({ type: 'product', id: productId });
    setQuery('');
    setIsOpen(false);
  };

  const handleSettingClick = () => {
    setCurrentTab('settings');
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="h-12 w-full bg-[#1a1a1a] border-b border-neutral-800 px-4 flex items-center justify-between shrink-0 z-25 relative">
      {/* Real-time Dynamic Search Box */}
      <div ref={containerRef} className="relative pr-2 hidden sm:block">
        <Search className="w-3.5 h-3.5 text-neutral-450 absolute left-2.5 top-2.5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="在商号内搜索货品库存、核心配置..."
          className="w-80 bg-neutral-800 text-neutral-200 text-[10px] border border-neutral-700/80 rounded px-2.5 py-1.5 pl-8 pr-7 focus:outline-none focus:ring-1 focus:ring-[#008060] font-sans transition-shadow"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-4 top-2 text-neutral-450 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Search Dropdown Panel */}
        {isOpen && query.trim() !== '' && (
          <div className="absolute top-10 left-0 w-80 max-h-96 overflow-y-auto bg-white border border-neutral-200 rounded-lg shadow-lg z-50 p-2.5 text-[11px] flex flex-col space-y-3">
            
            {hasResults ? (
              <>
                {/* Matching Products */}
                {matchedProducts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-neutral-400 font-bold tracking-wider uppercase border-b border-neutral-100 pb-1 text-[9px]">
                      <Package className="w-3 h-3" />
                      <span>货物库存 ({matchedProducts.length})</span>
                    </div>
                    <div className="space-y-1">
                      {matchedProducts.map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => handleProductClick(p.id)}
                          className="p-2 hover:bg-neutral-50 rounded-md border border-transparent hover:border-neutral-200/50 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-neutral-900 block truncate">{p.title}</span>
                            <span className="text-[9.5px] mt-0.5 text-neutral-400 block pb-0">SKU: {p.sku || '-'} • 厂商: {p.vendor || '-'}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-neutral-950 block">€{p.price}</span>
                            <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-semibold ${
                              p.inventory > 50 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : p.inventory > 10 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-rose-50 text-rose-700'
                            }`}>
                              {p.inventory} 件
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Settings */}
                {matchedSettings.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-neutral-400 font-bold tracking-wider uppercase border-b border-neutral-100 pb-1 text-[9px]">
                      <SettingsIcon className="w-3 h-3" />
                      <span>核心设置 ({matchedSettings.length})</span>
                    </div>
                    <div className="space-y-1">
                      {matchedSettings.map((s, idx) => (
                        <div 
                          key={idx}
                          onClick={handleSettingClick}
                          className="p-2 hover:bg-neutral-50 rounded-md border border-transparent hover:border-neutral-200/50 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-neutral-900 block">{s.label}</span>
                            <span className="text-[9.5px] text-neutral-400 block mt-0.5">{s.actionLabel}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-semibold text-neutral-950 bg-neutral-100 px-1.5 py-0.5 rounded text-[9px] block">
                              {s.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center text-neutral-400 flex flex-col items-center justify-center space-y-1 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                <Search className="w-4 h-4 text-neutral-350" />
                <span className="text-[10px] font-bold tracking-tight">无匹配结果</span>
                <span className="text-[9px] scale-90 opacity-75">尝试搜索 "Wallet" 或 "店铺名称"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic header toggles & profile */}
      <div className="flex items-center space-x-4 text-neutral-300">
        {/* Super Admin Switch Button */}
        <button
          onClick={() => {
            if (onToggleAdminMode) {
              onToggleAdminMode();
            } else if ((window as any).ECOS_TOGGLE_ADMIN_MODE) {
              (window as any).ECOS_TOGGLE_ADMIN_MODE();
            } else {
              window.dispatchEvent(new CustomEvent('ECOS_TOGGLE_ADMIN_MODE_TRIGGER'));
            }
          }}
          className="flex items-center space-x-1.5 py-1 px-2.5 rounded text-[10px] transition-all duration-150 font-bold cursor-pointer bg-[#07C2E3]/15 hover:bg-[#07C2E3]/30 text-[#07C2E3] border border-[#07C2E3]/40 shadow-sm"
          title="切换至平台超级总后台"
        >
          <span className="text-[11px]">🦾</span>
          <span>切到平台总后台</span>
        </button>

        {/* DigiKash Payment Gateway Jump */}
        <a 
          href="https://pay.modaui.com/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 py-1 px-2.5 rounded text-[10px] transition-all duration-150 font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
          title="前往 DigiKash 支付网关管理后台"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-[10px] font-bold">💳 DigiKash</span>
        </a>

        {/* Sidekick Copilot */}
        <button 
          id="sidekick-copilot-btn"
          onClick={() => togglePreview('sidekick')}
          className={`flex items-center space-x-1.5 py-1 px-2.5 rounded text-[10px] transition-all duration-150 font-bold cursor-pointer ${
            selectedPreview?.type === 'sidekick' 
              ? 'bg-[#008060] text-white shadow-sm' 
              : 'hover:bg-neutral-800 text-neutral-300'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${selectedPreview?.type === 'sidekick' ? 'text-emerald-300' : 'text-neutral-400'}`} />
          <span className="text-[10px] font-bold">AI 智能副手</span>
        </button>


      </div>
    </header>
  );
}

