import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { customerZodSchema, customerSchemaMeta } from '../../../schemas';
import FormBuilder from '../../../components/ui/FormBuilder';

interface CustomerFormProps {
  onBack: () => void;
  onSubmit: (formData: any) => void;
}

export default function CustomerForm({ onBack, onSubmit }: CustomerFormProps) {
  return (
    <div className="max-w-xl mx-auto bg-white border border-neutral-250 rounded-lg p-5 shadow-md space-y-4 animate-fadeIn font-sans">
      <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-tight text-neutral-900">
            录入新的客户档案 (Record New Persona card)
          </h2>
          <p className="text-[10px] text-neutral-455 font-sans">
            根据 Zod CRM 数据规范进行完整性判定
          </p>
        </div>
      </div>

      <FormBuilder
        fields={customerSchemaMeta.fields}
        zodSchema={customerZodSchema}
        initialData={{ firstName: '', lastName: '', email: '', phone: '', segment: 'All', company: '', notes: '' }}
        onSubmit={onSubmit}
        onCancel={onBack}
        submitLabel="添加客户 (Add Customer Profile)"
      />
    </div>
  );
}
