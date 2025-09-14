import { Suspense } from 'react'
import { Hero } from '@/components/hero'
import { RoomGrid } from '@/components/rooms/room-grid'
import { Features } from '@/components/features'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Ruangan Tersedia
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <RoomGrid />
            </Suspense>
          </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  )
}