import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Zap,
  AlertCircle,
  Ticket,
  Mail,
  User,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, Booking } from '../types.ts';
import { createBooking } from '../lib/api.ts';
import { joinEventRoom, leaveEventRoom } from '../lib/socket.ts';
import { SeatSelector } from '../components/SeatSelector.tsx';

interface EventDetailViewProps {
  event: EventItem;
  onBack: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onBack,
  onBookingSuccess,
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedCount, setSelectedCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['A-1']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Join the socket room for targeted real-time updates while on this page
  useEffect(() => {
    if (event?._id) {
      joinEventRoom(event._id);
    }
    return () => {
      if (event?._id) {
        leaveEventRoom(event._id);
      }
    };
  }, [event?._id]);

  // Handle seat count change from the number buttons
  const handleChangeCount = (num: number) => {
    setSelectedCount(num);
    // Auto populate seat labels
    const newSeats: string[] = [];
    const rows = ['A', 'B', 'C', 'D'];
    let count = 0;
    for (const r of rows) {
      for (let c = 1; c <= 8; c++) {
        if (count < num) {
          newSeats.push(`${r}-${c}`);
          count++;
        }
      }
    }
    setSelectedSeats(newSeats);
  };

  // Handle seat toggle on the interactive grid
  const handleToggleSeat = (seatId: string) => {
    let updated = [...selectedSeats];
    if (updated.includes(seatId)) {
      updated = updated.filter((s) => s !== seatId);
      if (updated.length === 0) updated = [seatId]; // minimum 1
    } else {
      if (updated.length >= 6) {
        updated.shift(); // remove oldest if exceeding max
      }
      updated.push(seatId);
    }
    setSelectedSeats(updated);
    setSelectedCount(updated.length);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!userEmail.trim() || !userEmail.includes('@') || !userEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (selectedCount <= 0) {
      setErrorMessage('Please select at least 1 ticket');
      return;
    }

    if (selectedCount > event.availableSeats) {
      setErrorMessage(`Only ${event.availableSeats} seat(s) currently available.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        eventId: event._id,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        seatsBooked: selectedCount,
        selectedSeats,
      });

      // Fire festive celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }

      onBookingSuccess(result.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSoldOut = event.availableSeats <= 0;
  const isScarcity = event.availableSeats > 0 && event.availableSeats <= 30;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-events-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-indigo-400 transition-colors cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        {/* Live sync badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live WebSocket Room Sync</span>
        </div>
      </div>

      {/* Main Grid: Left Event Details + Right Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Poster & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Poster Image */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-lg bg-slate-900 aspect-video">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20">
                {event.category || 'General'}
              </span>
            </div>

            {/* Live Seat Pill */}
            <div className="absolute top-4 right-4">
              {isSoldOut ? (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-lg">
                  Sold Out
                </span>
              ) : isScarcity ? (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 text-white shadow-lg animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Only {event.availableSeats} seats left!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {event.availableSeats} Available Seats
                </span>
              )}
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{event.title}</h1>
            </div>
          </div>

          {/* Quick Schedule & Venue Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Event Date</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{event.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Show Time</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{event.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Seat Status</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {event.availableSeats} / {event.totalSeats}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Venue & Location</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-3">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">About This Event</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* Right Column: Instant Booking Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Instant Ticket Booking</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">No payment gateway • Real-time confirmed</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                FREE
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSoldOut ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                  <Ticket className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Event is Sold Out</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All {event.totalSeats} seats have been reserved. If a booking is cancelled, seats will open up here automatically in real time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Seat Selector Component */}
                <SeatSelector
                  availableSeats={event.availableSeats}
                  selectedCount={selectedCount}
                  onChangeCount={handleChangeCount}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />

                {/* Attendee Info Inputs */}
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="booking-name-input"
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Email Address (for Digital Pass)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="booking-email-input"
                        type="email"
                        required
                        placeholder="e.g. alex@university.edu"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Your booking ID & QR code will be registered under this email.
                    </p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Tickets:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedCount} × Free Pass
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Assigned Seats:</span>
                    <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedSeats.join(', ') || 'Auto-allocated'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-indigo-200/50 dark:border-indigo-800/50 pt-1.5 font-bold text-slate-900 dark:text-white">
                    <span>Total Cost:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">$0.00 (Instant)</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="confirm-instant-booking-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Reservation...</span>
                  ) : (
                    <>
                      <span>Confirm Instant Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time seats secured immediately upon submission</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
