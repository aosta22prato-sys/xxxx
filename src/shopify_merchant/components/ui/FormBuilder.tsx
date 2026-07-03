/**
 * Dynamic FormBuilder - Level 10 Schema Driven Engine
 * Generates interactive inputs from schema fields metadata and validates using zod.
 */

import React, { useState } from 'react';
import { SchemaFieldMeta } from '../../schemas';
import { z } from 'zod';
import { Check, AlertTriangle } from 'lucide-react';

interface FormBuilderProps {
  fields: SchemaFieldMeta[];
  zodSchema: z.ZodObject<any>;
  initialData?: Record<string, any>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function FormBuilder({
  fields,
  zodSchema,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = '确认保存'
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    fields.forEach(f => {
      data[f.key] = initialData[f.key] ?? (f.type === 'number' || f.type === 'price' ? 0 : '');
    });
    return data;
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (key: string, val: any, type: string) => {
    let parsedVal = val;
    if (type === 'number' || type === 'price') {
      parsedVal = val === '' ? '' : Number(val);
    }
    setFormData(prev => ({ ...prev, [key]: parsedVal }));
    
    // Clear errors upon typing
    if (fieldErrors[key]) {
      setFieldErrors(prev => {
        const dup = { ...prev };
        delete dup[key];
        return dup;
      });
    }
    setValidationErrors([]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setFieldErrors({});

    try {
      // Validate with Zod
      const validated = zodSchema.parse(formData);
      onSubmit(validated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorsList: string[] = [];
        const errorMapping: Record<string, string> = {};
        
        err.issues.forEach(issue => {
          const pathKey = issue.path[0] as string;
          errorsList.push(`${issue.message}`);
          if (pathKey) {
            errorMapping[pathKey] = issue.message;
          }
        });
        
        setValidationErrors(errorsList);
        setFieldErrors(errorMapping);
      } else {
        setValidationErrors(['对不起，验证引擎遇到未知错乱 (Unknown validation breakdown)']);
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
      
      {/* Alert Banner for Validations Errors */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold font-mono">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>输入项有误，拒绝写入数据库：</span>
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-[10px] font-mono">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dynamic Form Controls Generator Grid */}
      <div className="grid grid-cols-1 gap-3">
        {fields.map((f) => {
          const hasError = !!fieldErrors[f.key];
          return (
            <div key={f.key} className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-mono font-bold text-neutral-500">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>

              {f.type === 'textarea' ? (
                <textarea
                  value={formData[f.key]}
                  onChange={(e) => handleFieldChange(f.key, e.target.value, f.type)}
                  placeholder={f.placeholder}
                  rows={3}
                  className={`w-full bg-neutral-50 px-3 py-2 border rounded font-sans text-xs focus:ring-1 focus:ring-black focus:outline-none transition-all ${
                    hasError ? 'border-red-500 bg-red-50/20' : 'border-neutral-200'
                  }`}
                />
              ) : f.type === 'select' || f.type === 'status' ? (
                <select
                  value={formData[f.key]}
                  onChange={(e) => handleFieldChange(f.key, e.target.value, f.type)}
                  className={`w-full bg-neutral-50 px-2.5 py-1.5 border rounded font-sans text-xs focus:ring-1 focus:ring-black focus:outline-none cursor-pointer ${
                    hasError ? 'border-red-500' : 'border-neutral-200'
                  }`}
                >
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'number' || f.type === 'price' ? 'number' : f.type}
                  step={f.type === 'price' ? '0.01' : '1'}
                  value={formData[f.key]}
                  onChange={(e) => handleFieldChange(f.key, e.target.value, f.type)}
                  placeholder={f.placeholder}
                  className={`w-full bg-neutral-50 px-3 py-1.5 border rounded font-sans text-xs focus:ring-1 focus:ring-black focus:outline-none transition-all ${
                    hasError ? 'border-red-500 bg-red-50/20' : 'border-neutral-200'
                  }`}
                />
              )}

              {/* Individual Field Validation Tip */}
              {hasError && (
                <p className="text-[9px] text-red-500 font-mono italic">{fieldErrors[f.key]}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Actions Row (Zustand layout actions aligned) */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100 shrink-0">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 hover:bg-neutral-100 text-neutral-600 rounded text-[10px] font-mono uppercase tracking-widest font-bold border border-neutral-200"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded text-[10px] font-mono uppercase tracking-widest shadow-md hover:shadow-lg transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
