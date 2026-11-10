# FFTA Booking Demo

Independent concept demo for **Fit Future Training Academy (FFTA), Dubai** — a premium parent booking + admin operations platform.

> **Not an official FFTA product.** Inspired by [fitfutureacademy.com](https://www.fitfutureacademy.com/). Payments are simulated. Demo data persists in `localStorage`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Zustand + localStorage
- Recharts (admin analytics)

## Quick start

```bash
nvm use 20   # Node 20+
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo access

| Role   | Email             | Password  | One-click        |
|--------|-------------------|-----------|------------------|
| Parent | `parent@demo.ffta` | `demo1234` | Login → Enter as Parent |
| Admin  | `admin@demo.ffta`  | `demo1234` | Login → Enter as Admin  |

## What’s included

1. **Landing page** — hero, programmes, Dubai locations, benefits, testimonials, CTA  
2. **Parent portal** — register/login, child profiles, class browse (age/location/date)  
3. **Booking flow** — select class → child → Stripe-style demo checkout  
4. **6-week programmes** — enrol, progress, attendance linkage, renewals  
5. **Parent dashboard** — upcoming sessions, history, packages, payments, notifications  
6. **Admin dashboard** — classes, trainers, locations, students, attendance, bookings, revenue charts  

Use the lime banner **Reset data** control anytime to restore the seeded demo.
