# 🚀 Panduan Setup Sistem Reservasi Ruangan

## 📋 Langkah-langkah Setup

### 1. Clone dan Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd library-reservation

# Install dependencies
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```bash
cp env.example .env.local
```

Edit file `.env.local` dan isi dengan konfigurasi Supabase Anda:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Sistem Reservasi Ruangan Perpustakaan Aceh"
```

### 3. Setup Supabase Database

1. **Buat Project Supabase**
   - Kunjungi [supabase.com](https://supabase.com)
   - Buat akun dan project baru
   - Pilih region terdekat (Singapore untuk Indonesia)

2. **Jalankan Database Schema**
   - Buka dashboard Supabase
   - Pergi ke **SQL Editor**
   - Copy seluruh isi file `supabase-schema.sql`
   - Paste dan jalankan script SQL

3. **Konfigurasi Authentication**
   - Pergi ke **Authentication > Settings**
   - Aktifkan **Email** provider
   - Set **Site URL** ke `http://localhost:3000`
   - Set **Redirect URLs** ke `http://localhost:3000/auth/callback`

4. **Setup Google OAuth (Opsional)**
   - Pergi ke **Authentication > Providers**
   - Aktifkan **Google**
   - Dapatkan Client ID dan Secret dari [Google Cloud Console](https://console.cloud.google.com)
   - Masukkan ke Supabase dashboard

### 4. Jalankan Aplikasi

```bash
# Development mode
npm run dev

# Build untuk production
npm run build
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔧 Troubleshooting

### Error: "supabaseUrl is required"
- Pastikan file `.env.local` sudah dibuat
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah diisi dengan benar

### Error: "Database connection failed"
- Pastikan Supabase project sudah aktif
- Cek koneksi internet
- Pastikan database schema sudah dijalankan

### Error: "Authentication failed"
- Pastikan Supabase Auth sudah dikonfigurasi
- Cek redirect URLs di Supabase dashboard
- Pastikan email provider sudah diaktifkan

### Error: "Tailwind CSS unknown utility"
- Pastikan Tailwind CSS sudah terinstall
- Jalankan `npm install` ulang jika perlu

## 📱 Testing

### Test User Flow
1. **Registrasi**: Daftar akun baru
2. **Login**: Masuk dengan akun yang sudah dibuat
3. **Lihat Ruangan**: Buka halaman daftar ruangan
4. **Buat Reservasi**: Pilih ruangan dan buat reservasi
5. **Lihat Riwayat**: Cek riwayat reservasi

### Test Admin Flow
1. **Login sebagai Admin**: Gunakan akun admin yang dibuat di database
2. **Dashboard**: Lihat statistik dan data
3. **Kelola Reservasi**: Setujui/tolak reservasi
4. **Kelola Ruangan**: Edit informasi ruangan
5. **Kelola Pengguna**: Lihat data pengguna

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy!

### Manual Deployment
1. Build aplikasi: `npm run build`
2. Start production server: `npm start`
3. Setup reverse proxy (nginx/apache)
4. Setup SSL certificate

## 📞 Support

Jika mengalami masalah:
- 📧 Email: info@perpustakaan-aceh.go.id
- 📞 Phone: (0651) 123456
- 📍 Address: Jl. Teuku Umar No. 1, Banda Aceh

## 📄 File Penting

- `supabase-schema.sql` - Database schema
- `env.example` - Template environment variables
- `README.md` - Dokumentasi lengkap
- `package.json` - Dependencies dan scripts
- `next.config.js` - Konfigurasi Next.js
- `tailwind.config.js` - Konfigurasi Tailwind CSS

---

**Selamat mencoba! 🎉**
