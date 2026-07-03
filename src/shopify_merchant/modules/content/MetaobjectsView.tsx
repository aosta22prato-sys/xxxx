import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../stores/contentStore';
import { Metaobject, MetafieldDefinition } from '../../database/metaobjects';
import { contentSchemas } from '../../schemas/content.schema';
import { Search, Plus, Trash2, Edit2, Database, Key, LayoutGrid } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function MetaobjectsView() {
  const { metaobjects, addMetaobject, updateMetaobject, deleteMetaobject, hydrateAll } = useContentStore();
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [showAddDefinitionModal, setShowAddDefinitionModal] = useState(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newDef, setNewDef] = useState({
    name: '',
    handle: '',
    description: ''
  });

  const [newFields, setNewFields] = useState<MetafieldDefinition[]>([
    { key: 'title', name: 'Title / Headline', type: 'single_line_text_field', required: true }
  ]);

  const [entryValues, setEntryValues] = useState<Record<string, any>>({});

  useEffect(() => {
    hydrateAll();
    if (metaobjects.length > 0 && !activeModelId) {
      setActiveModelId(metaobjects[0].id);
    }
  }, [metaobjects, activeModelId, hydrateAll]);

  const activeModel = metaobjects.find(m => m.id === activeModelId);

  const handleCreateDefinition = () => {
    const payload: Metaobject = {
      id: 'meta_' + Date.now(),
      name: newDef.name,
      handle: newDef.handle || newDef.name.toLowerCase().replace(/\s+/g, '_'),
      description: newDef.description,
      status: 'active',
      fields: newFields,
      entries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const runValidation = contentSchemas.metaobject.validate(payload);
    if (!runValidation.success) {
      setValidationError(runValidation.errors?.[0] || 'Validation error');
      return;
    }

    addMetaobject(payload);
    setActiveModelId(payload.id);
    setNewDef({ name: '', handle: '', description: '' });
    setNewFields([{ key: 'title', name: 'Title / Headline', type: 'single_line_text_field', required: true }]);
    setValidationError(null);
    setShowAddDefinitionModal(false);
  };

  const handleAddEntry = () => {
    if (!activeModel) return;

    const brandNewEntry = {
      id: 'entry_' + Date.now(),
      status: 'active' as const,
      values: { ...entryValues },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedEntries = [brandNewEntry, ...activeModel.entries];
    updateMetaobject(activeModel.id, { entries: updatedEntries });
    setEntryValues({});
    setShowAddEntryModal(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!activeModel) return;
    const updatedEntries = activeModel.entries.filter(e => e.id !== entryId);
    updateMetaobject(activeModel.id, { entries: updatedEntries });
  };

  return (
    <div className="space-y-5 animate-fadeIn text-xs text-neutral-850">
      {/* Selection row */}
      <div className="flex bg-neutral-101 border p-2.5 rounded-lg items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#111]" />
          <span className="font-semibold text-neutral-800 font-mono">Metaobjects Type:</span>
          <select
            value={activeModelId || ''}
            onChange={(e) => setActiveModelId(e.target.value)}
            className="border border-neutral-300 rounded px-2 py-1 bg-white focus:outline-none"
          >
            {metaobjects.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.entries.length} records)</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1.5">
          <button
            onClick={() => setShowAddDefinitionModal(true)}
            className="bg-black text-white px-2.5 py-1 rounded hover:bg-neutral-800 cursor-pointer"
          >
            Create Metaobject Definition
          </button>
        </div>
      </div>

      {activeModel ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Metadata attributes list card */}
          <div className="bg-white border border-neutral-205 rounded-lg p-4 shadow-sm h-fit space-y-4">
            <div>
              <h4 className="font-bold text-[#111] font-mono uppercase text-[11px] tracking-wider mb-0.5">METAOBJECT DEFINITION</h4>
              <p className="text-[10px] text-neutral-450 leading-relaxed font-mono">Structure and attributes that define entries of this type.</p>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] bg-neutral-50 border p-3 rounded">
              <span className="text-[9px] uppercase tracking-wider text-neutral-450 font-bold block">Def Handle: {activeModel.handle}</span>
              <p className="text-neutral-600 italic line-clamp-2">{activeModel.description || 'No description provided.'}</p>
              <div className="h-[1px] bg-neutral-200 my-2"></div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-450 font-bold block mb-1">Declared Fields</span>
              <div className="space-y-1">
                {activeModel.fields.map(f => (
                  <div key={f.key} className="flex justify-between pl-1 border-l border-neutral-400">
                    <span className="text-neutral-700 font-bold">{f.name}</span>
                    <span className="text-neutral-400 text-[9px]">{f.type === 'single_line_text_field' ? 'text' : 'textarea'}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const initial: Record<string, any> = {};
                activeModel.fields.forEach(f => { initial[f.key] = ''; });
                setEntryValues(initial);
                setShowAddEntryModal(true);
              }}
              className="w-full text-center bg-black hover:bg-neutral-800 text-white rounded py-2 transition-colors font-medium cursor-pointer"
            >
              Add Entry Record
            </button>
          </div>

          {/* Record Entries List */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                  <h4 className="font-bold text-neutral-900 font-mono uppercase text-[11px] tracking-wider">METAOBJECT RECORDS ENTRIES</h4>
                  <p className="text-[10px] text-neutral-450 leading-relaxed font-mono">Real-time meta-records registered and queryable under custom sections.</p>
                </div>
                <Badge variant="success">{activeModel.entries.length} items</Badge>
              </div>

              {activeModel.entries.length > 0 ? (
                <div className="space-y-4 divide-y divide-neutral-100">
                  {activeModel.entries.map((ent, entIdx) => (
                    <div key={ent.id} className={`${entIdx > 0 ? 'pt-4' : ''} flex justify-between gap-3 text-xs`}>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-mono uppercase bg-neutral-105 text-[#111] p-0.5 px-2.5 rounded font-bold">ENTRY {ent.id.substring(6)}</span>
                          <span className="text-[9px] text-neutral-400 font-mono">Created: {ent.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2.5 border-l-2 border-neutral-300">
                          {activeModel.fields.map(f => (
                            <div key={f.key} className="space-y-0.5">
                              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-bold font-mono">{f.name}</span>
                              <p className="text-neutral-800 text-[11px] leading-relaxed font-mono">{ent.values[f.key] || <span className="text-neutral-400 italic font-mono">Empty</span>}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteEntry(ent.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 border hover:border-red-200 self-start rounded cursor-pointer"
                        title="Delete this record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-neutral-400 py-10 font-mono italic">No entries registered for this metaobject type. Please add a record!</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-mono text-center text-neutral-450 py-10">No active metaobject specifications. Create definitions first!</p>
      )}

      {showAddDefinitionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-900 font-mono uppercase">New Metaobject Schema Definition</h3>
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded">
                {validationError}
              </div>
            )}
            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Model Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Fabric Material Matrix"
                  value={newDef.name}
                  onChange={(e) => setNewDef(prev => ({ ...prev, name: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Handle * (lowercase snake_case)</label>
                <input
                  type="text"
                  placeholder="e.g., fabric_materials"
                  value={newDef.handle}
                  onChange={(e) => setNewDef(prev => ({ ...prev, handle: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Model Description</label>
                <input
                  type="text"
                  placeholder="Briefly state intended placement of these elements..."
                  value={newDef.description}
                  onChange={(e) => setNewDef(prev => ({ ...prev, description: e.target.value }))}
                  className="border border-neutral-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="border-t pt-2 space-y-2.5">
                <span className="font-bold text-[10px] font-mono uppercase text-neutral-500 block">SCHEMA FIELDS DEFINITION</span>
                <div className="space-y-2">
                  {newFields.map((field, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].key = e.target.value.toLowerCase().replace(/\s+/g, '_');
                          setNewFields(updated);
                        }}
                        className="border border-neutral-350 rounded px-2 py-1 w-24 font-mono text-[10px]"
                      />
                      <input
                        type="text"
                        placeholder="Label Name"
                        value={field.name}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].name = e.target.value;
                          setNewFields(updated);
                        }}
                        className="border border-neutral-350 rounded px-2 py-1 flex-1 font-mono text-[10px]"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].type = e.target.value as any;
                          setNewFields(updated);
                        }}
                        className="border border-neutral-350 rounded text-[10px] py-1"
                      >
                        <option value="single_line_text_field">Text</option>
                        <option value="multi_line_text_field">Paragraph</option>
                      </select>
                      {newFields.length > 1 && (
                        <button
                          onClick={() => setNewFields(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 p-1 rounded font-bold hover:bg-neutral-50 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setNewFields(prev => [...prev, { key: '', name: '', type: 'single_line_text_field', required: true }])}
                    className="text-indigo-600 font-semibold text-[10px] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>+ Append Attributes Field</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddDefinitionModal(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDefinition}
                className="px-3.5 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                Publish Type Definition
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEntryModal && activeModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4.5 space-y-4 border shadow-2xl">
            <h3 className="text-sm font-bold text-[#111] font-mono uppercase">Add {activeModel.name} Entry Record</h3>
            <div className="space-y-3.5 text-xs">
              {activeModel.fields.map(f => (
                <div key={f.key} className="flex flex-col">
                  <label className="font-semibold mb-1 text-neutral-700">{f.name} {f.required && '*'}</label>
                  {f.type === 'multi_line_text_field' ? (
                    <textarea
                      rows={3}
                      placeholder={`Enter full text detail description ...`}
                      value={entryValues[f.key] || ''}
                      onChange={(e) => setEntryValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter ${f.name} content ...`}
                      value={entryValues[f.key] || ''}
                      onChange={(e) => setEntryValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="border border-neutral-300 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="px-3.5 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                Insert Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
