import React from 'react';
import { Ticket, Shield, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onQuickAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onQuickAdminLogin }) => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">EventTicket</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                Production Ready
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Real-time collegiate and community event booking platform. Instant ticket reservation without payment gateways, live seat synchronization across devices with WebSockets, and QR-coded digital boarding passes.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Socket.io Live Sync
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> JWT Protected Admin
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> QR Ticketing
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Navigation</h4>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                  Browse All Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-bookings')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                  Lookup My Bookings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('synopsis')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer">
                  <span>Project Synopsis (PDF)</span>
                </button>
              </li>
              <li>
                <a
                  href="/EventTicket_Project_Synopsis.pdf"
                  download="EventTicket_Project_Synopsis.pdf"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 text-xs text-slate-500 flex items-center gap-1 cursor-pointer"
                >
                  <span>⬇ Download PDF</span>
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                  Admin Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* College Demo Credentials */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-300">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Project Demo Login</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Admin credentials for evaluation:
            </p>
            <div className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-indigo-200/50 dark:border-indigo-800/50 space-y-1">
              <div><span className="text-slate-400">Email:</span> <span className="text-indigo-600 dark:text-indigo-400 font-medium">admin@eventticket.com</span></div>
              <div><span className="text-slate-400">Pass:</span> <span className="text-slate-700 dark:text-slate-300 font-medium">admin123</span></div>
            </div>
            {onQuickAdminLogin && (
              <button
                onClick={onQuickAdminLogin}
                className="w-full py-1.5 mt-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-[11px] transition-colors cursor-pointer"
              >
                1-Click Admin Demo Login
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© 2026 EventTicket. College Capstone & Engineering Specification.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Instant Booking (No Gateway)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
