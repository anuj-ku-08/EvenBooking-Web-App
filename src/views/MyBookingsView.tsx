import React, { useState, useEffect } from 'react';
import { Search, Mail, Ticket, Calendar, Clock, MapPin, QrCode, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Booking } from '../types.ts';
import { getBookingsByEmail } from '../lib/api.ts';
import { TicketPass } from '../components/TicketPass.tsx';

interface MyBookingsViewProps {
  initialEmail?: string;
  onBrowseEvents: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  initialEmail = '',
  onBrowseEvents,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);

  const handleSearch = async (emailToSearch?: string) => {
    const target = (emailToSearch || email).trim();
    if (!target) {
      setErrorMessage('Please enter an email address to find bookings');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await getBookingsByEmail(target);
      setBookings(results);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to lookup bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      handleSearch(initialEmail);
    }
  }, [initialEmail]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Bookings & Digital Passes
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter the email address you used during booking to retrieve your passes and QR codes.
        </p>
      </div>

      {/* Email Search Box */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="my-bookings-email-input"
              type="email"
              required
              placeholder="Enter your booking email (e.g. alex.morgan@university.edu)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            id="search-my-bookings-btn"
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Searching...' : 'Find Passes'}</span>
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Demo examples:</span>
          <button
            type="button"
            onClick={() => {
              setEmail('alex.morgan@university.edu');
              handleSearch('alex.morgan@university.edu');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            alex.morgan@university.edu
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('priya.sharma@techcorp.io');
              handleSearch('priya.sharma@techcorp.io');
            }}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            priya.sharma@techcorp.io
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 dark:text-rose-400 pt-1">{errorMessage}</p>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Found <strong className="text-slate-800 dark:text-slate-200">{bookings.length}</strong> booking(s) for "{email}"
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No bookings registered under this email</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Make sure the email matches what was entered when booking, or reserve a ticket from our upcoming events list.
              </p>
              <button
                onClick={onBrowseEvents}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Browse Upcoming Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  id={`booking-card-${b.bookingId}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                          {b.bookingId}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                          {b.eventTitle}
                        </h3>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          b.status === 'Used'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.eventDate} at {b.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate">{b.eventVenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.seatsBooked} {b.seatsBooked === 1 ? 'Seat' : 'Seats'} booked</span>
                        {b.selectedSeats && b.selectedSeats.length > 0 && (
                          <span className="text-slate-400">({b.selectedSeats.join(', ')})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    id={`view-pass-btn-${b.bookingId}`}
                    onClick={() => setSelectedPass(b)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass & QR Code</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Popup for viewing single ticket pass */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Digital Pass Details</h3>
              <button
                id="close-pass-modal-btn"
                onClick={() => setSelectedPass(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TicketPass booking={selectedPass} />

            <div className="text-center pt-2">
              <button
                onClick={() => setSelectedPass(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
