# Setup Google Sheets untuk RSVP dan Ucapan Selamat (Unified)

Panduan ini akan membantu Anda menyimpan data RSVP dan Ucapan Selamat ke **spreadsheet yang sama**, tapi di **sheet/tab yang berbeda**.

---

## Langkah-langkah Setup

### 1. Buat Google Spreadsheet

1. Buka https://sheets.google.com
2. Buat spreadsheet baru dengan nama "RSVP Wedding" (atau nama lain sesuai keinginan)
3. **Copy ID Spreadsheet** dari URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Contoh: `https://docs.google.com/spreadsheets/d/1zEaR7XssIIK5DqODkcRAH8gT6Plsi_C1503iMz0P__0/edit`
   - ID-nya adalah: `1zEaR7XssIIK5DqODkcRAH8gT6Plsi_C1503iMz0P__0`

### 2. Buat Sheet/Tab untuk Data

Di spreadsheet Anda, pastikan ada 2 sheet/tab:

1. **Sheet 1**: "RSVP WEDDING" (atau rename sheet pertama)
   - Header: `Nama | Kehadiran | Jumlah Tamu | Waktu`

2. **Sheet 2**: "UCAPAN SELAMAT" (buat sheet baru)
   - Klik ikon "+" di bawah untuk menambah sheet baru
   - Rename menjadi "UCAPAN SELAMAT"
   - Header: `Nama | Hubungan | Kehadiran | Ucapan | Waktu`

**Catatan**: Jika sheet belum ada, Google Apps Script akan membuatnya otomatis.

### 3. Buat Google Apps Script

1. Di spreadsheet, klik `Extensions` → `Apps Script`
2. Ganti semua kode dengan kode dari file `google-apps-script-unified.js`
3. **GANTI `YOUR_SPREADSHEET_ID`** dengan ID spreadsheet Anda (dari langkah 1)

### 4. Deploy sebagai Web App

1. Klik `Deploy` → `New deployment`
2. Pilih `Web app`
3. Isi:
   - **Description**: "Wedding RSVP & Ucapan API"
   - **Execute as**: `Me` (penting!)
   - **Who has access**: `Anyone` (penting!)
4. Klik `Deploy`
5. **Copy URL Web App** (contoh: `https://script.google.com/macros/s/AKfycbx.../exec`)
   - URL ini akan digunakan untuk kedua API (RSVP dan Ucapan)

### 5. Setup Environment Variables

#### Di Local (.env.local)

Buat file `.env.local` di root project:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec
```

**Gunakan URL yang sama untuk RSVP dan Ucapan!**

#### Di Vercel (jika deploy)

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan:
   - **Name**: `GOOGLE_SCRIPT_URL`
   - **Value**: URL Web App dari langkah 4
   - **Environment**: Production, Preview, Development (centang semua)

### 6. Test Setup

1. Jalankan `npm run dev`
2. Test RSVP form - data harus masuk ke sheet "RSVP WEDDING"
3. Test Ucapan Selamat form - data harus masuk ke sheet "UCAPAN SELAMAT"
4. Cek spreadsheet untuk memastikan data tersimpan dengan benar

---

## Struktur Data

### Sheet "RSVP WEDDING"
| Nama | Kehadiran | Jumlah Tamu | Waktu |
|------|-----------|-------------|-------|
| test-user | Berkenan hadir | 2 | 05/11/2025, 00.05 |

### Sheet "UCAPAN SELAMAT"
| Nama | Hubungan | Kehadiran | Ucapan | Waktu |
|------|----------|-----------|--------|-------|
| John Doe | Teman | Berkenan hadir | Selamat! | 05/11/2025, 00.10 |

---

## Troubleshooting

### Data tidak masuk ke spreadsheet

1. **Cek ID Spreadsheet**: Pastikan ID di Google Apps Script sudah benar
2. **Cek Permission**: Pastikan "Execute as: Me" dan "Who has access: Anyone"
3. **Cek Console**: Lihat console browser untuk error messages
4. **Cek Logs**: Di Google Apps Script, klik `Execution` untuk melihat error logs

### Sheet tidak dibuat otomatis

1. Pastikan nama sheet sesuai: "RSVP WEDDING" dan "UCAPAN SELAMAT"
2. Atau buat sheet secara manual dengan nama yang tepat

### Error "Script function not found"

1. Pastikan function `doPost` dan `doGet` ada di script
2. Redeploy Web App setelah perubahan script

---

## Keuntungan Unified Approach

✅ **Satu spreadsheet** - semua data di satu tempat  
✅ **Mudah dikelola** - tidak perlu setup terpisah  
✅ **Satu URL** - tidak perlu 2 environment variables  
✅ **Otomatis** - script akan membuat sheet jika belum ada  

---

## Catatan Penting

⚠️ **Jangan lupa** ganti `YOUR_SPREADSHEET_ID` dengan ID spreadsheet Anda!  
⚠️ **Set permission** ke "Anyone" agar bisa diakses dari web  
⚠️ **Gunakan URL yang sama** untuk `GOOGLE_SCRIPT_URL` di `.env.local` dan Vercel  

