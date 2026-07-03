import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  extra, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden select-none ${className}`}
      {...props}
    >
      {(title || subtitle || extra) && (
        <div className="px-4 py-3 border-b border-[#eee] flex items-center justify-between">
          <div>
            {title && <h4 className="font-mono text-xs font-bold uppercase tracking-tight text-neutral-900">{title}</h4>}
            {subtitle && <p className="text-[10px] text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          {extra && <div className="text-right">{extra}</div>}
        </div>
      )}
      <div className="p-4 text-xs text-neutral-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};
