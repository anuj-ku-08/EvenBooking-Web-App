import React from 'react';
import { Download, Printer, ArrowLeft, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

interface SynopsisViewProps {
  onBack: () => void;
}

export const SynopsisView: React.FC<SynopsisViewProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Action Bar (hidden when printing) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <a
            href="/EventTicket_Project_Synopsis.pdf"
            download="EventTicket_Project_Synopsis.pdf"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Synopsis PDF</span>
          </a>
        </div>
      </div>

      {/* Main Document Paper Sheet */}
      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-12 shadow-md space-y-12 text-slate-800 dark:text-slate-200 print:border-none print:shadow-none print:p-0">
        {/* =========================================================================
            PAGE 1 (In Request: "I want just the table of contents and then the content from the next page")
           ========================================================================= */}
        <section className="border border-slate-900 dark:border-slate-700 p-8 rounded-lg space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight underline uppercase">
              Contents of Synopsis
            </h1>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-400 dark:border-slate-600">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <th className="border border-slate-400 dark:border-slate-600 px-4 py-2 text-left">Topics</th>
                  <th className="border border-slate-400 dark:border-slate-600 px-4 py-2 text-center w-28">Page No.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 font-bold">Abstract</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 text-center">2</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 font-bold">Synopsis</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 text-center">3</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">1. Name / Title of the Project</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">3</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">2. Statement About the Problem</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">3</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">3. Why is the Particular Topic Chosen?</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">4</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">4. Proposed Solution</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">4</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">5. Objective and Scope of the Project</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">5</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">6. Hardware and Software to be Used</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">6</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">7. Methodology (Summary of the Project)</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">7</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">8. USE CASE Diagram</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">9</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">9. Data Flow Diagram (DFD)</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">10</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">10. Entity Relationship Diagram (ERD)</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">12</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-6 py-1.5">11. What Contribution Would the Project Make?</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-1.5 text-center">13</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 font-bold">References</td>
                  <td className="border border-slate-400 dark:border-slate-600 px-4 py-2 text-center">14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-700 my-8"></div>

        {/* =========================================================================
            PAGE 2: Project Header & Abstract
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">Department of Computer Science & Engineering</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
              PROJECT SYNOPSIS
            </h2>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              EVENTTICKET: A Full-Stack Real-Time Event Ticket Booking Web Application
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              (Engineered with React 19, Express, WebSockets, JWT Authentication & Dynamic QR Ticketing)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300 dark:border-slate-700">
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2 w-44">Project Title</td>
                  <td className="px-4 py-2">EventTicket — Real-Time Ticket Booking Platform</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2">Technology Used</td>
                  <td className="px-4 py-2">React 19, TypeScript, Tailwind CSS, Express, Node.js</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2">Real-Time Protocol</td>
                  <td className="px-4 py-2">Socket.io (WebSocket Room Broadcasting)</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2">Authentication</td>
                  <td className="px-4 py-2">JSON Web Tokens (JWT) + bcryptjs Password Hashing</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2">Ticketing Engine</td>
                  <td className="px-4 py-2">Dynamic Vector QR Code Generation (qrcode.react) + Digital Pass</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 dark:bg-slate-800 font-bold px-4 py-2">Department & Year</td>
                  <td className="px-4 py-2">Computer Science & Engineering (Diploma / B.Tech) | 2025 – 2026</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-1 border-slate-200 dark:border-slate-700">
              ABSTRACT
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              In the contemporary digital era, event organization across educational institutions, technical conferences, collegiate fests, and workshops demands instantaneous, reliable, and frictionless ticket reservation. Traditional ticketing portals are often burdened with mandatory third-party payment gateways, sluggish server response times, high commission overheads, and severe concurrency bottlenecks that frequently lead to overbooking and database race conditions when multiple users contest the same limited seats.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              <strong>EventTicket</strong> is an advanced, production-grade full-stack web application designed specifically to eliminate payment friction through instant one-click reservations while preserving rigorous seat availability integrity via real-time WebSocket synchronization (Socket.io). Built on a modern decoupled architecture using React 19, TypeScript, Tailwind CSS, and Node.js Express, the platform delivers instantaneous multi-client seat decrements across all connected viewports without requiring manual browser refreshes.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              The application features an interactive visual auditorium seating grid (Rows A–D, Seats 1–8), automated unique alphanumeric booking identifiers (<code>TKT-YYYYMMDD-XXXX</code>), dynamic high-density QR code digital passes, and an email-based "My Bookings" retrieval portal. For event coordinators, EventTicket incorporates a secure JWT-authenticated administrative dashboard featuring live KPI counters, complete event CRUD capabilities, and a 1-click QR/ID venue gate check-in scanner to mark tickets as "Used".
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTIONS 1 TO 11
           ========================================================================= */}
        <section className="space-y-8">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              1. Name / Title of the Project
            </h3>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Project Title: EventTicket — Full-Stack Real-Time Event Ticket Booking Web Application
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
              EventTicket is a specialized, responsive real-time web application that facilitates rapid discovery, seat reservation, and digital ticketing for campus and community events. Utilizing event-driven WebSockets and stateless token-based authorization, the platform runs seamlessly across all modern web browsers without requiring third-party software installation or payment gateway credentials.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              2. Statement About the Problem
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              The following critical problems are observed with existing commercial and generic ticketing tools:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1.5 text-slate-700 dark:text-slate-300 text-justify">
              <li>
                <strong>Payment Gateway Roadblocks:</strong> Most ticketing platforms mandate credit/debit card merchant integrations, adding friction, transaction charges, and privacy concerns for free campus symposiums and student club events.
              </li>
              <li>
                <strong>Concurrency Collisions & Overbooking:</strong> In high-demand event launches, conventional polling or standard HTTP request-response architectures fail to communicate instant seat reductions, resulting in multiple attendees booking the same final seats.
              </li>
              <li>
                <strong>Lack of Real-Time Viewport Sync:</strong> Users must repeatedly press manual refresh to ascertain if tickets remain available, causing unnecessary server traffic and degraded user experiences.
              </li>
              <li>
                <strong>Vulnerable Paper & Static Tickets:</strong> Static PDF attachments or paper receipts are easily replicated, modified, or forwarded, lacking live digital verification at entry gates.
              </li>
              <li>
                <strong>Absence of Integrated Gate Validation:</strong> Event coordinators lack a simple, unified, JWT-protected administrative dashboard to monitor live capacity and scan/validate tickets upon attendee arrival.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              3. Why is the Particular Topic Chosen?
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-1.5 text-slate-700 dark:text-slate-300 text-justify">
              <li>
                <strong>Practical Industry Relevance:</strong> Combines mission-critical modern full-stack competencies: bidirectional WebSockets, asynchronous state management, JWT security, and atomic database updates.
              </li>
              <li>
                <strong>Solves a Tangible Real-World Need:</strong> Universities and technical societies frequently organize hackathons, guest lectures, cultural fests, and gaming championships that demand immediate registration without financial barriers.
              </li>
              <li>
                <strong>Demonstrates Concurrency Mastery:</strong> Illustrates how server-authoritative state models and WebSocket rooms prevent negative seat quantities during peak traffic spikes.
              </li>
              <li>
                <strong>Comprehensive End-to-End Architecture:</strong> Spans the complete lifecycle from attendee discovery, visual seat selection, and vector QR pass rendering to administrative gate check-ins.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              4. Proposed Solution
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              EventTicket directly resolves the identified problems by providing a high-performance, real-time web portal engineered with the following robust modules:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1.5 text-slate-700 dark:text-slate-300 text-justify">
              <li>
                <strong>Instant Zero-Payment Booking Engine:</strong> Users enter only attendee name and email to immediately secure seats with no credit cards, merchant APIs, or payment timeouts required.
              </li>
              <li>
                <strong>WebSocket Room Synchronization:</strong> Built with Socket.io; whenever a reservation is confirmed, the server decrements seats atomically and broadcasts <code>seat-updated</code> to <code>event-$&#123;id&#125;</code> and global channels within milliseconds.
              </li>
              <li>
                <strong>Visual Auditorium Seating Plan:</strong> Features an interactive 4-row by 8-column seat layout (Rows A–D, Seats 1–8) with real-time occupied/reserved indicators coupled to a rapid ticket counter (1–6 seats).
              </li>
              <li>
                <strong>Dynamic Digital Boarding Pass with QR Code:</strong> Every successful booking automatically generates a unique booking ID (e.g., <code>TKT-20260914-XXXX</code>) and encodes verification metadata into an SVG QR code.
              </li>
              <li>
                <strong>Print & PDF Optimization:</strong> Equipped with specialized CSS print media queries allowing attendees to print or save crisp physical or PDF passes directly from any browser.
              </li>
              <li>
                <strong>Email-Based "My Bookings" Self-Service:</strong> Users can retrieve and reprint all historical and upcoming ticket passes simply by entering their email address.
              </li>
              <li>
                <strong>Protected Admin Command Center:</strong> JWT Bearer-token secured portal providing live KPI metrics, full event CRUD controls, and an instant gate check-in scanner to mark tickets as "Used".
              </li>
              <li>
                <strong>Adaptive Dark/Light Interface:</strong> Designed with Tailwind CSS supporting persistent theme preference toggling and responsive scaling across mobile, tablet, and desktop viewports.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              5. Objective and Scope of the Project
            </h3>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Objectives:</h4>
              <ol className="list-decimal pl-5 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>To build a responsive, single-page full-stack ticketing platform using React 19, TypeScript, and Express.</li>
                <li>To implement bidirectional real-time communication via Socket.io for instantaneous seat count synchronization.</li>
                <li>To engineer a secure JWT-authenticated admin module using bcryptjs password hashing and route middleware.</li>
                <li>To automate vector QR code generation (<code>qrcode.react</code>) containing embedded attendee verification payloads.</li>
                <li>To develop a client-side lookup mechanism enabling attendees to search and retrieve booked passes via email.</li>
                <li>To enforce server-side validation ensuring available seat counts never go negative under concurrent booking bursts.</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h5 className="font-bold text-xs uppercase text-emerald-600 dark:text-emerald-400 mb-1">In Scope:</h5>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                  <li>Real-time multi-client seat updates.</li>
                  <li>Instant bookings without payment gateways.</li>
                  <li>Interactive seating grid selection.</li>
                  <li>Dynamic QR code generation & boarding passes.</li>
                  <li>Email ticket retrieval portal.</li>
                  <li>JWT-protected Admin Dashboard & Gate Scanner.</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h5 className="font-bold text-xs uppercase text-rose-600 dark:text-rose-400 mb-1">Out of Scope:</h5>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                  <li>Commercial credit card payment gateway integration.</li>
                  <li>Native app store packaging (built as responsive PWA-ready web app).</li>
                  <li>Biometric facial attendee gate authentication.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              6. Hardware and Software to be Used
            </h3>
            <div className="space-y-2">
              <h4 className="font-bold text-sm">Hardware Requirements:</h4>
              <table className="w-full text-xs border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Component</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Minimum Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Processor</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Intel Core i3 / AMD Ryzen 3 or equivalent</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">RAM</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">4 GB RAM (8 GB recommended for development)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Storage</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">500 MB free space for Node.js environment & dependencies</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Internet Connection</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Active broadband or 4G/5G mobile connection</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-sm">Software Requirements:</h4>
              <table className="w-full text-xs border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Category</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Tool / Technology</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Frontend Library</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">React 19 (Hooks, Functional Components)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Programming Language</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">TypeScript (Strict static typing)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Styling & Layout</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Tailwind CSS v4 (Utility-first, Dark Mode Support)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Backend Server</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Node.js runtime with Express.js Framework</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Real-Time WebSockets</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Socket.io (Bidirectional WebSocket Engine)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Authentication</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">jsonwebtoken (JWT) + bcryptjs Password Hashing</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">QR Code Generator</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">qrcode.react (Vector SVG / Canvas)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-semibold">Data Storage Engine</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Persistent Atomic Store / MongoDB Mongoose Compatible</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              7. Methodology (Summary of the Project)
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              The project followed an agile full-stack software development lifecycle divided into six structured phases:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Phase 1 — Requirements Elicitation & Domain Modeling:</strong> Defined user journeys, non-payment instant reservation models, and seat concurrency guarantees.</p>
              <p><strong>Phase 2 — Server Architecture & WebSocket Integration:</strong> Developed Express HTTP server integrated with Socket.io on port 3000 with localized event room broadcasting.</p>
              <p><strong>Phase 3 — JWT Authentication & Security Hardening:</strong> Configured bcryptjs password hashing with 10 salt rounds and Bearer token verification middleware for admin operations.</p>
              <p><strong>Phase 4 — Frontend UI & Interactive Seat Picker:</strong> Implemented responsive cards, category filter tabs, visual auditorium grid (Rows A–D), and quantity steppers in React 19.</p>
              <p><strong>Phase 5 — Digital Pass & QR Code Generation:</strong> Integrated dynamic SVG QR generator storing cryptographically verifiable ticket metadata with print layout optimization.</p>
              <p><strong>Phase 6 — Testing, Verification & Gate Validation Scanner:</strong> Conducted multi-browser WebSocket concurrency validation and implemented 1-click admin check-in ticket validation.</p>
            </div>
          </div>

          {/* Section 8: Use Case */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              8. USE CASE Diagram
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              The Use Case diagram below depicts attendee and administrator interactions with the EventTicket system boundary and the real-time WebSocket layer.
            </p>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] sm:text-xs font-mono overflow-x-auto leading-tight shadow-inner">
{`┌────────────────────────────────────────────────────────────────────────┐
│                       << EVENTTICKET SYSTEM >>                         │
│                                                                        │
│  (UC1) Browse Upcoming Events & Live Seats Filter                     │
│  (UC2) Select Seats on Interactive Auditorium Grid                     │
│  (UC3) Reserve Instant Tickets (No Payment Gateway)                   │
│  (UC4) View Digital Pass with Dynamic QR Code & Print PDF             │
│  (UC5) Search & Retrieve Bookings via Email                           │
│  (UC6) Admin JWT Login & Authenticated Session                        │
│  (UC7) Manage Events CRUD (Create, Edit, Delete, Toggle Active)       │
│  (UC8) Gate Check-in: Scan QR / Validate Booking ID to "Used"         │
└────────────────────────────────────────────────────────────────────────┘
      ▲                                                    ▲              
      │ interacts                                          │ broadcasts   
┌─────┴──────┐                                      ┌──────┴──────┐       
│   USER     │                                      │  SOCKET.IO  │       
│ (Attendee) │                                      │ REAL-TIME WS│       
└────────────┘                                      └─────────────┘       
      ▲                                                                   
      │ logs in (JWT)                                                     
┌─────┴──────┐                                                            
│   ADMIN    │                                                            
│(Organizer) │                                                            
└────────────┘`}
            </pre>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left w-36">Use Case ID</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC1: Browse Events</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">User browses upcoming event cards with real-time seat scarcity badges.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC2: Select Seats</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">User selects 1–6 tickets or chooses exact seats on the 32-seat visual grid.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC3: Instant Booking</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">User submits name and email; seats are atomically decremented on server.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC4: View QR Pass</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">System generates unique TKT ID and SVG QR code ready for browser print/PDF.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC5: My Bookings</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">User retrieves passes using their registered email address.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC6: Admin Auth</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Admin authenticates with credentials; server returns signed 7-day JWT.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC7: Event CRUD</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Admin creates, updates, deletes, or changes event capacities.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">UC8: Gate Check-in</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Admin scans/validates Booking ID to mark ticket as "Used".</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 9: DFD */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              9. Data Flow Diagram (DFD)
            </h3>
            <h4 className="font-bold text-sm">Level 0 DFD — Context Diagram:</h4>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] sm:text-xs font-mono overflow-x-auto leading-tight shadow-inner">
{`┌──────────────┐     Attendee Details / Seat Requests     ┌──────────────┐
│              ├─────────────────────────────────────────>│              │
│    USER      │<─────────────────────────────────────────┤  EVENTTICKET │
│  (Attendee)  │       Confirmed QR Ticket / Live Sync    │    SYSTEM    │
└──────────────┘                                          │              │
                                                          │  (Process 0) │
┌──────────────┐     Admin Credentials / Event Updates    │              │
│    ADMIN     ├─────────────────────────────────────────>│              │
│  (Organizer) │<─────────────────────────────────────────┤              │
└──────────────┘     KPI Metrics / Attendee Roster        └──────┬───────┘
                                                                 │        
                                    Broadcasts Seat Changes      │        
                                    via WebSocket Events         ▼        
                                                        ┌────────────────┐
                                                        │   SOCKET.IO    │
                                                        │ CLIENT VIEWERS │
                                                        └────────────────┘`}
            </pre>

            <h4 className="font-bold text-sm pt-2">Level 1 DFD — Process Decomposition:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left w-36">Process ID</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Functionality</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P1: Input Validation</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Validates attendee email format, ticket count &gt; 0, and non-empty name.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P2: Capacity Verifier</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Checks availableSeats &gt;= requestedSeats before booking execution.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P3: Seat Deduction</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Atomically decrements availableSeats in database store.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P4: QR Synthesizer</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Generates unique TKT ID and encodes verification JSON into QR code.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P5: WS Broadcaster</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Emits `seat-updated` payload to event room and `new-booking` to admin.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P6: JWT Auth Handler</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Verifies salted bcrypt hashes and signs/validates 7-day JWT tokens.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">P7: Check-in Validator</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Matches scanned Booking ID and transitions ticket status to "Used".</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 10: ERD */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              10. Entity Relationship Diagram (ERD)
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              The relational data model below shows the core entities (EVENT, BOOKING, and USER_ADMIN) and their database schemas.
            </p>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[10px] sm:text-xs font-mono overflow-x-auto leading-tight shadow-inner">
{`┌─────────────────────────┐                ┌───────────────────────────────┐
│          EVENT          │                │            BOOKING            │
├─────────────────────────┤                ├───────────────────────────────┤
│ PK  _id                 │───1:N─────────>│ PK  _id                       │
│     title               │                │ FK  eventId                   │
│     description         │                │     bookingId (Unique Index)  │
│     date                │                │     eventTitle                │
│     time                │                │     userName                  │
│     venue               │                │     userEmail (Indexed)       │
│     totalSeats          │                │     seatsBooked               │
│     availableSeats      │                │     selectedSeats [Array]     │
│     image               │                │     qrCodeData (Encrypted)    │
│     category            │                │     status (Booked|Used|Canc) │
│     isActive            │                │     createdAt                 │
│     createdAt           │                └───────────────────────────────┘
│     updatedAt           │                                                 
└─────────────────────────┘                                                 
                                           ┌───────────────────────────────┐
                                           │           USER_ADMIN          │
                                           ├───────────────────────────────┤
                                           │ PK  _id                       │
                                           │     name                      │
                                           │     email (Unique)            │
                                           │     password (bcrypt hash)    │
                                           │     role ("admin")            │
                                           │     createdAt                 │
                                           └───────────────────────────────┘`}
            </pre>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left w-36">Entity</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">EVENT</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Stores title, venue, schedules, totalSeats, availableSeats, category, and isActive flag.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">BOOKING</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Represents tickets issued with unique TKT ID, attendee details, QR payload, and verification status.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold">USER_ADMIN</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2">Stores administrator credentials with salted bcrypt hashes for JWT authentication.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 11 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">
              11. What Contribution Would the Project Make?
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700 dark:text-slate-300 text-justify">
              <li>
                <strong>For Students and Learners:</strong> Demonstrates real-world full-stack web engineering with React 19, TypeScript, Express, WebSockets, JWT authorization, and vector QR generation in a single cohesive repository.
              </li>
              <li>
                <strong>For Campus Organizers & Non-Profits:</strong> Provides a deployable, zero-commission registration platform that works without credit cards, third-party payment gateways, or complicated setups.
              </li>
              <li>
                <strong>Technical Contribution:</strong> Illustrates practical solutions to concurrency management, server-authoritative state synchronization, responsive design with Tailwind CSS, and print layout optimization.
              </li>
              <li>
                <strong>Academic Contribution:</strong> Serves as a benchmark reference project satisfying academic requirements in Web Engineering, Concurrency & Networks, Database Design, and Information Security.
              </li>
            </ul>
          </div>

          {/* References */}
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              REFERENCES
            </h3>
            <ol className="list-none space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>[1] Socket.io Documentation, "Bidirectional and low-latency communication for every platform," Socket.io, 2024. [Online]. Available: https://socket.io/docs/v4/</li>
              <li>[2] RFC 7519, "JSON Web Token (JWT)," Internet Engineering Task Force (IETF), May 2015. [Online]. Available: https://tools.ietf.org/html/rfc7519</li>
              <li>[3] React Documentation, "React 19 Architecture and Server Components," ReactJS.org, 2024. [Online]. Available: https://react.dev</li>
              <li>[4] Express.js, "Fast, unopinionated, minimalist web framework for Node.js," Expressjs.com, 2024. [Online]. Available: https://expressjs.com</li>
              <li>[5] Tailwind Labs, "Tailwind CSS v4 Documentation," Tailwindcss.com, 2024. [Online]. Available: https://tailwindcss.com</li>
              <li>[6] ISO/IEC 18004, "Information technology — Automatic identification and data capture techniques — QR Code bar code symbology specification," ISO, 2015.</li>
              <li>[7] N. Provos and D. Mazieres, "A future-adaptable password scheme (bcrypt)," in USENIX Annual Technical Conference, 1999.</li>
              <li>[8] M. Fowler, "Patterns of Enterprise Application Architecture," Addison-Wesley Professional, 2002.</li>
              <li>[9] Mozilla Developer Network, "WebSockets API," MDN Web Docs, 2024. [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API</li>
            </ol>
          </div>
        </section>
      </article>
    </div>
  );
};
