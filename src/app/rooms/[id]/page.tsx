'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase/client'
import { Room } from '@/types'
import { ROOM_TYPES } from '@/constants/rooms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Users, Clock, MapPin, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function RoomDetailPage() {
  const params = useParams()
  const roomId = params.id as string
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    if (roomId) {
      fetchRoom()
    }
  }, [roomId])

  const fetchRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error) {
        console.error('Error fetching room:', error)
        return
      }

      setRoom(data)
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Ruangan Tidak Ditemukan</CardTitle>
            <CardDescription>
              Ruangan yang Anda cari tidak ditemukan atau tidak tersedia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/rooms">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Ruangan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const roomTypeInfo = ROOM_TYPES[room.room_type] || ROOM_TYPES.library_theater

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Ruangan
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-8xl">{roomTypeInfo.icon}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Room Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">{room.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {room.description}
                    </CardDescription>
                  </div>
                  <span className="text-4xl">{roomTypeInfo.icon}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Kapasitas</p>
                      <p className="text-sm text-gray-600">{room.capacity} orang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Jam Operasional</p>
                      <p className="text-sm text-gray-600">
                        {room.operating_hours?.start} - {room.operating_hours?.end}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Lokasi</p>
                      <p className="text-sm text-gray-600">Perpustakaan Aceh</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Facilities */}
                {room.facilities && room.facilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Fasilitas Tersedia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {room.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Room Type Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Ruangan</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {roomTypeInfo.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Reservasi Ruangan</CardTitle>
                <CardDescription>
                  Pilih tanggal dan waktu untuk reservasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Harga per jam</span>
                    <Badge variant="secondary">Gratis</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kapasitas maksimal</span>
                    <span className="text-sm text-gray-600">{room.capacity} orang</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={room.is_active ? "default" : "destructive"}>
                      {room.is_active ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <Button asChild className="w-full" disabled={!room.is_active}>
                  <Link href={`/booking?room=${room.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {room.is_active ? "Buat Reservasi" : "Ruangan Tidak Tersedia"}
                  </Link>
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  * Reservasi harus dilakukan minimal 1 hari sebelumnya
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Kontak Perpustakaan Aceh</p>
                  <p>📞 (0651) 123456</p>
                  <p>📧 info@perpustakaan-aceh.go.id</p>
                  <p>📍 Jl. Teuku Umar No. 1, Banda Aceh</p>
                </div>
                <Button variant="outline" className="w-full">
                  Hubungi Kami
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
