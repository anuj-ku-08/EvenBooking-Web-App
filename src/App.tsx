import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './views/HomeView.tsx';
import { EventDetailView } from './views/EventDetailView.tsx';
import { SuccessView } from './views/SuccessView.tsx';
import { MyBookingsView } from './views/MyBookingsView.tsx';
import { AdminLoginView } from './views/AdminLoginView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { AdminEventsView } from './views/AdminEventsView.tsx';
import { AdminBookingsView } from './views/AdminBookingsView.tsx';
import { SynopsisView } from './views/SynopsisView.tsx';
import { EventItem, Booking, AdminUser, SocketSeatUpdate } from './types.ts';
import { getActiveEvents, getEventById } from './lib/api.ts';
import { getSocket } from './lib/socket.ts';

type ViewMode =
  | 'home'
  | 'event-detail'
  | 'booking-success'
  | 'my-bookings'
  | 'synopsis'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-events'
  | 'admin-bookings';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('eventticket_admin_token');
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem('eventticket_admin_user');
    return raw ? JSON.parse(raw) : null;
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('eventticket_theme') === 'dark';
  });

  // Real-time tracking
  const [socketConnected, setSocketConnected] = useState(false);
  const [recentlyUpdatedEventIds, setRecentlyUpdatedEventIds] = useState<Set<string>>(new Set());

  // Apply dark mode class to html document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('eventticket_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('eventticket_theme', 'light');
    }
  }, [isDarkMode]);

  // Load events
  const loadEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const data = await getActiveEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load active events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Setup Socket.io real-time listeners
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    const onSeatUpdated = (update: SocketSeatUpdate) => {
      console.log('⚡ Real-time seat updated received:', update);
      // Update in events array
      setEvents((prev) =>
        prev.map((e) =>
          e._id === update.eventId
            ? { ...e, availableSeats: update.availableSeats, totalSeats: update.totalSeats ?? e.totalSeats }
            : e
        )
      );

      // Update in selected event if viewing details
      setSelectedEvent((curr) => {
        if (curr && curr._id === update.eventId) {
          return {
            ...curr,
            availableSeats: update.availableSeats,
            totalSeats: update.totalSeats ?? curr.totalSeats,
          };
        }
        return curr;
      });

      // Highlight card briefly
      setRecentlyUpdatedEventIds((prev) => {
        const next = new Set(prev);
        next.add(update.eventId);
        return next;
      });

      setTimeout(() => {
        setRecentlyUpdatedEventIds((prev) => {
          const next = new Set(prev);
          next.delete(update.eventId);
          return next;
        });
      }, 3000);
    };

    const onEventUpdated = () => {
      loadEvents();
    };

    const onDataReset = () => {
      loadEvents();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('seat-updated', onSeatUpdated);
    socket.on('event-created', onEventUpdated);
    socket.on('event-updated', onEventUpdated);
    socket.on('event-deleted', onEventUpdated);
    socket.on('data-reset', onDataReset);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('seat-updated', onSeatUpdated);
      socket.off('event-created', onEventUpdated);
      socket.off('event-updated', onEventUpdated);
      socket.off('event-deleted', onEventUpdated);
      socket.off('data-reset', onDataReset);
    };
  }, []);

  // Scroll to top on navigation
  const navigateTo = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'event-detail' && param) {
      const found = events.find((e) => e._id === param);
      if (found) {
        setSelectedEvent(found);
        setCurrentView('event-detail');
        return;
      }
    }

    if (view === 'my-bookings' && param) {
      setLookupEmail(param);
    }

    // Admin route protection
    if (view.startsWith('admin-') && view !== 'admin-login') {
      if (!adminToken) {
        setCurrentView('admin-login');
        return;
      }
    }

    setCurrentView(view as ViewMode);
  };

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCurrentView('booking-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    setCurrentView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('eventticket_admin_token');
    localStorage.removeItem('eventticket_admin_user');
    setAdminToken(null);
    setAdminUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        adminUser={adminUser}
        onLogoutAdmin={handleAdminLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        socketConnected={socketConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <HomeView
            events={events}
            isLoading={isLoadingEvents}
            onSelectEvent={handleSelectEvent}
            recentlyUpdatedEventIds={recentlyUpdatedEventIds}
          />
        )}

        {currentView === 'event-detail' && selectedEvent && (
          <EventDetailView
            event={selectedEvent}
            onBack={() => setCurrentView('home')}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {currentView === 'booking-success' && confirmedBooking && (
          <SuccessView
            booking={confirmedBooking}
            onBrowseMore={() => setCurrentView('home')}
            onGoToMyBookings={(email) => {
              setLookupEmail(email);
              setCurrentView('my-bookings');
            }}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsView
            initialEmail={lookupEmail}
            onBrowseEvents={() => setCurrentView('home')}
          />
        )}

        {currentView === 'synopsis' && (
          <SynopsisView onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginView
            onLoginSuccess={handleAdminLoginSuccess}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin-dashboard' && adminToken && (
          <AdminDashboardView
            token={adminToken}
            onNavigateToEvents={() => setCurrentView('admin-events')}
            onNavigateToBookings={() => setCurrentView('admin-bookings')}
            onCreateEvent={() => setCurrentView('admin-events')}
          />
        )}

        {currentView === 'admin-events' && adminToken && (
          <AdminEventsView
            token={adminToken}
            onBackToDashboard={() => setCurrentView('admin-dashboard')}
          />
        )}

        {currentView === 'admin-bookings' && adminToken && (
          <AdminBookingsView
            token={adminToken}
            onBackToDashboard={() => setCurrentView('admin-dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onQuickAdminLogin={() => navigateTo('admin-login')}
      />
    </div>
  );
}
