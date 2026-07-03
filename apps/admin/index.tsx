/**
 * Admin platform total backend layout orchestrator
 */

import React from 'react';
import SuperAdminCenter from '@/src/components/super_admin/SuperAdminCenter';

export default function AdminPortal(props: any) {
  const SuperAdminCenterComp = SuperAdminCenter as any;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans">
      <SuperAdminCenterComp {...props} />
    </div>
  );
}
