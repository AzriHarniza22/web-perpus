import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

let client: ReturnType<typeof createClient> | null = null

// For client-side usage
export const createClientSupabase = () => {
  console.log('Creating Supabase client...')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key: Present') // Avoid logging full key for security

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created:', client)
  }

  return client
}
