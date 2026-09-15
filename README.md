# EventTicket – Real-Time Event Ticket Booking Platform

A full-stack, real-time ticket booking web application with instant seat synchronization, QR code digital ticketing, and a secure JWT-authenticated administrator dashboard.

Designed and engineered as a production-grade college capstone project.

---

## 🌟 Key Features

### Public (User) Features
- **Upcoming Events Discovery**: Interactive catalog with real-time seat availability counters, category filters, and live search.
- **Auditorium Seat Selection**: Interactive seating grid (Rows A–D, Seats 1–8) plus rapid ticket quantity selector (1–6 seats).
- **Instant Booking (No Payment)**: Zero card or payment friction—instant reservation with atomic seat decrementing.
- **Unique Digital Ticket Pass**: Generates unique `TKT-YYYYMMDD-XXXX` ticket IDs with encoded dynamic QR codes using `qrcode.react`.
- **Print & PDF Ready**: Dedicated `@media print` styling to print boarding passes directly from browser.
- **"My Bookings" Lookup**: Search and retrieve passes by email address at any time.
- **Real-Time WebSocket Sync**: Instant seat updates across all connected browsers using Socket.io without page refreshes.
- **Dark / Light Mode**: Seamless theme toggle with persistent preferences.

### Admin Dashboard (JWT Protected)
- **JWT Token Authentication**: Secure token generation with bcrypt password hashing.
- **Real-Time KPI Metrics**:
  - Total Events
  - Total Bookings
  - Total Seats Booked
  - Live WebSocket Connection Status
- **Full Events CRUD**: Create, Edit, Delete, or toggle active visibility for events.
- **Gate Check-in & Ticket Scanner**: Search or paste QR code data / Booking IDs to validate tickets and mark them as "Used".
- **All Bookings Management**: Filter by status (`Booked`, `Used`, `Cancelled`) and search by name/email/ID.
- **1-Click Reset / Seed**: Instant reset button to test with fresh sample data.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons |
| **Backend** | Node.js, Express, tsx, Socket.io |
| **Real-time** | WebSockets (Socket.io) with rooms (`event-${id}`) |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |
| **QR Code** | `qrcode.react` (SVG & Canvas vector generation) |
| **Database** | Persistent JSON Store + MongoDB (Mongoose) adapter ready |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@eventticket.com` | `admin123` |

*Use the "Auto-Fill" button on the Admin Login page or the 1-click login in the footer.*

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file from `.env.example`:
```env
JWT_SECRET=eventticket_super_secret_jwt_key_2026
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
MONGODB_URI=
```

### 3. Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Public Endpoints
- `GET /api/health` → Server status & active socket connections
- `GET /api/events` → List all active events
- `GET /api/events/:id` → Single event details
- `POST /api/bookings` → Create instant booking & broadcast real-time seat update
- `GET /api/bookings?email=xxx` → Lookup user tickets by email

### Admin Endpoints (Requires `Authorization: Bearer <token>`)
- `POST /api/auth/login` → Verify admin credentials and return JWT token
- `GET /api/admin/dashboard` → Aggregated metrics & recent reservations
- `GET /api/admin/events` → All events (including hidden ones)
- `POST /api/admin/events` → Create new event
- `PUT /api/admin/events/:id` → Update event details or seating
- `DELETE /api/admin/events/:id` → Delete event
- `GET /api/admin/bookings` → List all bookings with search/status filters
- `PATCH /api/admin/bookings/:id` → Mark ticket as "Used" (Gate check-in)
- `POST /api/admin/reset-seed` → Reset database to initial seed state

---

## 📱 Real-Time Flow (Socket.io)

1. When a user opens an event detail page, the client joins `event-${eventId}` room.
2. When any user confirms a ticket booking:
   - Available seats are atomically reduced in database.
   - Server emits `seat-updated` with `{ eventId, availableSeats }` to the room and globally.
   - All connected browsers update live counters and seat badges instantly without reloading.
   - Server notifies the Admin dashboard with `new-booking` payload.
