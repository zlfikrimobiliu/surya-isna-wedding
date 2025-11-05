// API untuk menyimpan Ucapan ke Google Sheets via Google Apps Script
// Kompatibel dengan Vercel (tidak menggunakan file system)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, relationship, attendance, message } = req.body;

    // Validate input
    if (!name || !attendance || !message) {
      return res.status(400).json({ error: 'Nama, kehadiran, dan ucapan harus diisi' });
    }

    // Get Google Script URL from environment variable (gunakan yang sama dengan RSVP)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL is not set in environment variables');
      // Fallback untuk development (jika tidak ada env var)
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message: 'Ucapan berhasil dikirim (development mode)',
          data: {
            id: Date.now().toString(),
            name,
            relationship,
            attendance,
            message,
            timestamp: new Date().toISOString(),
          },
        });
      }
      return res.status(500).json({
        error: 'Server configuration error. Please contact administrator.',
      });
    }

    try {
      // Kirim data ke Google Sheets via Google Apps Script (sheet yang sama, tab berbeda)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ucapan', // Parameter untuk menentukan ke sheet/tab mana
          name,
          relationship,
          attendance,
          message,
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Script response error:', response.status, errorText);
        throw new Error(`Google Script returned ${response.status}: ${errorText}`);
      }

      // Try to parse as JSON
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('Failed to parse response as JSON:', text);
        throw new Error(`Invalid JSON response: ${text}`);
      }

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Ucapan berhasil disimpan ke Google Sheets',
          data: result.data || {
            id: Date.now().toString(),
            name,
            relationship,
            attendance,
            message,
            timestamp: new Date().toISOString(),
          },
        });
      } else {
        console.error('Google Script returned success:false:', result);
        throw new Error(result.error || 'Gagal menyimpan ke Google Sheets');
      }
    } catch (error) {
      console.error('Error saving to Google Sheets:', error.message);
      console.error('Full error:', error);
      return res.status(500).json({
        error: `Terjadi kesalahan saat menyimpan data: ${error.message}. Silakan coba lagi.`,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  } else if (req.method === 'GET') {
    // Get ucapan from Google Sheets
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      // Fallback untuk development
      return res.status(200).json({
        success: true,
        ucapan: [],
      });
    }

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=ucapan`, {
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

