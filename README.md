### AI generation backend and secure credit enforcement

I implemented a secure, server-side generation flow for Reel ideas with credit enforcement.

Files added
- src/lib/reelIdeas.ts — client-side helper that calls the server endpoint when configured and falls back to a local generator when no AI API is configured.
- supabase/functions/generateReelIdeas/index.ts — Edge Function that:
  - requires Authentication via Bearer token,
  - checks the current user's `subscriptions.remaining_credits` via the `consume_credit` RPC,
  - only proceeds if the user still has credit,
  - returns a generated idea set from a server-side fallback generator,
  - keeps any real AI API keys off the front end.

How it works
- Frontend `src/pages/ReelIdeasPage.tsx` now calls `generateReelIdeas(form, accessToken)`.
- If `VITE_REEL_IDEAS_API_URL` is set, it calls the configured server endpoint with the current user access token.
- If no endpoint is configured, it falls back to a local deterministic generator and shows an explicit message that the AI service is not configured.
- The server function enforces credit deduction using the `consume_credit` SQL RPC before generating results.

Required env vars
- VITE_REEL_IDEAS_API_URL — full URL to the deployed `generateReelIdeas` Edge Function (optional).
- SUPABASE_SERVICE_ROLE_KEY — must be set in the function environment for the server to enforce credits securely.

Important: any real AI provider (OpenAI/Gemini/etc.) should be configured inside the server function only.
Do not place API keys in the frontend code.

This implementation is secure-by-default for credits, and the UI remains usable in the absence of an AI provider by using the local fallback generator.
