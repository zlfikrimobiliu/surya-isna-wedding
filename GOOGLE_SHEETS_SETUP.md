# Setup Google Sheets Integration

✅ **File yang sudah dibuat:**
- `google-apps-script.js` - Script siap pakai untuk Google Apps Script
- `pages/api/rsvp-google-sheets.js.example` - API untuk Google Sheets saja
- `pages/api/rsvp-hybrid.js.example` - API hybrid (Google Sheets + backup file JSON)

---

Ada 2 cara untuk menyimpan RSVP ke Google Sheets:

## Opsi 1: Google Apps Script (PALING MUDAH - Recommended)

### Langkah-langkah:

1. **Buat Google Spreadsheet baru**
   - Buka https://sheets.google.com
   - Buat spreadsheet baru dengan nama "RSVP Wedding"
   - Buat header di baris pertama: `Nama | Kehadiran | Jumlah Tamu | Waktu`

2. **Buat Google Apps Script**
   - Di spreadsheet, klik `Extensions` → `Apps Script`
   - Ganti kode dengan script di bawah ini
   - Ganti `YOUR_SPREADSHEET_ID` dengan ID spreadsheet Anda

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const row = [
      data.name || '',
      data.attendance === 'hadir' ? 'Berkenan hadir' : 'Maaf tidak bisa hadir',
      data.guestCount || '',
      new Date().toLocaleString('id-ID')
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data berhasil disimpan'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('RSVP API is running');
}
```

3. **Deploy sebagai Web App**
   - Klik `Deploy` → `New deployment`
   - Pilih `Web app`
   - Description: "RSVP Webhook"
   - Execute as: `Me`
   - Who has access: `Anyone`
   - Klik `Deploy`
   - **Copy URL Web App** (contoh: `https://script.google.com/macros/s/...`)

4. **Update API di Next.js**
   - Buka file `pages/api/rsvp.js`
   - Ganti dengan kode yang sudah disediakan di file terpisah

---

## Opsi 2: Google Sheets API (Lebih kompleks tapi lebih robust)

### Langkah-langkah:

1. **Setup Google Cloud Project**
   - Buka https://console.cloud.google.com
   - Buat project baru
   - Enable Google Sheets API
   - Buat Service Account
   - Download JSON credentials

2. **Install package:**
```bash
npm install googleapis
```

3. **Setup environment variables:**
   - Buat file `.env.local`
   - Tambahkan credentials

4. **Update API code**
   - Menggunakan googleapis package untuk write ke spreadsheet

---

## Opsi 3: Email Notifikasi (Gmail)

Bisa dikombinasikan dengan Opsi 1 atau 2 untuk mengirim email notifikasi setiap ada RSVP baru.

### Menggunakan Nodemailer:

1. Install package:
```bash
npm install nodemailer
```

2. Setup SMTP Gmail
   - Gunakan App Password (bukan password biasa)
   - Setup di environment variables

---

## Rekomendasi

**Gunakan Opsi 1 (Google Apps Script)** karena:
- ✅ Tidak perlu install package tambahan
- ✅ Setup sangat mudah
- ✅ Gratis tanpa quota limit
- ✅ Bisa langsung lihat data di spreadsheet
- ✅ Bisa tambahkan notifikasi email di script juga

---

## ⚠️ CATATAN PENTING UNTUK VERCEL:

**Jika Anda akan deploy ke Vercel**, file system write **TIDAK BERFUNGSI** karena Vercel menggunakan serverless functions dengan read-only filesystem.

**Solusi untuk Vercel:**
- ✅ Gunakan **`pages/api/rsvp-vercel.js`** (hanya Google Sheets)
- ✅ Setup environment variable `GOOGLE_SCRIPT_URL` di Vercel Dashboard
- ✅ Lihat panduan lengkap di `VERCEL_DEPLOYMENT.md`

**File yang dibuat:**
- `pages/api/rsvp-vercel.js` - Versi khusus untuk Vercel (hanya Google Sheets)
- `.env.local.example` - Template environment variables
- `VERCEL_DEPLOYMENT.md` - Panduan lengkap deploy ke Vercel

