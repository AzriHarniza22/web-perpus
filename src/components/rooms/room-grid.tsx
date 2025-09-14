'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClientSupabase } from '@/lib/supabase/client'
import { Room } from '@/types'
import { ROOM_TYPES } from '@/constants/rooms'
import { Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function RoomGrid() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabase()

  const cleanImageSrc = (src: string): string => {
    if (!src) return src;
    try {
      const url = new URL(src.startsWith('http') ? src : `https://${src}`);
      // For Unsplash, preserve query params as they are essential for image sizing
      if (url.hostname.includes('unsplash.com')) {
        const cleaned = url.toString();
        console.log('Preserved Unsplash src:', cleaned, 'from original:', src);
        return cleaned;
      }
      // For other sources, strip non-essential params if needed
      url.search = ''; // Remove query params for non-Unsplash
      const cleaned = url.toString();
      console.log('Cleaned non-Unsplash src:', cleaned, 'from original:', src);
      return cleaned;
    } catch (error) {
      console.warn('Failed to clean image src:', src, error);
      return src;
    }
  };

  console.log('Supabase client initialized:', !!supabase)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      console.log('Starting fetchRooms...')
      setLoading(true)
      setError(null)

      const { data, error, status, statusText } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      console.log('Supabase query response:', {
        data: data?.map(room => ({ ...room, images: room.images?.slice(0, 2) })), // Log limited images for brevity
        error: error ? { message: error.message, code: error.code, details: error.details } : null,
        status,
        statusText,
        dataLength: data?.length,
        isArray: Array.isArray(data)
      })

      if (error) {
        console.error('Supabase error details:', error)
        setError(`Database error: ${error.message || 'Unknown error'}`)
        return
      }

      if (!data || !Array.isArray(data)) {
        console.warn('Invalid data format:', data)
        setRooms([])
        return
      }

      console.log('Fetched rooms with images:', data.map(room => ({ id: room.id, name: room.name, images: room.images?.map(img => ({ original: img, cleaned: cleanImageSrc(img) })) })))
      setRooms(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Log state changes for debugging
  useEffect(() => {
    console.log('State update:', { loading, roomsCount: rooms.length, error })
  }, [loading, rooms.length, error])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="room-card">
            <div className="aspect-video bg-gray-200 rounded-t-lg animate-pulse" />
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gagal memuat data ruangan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchRooms} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum ada ruangan tersedia
          </h3>
          <p className="text-gray-600 mb-4">
            Silakan tambahkan ruangan baru atau periksa kembali nanti.
          </p>
          <Button onClick={fetchRooms} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const roomTypeInfo = ROOM_TYPES[room.room_type as keyof typeof ROOM_TYPES] || ROOM_TYPES.library_theater

        return (
          <Card key={room.id} className="room-card group overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              {room.images && room.images.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={cleanImageSrc(room.images[0])}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => console.log('Room grid image loaded:', room.name, 'clean src:', cleanImageSrc(room.images[0]))}
                    onError={(e) => {
                      console.error('Image load failed for room:', room.name, 'original URL:', room.images[0], 'failed src:', e.currentTarget.src)
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.className = 'w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center'
                        parent.innerHTML = `<span class="text-6xl">${roomTypeInfo.icon}</span>`
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">{roomTypeInfo.icon}</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {room.capacity} orang
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{room.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {room.description}
                  </CardDescription>
                </div>
                <span className="text-2xl">{roomTypeInfo.icon}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Kapasitas: {room.capacity} orang</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Jam Operasional: {room.operating_hours?.start} - {room.operating_hours?.end}
                </span>
              </div>

              {room.facilities && room.facilities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Fasilitas:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.facilities.slice(0, 3).map((facility, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {room.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.facilities.length - 3} lainnya
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href={`/rooms/${room.id}`}>
                    Lihat Detail
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}