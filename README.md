### Dynamic UPI QR generation

This project now supports dynamic UPI QR generation in the Billing page. Instead of committing a static QR image to the repository, the app builds a UPI intent URI (upi://pay?pa=...) from the provided UPI ID, payee name, amount, and note and renders a QR client-side using the `qrcode` npm package.

How it works
- The Billing page constructs a UPI URI and generates a PNG data URL for the QR entirely in the browser using the `qrcode` library.
- Users can scan the generated QR with any UPI app or click "Open in UPI app" (which uses the custom URI scheme). Note: some browsers restrict launching custom schemes.
- The app still supports uploading payment proof (screenshot) and submitting a pending payment record to Supabase for manual verification.

Security & privacy
- No private payment images are committed to the repo.
- If you later integrate an automated gateway (Razorpay/Cashfree/Paytm), use server-side webhooks for verification and keep secret keys in environment variables.

To use
1. Ensure dependencies are installed (npm install) including `qrcode`.
2. Start the app and visit /billing.
3. Enter amount and note if needed, scan or open the UPI URI, then optionally upload proof.

If you want, I can also implement a server-side QR generation endpoint (for downloadable PNGs from the server) or integrate a specific payment gateway for automatic verification. Let me know which you prefer.
