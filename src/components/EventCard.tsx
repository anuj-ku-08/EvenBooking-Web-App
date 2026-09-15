import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { EventItem } from '../types.ts';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  isRecentlyUpdated?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, isRecentlyUpdated }) => {
  const isSoldOut = event.availableSeats <= 0;
  const isScarcity = event.availableSeats > 0 && event.availableSeats <= 30;

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id={`event-card-${event._id}`}
      className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
        isRecentlyUpdated ? 'ring-2 ring-emerald-500/80 shadow-emerald-500/20' : ''
      }`}
    >
      {/* Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Category Pill Top Left */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20">
            {event.category || 'General'}
          </span>
        </div>

        {/* Live Availability Badge Top Right */}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white shadow-md">
              Sold Out
            </span>
          ) : isScarcity ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 text-white shadow-md animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Only {event.availableSeats} left!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              {event.availableSeats} seats live
            </span>
          )}
        </div>

        {/* Event Date Tag Bottom Left */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            <span>{formatDate(event.date)}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta details */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Capacity: <strong className="text-slate-700 dark:text-slate-200">{event.totalSeats}</strong> seats
              </span>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[11px]">Free Admission</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          id={`book-btn-${event._id}`}
          onClick={() => onSelect(event)}
          disabled={isSoldOut}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isSoldOut
              ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
          }`}
        >
          {isSoldOut ? (
            <span>Sold Out</span>
          ) : (
            <>
              <span>Book Ticket</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
