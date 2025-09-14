// Debug script untuk mengecek environment variables
console.log('=== DEBUG ENVIRONMENT VARIABLES ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('Supabase URL length:', process.env.NEXT_PUBLIC_SUPABASE_URL.length)
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Supabase Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length)
}

console.log('===============================')
