import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('🔍 Supabase: Environment variables check:', {
  REACT_APP_SUPABASE_URL: !!supabaseUrl,
  REACT_APP_SUPABASE_ANON_KEY: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data.');
}

export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient(supabaseUrl, supabaseAnonKey) : null

// Mock data for development when Supabase is not configured
export const useMockData = !supabase

console.log('🔍 Supabase: Client initialized:', !!supabase);
console.log('🔍 Supabase: Using mock data:', useMockData);
