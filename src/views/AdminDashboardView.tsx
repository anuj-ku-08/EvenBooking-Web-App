import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Ticket,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Search,
  ShieldCheck,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { AdminStats, Booking } from '../types.ts';
import { getAdminDashboardStats, markBookingUsed, resetDatabaseSeed } from '../lib/api.ts';
import { joinAdminRoom } from '../lib/socket.ts';

interface AdminDashboardViewProps {
  token: string;
  onNavigateToEvents: () => void;
  onNavigateToBookings: () => void;
  onCreateEvent: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  token,
  onNavigateToEvents,
  onNavigateToBookings,
  onCreateEvent,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scannerInput, setScannerInput] = useState('');
  const [scannerMessage, setScannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminDashboardStats(token);
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    joinAdminRoom();
  }, [token]);

  const handleMarkUsed = async (bookingId: string) => {
    try {
      await markBookingUsed(token, bookingId, 'Used');
      setScannerMessage({ type: 'success', text: `Ticket ${bookingId} verified & marked as USED.` });
      loadStats();
    } catch (err: any) {
      setScannerMessage({ type: 'error', text: err.message || 'Failed to update ticket status.' });
    }
  };

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;

    let targetId = scannerInput.trim();
    // In case user pasted the raw QR json string
    try {
      if (targetId.startsWith('{')) {
        const parsed = JSON.parse(targetId);
        if (parsed.bookingId) targetId = parsed.bookingId;
        else if (parsed.ticket) targetId = parsed.ticket;
      }
    } catch {}

    try {
      await markBookingUsed(token, targetId, 'Used');
      setScannerMessage({
        type: 'success',
        text: `✓ Ticket pass "${targetId}" successfully verified and marked as USED!`,
      });
      setScannerInput('');
      loadStats();
    } catch (err: any) {
      setScannerMessage({
        type: 'error',
        text: `Verification failed: ${err.message || 'Ticket not found'}`,
      });
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset the database to default college demo seed data (5 events & 1 admin)?')) {
      return;
    }
    try {
      setIsResetting(true);
      await resetDatabaseSeed(token);
      setScannerMessage({ type: 'success', text: 'Database reset to clean seed data!' });
      loadStats();
    } catch (err: any) {
      setScannerMessage({ type: 'error', text: err.message || 'Failed to reset seed' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              JWT Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time event tracking, seat allocations, and attendee check-ins.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="admin-create-event-btn"
            onClick={onCreateEvent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </button>

          <button
            id="admin-refresh-stats-btn"
            onClick={loadStats}
            title="Refresh statistics"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            id="admin-reset-seed-btn"
            onClick={handleResetSeed}
            disabled={isResetting}
            title="Reset to demo sample data"
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            {isResetting ? 'Resetting...' : 'Reset Seed Data'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Events */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Events
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalEvents ?? '—'}
            </p>
            <button
              onClick={onNavigateToEvents}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Bookings
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalBookings ?? '—'}
            </p>
            <button
              onClick={onNavigateToBookings}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Total Seats Booked */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Seats Reserved
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalSeatsBooked ?? '—'}
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ticket QR Scanner & Check-in Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Gate Check-in & Ticket Verification</h3>
              <p className="text-xs text-slate-400">
                Scan or paste a Booking ID (e.g. TKT-20260914-1001) to validate and mark ticket as "Used"
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-3">
          <input
            id="admin-ticket-scanner-input"
            type="text"
            placeholder="Paste Booking ID or scan QR code payload..."
            value={scannerInput}
            onChange={(e) => setScannerInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            id="admin-verify-ticket-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Verify & Check In
          </button>
        </form>

        {scannerMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              scannerMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border border-rose-800'
            }`}
          >
            {scannerMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{scannerMessage.text}</span>
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Reservations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest instant ticket bookings received</p>
          </div>
          <button
            onClick={onNavigateToBookings}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({stats?.totalBookings ?? 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Attendee</th>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Tickets</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {b.bookingId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{b.userName}</p>
                      <p className="text-[11px] text-slate-400">{b.userEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {b.eventTitle}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {b.seatsBooked} {b.seatsBooked === 1 ? 'seat' : 'seats'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'Used'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {b.status === 'Booked' ? (
                        <button
                          id={`mark-used-btn-${b.bookingId}`}
                          onClick={() => handleMarkUsed(b.bookingId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-600 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Mark as Used
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Checked In</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No bookings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
