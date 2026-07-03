/**
 * Reusable layout frameworks or components
 */

import React from 'react';

export interface CardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<CardProps> = ({ title, badge, children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">{title}</h4>
        {badge && (
          <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[9px] px-2 py-0.5 rounded font-mono font-extrabold uppercase">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
};
