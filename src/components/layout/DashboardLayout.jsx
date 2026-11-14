import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { useData } from '../../context/DataContext';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const { school } = useData();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 h-full">
            <Sidebar isOpen={true} setIsOpen={setMobileSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <Header
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenRoleSwitcher={() => setRoleSwitcherOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white/50 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
          <div>
            © {new Date().getFullYear()} {school?.name || 'Oakridge International Academy'}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Database Connected</span>
            </span>
            <span>•</span>
            <span>Enterprise Edition v2.4</span>
          </div>
        </footer>
      </div>

      {/* Interactive Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleSwitcherOpen}
        onClose={() => setRoleSwitcherOpen(false)}
      />
    </div>
  );
};

