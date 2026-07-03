/**
 * Chief Content Modular Orchestration Hub - Level 10 Separation compliant
 * Coordinates Files, Pages, Blog posts, Navigation menus, and Metaobjects registry.
 */

import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { FileText, FolderSync, FileImage, Link2, Landmark, Settings } from 'lucide-react';
import FilesView from './FilesView';
import PagesView from './PagesView';
import BlogsView from './BlogsView';
import NavigationView from './NavigationView';
import MetaobjectsView from './MetaobjectsView';

export default function ContentView() {
  const { hydrateAll } = useContentStore();
  const [activeTab, setActiveTab] = useState<'files' | 'pages' | 'blog' | 'navigation' | 'metaobjects'>('files');

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'files':
        return <FilesView />;
      case 'pages':
        return <PagesView />;
      case 'blog':
        return <BlogsView />;
      case 'navigation':
        return <NavigationView />;
      case 'metaobjects':
        return <MetaobjectsView />;
      default:
        return <FilesView />;
    }
  };

  const getTabClass = (tabName: typeof activeTab) => {
    const isCurrent = activeTab === tabName;
    return `flex items-center space-x-1.5 py-2.5 px-4 text-xs font-mono font-semibold uppercase border-b-2 tracking-tight transition-all cursor-pointer ${
      isCurrent 
        ? 'border-neutral-900 text-neutral-900 font-bold' 
        : 'border-transparent text-neutral-450 hover:text-neutral-700 hover:border-neutral-200'
    }`;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Module Title row Compliant with Shopify Admin aesthetic */}
      <div className="flex items-center justify-between border-b pb-3.5 border-neutral-150">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">内容资产</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">素材中心</h2>
        </div>
      </div>

      {/* Selector Tabs Row */}
      <div className="flex border-b border-neutral-200 overflow-x-auto space-x-1 scrollbar-none bg-neutral-50/10">
        <button onClick={() => setActiveTab('files')} className={getTabClass('files')}>
          <FileImage className="w-3.5 h-3.5 shrink-0" />
          <span>媒体素材</span>
        </button>
        <button onClick={() => setActiveTab('pages')} className={getTabClass('pages')}>
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>独立页面</span>
        </button>
        <button onClick={() => setActiveTab('blog')} className={getTabClass('blog')}>
          <Landmark className="w-3.5 h-3.5 shrink-0" />
          <span>博客文章</span>
        </button>
        <button onClick={() => setActiveTab('navigation')} className={getTabClass('navigation')}>
          <Link2 className="w-3.5 h-3.5 shrink-0" />
          <span>导航菜单</span>
        </button>
        <button onClick={() => setActiveTab('metaobjects')} className={getTabClass('metaobjects')}>
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span>元数据</span>
        </button>
      </div>

      {/* Main Container Viewport */}
      <div className="pt-2">
        {renderActiveSection()}
      </div>
    </div>
  );
}
export { ContentView };
