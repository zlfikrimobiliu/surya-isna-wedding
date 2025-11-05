# Folder Audio

Taruh file musik/lagu Anda di folder ini.

## Format Audio yang Didukung:

- **MP3** (recommended) - `wedding-music.mp3`
- **OGG** (opsional, untuk browser yang tidak support MP3) - `wedding-music.ogg`

## Cara Menggunakan:

1. **Siapkan file musik**:
   - Format: MP3 (recommended) atau OGG
   - Ukuran: Disarankan di bawah 5MB untuk loading cepat
   - Durasi: Bisa lagu penuh atau loop pendek

2. **Nama file**:
   - Simpan dengan nama: `wedding-music.mp3`
   - Atau ubah nama file di `pages/index.js` sesuai nama file Anda:
     ```jsx
     <source src="/audio/nama-file-anda.mp3" type="audio/mpeg" />
     ```

3. **Path di Next.js**:
   - File di folder `public/audio/` bisa diakses dengan path `/audio/nama-file.mp3`
   - Tidak perlu import, langsung gunakan path `/audio/...`

## Tips:

- **Kompresi**: Gunakan tool seperti Audacity atau online compressor untuk mengurangi ukuran file
- **Kualitas**: 128kbps sudah cukup untuk background music
- **Loop**: Musik akan otomatis loop (berulang) saat diputar
- **Autoplay**: Browser modern biasanya memblokir autoplay, jadi user harus klik button musik dulu

## Contoh File:

- `wedding-music.mp3` - Lagu utama
- `wedding-music.ogg` - Backup format (opsional)

