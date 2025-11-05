# 🚀 Panduan Lengkap Deploy ke Vercel

## 📋 Persiapan Sebelum Deploy

### 1. Pastikan Google Apps Script Sudah Setup

**Untuk RSVP:**
- Buat Google Apps Script untuk RSVP (sudah ada di `google-apps-script.js`)
- Deploy sebagai Web App dan dapatkan URL
- Pastikan "Who has access" = "Anyone"

**Untuk Ucapan:**
- Buat Google Apps Script untuk Ucapan (sama seperti RSVP)
- Deploy sebagai Web App dan dapatkan URL

### 2. Setup Environment Variables

**File `.env.local` (untuk local development):**
```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_RSVP_SCRIPT_ID/exec
GOOGLE_SCRIPT_UCAPAN_URL=https://script.google.com/macros/s/YOUR_UCAPAN_SCRIPT_ID/exec
```

**File `.env.example` (untuk dokumentasi):**
```env
GOOGLE_SCRIPT_URL=your_google_script_url_here
GOOGLE_SCRIPT_UCAPAN_URL=your_ucapan_script_url_here
```

---

## 🎯 Cara Deploy ke Vercel

### Opsi 1: Deploy via Vercel Dashboard (Recommended untuk Pemula)

1. **Persiapkan Repository GitHub**
   ```bash
   # Inisialisasi git (jika belum)
   git init
   
   # Buat .gitignore
   echo "node_modules
   .next
   .env.local
   .env*.local
   data/
   *.log" > .gitignore
   
   # Commit dan push ke GitHub
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/wedding-invitation.git
   git push -u origin main
   ```

2. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub account
   - Klik "Add New Project"

3. **Import Project**
   - Pilih repository GitHub Anda
   - Vercel akan auto-detect Next.js
   - **JANGAN klik Deploy dulu!**

4. **Setup Environment Variables**
   - Scroll ke bagian "Environment Variables"
   - Tambahkan:
     - **Name**: `GOOGLE_SCRIPT_URL`
     - **Value**: URL Google Apps Script untuk RSVP
     - **Environment**: Production, Preview, Development (centang semua)
   - Tambahkan lagi:
     - **Name**: `GOOGLE_SCRIPT_UCAPAN_URL`
     - **Value**: URL Google Apps Script untuk Ucapan
     - **Environment**: Production, Preview, Development (centang semua)
   - Klik "Save"

5. **Deploy**
   - Klik "Deploy"
   - Tunggu hingga selesai
   - Website akan otomatis live!

### Opsi 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy ke preview
   vercel
   
   # Deploy ke production
   vercel --prod
   ```

4. **Setup Environment Variables via CLI**
   ```bash
   vercel env add GOOGLE_SCRIPT_URL
   vercel env add GOOGLE_SCRIPT_UCAPAN_URL
   ```

---

## ✅ Checklist Sebelum Deploy

- [ ] Google Apps Script untuk RSVP sudah dibuat dan di-deploy
- [ ] Google Apps Script untuk Ucapan sudah dibuat dan di-deploy
- [ ] URL Web App sudah didapat untuk kedua script
- [ ] Environment variables sudah ditambahkan di Vercel
- [ ] File `.env.local` sudah dibuat untuk local testing
- [ ] Test form RSVP di local berhasil
- [ ] Test form Ucapan di local berhasil
- [ ] Semua gambar sudah ada di folder `public/images/`
- [ ] Tidak ada file yang menggunakan `fs.writeFileSync` (kecuali untuk local)

---

## 🔧 Setup Google Apps Script untuk Ucapan

Jika belum ada, buat script baru untuk Ucapan:

1. **Buka Google Apps Script**: https://script.google.com
2. **Buat project baru**
3. **Copy script berikut:**

```javascript
function doPost(e) {
  try {
    // GANTI INI DENGAN ID SPREADSHEET ANDA
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Jika sheet kosong, buat header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['ID', 'Nama', 'Hubungan', 'Kehadiran', 'Ucapan', 'Timestamp']);
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Format data untuk ditambahkan ke spreadsheet
    const row = [
      Date.now().toString(), // ID
      data.name || '',
      data.relationship || '',
      data.attendance === 'hadir' ? 'Berkenan hadir' : 'Maaf tidak bisa hadir',
      data.message || '',
      new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    ];
    
    // Tambahkan data ke spreadsheet
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Ucapan berhasil disimpan ke Google Sheets',
      data: {
        id: row[0],
        name: data.name,
        relationship: data.relationship,
        attendance: data.attendance,
        message: data.message
      }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Ambil semua data (skip header)
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Convert ke format JSON
    const ucapan = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase()] = row[index];
      });
      return {
        id: obj.id || Date.now().toString(),
        name: obj.nama || '',
        relationship: obj.hubungan || '',
        attendance: obj.kehadiran === 'Berkenan hadir' ? 'hadir' : 'tidak',
        message: obj.ucapan || ''
      };
    }).reverse(); // Paling baru di atas
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      ucapan: ucapan
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Ganti `YOUR_SPREADSHEET_ID`** dengan ID Google Sheets Anda
5. **Deploy sebagai Web App**
   - Klik "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Klik "Deploy"
   - Copy URL yang muncul

---

## 📝 Update API untuk Vercel

Pastikan file `pages/api/ucapan.js` sudah menggunakan Google Sheets:

```javascript
// API untuk menyimpan Ucapan ke Google Sheets via Google Apps Script
// Kompatibel dengan Vercel (tidak menggunakan file system)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, relationship, attendance, message } = req.body;

    // Validate input
    if (!name || !attendance || !message) {
      return res.status(400).json({ error: 'Nama, kehadiran, dan ucapan harus diisi' });
    }

    // Get Google Script URL from environment variable
    const GOOGLE_SCRIPT_UCAPAN_URL = process.env.GOOGLE_SCRIPT_UCAPAN_URL;

    if (!GOOGLE_SCRIPT_UCAPAN_URL) {
      console.error('GOOGLE_SCRIPT_UCAPAN_URL is not set in environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact administrator.',
      });
    }

    try {
      // Kirim data ke Google Sheets via Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_UCAPAN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          relationship,
          attendance,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Ucapan berhasil disimpan ke Google Sheets',
          data: result.data,
        });
      } else {
        throw new Error(result.error || 'Gagal menyimpan ke Google Sheets');
      }
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      return res.status(500).json({
        error: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
      });
    }
  } else if (req.method === 'GET') {
    // Get ucapan from Google Sheets
    const GOOGLE_SCRIPT_UCAPAN_URL = process.env.GOOGLE_SCRIPT_UCAPAN_URL;

    if (!GOOGLE_SCRIPT_UCAPAN_URL) {
      return res.status(200).json({
        success: true,
        ucapan: [],
      });
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_UCAPAN_URL, {
        method: 'GET',
      });

      const result = await response.json();

      if (result.success) {
        return res.status(200).json({
          success: true,
          ucapan: result.ucapan || [],
        });
      } else {
        return res.status(200).json({
          success: true,
          ucapan: [],
        });
      }
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      return res.status(200).json({
        success: true,
        ucapan: [],
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
```

---

## 🧪 Test Setelah Deploy

1. **Test Form RSVP**
   - Buka website di Vercel
   - Isi form RSVP
   - Submit
   - Cek Google Sheets apakah data masuk

2. **Test Form Ucapan**
   - Isi form Ucapan Selamat
   - Submit
   - Cek Google Sheets apakah data masuk
   - Cek apakah ucapan muncul di list

3. **Test Fitur Lain**
   - Countdown timer
   - Gallery
   - Navigation
   - Maps

---

## 🚨 Troubleshooting

### Error: "GOOGLE_SCRIPT_URL is not set"
- Pastikan environment variable sudah ditambahkan di Vercel
- Redeploy setelah menambahkan environment variable
- Pastikan variable name benar (case-sensitive)

### Error: "Failed to save to Google Sheets"
- Cek URL Google Apps Script apakah benar
- Pastikan Google Apps Script sudah di-deploy sebagai Web App
- Pastikan "Who has access" set ke "Anyone"
- Cek console log di Vercel Dashboard

### Data tidak muncul di Google Sheets
- Cek Google Apps Script logs (Execution log)
- Pastikan `SPREADSHEET_ID` di script sudah benar
- Test URL webhook manual dengan Postman/curl

### Website tidak bisa diakses
- Cek deployment status di Vercel Dashboard
- Cek build logs untuk error
- Pastikan semua dependencies terinstall

---

## 📚 Resource

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

## ✅ Setelah Deploy Berhasil

1. Test semua fitur di production
2. Monitor logs di Vercel Dashboard
3. Cek Google Sheets secara berkala
4. Setup custom domain (opsional)

---

**Selamat! Website undangan Anda sudah live di Vercel! 🎉**

