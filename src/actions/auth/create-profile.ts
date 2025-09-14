'use server'

import { createAdminSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProfile(
  userId: string,
  email: string,
  full_name: string,
  phone: string,
  institution: string
) {
  const supabase = createAdminSupabase()

  const { error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      full_name,
      phone,
      institution,
      role: 'user'
    })

  if (error) {
    console.error('Server-side profile creation error:', error)
    return { error: error.message }
  }

  revalidatePath('/auth/register')
  return { success: true }
}