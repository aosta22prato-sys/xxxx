import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { AssetFile } from '../../database/files';
import { contentSchemas } from '../../schemas/content.schema';
import { Search, Plus, Trash2, Image, FileText, Video, Eye, UploadCloud } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function FilesView() {
  const { files, addFile, deleteFile, hydrateAll } = useContentStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    url: '',
    type: 'image' as AssetFile['type'],
    size: '150 KB'
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const handleCreate = () => {
    const filePayload: AssetFile = {
      id: 'file_' + Date.now(),
      name: newFile.name || 'unnamed_asset.jpg',
      url: newFile.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      type: newFile.type,
      size: newFile.size,
      mimeType: newFile.type === 'image' ? 'image/jpeg' : newFile.type === 'video' ? 'video/mp4' : 'application/pdf',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const runValidation = contentSchemas.file.validate(filePayload);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    addFile(filePayload);
    setNewFile({ name: '', url: '', type: 'image', size: '150 KB' });
    setValidationError(null);
    setShowAddModal(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // Simulate drops
    const mockedNames = [
      'product_autumn_leather.png',
      'lookbook_editorial_v4.jpg',
      'invoice_v129.pdf',
      'promo_banner_brussels.mp4'
    ];
    const pickedName = mockedNames[Math.floor(Math.random() * mockedNames.length)];
    const types: AssetFile['type'][] = pickedName.endsWith('mp4') ? ['video'] : pickedName.endsWith('pdf') ? ['document'] : ['image'];

    const filePayload: AssetFile = {
      id: 'file_' + Date.now(),
      name: pickedName,
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
      type: types[0],
      size: Math.floor(Math.random() * 800) + 100 + ' KB',
      mimeType: types[0] === 'image' ? 'image/jpeg' : types[0] === 'video' ? 'video/mp4' : 'application/pdf',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addFile(filePayload);
  };

  const filtered = files.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* File Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search CDN files, images, documents..."
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
          <span>Upload File Assets</span>
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all ${
          dragOver ? 'border-indigo-500 bg-indigo-50/20' : 'border-neutral-250 bg-neutral-50/50'
        }`}
      >
        <UploadCloud className={`w-8 h-8 ${dragOver ? 'text-indigo-600' : 'text-neutral-400'} mb-2`} />
        <p className="text-xs font-semibold text-neutral-800">Drag & Drop files here, or click upload to register manually</p>
        <p className="text-[10px] text-neutral-400 font-mono mt-1">Accepts images, videos up to 20MB. Fully synced to CDN</p>
      </div>

      {/* Files List / Card Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden group shadow-sm flex flex-col h-full justify-between">
            {/* Visual Header */}
            <div className="bg-neutral-50 h-32 flex items-center justify-center relative overflow-hidden">
              {f.type === 'image' ? (
                <img referrerPolicy="no-referrer" src={f.url} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : f.type === 'video' ? (
                <div className="flex flex-col items-center space-y-1">
                  <Video className="w-7 h-7 text-neutral-500" />
                  <span className="text-[9px] text-neutral-400 font-mono">VIDEO ASSET</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <FileText className="w-7 h-7 text-neutral-500" />
                  <span className="text-[9px] text-neutral-400 font-mono">PDF DOCUMENT</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <Badge variant={f.type === 'image' ? 'success' : 'warning'}>{f.type}</Badge>
              </div>
            </div>

            {/* Meta Footer */}
            <div className="p-3 space-y-2">
              <div className="truncate">
                <span className="text-xs font-semibold text-neutral-900 block truncate" title={f.name}>{f.name}</span>
                <span className="text-[9px] text-neutral-450 font-mono block uppercase">Size: {f.size}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-500 hover:text-black flex items-center space-x-1 text-[10px] font-medium"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Asset</span>
                </a>
                <button
                  onClick={() => deleteFile(f.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete asset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 font-mono uppercase">Register Manual File</h3>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded">
                {validationError}
              </div>
            )}
            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">File Name *</label>
                <input
                  type="text"
                  placeholder="e.g., leather_finish_spec.jpg"
                  value={newFile.name}
                  onChange={(e) => setNewFile(prev => ({ ...prev, name: e.target.value }))}
                  className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">Media URL *</label>
                <input
                  type="text"
                  placeholder="Paste secure file link..."
                  value={newFile.url}
                  onChange={(e) => setNewFile(prev => ({ ...prev, url: e.target.value }))}
                  className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-neutral-700">File Type</label>
                <select
                  value={newFile.type}
                  onChange={(e) => setNewFile(prev => ({ ...prev, type: e.target.value as AssetFile['type'] }))}
                  className="border border-neutral-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="image">Image (jpg, png, webp)</option>
                  <option value="video">Video (mp4, webm)</option>
                  <option value="document">PDF Document</option>
                  <option value="other">Other Asset</option>
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
                Create Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
