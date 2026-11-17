# ZEVLUMI — Starter Web App

**Tagline:** Your Chat. Your World.

This is the first frontend/PWA foundation for a private chat and social platform. It is intentionally a demo: messages are rendered in the browser and are not sent to other people.

## Run locally
1. Download and unzip this folder.
2. Open a terminal in this folder.
3. Run a local static server, for example:
   - `python -m http.server 8000`
4. Visit `http://localhost:8000`.

Opening `index.html` directly also shows the interface, but PWA/service-worker features require localhost or HTTPS.

## Publish a preview
- Push the project to a GitHub repository.
- Use Cloudflare Pages to deploy the repository as a static site (no build command; output directory `/`).
- GitHub is the code repository. Do not use GitHub Pages as the commercial SaaS host; review GitHub Pages terms before any public launch.

## Android path
This is a Progressive Web App starter. Once the web app is connected to a real backend and tested, it can be packaged for Android using Capacitor. This starter is not yet an Android APK.

## Backend setup (next milestone)
1. Create a Supabase project.
2. Open SQL Editor and review/run `supabase/schema.sql`.
3. Configure Supabase Auth, database policies, and private storage buckets.
4. Add the Supabase client and replace the demo data in `app.js`.
5. Test authorization with at least two separate user accounts.

## Current demo features
- Responsive chat-style dashboard
- Demo conversations and local message bubbles
- Search filter
- Status/story visual placeholders
- Navigation placeholders for groups, vault, settings
- PWA manifest and service worker
- Initial Supabase schema for profiles, conversations, members, messages, stories

## Not implemented yet
- Real account registration/login
- Server-backed messaging/realtime
- End-to-end encryption
- Voice/video calling and TURN infrastructure
- File uploads and private vault
- Push notifications, scheduling, auto-reply
- Subscriptions, ads, business API
- Native Android app/APK

## Security note
Do not store passwords, private messages, or secret vault content in localStorage. Do not expose Supabase service-role keys in frontend code. Production chat requires a reviewed authorization model, rate limits, abuse controls, backups, and an independently reviewed end-to-end encryption design.
