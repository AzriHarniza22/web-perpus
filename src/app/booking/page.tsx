'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClientSupabase } from '@/lib/supabase/client'
import { Room } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, Users, ArrowRight, LogIn } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function BookingPage() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('room')
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    eventName: '',
    eventDescription: '',
    attendeesCount: '',
  })
  const [proposalFile, setProposalFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    if (roomId) {
      fetchRoom()
    } else {
      setLoading(false)
    }
  }, [roomId])

  const fetchRoom = async () => {
    try {
      if (!roomId) {
        setLoading(false)
        return
      }
      console.log('Fetching room with ID:', roomId)
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId!)
        .single()
  
      if (error) {
        console.error('Error fetching room:', error)
        setError('Gagal memuat data ruangan: ' + error.message)
        return
      }
  
      console.log('Fetched room data:', data)
      setRoom(data)
    } catch (error) {
      console.error('Unexpected error fetching room:', error)
      setError('Terjadi kesalahan tak terduga saat memuat ruangan')
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProposalFile(e.target.files?.[0] || null)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
  
    console.log('Form submission started')
    console.log('Form data:', formData)
    console.log('Proposal file:', proposalFile)
    console.log('User ID:', user?.id)
    console.log('Room ID:', room?.id)
    console.log('Room capacity:', room?.capacity)
  
    // Check if user profile exists
    if (user) {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      console.log('User profile check:', { userProfile, profileError })
      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is no rows
        console.error('Error checking user profile:', profileError)
        setError('Gagal memverifikasi profil pengguna')
        setIsSubmitting(false)
        return
      }
      if (!userProfile) {
        console.error('User profile not found in database')
        setError('Profil pengguna belum lengkap. Silakan lengkapi profil terlebih dahulu.')
        setIsSubmitting(false)
        return
      }
    }
  
    // Basic validation
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !formData.eventName || !formData.attendeesCount) {
      setError('Semua field wajib diisi')
      setIsSubmitting(false)
      return
    }
  
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    console.log('Parsed dates:', { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] })
  
    if (startDate > endDate) {
      setError('Tanggal mulai harus sebelum tanggal selesai')
      setIsSubmitting(false)
      return
    }
  
    // Additional validation for same-day booking constraint
    if (startDate.toDateString() === endDate.toDateString()) {
      console.warn('Same-day booking detected - this may violate DB constraint start_date < end_date')
    }
  
    // Time validation
    const startTimeDate = new Date(`2000-01-01T${formData.startTime}:00`)
    const endTimeDate = new Date(`2000-01-01T${formData.endTime}:00`)
    console.log('Parsed times:', { startTime: formData.startTime, endTime: formData.endTime, startTimeDate, endTimeDate })
    if (startTimeDate >= endTimeDate) {
      setError('Jam mulai harus sebelum jam selesai')
      setIsSubmitting(false)
      return
    }
  
    const attendees = parseInt(formData.attendeesCount)
    console.log('Parsed attendees:', attendees)
    if (isNaN(attendees) || attendees <= 0 || attendees > room!.capacity) {
      setError(`Jumlah peserta harus antara 1 dan ${room!.capacity}`)
      setIsSubmitting(false)
      return
    }
  
    try {
      let proposalUrl: string | null = null
      if (proposalFile) {
        try {
          console.log('Uploading file:', proposalFile.name)
          const fileName = `${user!.id}/${Date.now()}-${proposalFile.name}`
          console.log('File path:', fileName)
          const { error: uploadError } = await supabase.storage
            .from('booking-proposals')
            .upload(fileName, proposalFile, {
              upsert: true,
              contentType: proposalFile.type,
            })
          if (uploadError) {
            console.error('File upload error:', uploadError)
            if (uploadError.message.includes('Bucket not found')) {
              console.warn('Storage bucket "booking-proposals" not found. Skipping file upload.')
              setError('Dokumen proposal tidak dapat diupload (bucket tidak tersedia). Reservasi tetap dapat dibuat tanpa dokumen.')
              proposalUrl = null
            } else {
              throw new Error(`Gagal upload dokumen: ${uploadError.message}`)
            }
          } else {
            console.log('File uploaded successfully')
            const { data } = supabase.storage
              .from('booking-proposals')
              .getPublicUrl(fileName)
            proposalUrl = data.publicUrl
            console.log('Proposal URL:', proposalUrl)
          }
        } catch (uploadErr) {
          console.error('Upload exception:', uploadErr)
          setError('Terjadi kesalahan saat upload dokumen. Reservasi tetap dapat dibuat tanpa dokumen.')
          proposalUrl = null
        }
      }
  
      const bookingData = {
        user_id: user!.id,
        room_id: room!.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        event_name: formData.eventName,
        event_description: formData.eventDescription || null,
        attendees_count: attendees,
        proposal_document: proposalUrl,
      }
    
      console.log('Inserting booking data:', bookingData)
    
      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingData as any)
    
      if (insertError) {
        console.error('Insert error details:', insertError)
        throw new Error(`Gagal menyimpan reservasi: ${insertError.message} (Code: ${insertError.code})`)
      }
  
      console.log('Booking created successfully')
      alert('Reservasi berhasil dibuat dan menunggu persetujuan!')
      router.push('/bookings')
    } catch (err: any) {
      console.error('Error creating booking:', err)
      setError(err.message || 'Gagal membuat reservasi: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              Anda harus login terlebih dahulu untuk membuat reservasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <LogIn className="h-4 w-4" />
              <AlertDescription>
                Silakan login atau daftar akun baru untuk melanjutkan
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (roomId && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Ruangan Tidak Ditemukan</CardTitle>
            <CardDescription>
              Ruangan yang Anda pilih tidak ditemukan atau tidak tersedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/rooms">Pilih Ruangan Lain</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {room ? `Reservasi ${room.name}` : 'Buat Reservasi Ruangan'}
          </h1>
          <p className="text-xl text-gray-600">
            {room 
              ? 'Pilih tanggal dan waktu untuk reservasi ruangan ini'
              : 'Pilih ruangan dan waktu yang sesuai dengan kebutuhan Anda'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Formulir Reservasi</span>
                </CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini untuk membuat reservasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!room ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Silakan pilih ruangan terlebih dahulu
                      </p>
                      <Button asChild>
                        <Link href="/rooms">
                          Pilih Ruangan
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Selesai
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jam Mulai
                          </label>
                          <select
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Pilih jam mulai</option>
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jam Selesai
                          </label>
                          <select
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Pilih jam selesai</option>
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Acara
                        </label>
                        <input
                          type="text"
                          name="eventName"
                          value={formData.eventName}
                          onChange={handleChange}
                          placeholder="Masukkan nama acara"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deskripsi Acara
                        </label>
                        <textarea
                          name="eventDescription"
                          value={formData.eventDescription}
                          onChange={handleChange}
                          placeholder="Deskripsikan acara yang akan diadakan"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Peserta
                        </label>
                        <input
                          type="number"
                          name="attendeesCount"
                          value={formData.attendeesCount}
                          onChange={handleChange}
                          placeholder="Masukkan jumlah peserta"
                          min="1"
                          max={room?.capacity || 100}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Proposal/Dokumen (Opsional)
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Format yang didukung: PDF, DOC, DOCX (Maksimal 10MB)
                        </p>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        <Calendar className="mr-2 h-5 w-5" />
                        {isSubmitting ? 'Membuat Reservasi...' : 'Buat Reservasi'}
                      </Button>
                      </form>
                      )}
                      </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Info Sidebar */}
          {room && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Ruangan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    {room.images && room.images.length > 0 ? (
                      <Image
                        src={room.images[0]}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-4xl">🏛️</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Nama Ruangan</span>
                      <span className="text-sm text-gray-900">{room.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Kapasitas</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{room.capacity} orang</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Jam Operasional</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {room.operating_hours?.start} - {room.operating_hours?.end}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <Badge variant={room.is_active ? "default" : "destructive"}>
                        {room.is_active ? "Tersedia" : "Tidak Tersedia"}
                      </Badge>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/rooms/${room.id}`}>
                      Lihat Detail Lengkap
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Penting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Reservasi harus dilakukan minimal 1 hari sebelumnya</p>
                    <p>• Durasi minimum reservasi adalah 1 jam</p>
                    <p>• Durasi maksimum reservasi adalah 8 jam per hari</p>
                    <p>• Konfirmasi akan dikirim via email dan WhatsApp</p>
                    <p>• Batalkan reservasi minimal 2 jam sebelum acara</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
