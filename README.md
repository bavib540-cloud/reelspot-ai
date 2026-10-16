### Admin verification and signed-proof preview

I added an Admin Payments page and a server Edge Function to fetch signed URLs for uploaded payment proofs.

Files added
- src/pages/AdminPaymentsPage.tsx — Admin UI to list pending payments, preview uploaded proofs, and verify payments (select plan to grant).
- supabase/functions/getProofUrl/index.ts — Supabase Edge Function to return a signed URL for a given proof_path (uses service role key; deploy this function to your Supabase project).
- supabase/migrations/consume_credit.sql — A PL/pgSQL RPC function to atomically consume an AI generation credit for a user.

Environment variables
- VITE_VERIFY_PAYMENT_FN — full URL to your deployed verifyPayment Edge Function (e.g. https://<project>.supabase.co/functions/v1/verifyPayment)
- VITE_GET_PROOF_FN — full URL to the getProofUrl Edge Function (e.g. https://<project>.supabase.co/functions/v1/getProofUrl)

How AdminPaymentsPage works
1. It reads pending payments from the `payments` table (status = 'pending').
2. Admin clicks "Preview proof" — the page calls VITE_GET_PROOF_FN with { proof_path } which returns a signed URL to preview the image.
3. Admin chooses a plan (Creator Pro / Creator Plus) and clicks "Verify" — the page POSTs to VITE_VERIFY_PAYMENT_FN with { payment_id, admin_id, plan }.
4. The verifyPayment function updates the payments table, upserts subscriptions, and inserts a generation_credits entry.

Deploy the Edge Functions
- Deploy both verifyPayment and getProofUrl to Supabase Functions. They must run with SUPABASE_SERVICE_ROLE_KEY set in the function environment.

Security notes
- Only deploy these admin endpoints if you secure access via Supabase Auth or network rules. The Edge Functions use the service role key and must be protected (call only from trusted admin sessions or via server-side checks).
- In Production, ensure only admin users can call verifyPayment. The current verifyPayment function expects an admin_id and trusts it; you should add server-side admin validation (e.g., check that admin_id belongs to a user with an `is_admin` flag in your users table) before marking payments verified.
