import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'border-brand-600 text-brand-600 bg-brand-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

