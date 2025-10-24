# Spurz API (Next.js)

This folder contains a minimal Next.js API scaffold intended to be used alongside the Spurz app.

Quick start (PowerShell):

```powershell
cd "c:\Users\Samson Chi\Documents\Spurz-main\api"
npm install
npm run dev
```

The dev server runs on port 3001 (see `package.json` scripts). Example endpoints:

- GET http://localhost:3001/api/hello
  - Response: { message: 'Hello from Spurz API' }

- POST http://localhost:3001/api/auth/register
  - Body (JSON): { "email": "you@example.com", "password": "secret" }
  - Response: 201 created user object (placeholder behavior)

- POST http://localhost:3001/api/auth/login
  - Body (JSON): { "email": "you@example.com", "password": "secret" }
  - Response: 200 { token, user }

Notes and next steps:
- The auth endpoints are illustrative only (no DB or real security). Replace with real persistence (MySQL/Postgres/Supabase) and proper password hashing (bcrypt) and token generation (JWT).
- Add `@types/cors` and any DB client types if you plan to use TypeScript type-checking.
- If you want the API to run on a different port, change the `dev`/`start` scripts in `package.json`.
- To connect from the mobile app (Expo/React Native), call the API URL `http://<your-dev-host>:3001/api/...` (or tunnel/Ngrok, or use device+PC network).

If you'd like, I can:
- Add Supabase integration matching the app's current usage.
- Add a basic DB schema, migrations, and an example using SQLite/Postgres.
- Add unit tests for the API endpoints.

