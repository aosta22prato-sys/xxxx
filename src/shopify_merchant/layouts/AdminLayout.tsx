/**
 * Master Admin OS Layout Engine - Level 10
 * Pure Layout Orchestrator responsive to all screens (Desktop, Tablet, Mobile)
 * Dynamically delivers views based on Zustand router state.
 */

import React, { useEffect } from 'react';
import { useLayoutStore } from '../stores/layoutStore';
import { usePanelStore } from '../stores/panelStore';
import { useShopStore } from '../stores/shopStore';

// Unified Responsive Layout Base Component
import Header from './Header';
import Sidebar from './Sidebar';
import BottomTabs from './BottomTabs';
import ContextPanel from '../context-panel';

// Core Decoupled Business Modules (Level 1/2)
import HomeView from '../modules/home';
import OrdersView from '../modules/orders';
import ProductsView from '../modules/products';
import CustomersView from '../modules/customers';
import DiscountsView from '../modules/discounts';
import GenericModuleView from '../modules/generic';
import ContentView from '../modules/content';
import ThemeEditorView from '../modules/web-shop';
import AppsteroView from '../modules/appstero';
import SidekickWorkspace from '../modules/sidekick';
import MoreWorkspace from '../modules/more';

import FlowView from '../modules/flows';
import WebhookView from '../modules/webhooks';
import SeoView from '../modules/seo';
import CheckoutView from '../modules/checkout';
import ShopifyQlView from '../modules/shopifyql';
import QuickNav from '../components/ui/QuickNav';
import EnterpriseInitView from '../modules/init';

// Legacy / domain state pointers
import { useProductStore } from '../stores/productStore';
import { useOrderStore } from '../stores/orderStore';
import { useCustomerStore } from '../stores/customerStore';
import { useDiscountStore } from '../stores/discountStore';

export default function AdminLayout({ onToggleAdminMode }: { onToggleAdminMode?: () => void }) {
  const { currentTab, setCurrentTab } = useLayoutStore();
  const { selectedPreview, setSelectedPreview } = usePanelStore();
  const { settings, updateSettings, isInitialized } = useShopStore();

  const { products, setProducts } = useProductStore();
  const { orders, setOrders } = useOrderStore();
  const { customers, setCustomers } = useCustomerStore();
  const { discounts, setDiscounts } = useDiscountStore();



  // 监听 URL hash 变化，同步到 currentTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== currentTab) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentTab, setCurrentTab]);

  if (!isInitialized) {
    return <EnterpriseInitView />;
  }

  // Master Routing Dispatcher
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
        
      case 'orders':
        return <OrdersView />;
        
      case 'products':
      case 'inventory':
      case 'collections':
        return <ProductsView />;
        
      case 'customers':
      case 'segments':
        return <CustomersView />;
        
      case 'discounts':
        return <DiscountsView />;
        
      case 'settings':
        return <MoreWorkspace />;
        
      case 'marketing':
      case 'finance':
      case 'analytics':
      case 'analytics-reports':
      case 'markets':
      case 'apps':
      case 'pos-setup':
        return <GenericModuleView moduleKey={currentTab} />;

      case 'sidekick-menu':
        return <SidekickWorkspace />;
        
      case 'more':
        return <MoreWorkspace />;
        
      case 'automations':
        return <FlowView />;
        
      case 'app-embed':
        return <WebhookView />;
        
      case 'seo':
        return <SeoView />;
        
      case 'checkout':
        return <CheckoutView />;
        
      case 'shopifyql':
        return <ShopifyQlView />;
        
      case 'content':
      case 'files':
      case 'pages':
      case 'blog':
      case 'navigation':
      case 'metaobjects':
        return <ContentView />;
        
      case 'web-shop':
        return <ThemeEditorView />;
        
      case 'appstero':
      case 'app-fx-converter':
      case 'app-live-bubble':
      case 'app-smart-courier':
      case 'app-exit-intent':
      case 'app-ai-writer':
        return <AppsteroView currentTab={currentTab} />;
        
      default:
        return <HomeView />;
    }
  };

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    // Auto-close item-level context previews when switching domains to maintain clean visuals
    if (selectedPreview && ['order', 'product', 'customer', 'discount'].includes(selectedPreview.type || '')) {
      setSelectedPreview(null);
    }
  };

  // Pre-assembled components for standard layouts
  const sharedHeader = <Header onToggleAdminMode={onToggleAdminMode} />;
  const sharedSidebar = (
    <Sidebar 
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      settings={settings}
      onOpenSettings={() => setCurrentTab('settings')}
    />
  );
  
  const mainContent = (
    <div className="animate-fadeIn">
      {renderTabContent()}
    </div>
  );

  const sharedContextPanel = selectedPreview ? (
    <ContextPanel 
      selectedItem={selectedPreview}
      onClose={() => setSelectedPreview(null)}
      products={products}
      setProducts={setProducts}
      orders={orders}
      setOrders={setOrders}
      customers={customers}
      setCustomers={setCustomers}
      discounts={discounts}
      setDiscounts={setDiscounts}
      currentTab={currentTab}
    />
  ) : null;

  // Adaptive Media Shell (Single Responsive Native Structure)
  return (
    <div id="tablet-layout-root" className="w-full h-screen overflow-hidden flex bg-[#f6f6f7] font-sans antialiased text-neutral-900 select-none">
      {/* COLUMN 1 — Left Navigation sidebar (Full Height) */}
      {sharedSidebar}

      {/* RIGHT WORKSPACE — Header + Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* GLOBAL HEADER BAR */}
        {sharedHeader}

        {/* WORKSPACE & PANELS */}
        <div className="flex-1 w-full flex overflow-hidden relative">
          {/* COLUMN 2 — Main Area work desk */}
          <main 
            id="main-area-scroller" 
            className="flex-1 overflow-y-auto bg-[#f6f6f7] p-4 md:p-6 lg:p-8 select-none focus:outline-none scrollbar-thin scrollbar-thumb-neutral-300"
          >
            <div className="max-w-5xl mx-auto w-full pb-16 md:pb-0">
              {mainContent}
            </div>
          </main>

          {/* COLUMN 3 — Dynamic right preview context slider */}
          {selectedPreview && (
            <div className="absolute lg:relative inset-y-0 right-0 z-40 bg-white border-l border-neutral-200 shadow-2xl lg:shadow-none flex flex-col w-[380px] sm:w-[420px] max-w-full animate-[slideIn_0.2s_ease-out]">
              {sharedContextPanel}
            </div>
          )}
        </div>

        {/* Mobile navigation bar when under medium screen break point */}
        <div className="block md:hidden border-t border-neutral-200 bg-white shrink-0 z-30">
          <BottomTabs 
            activeTab={currentTab} 
            onTabChange={handleSelectTab} 
            settings={settings}
          />
        </div>
      </div>

      <QuickNav />
    </div>
  );
}
