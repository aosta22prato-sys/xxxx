import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  changeText?: string;
  isPositive?: boolean;
  className?: string;
  extraIcon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  changeText,
  isPositive = true,
  className = '',
  extraIcon,
}) => {
  return (
    <div className={`bg-white border border-neutral-200 rounded-lg p-4 shadow-sm flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">{label}</span>
        {extraIcon && <div className="text-neutral-400">{extraIcon}</div>}
      </div>
      <div className="mt-2.5">
        <h3 className="text-xl font-bold text-neutral-900 font-mono tracking-tight leading-none">{value}</h3>
        {changeText && (
          <p className="text-[10px] mt-1 flex items-center space-x-1.5">
            <span className={`font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isPositive ? '↑' : '↓'} {changeText}
            </span>
            <span className="text-neutral-400">vs last cycle</span>
          </p>
        )}
      </div>
    </div>
  );
};
