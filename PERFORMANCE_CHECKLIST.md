# ✅ Performance Checklist - Pastikan Website Tidak Lag

## 🎯 Checklist Sebelum Deploy

### 1. **Image Optimization** ✅
- [ ] Semua images di folder `public/images/` sudah dikompres
- [ ] Ukuran setiap image < 500KB
- [ ] Format: JPG untuk photos, PNG untuk graphics
- [ ] Critical images (opening, home) menggunakan `loading="eager"` dan `fetchpriority="high"`
- [ ] Non-critical images menggunakan `loading="lazy"` dan `fetchpriority="low"`

### 2. **Audio Optimization** ✅
- [ ] Audio file sudah dikompres
- [ ] Ukuran audio < 2MB
- [ ] Format: MP3 dengan bitrate 128kbps
- [ ] Menggunakan `preload="metadata"` (bukan `auto`)

### 3. **Code Optimization** ✅
- [ ] `next.config.js` sudah dikonfigurasi dengan benar
- [ ] `compress: true` aktif
- [ ] `swcMinify: true` aktif
- [ ] `productionBrowserSourceMaps: false`
- [ ] AOS menggunakan dynamic import (lazy load)

### 4. **CSS Optimization** ✅
- [ ] Background images menggunakan `content-visibility: auto`
- [ ] Tidak ada animasi yang terlalu berat
- [ ] CSS sudah di-minify di production

### 5. **Build & Test** ✅
- [ ] `npm run build` berhasil tanpa error
- [ ] Bundle size tidak terlalu besar
- [ ] Test di local dengan `npm run dev`
- [ ] Test di production build dengan `npm run start`

---

## 🔍 Monitoring Performa

### Setelah Deploy, Test dengan:

1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Target score: > 90 untuk mobile dan desktop

2. **Lighthouse (Chrome DevTools)**
   - Buka website di Chrome
   - Tekan F12 > Tab Lighthouse
   - Klik "Generate report"
   - Target: Performance > 90

3. **GTmetrix**
   - URL: https://gtmetrix.com/
   - Test website Anda
   - Target: Grade A, Load time < 3s

### Metrics yang Harus Dicapai:
- ✅ **First Contentful Paint (FCP)**: < 1.8s
- ✅ **Largest Contentful Paint (LCP)**: < 2.5s
- ✅ **Time to Interactive (TTI)**: < 3.8s
- ✅ **Total Blocking Time (TBT)**: < 200ms
- ✅ **Cumulative Layout Shift (CLS)**: < 0.1

---

## 🚨 Jika Masih Lag, Cek:

### 1. **Image Sizes**
```bash
# Cek ukuran semua images
ls -lh public/images/

# Jika ada yang > 500KB, kompres lagi
```

### 2. **Network Tab (Chrome DevTools)**
- Buka F12 > Network tab
- Reload page
- Lihat file mana yang paling besar/lama loading
- Optimasi file tersebut

### 3. **Bundle Size**
```bash
npm run build
# Lihat output, pastikan tidak ada bundle yang terlalu besar
```

### 4. **Vercel Analytics**
- Login ke Vercel dashboard
- Lihat Analytics > Performance
- Identifikasi bottleneck

---

## 📝 Best Practices untuk Maintenance

### Setiap Kali Menambah Konten Baru:

1. **Jika Menambah Image:**
   - ✅ Kompres image sebelum upload
   - ✅ Gunakan `loading="lazy"` untuk non-critical images
   - ✅ Gunakan `fetchpriority="low"` untuk non-critical images
   - ✅ Pastikan ukuran < 500KB

2. **Jika Menambah Audio:**
   - ✅ Kompres audio sebelum upload
   - ✅ Pastikan ukuran < 2MB
   - ✅ Gunakan `preload="metadata"`

3. **Jika Menambah Animasi:**
   - ✅ Gunakan AOS untuk scroll animations
   - ✅ Jangan terlalu banyak animasi bersamaan
   - ✅ Gunakan `will-change` dengan hati-hati

4. **Jika Menambah Section:**
   - ✅ Tambahkan `data-aos` untuk animasi scroll
   - ✅ Gunakan `content-visibility: auto` untuk background images
   - ✅ Pastikan lazy loading untuk images di section tersebut

---

## 🛠️ Tools untuk Optimasi

### Image Compression:
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim**: https://imageoptim.com/

### Audio Compression:
- **Audacity**: https://www.audacityteam.org/
- **Online Audio Converter**: https://www.online-audio-converter.com/

### Performance Testing:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

---

## ✅ Final Checklist

Sebelum deploy, pastikan:
- [ ] Semua images sudah dikompres
- [ ] Audio sudah dikompres
- [ ] `npm run build` berhasil
- [ ] Test di local tidak ada error
- [ ] Test performa dengan Lighthouse
- [ ] Semua optimasi di `next.config.js` aktif
- [ ] Environment variables sudah di-set di Vercel

---

## 📌 Catatan Penting

1. **Jangan pernah commit images/audio yang besar** ke Git
2. **Selalu kompres** sebelum upload
3. **Monitor performa** secara berkala setelah deploy
4. **Update optimasi** jika ada teknologi baru

Dengan mengikuti checklist ini, website Anda akan tetap cepat dan tidak lag! 🚀

