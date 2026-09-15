import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { generateToken, requireAdminAuth, AuthenticatedRequest } from './server/auth.ts';

dotenv.config();

const PORT = 3000;
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use(express.json());

// Socket.io connection logic
io.on('connection', (socket) => {
  // Join specific event room for targeted updates
  socket.on('join-event', (eventId: string) => {
    if (eventId) {
      socket.join(`event-${eventId}`);
    }
  });

  socket.on('leave-event', (eventId: string) => {
    if (eventId) {
      socket.leave(`event-${eventId}`);
    }
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
  });

  socket.on('disconnect', () => {
    // client disconnected
  });
});

// Helper to broadcast seat updates
function broadcastSeatUpdate(eventId: string, availableSeats: number, totalSeats?: number) {
  const payload = { eventId, availableSeats, totalSeats };
  // Emit to specific room
  io.to(`event-${eventId}`).emit('seat-updated', payload);
  // Also broadcast globally so homepage event cards can update their badges in real time
  io.emit('seat-updated', payload);
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    clients: io.engine.clientsCount,
  });
});

// Get all active events (or all events with ?all=true)
app.get('/api/events', (req, res) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const events = db.getEvents(onlyActive);
    res.json({ success: true, events });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch events' });
  }
});

// Get single event by ID
app.get('/api/events/:id', (req, res) => {
  try {
    const event = db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch event' });
  }
});

// Create new booking (Instant booking - no payment)
app.post('/api/bookings', (req, res) => {
  try {
    const { eventId, userName, userEmail, seatsBooked, selectedSeats } = req.body;

    if (!eventId || !userName || !userEmail || !seatsBooked) {
      return res.status(400).json({ error: 'Missing required booking fields (eventId, userName, userEmail, seatsBooked).' });
    }

    const ticketsNum = Number(seatsBooked);
    if (isNaN(ticketsNum) || ticketsNum <= 0) {
      return res.status(400).json({ error: 'Seats booked must be a positive number.' });
    }

    const { booking, updatedEvent } = db.createBooking({
      eventId,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      seatsBooked: ticketsNum,
      selectedSeats: Array.isArray(selectedSeats) ? selectedSeats : undefined,
    });

    // Real-time broadcast!
    broadcastSeatUpdate(updatedEvent._id, updatedEvent.availableSeats, updatedEvent.totalSeats);

    // Notify admin dashboard
    io.to('admin-room').emit('new-booking', {
      booking,
      stats: db.getAdminStats(),
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking,
      availableSeats: updatedEvent.availableSeats,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create booking' });
  }
});

// Get bookings by email or query
app.get('/api/bookings', (req, res) => {
  try {
    const email = req.query.email as string | undefined;
    const eventId = req.query.eventId as string | undefined;
    const search = req.query.search as string | undefined;

    if (!email && !eventId && !search) {
      return res.status(400).json({ error: 'Please provide an email or search term to look up bookings.' });
    }

    const bookings = db.getBookings({ email, eventId, search });
    res.json({ success: true, bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to query bookings' });
  }
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES (JWT)
// -------------------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Authentication failed.' });
  }
});

app.get('/api/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});

// -------------------------------------------------------------
// PROTECTED ADMIN API ROUTES
// -------------------------------------------------------------

// Admin Dashboard stats
app.get('/api/admin/dashboard', requireAdminAuth, (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load stats' });
  }
});

// Get all events for admin (including inactive)
app.get('/api/admin/events', requireAdminAuth, (req, res) => {
  try {
    const events = db.getEvents(false);
    res.json({ success: true, events });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load events' });
  }
});

// Create event
app.post('/api/admin/events', requireAdminAuth, (req, res) => {
  try {
    const { title, description, date, time, venue, totalSeats, image, category, isActive } = req.body;

    if (!title || !date || !time || !venue || !totalSeats) {
      return res.status(400).json({ error: 'Title, date, time, venue, and total seats are required.' });
    }

    const total = Number(totalSeats);
    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'Total seats must be greater than 0.' });
    }

    const newEvent = db.createEvent({
      title: title.trim(),
      description: (description || '').trim(),
      date,
      time: time.trim(),
      venue: venue.trim(),
      totalSeats: total,
      availableSeats: total,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      category: category || 'General',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      price: 0,
    });

    // Notify clients of event list change
    io.emit('event-created', newEvent);

    res.status(201).json({ success: true, event: newEvent });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create event' });
  }
});

// Update event
app.put('/api/admin/events/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateEvent(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Broadcast seat/event update
    broadcastSeatUpdate(updated._id, updated.availableSeats, updated.totalSeats);
    io.emit('event-updated', updated);

    res.json({ success: true, event: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update event' });
  }
});

// Delete event
app.delete('/api/admin/events/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    io.emit('event-deleted', { eventId: id });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete event' });
  }
});

// Get all bookings with filter
app.get('/api/admin/bookings', requireAdminAuth, (req, res) => {
  try {
    const { email, eventId, status, search } = req.query as Record<string, string>;
    const bookings = db.getBookings({ email, eventId, status, search });
    res.json({ success: true, bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load bookings' });
  }
});

// Mark ticket as Used or update status
app.patch('/api/admin/bookings/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const newStatus = status || 'Used';
    const updated = db.updateBookingStatus(id, newStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    io.to('admin-room').emit('booking-status-updated', updated);

    res.json({ success: true, booking: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update booking status' });
  }
});

// Download Project Synopsis PDF
app.get(['/EventTicket_Project_Synopsis.pdf', '/api/synopsis/download'], (req, res) => {
  const pdfPath = path.join(process.cwd(), 'public', 'EventTicket_Project_Synopsis.pdf');
  if (fs.existsSync(pdfPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="EventTicket_Project_Synopsis.pdf"');
    return res.sendFile(pdfPath);
  }
  return res.status(404).json({ error: 'Synopsis PDF not found' });
});

// Reset sample seed data
app.post('/api/admin/reset-seed', requireAdminAuth, (req, res) => {
  try {
    const freshDb = db.resetSeed();
    io.emit('data-reset');
    res.json({ success: true, message: 'Database reset to default seed data', eventsCount: freshDb.events.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset seed data' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSETS
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`EventTicket server running at http://0.0.0.0:${PORT}`);
  });
}

start();
