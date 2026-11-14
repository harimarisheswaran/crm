import React, { useState } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Menu,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Shield,
  LogOut,
  Calendar,
} from 'lucide-react';

export const Header = ({ onToggleSidebar, onOpenRoleSwitcher }) => {
  const { user, role, logout } = useAuth();
  const { school, notifications, academicYears } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentYear = academicYears?.find((y) => y.is_current)?.name || '2024 - 2025';
  const unreadCount = notifications?.filter((n) => !n.is_read)?.length || 0;
  const roleDef = ROLE_DEFINITIONS[role] || { label: role, badge: 'bg-slate-100 text-slate-800' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
      {/* Left: Mobile Menu Toggle & Academic Year */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>AY: {currentYear}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Right: Actions, Role Switcher, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Button - Prominent & Interactive! */}
        <button
          type="button"
          onClick={onOpenRoleSwitcher}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 text-brand-700 hover:border-brand-400 hover:shadow-sm rounded-xl text-xs font-semibold transition-all group"
          title="Click to switch preview roles (Super Admin, Teacher, Student, Parent, etc.)"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600 group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline">Viewing as:</span>
          <span className={`px-2 py-0.5 rounded-md ${roleDef.badge}`}>
            {roleDef.label}
          </span>
          <ChevronDown className="w-3 h-3 text-brand-500" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex gap-3 ${
                        !notif.is_read ? 'bg-brand-50/20' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.created_at}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden lg:flex flex-col text-left pr-1">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.full_name}
              </span>
              <span className="text-[10px] text-slate-500 capitalize leading-tight">
                {roleDef.label}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <UserCheck className="w-4 h-4 text-brand-600" />
                  <span>Switch Role</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

