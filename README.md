### Production deployment checklist

This project is built as a mobile-first React app with a Supabase backend, Edge Functions, and optional AI provider integration. The app is designed to keep secrets on the server side and avoid exposing API keys in the browser.

Required setup for a production deployment

1) Frontend environment variables
Add the following to your frontend environment / deployment secrets:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_REEL_IDEAS_API_URL (optional: set this to your deployed generateReelIdeas Edge Function URL)
- VITE_GET_PROOF_FN (optional: set to your deployed getProofUrl URL)
- VITE_VERIFY_PAYMENT_FN (optional: set to your deployed verifyPayment URL)

2) Server / Supabase function environment variables
Set these in your Supabase project function environment or your server deployment environment:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY (optional, only if you want the real AI provider path enabled)

3) Supabase database setup
Create the required tables using the repo migrations:
- supabase/migrations/create_tables.sql
- supabase/migrations/create_profiles.sql
- supabase/migrations/consume_credit.sql

4) Storage setup
Create a private storage bucket named payment-proofs in Supabase.
This bucket is used for uploaded proof images and is previewed via signed URLs only.

5) Edge Functions deployment
Deploy the following Edge Functions:
- supabase/functions/getProofUrl/index.ts
- supabase/functions/verifyPayment/index.ts
- supabase/functions/generateReelIdeas/index.ts

These functions must be deployed with the service-role key configured.

6) Admin setup
Create a user profile row for each authenticated user. Mark the admin user by setting the `profiles.is_admin` flag to true.
Example:

```sql
update profiles set is_admin = true where id = '<user-uuid>';
```

7) Credits setup
After a payment is verified, the system should grant credits by upserting the `subscriptions` row and inserting a `generation_credits` audit record.
The `consume_credit` RPC must be used before any AI generation is allowed, so the credit count is enforced atomically.

8) Route service / location behavior
The Discover page uses OSRM for route rendering between the user's current location and the selected shoot location when geolocation is available and the route request succeeds.
If geolocation or routing is unavailable, the app gracefully falls back to the map and the selected location cards without breaking the experience.

9) AI provider behavior
If `OPENAI_API_KEY` is configured and the server function is deployed, the app will use the real AI provider path.
If not configured, the app falls back to a deterministic local concept generator and clearly displays the status message so that no hidden product breakage occurs.

10) Production security recommendations
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Keep `payment-proofs` private.
- Require Admin authentication at the server before any verification action.
- Protect the Admin page behind authenticated admin-only access in the frontend as a final guard.
- Keep all provider credentials in server-side environment variables only.

Local development quick start
1. Copy `.env.example` to `.env` and fill in your own values.
2. Run: npm install
3. Run: npm run dev
4. Open the app on localhost and test the Discover, Reel Ideas, Shot Planner, Billing, and Admin flows.

The product is structured to be production-ready with server-side verification, safe credential handling, and graceful fallback behavior when external services are not configured.
