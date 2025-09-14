// Script untuk debug koneksi Supabase dan data ruangan
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Load environment variables manually
const envContent = fs.readFileSync('.env.local', 'utf8')
const envLines = envContent.split('\n')
const envVars = {}

envLines.forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Debug Supabase Connection')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseKey ? 'Present' : 'Missing')
console.log('Service Role Key:', serviceRoleKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

async function debugSupabase() {
  try {
    console.log('\n📊 Testing Supabase connection...')
    
    // Test basic connection with anon key
    const { data: testData, error: testError } = await supabase
      .from('rooms')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Connection error with anon key:', testError)
      
      // Try with service role key if available
      if (supabaseAdmin) {
        console.log('\n🔄 Trying with service role key...')
        const { data: adminTestData, error: adminTestError } = await supabaseAdmin
          .from('rooms')
          .select('count')
          .limit(1)
        
        if (adminTestError) {
          console.error('❌ Connection error with service role key:', adminTestError)
          return
        } else {
          console.log('✅ Supabase connection successful with service role key')
        }
      } else {
        return
      }
    } else {
      console.log('✅ Supabase connection successful with anon key')
    }
    
    // Check rooms data with anon key
    console.log('\n🏠 Checking rooms data with anon key...')
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
    
    if (roomsError) {
      console.error('❌ Error fetching rooms with anon key:', roomsError)
      
      // Try with service role key if available
      if (supabaseAdmin) {
        console.log('\n🔄 Trying to fetch rooms with service role key...')
        const { data: adminRooms, error: adminRoomsError } = await supabaseAdmin
          .from('rooms')
          .select('*')
          .eq('is_active', true)
        
        if (adminRoomsError) {
          console.error('❌ Error fetching rooms with service role key:', adminRoomsError)
          return
        } else {
          console.log(`📈 Found ${adminRooms?.length || 0} active rooms with service role key`)
          if (adminRooms && adminRooms.length > 0) {
            console.log('\n📋 Room details:')
            adminRooms.forEach((room, index) => {
              console.log(`${index + 1}. ${room.name} (${room.room_type}) - ${room.capacity} orang`)
            })
          }
        }
      }
      return
    }
    
    console.log(`📈 Found ${rooms?.length || 0} active rooms with anon key`)
    
    if (rooms && rooms.length > 0) {
      console.log('\n📋 Room details:')
      rooms.forEach((room, index) => {
        console.log(`${index + 1}. ${room.name} (${room.room_type}) - ${room.capacity} orang`)
      })
    } else {
      console.log('⚠️  No rooms found! Need to insert default data.')
    }
    
    // Check if we need to insert default data
    if (!rooms || rooms.length === 0) {
      console.log('\n🔧 Inserting default rooms data...')
      
      const defaultRooms = [
        {
          name: 'Library Theater',
          description: 'Ruang teater perpustakaan untuk pertunjukan, seminar, dan acara budaya',
          room_type: 'library_theater',
          capacity: 200,
          facilities: ['Panggung lengkap', 'Sound system', 'Lighting system', 'Proyektor', 'AC', 'Kursi theater', 'Green room'],
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Aula Gedung (Full)',
          description: 'Aula utama gedung perpustakaan dengan kapasitas penuh',
          room_type: 'aula_full',
          capacity: 500,
          facilities: ['Panggung besar', 'Sound system profesional', 'Lighting lengkap', 'Proyektor HD', 'AC sentral', 'Kursi auditorium', 'VIP area', 'Catering area'],
          images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Aula Gedung (Setengah)',
          description: 'Aula gedung perpustakaan dengan kapasitas setengah',
          room_type: 'aula_half',
          capacity: 250,
          facilities: ['Panggung sedang', 'Sound system', 'Lighting', 'Proyektor', 'AC', 'Kursi auditorium', 'Catering area'],
          images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Ruang Inklusi Sosial',
          description: 'Ruang khusus untuk kegiatan inklusi sosial dan komunitas',
          room_type: 'social_inclusion',
          capacity: 50,
          facilities: ['Meja dan kursi fleksibel', 'Whiteboard', 'Proyektor', 'AC', 'Aksesibilitas difabel', 'Ruang diskusi', 'Koneksi internet'],
          images: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Ruang Rapat',
          description: 'Ruang rapat untuk pertemuan formal dan diskusi',
          room_type: 'meeting_room',
          capacity: 20,
          facilities: ['Meja rapat besar', 'Kursi ergonomis', 'Whiteboard', 'Proyektor', 'AC', 'Teleconference', 'Koneksi internet', 'Sound system'],
          images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Library Tour',
          description: 'Area untuk kunjungan dan tur perpustakaan',
          room_type: 'library_tour',
          capacity: 30,
          facilities: ['Area kunjungan', 'Display area', 'Audio guide', 'AC', 'Kursi portable', 'Panduan visual', 'Koneksi internet'],
          images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        },
        {
          name: 'Library Stage Outdoor',
          description: 'Panggung outdoor untuk acara terbuka dan pertunjukan',
          room_type: 'outdoor_stage',
          capacity: 300,
          facilities: ['Panggung outdoor', 'Sound system outdoor', 'Lighting outdoor', 'Area duduk', 'Tenda (opsional)', 'Generator listrik', 'Area parkir'],
          images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
          operating_hours: { start: '08:00', end: '21:00' }
        }
      ]
      
      const { data: insertData, error: insertError } = await supabase
        .from('rooms')
        .insert(defaultRooms)
      
      if (insertError) {
        console.error('❌ Error inserting rooms:', insertError)
      } else {
        console.log('✅ Successfully inserted default rooms data!')
        console.log(`📊 Inserted ${defaultRooms.length} rooms`)
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugSupabase()
