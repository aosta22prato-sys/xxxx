import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { NavigationMenu, NavigationItem } from '../../database/navigation';
import { contentSchemas } from '../../schemas/content.schema';
import { Search, Plus, Trash2, Edit2, MoveDown, MoveUp, Link, Compass } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function NavigationView() {
  const { navigation, addNavigation, updateNavigation, deleteNavigation, hydrateAll } = useContentStore();
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newMenu, setNewMenu] = useState({
    title: '',
    handle: ''
  });

  const [newLink, setNewLink] = useState({
    label: '',
    url: '/'
  });

  useEffect(() => {
    hydrateAll();
    if (navigation.length > 0 && !activeMenuId) {
      setActiveMenuId(navigation[0].id);
    }
  }, [navigation, activeMenuId, hydrateAll]);

  const activeMenu = navigation.find(n => n.id === activeMenuId);

  const handleCreateMenu = () => {
    const payload: NavigationMenu = {
      id: 'nav_' + Date.now(),
      title: newMenu.title,
      handle: newMenu.handle || newMenu.title.toLowerCase().replace(/\s+/g, '-'),
      status: 'active',
      items: [
        { id: 'item_init_1', label: 'Home', url: '/' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const runValidation = contentSchemas.navigation.validate(payload);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    addNavigation(payload);
    setActiveMenuId(payload.id);
    setNewMenu({ title: '', handle: '' });
    setValidationError(null);
    setShowAddMenuModal(false);
  };

  const handleAddLinkToActiveMenu = () => {
    if (!activeMenu) return;

    if (!newLink.label.trim()) {
      alert('Link tag label cannot be empty!');
      return;
    }

    const brandNewItem: NavigationItem = {
      id: 'item_' + Date.now(),
      label: newLink.label,
      url: newLink.url
    };

    const updatedItems = [...activeMenu.items, brandNewItem];
    updateNavigation(activeMenu.id, { items: updatedItems });
    setNewLink({ label: '', url: '/' });
  };

  const handleDeleteLink = (itemId: string) => {
    if (!activeMenu) return;
    const updatedItems = activeMenu.items.filter(item => item.id !== itemId);
    updateNavigation(activeMenu.id, { items: updatedItems });
  };

  const moveLinkDirection = (index: number, direction: 'up' | 'down') => {
    if (!activeMenu) return;
    const newItems = [...activeMenu.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    updateNavigation(activeMenu.id, { items: newItems });
  };

  return (
    <div className="space-y-5 animate-fadeIn text-xs text-neutral-850">
      {/* Selector and Menu Controller */}
      <div className="flex bg-neutral-101 border p-2.5 rounded-lg items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#111]" />
          <span className="font-semibold text-neutral-800">Select Navigation Menu:</span>
          <select
            value={activeMenuId || ''}
            onChange={(e) => setActiveMenuId(e.target.value)}
            className="border border-neutral-300 rounded px-2 py-1 bg-white focus:outline-none"
          >
            {navigation.map(n => (
              <option key={n.id} value={n.id}>{n.title} (/{n.handle})</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1.5 shrink-0">
          <button
            onClick={() => setShowAddMenuModal(true)}
            className="bg-black text-white px-2.5 py-1 rounded hover:bg-neutral-800 cursor-pointer"
          >
            Create New List
          </button>
          {activeMenuId && navigation.length > 1 && (
            <button
              onClick={() => {
                deleteNavigation(activeMenuId);
                setActiveMenuId(navigation[0]?.id || null);
              }}
              className="text-red-500 border border-neutral-250 hover:bg-red-50 rounded px-2 py-1 cursor-pointer"
            >
              Delete List
            </button>
          )}
        </div>
      </div>

      {activeMenu ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Append Links Controller */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4 h-fit space-y-4 shadow-xs">
            <div>
              <h4 className="font-bold text-neutral-900 font-mono uppercase text-[11px] tracking-wider mb-0.5">APPEND MENU LINK</h4>
              <p className="text-[10px] text-neutral-450 font-mono leading-relaxed">Add a redirect link to the bottom of the active menu block.</p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="font-semibold mb-0.5 text-neutral-700">Link Tag / Label *</label>
                <input
                  type="text"
                  placeholder="e.g., Autumn Bespoke Wear Class"
                  value={newLink.label}
                  onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black text-[11px]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-0.5 text-neutral-700">Destination Route / URL *</label>
                <input
                  type="text"
                  placeholder="e.g., /pages/sizing-guides"
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <button
                onClick={handleAddLinkToActiveMenu}
                className="w-full bg-[#111111] text-white py-1.8 rounded font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Insert Link Element
              </button>
            </div>
          </div>

          {/* Links Ordering List */}
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-4 shadow-xs">
            <div>
              <h4 className="font-bold text-neutral-900 font-mono uppercase text-[11px] tracking-wider mb-0.5">MENU STRUCTURE & PATHS</h4>
              <p className="text-[10px] text-neutral-450 font-mono leading-relaxed">Customize redirects, handles, and ordering sequence for active menus.</p>
            </div>

            <div className="mt-4 border divide-y rounded-lg overflow-hidden bg-neutral-50/20">
              {activeMenu.items.map((item, index) => (
                <div key={item.id} className="flex p-3 items-center justify-between text-xs hover:bg-white transition-colors">
                  <div className="flex items-center space-x-2.5 truncate">
                    <Link className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-neutral-800 block truncate">{item.label}</span>
                      <span className="text-[10px] text-neutral-450 font-mono block truncate">{item.url}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => moveLinkDirection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 border rounded bg-white hover:bg-neutral-50 text-neutral-500 disabled:opacity-40 cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveLinkDirection(index, 'down')}
                      disabled={index === activeMenu.items.length - 1}
                      className="p-1 border rounded bg-white hover:bg-neutral-50 text-neutral-500 disabled:opacity-40 cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(item.id)}
                      className="p-1 text-red-500 border border-transparent rounded hover:border-red-150 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-mono text-center text-neutral-400 py-10">No active navigation menu. Please construct a menu list first.</p>
      )}

      {showAddMenuModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 font-mono uppercase">Create Custom Menu List</h3>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded">
                {validationError}
              </div>
            )}
            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Menu Title Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Upper Navbar menu"
                  value={newMenu.title}
                  onChange={(e) => setNewMenu(prev => ({ ...prev, title: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Menu identifier Handle (e.g., header-menu)</label>
                <input
                  type="text"
                  placeholder="e.g., header-menu"
                  value={newMenu.handle}
                  onChange={(e) => setNewMenu(prev => ({ ...prev, handle: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddMenuModal(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMenu}
                className="px-3.5 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                Commit Menu List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
