'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Redirect to login if not authenticated and not on auth page
  useEffect(() => {
    if (loading) return

    if (!pathname.startsWith('/auth') && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router, pathname])

  // Always render children, redirect will happen when ready
  return <>{children}</>
}