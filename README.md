### Admin setup and hardening

I added server-side admin authentication checks for the payment admin functions. To use the admin endpoints safely, follow these steps.

1) Create a profiles table (migration included):

Run the SQL file `supabase/migrations/create_profiles.sql` in your Supabase project's SQL editor. It creates a `profiles` table with an `is_admin` boolean flag.

2) Mark an admin user

Use the Supabase SQL editor or dashboard to set a user as admin. Example:

```
update profiles set is_admin = true where id = '<user-uuid>';
```

3) How the admin endpoints work now

- Both the `verifyPayment` and `getProofUrl` Edge Functions require an Authorization header with a valid Supabase user access token: `Authorization: Bearer <access_token>`.
- The functions validate the token, look up the caller's `profiles.is_admin` flag, and only proceed if the caller is an admin.
- The frontend Admin page (`src/pages/AdminPaymentsPage.tsx`) now automatically includes the current user's access token when calling these functions. You must be signed in and have `is_admin = true` in `profiles` to use the page.

4) Security reminders

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret and only used in Edge Functions or server-side code.
- Do not rely on client-side admin indications — the server enforces admin privileges.
