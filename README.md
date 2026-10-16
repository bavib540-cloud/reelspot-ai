# ReelSpot AI

Mobile-first web app to discover filming locations, generate short-form Reel ideas, plan scene-by-scene shoots, and get routes — scaffolded with React + TypeScript and Supabase for persistence and payment automation.

This repository contains an initial scaffold with a mobile-friendly UI, a payment/billing flow that supports a manual UPI-QR proof workflow, Supabase SQL migrations for payments and subscriptions, and an Edge Function stub for verifying payments server-side.

Important
- The repository includes a placeholder QR at public/assets/payment-qr.svg. Replace it with the real QR image you provided by uploading it to public/assets/payment-qr.png (or .svg) so the app shows the real QR.
- Do NOT commit secret keys to the repo. Use the .env.example and set environment variables in your deployment environment or local .env (not committed).

Quick start (development)
1. Clone the repo
   git clone https://github.com/bavib540-cloud/reelspot-ai.git
   cd reelspot-ai

2. Install
   npm install

3. Create a .env file from .env.example and fill values. For local dev you can run Supabase locally or use a Supabase project.

4. Start the dev server
   npm run dev

5. Open http://localhost:5173 on an Android emulator or phone for a mobile-first view.

Where to add the real QR image
- Place the QR image you shared into public/assets/payment-qr.png. The Payment page will display that image. The repo currently includes a placeholder SVG at public/assets/payment-qr.svg.

Supabase setup (high level)
- Create a Supabase project.
- Create a storage bucket named `payment-proofs` (private).
- Run the SQL migration in supabase/migrations/create_tables.sql in the Supabase SQL editor.
- Add the Supabase URL and keys to your .env.
- Deploy the Edge Function in supabase/functions/verifyPayment or adapt the code to your server environment.

What I added in this commit
- Frontend scaffold (Vite + React + TypeScript)
- Mobile-first navigation and pages (Discover, Reel Ideas, Best Time, Shot Planner, Saved, Billing)
- Payment UI with UPI QR display and upload-proof flow (payments table and storage upload)
- Supabase SQL migration for payments, subscriptions, and generation_credits
- Edge Function stub for admin verification of payments

Next steps I can take
- Replace placeholder QR with the exact QR image you uploaded (if you want me to commit it directly).
- Implement the mapping, routing, and AI endpoints (I already scaffolded pages).
- Add admin UI for verifying payment proofs and granting subscriptions.

If you want me to commit the supplied QR image into the repo directly, confirm and I will add it now.
