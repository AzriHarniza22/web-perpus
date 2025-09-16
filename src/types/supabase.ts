export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'admin' | 'staff'
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
export type RoomType = 
  | 'library_theater'
  | 'aula_full'
  | 'aula_half'
  | 'social_inclusion'
  | 'meeting_room'
  | 'library_tour'
  | 'outdoor_stage'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          institution: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          institution?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          institution?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'bookings'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'notifications'
            referencedColumns: ['user_id']
          }
        ]
      }
      rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          room_type: RoomType
          capacity: number
          facilities: string[] | null
          images: string[]
          layout_image: string | null
          is_active: boolean
          operating_hours: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          room_type: RoomType
          capacity: number
          facilities?: string[] | null
          images?: string[]
          layout_image?: string | null
          is_active?: boolean
          operating_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          room_type?: RoomType
          capacity?: number
          facilities?: string[] | null
          images?: string[]
          layout_image?: string | null
          is_active?: boolean
          operating_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rooms_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'bookings'
            referencedColumns: ['room_id']
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          room_id: string
          start_date: string
          end_date: string
          start_time: string
          end_time: string
          event_name: string
          event_description: string | null
          attendees_count: number
          status: BookingStatus
          proposal_document: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          room_id: string
          start_date: string
          end_date: string
          start_time: string
          end_time: string
          event_name: string
          event_description?: string | null
          attendees_count: number
          status?: BookingStatus
          proposal_document?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          room_id?: string
          start_date?: string
          end_date?: string
          start_time?: string
          end_time?: string
          event_name?: string
          event_description?: string | null
          attendees_count?: number
          status?: BookingStatus
          proposal_document?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_room_id_fkey'
            columns: ['room_id']
            isOneToOne: false
            referencedRelation: 'rooms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = {
  [K in T]: {
    Row: Database['public']['Tables'][K]['Row']
    Insert: Database['public']['Tables'][K]['Insert']
    Update: Database['public']['Tables'][K]['Update']
    Relationships: Database['public']['Tables'][K]['Relationships']
  }
}

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type CompositeTypes<
  T extends keyof Database['public']['CompositeTypes']
> = Database['public']['CompositeTypes'][T]