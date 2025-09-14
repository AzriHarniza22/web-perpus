-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'staff');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE room_type AS ENUM (
  'library_theater',
  'aula_full', 
  'aula_half',
  'social_inclusion',
  'meeting_room',
  'library_tour',
  'outdoor_stage'
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL CHECK (full_name <> ''),
  phone VARCHAR(20),
  institution VARCHAR(255),
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  room_type room_type NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  facilities TEXT[],
  images TEXT[] NOT NULL DEFAULT '{}',
  layout_image TEXT,
  is_active BOOLEAN DEFAULT true,
  operating_hours JSONB DEFAULT '{"start": "08:00", "end": "21:00"}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_description TEXT,
  attendees_count INTEGER NOT NULL CHECK (attendees_count > 0),
  status booking_status DEFAULT 'pending',
  proposal_document TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (start_date < end_date),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_user_date ON bookings(user_id, start_date) WHERE status = 'pending'; -- Composite for user queries
CREATE INDEX idx_bookings_date_range ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_end_date ON bookings(end_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC); -- For recent notifications
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default rooms
INSERT INTO rooms (name, description, room_type, capacity, facilities, images) VALUES
('Library Theater', 'Ruang teater perpustakaan untuk pertunjukan, seminar, dan acara budaya', 'library_theater', 200, 
 ARRAY['Panggung lengkap', 'Sound system', 'Lighting system', 'Proyektor', 'AC', 'Kursi theater', 'Green room'],
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800']),

('Aula Gedung (Full)', 'Aula utama gedung perpustakaan dengan kapasitas penuh', 'aula_full', 500,
 ARRAY['Panggung besar', 'Sound system profesional', 'Lighting lengkap', 'Proyektor HD', 'AC sentral', 'Kursi auditorium', 'VIP area', 'Catering area'],
 ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800']),

('Aula Gedung (Setengah)', 'Aula gedung perpustakaan dengan kapasitas setengah', 'aula_half', 250,
 ARRAY['Panggung sedang', 'Sound system', 'Lighting', 'Proyektor', 'AC', 'Kursi auditorium', 'Catering area'],
 ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800']),

('Ruang Inklusi Sosial', 'Ruang khusus untuk kegiatan inklusi sosial dan komunitas', 'social_inclusion', 50,
 ARRAY['Meja dan kursi fleksibel', 'Whiteboard', 'Proyektor', 'AC', 'Aksesibilitas difabel', 'Ruang diskusi', 'Koneksi internet'],
 ARRAY['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800']),

('Ruang Rapat', 'Ruang rapat untuk pertemuan formal dan diskusi', 'meeting_room', 20,
 ARRAY['Meja rapat besar', 'Kursi ergonomis', 'Whiteboard', 'Proyektor', 'AC', 'Teleconference', 'Koneksi internet', 'Sound system'],
 ARRAY['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800']),

('Library Tour', 'Area untuk kunjungan dan tur perpustakaan', 'library_tour', 30,
 ARRAY['Area kunjungan', 'Display area', 'Audio guide', 'AC', 'Kursi portable', 'Panduan visual', 'Koneksi internet'],
 ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800']),

('Library Stage Outdoor', 'Panggung outdoor untuk acara terbuka dan pertunjukan', 'outdoor_stage', 300,
 ARRAY['Panggung outdoor', 'Sound system outdoor', 'Lighting outdoor', 'Area duduk', 'Tenda (opsional)', 'Generator listrik', 'Area parkir'],
 ARRAY['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800']);

-- Create admin user (password: admin123)
INSERT INTO users (email, full_name, phone, institution, role) VALUES
('admin@perpustakaan-aceh.go.id', 'Administrator', '08123456789', 'Perpustakaan Aceh', 'admin');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING ((SELECT auth.uid()) = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Anyone can read rooms (public)
CREATE POLICY "Rooms are viewable by everyone" ON rooms
  FOR SELECT USING (true);

-- Only admins can modify rooms
CREATE POLICY "Rooms are viewable by everyone" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert rooms" ON rooms
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can update rooms" ON rooms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can delete rooms" ON rooms
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role IN ('admin', 'staff')
    )
  );

-- Users can view their own bookings
CREATE POLICY "Users and admins can view bookings" ON bookings
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role IN ('admin', 'staff')
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update their own pending bookings
CREATE POLICY "Users and admins can update bookings" ON bookings
  FOR UPDATE USING (
    ((SELECT auth.uid()) = user_id AND status = 'pending')
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role IN ('admin', 'staff')
    )
  );



-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);
