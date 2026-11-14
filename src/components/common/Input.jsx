import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          required={required}
          className={`block w-full rounded-xl border text-sm transition-colors duration-150 py-2.5 ${
            Icon ? 'pl-9 pr-3' : 'px-3.5'
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20 text-rose-900'
              : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 bg-white text-slate-900'
          } focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  id,
  options = [],
  children,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={id}
        required={required}
        className={`block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm bg-white text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors duration-150 disabled:bg-slate-100 ${
          error ? 'border-rose-300 bg-rose-50/20 text-rose-900' : ''
        } ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  id,
  rows = 3,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={`block w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-sm bg-white text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors duration-150 disabled:bg-slate-100 ${
          error ? 'border-rose-300 bg-rose-50/20 text-rose-900' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

