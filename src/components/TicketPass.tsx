import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, Ticket, Download, Printer, Copy, Check, ShieldCheck, User } from 'lucide-react';
import { Booking } from '../types.ts';

interface TicketPassProps {
  booking: Booking;
  onPrint?: () => void;
}

export const TicketPass: React.FC<TicketPassProps> = ({ booking, onPrint }) => {
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const copyBookingId = () => {
    navigator.clipboard.writeText(booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Booking ID:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{booking.bookingId}</span>
          <button
            id="copy-booking-id-btn"
            onClick={copyBookingId}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Copy Booking ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="print-ticket-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>

      {/* The Printable Ticket Card */}
      <div
        ref={ticketRef}
        id={`ticket-pass-${booking.bookingId}`}
        className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 shadow-xl overflow-hidden print:shadow-none print:border-slate-300"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Ticket className="w-5 h-5 -rotate-12 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Official Digital Pass</span>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">{booking.eventTitle}</h2>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                booking.status === 'Used'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                  : booking.status === 'Cancelled'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  : 'bg-emerald-400/30 text-white border border-emerald-300/40 backdrop-blur-sm'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {booking.status === 'Booked' ? 'CONFIRMED' : booking.status}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-slate-200 dark:divide-slate-700">
          {/* Left Details (2 Cols) */}
          <div className="md:col-span-2 p-6 sm:p-7 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                  Date
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {booking.eventDate}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                  Time
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {booking.eventTime}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                  Quantity
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                  {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat' : 'Seats'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                Venue Location
              </span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>{booking.eventVenue}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                  Ticket Holder
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{booking.userName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{booking.userEmail}</p>
                  </div>
                </div>
              </div>

              {booking.selectedSeats && booking.selectedSeats.length > 0 && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
                    Reserved Seats
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.selectedSeats.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: QR Code & Verification (1 Col) */}
          <div className="p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/40">
            <div className="p-3 bg-white dark:bg-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-300">
              <QRCodeSVG
                value={booking.qrCodeData || booking.bookingId}
                size={136}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="mt-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Scan for Verification
              </span>
              <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {booking.bookingId}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Present at venue entry gate
              </p>
            </div>
          </div>
        </div>

        {/* Perforated Edge Visual Indicators on left and right for ticket realism */}
        <div className="hidden md:block absolute top-[72px] -left-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700"></div>
        <div className="hidden md:block absolute top-[72px] -right-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700"></div>

        {/* Barcode-style Footer Graphic */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
          <span className="font-mono tracking-widest">||||| | |||| || |||||| |||</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Instant Pass • No Payment</span>
        </div>
      </div>
    </div>
  );
};
