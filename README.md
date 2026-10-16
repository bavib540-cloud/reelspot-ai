### Route + AI backend upgrade

I implemented the first two production steps:

1) Real route rendering on the Discover map
- The Discover page now fetches a real route from the OpenStreetMap Routing service (OSRM) when the user allows location access and a location is selected.
- The map displays a live route polyline between the user location and the selected location.
- Route mode buttons were added for driving, walking, and cycling.
- The app still falls back gracefully when location access or routing is unavailable.

2) Real server-side AI generation with secure credit enforcement
- The server-side Reel generation function now supports OpenAI (`OPENAI_API_KEY`) when configured.
- If no external AI key is configured, it falls back to a deterministic local generator but clearly states the fallback.
- The function keeps AI keys on the server only and still enforces the `consume_credit` RPC before generation.

Files updated
- src/pages/DiscoverPage.tsx
- supabase/functions/generateReelIdeas/index.ts

Required env vars
- OPENAI_API_KEY (server-side only; not in frontend)
- SUPABASE_SERVICE_ROLE_KEY
- VITE_REEL_IDEAS_API_URL (if you deploy the function and want the frontend to call it)

What this does
- Live map route: `https://router.project-osrm.org/...` is used, which does not require an API key for basic route generation.
- Secure AI generation: the server calls OpenAI if configured, otherwise uses a local fallback.

This keeps the app functional without exposing secrets while also supporting real production-ready services when configured.
