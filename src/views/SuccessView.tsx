import React from 'react';
import { CheckCircle2, Ticket, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { Booking } from '../types.ts';
import { TicketPass } from '../components/TicketPass.tsx';

interface SuccessViewProps {
  booking: Booking;
  onBrowseMore: () => void;
  onGoToMyBookings: (email: string) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  booking,
  onBrowseMore,
  onGoToMyBookings,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Celebration Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reservation Confirmed!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Your admission has been secured and registered in real time. Present your digital ticket pass or QR code at the venue gate.
        </p>
      </div>

      {/* The Printable Digital Pass */}
      <TicketPass booking={booking} />

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 print:hidden">
        <button
          id="success-view-my-bookings-btn"
          onClick={() => onGoToMyBookings(booking.userEmail)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>View in "My Bookings"</span>
        </button>

        <button
          id="success-browse-more-btn"
          onClick={onBrowseMore}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-indigo-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More Events</span>
        </button>
      </div>
    </div>
  );
};
