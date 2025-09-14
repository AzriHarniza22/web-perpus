import Link from 'next/link'
import { BookOpen, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Perpustakaan Aceh</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Sistem reservasi ruangan perpustakaan wilayah Aceh. 
              Fasilitas modern untuk mendukung kegiatan pendidikan, 
              budaya, dan komunitas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Jl. Teuku Umar No. 1, Banda Aceh, Aceh</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>(0651) 123456</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@perpustakaan-aceh.go.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="text-gray-300 hover:text-white transition-colors">
                  Daftar Ruangan
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors">
                  Buat Reservasi
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms/library_theater" className="text-gray-300 hover:text-white transition-colors">
                  Library Theater
                </Link>
              </li>
              <li>
                <Link href="/rooms/aula_full" className="text-gray-300 hover:text-white transition-colors">
                  Aula Gedung (Full)
                </Link>
              </li>
              <li>
                <Link href="/rooms/aula_half" className="text-gray-300 hover:text-white transition-colors">
                  Aula Gedung (Setengah)
                </Link>
              </li>
              <li>
                <Link href="/rooms/social_inclusion" className="text-gray-300 hover:text-white transition-colors">
                  Ruang Inklusi Sosial
                </Link>
              </li>
              <li>
                <Link href="/rooms/meeting_room" className="text-gray-300 hover:text-white transition-colors">
                  Ruang Rapat
                </Link>
              </li>
              <li>
                <Link href="/rooms/library_tour" className="text-gray-300 hover:text-white transition-colors">
                  Library Tour
                </Link>
              </li>
              <li>
                <Link href="/rooms/outdoor_stage" className="text-gray-300 hover:text-white transition-colors">
                  Library Stage Outdoor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Perpustakaan Aceh. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
