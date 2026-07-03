import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { orderZodSchema, orderSchemaMeta } from '../../../schemas';
import FormBuilder from '../../../components/ui/FormBuilder';

interface OrderFormProps {
  onBack: () => void;
  onSubmit: (formData: any) => void;
}

export default function OrderForm({ onBack, onSubmit }: OrderFormProps) {
  return (
    <div className="max-w-xl mx-auto bg-white border border-neutral-250 rounded-lg p-5 shadow-md space-y-4 animate-fadeIn">
      <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-tight text-neutral-900">
            手动登载新订单 (Manual Ledger Entry)
          </h2>
          <p className="text-[10px] text-neutral-455 font-sans">
            由 Zod 金融核算模型自动校验的数据表单输入端
          </p>
        </div>
      </div>

      <FormBuilder
        fields={orderSchemaMeta.fields}
        zodSchema={orderZodSchema}
        initialData={{ customerName: '', customerEmail: '', total: 450, paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled', notes: '' }}
        onSubmit={onSubmit}
        onCancel={onBack}
        submitLabel="记录订单 (Record Transaction)"
      />
    </div>
  );
}
