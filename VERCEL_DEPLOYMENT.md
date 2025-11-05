# Panduan Deploy ke Vercel

## ⚠️ PENTING: Masalah dengan File System

Vercel menggunakan **serverless functions** dengan **read-only filesystem**. Ini berarti:

- ❌ **TIDAK BISA** menggunakan `fs.writeFileSync()` untuk save ke file JSON
- ❌ **TIDAK BISA** membuat folder `data/` dan menulis file
- ✅ **BISA** menggunakan Google Sheets via Google Apps Script (eksternal API)
- ✅ **BISA** menggunakan database eksternal (MongoDB, Supabase, dll)

---

## ✅ Solusi: Google Sheets (Recommended)

### Cara Setup:

1. **Setup Google Apps Script** (jika belum)
   - Ikuti panduan di `GOOGLE_SHEETS_SETUP.md`
   - Pastikan sudah deploy dan dapat URL Web App

2. **Update API untuk Vercel**
   ```bash
   # Rename file
   mv pages/api/rsvp.js pages/api/rsvp-backup.js
   mv pages/api/rsvp-vercel.js pages/api/rsvp.js
   ```

3. **Setup Environment Variables di Vercel**
   - Login ke Vercel Dashboard
   - Pilih project Anda
   - Klik **Settings** → **Environment Variables**
   - Tambahkan:
     - **Name**: `GOOGLE_SCRIPT_URL`
     - **Value**: URL Google Apps Script Web App Anda
   - Klik **Save**

4. **Deploy ke Vercel**
   ```bash
   # Install Vercel CLI (jika belum)
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Atau push ke GitHub dan auto-deploy
   git push origin main
   ```

---

## 📋 Checklist sebelum Deploy:

- [ ] Google Apps Script sudah setup dan deploy
- [ ] URL Google Apps Script sudah didapat
- [ ] Environment variable `GOOGLE_SCRIPT_URL` sudah ditambahkan di Vercel
- [ ] File `pages/api/rsvp.js` sudah menggunakan versi Vercel (rsvp-vercel.js)
- [ ] Test di local dengan `.env.local` dulu

---

## 🔍 Test di Local:

1. Buat file `.env.local` (copy dari `.env.local.example`)
2. Isi dengan URL Google Apps Script
3. Test dengan:
   ```bash
   npm run dev
   ```
4. Submit RSVP form dan cek apakah data masuk ke Google Sheets

---

## 🚨 Troubleshooting:

### Error: "GOOGLE_SCRIPT_URL is not set"
- Pastikan environment variable sudah ditambahkan di Vercel
- Pastikan variable name benar: `GOOGLE_SCRIPT_URL`
- Redeploy setelah menambahkan environment variable

### Error: "Failed to save to Google Sheets"
- Cek URL Google Apps Script apakah benar
- Pastikan Google Apps Script sudah di-deploy sebagai Web App
- Pastikan "Who has access" set ke "Anyone"
- Cek console log di Vercel untuk error detail

### Data tidak muncul di Google Sheets
- Cek Google Apps Script logs
- Pastikan `SPREADSHEET_ID` di script sudah benar
- Test URL webhook manual dengan Postman/curl

---

## 📝 File yang perlu diubah untuk Vercel:

1. **`pages/api/rsvp.js`** → Ganti dengan `pages/api/rsvp-vercel.js`
2. **`.env.local`** → Tambahkan `GOOGLE_SCRIPT_URL`
3. **Vercel Environment Variables** → Tambahkan `GOOGLE_SCRIPT_URL`

---

## 🎯 Alternatif Database (Opsional):

Jika ingin opsi lain selain Google Sheets:

1. **Vercel KV** (Key-Value Database)
   - Built-in Vercel
   - Free tier tersedia
   - Install: `npm install @vercel/kv`

2. **Supabase** (PostgreSQL)
   - Free tier tersedia
   - Install: `npm install @supabase/supabase-js`

3. **MongoDB Atlas**
   - Free tier tersedia
   - Install: `npm install mongodb`

---

## ✅ Setelah Deploy:

1. Test form RSVP di production
2. Cek data masuk ke Google Sheets
3. Monitor logs di Vercel Dashboard jika ada error

