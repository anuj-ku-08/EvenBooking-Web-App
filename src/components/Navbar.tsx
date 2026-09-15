import React from 'react';
import { Ticket, Calendar, ShieldCheck, Moon, Sun, Radio, LogOut, FileText, Download } from 'lucide-react';
import { AdminUser } from '../types.ts';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  adminUser: AdminUser | null;
  onLogoutAdmin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  socketConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  adminUser,
  onLogoutAdmin,
  isDarkMode,
  onToggleDarkMode,
  socketConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5 -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                EventTicket
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Instant Booking & Real-Time Sync</p>
          </div>
        </button>

        {/* Center/Right Nav Navigation */}
        <nav className="flex items-center gap-1 sm:gap-3">
          {/* Real-time sync status pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              socketConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title={socketConnected ? 'Real-time WebSocket connection active' : 'Connecting to real-time server...'}
          >
            <span className="relative flex h-2 w-2">
              {socketConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  socketConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span className="text-[11px]">{socketConnected ? 'Live Sync' : 'Reconnecting...'}</span>
          </div>

          <button
            id="nav-explore-events"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              currentView === 'home' || currentView === 'event-detail'
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </span>
          </button>

          <button
            id="nav-my-bookings"
            onClick={() => onNavigate('my-bookings')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              currentView === 'my-bookings'
                ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4" />
              <span>My Bookings</span>
            </span>
          </button>

          <button
            id="nav-synopsis"
            onClick={() => onNavigate('synopsis')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              currentView === 'synopsis'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Synopsis (PDF)</span>
            </span>
          </button>

          {/* Dark mode toggle */}
          <button
            id="nav-theme-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Admin link or Dashboard */}
          <div className="pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            {adminUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-admin-dashboard-btn"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  id="nav-admin-logout-btn"
                  onClick={onLogoutAdmin}
                  title="Logout Admin"
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-admin-login-btn"
                onClick={() => onNavigate('admin-login')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
