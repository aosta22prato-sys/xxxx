/**
 * Ultimate Modular Products Module - Level 10 Schema & Event Driven Catalog Manager
 * Uses Zod schemas, FormBuilder, DataGrid, plus live ProductService proxying.
 * High-fidelity PWA Mobile viewport re-write matching visual sketches flawlessly.
 */

import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../stores/productStore';
import { usePanelStore } from '../../stores/panelStore';
import { useShopStore } from '../../stores/shopStore';
import { useLayoutStore } from '../../stores/layoutStore';
import { Product } from '../../types';
import { ProductEvents, InventoryEvents, NotificationEvents, eventBus } from '../../events';
import { productSchemaMeta } from '../../schemas';
import DataGrid from '../../components/ui/DataGrid';
import { commerceAPI } from '../../../services/CommerceAPIClient';
import { MOCK_PRODUCT_SVGS } from '../../data/mockData';
import { GlassCard3D, CyberBadge, HoloViewport } from '../../components/3d-component-library';

// Icons for PWA Mobile Layout
import { 
  LayoutGrid, Shirt, ShoppingBag, Home, Layers, MoreHorizontal, 
  Sparkles, Search, ListFilter, Plus, X, Box, ArrowUpDown,
  Share2, Download, Check, Eye, Activity, Cpu, Coins, Lock, RefreshCw, Radio
} from 'lucide-react';

// De-coupled sub-components for Desktop
import ProductsHeader from './components/ProductsHeader';
import ProductsTabs from './components/ProductsTabs';
import ProductForm from './components/ProductForm';

export default function ProductsView() {
  const { products, productFilter, setProductFilter, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { togglePreview, closePreview } = usePanelStore();
  const { settings } = useShopStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Responsive state monitoring
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeCategory, setActiveCategory] = useState('all');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Desktop layout modes
  const [desktopViewMode, setDesktopViewMode] = useState<'table' | 'grid'>('grid');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isTwinScannerActive, setIsTwinScannerActive] = useState(true);

  // Lightbox view state
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [copiedSuccessfully, setCopiedSuccessfully] = useState(false);

  // Status Filter state for mobile (all, active, draft, archived)
  const [mobileStatusFilter, setMobileStatusFilter] = useState<'All' | 'active' | 'draft' | 'archived'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const currencySymbol = settings.currencySymbol || '€';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (products.length > 0 && !scannedProduct) {
      setScannedProduct(products[0]);
    }
  }, [products, scannedProduct]);

  // Subscriptions to full-blown editing form events
  useEffect(() => {
    const handleEditStart = (p: Product) => {
      setEditingProduct(p);
      setIsCreating(false);
      closePreview(); // Clear sidebar to make ample space
    };

    const handleDeleteCommand = async (productId: string) => {
      deleteProduct(productId);
      const updatedProducts = products.filter(p => p.id !== productId);
      await commerceAPI.saveProducts(updatedProducts);
      
      eventBus.emit(ProductEvents.DELETED, { id: productId });
      eventBus.emit(NotificationEvents.CREATED, {
        text: `🗑️ 商品被永久除档，ID: ${productId}`
      });

      setEditingProduct(null);
      setIsCreating(false);
    };

    const editUnsubscribe = eventBus.subscribe('product:edit-details', handleEditStart);
    const deleteUnsubscribe = eventBus.subscribe('product:delete-product', handleDeleteCommand);

    return () => {
      editUnsubscribe();
      deleteUnsubscribe();
    };
  }, [products, deleteProduct, closePreview]);

  // Map category groups mapping counts and tags
  const getCategoryCount = (catId: string) => {
    return products.filter((p) => {
      if (catId === 'all') return true;
      if (catId === 'apparel') return p.type === 'Apparel' || p.images.includes('shirt');
      if (catId === 'bags') return p.images.includes('backpack') || p.type?.toLowerCase().includes('bag');
      if (catId === 'home') return ['Kitchenware', 'Office', 'Home'].includes(p.type || '') || p.images.includes('candle') || p.images.includes('deskpad') || p.images.includes('pencil') || p.images.includes('dripper');
      if (catId === 'accessories') return (p.type === 'Accessories' && !p.images.includes('backpack')) || p.type === 'Electronics' || p.images.includes('wallet') || p.images.includes('headphones');
      return false;
    }).length;
  };

  // Filter products by tabs / category / search query
  const getFilteredProducts = () => {
    return products.filter((p) => {
      // Screen status filters
      if (!isMobile) {
        if (productFilter !== 'All' && p.status !== productFilter) return false;
      } else {
        if (mobileStatusFilter !== 'All' && p.status !== mobileStatusFilter) return false;

        // Categories filters
        if (activeCategory !== 'all') {
          const isApparel = p.type === 'Apparel' || p.images.includes('shirt');
          const isBag = p.images.includes('backpack') || p.type?.toLowerCase().includes('bag');
          const isHome = ['Kitchenware', 'Office', 'Home'].includes(p.type || '') || p.images.includes('candle') || p.images.includes('deskpad') || p.images.includes('pencil') || p.images.includes('dripper');
          const isAcc = (p.type === 'Accessories' && !p.images.includes('backpack')) || p.type === 'Electronics' || p.images.includes('wallet') || p.images.includes('headphones');

          if (activeCategory === 'apparel' && !isApparel) return false;
          if (activeCategory === 'bags' && !isBag) return false;
          if (activeCategory === 'home' && !isHome) return false;
          if (activeCategory === 'accessories' && !isAcc) return false;
          if (activeCategory === 'more') return false; // Default empty or others
        }

        // Search filter matching query
        if (mobileSearchQuery.trim()) {
          const query = mobileSearchQuery.toLowerCase().trim();
          const matchesTitle = p.title.toLowerCase().includes(query);
          const matchesDesc = p.description?.toLowerCase().includes(query);
          const matchesSku = p.sku?.toLowerCase().includes(query);
          const matchesType = p.type?.toLowerCase().includes(query);
          const matchesVendor = p.vendor?.toLowerCase().includes(query);

          if (!matchesTitle && !matchesDesc && !matchesSku && !matchesType && !matchesVendor) {
            return false;
          }
        }
      }
      return true;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Handle active creation & editing submissions
  const handleFormSubmit = async (formData: any) => {
    if (editingProduct) {
      // Edit Mode Update
      const updatedItem: Product = {
        ...editingProduct,
        ...formData
      };

      updateProduct(editingProduct.id, updatedItem);
      
      const newProductList = products.map(p => p.id === editingProduct.id ? updatedItem : p);
      await commerceAPI.saveProducts(newProductList);

      eventBus.emit(ProductEvents.UPDATED, updatedItem);
      eventBus.emit(InventoryEvents.CHANGED, { sku: updatedItem.sku, value: updatedItem.inventory });
      eventBus.emit(NotificationEvents.CREATED, {
        text: `✏️ 已同步更新 [${updatedItem.title}] 后台组织与多仓微配额`
      });

      setEditingProduct(null);
    } else {
      // Creation Mode
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: formData.title,
        description: formData.description || '',
        vendor: formData.vendor,
        type: formData.type || 'High-End Leather',
        status: formData.status || 'active',
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice),
        costPerItem: Number(formData.costPerItem),
        sku: formData.sku,
        inventory: Number(formData.inventory),
        inventoryByLocation: formData.inventoryByLocation || { 'Main Warehouse': Number(formData.inventory) },
        images: formData.images || ['wallet'],
        collections: formData.collections || [],
        tags: formData.tags || [],
      };

      // 1. Commit and sync with new API
      addProduct(newProd);
      await commerceAPI.saveProducts([...products, newProd]);

      // 2. Transmit changes to asynchronous EventBus for real-time decoupled listeners
      eventBus.emit(ProductEvents.UPDATED, newProd);
      eventBus.emit(InventoryEvents.CHANGED, { sku: newProd.sku, value: newProd.inventory });
      eventBus.emit(NotificationEvents.CREATED, {
        text: `📦 新入库商品 [${newProd.title}]，货号: ${newProd.sku}，配额: ${newProd.inventory} Pcs`
      });

      setIsCreating(false);
    }
  };

  // Rendering conditional form setup first
  if (isCreating || editingProduct) {
    return (
      <ProductForm 
        productToEdit={editingProduct}
        onBack={() => {
          setIsCreating(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
      />
    );
  }

  // Categories payload mapping structure for the view
  const categoriesList = [
    { id: 'all', label: '全部', icon: LayoutGrid, count: getCategoryCount('all') },
    { id: 'apparel', label: '服饰', icon: Shirt, count: getCategoryCount('apparel') },
    { id: 'bags', label: '包袋', icon: ShoppingBag, count: getCategoryCount('bags') },
    { id: 'home', label: '家居', icon: Home, count: getCategoryCount('home') },
    { id: 'accessories', label: '配件', icon: Layers, count: getCategoryCount('accessories') },
    { id: 'more', label: '更多', icon: MoreHorizontal, count: 0 }
  ];

  const activeCategoryLabel = categoriesList.find(c => c.id === activeCategory)?.label || '全部';

  // --- MOBILE SCREEN OUTPUT VIEW ---
  if (isMobile) {
    return (
      <div className="space-y-3.5 animate-fadeIn select-none relative pb-10">
        
        {/* Header section with smart subtitle (Without duplicated AI icon) */}
        <div className="flex items-center justify-between pb-0.5 pt-0.5">
          <div>
            <h1 
              onClick={() => {
                useLayoutStore.getState().toggleQuickNav(true);
              }}
              className="text-[20px] font-extrabold tracking-tight text-neutral-900 font-sans cursor-pointer hover:text-black active:scale-98 transition-all inline-block select-none"
            >
              商品 ➔
            </h1>
            <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
              管理你的商品
            </p>
          </div>
        </div>

        {/* Categories horizontally scrollable bar - Extra-compact sleek Shopify style */}
        <div>
          <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
            {categoriesList.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <div 
                  key={cat.id}
                  onClick={() => {
                    if (cat.id !== 'more') {
                      setActiveCategory(cat.id);
                    }
                  }}
                  className={`flex flex-col items-center justify-between p-2 rounded-lg border w-14 h-[60px] shrink-0 text-center transition-all duration-150 cursor-pointer active:scale-95 select-none ${
                    isActive 
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold ring-1 ring-neutral-950/10 shadow-3xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-450'}`} />
                  <span className="text-[9px] font-sans font-medium tracking-tight truncate w-full">{cat.label}</span>
                  {cat.id !== 'more' ? (
                    <span className={`text-[9px] font-bold font-mono leading-none ${isActive ? 'text-white/80' : 'text-neutral-400'}`}>
                      {cat.count}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-neutral-350 leading-none">• • •</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle title row with inline search button and filters */}
        <div className="flex items-center justify-between pt-0.5 relative">
          {isSearchOpen ? (
            <div className="flex-1 flex items-center space-x-1.5 bg-white border border-neutral-250 py-1 px-2.5 rounded-lg transition-all duration-200 animate-slideDown">
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <input 
                type="text"
                autoFocus
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder={`在「${activeCategoryLabel}」分类中检索商品...`}
                className="flex-1 bg-transparent text-[10px] focus:outline-none placeholder-neutral-400 font-medium font-sans"
              />
              <button 
                onClick={() => {
                  setMobileSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="p-0.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[11px] font-extrabold text-neutral-800 tracking-tight font-sans">
                {activeCategoryLabel}商品 <span className="font-mono text-[8.5px] text-neutral-450 ml-1 font-semibold">({filteredProducts.length})</span>
              </h2>

              <div className="flex items-center space-x-1">
                {/* Search toggle Button */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-6.5 h-6.5 bg-white rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer active:scale-90 duration-150 shadow-3xs"
                >
                  <Search className="w-3 h-3" />
                </button>

                {/* Filter Selector Button */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center cursor-pointer active:scale-90 duration-150 shadow-3xs ${
                      mobileStatusFilter !== 'All' 
                        ? 'border-neutral-900 bg-neutral-900 text-white' 
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-black'
                    }`}
                  >
                    <ListFilter className="w-3 h-3" />
                  </button>

                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 top-7 w-28 bg-white border border-neutral-200 rounded-lg shadow-lg z-30 p-1 font-sans animate-fadeIn text-[9px]">
                      <div className="p-1 text-center font-bold text-neutral-400 border-b border-neutral-100 pb-1 mr-1 ml-1 text-[7.5px] tracking-wider uppercase">状态过滤</div>
                      {(['All', 'active', 'draft', 'archived'] as const).map((filterVal) => (
                        <button
                          key={filterVal}
                          onClick={() => {
                            setMobileStatusFilter(filterVal);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-md font-semibold ${
                            mobileStatusFilter === filterVal 
                              ? 'bg-neutral-950 text-white' 
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {filterVal === 'All' ? '全部状态' : filterVal === 'active' ? '在售中' : filterVal === 'draft' ? '草稿箱' : '已归档'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 3-Columns compact grid with beautiful pixel alignments */}
        <div className="grid grid-cols-3 gap-2 pb-6">
          
          {/* First slot: Create/Add product card placeholder */}
          {!mobileSearchQuery && (
            <div 
              onClick={() => setIsCreating(true)}
              className="border border-dashed border-neutral-250 hover:border-neutral-400 rounded-lg bg-white/40 aspect-square flex flex-col items-center justify-center cursor-pointer hover:shadow-3xs active:scale-97 transition-all p-2 select-none group"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 group-hover:scale-105 transition-transform duration-200">
                <Plus className="w-3 h-3 text-neutral-500" />
              </div>
              <span className="text-[8.5px] font-bold text-neutral-500 mt-2">添加商品</span>
            </div>
          )}

          {/* Product Items */}
          {filteredProducts.map((p) => {
            const svgString = MOCK_PRODUCT_SVGS[p.images[0] as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.wallet;
            const priceVal = currencySymbol + p.price.toFixed(2);
            
            return (
              <div 
                key={p.id}
                className="bg-white border border-neutral-200/85 rounded-lg overflow-hidden hover:shadow-2xs transition-all duration-200 flex flex-col pb-1.5 group active:scale-99 relative"
              >
                {/* SVG illustration panel - Click image opens Lightbox */}
                <div 
                  onClick={() => setLightboxProduct(p)}
                  className="aspect-square bg-gradient-to-b from-[#fcfcfd] to-[#f4f5f7] flex items-center justify-center p-3 relative overflow-hidden shrink-0 cursor-zoom-in border-b border-neutral-100/60"
                  title="点击查看/分享/下载"
                  style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.015)' }}
                >
                  {/* Subtle white premium soft ambient backlight ring inside the card image area */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_0%,transparent_75%)] opacity-70 pointer-events-none" />
                  
                  {/* Real-time elegant smooth shading card outline background */}
                  <div className="absolute inset-1.5 rounded-md border border-white/45 pointer-events-none" />

                  {/* Absolute Badge Overlays on Image */}
                  <div className="absolute top-1.5 left-1.5 z-10 flex flex-col space-y-1 pointer-events-none">
                    {p.status === 'active' ? (
                      <span className="text-[7.5px] text-neutral-900 bg-white/95 border border-neutral-200/80 backdrop-blur-xs px-1 py-0.5 rounded-md font-extrabold font-sans shadow-4xs">
                        在售
                      </span>
                    ) : p.status === 'draft' ? (
                      <span className="text-[7.5px] text-amber-700 bg-white/90 border border-amber-100/50 backdrop-blur-xs px-1 py-0.5 rounded-md font-extrabold font-sans shadow-4xs">
                        草稿
                      </span>
                    ) : (
                      <span className="text-[7.5px] text-neutral-500 bg-white/90 border border-neutral-200/40 backdrop-blur-xs px-1 py-0.5 rounded-md font-extrabold font-sans shadow-4xs">
                        归档
                      </span>
                    )}
                  </div>

                  {/* Absolute Stock Overlay on Image (Top-Right) */}
                  <div className="absolute top-1.5 right-1.5 z-10 pointer-events-none">
                    <span className="text-[7.5px] text-neutral-600 bg-white/85 border border-neutral-200/25 px-1 py-0.5 rounded-md font-extrabold font-mono shadow-4xs">
                      存 {p.inventory}
                    </span>
                  </div>

                  <div 
                    className="w-10 h-10 flex items-center justify-center opacity-90 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)] text-neutral-900 filter saturate-[1.05] contrast-[1.02]"
                    dangerouslySetInnerHTML={{ __html: svgString }} 
                  />
                  
                  {/* Subtle zoom indicator on hover */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-full text-neutral-500 shadow-4xs pointer-events-none duration-250 scale-90">
                    <Eye className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Details triggers sliding dynamic detail sidekick/panel */}
                <div 
                  onClick={() => togglePreview('product', p.id)}
                  className="px-2 py-2 flex-1 flex flex-col justify-between cursor-pointer bg-white"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-bold text-neutral-800 leading-tight block line-clamp-1 hover:text-neutral-900 font-sans transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[9.5px] font-extrabold text-neutral-900 font-mono block">
                      {priceVal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty search fallback */}
          {filteredProducts.length === 0 && (
            <div className="col-span-3 py-8 text-center text-neutral-400 bg-white border border-neutral-200 rounded-lg p-5 flex flex-col items-center justify-center space-y-2">
              <Box className="w-7 h-7 text-neutral-350 stroke-1" />
              <span className="text-[9px] font-bold tracking-tight">无符合条件的货品</span>
              <span className="text-[8px] opacity-75">换个搜索词或调整筛选条件重试</span>
            </div>
          )}
        </div>

        {/* Brand Minimalist Image Lightbox Modal with Real sharing and SVG downloading */}
        {lightboxProduct && (
          <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden border border-neutral-100 shadow-2xl flex flex-col text-neutral-900 animate-scaleUp">
              
              {/* Lightbox header block */}
              <div className="flex items-center justify-between p-3.5 border-b border-neutral-100">
                <div className="truncate pr-4">
                  <h3 className="text-xs font-black tracking-tight text-neutral-900 truncate">
                    {lightboxProduct.title}
                  </h3>
                  <p className="text-[9px] text-neutral-400 font-mono mt-0.5 mt-0.5 font-semibold truncate">
                    SKU: {lightboxProduct.sku || '-'} • Type: {lightboxProduct.type}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setLightboxProduct(null);
                    setCopiedSuccessfully(false);
                  }}
                  className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer active:scale-90"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Centered Large HD Visual view with subtle concentric rotation alignment grids */}
              <div className="aspect-square bg-gradient-to-b from-[#fcfcfd] to-[#f1f2f5] flex items-center justify-center p-14 border-b border-neutral-100 select-none relative overflow-hidden">
                {/* Thin camera lenses capture guides */}
                <div className="absolute border border-neutral-200/40 rounded-full w-48 h-48 pointer-events-none" />
                <div className="absolute border border-dashed border-neutral-200/25 rounded-full w-60 h-60 pointer-events-none" />
                
                {/* Premium studio radial lighting bloom behind the SVG element */}
                <div className="absolute w-44 h-44 bg-white/95 rounded-full blur-xl pointer-events-none opacity-85" />
                <div className="absolute w-20 h-20 bg-[#008060]/5 rounded-full blur-2xl pointer-events-none" />

                <div 
                  className="w-28 h-28 flex items-center justify-center text-neutral-950 drop-shadow-[0_16px_28px_rgba(0,0,0,0.13)] relative z-10 animate-pulse duration-[3000ms]"
                  dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[lightboxProduct.images[0] as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.wallet }} 
                />
                
                {/* Visual price tag badge */}
                <div className="absolute bottom-4 right-4 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs font-extrabold py-1 px-2.5 rounded-lg shadow-lg z-10">
                  {currencySymbol}{lightboxProduct.price.toFixed(2)}
                </div>
              </div>

              {/* Fully premium actions grid: Real SVG download and clipboard-link share */}
              <div className="p-4 grid grid-cols-2 gap-3 bg-neutral-50">
                
                {/* BUTTON 1: Share link copies to Clipboard */}
                <button 
                  onClick={() => {
                    const shareText = `【Merchant OS 商号精品】\n商品: ${lightboxProduct.title}\n价格: ${currencySymbol}${lightboxProduct.price}\n库存: ${lightboxProduct.inventory}件在库\n立刻前往管理或在线订购！`;
                    navigator.clipboard.writeText(shareText)
                      .then(() => {
                        setCopiedSuccessfully(true);
                        eventBus.emit(NotificationEvents.CREATED, {
                          text: `🔗 已生成并自动复制商品卡片内容：「${lightboxProduct.title}」`
                        });
                        setTimeout(() => setCopiedSuccessfully(false), 2000);
                      })
                      .catch(() => {
                        alert('分享复制失败，请重试');
                      });
                  }}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg font-bold text-[10px] select-none transition-all duration-150 cursor-pointer active:scale-95 ${
                    copiedSuccessfully 
                      ? 'bg-[#008060] text-white shadow-xs' 
                      : 'bg-white text-neutral-800 border border-neutral-250 hover:bg-neutral-100'
                  }`}
                >
                  {copiedSuccessfully ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>已复制卡片信息</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>分享商品卡片</span>
                    </>
                  )}
                </button>

                {/* BUTTON 2: Real SVG download link execution */}
                <button 
                  onClick={() => {
                    const svgContent = MOCK_PRODUCT_SVGS[lightboxProduct.images[0] as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.wallet;
                    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const triggerLink = document.createElement('a');
                    triggerLink.href = url;
                    triggerLink.download = `${lightboxProduct.title.toLowerCase().replace(/\s+/g, '_')}_emblem.svg`;
                    document.body.appendChild(triggerLink);
                    triggerLink.click();
                    document.body.removeChild(triggerLink);
                    URL.revokeObjectURL(url);

                    eventBus.emit(NotificationEvents.CREATED, {
                      text: `💾 商品矢量图像 [${lightboxProduct.title}] 导出下载成功！`
                    });
                  }}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold text-[10px] select-none transition-all duration-150 cursor-pointer active:scale-95 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载矢量图片</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  // --- STANDARD DESKTOP VIEW ---
  return (
    <div className="space-y-5 animate-fadeIn select-none text-left">
      {/* Decoupled title section */}
      <ProductsHeader onAddClick={() => setIsCreating(true)} />

      {/* Decoupled tabs filter bar with ViewMode toggle */}
      <ProductsTabs 
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        filteredCount={filteredProducts.length}
        viewMode={desktopViewMode}
        setViewMode={setDesktopViewMode}
      />

      {/* PREMIUM PRODUCT SPOTLIGHT WORKSPACE */}
      {false && isTwinScannerActive && scannedProduct && (
        <div className="relative overflow-hidden bg-[#0A0B0D] rounded-xl border border-neutral-800 p-5 text-white shadow-2xl animate-fadeIn">
          {/* Subtle grid background & backing brand glows */}
          <div className="absolute inset-0 bg-[radial-gradient(#008060_0.5px,transparent_1px)] [background-size:12px_12px] opacity-10" />
          <div className="absolute top-0 right-1/4 w-72 h-44 bg-[#008060] rounded-full blur-[120px] opacity-15 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-6 z-10 relative">
            
            {/* Elegant SVG thumbnail visualizer stage */}
            <div className="w-40 h-40 relative flex items-center justify-center border border-neutral-850 bg-black/55 rounded-xl shrink-0 group">
              <div className="absolute inset-2 border border-dashed border-[#008060]/20 rounded-full animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-6 border border-neutral-800 rounded-full" />
              <div className="absolute inset-y-0 w-0.5 bg-[#008060]/20 left-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="absolute inset-x-0 h-0.5 bg-[#008060]/20 top-1/2 -translate-y-1/2 pointer-events-none" />
              
              {/* Pulsing indicator */}
              <div className="absolute w-28 h-28 border border-[#008060]/35 rounded-full animate-ping opacity-10 pointer-events-none" />

              <div 
                className="w-16 h-16 flex items-center justify-center text-white drop-shadow-[0_0_15px_rgba(0,128,96,0.5)] transform group-hover:rotate-12 transition-transform duration-300"
                dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[scannedProduct.images[0] as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.wallet }} 
              />
              
              <div className="absolute bottom-2 left-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-[#008060]">SPOTLIGHT READY</span>
              </div>
            </div>

            {/* Smart Information Dashboard Columns */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Product Info Specs */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#008060]/20 text-[#008060] border border-[#008060]/30 font-mono text-[9px] font-bold">
                    编码: {scannedProduct.sku || scannedProduct.id}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400 font-mono text-[8px] border border-neutral-800">
                    类别: {scannedProduct.type}
                  </span>
                </div>
                
                <h3 className="text-md font-extrabold tracking-tight text-white font-sans">
                  {scannedProduct.title}
                </h3>
                <p className="text-[11px] text-[#8E8E93] line-clamp-2 leading-relaxed">
                  {scannedProduct.description || '暂无商品特征描述。'}
                </p>

                <div className="flex gap-2.5 pt-1.5">
                  <span className="text-[10px] font-mono text-[#008060] font-bold">
                    SKU: <span className="text-white bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded ml-1">{scannedProduct.sku || 'N/A'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#008060] font-bold">
                    当前库存: <span className="text-white bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded ml-1">{scannedProduct.inventory} 件</span>
                  </span>
                </div>
              </div>

              {/* Warehouse Stocks Distribution */}
              <div className="border-t md:border-t-0 md:border-l border-neutral-800/80 md:pl-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Radio className="w-3 h-3 text-[#008060] animate-pulse" />
                    <span>多仓库存调度</span>
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">已同步对齐</span>
                </div>

                <div className="space-y-1.5 font-mono text-[9.5px]">
                  <div className="flex justify-between items-center bg-black/25 p-1 rounded border border-neutral-900">
                    <span className="text-neutral-500">一号主仓库 (主存储)</span>
                    <span className="text-[#008060] font-bold">{(scannedProduct.inventory * 0.4).toFixed(0)} 件 / 在售</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/25 p-1 rounded border border-neutral-900">
                    <span className="text-neutral-500">二号备用仓 (分发站)</span>
                    <span className="text-[#008060] font-bold">{(scannedProduct.inventory * 0.6).toFixed(0)} 件 / 预留</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/25 p-1 rounded border border-neutral-900">
                    <span className="text-neutral-500">数据库校验密钥</span>
                    <span className="text-neutral-400">MD5: {scannedProduct.sku ? scannedProduct.sku.substring(0, 4) + '...9A' : 'E48...7F'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-0.5">
                  <button
                    onClick={() => {
                      setEditingProduct(scannedProduct);
                      closePreview();
                    }}
                    className="px-2.5 py-1 bg-[#38383A] hover:bg-neutral-800 text-white text-[9.5px] font-bold rounded border border-transparent transition-all cursor-pointer"
                  >
                    编辑商品
                  </button>
                  <button
                    onClick={() => {
                      setLightboxProduct(scannedProduct);
                    }}
                    className="px-2.5 py-1 bg-[#008060] hover:bg-opacity-90 text-white text-[9.5px] font-bold rounded transition-all cursor-pointer"
                  >
                    查看大图
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* RENDER DUAL SYSTEM WORKSPACE */}
      {desktopViewMode === 'table' ? (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden p-2.5 shadow-xs">
          {/* Fully dynamic DataGrid governed by schemas */}
          <DataGrid
            columns={productSchemaMeta.columns}
            records={filteredProducts}
            searchPlaceholder="检索商品标题、条码、品牌供应商、类型..."
            currencySymbol={currencySymbol}
            onRowClick={(p) => {
              setScannedProduct(p);
              togglePreview('product', p.id);
            }}
          />
        </div>
      ) : (
        /* ULTRA-LUXURIOUS GRID VIEW FEATURING GLASSCARD PARALLAX CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-10">
          
          {/* First block: Interactive futuristic placeholder to upload & initialize new item */}
          <div 
            onClick={() => setIsCreating(true)}
            className="group relative rounded-2xl border border-dashed border-neutral-300 hover:border-[#07C2E3] bg-white hover:bg-neutral-50 p-6 flex flex-col items-center justify-center text-center aspect-square shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer active:scale-99"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-100 group-hover:bg-[#07C2E3]/15 transition-all text-neutral-500 group-hover:text-[#07C2E3] flex items-center justify-center border border-neutral-200 group-hover:border-[#07C2E3]/30">
              <Plus className="w-5 h-5 group-hover:scale-110 duration-200" />
            </div>
            
            <h4 className="text-xs font-black tracking-tight text-neutral-900 mt-4">
              初始化新商品条目 / NEW PRODUCT
            </h4>
            <p className="text-[10px] text-neutral-400 mt-1 max-w-[180px] leading-relaxed">
              向多租户智能存储大盘提交并签名全新的数字商品库存配置包。
            </p>
          </div>

          {filteredProducts.map((p, pIdx) => {
            const priceText = currencySymbol + p.price.toFixed(2);
            const isScanned = scannedProduct?.id === p.id;
            
            return (
              <GlassCard3D
                key={p.id}
                title={p.title}
                description={p.vendor || 'Atelier Series'}
                tag={p.type || 'LUXURY ITEM'}
                isDark={false}
                accentColor={isScanned ? '#07C2E3' : '#777777'}
                delay={pIdx * 0.05}
                onClick={() => {
                  setScannedProduct(p);
                  togglePreview('product', p.id);
                }}
              >
                {/* Embedded focal visualization stage inside 3D Glass card */}
                <div 
                  onMouseEnter={() => setScannedProduct(p)}
                  className="relative aspect-square bg-[#F6F6F7] border border-neutral-200 rounded-lg flex items-center justify-center p-6 my-1.5 overflow-hidden group shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.7),transparent)] opacity-60 pointer-events-none" />
                  
                  {/* Glowing focus target overlays with neon color locks */}
                  {isScanned && (
                    <div className="absolute inset-2 border border-dashed border-[#07C2E3]/35 rounded-md animate-pulse pointer-events-none" />
                  )}

                  <div 
                    className="w-16 h-16 flex items-center justify-center text-neutral-900 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-1 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                    dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS[p.images[0] as keyof typeof MOCK_PRODUCT_SVGS] || MOCK_PRODUCT_SVGS.wallet }} 
                  />

                  {/* Stock counter indicators on the cards */}
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="text-[8px] font-mono font-bold bg-neutral-900 text-white border border-neutral-800 px-1.5 py-0.5 rounded shadow-sm">
                      STOCK {p.inventory}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="text-[8px] font-mono font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Sub-card actions panel */}
                <div className="flex items-center justify-between pt-1.5">
                  <div>
                    <span className="block text-[8.5px] font-bold text-neutral-400 font-mono tracking-widest uppercase mb-0.5">
                      ACTIVE SENSORY PRICE
                    </span>
                    <span className="text-sm font-black text-neutral-900 font-mono">
                      {priceText}
                    </span>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setScannedProduct(p);
                        setLightboxProduct(p);
                      }}
                      className="p-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-250 hover:border-neutral-350 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                      title="数智大图/分享图片"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(p);
                        closePreview();
                      }}
                      className="px-2.5 py-1.5 bg-neutral-905 bg-neutral-900 hover:bg-[#07C2E3] text-white hover:text-black text-[9.5px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      修改
                    </button>
                  </div>
                </div>
              </GlassCard3D>
            );
          })}
        </div>
      )}
    </div>
  );
}
