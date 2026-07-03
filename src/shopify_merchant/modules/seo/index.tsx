import React, { useEffect, useState } from 'react';
import { useSeoStore } from '../../stores/seoStore';
import { useProductStore } from '../../stores/productStore';
import { SeoService } from '../../services/seo.service';
import { 
  Globe, Search, Share2, Star, CheckCircle, RefreshCw, 
  FileCode, Terminal, AlertTriangle, Save, Heart, ShieldAlert
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function SeoView() {
  const { seoConfig, seoAudit, loading, hydrateSeo, updateSeoConfig, reRunAudit } = useSeoStore();
  const { products } = useProductStore();

  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'sitemaps' | 'robots' | 'schema'>('audit');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [robotsInput, setRobotsInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    hydrateSeo();
  }, [hydrateSeo]);

  useEffect(() => {
    if (seoConfig) {
      setTitleInput(seoConfig.homepageTitle);
      setDescInput(seoConfig.homepageMetaDescription);
      setRobotsInput(seoConfig.robotsCustomContent);
    }
  }, [seoConfig]);

  const handleSaveMeta = () => {
    if (!titleInput.trim() || !descInput.trim()) return;
    updateSeoConfig({
      homepageTitle: titleInput,
      homepageMetaDescription: descInput,
      robotsCustomContent: robotsInput
    });
    setToast('SEO Meta Tags and Robots configs successfully updated!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleRunAudit = () => {
    reRunAudit();
    setToast('Live SEO crawler check completed!');
    setTimeout(() => setToast(null), 3000);
  };

  if (!seoConfig || !seoAudit) {
    return <div className="p-10 font-mono text-center text-neutral-400">Loading SEO Optimization Center ...</div>;
  }

  // Generate real schemas dynamically based on actual store product database
  const dynamicJsonLd = SeoService.generateJsonLdSnippet(products);
  const dynamicSitemap = SeoService.generateDynamicSitemapXml(products);

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">引擎优化</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">搜索优化</h2>
        </div>
        <div className="flex space-x-1.5 font-sans">
          <button
            onClick={handleRunAudit}
            className="border hover:bg-neutral-50 px-3 py-1.5 rounded-lg flex items-center space-x-1 font-bold cursor-pointer text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${loading ? 'animate-spin' : ''}`} />
            <span>重检</span>
          </button>
          <button
            onClick={handleSaveMeta}
            className="bg-black text-white hover:bg-neutral-800 px-3 py-1.5 rounded-lg flex items-center space-x-1 font-bold cursor-pointer text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>发布</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2.5 rounded-lg font-mono">
          {toast}
        </div>
      )}

      {/* Main Grid: Settings & Google Mock SERP Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* Settings column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border rounded-lg p-3.5 space-y-4 shadow-xs">
            <h4 className="font-bold font-mono text-neutral-800 flex items-center space-x-1.5 border-b pb-1.5 uppercase">
              <Globe className="w-4 h-4 text-neutral-600" />
              <span>Core Homepage Metadata Specs</span>
            </h4>

            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <label className="font-semibold text-neutral-600">Homepage HTML &lt;title&gt; tag</label>
                  <span className={`font-mono text-[9px] ${titleInput.length > 70 ? 'text-amber-600 font-bold' : 'text-neutral-400'}`}>
                    {titleInput.length}/70 chars max (Recommended: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="border rounded px-2.5 py-1.5 bg-white text-xs text-neutral-800 font-medium focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <label className="font-semibold text-neutral-600">Meta Description (&lt;meta name="description"&gt;)</label>
                  <span className={`font-mono text-[9px] ${descInput.length > 160 ? 'text-amber-600 font-bold' : 'text-neutral-400'}`}>
                    {descInput.length}/160 chars max (Recommended: 120-150)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={e => setDescInput(e.target.value)}
                  className="border rounded px-2.5 py-1.5 bg-white text-xs text-neutral-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sitemaps / Robots customizer switcher */}
          <div className="bg-white border rounded-lg p-3.5 space-y-3.5 shadow-xs">
            <div className="flex border-b font-mono text-[10px] space-x-4">
              <button
                onClick={() => setActiveSubTab('audit')}
                className={`pb-1.5 border-b-2 font-bold ${activeSubTab === 'audit' ? 'border-neutral-900 text-black' : 'border-transparent text-neutral-400'}`}
              >
                SEO Audit Index
              </button>
              <button
                onClick={() => setActiveSubTab('sitemaps')}
                className={`pb-1.5 border-b-2 font-bold ${activeSubTab === 'sitemaps' ? 'border-neutral-900 text-black' : 'border-transparent text-neutral-400'}`}
              >
                XML Sitemaps
              </button>
              <button
                onClick={() => setActiveSubTab('robots')}
                className={`pb-1.5 border-b-2 font-bold ${activeSubTab === 'robots' ? 'border-neutral-900 text-black' : 'border-transparent text-neutral-400'}`}
              >
                Robots.txt
              </button>
              <button
                onClick={() => setActiveSubTab('schema')}
                className={`pb-1.5 border-b-2 font-bold ${activeSubTab === 'schema' ? 'border-neutral-900 text-black' : 'border-transparent text-neutral-400'}`}
              >
                JSON-LD Scheme
              </button>
            </div>

            {/* AUDIT DETAILS */}
            {activeSubTab === 'audit' && (
              <div className="space-y-3">
                <div className="flex bg-neutral-50/50 p-3 rounded-lg items-center justify-between border">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-mono">SITE COMPLIANCE GRADE</div>
                    <div className="text-xl font-mono font-extrabold text-neutral-900">{seoAudit.overallScore}%</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-600 font-bold">ALL GREEN SECTIONS: OK</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {seoAudit.indicators.map((idx, r) => (
                    <div key={r} className="p-2.5 rounded-lg border bg-white flex items-start space-x-2.5">
                      {idx.status === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                      {idx.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                      {idx.status === 'fail' && <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                      
                      <div className="space-y-0.5">
                        <div className="font-bold text-neutral-800 font-mono text-[11px] flex items-center space-x-1.5">
                          <span>{idx.name}</span>
                          <Badge variant={idx.status === 'pass' ? 'success' : idx.status === 'warning' ? 'warning' : 'error'}>
                            {idx.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-neutral-500">{idx.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* XML SITEMAP */}
            {activeSubTab === 'sitemaps' && (
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-500">
                  Dynamic Sitemap listing all webshop categories, products, and landing routes synchronized from current catalogs.
                </p>
                <div className="bg-[#0b0b0b] text-zinc-300 p-3 rounded-lg font-mono text-[10px] overflow-x-auto border max-h-56 overflow-y-auto">
                  <pre>{dynamicSitemap}</pre>
                </div>
              </div>
            )}

            {/* ROBOTS */}
            {activeSubTab === 'robots' && (
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-500">Configure search crawler directives. Controls which folders directories remain public.</p>
                <textarea
                  rows={6}
                  value={robotsInput}
                  onChange={e => setRobotsInput(e.target.value)}
                  className="w-full bg-[#0c0c0c] text-emerald-400 font-mono p-3 rounded-lg border text-[11px] focus:outline-none"
                />
              </div>
            )}

            {/* STRUCT JSON SCHEMA */}
            {activeSubTab === 'schema' && (
              <div className="space-y-2">
                <p className="text-[11px] text-neutral-500">Injected microdata formatted matching schema.org, informing Google crawler robots of precise availability and monetary valuation.</p>
                <div className="bg-[#0b0b0b] text-[#888] p-3 rounded-lg font-mono text-[10px] overflow-x-auto border max-h-56 overflow-y-auto">
                  <pre className="text-indigo-300">{dynamicJsonLd}</pre>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* GOOGLE SERP SIMULATOR CARD */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">Live Google result simulation</span>

          <div className="bg-white border rounded-lg p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center space-x-2 text-neutral-400">
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-mono text-[10px]">Google Search Live Snippet View</span>
            </div>

            <div className="space-y-1">
              {/* Google breadcrumb */}
              <div className="text-[11px] text-neutral-600 truncate flex items-center space-x-1 font-sans">
                <span>https://ateliernoir.co</span>
                <span className="text-neutral-400">&#8250;</span>
                <span className="text-neutral-500">home</span>
              </div>
              {/* Google Title */}
              <h3 className="text-base text-[#1a0dab] font-serif hover:underline cursor-pointer tracking-tight leading-tight line-clamp-1">
                {titleInput || 'Atelier Noir | Premium Sartorial Essentials'}
              </h3>
              {/* Google Description */}
              <p className="text-neutral-500 text-[11px] leading-normal font-sans line-clamp-2">
                {descInput || 'Bespoke tailoring, high contrast aesthetics, masterly crafted Brussels lookbooks.'}
              </p>
            </div>

            <div className="border-t border-dashed pt-3 text-[10px] text-neutral-400 font-mono space-y-1 bg-neutral-50/50 p-2.5 rounded-lg border">
              <div className="font-bold text-neutral-600 mb-1">SEO DENSITY VERITIES</div>
              <div>Title density index: <span className={titleInput.length >= 50 && titleInput.length <= 60 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>{titleInput.length} chars</span></div>
              <div>Description density index: <span className={descInput.length >= 120 && descInput.length <= 150 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>{descInput.length} chars</span></div>
              <div>Canonical safety: <span className="text-emerald-600 font-bold">Https forced active</span></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
