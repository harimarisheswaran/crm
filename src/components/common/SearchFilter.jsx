import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const SearchFilter = ({
  searchValue = '',
  onSearchChange,
  placeholder = 'Search by name, ID, or keywords...',
  filters = [],
  filterValues = {},
  onFilterChange,
  onReset,
  children,
}) => {
  const hasActiveFilters =
    searchValue.trim() !== '' ||
    Object.values(filterValues).some((v) => v !== '' && v !== 'all' && v !== null);

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm mb-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="min-w-[130px]">
            <select
              value={filterValues[filter.id] || 'all'}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {children}

        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset Filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

