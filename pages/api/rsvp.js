// API untuk menyimpan RSVP ke Google Sheets via Google Apps Script
// Kompatibel dengan Vercel (tidak menggunakan file system)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, attendance, guestCount } = req.body;

    // Validate input
    if (!name || !attendance || !guestCount) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    // Get Google Script URL from environment variable
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL is not set in environment variables');
      return res.status(500).json({
        error: 'Server configuration error. Please contact administrator.',
      });
    }

    try {
      // Kirim data ke Google Sheets via Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          attendance,
          guestCount: parseInt(guestCount),
        }),
      });

      const result = await response.json();

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Konfirmasi kehadiran berhasil disimpan ke Google Sheets',
          data: {
            name,
            attendance,
            guestCount: parseInt(guestCount),
            timestamp: new Date().toISOString(),
          },
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
    return res.status(200).json({
      message: 'RSVP API - Use POST to submit RSVP',
      note: 'Data is stored in Google Sheets',
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

