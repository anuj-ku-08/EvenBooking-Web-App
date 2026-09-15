import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Ticket,
  User,
  ArrowLeft,
  RefreshCw,
  QrCode,
  X,
} from 'lucide-react';
import { Booking } from '../types.ts';
import { getAdminBookings, markBookingUsed } from '../lib/api.ts';
import { TicketPass } from '../components/TicketPass.tsx';

interface AdminBookingsViewProps {
  token: string;
  onBackToDashboard: () => void;
}

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  token,
  onBackToDashboard,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminBookings(token, {
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setBookings(data);
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleMarkUsed = async (bookingId: string) => {
    try {
      const updated = await markBookingUsed(token, bookingId, 'Used');
      setBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? updated : b)));
      if (selectedPass && selectedPass.bookingId === bookingId) {
        setSelectedPass(updated);
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, inspect attendee passes, or check in tickets at venue entry.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          title="Refresh bookings"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-search-bookings-input"
            type="text"
            placeholder="Search by Booking ID, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            id="admin-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Confirmed (Booked)</option>
            <option value="Used">Checked In (Used)</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3.5">Booking ID</th>
                <th className="px-5 py-3.5">Attendee</th>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Seats</th>
                <th className="px-5 py-3.5">Created At</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No bookings found matching criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {b.bookingId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{b.userName}</div>
                      <div className="text-[11px] text-slate-400">{b.userEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                      {b.eventTitle}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {b.seatsBooked}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
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
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPass(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="View QR Code Pass"
                      >
                        View Pass
                      </button>
                      {b.status === 'Booked' && (
                        <button
                          onClick={() => handleMarkUsed(b.bookingId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Mark as Used
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Pass */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Ticket Pass & QR</h3>
              <button
                onClick={() => setSelectedPass(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TicketPass booking={selectedPass} />

            <div className="flex items-center justify-between pt-2">
              {selectedPass.status === 'Booked' ? (
                <button
                  onClick={() => handleMarkUsed(selectedPass.bookingId)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Mark as Used Now
                </button>
              ) : (
                <span className="text-xs text-purple-600 font-semibold">Status: Marked as {selectedPass.status}</span>
              )}

              <button
                onClick={() => setSelectedPass(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
