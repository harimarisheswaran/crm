import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  icon: Icon,
  padding = true,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card transition-all duration-200 ${
        hover ? 'hover:shadow-card-hover hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || action || Icon) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
};

