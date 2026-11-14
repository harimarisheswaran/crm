import React from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Check, ShieldCheck, UserCheck } from 'lucide-react';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { user, switchRole, allDemoProfiles } = useAuth();

  const handleSelectRole = (roleKey) => {
    switchRole(roleKey);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Role Preview Switcher"
      subtitle="Experience EduPulse ERP from the perspective of each authenticated role"
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allDemoProfiles.map((profile) => {
          const isCurrent = user?.role === profile.role;
          const roleDef = ROLE_DEFINITIONS[profile.role] || { label: profile.role, badge: '' };

          return (
            <button
              key={profile.role}
              type="button"
              onClick={() => handleSelectRole(profile.role)}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                isCurrent
                  ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {profile.full_name}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3 mr-0.5" /> Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${roleDef.badge}`}>
                    {roleDef.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {profile.email}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <span>
          Role switching instantly adjusts navigation links, view permissions, and role-specific dashboard views.
        </span>
      </div>
    </Modal>
  );
};

