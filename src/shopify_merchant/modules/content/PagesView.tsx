import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { StaticPage } from '../../database/pages';
import { contentSchemas } from '../../schemas/content.schema';
import { Search, Plus, Trash2, Edit3, Save, FileSignature, Layout } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function PagesView() {
  const { pages, addPage, updatePage, deletePage, hydrateAll } = useContentStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    template: 'default' as StaticPage['template'],
    metaTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const handleCreate = () => {
    const pagePayload: StaticPage = {
      id: 'page_' + Date.now(),
      title: newPage.title,
      slug: newPage.slug || newPage.title.toLowerCase().replace(/\s+/g, '-'),
      content: newPage.content || '<p>Default bespoke page content goes here...</p>',
      template: newPage.template,
      metaTitle: newPage.metaTitle || `${newPage.title} | Atelier Noir`,
      metaDescription: newPage.metaDescription || `Bespoke details regarding ${newPage.title}.`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const runValidation = contentSchemas.page.validate(pagePayload);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    addPage(pagePayload);
    setNewPage({ title: '', slug: '', content: '', template: 'default', metaTitle: '', metaDescription: '' });
    setValidationError(null);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingPage) return;
    const runValidation = contentSchemas.page.validate(editingPage);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    updatePage(editingPage.id, editingPage);
    setEditingPage(null);
    setValidationError(null);
  };

  const filtered = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Upper Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search custom static pages, legal policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-250 rounded-lg px-3 py-1.5 pl-9 text-xs focus:ring-1 focus:ring-black focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-3.5 py-1.8 text-xs font-medium rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Custom Page</span>
        </button>
      </div>

      {filtered.map(p => (
        <div key={p.id} className="bg-white border border-neutral-200 rounded-lg p-3 shadow-xs space-y-3">
          {editingPage?.id === p.id ? (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Page Title *</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                    className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">URL Slug *</label>
                  <div className="flex border border-neutral-300 rounded overflow-hidden">
                    <span className="bg-neutral-50 border-r text-[10px] text-neutral-500 font-mono px-2 py-1.5 flex items-center">/pages/</span>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="border-0 flex-1 px-2.5 py-1.5 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">HTML Content</label>
                <textarea
                  rows={4}
                  value={editingPage.content}
                  onChange={(e) => setEditingPage(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Theme Template</label>
                  <select
                    value={editingPage.template}
                    onChange={(e) => setEditingPage(prev => prev ? ({ ...prev, template: e.target.value as StaticPage['template'] }) : null)}
                    className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none"
                  >
                    <option value="default">Default layout</option>
                    <option value="contact">Bespoke Concierge</option>
                    <option value="landing-page">Landing Page variant</option>
                    <option value="about-us">Brand History profile</option>
                  </select>
                </div>
                <div className="flex flex-col col-span-2">
                  <label className="font-semibold mb-1">SEO Title Accent</label>
                  <input
                    type="text"
                    value={editingPage.metaTitle}
                    onChange={(e) => setEditingPage(prev => prev ? ({ ...prev, metaTitle: e.target.value }) : null)}
                    className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {validationError && (
                <div className="text-red-500 text-xs font-mono">{validationError}</div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1 font-semibold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Commit Save</span>
                </button>
                <button
                  onClick={() => { setEditingPage(null); setValidationError(null); }}
                  className="px-3 py-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-neutral-900 text-sm font-sans">{p.title}</span>
                  <Badge variant="neutral">{p.template}</Badge>
                </div>
                <div className="flex items-center space-x-3 text-neutral-450 font-mono text-[9px] uppercase tracking-wider">
                  <span>URL Slug: /pages/{p.slug}</span>
                  <span>•</span>
                  <span>Created: {p.createdAt.split('T')[0]}</span>
                </div>
                <p className="text-neutral-500 line-clamp-2 text-[11px] max-w-2xl" dangerouslySetInnerHTML={{ __html: p.content }}></p>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => { setEditingPage({ ...p }); setValidationError(null); }}
                  className="p-1 px-2.5 border border-neutral-250 rounded text-neutral-600 hover:bg-neutral-50 hover:text-black flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={() => deletePage(p.id)}
                  className="p-1 px-2 text-red-500 hover:bg-red-55 border border-transparent rounded hover:border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 font-mono uppercase">Add Custom Page Slot</h3>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded">
                {validationError}
              </div>
            )}
            <div className="space-y-3 text-xs">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">Page Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Autumn Bespoke Wear Guide"
                  value={newPage.title}
                  onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">URL Slug (leave blank to auto-generate)</label>
                <input
                  type="text"
                  placeholder="e.g., wear-guide"
                  value={newPage.slug}
                  onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">Primary template styling</label>
                <select
                  value={newPage.template}
                  onChange={(e) => setNewPage(prev => ({ ...prev, template: e.target.value as StaticPage['template'] }))}
                  className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none"
                >
                  <option value="default">Default generic</option>
                  <option value="contact">Concierge Mailer form</option>
                  <option value="landing-page">Bespoke campaign landing page</option>
                  <option value="about-us">Brand heritage storyline</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-3.5 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                Publish Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
