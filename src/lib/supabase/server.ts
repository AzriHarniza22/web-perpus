import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// For server-side usage with auth
export const createServerSupabase = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ 
    cookies: () => cookieStore
  })
}

// For server-side usage without auth (admin operations)
// HANYA gunakan ini untuk operasi admin yang benar-benar diperlukan
export const createAdminSupabase = () => {
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}