import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, Users, MapPin } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sistem Reservasi Ruangan
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-100">
            Perpustakaan Wilayah Aceh
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Fasilitas modern untuk mendukung kegiatan pendidikan, budaya, 
            dan komunitas di Aceh. Reservasi ruangan dengan mudah dan cepat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Buat Reservasi
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/rooms">
                <BookOpen className="mr-2 h-5 w-5" />
                Lihat Ruangan
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">7 Ruangan</h3>
              <p className="text-blue-100">Tersedia untuk berbagai kebutuhan</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-blue-100">Pengguna terdaftar</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Akses online kapan saja</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
