'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClientSupabase } from '@/lib/supabase/client'
import { Booking } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  FileText, 
  Eye, 
  X,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/constants/rooms'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const supabase = createClientSupabase()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*),
          user:users(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookings:', error)
        return
      }

      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) {
        console.error('Error cancelling booking:', error)
        toast.error('Gagal membatalkan reservasi')
        return
      }

      toast.success('Reservasi berhasil dibatalkan')
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Gagal membatalkan reservasi')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'pending':
        return booking.status === 'pending'
      case 'approved':
        return booking.status === 'approved'
      case 'completed':
        return booking.status === 'completed'
      case 'cancelled':
        return booking.status === 'cancelled' || booking.status === 'rejected'
      default:
        return true
    }
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">Login Diperlukan</CardTitle>
            <CardDescription>
              Anda harus login terlebih dahulu untuk melihat riwayat reservasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth/login">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Riwayat Reservasi
          </h1>
          <p className="text-xl text-gray-600">
            Kelola dan pantau semua reservasi ruangan Anda
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="pending">Menunggu</TabsTrigger>
            <TabsTrigger value="approved">Disetujui</TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
            <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === 'all' ? 'Belum Ada Reservasi' : `Tidak Ada Reservasi ${BOOKING_STATUS_LABELS[activeTab as keyof typeof BOOKING_STATUS_LABELS]}`}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? 'Anda belum membuat reservasi apapun. Mulai buat reservasi pertama Anda!'
                      : `Tidak ada reservasi dengan status ${BOOKING_STATUS_LABELS[activeTab as keyof typeof BOOKING_STATUS_LABELS].toLowerCase()}`
                    }
                  </p>
                  <Button asChild>
                    <a href="/booking">Buat Reservasi Baru</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{booking.event_name}</CardTitle>
                          <CardDescription className="text-base">
                            {booking.room?.name}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <Badge 
                            variant="outline" 
                            className={BOOKING_STATUS_COLORS[booking.status as keyof typeof BOOKING_STATUS_COLORS]}
                          >
                            {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Tanggal</p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString('id-ID')}
                              {booking.start_date !== booking.end_date && 
                                ` - ${new Date(booking.end_date).toLocaleDateString('id-ID')}`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Waktu</p>
                            <p className="text-sm text-gray-600">
                              {booking.start_time} - {booking.end_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Peserta</p>
                            <p className="text-sm text-gray-600">{booking.attendees_count} orang</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Lokasi</p>
                            <p className="text-sm text-gray-600">Perpustakaan Aceh</p>
                          </div>
                        </div>
                      </div>

                      {booking.event_description && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">Deskripsi Acara</p>
                          <p className="text-sm text-gray-600">{booking.event_description}</p>
                        </div>
                      )}

                      {booking.proposal_document && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Dokumen terlampir</span>
                          </div>
                        </div>
                      )}

                      {booking.admin_notes && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Catatan Admin:</strong> {booking.admin_notes}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Dibuat: {new Date(booking.created_at).toLocaleString('id-ID')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          {booking.status === 'pending' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Batalkan
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
