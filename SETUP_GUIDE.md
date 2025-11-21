# NEXUS PRO Setup Guide

This project ships with a hybrid data layer: it boots with browser-local mock data for instant previews, and can switch to Supabase when environment variables are present.

## Prerequisites
- Node 18+
- Supabase account (project URL + anon/service role key)
- Optional: Google Gemini API key for AI reconciliation

## Local Development
```bash
npm install
npm run dev
```

## Enabling Supabase (Live Mode)
1. Create a new Supabase project.
2. Open **SQL Editor** and run the contents of `src/seed/schema.sql` to create tables and RLS policies.
3. Copy your project URL and anon key from **Project Settings → API**.
4. Create a `.env` file at the repo root:
   ```bash
   VITE_USE_SUPABASE=true
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_KEY=YOUR_ANON_KEY
   ```
5. Restart `npm run dev`. The data service will now use Supabase instead of the mock storage.

## Mock Data Mode (Default)
No configuration required. The browser seeds rich demo data into `localStorage` on first load: suppliers, invoices, bookings, DSRs, and bank transactions.

## Google Gemini (Flash 2.0) Integration
1. Request an API key from [Google AI Studio](https://aistudio.google.com/).
2. Add it to your `.env`:
   ```bash
   VITE_GEMINI_API_KEY=YOUR_KEY
   ```
3. The reconciliation screen will call Gemini; without a key, it safely falls back to mocked AI output.

## Useful Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build for production
- `npm run preview` – preview production build locally
