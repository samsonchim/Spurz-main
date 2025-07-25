import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdkzzcdqhxckvnmxkpcm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p6Y2RxaHhja3ZubXhrcGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTA5MjYsImV4cCI6MjA2NTA2NjkyNn0.-2vOAUsfag_BPH6aK3XdKO3tQU1QrpEVPqxSn37qwYc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
