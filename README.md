# Sistem Reservasi Ruangan Perpustakaan Aceh

Sistem reservasi ruangan modern untuk Perpustakaan Wilayah Aceh yang dibangun dengan Next.js, Supabase, dan shadcn/ui.

## 🚀 Fitur Utama

### Untuk Pengguna (Mahasiswa, Masyarakat, Komunitas)
- ✅ **Registrasi & Login** - Daftar akun dengan integrasi Google/Microsoft
- ✅ **Pilih Ruangan & Layanan** - 7 jenis ruangan dengan deskripsi lengkap
- ✅ **Kalender Ketersediaan** - Lihat jadwal kosong/penuh real-time
- ✅ **Formulir Reservasi** - Upload proposal dan dokumen pendukung
- ✅ **Notifikasi & Status** - Email/WhatsApp konfirmasi otomatis
- ✅ **Riwayat Reservasi** - Pantau semua booking yang pernah dilakukan

### Untuk Admin/Staff
- ✅ **Dashboard Admin** - Overview lengkap sistem
- ✅ **Manajemen Ruangan** - Tambah/edit informasi ruangan
- ✅ **Manajemen Pengguna** - Data peminjam dan riwayat booking
- ✅ **Manajemen Dokumen** - Verifikasi proposal dan arsip digital
- ✅ **Laporan & Statistik** - Analytics penggunaan ruangan

### Ruangan Tersedia
- 🎭 **Library Theater** (200 orang)
- 🏛️ **Aula Gedung (Full)** (500 orang)
- 🏛️ **Aula Gedung (Setengah)** (250 orang)
- 🧑‍🤝‍🧑 **Ruang Inklusi Sosial** (50 orang)
- 🪑 **Ruang Rapat** (20 orang)
- 📚 **Library Tour** (30 orang)
- 🎤 **Library Stage Outdoor** (300 orang)

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Auth, Storage)
- **Forms**: React Hook Form, Zod validation
- **Icons**: Lucide React
- **Styling**: Tailwind CSS dengan custom design system

## 📋 Prasyarat

- Node.js 18+ 
- npm atau yarn
- Akun Supabase
- Git

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd library-reservation
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Sistem Reservasi Ruangan Perpustakaan Aceh"

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# WhatsApp Configuration (optional)
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_TOKEN=your_whatsapp_api_token
```

### 4. Setup Supabase Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor di dashboard Supabase
3. Jalankan script SQL dari file `supabase-schema.sql`:

```sql
-- Copy dan paste seluruh isi file supabase-schema.sql ke SQL Editor
-- Kemudian klik "Run" untuk menjalankan script
```

### 5. Konfigurasi Supabase Auth

1. Di dashboard Supabase, buka **Authentication > Settings**
2. Aktifkan **Email** provider
3. Untuk Google OAuth (opsional):
   - Buka **Authentication > Providers**
   - Aktifkan **Google**
   - Masukkan Client ID dan Client Secret dari Google Console
4. Set **Site URL** ke `http://localhost:3000`
5. Set **Redirect URLs** ke `http://localhost:3000/auth/callback`

### 6. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
library-reservation/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Halaman autentikasi
│   │   ├── admin/             # Dashboard admin
│   │   ├── booking/           # Halaman reservasi
│   │   ├── bookings/          # Riwayat reservasi
│   │   ├── rooms/             # Daftar dan detail ruangan
│   │   └── page.tsx           # Halaman beranda
│   ├── components/            # Komponen React
│   │   ├── ui/                # shadcn/ui components
│   │   ├── forms/             # Form components
│   │   ├── calendar/          # Calendar components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── rooms/             # Room components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utility functions
│   │   └── supabase/          # Supabase configuration
│   ├── types/                 # TypeScript types
│   ├── constants/             # Constants dan konfigurasi
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── supabase-schema.sql        # Database schema
└── README.md                  # Dokumentasi
```

## 🗄️ Database Schema

### Tabel Utama

1. **users** - Data pengguna sistem
2. **rooms** - Informasi ruangan
3. **bookings** - Data reservasi
4. **notifications** - Notifikasi sistem

### Relasi

- `bookings.user_id` → `users.id`
- `bookings.room_id` → `rooms.id`
- `notifications.user_id` → `users.id`

## 🔐 Sistem Autentikasi

- **Supabase Auth** untuk manajemen user
- **Row Level Security (RLS)** untuk keamanan data
- **OAuth** dengan Google (opsional)
- **Role-based access** (user, admin, staff)

## 🎨 Customization

### Mengubah Tema

Edit file `src/app/globals.css` untuk mengubah warna dan styling:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Ubah warna primary */
  --secondary: 210 40% 96%;       /* Ubah warna secondary */
  /* ... */
}
```

### Menambah Ruangan Baru

1. Edit `src/constants/rooms.ts`
2. Tambahkan room type baru di enum `room_type`
3. Update `ROOM_TYPES` object
4. Jalankan migration database jika diperlukan

### Mengubah Konfigurasi

- **App info**: `src/constants/rooms.ts`
- **Database**: `src/lib/supabase/`
- **UI components**: `src/components/ui/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build aplikasi:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 📱 Mobile Responsive

Aplikasi sudah fully responsive dan optimized untuk:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop
- 🖥️ Large screens

## 🔧 Troubleshooting

### Error: "Invalid API key"

- Pastikan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Cek di Supabase dashboard > Settings > API

### Error: "Database connection failed"

- Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah benar
- Cek koneksi internet
- Pastikan database schema sudah dijalankan

### Error: "Authentication failed"

- Pastikan Supabase Auth sudah dikonfigurasi
- Cek redirect URLs di Supabase dashboard
- Pastikan email provider sudah diaktifkan

## 📞 Support

Untuk bantuan dan pertanyaan:

- 📧 Email: info@perpustakaan-aceh.go.id
- 📞 Phone: (0651) 123456
- 📍 Address: Jl. Teuku Umar No. 1, Banda Aceh

## 📄 License

Project ini dibuat untuk Perpustakaan Wilayah Aceh. All rights reserved.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📈 Roadmap

### Versi 1.1
- [ ] Integrasi payment gateway
- [ ] QR Code check-in
- [ ] Multi-bahasa (Indonesia & Inggris)
- [ ] Peta lokasi dengan Google Maps

### Versi 1.2
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] API documentation

---

**Dibuat dengan ❤️ untuk Perpustakaan Wilayah Aceh**