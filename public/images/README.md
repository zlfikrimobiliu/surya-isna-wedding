# Folder Images

Taruh gambar Anda di folder ini.

## Gambar yang dibutuhkan:

1. **couple.jpg** - Foto pasangan untuk halaman opening (hitam putih, elegant)
   - Ukuran disarankan: 800x1000px atau lebih besar
   - Format: JPG, PNG
   - Akan otomatis di-convert ke grayscale

2. **photo1.jpg sampai photo6.jpg** - Foto untuk galeri
3. **image01.jpg sampai image08.jpg** - Foto untuk slider gallery

## Cara menggunakan:

1. Taruh file gambar dengan nama `couple.jpg` di folder ini
2. Atau ubah nama file di `pages/index.js` sesuai nama file Anda:
   ```jsx
   <img src="/images/nama-file-anda.jpg" />
   ```

## Path di Next.js:

- File di folder `public/images/` bisa diakses dengan path `/images/nama-file.jpg`
- Tidak perlu import, langsung gunakan path `/images/...`

