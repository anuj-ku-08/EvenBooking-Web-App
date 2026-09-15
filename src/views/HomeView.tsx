import React, { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, CalendarDays, Zap, CheckCircle2 } from 'lucide-react';
import { EventItem } from '../types.ts';
import { EventCard } from '../components/EventCard.tsx';

interface HomeViewProps {
  events: EventItem[];
  isLoading: boolean;
  onSelectEvent: (event: EventItem) => void;
  recentlyUpdatedEventIds: Set<string>;
}

const CATEGORIES = ['All', 'Technology', 'Music', 'Workshop', 'Gaming', 'Design'];

export const HomeView: React.FC<HomeViewProps> = ({
  events,
  isLoading,
  onSelectEvent,
  recentlyUpdatedEventIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-900/40">
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Real-Time Seat Synchronization via WebSockets</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Book Next-Gen Events <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Instantly & Seamlessly.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Experience real-time ticket reservations with zero payment roadblocks. Seats update across all connected devices live the second someone books.
          </p>

          {/* Quick Metrics ribbon */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant QR Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Admission (No Cards)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Auditorium Seat Picker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="event-search-input"
              type="text"
              placeholder="Search by event title, venue, or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count & status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
            <span>Showing {filteredEvents.length} upcoming {filteredEvents.length === 1 ? 'event' : 'events'}</span>
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-96"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-2xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No events found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We couldn't find any events matching "{searchTerm}". Try a different search query or select another category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onSelect={onSelectEvent}
                isRecentlyUpdated={recentlyUpdatedEventIds.has(event._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
