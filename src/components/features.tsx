import { 
  Calendar, 
  Clock, 
  Shield, 
  Smartphone, 
  Users, 
  CheckCircle,
  Bell,
  FileText,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Reservasi Mudah',
    description: 'Pilih tanggal, waktu, dan ruangan dengan antarmuka yang intuitif dan user-friendly.'
  },
  {
    icon: Clock,
    title: 'Real-time Availability',
    description: 'Lihat ketersediaan ruangan secara real-time dengan kalender yang terintegrasi.'
  },
  {
    icon: Shield,
    title: 'Keamanan Terjamin',
    description: 'Sistem keamanan yang kuat dengan autentikasi dan otorisasi yang terpercaya.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Akses dari perangkat apapun, kapan saja, di mana saja dengan desain responsif.'
  },
  {
    icon: Users,
    title: 'Multi-User Support',
    description: 'Mendukung berbagai jenis pengguna: mahasiswa, masyarakat, dan komunitas.'
  },
  {
    icon: CheckCircle,
    title: 'Status Tracking',
    description: 'Pantau status reservasi dari pending hingga selesai dengan notifikasi real-time.'
  },
  {
    icon: Bell,
    title: 'Notifikasi Otomatis',
    description: 'Dapatkan notifikasi via email dan WhatsApp untuk konfirmasi dan pengingat.'
  },
  {
    icon: FileText,
    title: 'Dokumen Terintegrasi',
    description: 'Upload proposal dan dokumen pendukung langsung dalam sistem reservasi.'
  },
  {
    icon: BarChart3,
    title: 'Laporan & Analytics',
    description: 'Dashboard admin dengan laporan penggunaan dan statistik yang komprehensif.'
  }
]

export function Features() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Sistem Kami?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem reservasi ruangan perpustakaan yang modern, efisien, 
            dan mudah digunakan untuk mendukung semua kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Memulai Reservasi?
            </h3>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Daftar sekarang dan nikmati kemudahan reservasi ruangan 
              perpustakaan dengan fitur-fitur terbaik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Daftar Sekarang
              </a>
              <a
                href="/booking"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                Lihat Ruangan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
