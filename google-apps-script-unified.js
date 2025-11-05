// Google Apps Script untuk RSVP dan Ucapan Selamat
// Menyimpan ke spreadsheet yang sama, tapi di sheet/tab berbeda

const SPREADSHEET_ID = '1zEaR7XssIIK5DqODkcRAH8gT6Plsi_C1503iMz0P__0';

// Nama sheet/tab
const RSVP_SHEET_NAME = 'RSVP WEDDING';
const UCAPAN_SHEET_NAME = 'UCAPAN SELAMAT';

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = JSON.parse(e.postData.contents);
    
    // Tentukan ke sheet mana data akan ditulis
    const type = data.type || 'rsvp'; // Default ke RSVP jika tidak ada type
    
    if (type === 'ucapan') {
      // Simpan ke sheet UCAPAN SELAMAT
      let sheet = spreadsheet.getSheetByName(UCAPAN_SHEET_NAME);
      
      // Jika sheet belum ada, buat sheet baru
      if (!sheet) {
        sheet = spreadsheet.insertSheet(UCAPAN_SHEET_NAME);
        // Buat header
        sheet.appendRow(['Nama', 'Hubungan', 'Kehadiran', 'Ucapan', 'Waktu']);
        // Format header
        const headerRange = sheet.getRange(1, 1, 1, 5);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#f0f0f0');
      }
      
      // Format data untuk ucapan
      const row = [
        data.name || '',
        data.relationship || '',
        data.attendance === 'hadir' ? 'Berkenan hadir' : (data.attendance === 'tidak' ? 'Maaf tidak bisa hadir' : ''),
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
      
      sheet.appendRow(row);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Ucapan berhasil disimpan ke Google Sheets',
        data: {
          name: data.name,
          relationship: data.relationship,
          attendance: data.attendance,
          message: data.message
        }
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      // Simpan ke sheet RSVP WEDDING (default)
      let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
      
      // Jika sheet belum ada, buat sheet baru
      if (!sheet) {
        sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);
        // Buat header
        sheet.appendRow(['Nama', 'Kehadiran', 'Jumlah Tamu', 'Waktu']);
        // Format header
        const headerRange = sheet.getRange(1, 1, 1, 4);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#f0f0f0');
      }
      
      // Format data untuk RSVP
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
      
      sheet.appendRow(row);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data berhasil disimpan ke Google Sheets',
        data: {
          name: data.name,
          attendance: data.attendance,
          guestCount: data.guestCount
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
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
    const type = e.parameter.type || 'rsvp';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (type === 'ucapan') {
      // Ambil data dari sheet UCAPAN SELAMAT
      const sheet = spreadsheet.getSheetByName(UCAPAN_SHEET_NAME);
      
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          ucapan: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Ambil semua data (skip header)
      const data = sheet.getDataRange().getValues();
      const ucapan = [];
      
      // Skip header (baris pertama)
      for (let i = 1; i < data.length; i++) {
        if (data[i][0]) { // Pastikan ada nama
          // Konversi attendance dari format sheet ke format yang diharapkan frontend
          let attendanceValue = data[i][2] || '';
          // Jika di sheet tertulis "Berkenan hadir", konversi ke "hadir"
          if (attendanceValue === 'Berkenan hadir') {
            attendanceValue = 'hadir';
          }
          // Jika di sheet tertulis "Maaf tidak bisa hadir", konversi ke "tidak"
          else if (attendanceValue === 'Maaf tidak bisa hadir') {
            attendanceValue = 'tidak';
          }
          
          ucapan.push({
            id: `ucapan-${i}`,
            name: data[i][0] || '',
            relationship: data[i][1] || '',
            attendance: attendanceValue,
            message: data[i][3] || '',
            timestamp: data[i][4] || ''
          });
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        ucapan: ucapan
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      // Untuk RSVP, hanya return status
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'RSVP API is running'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
