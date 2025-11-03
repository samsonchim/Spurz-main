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

Environment setup (required for DB-backed endpoints):

1) Copy `.env.example` to `.env.local` in this `api` folder.

```powershell
Copy-Item .env.example .env.local
```

2) Fill in your Supabase details:

- SUPABASE_URL: https://<your-project-ref>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY: service role key from Supabase Dashboard > Settings > API

These are used by `api/services/supabase.ts`. Without them, endpoints like `/api/outlets/my-outlet` will return 500 due to missing DB configuration.

Static assets:

- Files in `api/public` are served from the root of the API host (not under `/public`).
- Example: `api/public/hallowenn.png` is available at `${API_BASE}/hallowenn.png`.

Notes:
- To connect from the mobile app (Expo/React Native), call the API URL `http://<your-dev-host>:3001/api/...` (or use a tunnel like Ngrok).
- You can change the dev port in `package.json` scripts.

