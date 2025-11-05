// ============================================
// GOOGLE APPS SCRIPT UNTUK RSVP WEDDING
// ============================================
// 
// CARA SETUP:
// 1. Buka https://sheets.google.com
// 2. Buat spreadsheet baru dengan nama "RSVP Wedding"
// 3. Di baris pertama, buat header: Nama | Kehadiran | Jumlah Tamu | Waktu
// 4. Klik Extensions → Apps Script
// 5. Copy paste kode ini
// 6. Ganti YOUR_SPREADSHEET_ID dengan ID spreadsheet Anda
//    (ID ada di URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit)
// 7. Klik Deploy → New deployment → Web app
// 8. Set "Who has access" ke "Anyone"
// 9. Copy URL Web App yang muncul
// 10. Tambahkan URL tersebut ke file .env.local sebagai GOOGLE_SCRIPT_URL
//
// ============================================

function doPost(e) {
  try {
    // GANTI INI DENGAN ID SPREADSHEET ANDA
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Format data untuk ditambahkan ke spreadsheet
    const row = [
      data.name || '',
      data.attendance === 'hadir' ? 'Berkenan hadir' : 'Maaf tidak bisa hadir',
      data.guestCount || '',
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
    
    // Optional: Kirim email notifikasi (uncomment jika ingin)
    // sendEmailNotification(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data berhasil disimpan ke Google Sheets'
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
  return ContentService.createTextOutput('RSVP API is running');
}

// Optional: Fungsi untuk kirim email notifikasi
function sendEmailNotification(data) {
  const recipientEmail = 'your-email@gmail.com'; // Ganti dengan email Anda
  const subject = 'RSVP Baru - ' + data.name;
  const body = `
    Ada RSVP baru:
    
    Nama: ${data.name}
    Kehadiran: ${data.attendance === 'hadir' ? 'Berkenan hadir' : 'Maaf tidak bisa hadir'}
    Jumlah Tamu: ${data.guestCount}
    Waktu: ${new Date().toLocaleString('id-ID')}
  `;
  
  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    body: body
  });
}

