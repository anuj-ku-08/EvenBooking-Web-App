import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(process.cwd(), 'public', 'EventTicket_Project_Synopsis.pdf');

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper styles
const PRIMARY_COLOR = '#1e3a8a';
const TEXT_COLOR = '#1e293b';
const MUTED_COLOR = '#64748b';
const BORDER_COLOR = '#334155';

function drawPageHeader(doc: PDFKit.PDFDocument, title = 'EventTicket — Project Synopsis Diploma / Degree CSE') {
  doc.save();
  doc.font('Helvetica').fontSize(8).fillColor('#64748b');
  doc.text(title, 50, 25, { width: 495, align: 'left' });
  doc.moveTo(50, 37).lineTo(545, 37).strokeColor('#cbd5e1').lineWidth(0.75).stroke();
  doc.restore();
}

function drawPageFooter(doc: PDFKit.PDFDocument, pageNum: number) {
  doc.save();
  doc.moveTo(50, 785).lineTo(545, 785).strokeColor('#cbd5e1').lineWidth(0.75).stroke();
  doc.font('Helvetica').fontSize(8).fillColor('#64748b');
  doc.text('Department of Computer Science & Engineering', 50, 793, { width: 350, align: 'left' });
  doc.text(`Page ${pageNum}`, 445, 793, { width: 100, align: 'right' });
  doc.restore();
}

function drawBoxedTable(doc: PDFKit.PDFDocument, x: number, y: number, width: number, rows: { col1: string; col2: string; isHeader?: boolean; col1Width?: number }[]) {
  let currentY = y;
  const col1W = rows[0].col1Width || 380;
  const col2W = width - col1W;

  rows.forEach((r) => {
    const rowHeight = 22;
    doc.save();
    if (r.isHeader) {
      doc.rect(x, currentY, width, rowHeight).fill('#f1f5f9');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a');
    } else {
      doc.rect(x, currentY, width, rowHeight).strokeColor('#94a3b8').lineWidth(0.5).stroke();
      doc.font('Helvetica').fontSize(9).fillColor('#1e293b');
    }

    doc.rect(x, currentY, col1W, rowHeight).strokeColor('#94a3b8').lineWidth(0.5).stroke();
    doc.rect(x + col1W, currentY, col2W, rowHeight).strokeColor('#94a3b8').lineWidth(0.5).stroke();

    doc.text(r.col1, x + 8, currentY + 6, { width: col1W - 16 });
    doc.text(r.col2, x + col1W + 8, currentY + 6, { width: col2W - 16, align: r.isHeader ? 'center' : 'center' });
    doc.restore();
    currentY += rowHeight;
  });

  return currentY;
}

// ==========================================
// PAGE 1: Table of Contents (Contents of Synopsis)
// ==========================================
// Notice: User specified "I want just the table of contents and then the content from the next page"

// Page border
doc.rect(40, 20, 515, 802).strokeColor('#0f172a').lineWidth(1).stroke();

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text('Contents of Synopsis', { align: 'center' });
doc.moveDown(0.2);
doc.moveTo(215, doc.y).lineTo(380, doc.y).strokeColor('#0f172a').lineWidth(1.2).stroke();
doc.moveDown(1.8);

const tocRows = [
  { col1: 'Topics', col2: 'Page No.', isHeader: true },
  { col1: 'Abstract', col2: '2' },
  { col1: 'Synopsis', col2: '3' },
  { col1: '   1. Name / Title of the Project', col2: '3' },
  { col1: '   2. Statement About the Problem', col2: '3' },
  { col1: '   3. Why is the Particular Topic Chosen?', col2: '4' },
  { col1: '   4. Proposed Solution', col2: '4' },
  { col1: '   5. Objective and Scope of the Project', col2: '5' },
  { col1: '   6. Hardware and Software to be Used', col2: '6' },
  { col1: '   7. Methodology (Summary of the Project)', col2: '7' },
  { col1: '   8. USE CASE Diagram', col2: '9' },
  { col1: '   9. Data Flow Diagram (DFD)', col2: '10' },
  { col1: '   10. Entity Relationship Diagram (ERD)', col2: '12' },
  { col1: '   11. What Contribution Would the Project Make?', col2: '13' },
  { col1: 'References', col2: '14' },
];

drawBoxedTable(doc, 50, 95, 495, tocRows);

// ==========================================
// PAGE 2: Project Info & Abstract
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 1);

doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', 50, 48, { align: 'center' });
doc.fontSize(10).text('FULL-STACK WEB DEVELOPMENT PROJECT SYNOPSIS', { align: 'center' });
doc.moveDown(0.5);
doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#94a3b8').lineWidth(0.5).stroke();
doc.moveDown(1);

doc.font('Helvetica-Bold').fontSize(16).fillColor(PRIMARY_COLOR).text('EVENTTICKET', { align: 'center' });
doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text('A Full-Stack Real-Time Event Ticket Booking Web Application', { align: 'center' });
doc.font('Helvetica').fontSize(9).fillColor(MUTED_COLOR).text('(Engineered with React 19, Express, WebSockets, JWT Authentication & Dynamic QR Ticketing)', { align: 'center' });
doc.moveDown(0.8);

// Summary Table
const metaRows = [
  { col1: 'Project Title', col2: 'EventTicket — Real-Time Ticket Booking Platform', col1Width: 140 },
  { col1: 'Technology Stack', col2: 'React 19, TypeScript, Tailwind CSS, Express, Node.js', col1Width: 140 },
  { col1: 'Real-Time Protocol', col2: 'Socket.io (Bidirectional WebSocket Rooms)', col1Width: 140 },
  { col1: 'Authentication', col2: 'JSON Web Tokens (JWT) + bcryptjs Password Hashing', col1Width: 140 },
  { col1: 'Digital Ticketing', col2: 'Dynamic QR Code Generation (qrcode.react) + Digital Pass', col1Width: 140 },
  { col1: 'Database Layer', col2: 'Persistent Storage Engine / MongoDB Mongoose Compatible', col1Width: 140 },
  { col1: 'Department & Year', col2: 'Computer Science & Engineering (Diploma / B.Tech) | 2025–2026', col1Width: 140 },
];
drawBoxedTable(doc, 50, doc.y, 495, metaRows);

doc.moveDown(1.2);
doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a').text('ABSTRACT');
doc.moveDown(0.4);

doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_COLOR).text(
  'In the contemporary digital era, event organization across educational institutions, technical conferences, collegiate fests, and workshops demands instantaneous, reliable, and frictionless ticket reservation. Traditional ticketing portals are often burdened with mandatory third-party payment gateways, sluggish server response times, high commission overheads, and severe concurrency bottlenecks that frequently lead to overbooking and database race conditions when multiple users contest the same limited seats.',
  { align: 'justify', lineGap: 3 }
);
doc.moveDown(0.6);
doc.text(
  'EventTicket is an advanced, production-grade full-stack web application designed specifically to eliminate payment friction through instant one-click reservations while preserving rigorous seat availability integrity via real-time WebSocket synchronization (Socket.io). Built on a modern decoupled architecture using React 19, TypeScript, Tailwind CSS, and Node.js Express, the platform delivers instantaneous multi-client seat decrements across all connected viewports without requiring manual browser refreshes.',
  { align: 'justify', lineGap: 3 }
);
doc.moveDown(0.6);
doc.text(
  'The application features an interactive visual auditorium seating grid (Rows A–D, Seats 1–8), automated unique alphanumeric booking identifiers (TKT-YYYYMMDD-XXXX), dynamic high-density QR code digital passes, and an email-based "My Bookings" retrieval portal. For event coordinators, EventTicket incorporates a secure JWT-authenticated administrative dashboard featuring live KPI counters, complete event CRUD capabilities, and a 1-click QR/ID venue gate check-in scanner to mark tickets as "Used".',
  { align: 'justify', lineGap: 3 }
);

// ==========================================
// PAGE 3: Sections 1, 2, 3
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 3);

doc.font('Helvetica-Bold').fontSize(14).fillColor('#0f172a').text('SYNOPSIS', 50, 48);
doc.moveDown(0.5);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('1. Name / Title of the Project');
doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('Project Title: EventTicket — Full-Stack Real-Time Event Ticket Booking Web Application');
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_COLOR).text(
  'EventTicket is a specialized, responsive real-time web application that facilitates rapid discovery, seat reservation, and digital ticketing for campus and community events. Utilizing event-driven WebSockets and stateless token-based authorization, the platform runs seamlessly across all modern web browsers without requiring third-party software installation or payment gateway credentials.',
  { align: 'justify', lineGap: 2.5 }
);

doc.moveDown(0.8);
doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('2. Statement About the Problem');
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_COLOR).text(
  'Thorough investigation of existing commercial and open-source ticketing platforms reveals several critical shortcomings when applied to collegiate, community, and non-commercial environments:',
  { align: 'justify', lineGap: 2 }
);
doc.moveDown(0.4);

const problems = [
  'Payment Gateway Roadblocks: Most ticketing platforms mandate credit/debit card merchant integrations, adding friction, transaction charges, and privacy concerns for free campus symposiums and student club events.',
  'Concurrency Collisions & Overbooking: In high-demand event launches, conventional polling or standard HTTP request-response architectures fail to communicate instant seat reductions, resulting in multiple attendees booking the same final seats.',
  'Lack of Real-Time Viewport Sync: Users must repeatedly press manual refresh to ascertain if tickets remain available, causing unnecessary server traffic and degraded user experiences.',
  'Vulnerable Paper & Static Tickets: Static PDF attachments or paper receipts are easily replicated, modified, or forwarded, lacking live digital verification at entry gates.',
  'Absence of Integrated Gate Validation: Event coordinators lack a simple, unified, JWT-protected administrative dashboard to monitor live capacity and scan/validate tickets upon attendee arrival.'
];

problems.forEach((p) => {
  doc.circle(60, doc.y + 5, 2).fillColor('#0f172a').fill();
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(p, 70, doc.y, { width: 475, align: 'justify', lineGap: 2 });
  doc.moveDown(0.3);
});

doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('3. Why is the Particular Topic Chosen?');
doc.moveDown(0.3);

const reasons = [
  'Practical Industry Relevance: Combines mission-critical modern full-stack competencies: bidirectional WebSockets, asynchronous state management, JWT security, and atomic database updates.',
  'Solves a Tangible Real-World Need: Universities and technical societies frequently organize hackathons, guest lectures, cultural fests, and gaming championships that demand immediate registration without financial barriers.',
  'Demonstrates Concurrency Mastery: Illustrates how server-authoritative state models and WebSocket rooms prevent negative seat quantities during peak traffic spikes.',
  'Comprehensive End-to-End Architecture: Spans the complete lifecycle from attendee discovery, visual seat selection, and vector QR pass rendering to administrative gate check-ins.'
];

reasons.forEach((r) => {
  doc.circle(60, doc.y + 5, 2).fillColor('#0f172a').fill();
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(r, 70, doc.y, { width: 475, align: 'justify', lineGap: 2 });
  doc.moveDown(0.3);
});

// ==========================================
// PAGE 4: Sections 4 & 5
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 4);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('4. Proposed Solution', 50, 48);
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_COLOR).text(
  'EventTicket directly resolves the identified problems by providing a high-performance, real-time web portal engineered with the following robust modules:',
  { align: 'justify', lineGap: 2 }
);
doc.moveDown(0.4);

const solutions = [
  'Instant Zero-Payment Booking Engine: Users enter only attendee name and email to immediately secure seats with no credit cards, merchant APIs, or payment timeouts required.',
  'WebSocket Room Synchronization: Built with Socket.io; whenever a reservation is confirmed, the server decrements seats atomically and broadcasts `seat-updated` to `event-${id}` and global channels within milliseconds.',
  'Visual Auditorium Seating Plan: Features an interactive 4-row by 8-column seat layout (Rows A–D, Seats 1–8) with real-time occupied/reserved indicators coupled to a rapid ticket counter (1–6 seats).',
  'Dynamic Digital Boarding Pass with QR Code: Every successful booking automatically generates a unique booking ID (e.g., TKT-20260914-XXXX) and encodes verification metadata into an SVG QR code.',
  'Print & PDF Optimization: Equipped with specialized CSS print media queries allowing attendees to print or save crisp physical or PDF passes directly from any browser.',
  'Email-Based "My Bookings" Self-Service: Users can retrieve and reprint all historical and upcoming ticket passes simply by entering their email address.',
  'Protected Admin Command Center: JWT Bearer-token secured portal providing live KPI metrics, full event CRUD controls, and an instant gate check-in scanner to mark tickets as "Used".',
  'Adaptive Dark/Light Interface: Designed with Tailwind CSS supporting persistent theme preference toggling and responsive scaling across mobile, tablet, and desktop viewports.'
];

solutions.forEach((s) => {
  doc.circle(60, doc.y + 5, 2).fillColor('#0f172a').fill();
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(s, 70, doc.y, { width: 475, align: 'justify', lineGap: 2 });
  doc.moveDown(0.25);
});

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('5. Objective and Scope of the Project');
doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text('Objectives:');
doc.moveDown(0.2);

const objectives = [
  '1. To build a responsive, single-page full-stack ticketing platform using React 19, TypeScript, and Express.',
  '2. To implement bidirectional real-time communication via Socket.io for instantaneous seat count synchronization.',
  '3. To engineer a secure JWT-authenticated admin module using bcryptjs password hashing and route middleware.',
  '4. To automate vector QR code generation (qrcode.react) containing embedded attendee verification payloads.',
  '5. To develop a client-side lookup mechanism enabling attendees to search and retrieve booked passes via email.',
  '6. To enforce server-side validation ensuring available seat counts never go negative under concurrent booking bursts.'
];

objectives.forEach((o) => {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(o, 65, doc.y, { width: 480, lineGap: 2 });
  doc.moveDown(0.2);
});

doc.moveDown(0.4);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text('Scope of the Project:');
doc.moveDown(0.2);

doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a').text('What is In Scope:');
const inScope = [
  '• Real-time multi-client seat updates for all listed events.',
  '• Instant ticket reservations with attendee name and email.',
  '• Interactive seating layout selection and quick quantity stepper.',
  '• Unique booking ID and encrypted QR code pass rendering.',
  '• Dedicated print stylesheets for physical boarding pass generation.',
  '• JWT-protected admin dashboard with event CRUD and ticket check-in.'
];
inScope.forEach((item) => doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_COLOR).text(item, 70, doc.y));

doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a').text('What is Out of Scope:');
const outScope = [
  '• Third-party commercial payment gateways (credit cards / Stripe / PayPal).',
  '• Native compiled mobile apps (distributed as a universal responsive PWA-ready web application).',
  '• Facial biometric attendee identification at gates.'
];
outScope.forEach((item) => doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_COLOR).text(item, 70, doc.y));

// ==========================================
// PAGE 5: Section 6 Hardware & Software
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 5);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('6. Hardware and Software to be Used', 50, 48);
doc.moveDown(0.5);

doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('Hardware Requirements:');
doc.moveDown(0.3);

const hwRows = [
  { col1: 'Component', col2: 'Minimum Requirement', isHeader: true, col1Width: 170 },
  { col1: 'Processor', col2: 'Intel Core i3 / AMD Ryzen 3 or equivalent', col1Width: 170 },
  { col1: 'System Memory (RAM)', col2: '4 GB RAM minimum (8 GB recommended for dev)', col1Width: 170 },
  { col1: 'Storage Space', col2: '500 MB free hard disk space for Node environment', col1Width: 170 },
  { col1: 'Internet Connection', col2: 'Active broadband or 4G/5G mobile connection', col1Width: 170 },
  { col1: 'Display Resolution', col2: '1024 x 768 pixels minimum (responsive mobile supported)', col1Width: 170 },
  { col1: 'Input Devices', col2: 'Standard Keyboard and Mouse / Smartphone Touchscreen', col1Width: 170 },
];
drawBoxedTable(doc, 50, doc.y, 495, hwRows);

doc.moveDown(1);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('Software Requirements:');
doc.moveDown(0.3);

const swRows = [
  { col1: 'Category', col2: 'Tool / Technology Used', isHeader: true, col1Width: 170 },
  { col1: 'Frontend Library', col2: 'React 19 (Hooks, Functional Architecture)', col1Width: 170 },
  { col1: 'Programming Language', col2: 'TypeScript (Strict Static Typing)', col1Width: 170 },
  { col1: 'Styling & Layout', col2: 'Tailwind CSS v4 (Utility-first, Dark Mode Support)', col1Width: 170 },
  { col1: 'Backend Server', col2: 'Node.js runtime with Express.js Framework', col1Width: 170 },
  { col1: 'Real-Time WebSockets', col2: 'Socket.io (Engine.IO Server & Socket.io-Client)', col1Width: 170 },
  { col1: 'Authentication', col2: 'jsonwebtoken (JWT) + bcryptjs Password Hashing', col1Width: 170 },
  { col1: 'QR Code Generation', col2: 'qrcode.react (SVG / Canvas dynamic generator)', col1Width: 170 },
  { col1: 'Database Engine', col2: 'Atomic Persistent JSON Store / MongoDB Mongoose Compatible', col1Width: 170 },
  { col1: 'Build & Bundling Tool', col2: 'Vite 6 + esbuild + tsx execution engine', col1Width: 170 },
  { col1: 'Development Environment', col2: 'Visual Studio Code (VS Code)', col1Width: 170 },
  { col1: 'Supported Browsers', col2: 'Google Chrome, Mozilla Firefox, Microsoft Edge, Safari', col1Width: 170 },
];
drawBoxedTable(doc, 50, doc.y, 495, swRows);

// ==========================================
// PAGE 6: Section 7 Methodology
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 6);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('7. Methodology (Summary of the Project)', 50, 48);
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9.5).fillColor(TEXT_COLOR).text(
  'The EventTicket system is developed using an agile, modular full-stack lifecycle divided into six systematic engineering phases:',
  { align: 'justify', lineGap: 2 }
);
doc.moveDown(0.4);

const phases = [
  {
    title: 'Phase 1 — Requirements Elicitation & Domain Modeling:',
    points: [
      '• Identified bottlenecks in campus ticket distribution: manual queues, overbooking, and payment hurdles.',
      '• Defined entity schemas for Events, Bookings, and Admin Credentials.',
      '• Formulated real-time concurrency rules to ensure availableSeats >= requestedSeats before booking execution.'
    ]
  },
  {
    title: 'Phase 2 — Server Architecture & WebSocket Integration:',
    points: [
      '• Built Express HTTP server integrated with Socket.io on port 3000.',
      '• Established room management (`join-event`, `leave-event`, `join-admin`) for localized event broadcast.',
      '• Implemented atomic database operations ensuring zero race conditions during simultaneous bookings.'
    ]
  },
  {
    title: 'Phase 3 — JWT Authentication & Security Hardening:',
    points: [
      '• Configured bcryptjs password hashing with 10 salt rounds for administrator accounts.',
      '• Implemented stateless JWT issuance with 7-day expiration and Authorization Bearer header extraction.',
      '• Protected admin API endpoints (`/api/admin/*`) via dedicated Express middleware.'
    ]
  },
  {
    title: 'Phase 4 — Frontend UI & Interactive Seat Picker (React + Tailwind):',
    points: [
      '• Designed responsive homepage with dynamic category filters, search bar, and live availability pill badges.',
      '• Created interactive 32-seat visual auditorium layout (Rows A–D, Seats 1–8) with rapid quantity counters.',
      '• Engineered frictionless checkout form capturing name and email with instant validation.'
    ]
  },
  {
    title: 'Phase 5 — Digital Pass & QR Code Generation:',
    points: [
      '• Engineered unique booking identifier generator formatted as `TKT-YYYYMMDD-XXXX`.',
      '• Rendered high-density SVG QR codes storing verifiable cryptographic booking verification payloads.',
      '• Crafted realistic perforated boarding pass UI with dedicated `@media print` stylesheets.'
    ]
  },
  {
    title: 'Phase 6 — Testing, Verification & Gate Validation Scanner:',
    points: [
      '• Conducted multi-browser WebSocket concurrency testing verifying sub-second seat updates across tabs.',
      '• Verified JWT token expiration, invalid credential handling, and route protection.',
      '• Built administrator check-in scanner validating booking IDs and marking passes as "Used".'
    ]
  }
];

phases.forEach((p) => {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text(p.title);
  doc.moveDown(0.1);
  p.points.forEach((pt) => {
    doc.font('Helvetica').fontSize(8.5).fillColor(TEXT_COLOR).text(pt, 65, doc.y, { width: 480, lineGap: 1.5 });
  });
  doc.moveDown(0.25);
});

// ==========================================
// PAGE 7: Section 8 USE CASE Diagram
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 7);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('8. USE CASE Diagram', 50, 48);
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(
  'The Use Case diagram illustrates the operational actors (Attendee / Browser User and Event Administrator) interacting with the EventTicket system boundary and the background WebSocket broadcast engine.',
  { align: 'justify', lineGap: 2 }
);
doc.moveDown(0.4);

// ASCII Use Case Diagram Box
const ucDiagramText = [
  '┌────────────────────────────────────────────────────────────────────────┐',
  '│                       << EVENTTICKET SYSTEM >>                         │',
  '│                                                                        │',
  '│  (UC1) Browse Upcoming Events & Live Seats Filter                     │',
  '│  (UC2) Select Seats on Interactive Auditorium Grid                     │',
  '│  (UC3) Reserve Instant Tickets (No Payment Gateway)                   │',
  '│  (UC4) View Digital Pass with Dynamic QR Code & Print PDF             │',
  '│  (UC5) Search & Retrieve Bookings via Email                           │',
  '│  (UC6) Admin JWT Login & Authenticated Session                        │',
  '│  (UC7) Manage Events CRUD (Create, Edit, Delete, Toggle Active)       │',
  '│  (UC8) Gate Check-in: Scan QR / Validate Booking ID to "Used"         │',
  '└────────────────────────────────────────────────────────────────────────┘',
  '      ▲                                                    ▲              ',
  '      │ interacts                                          │ broadcasts   ',
  '┌─────┴──────┐                                      ┌──────┴──────┐       ',
  '│   USER     │                                      │  SOCKET.IO  │       ',
  '│ (Attendee) │                                      │ REAL-TIME WS│       ',
  '└────────────┘                                      └─────────────┘       ',
  '      ▲                                                                   ',
  '      │ logs in (JWT)                                                     ',
  '┌─────┴──────┐                                                            ',
  '│   ADMIN    │                                                            ',
  '│(Organizer) │                                                            ',
  '└────────────┘                                                            '
];

doc.rect(50, doc.y, 495, 145).fill('#f8fafc').strokeColor('#94a3b8').lineWidth(0.5).stroke();
doc.font('Courier').fontSize(7.8).fillColor('#0f172a');
let ucY = doc.y + 6;
ucDiagramText.forEach((line) => {
  doc.text(line, 55, ucY, { width: 485, align: 'center' });
  ucY += 9;
});

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('Use Case Descriptions:');
doc.moveDown(0.3);

const ucRows = [
  { col1: 'Use Case ID & Name', col2: 'Description', isHeader: true, col1Width: 150 },
  { col1: 'UC1: Browse Events', col2: 'User views live event catalog with real-time available seat counter badges.', col1Width: 150 },
  { col1: 'UC2: Select Seats', col2: 'User selects 1–6 tickets or picks exact seats (Rows A–D) on visual layout.', col1Width: 150 },
  { col1: 'UC3: Instant Booking', col2: 'User inputs name and email; seats are atomically decremented on server.', col1Width: 150 },
  { col1: 'UC4: View QR Pass', col2: 'System generates unique TKT ID and SVG QR code ready for PDF download/print.', col1Width: 150 },
  { col1: 'UC5: My Bookings', col2: 'User enters email address to retrieve all associated active/past reservations.', col1Width: 150 },
  { col1: 'UC6: Admin Auth', col2: 'Admin logs in via email/password; server validates bcrypt hash & issues JWT.', col1Width: 150 },
  { col1: 'UC7: Event CRUD', col2: 'Admin creates, updates, deletes events or adjusts seating capacity limits.', col1Width: 150 },
  { col1: 'UC8: Gate Validation', col2: 'Admin scans or pastes Booking ID to mark admission pass as "Used".', col1Width: 150 },
];
drawBoxedTable(doc, 50, doc.y, 495, ucRows);

// ==========================================
// PAGE 8: Section 9 Data Flow Diagram (DFD)
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 8);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('9. Data Flow Diagram (DFD)', 50, 48);
doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text('Level 0 DFD — Context Diagram:');
doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(
  'The Context Diagram models EventTicket as a unified black-box process illustrating primary external entities and bidirectional information pipelines.',
  { lineGap: 2 }
);
doc.moveDown(0.3);

const dfd0Text = [
  '┌──────────────┐     Attendee Details / Seat Requests     ┌──────────────┐',
  '│              ├─────────────────────────────────────────>│              │',
  '│    USER      │<─────────────────────────────────────────┤  EVENTTICKET │',
  '│  (Attendee)  │       Confirmed QR Ticket / Live Sync    │    SYSTEM    │',
  '└──────────────┘                                          │              │',
  '                                                          │  (Process 0) │',
  '┌──────────────┐     Admin Credentials / Event Updates    │              │',
  '│    ADMIN     ├─────────────────────────────────────────>│              │',
  '│  (Organizer) │<─────────────────────────────────────────┤              │',
  '└──────────────┘     KPI Metrics / Attendee Roster        └──────┬───────┘',
  '                                                                 │        ',
  '                                    Broadcasts Seat Changes      │        ',
  '                                    via WebSocket Events         ▼        ',
  '                                                        ┌────────────────┐',
  '                                                        │   SOCKET.IO    │',
  '                                                        │ CLIENT VIEWERS │',
  '                                                        └────────────────┘'
];

doc.rect(50, doc.y, 495, 120).fill('#f8fafc').strokeColor('#94a3b8').lineWidth(0.5).stroke();
doc.font('Courier').fontSize(7.8).fillColor('#0f172a');
let dfd0Y = doc.y + 6;
dfd0Text.forEach((line) => {
  doc.text(line, 55, dfd0Y, { width: 485, align: 'center' });
  dfd0Y += 8.8;
});

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text('Level 1 DFD — Functional Process Decomposition:');
doc.moveDown(0.3);

const dfd1Rows = [
  { col1: 'Process Identifier', col2: 'Operational Functionality', isHeader: true, col1Width: 150 },
  { col1: 'P1: Input Validation', col2: 'Validates attendee email format, ticket count > 0, and non-empty name.', col1Width: 150 },
  { col1: 'P2: Capacity Verifier', col2: 'Inspects if event.availableSeats >= seatsBooked to guarantee availability.', col1Width: 150 },
  { col1: 'P3: Seat Deduction Engine', col2: 'Atomically decrements availableSeats and updates event timestamp in DB.', col1Width: 150 },
  { col1: 'P4: QR Pass Synthesizer', col2: 'Generates unique TKT ID and encrypts verification JSON into SVG QR code.', col1Width: 150 },
  { col1: 'P5: WebSocket Broadcaster', col2: 'Emits `seat-updated` payload to event room and `new-booking` to admin.', col1Width: 150 },
  { col1: 'P6: JWT Auth & Verifier', col2: 'Authenticates admin credentials via bcrypt and signs/verifies JWT tokens.', col1Width: 150 },
  { col1: 'P7: Gate Check-in Handler', col2: 'Matches scanned Booking ID and updates ticket status from Booked to Used.', col1Width: 150 },
];
drawBoxedTable(doc, 50, doc.y, 495, dfd1Rows);

// ==========================================
// PAGE 9: Section 10 Entity Relationship Diagram (ERD)
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 9);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('10. Entity Relationship Diagram (ERD)', 50, 48);
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(
  'The logical relational data model of EventTicket is shown below. An Event entity maintains a one-to-many relationship with Bookings. Each Booking references an Event and attendee information with embedded QR verification data.',
  { align: 'justify', lineGap: 2 }
);
doc.moveDown(0.4);

const erdText = [
  '┌─────────────────────────┐                ┌───────────────────────────────┐',
  '│          EVENT          │                │            BOOKING            │',
  '├─────────────────────────┤                ├───────────────────────────────┤',
  '│ PK  _id                 │───1:N─────────>│ PK  _id                       │',
  '│     title               │                │ FK  eventId                   │',
  '│     description         │                │     bookingId (Unique Index)  │',
  '│     date                │                │     eventTitle                │',
  '│     time                │                │     userName                  │',
  '│     venue               │                │     userEmail (Indexed)       │',
  '│     totalSeats          │                │     seatsBooked               │',
  '│     availableSeats      │                │     selectedSeats [Array]     │',
  '│     image               │                │     qrCodeData (Encrypted)    │',
  '│     category            │                │     status (Booked|Used|Canc) │',
  '│     isActive            │                │     createdAt                 │',
  '│     createdAt           │                └───────────────────────────────┘',
  '│     updatedAt           │                                                 ',
  '└─────────────────────────┘                                                 ',
  '                                           ┌───────────────────────────────┐',
  '                                           │           USER_ADMIN          │',
  '                                           ├───────────────────────────────┤',
  '                                           │ PK  _id                       │',
  '                                           │     name                      │',
  '                                           │     email (Unique)            │',
  '                                           │     password (bcrypt hash)    │',
  '                                           │     role ("admin")            │',
  '                                           │     createdAt                 │',
  '                                           └───────────────────────────────┘'
];

doc.rect(50, doc.y, 495, 175).fill('#f8fafc').strokeColor('#94a3b8').lineWidth(0.5).stroke();
doc.font('Courier').fontSize(7.5).fillColor('#0f172a');
let erdY = doc.y + 6;
erdText.forEach((line) => {
  doc.text(line, 55, erdY, { width: 485, align: 'center' });
  erdY += 9;
});

doc.moveDown(1.5);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text('Entity Descriptions:');
doc.moveDown(0.3);

const entityRows = [
  { col1: 'Entity Name', col2: 'Description & Storage Strategy', isHeader: true, col1Width: 140 },
  { col1: 'EVENT', col2: 'Stores event schedules, venues, category, total capacity, and dynamic available seats. Maintained in database with atomic updates.', col1Width: 140 },
  { col1: 'BOOKING', col2: 'Represents confirmed ticket reservations with unique TKT ID, attendee details, allocated seat tags, QR payload, and validation status.', col1Width: 140 },
  { col1: 'USER_ADMIN', col2: 'Maintains administrative credentials with salted bcrypt hashes for JWT login authentication.', col1Width: 140 },
];
drawBoxedTable(doc, 50, doc.y, 495, entityRows);

// ==========================================
// PAGE 10: Section 11 & References
// ==========================================
doc.addPage();
drawPageHeader(doc);
drawPageFooter(doc, 10);

doc.font('Helvetica-Bold').fontSize(11).fillColor(PRIMARY_COLOR).text('11. What Contribution Would the Project Make?', 50, 48);
doc.moveDown(0.3);

const contributions = [
  {
    title: 'For Students and Technical Learners:',
    text: 'Provides a pristine, real-world reference implementation demonstrating how to build full-stack systems using React 19, TypeScript, and Express. It demystifies real-time WebSockets (Socket.io), atomic database transactions, stateless JWT security, and vector QR code synthesis.'
  },
  {
    title: 'For Campus Organizers and Academic Communities:',
    text: 'Delivers an immediately deployable, zero-cost ticketing portal for college fests, symposiums, and coding competitions without paying commercial platform fees or configuring credit card merchant gateways.'
  },
  {
    title: 'Technical & Architectural Contribution:',
    text: 'Demonstrates modern software engineering principles including server-authoritative state synchrony, race-condition mitigation under concurrent bursts, print-ready digital passes, and modular component architecture.'
  },
  {
    title: 'Academic Contribution:',
    text: 'Exemplifies core curriculum competencies in Web Technology, Computer Networks (WebSockets), Operating Systems (Concurrency & Locking), Database Systems (ACID Transactions), and Information Security (JWT & bcrypt).'
  }
];

contributions.forEach((c) => {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text(c.title);
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_COLOR).text(c.text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.3);
});

doc.moveDown(0.6);
doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text('REFERENCES');
doc.moveDown(0.3);

const refs = [
  '[1] Socket.io Documentation, "Bidirectional and low-latency communication for every platform," Socket.io, 2024. [Online]. Available: https://socket.io/docs/v4/',
  '[2] RFC 7519, "JSON Web Token (JWT)," Internet Engineering Task Force (IETF), May 2015. [Online]. Available: https://tools.ietf.org/html/rfc7519',
  '[3] React Documentation, "React 19 Architecture and Server Components," ReactJS.org, 2024. [Online]. Available: https://react.dev',
  '[4] Express.js, "Fast, unopinionated, minimalist web framework for Node.js," Expressjs.com, 2024. [Online]. Available: https://expressjs.com',
  '[5] Tailwind Labs, "Tailwind CSS v4 Documentation," Tailwindcss.com, 2024. [Online]. Available: https://tailwindcss.com',
  '[6] ISO/IEC 18004, "Information technology — Automatic identification and data capture techniques — QR Code bar code symbology specification," ISO, 2015.',
  '[7] N. Provos and D. Mazieres, "A future-adaptable password scheme (bcrypt)," in USENIX Annual Technical Conference, 1999.',
  '[8] M. Fowler, "Patterns of Enterprise Application Architecture," Addison-Wesley Professional, 2002.',
  '[9] Mozilla Developer Network, "WebSockets API," MDN Web Docs, 2024. [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'
];

refs.forEach((r) => {
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_COLOR).text(r, { align: 'justify', lineGap: 1.5 });
  doc.moveDown(0.2);
});

doc.end();

writeStream.on('finish', () => {
  console.log('✅ EventTicket Project Synopsis PDF generated successfully at:', outputPath);
});
