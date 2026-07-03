import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { 
  X, ShoppingBag, User, Package, Tag, HelpCircle, LayoutGrid, 
  Minimize2, Maximize2 
} from 'lucide-react';
import { Order, Product, Customer, Discount } from '../types';

import OrderPanel from './OrderPanel';
import ProductPanel from './ProductPanel';
import CustomerPanel from './CustomerPanel';
import DiscountPanel from './DiscountPanel';
import SidekickPanel from './SidekickPanel';
import HelpPanel from './HelpPanel';
import AppEmbedPanel from './AppEmbedPanel';

interface ContextPanelProps {
  selectedItem: { 
    type: 'order' | 'product' | 'customer' | 'sidekick' | 'discount' | 'help' | 'app-embed' | null; 
    id: string | null; 
  } | null;
  onClose: () => void;
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  discounts: Discount[];
  setDiscounts?: Dispatch<SetStateAction<Discount[]>>;
  currentTab?: string;
}

export default function ContextPanel({
  selectedItem,
  onClose,
  products,
  setProducts,
  orders,
  setOrders,
  customers,
  setCustomers,
  discounts,
  setDiscounts,
  currentTab = 'home'
}: ContextPanelProps) {
  
  const [isMaximized, setIsMaximized] = useState(false);

  // Reset maximize if selected item type or ID changes
  useEffect(() => {
    setIsMaximized(false);
  }, [selectedItem?.type, selectedItem?.id]);

  if (!selectedItem || !selectedItem.type) return null;

  // Resolve active entity elements
  const activeOrder = selectedItem.type === 'order' ? orders.find(o => o.id === selectedItem.id) : null;
  const activeProduct = selectedItem.type === 'product' ? products.find(p => p.id === selectedItem.id) : null;
  const activeCustomer = selectedItem.type === 'customer' ? customers.find(c => c.id === selectedItem.id) : null;
  const activeDiscount = selectedItem.type === 'discount' ? discounts.find(d => d.id === selectedItem.id) : null;

  // Inventory overrides
  const handleModifyStock = (amt: number) => {
    if (!activeProduct) return;
    setProducts(prev => prev.map(p => {
      if (p.id === activeProduct.id) {
        const newStock = Math.max(0, p.inventory + amt);
        return {
          ...p,
          inventory: newStock,
          inventoryByLocation: { 'Main Warehouse': newStock }
        };
      }
      return p;
    }));
  };

  const handlePriceChange = (newPrice: number) => {
    if (!activeProduct) return;
    setProducts(prev => prev.map(p => p.id === activeProduct.id ? { ...p, price: Math.max(0, newPrice) } : p));
  };

  // Order handlers
  const handleFulfillOrder = () => {
    if (!activeOrder) return;
    setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, fulfillmentStatus: 'fulfilled' } : o));
  };

  const handleRefundOrder = () => {
    if (!activeOrder) return;
    setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, paymentStatus: 'refunded' } : o));
  };

  // Discount handlers
  const handleToggleDiscountStatus = () => {
    if (!activeDiscount || !setDiscounts) return;
    setDiscounts(prev => prev.map(d => d.id === activeDiscount.id ? { 
      ...d, 
      status: d.status === 'active' ? 'expired' : 'active' 
    } : d));
  };

  // Notes update handler for customers
  const handleNotesChange = (val: string) => {
    if (!activeCustomer) return;
    setCustomers(prev => prev.map(c => c.id === activeCustomer.id ? { ...c, notes: val } : c));
  };

  return (
    <div 
      className={`h-full flex flex-col bg-white border-l border-[#e3e3e3] select-none text-[#1a1a1a] z-10 font-sans transition-all duration-300 shadow-xl ${
        isMaximized ? 'w-[750px] shrink-0' : 'w-[340px] shrink-0'
      }`}
    >
      {selectedItem.type === 'sidekick' ? (
        <SidekickPanel 
          products={products}
          orders={orders}
          discounts={discounts}
          onClose={onClose}
          isMaximized={isMaximized}
          setIsMaximized={setIsMaximized}
        />
      ) : (
        <div className="flex flex-col h-full bg-[#f7f7f7]">
          {/* TOP PANEL CONTROL HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e3e3e3] shrink-0">
            <div className="flex items-center space-x-2">
              {selectedItem.type === 'order' && <ShoppingBag className="w-4 h-4 text-[#1a1a1a]" />}
              {selectedItem.type === 'product' && <Package className="w-4 h-4 text-[#1a1a1a]" />}
              {selectedItem.type === 'customer' && <User className="w-4 h-4 text-[#1a1a1a]" />}
              {selectedItem.type === 'discount' && <Tag className="w-4 h-4 text-[#1a1a1a]" />}
              {selectedItem.type === 'help' && <HelpCircle className="w-4 h-4 text-[#1a1a1a]" />}
              {selectedItem.type === 'app-embed' && <LayoutGrid className="w-4 h-4 text-[#1a1a1a]" />}

              <span className="font-semibold text-xs uppercase tracking-wider text-[#1a1a1a]">
                {selectedItem.type === 'help' && 'Atelier Help Hub'}
                {selectedItem.type === 'app-embed' && 'App Integrations'}
                {selectedItem.type !== 'help' && selectedItem.type !== 'app-embed' && `${selectedItem.type} Overview`}
              </span>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "2-Column Mode" : "3-Column Mode"}
                className="p-1.5 hover:bg-[#ebebeb] rounded text-[#616161] hover:text-[#1a1a1a] transition-colors cursor-pointer"
              >
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={onClose}
                className="text-[#616161] hover:text-black hover:bg-[#ebebeb] p-1.5 rounded transition-colors"
                title="Close sidebar panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MIDDLE SCROLLABLE CANVAS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {selectedItem.type === 'order' && activeOrder && (
              <OrderPanel 
                activeOrder={activeOrder}
                handleFulfillOrder={handleFulfillOrder}
                handleRefundOrder={handleRefundOrder}
              />
            )}
            
            {selectedItem.type === 'product' && activeProduct && (
              <ProductPanel 
                activeProduct={activeProduct}
                handleModifyStock={handleModifyStock}
                handlePriceChange={handlePriceChange}
              />
            )}

            {selectedItem.type === 'customer' && activeCustomer && (
              <CustomerPanel 
                activeCustomer={activeCustomer}
                handleNotesChange={handleNotesChange}
              />
            )}

            {selectedItem.type === 'discount' && activeDiscount && (
              <DiscountPanel 
                activeDiscount={activeDiscount}
                handleToggleDiscountStatus={handleToggleDiscountStatus}
              />
            )}

            {selectedItem.type === 'help' && (
              <HelpPanel currentTab={currentTab} />
            )}

            {selectedItem.type === 'app-embed' && (
              <AppEmbedPanel />
            )}
          </div>

          {/* BOTTOM QUICK FOOTER */}
          <div className="px-4 py-2 bg-white border-t border-[#e3e3e3] shrink-0 text-[10px] text-neutral-400 text-center font-mono">
            Atelier Nord Workspace Engine v3.0 // Modularized
          </div>
        </div>
      )}
    </div>
  );
}
