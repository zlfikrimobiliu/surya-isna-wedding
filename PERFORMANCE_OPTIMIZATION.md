# Optimasi Performa Website

## Masalah yang Ditemukan

Website terasa berat/lag bisa disebabkan oleh beberapa faktor:

### 1. **Dari Sisi Codingan (Sudah Diperbaiki)**
- ✅ **Images tidak dioptimasi** - Semua gambar dimuat sekaligus dengan `loading="eager"`
- ✅ **Audio preload="auto"** - Audio dimuat langsung saat halaman load
- ✅ **AOS tidak di-lazy load** - Library AOS dimuat langsung
- ✅ **Background images tidak dioptimasi** - Background images dimuat tanpa optimasi
- ✅ **Tidak ada kompresi** - Next.js config belum dioptimasi

### 2. **Dari Sisi Vercel (Normal)**
- Vercel free tier memiliki limit bandwidth
- Cold start untuk serverless functions (biasanya < 1 detik)
- CDN caching membutuhkan waktu untuk warm up

## Optimasi yang Sudah Dilakukan

### 1. **Next.js Configuration (`next.config.js`)**
- ✅ `compress: true` - Mengaktifkan kompresi gzip
- ✅ `swcMinify: true` - Menggunakan SWC untuk minify yang lebih cepat
- ✅ `productionBrowserSourceMaps: false` - Menonaktifkan source maps di production
- ✅ `poweredByHeader: false` - Menghapus header X-Powered-By
- ✅ `optimizeCss: true` - Optimasi CSS
- ✅ `minimumCacheTTL: 60` - Cache images selama 60 detik

### 2. **Image Optimization**
- ✅ Background images: `loading="lazy"` dan `decoding="async"`
- ✅ Gallery images: `loading="lazy"` dengan `fetchpriority` dinamis
- ✅ Thumbnail images: Semua menggunakan `loading="lazy"`
- ✅ Preload hanya untuk critical images (halaman pertama dan home)

### 3. **Audio Optimization**
- ✅ `preload="metadata"` - Hanya load metadata, bukan seluruh file
- Audio akan dimuat saat user berinteraksi

### 4. **AOS (Animate On Scroll) Optimization**
- ✅ Lazy load AOS menggunakan dynamic import
- ✅ Optimasi debounce dan throttle delay
- ✅ AOS hanya dimuat saat `isOpen === true`

### 5. **CSS Optimization**
- ✅ `content-visibility: auto` untuk sections dengan background images
- ✅ `contain-intrinsic-size` untuk optimasi rendering

### 6. **DNS Prefetch**
- ✅ Prefetch untuk Google Fonts untuk mempercepat loading fonts

## Tips Tambahan untuk Optimasi Lebih Lanjut

### 1. **Kompresi Images**
Pastikan semua images sudah dikompres sebelum di-upload:
- Gunakan tools seperti [TinyPNG](https://tinypng.com/) atau [Squoosh](https://squoosh.app/)
- Target ukuran: < 500KB per image
- Format: JPG untuk photos, PNG untuk graphics dengan transparansi

### 2. **Image Format**
- Next.js otomatis mengkonversi ke WebP/AVIF jika browser support
- Pastikan `next.config.js` sudah dikonfigurasi dengan benar

### 3. **Audio File**
- Kompres audio file jika terlalu besar
- Format: MP3 dengan bitrate 128kbps sudah cukup
- Target ukuran: < 2MB

### 4. **Vercel Settings**
- Pastikan menggunakan Vercel Pro jika traffic tinggi
- Enable "Automatic HTTPS" dan "Edge Network"
- Monitor bandwidth usage di Vercel dashboard

### 5. **Browser Caching**
- Vercel otomatis mengatur cache headers
- Images akan di-cache oleh browser dan CDN

### 6. **Lazy Loading**
- Semua images non-critical sudah menggunakan lazy loading
- Images akan dimuat saat user scroll ke section tersebut

## Monitoring Performa

### Tools untuk Test Performa:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/
4. **Lighthouse** (Chrome DevTools): F12 > Lighthouse tab

### Metrics yang Harus Dicapai:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Troubleshooting

### Jika Masih Terasa Lag:

1. **Check Image Sizes**
   ```bash
   # Di terminal, cek ukuran images
   ls -lh public/images/
   ```

2. **Check Bundle Size**
   ```bash
   npm run build
   # Lihat output untuk bundle size
   ```

3. **Check Network Tab**
   - Buka Chrome DevTools > Network
   - Reload page
   - Lihat file mana yang paling besar/lama loading

4. **Check Vercel Analytics**
   - Login ke Vercel dashboard
   - Lihat Analytics > Performance
   - Identifikasi bottleneck

### Jika Masih Ada Masalah:

1. **Kompres Images Lebih Agresif**
   - Gunakan quality 70-80% untuk JPG
   - Resize images ke ukuran yang diperlukan saja

2. **Reduce Animations**
   - Kurangi jumlah animasi yang berjalan bersamaan
   - Gunakan `will-change` dengan hati-hati

3. **Code Splitting**
   - Next.js otomatis melakukan code splitting
   - Pastikan tidak ada import yang tidak perlu

4. **CDN Optimization**
   - Pastikan Vercel CDN aktif
   - Check cache hit ratio

## Kesimpulan

Optimasi yang sudah dilakukan seharusnya sudah cukup untuk meningkatkan performa website. Jika masih terasa lag, kemungkinan besar karena:

1. **Images terlalu besar** - Perlu dikompres lebih agresif
2. **Audio file terlalu besar** - Perlu dikompres
3. **Network connection user lambat** - Ini di luar kontrol kita
4. **Vercel free tier limit** - Pertimbangkan upgrade ke Pro

Untuk hasil terbaik, pastikan semua images dan audio sudah dikompres dengan baik sebelum deploy!

