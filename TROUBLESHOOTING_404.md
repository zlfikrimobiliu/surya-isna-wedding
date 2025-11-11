# Troubleshooting Error 404

## Masalah: Error 404 untuk file Next.js chunks

Jika Anda melihat error 404 untuk file seperti:
- `webpack.js`
- `main.js`
- `react-refresh.js`
- `_app.js`
- `_error.js`

## Solusi:

### 1. **Pastikan Server Sudah Selesai Compile**
- Tunggu 10-30 detik setelah menjalankan `npm run dev`
- Lihat di terminal, cari baris: `✓ Ready in XXXXms`
- Jangan refresh browser sebelum server selesai compile

### 2. **Cek Port yang Benar**
- Lihat di terminal, cari baris: `Local: http://localhost:XXXX`
- Buka URL tersebut di browser (bukan port lain)
- Jika port 3000 sudah digunakan, Next.js akan otomatis menggunakan 3001

### 3. **Clear Cache dan Restart**
```bash
# Stop semua proses node
# Hapus cache build
rm -rf .next

# Restart server
npm run dev
```

### 4. **Hard Refresh Browser**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Atau buka di incognito/private mode

### 5. **Jangan Akses Route yang Tidak Ada**
- Jangan akses `/login` - route tersebut tidak ada
- Akses langsung: `http://localhost:3000` atau `http://localhost:3001`

## Status Normal:

✅ **Build berhasil** - tidak ada error
✅ **Server berjalan** - port 3000 atau 3001
✅ **File valid** - semua syntax benar

404 untuk `/login` adalah **NORMAL** karena route tersebut tidak ada di project ini.

## Jika Masih Error:

1. **Cek terminal** - pastikan server sudah selesai compile
2. **Cek port** - pastikan mengakses port yang benar
3. **Clear browser cache** - hard refresh atau incognito mode
4. **Restart server** - stop dan start ulang dengan `npm run dev`

