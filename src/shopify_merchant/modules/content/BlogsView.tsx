import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { BlogPost } from '../../database/blogs';
import { contentSchemas } from '../../schemas/content.schema';
import { Search, Plus, Trash2, Edit2, CheckCircle2, Bookmark, User, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function BlogsView() {
  const { blogs, addBlog, updateBlog, deleteBlog, hydrateAll } = useContentStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Chief Designer',
    coverImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'
  });

  useEffect(() => {
    hydrateAll();
  }, [hydrateAll]);

  const handleCreate = () => {
    const blogPayload: BlogPost = {
      id: 'blog_' + Date.now(),
      title: newBlog.title,
      slug: newBlog.slug || newBlog.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: newBlog.excerpt || 'Brand story item outline',
      content: newBlog.content || '<p>Write beautiful editorial layout details...</p>',
      author: newBlog.author,
      coverImageUrl: newBlog.coverImageUrl,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const runValidation = contentSchemas.blog.validate(blogPayload);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    addBlog(blogPayload);
    setNewBlog({ title: '', slug: '', excerpt: '', content: '', author: 'Chief Designer', coverImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' });
    setValidationError(null);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    const runValidation = contentSchemas.blog.validate(editingPost);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    updateBlog(editingPost.id, editingPost);
    setEditingPost(null);
    setValidationError(null);
  };

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search blog records, design logs, articles..."
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
          <span>Write Brand Journal</span>
        </button>
      </div>

      {/* Grid of Journal Blogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(b => (
          <div key={b.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between">
            {editingPost?.id === b.id ? (
              <div className="p-4 space-y-3.5 text-xs">
                <h4 className="font-bold text-neutral-900 font-mono uppercase">EDIT JOURNAL ARTICLE</h4>
                <div className="space-y-2.5">
                  <div className="flex flex-col">
                    <label className="font-semibold mb-0.5">Post Title *</label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                      className="border border-neutral-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-0.5">Slug</label>
                    <input
                      type="text"
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="border border-neutral-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-0.5">Brief Excerpt</label>
                    <input
                      type="text"
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, excerpt: e.target.value }) : null)}
                      className="border border-neutral-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-0.5">Body Layout (HTML)</label>
                    <textarea
                      rows={5}
                      value={editingPost.content}
                      onChange={(e) => setEditingPost(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                      className="border border-neutral-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>
                {validationError && <p className="text-red-500 text-[11px] font-mono">{validationError}</p>}
                <div className="flex space-x-2 pt-2">
                  <button onClick={handleSaveEdit} className="px-3.5 py-1.5 bg-black text-white rounded font-medium hover:bg-neutral-800 cursor-pointer">Save Changes</button>
                  <button onClick={() => { setEditingPost(null); setValidationError(null); }} className="px-3 py-1.5 border border-neutral-300 rounded hover:bg-neutral-50 cursor-pointer">Discard</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {b.coverImageUrl && (
                    <img referrerPolicy="no-referrer" src={b.coverImageUrl} alt={b.title} className="w-full h-40 object-cover border-b" />
                  )}
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-[9px] text-neutral-400 font-mono tracking-wider">
                      <span className="flex items-center space-x-0.5"><User className="w-3.5 h-3.5" /> <span>{b.author}</span></span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5"><Clock className="w-3.5 h-3.5" /> <span>{b.createdAt.split('T')[0]}</span></span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 tracking-tight leading-snug">{b.title}</h3>
                    <p className="text-neutral-500 line-clamp-3 leading-relaxed">{b.excerpt}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between mt-3 text-xs">
                  <span className="text-[10px] bg-neutral-105 text-[#333] px-2 py-0.5 rounded font-mono uppercase tracking-wider">{b.status}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingPost({ ...b })}
                      className="p-1 px-2 border rounded hover:bg-neutral-50 flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-neutral-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteBlog(b.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 font-mono uppercase">Write New Journal Post</h3>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded">
                {validationError}
              </div>
            )}
            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Journal Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Fabric Textures from Brussels"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Brief Excerpt *</label>
                <input
                  type="text"
                  placeholder="e.g., An elaborate breakdown of our silk variants..."
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Author Credit</label>
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5"
                />
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
                Publish Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
