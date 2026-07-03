import React, { useState } from "react";
import { Product, Collection } from "../types";
import { Plus, Tag, Layers, Trash2, CheckCircle, Package, CircleAlert, Sparkles, Image as ImageIcon } from "lucide-react";

interface ProductsProps {
  products: Product[];
  collections: Collection[];
  onProductChange: () => void;
}

export default function Products({ products, collections, onProductChange }: ProductsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState(49.0);
  const [cost, setCost] = useState(15.0);
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(100);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [imgUrl, setImgUrl] = useState("");
  
  // AI assist copywriter state
  const [generatingDescr, setGeneratingDescr] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      alert("Name and SKU are required");
      return;
    }

    const newProd: Partial<Product> = {
      name,
      title: name + " " + category,
      description,
      image: imgUrl || undefined,
      price: parseFloat(price.toString()) || 0,
      originalPrice: parseFloat((price * 1.25).toFixed(2)) || 0, // auto划线价
      cost: parseFloat(cost.toString()) || 0,
      sku: sku.toUpperCase(),
      barcode: "BAR-" + Math.floor(100000 + Math.random()*900000),
      stock: parseInt(stock.toString()) || 0,
      isTracked: true,
      type: category,
      status: "published",
      collections: ["c1"],
      variants: [{ name: "Options", options: ["Standard"] }],
      tags: [category, "New_Arrival"]
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      if (data.success) {
        onProductChange();
        setShowAddForm(false);
        // Clear fields
        setName("");
        setSku("");
        setImgUrl("");
        setDescription("");
        setPrice(49.0);
        setCost(15.0);
        setStock(100);
        alert("Product published statefully in database!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        onProductChange();
        alert("Product deleted statefully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const suggestAidescription = async () => {
    if (!name) {
      alert("Please enter a Product Name first before invoking AI Writer!");
      return;
    }
    setGeneratingDescr(true);
    try {
      // call sidekick chatbot directly under AI Copywriter Magic feature
      const res = await fetch("/api/sidekick/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a premium, professional ecommerce description in Chinese for a merchandise product named "${name}" in category "${category}". Keep it under 60 words and emphasize organic materials, high styling value and durability. Do not return markdown tags.`
        })
      });
      const data = await res.json();
      if (data.text) {
        setDescription(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingDescr(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action grid */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📦 商品中心 (Products Catalog Hub)</h2>
          <p className="text-xs text-gray-500 mt-1">Audit physical items, categorize collection criteria, and launch automated product layouts.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "取消发布" : "发布新商品 (Publish Product)"}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              SaaS Catalog Creator & AI Copywriter (发布新商品)
            </h3>
            <span className="text-[10px] text-gray-400">STATUS: published</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Product Name (商品名称)</label>
              <input
                type="text"
                placeholder="e.g. Medusa Organic Cotton Cap"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  // auto-generate mock SKU
                  if (e.target.value) {
                    setSku("MED-" + e.target.value.substring(0,4).toUpperCase() + "-" + Math.floor(100+Math.random()*900));
                  }
                }}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Product Unique SKU</label>
              <input
                type="text"
                placeholder="e.g. MED-CAP-ORG"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500 font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Classification Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              >
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Retail Sale Price (€)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Material Cost (€)</label>
              <input
                type="number"
                step="0.01"
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Initial Warehouse Inventory Stock</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-gray-700 block">Product Cover Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or leave empty for digital camera mock"
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="md:col-span-3 space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-700 block">Creative Copywriting Description</label>
                <button
                  type="button"
                  onClick={suggestAidescription}
                  disabled={generatingDescr}
                  className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 animate-spin duration-3000" />
                  {generatingDescr ? "Gemini Magic generating..." : "✨ AI Magic: 一键生成文案 (AI Magic)"}
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Craft unique luxury merchant stories..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded focus:outline-indigo-500 mt-1"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Publish and Save statefully
            </button>
          </div>
        </form>
      )}

      {/* Grid segments: Collections and products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Collections List */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 px-1">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-gray-900">系列系列 (Collections List)</h3>
          </div>

          <div className="space-y-3">
            {collections.map(col => (
              <div key={col.id} className="bg-white border border-gray-150 p-3 rounded-xl shadow-xs flex items-center gap-3">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-900 block truncate">{col.name}</span>
                  <span className="text-[9px] text-gray-500 font-mono block">Cond: {col.conditions}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-lg">
            <h4 className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              <CircleAlert className="w-3.5 h-3.5 text-amber-500" />
              Auto Condition Triggers
            </h4>
            <p className="text-[10px] text-amber-700 mt-1">
              Medusa dynamic collection tables automatically parse incoming product tags for instantaneous categorizing.
            </p>
          </div>
        </div>

        {/* Right Side: Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-1.5 px-1 justify-between">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900 font-sans">商品总表 (Physical Catalogue)</h3>
            </div>
            <span className="text-[11px] text-gray-505 font-semibold bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              {products.length} products listed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between group hover:border-indigo-200 transition-all">
                
                {/* Product details */}
                <div className="p-4 flex gap-4">
                  <div className="w-20 h-20 shrink-0 border border-gray-100 rounded-lg overflow-hidden relative bg-gray-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.stock <= 10 && (
                      <span className="absolute bottom-1 left-1 right-1 bg-rose-600/90 text-white text-[8px] font-bold text-center rounded py-0.5 animate-pulse">
                        LOW STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 truncate block">{p.name}</span>
                      <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded uppercase shrink-0">
                        {p.type}
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                </div>

                {/* Pricing & Stock section toolbar */}
                <div className="bg-gray-50/70 border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Retail Price</span>
                      <span className="text-xs font-bold text-gray-900">€{p.price.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-gray-200 pl-3">
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Cost Ledger</span>
                      <span className="text-xs font-semibold text-gray-500">€{p.cost.toFixed(2)}</span>
                    </div>
                    <div className="border-l border-gray-200 pl-3">
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase">Inv Count</span>
                      <span className={`text-xs font-bold ${p.stock <= 10 ? "text-rose-600" : "text-gray-700"}`}>
                        {p.stock} units
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
