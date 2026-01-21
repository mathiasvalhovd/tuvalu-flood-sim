import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: log if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars:', {
    url: supabaseUrl ? 'set' : 'MISSING',
    key: supabaseAnonKey ? 'set' : 'MISSING'
  })
}

// Create client only if we have the required values, otherwise create a dummy that won't crash
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
