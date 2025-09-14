'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=callback_error')
          return
        }

        if (data.session?.user) {
          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (profileError || !profile) {
            // Create user profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email!,
                full_name: data.session.user.user_metadata?.full_name || '',
                phone: data.session.user.user_metadata?.phone || '',
                institution: data.session.user.user_metadata?.institution || '',
                role: 'user'
              })

            if (insertError) {
              console.error('Error creating user profile:', insertError)
            }
          }

          router.push('/')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Memproses Login...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    </div>
  )
}
