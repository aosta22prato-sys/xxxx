import React from 'react';
import { Product } from '../types';
import { MOCK_PRODUCT_SVGS } from '../data/mockData';
import { Edit3, Store, TrendingUp, AlertCircle } from 'lucide-react';
import { eventBus } from '../services/eventBus';

interface ProductPanelProps {
  activeProduct: Product;
  handleModifyStock: (amt: number) => void;
  handlePriceChange: (newPrice: number) => void;
}

export default function ProductPanel({
  activeProduct,
  handleModifyStock,
  handlePriceChange,
}: ProductPanelProps) {
  // Compute internal margins
  const cost = activeProduct.costPerItem || 0;
  const price = activeProduct.price || 0;
  const profit = price - cost;
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : '0.0';

  // Format Status Badge Styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-zinc-100 text-zinc-650 border-zinc-250';
      case 'archived':
        return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'suspended':
        return 'bg-rose-50 text-rose-700 border-rose-250';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-250';
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Card Info */}
      <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg flex flex-col items-center text-center space-y-3 shadow-xs">
        <div className="w-16 h-16 border border-neutral-200 bg-neutral-50 rounded flex items-center justify-center p-2.5">
          <div dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[activeProduct.images[0] as keyof typeof MOCK_PRODUCT_SVGS || 'wallet'] }} />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm leading-snug">{activeProduct.title}</h3>
          
          <div className="flex items-center justify-center space-x-2 mt-1">
            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${getStatusStyle(activeProduct.status)}`}>
              {activeProduct.status.toUpperCase()}
            </span>
          </div>

          <p className="text-[10px] text-neutral-400 font-mono">{activeProduct.sku} | {activeProduct.vendor}</p>
        </div>

        {/* Edit Full Details CTA */}
        <button
          onClick={() => {
            eventBus.emit('product:edit-details', activeProduct);
          }}
          className="w-full bg-neutral-900 hover:bg-black text-white text-[10px] font-mono uppercase tracking-widest font-bold py-2 rounded shadow-xs flex items-center justify-center space-x-1.5 transition-all mt-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>编辑高级属性 (Edit Details)</span>
        </button>
      </div>

      {/* Stock room controller */}
      <div className="bg-white border border-[#e3e3e3] p-3.5 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">SYSTEM LOCATION STOCK</h4>
          <span className="text-[9px] text-neutral-400 font-mono">Multi-Origin</span>
        </div>
        
        {/* Warehouse list */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono bg-neutral-55 px-2.5 py-1.5 rounded border border-neutral-100 text-[10px]">
            <span className="text-neutral-500">🏬 Main Atelier</span>
            <span className="font-bold">{activeProduct.inventoryByLocation?.['Main Warehouse'] ?? activeProduct.inventory} pcs</span>
          </div>
          <div className="flex items-center justify-between font-mono bg-neutral-55 px-2.5 py-1.5 rounded border border-neutral-100 text-[10px]">
            <span className="text-neutral-500">🏬 Milan Store</span>
            <span className="font-bold">{activeProduct.inventoryByLocation?.['Milan Store'] ?? 0} pcs</span>
          </div>
          <div className="flex items-center justify-between font-mono bg-neutral-55 px-2.5 py-1.5 rounded border border-neutral-100 text-[10px]">
            <span className="text-neutral-500">🏬 Rome Store</span>
            <span className="font-bold">{activeProduct.inventoryByLocation?.['Rome Store'] ?? 0} pcs</span>
          </div>
        </div>

        {/* Stock adjuster values */}
        <div className="flex space-x-2 pt-1">
          <button 
            onClick={() => handleModifyStock(-5)}
            disabled={activeProduct.inventory <= 0}
            className="shopify-btn-secondary flex-1 py-1.5 font-bold hover:bg-neutral-50 disabled:opacity-50 text-center text-[10px] uppercase font-mono tracking-wider border border-[#ccc] rounded"
          >
            Remove 5
          </button>
          <button 
            onClick={() => handleModifyStock(5)}
            className="shopify-btn-primary flex-1 py-1.5 font-bold text-center text-[10px] uppercase font-mono tracking-wider bg-black text-white hover:bg-neutral-800 rounded"
          >
            Restock +5
          </button>
        </div>
      </div>

      {/* Pricing Analysis */}
      <div className="bg-white border border-[#e3e3e3] p-3.5 rounded-lg space-y-2.5">
        <h4 className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#616161]">FAST PRICING EDITOR</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-[9px] font-mono text-neutral-400 mb-1 uppercase">Price (€)</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-[#616161]">€</span>
              <input
                type="number"
                value={activeProduct.price}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full bg-neutral-50 text-xs text-[#1a1a1a] border border-neutral-300 rounded px-3 py-1.5 pl-6.5 font-mono focus:outline-none focus:ring-1 focus:ring-black pr-3 font-semibold"
              />
            </div>
          </div>

          {/* Pricing Insights Grid */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-50 border border-neutral-200 p-2 rounded text-[10px] font-mono">
            <div>
              <span className="text-neutral-400 block text-[9px] uppercase">Cost</span>
              <span className="font-bold text-[#111]">€{cost.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[9px] uppercase">Margin</span>
              <span className={`font-bold flex items-center ${Number(margin) > 50 ? 'text-emerald-600' : 'text-neutral-700'}`}>
                {margin}% <TrendingUp className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
