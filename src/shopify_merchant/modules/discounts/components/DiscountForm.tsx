import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { discountZodSchema, discountSchemaMeta } from '../../../schemas';
import FormBuilder from '../../../components/ui/FormBuilder';

interface DiscountFormProps {
  onBack: () => void;
  onSubmit: (formData: any) => void;
}

export default function DiscountForm({ onBack, onSubmit }: DiscountFormProps) {
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
          <h2 className="text-xs font-bold text-neutral-900">
            新增卡券
          </h2>
          <p className="text-[10px] text-neutral-450 font-sans">
            配置折扣卡券
          </p>
        </div>
      </div>

      <FormBuilder
        fields={discountSchemaMeta.fields}
        zodSchema={discountZodSchema}
        initialData={{ code: '', type: 'percentage', value: 15, status: 'active', minRequirement: 'Spend €100 min' }}
        onSubmit={onSubmit}
        onCancel={onBack}
        submitLabel="保存"
      />
    </div>
  );
}
