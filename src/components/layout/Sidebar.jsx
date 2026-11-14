import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Calendar,
  FileText,
  Library,
  Bus,
  UserCheck,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  School,
} from 'lucide-react';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, role, roleInfo, logout } = useAuth();
  const { school, announcements } = useData();
  const location = useLocation();

  // Navigation Items mapped to permissible roles
  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: role === 'teacher' ? '/teacher/dashboard'
          : role === 'student' ? '/student/dashboard'
          : role === 'parent' ? '/parent/dashboard'
          : role === 'accountant' ? '/accountant/dashboard'
          : role === 'receptionist' ? '/receptionist/dashboard'
          : '/admin/dashboard',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'accountant', 'receptionist', 'student', 'parent'],
    },
    {
      title: 'Students',
      icon: GraduationCap,
      path: '/students',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'receptionist'],
    },
    {
      title: 'Teachers',
      icon: Users,
      path: '/teachers',
      roles: ['super_admin', 'school_admin', 'principal'],
    },
    {
      title: 'Classes & Subjects',
      icon: BookOpen,
      path: '/classes',
      roles: ['super_admin', 'school_admin', 'principal'],
    },
    {
      title: 'Attendance',
      icon: CalendarCheck,
      path: '/attendance',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'receptionist', 'student', 'parent'],
    },
    {
      title: 'Fees & Finance',
      icon: CreditCard,
      path: '/fees',
      roles: ['super_admin', 'school_admin', 'accountant', 'principal', 'student', 'parent'],
    },
    {
      title: 'Examinations',
      icon: Award,
      path: '/examinations',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'],
    },
    {
      title: 'Timetable',
      icon: Calendar,
      path: '/timetables',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'],
    },
    {
      title: 'Homework',
      icon: FileText,
      path: '/homework',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'],
    },
    {
      title: 'Library',
      icon: Library,
      path: '/library',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'receptionist'],
    },
    {
      title: 'Transport',
      icon: Bus,
      path: '/transport',
      roles: ['super_admin', 'school_admin', 'principal', 'receptionist', 'parent', 'student'],
    },
    {
      title: 'Staff & HR',
      icon: UserCheck,
      path: '/staff',
      roles: ['super_admin', 'school_admin', 'principal'],
    },
    {
      title: 'Notice Board',
      icon: Megaphone,
      path: '/communication',
      roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'accountant', 'receptionist', 'student', 'parent'],
      badge: announcements?.length || null,
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      path: '/reports',
      roles: ['super_admin', 'school_admin', 'principal', 'accountant'],
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['super_admin', 'school_admin'],
    },
  ];

  // Filter items by current user role
  const allowedItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-navy-950 text-slate-300 flex flex-col border-r border-slate-800 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-navy-900/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 flex-shrink-0">
            <School className="w-5 h-5" />
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white text-base tracking-tight truncate leading-tight">
                EduPulse<span className="text-brand-400">ERP</span>
              </span>
              <span className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-semibold">
                {school?.name || 'Academy Portal'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Banner */}
      {isOpen && (
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 truncate">
              {roleInfo?.label || role}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            v2.4
          </span>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={!isOpen ? item.title : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {isOpen && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-navy-900/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 border border-slate-800">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
            alt={user?.full_name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-700"
          />
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.full_name}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

