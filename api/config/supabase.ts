// Supabase configuration for the API
// In production, these should be environment variables

export const SUPABASE_CONFIG = {
  url: 'https://bdkzzcdqhxckvnmxkpcm.supabase.co',
  // You need to replace this with your actual service role key from Supabase Dashboard
  // Go to: Supabase Dashboard > Settings > API > service_role key
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'
}

// Instructions:
// 1. Create a .env.local file in the api directory
// 2. Add: SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
// 3. Or set the environment variable when running the API
