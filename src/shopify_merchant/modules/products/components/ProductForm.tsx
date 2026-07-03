import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Heart, Share2, MoreHorizontal, ShoppingCart, 
  ChevronDown, Check, Truck, RefreshCw, ShieldCheck, Lock, 
  Sparkles, Send, Plus, Minus, Upload, X
} from 'lucide-react';
import { Product } from '../../../types';
import { eventBus } from '../../../services/eventBus';

interface ProductFormProps {
  productToEdit?: Product | null;
  onBack: () => void;
  onSubmit: (formData: any) => void;
}

// Highly stylized headphone multi-angle custom SVGs to match high fidelity mockup wire
const HEADPHONE_GALLERY: Record<string, string> = {
  headphones_front: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-neutral-900"><path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9"/><path d="M4 14a2 2 0 00-2 2v3a2 2 0 002 2h2V14H4zm16 0h-2v7h2a2 2 0 002-2v-3a2-0-2z"/></svg>`,
  headphones_folded: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-neutral-900"><path d="M12 4a8 8 0 00-8 8v1M12 4a8 8 0 018 8v1"/><rect x="2" y="13" width="5" height="8" rx="1.5" /><rect x="17" y="13" width="5" height="8" rx="1.5" /><path d="M7 17h10"/></svg>`,
  headphones_case: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-neutral-900"><rect x="4" y="6" width="16" height="12" rx="3.5" /><path d="M4 12h16" /><path d="M12 6v6" /><path d="M2.5 12a9.5 9.5 0 0 0 1 3.5"/></svg>`,
  headphones_box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-neutral-900"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></svg>`
};

type MediaItem = { id: string; type: 'svg' | 'uploaded'; content: string; };

export default function ProductForm({ productToEdit, onBack, onSubmit }: ProductFormProps) {
  // Core product details
  const [title, setTitle] = useState(productToEdit?.title || 'SoundWave Pro Wireless Headphones');
  const [price, setPrice] = useState(productToEdit?.price || 129.00);
  const [compareAtPrice, setCompareAtPrice] = useState(productToEdit?.compareAtPrice || 199.00);
  const [description, setDescription] = useState(
    productToEdit?.description || 'Premium sound, all-day comfort. Active noise cancellation and up to 40 hours of battery life.'
  );
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: 'headphones_front', type: 'svg', content: 'headphones_front' },
    { id: 'headphones_folded', type: 'svg', content: 'headphones_folded' },
    { id: 'headphones_case', type: 'svg', content: 'headphones_case' },
    { id: 'headphones_box', type: 'svg', content: 'headphones_box' }
  ]);
  const [activeImage, setActiveImage] = useState<string>('headphones_front');
  const [inventory, setInventory] = useState(productToEdit?.inventory ?? 45);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(productToEdit?.status as any || 'active');
  const [sku, setSku] = useState(productToEdit?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Interactive client state counters
  const [liked, setLiked] = useState(false);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [showDescriptionFull, setShowDescriptionFull] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Sidebar state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiHistory, setAiHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hello! I am your AI Product Assistant. Enter any refinement commands or request a discount (e.g. "discount active price by 10%").' }
  ]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Five high-end luxury color variants (Monochrome matched swatches)
  const COLORS = [
    { label: 'Silver White', hex: '#e5e5e7', class: 'bg-[#e5e5e7]' },
    { label: 'Obsidian Black', hex: '#171717', class: 'bg-[#171717]' },
    { label: 'Midnight Blue', hex: '#1c2434', class: 'bg-[#1c2434]' },
    { label: 'Coral Pink', hex: '#f2cfc7', class: 'bg-[#f2cfc7]' },
    { label: 'Sage Green', hex: '#7c8e80', class: 'bg-[#7c8e80]' }
  ];

  const discountRate = compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const newMedia: MediaItem = {
              id: `uploaded-${Date.now()}-${Math.random()}`,
              type: 'uploaded',
              content: event.target?.result as string
            };
            setMediaItems(prev => [...prev, newMedia]);
            setActiveImage(newMedia.id);
            eventBus.emit('event:notifications', { text: '📷 Image uploaded successfully!' });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  // Delete uploaded image
  const deleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaItems(prev => prev.filter(item => item.id !== id));
    if (activeImage === id) {
      const remaining = mediaItems.filter(item => item.id !== id);
      if (remaining.length > 0) {
        setActiveImage(remaining[0].id);
      }
    }
    eventBus.emit('event:notifications', { text: '🗑️ Image removed' });
  };

  // Sync edits when form is saved
  const handleSave = () => {
    onSubmit({
      title,
      description,
      price,
      compareAtPrice,
      inventory,
      status,
      sku,
      images: ['headphones'], // Keep general SVG mapping for listings consistent with main dataset
    });
    eventBus.emit('event:notifications', { text: '💾 Product catalog has been synced smoothly.' });
    onBack();
  };

  // AI assistant simulation engine
  const handleAiCommand = async (command: string) => {
    if (!command.trim()) return;
    setIsAiGenerating(true);
    setAiHistory(prev => [...prev, { role: 'user', text: command }]);
    setAiMessage('');

    try {
      const resp = await fetch('/api/sidekick', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           message: `Optimize target product matching the following details. Current Title: "${title}", Price: ${price}, Compare At Price: ${compareAtPrice}, Description: "${description}". Command: "${command}". Return JSON only packed strictly between [RESULT] and [/RESULT] tags matching schema: {"title":"...","price":120,"compareAtPrice":199,"description":"..."} followed by a short summary in English explaining changes. Absolutely no Chinese allowed for response.`
         })
      });
      const data = await resp.json();
      const reply = data.text || '';

      const match = reply.match(/\[RESULT\](.*?)\[\/RESULT\]/s);
      if (match) {
        try {
          const parsed = JSON.parse(match[1].trim());
          if (parsed.title) setTitle(parsed.title);
          if (parsed.price !== undefined) setPrice(Number(parsed.price));
          if (parsed.compareAtPrice !== undefined) setCompareAtPrice(Number(parsed.compareAtPrice));
          if (parsed.description) setDescription(parsed.description);
        } catch (je) {
          console.error(je);
        }
      }

      const textReply = reply.replace(/\[RESULT\].*?\[\/RESULT\]/gs, '').trim();
      setAiHistory(prev => [...prev, { 
        role: 'assistant', 
        text: textReply || '✨ Custom optimizations have been successfully integrated into parameters.' 
      }]);
    } catch (err) {
      // Clean fallback
      if (command.toLowerCase().includes('discount') || command.toLowerCase().includes('price') || command.toLowerCase().includes('cheap')) {
        setPrice(Math.round(price * 0.9));
        setAiHistory(prev => [...prev, { role: 'assistant', text: '✨ Finished optimization. Reduced active price by 10% for improved conversions.' }]);
      } else {
        setTitle('SoundWave Pro Elite Headphones');
        setDescription('State-of-the-art acoustic architecture delivers immersive spatial audio and premium active noise cancellation.');
        setAiHistory(prev => [...prev, { role: 'assistant', text: '✨ Polished details. Upgraded title and optimized description for luxury brand positioning.' }]);
      }
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Get active media content
  const getActiveMedia = () => {
    const media = mediaItems.find(m => m.id === activeImage);
    if (!media) return HEADPHONE_GALLERY.headphones_front;
    
    if (media.type === 'svg') {
      return HEADPHONE_GALLERY[media.content] || HEADPHONE_GALLERY.headphones_front;
    }
    return media.content;
  };

  const activeMediaContent = getActiveMedia();
  const isActiveMediaUploaded = mediaItems.find(m => m.id === activeImage)?.type === 'uploaded';

  return (
    <div className="absolute inset-0 z-[45] md:relative md:inset-auto md:z-0 md:min-h-[85vh] bg-white text-xs flex flex-col font-sans text-neutral-800 overflow-hidden" id="product-form-pdp">
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-neutral-100 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="p-1 px-1.5 hover:bg-neutral-100 rounded text-neutral-800 flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-800" />
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsEditMode(!isEditMode)} 
            className={`px-3 py-1 font-extrabold text-[9.5px] tracking-wide rounded transition-all active:scale-95 cursor-pointer uppercase ${
              isEditMode ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
          >
            {isEditMode ? 'Preview' : 'Quick Edit'}
          </button>
        </div>

        <div className="flex items-center space-x-3 text-neutral-700">
          <button 
            type="button" 
            onClick={() => eventBus.emit('event:notifications', { text: '🔗 Copied sharable store link.' })}
            className="p-1 hover:bg-neutral-100 rounded-full cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5 text-neutral-800" />
          </button>
          
          <div className="relative">
            <ShoppingCart className="w-4.5 h-4.5 text-neutral-800" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-900 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          <button type="button" className="p-1 hover:bg-neutral-100 rounded-full">
            <MoreHorizontal className="w-4.5 h-4.5 text-neutral-800" />
          </button>
        </div>
      </div>

      {/* 2. Main Scroll Body Area */}
      <div className="flex-1 px-5 py-4 space-y-5 overflow-y-auto pb-28 bg-white">

        {/* --- Image and Gallery Gallery Section --- */}
        <div className="grid grid-cols-5 gap-3.5">
          
          {/* Main Visual Window (4 cols width) */}
          <div className="col-span-4 aspect-square bg-neutral-50 rounded-2xl flex items-center justify-center relative overflow-hidden group select-none border border-neutral-100 p-6">
            {/* Subtle premium vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_80%)] pointer-events-none opacity-80" />

            {/* Bestseller indicator badge */}
            <div className="absolute top-3.5 left-3.5 pointer-events-none">
              <span className="text-[9px] uppercase tracking-wider text-white bg-neutral-900 px-3 py-1 rounded-full font-bold shadow-sm">
                Bestseller
              </span>
            </div>

            {/* Favorite check */}
            <button 
              type="button"
              onClick={() => {
                setLiked(!liked);
                eventBus.emit('event:notifications', { text: !liked ? 'Added to featured recommendations.' : 'Removed from recommendation list.' });
              }}
              className="absolute top-3.5 right-3.5 p-1.5 bg-white hover:bg-neutral-50 rounded-full text-rose-500 active:scale-90 transition-all shadow-sm border border-neutral-100/50 cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'}`} />
            </button>

            {/* Carousel step metric overlay */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded-full">
              {mediaItems.findIndex(m => m.id === activeImage) + 1} / {mediaItems.length}
            </div>

            {/* High Fidelity Vector Render or Uploaded Image */}
            {isActiveMediaUploaded ? (
              <img 
                src={activeMediaContent} 
                alt="Product" 
                className="w-full h-full object-cover drop-shadow-md filter saturate-[1.02] transition-all duration-300 group-hover:scale-105 rounded-xl"
              />
            ) : (
              <div 
                className="w-28 h-28 flex items-center justify-center text-neutral-900 drop-shadow-md filter saturate-[1.02] transition-all duration-300 group-hover:scale-105"
                dangerouslySetInnerHTML={{ __html: activeMediaContent }}
              />
            )}
          </div>

          {/* Right side Thumbnails Gallery strip (1 col width) */}
          <div className="flex flex-col space-y-2 justify-between">
            <div className="space-y-1.5 flex flex-col flex-1 overflow-y-auto">
              {mediaItems.map((media, index) => {
                const isActive = activeImage === media.id;
                
                return (
                  <div key={media.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveImage(media.id)}
                      className={`aspect-square bg-white rounded-xl border flex items-center justify-center p-2 cursor-pointer transition-all active:scale-95 ${
                        isActive 
                          ? 'border-neutral-900 ring-1 ring-neutral-900/10 shadow-sm' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {media.type === 'svg' ? (
                        <div 
                          className="w-full h-full text-neutral-800 opacity-90" 
                          dangerouslySetInnerHTML={{ __html: HEADPHONE_GALLERY[media.content] || HEADPHONE_GALLERY.headphones_front }} 
                        />
                      ) : (
                        <img 
                          src={media.content} 
                          alt={`Thumbnail ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </button>
                    {media.type === 'uploaded' && (
                      <button
                        onClick={(e) => deleteImage(media.id, e)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-[#008060]/10 hover:bg-[#008060]/20 border border-[#008060]/30 rounded-xl flex flex-col items-center justify-center active:scale-95 transition-all text-[#008060] cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#008060]" />
              <span className="text-[7.5px] font-extrabold mt-0.5">Add Image</span>
            </button>
          </div>
        </div>

        {/* --- Primary Info Field Area --- */}
        {isEditMode ? (
          /* High Quality Custom Input Panel for Parameters adjustments */
          <div className="bg-neutral-50/50 border border-neutral-200/50 rounded-2xl p-4.5 space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">Product Name</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">Retail Price ($)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-extrabold uppercase block font-sans">Compare Price ($)</label>
                <input 
                  type="number" 
                  value={compareAtPrice} 
                  onChange={e => setCompareAtPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-500 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">Stock Units</label>
                <input 
                  type="number" 
                  value={inventory} 
                  onChange={e => setInventory(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">SKU Identity</label>
                <input 
                  type="text" 
                  value={sku} 
                  onChange={e => setSku(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-600 focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">Visibility status</label>
              <div className="flex gap-2">
                {['active', 'draft'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st as any)}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-[10px] cursor-pointer ${
                      status === st 
                        ? 'border-neutral-900 bg-neutral-900 text-white' 
                        : 'border-neutral-200 bg-white text-neutral-600'
                    }`}
                  >
                    {st === 'active' ? 'Active Storefront' : 'Draft Storage'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 font-extrabold uppercase block">Product Copywrite Description</label>
              <textarea 
                rows={3}
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-700 leading-relaxed focus:outline-none focus:border-neutral-900 resize-none font-sans"
              />
            </div>
          </div>
        ) : (
          /* Standard high-contrast aesthetic text mapping directly to mockup images */
          <div className="space-y-3.5">
            <div className="flex items-start justify-between">
              <h1 className="text-[19px] font-extrabold tracking-tight text-neutral-900 leading-tight flex-1 pr-4">
                {title}
              </h1>
              <div className="flex items-center space-x-1 py-1 px-1.5 bg-neutral-50 rounded text-neutral-500 select-none scale-95 shrink-0 border border-neutral-100">
                <span className="text-neutral-900 text-[11px]">★</span>
                <span className="font-extrabold text-[10px] text-neutral-800">4.8</span>
                <span className="text-neutral-400 text-[9px]">(1.2K)</span>
              </div>
            </div>

            {/* Price Line */}
            <div className="flex items-center space-x-3">
              <span className="text-[20px] font-extrabold text-neutral-900 font-mono leading-none">
                ${price.toFixed(2)}
              </span>
              <span className="text-xs text-neutral-400 font-mono line-through leading-none">
                ${compareAtPrice.toFixed(2)}
              </span>
              {discountRate > 0 && (
                <span className="text-[9.5px] font-extrabold text-[#ca3a3a] bg-[#fee2e2] px-2 py-0.5 rounded-md border border-red-100">
                  -{discountRate}%
                </span>
              )}
            </div>

            {/* Expandable Text Description */}
            <div className="space-y-1.5">
              <p className={`text-[10.5px] text-neutral-500 leading-relaxed font-sans ${showDescriptionFull ? '' : 'line-clamp-2'}`}>
                {description}
              </p>
              <button 
                type="button" 
                onClick={() => setShowDescriptionFull(!showDescriptionFull)}
                className="text-[10px] text-neutral-900 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                {showDescriptionFull ? 'Read less' : 'Read more'} <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showDescriptionFull ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* COLOR SELECTION STRIP */}
        <div className="space-y-3 pt-1 border-t border-neutral-100">
          <div className="text-[10.5px] font-sans">
            <span className="text-neutral-500">Color: </span>
            <span className="font-extrabold text-neutral-900">{COLORS[activeColorIdx].label}</span>
          </div>
          <div className="flex space-x-3">
            {COLORS.map((col, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setActiveColorIdx(idx);
                  eventBus.emit('event:notifications', { text: `Color selected: ${col.label}` });
                }}
                className={`w-7 h-7 rounded-full border flex items-center justify-center p-0.5 transition-all shadow-sm cursor-pointer ${
                  activeColorIdx === idx 
                    ? 'ring-2 ring-neutral-900 border-white scale-105' 
                    : 'border-neutral-200 hover:scale-105'
                }`}
              >
                <span className={`w-full h-full rounded-full ${col.class}`} />
              </button>
            ))}
          </div>
        </div>

        {/* QUANTITY AND STOCK STATUS INFO */}
        <div className="flex items-center space-x-5 pt-1 border-t border-neutral-100">
          
          {/* Minus/Plus counter block */}
          <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50/50 p-0.5 select-none shrink-0">
            <button 
              type="button"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="p-1 px-2 hover:bg-neutral-100 rounded text-neutral-600 active:scale-95 cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 font-mono font-bold text-neutral-800 text-[11px] min-w-[18px] text-center">
              {quantity}
            </span>
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 px-2 hover:bg-neutral-100 rounded text-neutral-600 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Authentic status markers from mock images */}
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-[#008060] font-extrabold text-[10.5px]">
              <span className="text-[12px] leading-none">✓</span>
              <span>In Stock</span>
            </div>
            <p className="text-[9px] text-neutral-400 mt-0.5 font-medium leading-none">
              Ships in 1-2 business days
            </p>
          </div>
        </div>

        {/* BRAND PROMISES GRID */}
        <div className="grid grid-cols-4 gap-1 bg-neutral-50/60 border border-neutral-200/40 rounded-xl p-2.5 text-[8px] text-neutral-500 font-sans tracking-tight">
          <div className="flex flex-col items-center text-center p-0.5 space-y-1">
            <Truck className="w-4 h-4 text-neutral-800" />
            <span className="font-bold text-neutral-800 leading-tight">Free Shipping</span>
            <span className="scale-90 text-neutral-400">On orders over $50</span>
          </div>
          <div className="flex flex-col items-center text-center p-0.5 space-y-1 border-l border-neutral-200/40">
            <RefreshCw className="w-4 h-4 text-neutral-800" />
            <span className="font-bold text-neutral-800 leading-tight">30-Day Returns</span>
            <span className="scale-90 text-neutral-400">Easy returns online</span>
          </div>
          <div className="flex flex-col items-center text-center p-0.5 space-y-1 border-l border-neutral-200/40">
            <ShieldCheck className="w-4 h-4 text-neutral-800" />
            <span className="font-bold text-neutral-800 leading-tight">2-Year Warranty</span>
            <span className="scale-90 text-neutral-400">Peace of mind</span>
          </div>
          <div className="flex flex-col items-center text-center p-0.5 space-y-1 border-l border-neutral-200/40">
            <Lock className="w-4 h-4 text-neutral-800" />
            <span className="font-bold text-[#008060] leading-tight">Secure Checkout</span>
            <span className="scale-90 text-neutral-400">100% secure</span>
          </div>
        </div>

        {/* TECHNICAL DETAILS CAPABILITIES */}
        <div className="border border-neutral-200/60 rounded-xl p-3.5 space-y-3 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
            <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-tight flex items-center gap-1">
              Key Features
            </span>
            <button
              type="button"
              onClick={() => handleAiCommand("Optimize these key features list for maximum technical value")}
              disabled={isAiGenerating}
              className="text-[9px] text-neutral-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-neutral-900" />
              <span>AI Feature Boost</span>
            </button>
          </div>
          <div className="space-y-2 font-sans font-medium text-[10px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="text-[#008060] font-bold">✓</span>
              <span>Active Noise Cancellation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#008060] font-bold">✓</span>
              <span>40 Hours Battery Life</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#008060] font-bold">✓</span>
              <span>Custom calibrated EQ modes via digital sidekick</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. AI Copilot Overlay drawer */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-end justify-center animate-fadeIn" onClick={() => setIsAiOpen(false)}>
          <div 
            className="w-full max-w-md bg-white border-t border-neutral-200 rounded-t-2xl p-4 flex flex-col shadow-xl z-55 animate-slideUp max-h-[70vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                <span className="text-xs font-bold text-neutral-900 font-sans font-mono tracking-tight">AI COPILOT</span>
              </div>
              <button 
                onClick={() => setIsAiOpen(false)}
                className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-mono text-[9px] active:scale-90 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Text log */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[160px] max-h-[260px] scrollbar-none">
              {aiHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-2.5 rounded-xl max-w-[85%] font-medium leading-relaxed font-sans text-[10px] ${
                    msg.role === 'user' 
                      ? 'bg-neutral-900 text-white rounded-br-none' 
                      : 'bg-neutral-50 text-neutral-800 rounded-bl-none border border-neutral-200/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiGenerating && (
                <div className="flex justify-start">
                  <div className="bg-neutral-50 text-neutral-500 p-2.5 rounded-xl text-[10px] flex items-center space-x-2 border border-neutral-200/50 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-800" />
                    <span>Processing premium refinements...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Shortcuts inside Drawer */}
            <div className="flex gap-1.5 overflow-x-auto pb-2.5 scrollbar-none select-none">
              <button
                type="button"
                onClick={() => handleAiCommand("Write a highly luxurious title under 5 words")}
                className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 text-[8.5px] font-sans font-bold text-neutral-700 shrink-0 cursor-pointer"
              >
                🪄 Enhance Title
              </button>
              <button
                type="button"
                onClick={() => handleAiCommand("Apply a 10% discount and polish copy to sound incredibly high-end")}
                className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 text-[8.5px] font-sans font-bold text-neutral-700 shrink-0 cursor-pointer"
              >
                🏷️ Discount & Copy Boost
              </button>
            </div>

            {/* Command Text box */}
            <form 
              onSubmit={e => {
                e.preventDefault();
                handleAiCommand(aiMessage);
              }}
              className="flex items-center space-x-2 border-t border-neutral-100 pt-2.5"
            >
              <input 
                type="text" 
                value={aiMessage}
                disabled={isAiGenerating}
                onChange={e => setAiMessage(e.target.value)}
                placeholder="Instruct the AI helper to auto-configure copy..."
                className="flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-neutral-900"
              />
              <button 
                type="submit"
                disabled={isAiGenerating}
                className="p-2 bg-neutral-900 hover:bg-neutral-850 text-white rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Elegant Persistent Bottom CTA Floating Shell Bar */}
      <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-neutral-200/60 px-4 py-3.5 z-30 flex items-center justify-between gap-2.5 flex-shrink-0">
        
        {/* AI design helper */}
        <button
          type="button"
          onClick={() => {
            setIsAiOpen(true);
            eventBus.emit('event:notifications', { text: '✨ Connected live to your AI assistant for product design.' });
          }}
          className="flex flex-col items-center justify-center py-2 px-3 border border-neutral-200/80 hover:border-neutral-300 rounded-full bg-white active:scale-95 transition-all text-neutral-800 font-bold shrink-0 min-w-[85px] h-10.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-neutral-900 mb-0.5 animate-pulse" />
          <span className="text-[8.5px] font-bold uppercase tracking-wide">AI 设计</span>
        </button>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 py-2.5 border border-neutral-900 text-neutral-950 hover:bg-neutral-50 font-bold rounded-full text-[10px] uppercase tracking-wide transition-all active:scale-95 h-10.5 flex items-center justify-center cursor-pointer"
        >
          保存
        </button>

        {/* Send product to friend */}
        <button
          type="button"
          onClick={() => {
            const shareText = `【Atelier Noir 商品推荐】\n商品: ${title}\n价格: $${price.toFixed(2)}\n库存: ${inventory} 件\n立即查看商品详情！`;
            navigator.clipboard.writeText(shareText)
              .then(() => {
                eventBus.emit('event:notifications', { text: '📨 商品信息已复制，可以发送给朋友了！' });
              })
              .catch(() => {
                eventBus.emit('event:notifications', { text: '❌ 复制失败，请重试' });
              });
          }}
          className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-900 font-bold text-white rounded-full text-[10px] uppercase tracking-wide shadow-sm flex items-center justify-center space-x-1 active:scale-95 transition-all h-10.5 cursor-pointer"
        >
          <span>发送给朋友</span>
        </button>
      </div>

    </div>
  );
}
