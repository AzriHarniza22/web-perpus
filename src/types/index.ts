export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  institution: string
  role: 'user' | 'admin' | 'staff'
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  description: string
  room_type: string
  capacity: number
  facilities: string[]
  images: string[]
  layout_image?: string
  is_active: boolean
  operating_hours: {
    start: string
    end: string
  }
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  room_id: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  event_name: string
  event_description?: string
  attendees_count: number
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  proposal_document?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: User
  room?: Room
}

export interface RoomAvailability {
  room_id: string
  date: string
  time_slots: {
    start: string
    end: string
    is_available: boolean
    booking_id?: string
  }[]
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'booking_approved' | 'booking_rejected' | 'booking_reminder' | 'booking_cancelled'
  is_read: boolean
  created_at: string
}

export interface BookingStats {
  total_bookings: number
  pending_bookings: number
  approved_bookings: number
  rejected_bookings: number
  monthly_bookings: {
    month: string
    count: number
  }[]
  popular_rooms: {
    room_id: string
    room_name: string
    booking_count: number
  }[]
}

export type RoomType = 
  | 'library_theater'
  | 'aula_full'
  | 'aula_half'
  | 'social_inclusion'
  | 'meeting_room'
  | 'library_tour'
  | 'outdoor_stage'

export interface RoomTypeInfo {
  id: RoomType
  name: string
  icon: string
  description: string
  default_capacity: number
  default_facilities: string[]
}
