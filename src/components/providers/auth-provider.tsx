'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientSupabase, supabaseUrl, supabaseAnonKey } from '@/lib/supabase/client'
import { User as AppUser } from '@/types'

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Log loading changes
  useEffect(() => {
    console.log('💡 Loading state changed to:', loading);
  }, [loading]);
  const supabase = createClientSupabase()

  const refreshUser = async () => {
    console.log('🔄 Starting refreshUser...');
    try {
      // Test basic connectivity to Supabase
      console.log('🌐 Testing connectivity to Supabase...');
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey
        }
      });
      if (response.ok || response.status === 401) {  // 401 is expected for anon without session
        console.log('✅ Supabase project reachable (status:', response.status, ')');
      } else {
        console.log('❌ Supabase connection failed:', response.status, response.statusText);
        throw new Error(`Supabase unreachable: ${response.status}`);
      }

      console.log('👤 Calling supabase.auth.getUser()...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('✅ getUser() completed');
      console.log('👤 getUser result:', user ? { id: user.id, email: user.email, user_metadata: user.user_metadata } : 'null');
      setUser(user)

      if (user) {
        // Fetch user profile from our users table
        console.log('📋 Fetching profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('❌ Error fetching user profile:', error);
        } else {
          console.log('✅ Profile fetched:', profile);
          setAppUser(profile)
        }
      } else {
        console.log('🚫 No user, setting appUser null');
        setAppUser(null)
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    } finally {
      console.log('⏳ Setting loading to false');
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setAppUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    console.log('🛠️ AuthProvider useEffect mounted');
    refreshUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user ? { id: session.user.id, email: session.user.email } : 'no session');
        if (session?.user) {
          setUser(session.user)
          await refreshUser()
        } else {
          setUser(null)
          setAppUser(null)
        }
        console.log('⏳ Setting loading false from listener');
        setLoading(false)
      }
    )

    return () => {
      console.log('🧹 Unsubscribing auth listener');
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      appUser,
      loading,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
