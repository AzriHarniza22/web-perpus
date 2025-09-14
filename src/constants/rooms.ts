import { RoomTypeInfo } from '@/types'

export const ROOM_TYPES: Record<string, RoomTypeInfo> = {
  library_theater: {
    id: 'library_theater',
    name: 'Library Theater',
    icon: '🎭',
    description: 'Ruang teater perpustakaan untuk pertunjukan, seminar, dan acara budaya',
    default_capacity: 200,
    default_facilities: [
      'Panggung lengkap',
      'Sound system',
      'Lighting system',
      'Proyektor',
      'AC',
      'Kursi theater',
      'Green room'
    ]
  },
  aula_full: {
    id: 'aula_full',
    name: 'Aula Gedung (Full)',
    icon: '🏛️',
    description: 'Aula utama gedung perpustakaan dengan kapasitas penuh',
    default_capacity: 500,
    default_facilities: [
      'Panggung besar',
      'Sound system profesional',
      'Lighting lengkap',
      'Proyektor HD',
      'AC sentral',
      'Kursi auditorium',
      'VIP area',
      'Catering area'
    ]
  },
  aula_half: {
    id: 'aula_half',
    name: 'Aula Gedung (Setengah)',
    icon: '🏛️',
    description: 'Aula gedung perpustakaan dengan kapasitas setengah',
    default_capacity: 250,
    default_facilities: [
      'Panggung sedang',
      'Sound system',
      'Lighting',
      'Proyektor',
      'AC',
      'Kursi auditorium',
      'Catering area'
    ]
  },
  social_inclusion: {
    id: 'social_inclusion',
    name: 'Ruang Inklusi Sosial',
    icon: '🧑‍🤝‍🧑',
    description: 'Ruang khusus untuk kegiatan inklusi sosial dan komunitas',
    default_capacity: 50,
    default_facilities: [
      'Meja dan kursi fleksibel',
      'Whiteboard',
      'Proyektor',
      'AC',
      'Aksesibilitas difabel',
      'Ruang diskusi',
      'Koneksi internet'
    ]
  },
  meeting_room: {
    id: 'meeting_room',
    name: 'Ruang Rapat',
    icon: '🪑',
    description: 'Ruang rapat untuk pertemuan formal dan diskusi',
    default_capacity: 20,
    default_facilities: [
      'Meja rapat besar',
      'Kursi ergonomis',
      'Whiteboard',
      'Proyektor',
      'AC',
      'Teleconference',
      'Koneksi internet',
      'Sound system'
    ]
  },
  library_tour: {
    id: 'library_tour',
    name: 'Library Tour',
    icon: '📚',
    description: 'Area untuk kunjungan dan tur perpustakaan',
    default_capacity: 30,
    default_facilities: [
      'Area kunjungan',
      'Display area',
      'Audio guide',
      'AC',
      'Kursi portable',
      'Panduan visual',
      'Koneksi internet'
    ]
  },
  outdoor_stage: {
    id: 'outdoor_stage',
    name: 'Library Stage Outdoor',
    icon: '🎤',
    description: 'Panggung outdoor untuk acara terbuka dan pertunjukan',
    default_capacity: 300,
    default_facilities: [
      'Panggung outdoor',
      'Sound system outdoor',
      'Lighting outdoor',
      'Area duduk',
      'Tenda (opsional)',
      'Generator listrik',
      'Area parkir'
    ]
  }
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Menunggu Persetujuan',
  [BOOKING_STATUS.APPROVED]: 'Disetujui',
  [BOOKING_STATUS.REJECTED]: 'Ditolak',
  [BOOKING_STATUS.COMPLETED]: 'Selesai',
  [BOOKING_STATUS.CANCELLED]: 'Dibatalkan'
} as const

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BOOKING_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [BOOKING_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [BOOKING_STATUS.COMPLETED]: 'bg-blue-100 text-blue-800',
  [BOOKING_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800'
} as const

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00'
]

export const OPERATING_HOURS = {
  start: '08:00',
  end: '21:00'
}
