# Login Screen Setup Instructions

The login screen has been successfully connected to the custom API! Here's what was implemented and how to set it up:

## What Was Done

1. ✅ **Updated API Configuration**: Changed API base URL to use port 3001 (where the API runs)
2. ✅ **Enhanced Login API**: Created a proper login endpoint that validates credentials against the database
3. ✅ **Updated Login Screen**: Modified the LoginScreen to use the custom API instead of Supabase
4. ✅ **Added Error Handling**: Proper error messages and user feedback

## Setup Instructions

### 1. Configure Supabase Service Role Key

The API needs a Supabase service role key to access the database. You have two options:

**Option A: Environment Variable (Recommended)**
```bash
# In the api directory, create a .env.local file:
echo "SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key" > api/.env.local
```

**Option B: Update Configuration File**
Edit `api/config/supabase.ts` and replace `'your_service_role_key_here'` with your actual service role key.

### 2. Get Your Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to Settings > API
3. Copy the `service_role` key (not the `anon` key)
4. Use it in the configuration above

### 3. Start the API Server

```bash
cd api
npm install
npm run dev
```

The API will run on `http://localhost:3001`

### 4. Test the Login

You can test the login functionality in several ways:

**Option A: Use the Test Script**
```bash
cd api
node test-login.js
```

**Option B: Test in the App**
1. Start your React Native app
2. Navigate to the login screen
3. Try logging in with valid credentials

**Option C: Test with curl**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/register` - Alternative registration endpoint

## Database Setup

Make sure you've run the database setup script:
```sql
-- Run this in your Supabase SQL editor
-- (The content from api/database.sql)
```

## Troubleshooting

1. **"Server not configured for DB access"**: Make sure you've set the SUPABASE_SERVICE_ROLE_KEY
2. **"Network error"**: Check that the API server is running on port 3001
3. **"Invalid email or password"**: Make sure you have test users in your database

## Next Steps

- Add user session management (AsyncStorage or Redux)
- Implement JWT tokens for better security
- Add password reset functionality
- Add user profile management
