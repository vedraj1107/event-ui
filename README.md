# EventHub UI

React (Next.js) frontend for the Event Management & Registration system.

**Live:** https://event-ui-kappa.vercel.app
**API:** https://event-api-jptd.onrender.com
**API repo:** https://github.com/vedraj1107/event-api

## Features
- Register / login (JWT)
- Browse, search and filter events
- Event details, register / unregister
- My registrations
- Admin dashboard: create, edit, delete events, stats

## Tech Stack
Next.js, React, TypeScript, Tailwind CSS

## Setup
```bash
git clone https://github.com/vedraj1107/event-ui.git
cd event-ui
npm install
```
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
```bash
npm run dev
```
