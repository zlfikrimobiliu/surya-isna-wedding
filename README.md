# Website Undangan Pernikahan

Website undangan pernikahan yang elegan dan modern dengan desain yang responsif, dibangun dengan Next.js.

## Fitur

- ✨ Desain modern dan elegan
- 📱 Responsif untuk semua perangkat
- 🖼️ Galeri foto dengan slider
- 📍 Integrasi Google Maps
- 💰 Amplop digital dengan informasi rekening
- 📝 Form RSVP untuk konfirmasi kehadiran (disimpan ke server)
- 💌 Buku tamu untuk ucapan selamat (disimpan ke server)
- 🎨 Animasi smooth dan transisi yang halus
- 🚀 Siap deploy ke Vercel atau platform lainnya

## Tech Stack

- **Next.js 14** - React framework
- **React** - UI library
- **API Routes** - Backend untuk menyimpan RSVP dan ucapan
- **File Storage** - Menyimpan data dalam JSON files

## Instalasi

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

3. **Buka di Browser**
   - Buka [http://localhost:3000](http://localhost:3000)

## Struktur File

```
Wedding/
├── pages/
│   ├── index.js          # Halaman utama
│   ├── _app.js            # Next.js app wrapper
│   └── api/
│       ├── rsvp.js        # API untuk RSVP
│       └── ucapan.js      # API untuk ucapan
├── styles/
│   └── globals.css        # Global CSS styling
├── data/                  # Data storage (otomatis dibuat)
│   ├── rsvp.json          # Data RSVP
│   └── ucapan.json        # Data ucapan
├── public/                # Static files (images, dll)
├── package.json           # Dependencies
├── next.config.js         # Next.js config
└── vercel.json            # Vercel deployment config
```

## Deployment

### Deploy ke Vercel

1. **Install Vercel CLI** (opsional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Atau push ke GitHub dan connect ke Vercel dashboard.

3. **Environment Variables**
   - Tidak perlu setup khusus untuk deployment basic
   - Data akan tersimpan di serverless functions

### Deploy ke GitHub Pages

Untuk static export:
```bash
npm run build
npm run export
```

## Data Storage

- **RSVP**: Disimpan di `data/rsvp.json`
- **Ucapan**: Disimpan di `data/ucapan.json`

Data akan otomatis dibuat saat pertama kali form di-submit.

### Upgrade ke Database (Opsional)

Untuk production yang lebih robust, bisa upgrade ke:
- **Vercel Postgres** (recommended untuk Vercel)
- **MongoDB Atlas**
- **Supabase**
- **Firebase**

## Kustomisasi

### Mengubah Data Pernikahan

Edit file `pages/index.js` dan ubah:
- Nama pasangan
- Tanggal pernikahan
- Lokasi
- Informasi rekening
- Alamat hadiah

### Mengubah Warna Tema

Edit variabel CSS di `styles/globals.css`:

```css
:root {
    --primary-color: #d4a574;    /* Warna utama (emas) */
    --secondary-color: #8b7355;  /* Warna sekunder */
    --text-color: #333;          /* Warna teks */
}
```

### Menambahkan Foto

1. Tambahkan foto ke folder `public/images/`
2. Update di `pages/index.js` untuk menggunakan foto:
   ```jsx
   <img src="/images/photo1.jpg" alt="Photo 1" />
   ```

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run start` - Jalankan production server
- `npm run lint` - Lint code

## Browser Support

Website ini mendukung semua browser modern:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Catatan

- Data RSVP dan ucapan disimpan di file JSON (server-side)
- Untuk production dengan traffic tinggi, pertimbangkan upgrade ke database
- Google Maps akan membuka di tab baru dengan koordinat yang ditentukan
- Pastikan folder `data/` ada di `.gitignore` jika tidak ingin commit data ke git

## Lisensi

© 2025 All Rights Reserved

 Developed by zlfkri © 2025

