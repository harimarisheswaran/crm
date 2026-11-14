import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    // Status aliases
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partially_paid: 'bg-amber-50 text-amber-700 border-amber-200',
    pending: 'bg-blue-50 text-blue-700 border-blue-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    absent: 'bg-rose-50 text-rose-700 border-rose-200',
    late: 'bg-amber-50 text-amber-700 border-amber-200',
    half_day: 'bg-purple-50 text-purple-700 border-purple-200',
    excused: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const dotColors = {
    default: 'bg-slate-500',
    primary: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    paid: 'bg-emerald-500',
    partially_paid: 'bg-amber-500',
    pending: 'bg-blue-500',
    overdue: 'bg-rose-500',
    present: 'bg-emerald-500',
    absent: 'bg-rose-500',
    late: 'bg-amber-500',
  };

  const chosenVariant = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border capitalize ${chosenVariant} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-current'}`}
        />
      )}
      {children}
    </span>
  );
};

