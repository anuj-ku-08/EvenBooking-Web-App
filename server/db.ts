import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface EventDoc {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  totalSeats: number;
  availableSeats: number;
  image: string;
  category: string;
  isActive: boolean;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDoc {
  _id: string;
  bookingId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventImage: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  selectedSeats?: string[];
  qrCodeData: string;
  status: 'Booked' | 'Used' | 'Cancelled';
  createdAt: string;
}

interface DatabaseSchema {
  users: UserDoc[];
  events: EventDoc[];
  bookings: BookingDoc[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_EVENTS: Omit<EventDoc, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Global Tech Summit 2026',
    description: 'Explore the future of artificial intelligence, cloud scale architecture, and quantum computing with 30+ international keynote speakers and live tech showcases.',
    date: '2026-10-15',
    time: '09:00 AM',
    venue: 'Convention Center, Hall A, Tech Valley',
    totalSeats: 250,
    availableSeats: 184,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    isActive: true,
    price: 0,
  },
  {
    title: 'Acoustic Sunset Music Festival',
    description: 'An open-air evening featuring world-class indie singer-songwriters, live jazz ensembles, and artisan food trucks under the stars.',
    date: '2026-10-22',
    time: '05:30 PM',
    venue: 'Riverside Amphitheater, Waterfront Park',
    totalSeats: 400,
    availableSeats: 328,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    category: 'Music',
    isActive: true,
    price: 0,
  },
  {
    title: 'Full-Stack & Web3 Developer Workshop',
    description: 'Intensive, hands-on masterclass covering real-time systems, WebSockets, microservices, and distributed systems design with certified mentors.',
    date: '2026-11-05',
    time: '10:00 AM',
    venue: 'Innovation Hub, Lab 4B, Metro District',
    totalSeats: 60,
    availableSeats: 24,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    category: 'Workshop',
    isActive: true,
    price: 0,
  },
  {
    title: 'National Esports Championship 2026',
    description: 'The premier collegiate esports showdown featuring Valorant and Rocket League grand finals on massive stadium LED arenas with live shoutcasters.',
    date: '2026-11-18',
    time: '02:00 PM',
    venue: 'CyberDome Arena, Grand Stadium Gate 3',
    totalSeats: 500,
    availableSeats: 412,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'Gaming',
    isActive: true,
    price: 0,
  },
  {
    title: 'UX Design & Creative Systems Conference',
    description: 'Deep dive into modern visual design, accessibility ethics, design engineering, and generative creative interfaces with industry design leaders.',
    date: '2026-12-02',
    time: '11:00 AM',
    venue: 'Metropolitan Arts Center, Main Auditorium',
    totalSeats: 150,
    availableSeats: 98,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    isActive: true,
    price: 0,
  }
];

let dbMemory: DatabaseSchema | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDB(): DatabaseSchema {
  if (dbMemory) return dbMemory;
  ensureDataDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbMemory = JSON.parse(raw);
      if (dbMemory && Array.isArray(dbMemory.events) && Array.isArray(dbMemory.users)) {
        return dbMemory;
      }
    } catch (err) {
      console.error('Error reading db.json, re-initializing:', err);
    }
  }

  // Initialize fresh DB with seed data
  const defaultAdminPassword = bcrypt.hashSync('admin123', 10);
  const now = new Date().toISOString();

  dbMemory = {
    users: [
      {
        _id: 'user_admin_001',
        name: 'EventTicket Administrator',
        email: 'admin@eventticket.com',
        password: defaultAdminPassword,
        role: 'admin',
        createdAt: now,
      }
    ],
    events: INITIAL_EVENTS.map((item, idx) => ({
      ...item,
      _id: `evt_seed_00${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    })),
    bookings: [
      {
        _id: 'bkg_seed_001',
        bookingId: 'TKT-20260914-1001',
        eventId: 'evt_seed_001',
        eventTitle: 'Global Tech Summit 2026',
        eventDate: '2026-10-15',
        eventTime: '09:00 AM',
        eventVenue: 'Convention Center, Hall A, Tech Valley',
        eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        userName: 'Alex Morgan',
        userEmail: 'alex.morgan@university.edu',
        seatsBooked: 2,
        selectedSeats: ['A-1', 'A-2'],
        qrCodeData: JSON.stringify({
          ticket: 'TKT-20260914-1001',
          event: 'Global Tech Summit 2026',
          email: 'alex.morgan@university.edu',
          seats: 2,
          verified: true
        }),
        status: 'Booked',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        _id: 'bkg_seed_002',
        bookingId: 'TKT-20260914-1002',
        eventId: 'evt_seed_003',
        eventTitle: 'Full-Stack & Web3 Developer Workshop',
        eventDate: '2026-11-05',
        eventTime: '10:00 AM',
        eventVenue: 'Innovation Hub, Lab 4B, Metro District',
        eventImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@techcorp.io',
        seatsBooked: 1,
        selectedSeats: ['B-4'],
        qrCodeData: JSON.stringify({
          ticket: 'TKT-20260914-1002',
          event: 'Full-Stack & Web3 Developer Workshop',
          email: 'priya.sharma@techcorp.io',
          seats: 1,
          verified: true
        }),
        status: 'Used',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ],
  };

  saveDB(dbMemory);
  return dbMemory;
}

function saveDB(db: DatabaseSchema) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

export const db = {
  getEvents: (onlyActive: boolean = false): EventDoc[] => {
    const data = loadDB();
    if (onlyActive) {
      return data.events.filter((e) => e.isActive);
    }
    return [...data.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getEventById: (id: string): EventDoc | null => {
    const data = loadDB();
    return data.events.find((e) => e._id === id) || null;
  },

  createEvent: (payload: Omit<EventDoc, '_id' | 'createdAt' | 'updatedAt'>): EventDoc => {
    const data = loadDB();
    const now = new Date().toISOString();
    const newEvent: EventDoc = {
      ...payload,
      _id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      availableSeats: payload.availableSeats ?? payload.totalSeats,
      createdAt: now,
      updatedAt: now,
    };
    data.events.unshift(newEvent);
    saveDB(data);
    return newEvent;
  },

  updateEvent: (id: string, updates: Partial<EventDoc>): EventDoc | null => {
    const data = loadDB();
    const index = data.events.findIndex((e) => e._id === id);
    if (index === -1) return null;

    const current = data.events[index];
    const totalSeatsDelta = (updates.totalSeats !== undefined && updates.totalSeats !== current.totalSeats)
      ? updates.totalSeats - current.totalSeats
      : 0;

    const updated: EventDoc = {
      ...current,
      ...updates,
      availableSeats: Math.max(0, (updates.availableSeats !== undefined ? updates.availableSeats : current.availableSeats + totalSeatsDelta)),
      updatedAt: new Date().toISOString(),
    };

    data.events[index] = updated;
    saveDB(data);
    return updated;
  },

  deleteEvent: (id: string): boolean => {
    const data = loadDB();
    const initialLength = data.events.length;
    data.events = data.events.filter((e) => e._id !== id);
    if (data.events.length !== initialLength) {
      saveDB(data);
      return true;
    }
    return false;
  },

  createBooking: (payload: {
    eventId: string;
    userName: string;
    userEmail: string;
    seatsBooked: number;
    selectedSeats?: string[];
  }): { booking: BookingDoc; updatedEvent: EventDoc } => {
    const data = loadDB();
    const eventIndex = data.events.findIndex((e) => e._id === payload.eventId);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    const event = data.events[eventIndex];
    if (payload.seatsBooked <= 0) {
      throw new Error('Invalid ticket count');
    }
    if (event.availableSeats < payload.seatsBooked) {
      throw new Error(`Only ${event.availableSeats} seat(s) remaining for this event`);
    }

    // Deduct seats atomically
    event.availableSeats -= payload.seatsBooked;
    event.updatedAt = new Date().toISOString();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `TKT-${dateStr}-${randomSuffix}`;

    const qrPayload = {
      bookingId,
      eventId: event._id,
      eventTitle: event.title,
      userName: payload.userName,
      userEmail: payload.userEmail,
      seatsBooked: payload.seatsBooked,
      venue: event.venue,
      date: event.date,
      time: event.time,
      verifiedAt: new Date().toISOString(),
    };

    const newBooking: BookingDoc = {
      _id: `bkg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      bookingId,
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventImage: event.image,
      userName: payload.userName,
      userEmail: payload.userEmail.toLowerCase().trim(),
      seatsBooked: payload.seatsBooked,
      selectedSeats: payload.selectedSeats,
      qrCodeData: JSON.stringify(qrPayload),
      status: 'Booked',
      createdAt: new Date().toISOString(),
    };

    data.bookings.unshift(newBooking);
    saveDB(data);

    return { booking: newBooking, updatedEvent: event };
  },

  getBookings: (filter?: {
    email?: string;
    eventId?: string;
    status?: string;
    search?: string;
  }): BookingDoc[] => {
    const data = loadDB();
    let list = [...data.bookings];

    if (filter?.email) {
      const target = filter.email.toLowerCase().trim();
      list = list.filter((b) => b.userEmail.toLowerCase() === target);
    }
    if (filter?.eventId) {
      list = list.filter((b) => b.eventId === filter.eventId);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((b) => b.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.bookingId.toLowerCase().includes(q) ||
          b.userName.toLowerCase().includes(q) ||
          b.userEmail.toLowerCase().includes(q) ||
          b.eventTitle.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBookingById: (id: string): BookingDoc | null => {
    const data = loadDB();
    return data.bookings.find((b) => b._id === id || b.bookingId === id) || null;
  },

  updateBookingStatus: (id: string, status: 'Booked' | 'Used' | 'Cancelled'): BookingDoc | null => {
    const data = loadDB();
    const index = data.bookings.findIndex((b) => b._id === id || b.bookingId === id);
    if (index === -1) return null;

    data.bookings[index].status = status;
    saveDB(data);
    return data.bookings[index];
  },

  getAdminStats: (): {
    totalEvents: number;
    totalBookings: number;
    totalSeatsBooked: number;
    recentBookings: BookingDoc[];
  } => {
    const data = loadDB();
    const totalEvents = data.events.length;
    const totalBookings = data.bookings.length;
    const totalSeatsBooked = data.bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.seatsBooked : 0), 0);
    const recentBookings = [...data.bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalEvents,
      totalBookings,
      totalSeatsBooked,
      recentBookings,
    };
  },

  getUserByEmail: (email: string): UserDoc | null => {
    const data = loadDB();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  resetSeed: () => {
    dbMemory = null;
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    return loadDB();
  }
};
