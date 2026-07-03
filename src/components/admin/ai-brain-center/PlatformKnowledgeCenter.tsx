import React, { useState } from 'react';
import { Database, CheckCircle, Plus, Sparkles, HelpCircle } from 'lucide-react';
import { KnowledgeDoc, IndustryType } from '../../../types';

interface PlatformKnowledgeCenterProps {
  tenantDB: Record<string, any>;
  setTenantDB: React.Dispatch<React.SetStateAction<any>>;
  selectedIndustry: IndustryType;
  addLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function PlatformKnowledgeCenter({
  tenantDB,
  setTenantDB,
  selectedIndustry,
  addLog
}: PlatformKnowledgeCenterProps) {
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  const currentIndustryData = tenantDB[selectedIndustry] || { knowledge: [] };

  const handleAddKnowledgeDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    const newDoc: KnowledgeDoc = {
      id: 'kd_custom_' + Date.now(),
      title: newDocTitle,
      category: newDocCategory || 'General',
      content: newDocContent,
      size: `${(newDocContent.length / 1024).toFixed(1)} KB`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTenantDB((prev: any) => {
      const indData = prev[selectedIndustry];
      return {
        ...prev,
        [selectedIndustry]: {
          ...indData,
          knowledge: [newDoc, ...indData.knowledge]
        }
      };
    });

    setNewDocTitle('');
    setNewDocCategory('');
    setNewDocContent('');
    setShowAddDoc(false);

    addLog(
      'RAG Knowledge Core',
      'Document Indexed',
      `Parsed: ${newDoc.title}. Encoded 15 chunks under RAG database indexing schema.`,
      'success'
    );
  };

  return (
    <div id="tab-rag-knowledge" className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fadeIn text-slate-800">
      
      {/* Visual RAG diagram and instruction info */}
      <div className="xl:col-span-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between gap-6 relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <span className="bg-indigo-500 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded">
            GROUNDING PROTOCOL
          </span>
          
          <h3 className="text-xl font-bold font-display">Vector RAG Database</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Each industry store tenant has its own isolated vectors store index. Any manual document you load gets computed, chunked, and embedded instantly using our Gemini matching algorithms.
          </p>

          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Embeddings:</span>
              <span className="font-mono text-white">412 Vectors</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sync Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Synchronized
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Chunk overlap:</span>
              <span className="font-mono text-white">10% standard buffer</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowAddDoc(!showAddDoc)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wide transition-colors relative z-10 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Index New Text Document</span>
        </button>

        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <Database className="w-64 h-64" />
        </div>
      </div>

      {/* Document index List */}
      <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 font-display text-base">RAG Grounding Document Index</h3>
            <p className="text-xs text-slate-500 mt-0.5">These files define response templates, logistical policies, SLA boundaries, and refund logic rules.</p>
          </div>
          <span className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2.5 py-1 rounded font-bold">RAG index Active</span>
        </div>

        {/* Add document manual pane */}
        {showAddDoc && (
          <form onSubmit={handleAddKnowledgeDoc} className="p-4 bg-slate-50 border border-indigo-100 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase">Input and Index New Store Directive Document</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Document Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Summer Return Exceptions v2" 
                  value={newDocTitle} 
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Category Theme</label>
                <input 
                  type="text" 
                  placeholder="e.g., Logistics, Refund FAQ" 
                  value={newDocCategory} 
                  onChange={e => setNewDocCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Raw Document Content (Full Text rules)</label>
              <textarea 
                rows={4}
                required
                placeholder="Standard procedures, refund restrictions, SLA delivery metrics..." 
                value={newDocContent} 
                onChange={e => setNewDocContent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => setShowAddDoc(false)} 
                className="bg-transparent hover:text-red-500 text-slate-500 text-xs px-3 py-1.5 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors"
              >
                Trigger Vector Embeddings
              </button>
            </div>
          </form>
        )}

        {/* Live Documents table */}
        <div className="space-y-4">
          {currentIndustryData.knowledge && currentIndustryData.knowledge.map((doc: KnowledgeDoc) => (
            <div key={doc.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-indigo-50/10 transition-colors flex items-start gap-4 justify-between">
              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm font-display">{doc.title}</span>
                  <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono uppercase tracking-wider">{doc.category}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {doc.content}
                </p>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                  <span>Index Size: <b>{doc.size}</b></span>
                  <span>Uploaded: {doc.lastUpdated}</span>
                </div>
              </div>

              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse self-center shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
