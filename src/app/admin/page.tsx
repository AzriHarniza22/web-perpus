'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { createClientSupabase } from '@/lib/supabase/client'
import { Booking, Room, User } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Users, 
  Building, 
  CheckCircle, 
  AlertCircle, 
  XCircle
} from 'lucide-react'
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@/constants/rooms'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const { user, appUser, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalRooms: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const supabase = createClientSupabase()

  useEffect(() => {
    if (user && appUser && (appUser.role === 'admin' || appUser.role === 'staff')) {
      fetchData()
    }
  }, [user, appUser])

  const fetchData = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*),
          user:users(*)
        `)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
      } else {
        setBookings(bookingsData || [])
      }

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: true })

      if (roomsError) {
        console.error('Error fetching rooms:', roomsError)
      } else {
        setRooms(roomsData || [])
      }

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error('Error fetching users:', usersError)
      } else {
        setUsers(usersData || [])
      }

      // Calculate stats
      const totalBookings = bookingsData?.length || 0
      const pendingBookings = bookingsData?.filter(b => b.status === 'pending').length || 0
      const approvedBookings = bookingsData?.filter(b => b.status === 'approved').length || 0
      const totalRooms = roomsData?.length || 0
      const totalUsers = usersData?.length || 0

      setStats({
        totalBookings,
        pendingBookings,
        approvedBookings,
        totalRooms,
        totalUsers
      })

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingStatusUpdate = async (bookingId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) {
        console.error('Error updating booking:', error)
        toast.error('Gagal memperbarui status reservasi')
        return
      }

      toast.success(`Reservasi berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`)
      fetchData()
    } catch (error) {
      console.error('Error updating booking:', error)
      toast.error('Gagal memperbarui status reservasi')
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
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !appUser || (appUser.role !== 'admin' && appUser.role !== 'staff')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>
              Anda tidak memiliki izin untuk mengakses halaman admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Kembali ke Beranda</Link>
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
            Dashboard Admin
          </h1>
          <p className="text-xl text-gray-600">
            Kelola sistem reservasi ruangan perpustakaan
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Reservasi</TabsTrigger>
            <TabsTrigger value="rooms">Ruangan</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reservasi</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Semua waktu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Perlu ditinjau
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approvedBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Aktif
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ruangan</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRooms}</div>
                  <p className="text-xs text-muted-foreground">
                    Tersedia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Terdaftar
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Reservasi Terbaru</CardTitle>
                <CardDescription>
                  Daftar reservasi yang baru saja dibuat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acara</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.event_name}</TableCell>
                        <TableCell>{booking.room?.name}</TableCell>
                        <TableCell>
                          {new Date(booking.start_date).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={BOOKING_STATUS_COLORS[booking.status as keyof typeof BOOKING_STATUS_COLORS]}
                          >
                            {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'approved')}
                                >
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'rejected')}
                                >
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Semua Reservasi</CardTitle>
                <CardDescription>
                  Kelola semua reservasi ruangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acara</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Pengguna</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.event_name}</TableCell>
                        <TableCell>{booking.room?.name}</TableCell>
                        <TableCell>{booking.user?.full_name}</TableCell>
                        <TableCell>
                          {new Date(booking.start_date).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          {booking.start_time} - {booking.end_time}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={BOOKING_STATUS_COLORS[booking.status as keyof typeof BOOKING_STATUS_COLORS]}
                          >
                            {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'approved')}
                                >
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'rejected')}
                                >
                                  Tolak
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              Detail
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Ruangan</CardTitle>
                <CardDescription>
                  Kelola informasi dan status ruangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <CardDescription>{room.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Kapasitas</span>
                            <span className="text-sm">{room.capacity} orang</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Badge variant={room.is_active ? "default" : "destructive"}>
                              {room.is_active ? "Aktif" : "Tidak Aktif"}
                            </Badge>
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          Edit Ruangan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>
                  Kelola data pengguna sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Institusi</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.institution}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
