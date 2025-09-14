import { Suspense } from 'react'
import { RoomGrid } from '@/components/rooms/room-grid'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Search, Filter } from 'lucide-react'

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Daftar Ruangan
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Pilih ruangan yang sesuai dengan kebutuhan acara Anda. 
                Semua ruangan dilengkapi dengan fasilitas modern dan nyaman.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Semua Ruangan
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari ruangan..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <RoomGrid />
            </Suspense>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>7 Ruangan Tersedia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Dari ruang rapat kecil hingga aula besar, 
                    kami menyediakan berbagai pilihan ruangan untuk kebutuhan Anda.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span>Fasilitas Lengkap</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Setiap ruangan dilengkapi dengan fasilitas modern seperti 
                    sound system, proyektor, AC, dan koneksi internet.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <span>Reservasi Mudah</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Proses reservasi yang cepat dan mudah dengan sistem online 
                    yang dapat diakses kapan saja dan di mana saja.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
