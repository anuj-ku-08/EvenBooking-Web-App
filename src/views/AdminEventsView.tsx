import React, { useState, useEffect } from 'react';
import {
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  ArrowLeft,
  X,
} from 'lucide-react';
import { EventItem } from '../types.ts';
import { getAdminEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent } from '../lib/api.ts';

interface AdminEventsViewProps {
  token: string;
  onBackToDashboard: () => void;
  openCreateImmediately?: boolean;
}

const SAMPLE_POSTERS = [
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Music & Concert', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dev Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Esports Gaming', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Design & Arts', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminEventsView: React.FC<AdminEventsViewProps> = ({
  token,
  onBackToDashboard,
  openCreateImmediately = false,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(openCreateImmediately);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('06:00 PM');
  const [venue, setVenue] = useState('Grand Auditorium Hall 1');
  const [totalSeats, setTotalSeats] = useState(100);
  const [image, setImage] = useState(SAMPLE_POSTERS[0].url);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminEvents(token);
      setEvents(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setCategory('Technology');
    setDate('2026-11-20');
    setTime('06:00 PM');
    setVenue('Campus Innovation Hall');
    setTotalSeats(120);
    setImage(SAMPLE_POSTERS[0].url);
    setIsActive(true);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setCategory(evt.category);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setTotalSeats(evt.totalSeats);
    setImage(evt.image);
    setIsActive(evt.isActive);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !date || !time.trim() || !venue.trim() || totalSeats <= 0) {
      setErrorMessage('Please fill in all required event details with positive seats count');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateAdminEvent(token, editingEvent._id, {
          title: title.trim(),
          description: description.trim(),
          category,
          date,
          time: time.trim(),
          venue: venue.trim(),
          totalSeats: Number(totalSeats),
          image,
          isActive,
        });
      } else {
        await createAdminEvent(token, {
          title: title.trim(),
          description: description.trim(),
          category,
          date,
          time: time.trim(),
          venue: venue.trim(),
          totalSeats: Number(totalSeats),
          image,
          isActive,
        });
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${name}"?`)) {
      return;
    }
    try {
      await deleteAdminEvent(token, id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleToggleStatus = async (evt: EventItem) => {
    try {
      const updated = await updateAdminEvent(token, evt._id, {
        isActive: !evt.isActive,
      });
      setEvents((prev) => prev.map((e) => (e._id === evt._id ? updated : e)));
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
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
            Manage Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, modify, toggle active states, or adjust seating capacities.
          </p>
        </div>

        <button
          id="open-create-event-modal-btn"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Table Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Schedule</th>
                <th className="px-5 py-3.5">Venue</th>
                <th className="px-5 py-3.5">Seats (Avail / Total)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No events created yet. Click "Add New Event" to create one.
                  </td>
                </tr>
              ) : (
                events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{evt.title}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      <div>{evt.date}</div>
                      <div className="text-[11px] text-slate-400">{evt.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {evt.venue}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {evt.availableSeats} / {evt.totalSeats}
                        </span>
                        <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(((evt.totalSeats - evt.availableSeats) / evt.totalSeats) * 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(evt)}
                        title="Click to toggle active state"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          evt.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-rose-100 hover:text-rose-700'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                        }`}
                      >
                        {evt.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        id={`edit-event-btn-${evt._id}`}
                        onClick={() => openEditModal(evt)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-event-btn-${evt._id}`}
                        onClick={() => handleDelete(evt._id, evt.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingEvent ? 'Edit Event Details' : 'Create New Event'}
              </h2>
              <button
                id="close-event-modal-btn"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Event Title *
                </label>
                <input
                  id="event-title-input"
                  type="text"
                  required
                  placeholder="e.g. AI & Future of Web Hackathon 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    id="event-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Music">Music</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Design">Design</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Total Seating Capacity *
                  </label>
                  <input
                    id="event-seats-input"
                    type="number"
                    min="1"
                    max="5000"
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Date *
                  </label>
                  <input
                    id="event-date-input"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Time *
                  </label>
                  <input
                    id="event-time-input"
                    type="text"
                    required
                    placeholder="e.g. 07:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Venue & Address *
                </label>
                <input
                  id="event-venue-input"
                  type="text"
                  required
                  placeholder="e.g. Science Auditorium, North Campus Gate 4"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  id="event-desc-input"
                  rows={3}
                  placeholder="Provide an overview of the event, itinerary, and guest speakers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Image URL & Preset Picker */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Poster Image URL
                </label>
                <input
                  id="event-image-input"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-slate-400">Quick Presets:</span>
                  {SAMPLE_POSTERS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="event-active-toggle"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="event-active-toggle" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Publicly visible on homepage
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-event-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
