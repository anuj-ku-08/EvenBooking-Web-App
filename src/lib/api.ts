import { EventItem, Booking, AdminStats, AdminUser } from '../types.ts';

const API_BASE = '/api';

export async function getActiveEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE}/events`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch events');
  return data.events;
}

export async function getEventById(id: string): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/events/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch event');
  return data.event;
}

export async function createBooking(payload: {
  eventId: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  selectedSeats?: string[];
}): Promise<{ booking: Booking; availableSeats: number }> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking failed');
  return { booking: data.booking, availableSeats: data.availableSeats };
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/bookings?email=${encodeURIComponent(email.trim())}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to retrieve bookings');
  return data.bookings;
}

// ---------------------------------------------
// Admin Auth & Protected Endpoints
// ---------------------------------------------

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return { token: data.token, user: data.user };
}

export async function getAdminDashboardStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard stats');
  return data.stats;
}

export async function getAdminEvents(token: string): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE}/admin/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch events');
  return data.events;
}

export async function createAdminEvent(token: string, eventData: Partial<EventItem>): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/admin/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create event');
  return data.event;
}

export async function updateAdminEvent(token: string, id: string, eventData: Partial<EventItem>): Promise<EventItem> {
  const res = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update event');
  return data.event;
}

export async function deleteAdminEvent(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete event');
}

export async function getAdminBookings(
  token: string,
  filter?: { email?: string; eventId?: string; status?: string; search?: string }
): Promise<Booking[]> {
  const params = new URLSearchParams();
  if (filter?.email) params.append('email', filter.email);
  if (filter?.eventId) params.append('eventId', filter.eventId);
  if (filter?.status) params.append('status', filter.status);
  if (filter?.search) params.append('search', filter.search);

  const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings');
  return data.bookings;
}

export async function markBookingUsed(token: string, bookingId: string, status: 'Booked' | 'Used' | 'Cancelled' = 'Used'): Promise<Booking> {
  const res = await fetch(`${API_BASE}/admin/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update ticket status');
  return data.booking;
}

export async function resetDatabaseSeed(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/reset-seed`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset seed');
}
