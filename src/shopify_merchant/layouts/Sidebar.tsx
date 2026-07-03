/**
 * Ultimate Modular Sidebar - Level 10 Layout Segment
 * Pure layout orchestration of Left-most collapsible domain rail.
 */

import React, { useState } from 'react';
import { 
  Home, ShoppingBag, Package, Users, Megaphone, Percent, 
  FileText, Globe, Coins, BarChart3, Monitor, Store, Bot, Settings, 
  ChevronDown, ChevronRight, Plus, Check, PanelLeftClose, PanelLeft, LayoutGrid, CreditCard,
  MessageSquare, Gift, Truck, Sparkles, AppWindow
} from 'lucide-react';
import { StoreSettings } from '../types';
import { translate } from '../utils/i18n';
import { useAppsteroStore } from '../stores/appsteroStore';

const appIcons: Record<string, any> = {
  Coins: Coins,
  MessageSquare: MessageSquare,
  Gift: Gift,
  Truck: Truck,
  Sparkles: Sparkles
};

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  settings: StoreSettings;
  onOpenSettings: () => void;
}

export default function Sidebar({ currentTab, onSelectTab, settings, onOpenSettings }: SidebarProps) {
  const { apps } = useAppsteroStore();
  const installedApps = apps.filter(app => app.isInstalled);
  
  // Collapse state for screen adaptions
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Store switcher controls
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [mockStores, setMockStores] = useState<string[]>([
    'Atelier Noir Store',
    'Paris Showroom Outlet',
    'Tokyo Flagship Boutique',
    'West Logistics Center'
  ]);
  const [selectedStore, setSelectedStore] = useState<string>('Atelier Noir Store');

  // Sub menu accordion flags
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    orders: true,
    products: true,
    customers: false,
    marketing: false,
    content: false,
    financials: false,
    analytics: false,
  });

  const toggleSubMenu = (menuKey: string) => {
    setOpenSubMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleStoreChange = (storeName: string) => {
    setSelectedStore(storeName);
    setStoreDropdownOpen(false);
  };

  const handleCreateNewStore = () => {
    const freshName = prompt("Enter Name of the custom new Store atelier:", "Milano Galleria");
    if (freshName) {
      setMockStores(prev => [...prev, `${freshName} Outlet`]);
      setSelectedStore(`${freshName} Outlet`);
    }
    setStoreDropdownOpen(false);
  };

  const getMenuClass = (tabId: string) => {
    const isActive = currentTab === tabId;
    if (isCollapsed) {
      return `flex items-center justify-center p-2 rounded-lg transition-all duration-150 relative group cursor-pointer ${
        isActive 
          ? 'bg-[#1a1a1a] text-white shadow-xs scale-98' 
          : 'text-neutral-600 hover:bg-[#ebebeb] hover:text-neutral-900'
      }`;
    }
    return `flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all duration-150 group cursor-pointer ${
      isActive 
        ? 'bg-[#1a1a1a] text-white font-semibold shadow-xs' 
        : 'text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 font-medium'
    }`;
  };

  const getSubMenuClass = (tabId: string) => {
    const isActive = currentTab === tabId;
    return `flex items-center justify-between w-full pl-8 pr-3 py-1.5 text-[11px] transition-all duration-150 cursor-pointer border-l-2 ${
      isActive 
        ? 'bg-[#e6f2ee] text-[#008060] font-bold border-[#008060]' 
        : 'text-neutral-600 hover:bg-[#ebebeb]/50 hover:text-neutral-900 border-transparent'
    }`;
  };

  return (
    <aside 
      className={`hidden md:flex h-full flex-col bg-[#f6f6f7] select-none text-neutral-850 z-20 font-sans transition-all duration-300 border-r border-[#e3e3e3] ${
        isCollapsed ? 'w-16' : 'w-[220px]'
      }`}
    >
      {/* STORE SWITCHER ACCORDION */}
      <div className="relative p-3.5 border-b border-[#e3e3e3] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left max-w-[150px]">
            <div className="w-7 h-7 rounded bg-[#1a1a1a] text-white font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
              {selectedStore.substring(0, 1)}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="text-xs font-bold leading-tight line-clamp-1 text-neutral-900">{selectedStore}</h2>
                <span className="text-[9px] text-[#008060] font-semibold block">{translate('merchant_suffix', settings)}</span>
              </div>
            )}
          </div>

          <button 
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-neutral-200/80 rounded text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand side menu" : "Collapse side menu"}
          >
            {isCollapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
        
        {/* HOME VIEW */}
        <button
          onClick={() => onSelectTab('home')}
          className={getMenuClass('home')}
        >
          <div className="flex items-center space-x-3">
            <Home className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('home', settings)}</span>}
          </div>
          {isCollapsed && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {translate('home', settings)}
            </div>
          )}
        </button>

        {/* ORDERS GROUPS */}
        <button
          onClick={() => onSelectTab('orders')}
          className={getMenuClass('orders')}
        >
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('orders', settings)}</span>}
          </div>
          {isCollapsed && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {translate('orders', settings)}
            </div>
          )}
        </button>

        {/* PRODUCTS GROUP */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('products')} 
              className={getMenuClass('products')}
            >
              <Package className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('products', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('products')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab.includes('product') || currentTab === 'inventory' || currentTab === 'collections' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{translate('products', settings)}</span>
                </div>
                {openSubMenus.products ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.products && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('products')} className={getSubMenuClass('products')}>
                    <span>{translate('product_catalog', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('inventory')} className={getSubMenuClass('inventory')}>
                    <span>{translate('inventory', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('collections')} className={getSubMenuClass('collections')}>
                    <span>{translate('collections', settings)}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CUSTOMERS GROUP */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('customers')} 
              className={getMenuClass('customers')}
            >
              <Users className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('customers', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('customers')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab === 'customers' || currentTab === 'segments' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-3.5 h-3.5 text-neutral-550" />
                  <span>{translate('customers', settings)}</span>
                </div>
                {openSubMenus.customers ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.customers && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('customers')} className={getSubMenuClass('customers')}>
                    <span>{translate('customers_list', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('segments')} className={getSubMenuClass('segments')}>
                    <span>{translate('segments', settings)}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MARKETING CORNER */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('marketing')} 
              className={getMenuClass('marketing')}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('marketing', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('marketing')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab === 'marketing' || currentTab === 'automations' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Megaphone className="w-3.5 h-3.5 text-neutral-550" />
                  <span>{translate('marketing', settings)}</span>
                </div>
                {openSubMenus.marketing ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.marketing && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('marketing')} className={getSubMenuClass('marketing')}>
                    <span>{translate('campaigns', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('automations')} className={getSubMenuClass('automations')}>
                    <span>{translate('automations', settings)}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DISCOUNTS */}
        <button
          onClick={() => onSelectTab('discounts')}
          className={getMenuClass('discounts')}
        >
          <div className="flex items-center space-x-3">
            <Percent className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('discounts', settings)}</span>}
          </div>
          {isCollapsed && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {translate('discounts', settings)}
            </div>
          )}
        </button>

        {/* CONTENT CORNER */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('content')} 
              className={getMenuClass('content')}
            >
              <FileText className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('content', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('content')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab === 'content' || currentTab === 'files' || currentTab === 'pages' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{translate('content', settings)}</span>
                </div>
                {openSubMenus.content ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.content && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('files')} className={getSubMenuClass('files')}>
                    <span>{translate('asset_files', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('pages')} className={getSubMenuClass('pages')}>
                    <span>{translate('static_pages', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('seo')} className={getSubMenuClass('seo')}>
                    <span>搜索优化</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MARKETS */}
        <button
          onClick={() => onSelectTab('markets')}
          className={getMenuClass('markets')}
        >
          <div className="flex items-center space-x-3">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('markets', settings)}</span>}
          </div>
          {isCollapsed && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {translate('markets', settings)}
            </div>
          )}
        </button>

        {/* FINANCIALS PANEL */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('financials')} 
              className={getMenuClass('financials')}
            >
              <Coins className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('financials', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('financials')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab === 'financials' || currentTab === 'payouts' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Coins className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{translate('financials', settings)}</span>
                </div>
                {openSubMenus.financials ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.financials && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('financials')} className={getSubMenuClass('financials')}>
                    <span>{translate('overview_stats', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('payouts')} className={getSubMenuClass('payouts')}>
                    <span>{translate('atelier_capital', settings)}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ANALYTICS PANEL */}
        <div>
          {isCollapsed ? (
            <button 
              onClick={() => onSelectTab('analytics')} 
              className={getMenuClass('analytics')}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {translate('analytics', settings)}
              </div>
            </button>
          ) : (
            <div>
              <button
                onClick={() => toggleSubMenu('analytics')}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-900 cursor-pointer ${
                  currentTab === 'analytics' || currentTab === 'analytics-overview' || currentTab === 'analytics-reports' ? 'text-neutral-905 font-bold bg-[#ebebeb]/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{translate('analytics', settings)}</span>
                </div>
                {openSubMenus.analytics ? <ChevronDown className="w-3.5 h-3.5 text-neutral-450" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-450" />}
              </button>
              {openSubMenus.analytics && (
                <div className="mt-1 space-y-0.5 border-l border-neutral-200 ml-5.5">
                  <button onClick={() => onSelectTab('analytics')} className={getSubMenuClass('analytics')}>
                    <span>{translate('trends', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('analytics-reports')} className={getSubMenuClass('analytics-reports')}>
                    <span>{translate('reports_list', settings)}</span>
                  </button>
                  <button onClick={() => onSelectTab('shopifyql')} className={getSubMenuClass('shopifyql')}>
                    <span>数据查询</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CHANNELS HUB */}
        <div className="pt-4 pb-1.5 px-3">
          {isCollapsed ? <div className="h-[1px] bg-neutral-200" /> : <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-neutral-450">{translate('sales_channels', settings)}</span>}
        </div>

        <button
          onClick={() => onSelectTab('web-shop')}
          className={getMenuClass('web-shop')}
        >
          <div className="flex items-center space-x-3">
            <Monitor className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('online_store', settings)}</span>}
          </div>
        </button>

        <button
          onClick={() => onSelectTab('pos-setup')}
          className={getMenuClass('pos-setup')}
        >
          <div className="flex items-center space-x-3">
            <Store className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs">{translate('pos_sales', settings)}</span>}
          </div>
        </button>



        <button
          onClick={() => onSelectTab('appstero')}
          className={getMenuClass('appstero')}
        >
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-3.5 h-3.5 text-[#008060] shrink-0" />
            {!isCollapsed && (
              <span className="flex items-center font-semibold text-xs text-neutral-800">
                应用生态
                <span className="ml-1.5 px-1 py-0.2 bg-[#008060] text-white text-[8px] rounded font-mono font-bold uppercase">插件</span>
              </span>
            )}
          </div>
          {isCollapsed && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              应用生态
            </div>
          )}
        </button>

        {/* EMBEDDEDS */}
        <div className="pt-4 pb-1.5 px-3">
          {isCollapsed ? <div className="h-[1px] bg-neutral-200" /> : <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#008060]">{translate('embedded_apps', settings)}</span>}
        </div>

        {/* Dynamic Appstero Installed Apps */}
        {installedApps.map((app) => {
          const IconComp = appIcons[app.iconName] || AppWindow;
          return (
            <button
              key={app.id}
              onClick={() => onSelectTab(`app-${app.id}`)}
              className={getMenuClass(`app-${app.id}`)}
            >
              <div className="flex items-center space-x-3">
                <IconComp className="w-3.5 h-3.5 text-[#008060] shrink-0" />
                {!isCollapsed && (
                  <span className="font-semibold text-xs text-neutral-800 truncate max-w-[130px]" title={app.name}>
                    {app.name}
                  </span>
                )}
              </div>
              {isCollapsed && (
                <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {app.name}
                </div>
              )}
            </button>
          );
        })}

        <button
          onClick={() => onSelectTab('app-embed')}
          className={getMenuClass('app-embed')}
        >
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs text-neutral-700">接口网钩</span>}
          </div>
        </button>

        <button
          onClick={() => onSelectTab('checkout')}
          className={getMenuClass('checkout')}
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="w-3.5 h-3.5 text-neutral-550 shrink-0" />
            {!isCollapsed && <span className="font-medium text-xs text-neutral-700">结账优化</span>}
          </div>
        </button>

      </nav>

      {/* FOOTER CODES */}
      <div className="p-3 border-t border-[#e3e3e3] shrink-0 bg-[#ebebeb]/30">
        <button
          onClick={onOpenSettings}
          className={`flex items-center space-x-3 w-full px-2.5 py-2 text-xs text-neutral-700 hover:bg-[#ebebeb] hover:text-neutral-950 rounded-lg transition-all cursor-pointer font-medium relative group ${
            currentTab === 'settings' ? 'bg-[#1a1a1a] text-white font-semibold shadow-xs' : ''
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-900" />
          {!isCollapsed && <span>{translate('settings', settings)}</span>}
          {isCollapsed && (
            <div className="absolute left-14 bottom-2 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {translate('settings', settings)}
            </div>
          )}
        </button>
      </div>

    </aside>
  );
}
