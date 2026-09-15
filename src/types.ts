export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "06:30 PM"
  venue: string;
  totalSeats: number;
  availableSeats: number;
  image: string;
  category: string;
  isActive: boolean;
  price?: number; // optional, defaults to Free
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  bookingId: string; // e.g. "TKT-20260914-8842"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventImage: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  selectedSeats?: string[]; // e.g. ["A-1", "A-2"]
  qrCodeData: string;
  status: 'Booked' | 'Used' | 'Cancelled';
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface AdminStats {
  totalEvents: number;
  totalBookings: number;
  totalSeatsBooked: number;
  recentBookings: Booking[];
}

export interface SocketSeatUpdate {
  eventId: string;
  availableSeats: number;
  totalSeats?: number;
}
