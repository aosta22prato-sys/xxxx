/**
 * Merchant backend control panel layout orchestrator
 */

import React from 'react';
import AdminLayout from '@/src/shopify_merchant/layouts/AdminLayout';

export default function MerchantPortal() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <AdminLayout />
    </div>
  );
}
