import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'indigo' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  className = '' 
}) => {
  const styles = {
    neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-300',
    success: 'bg-[#e3f9e5] text-emerald-800 border border-emerald-300',
    warning: 'bg-[#fcf9f2] text-amber-800 border border-amber-300',
    error: 'bg-red-50 text-red-700 border border-red-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    slate: 'bg-neutral-900 text-white font-mono',
  };

  return (
    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded inline-flex items-center tracking-wider leading-none ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
