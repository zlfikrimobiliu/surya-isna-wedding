// Wedding Invitation Configuration
// Edit this file to customize your wedding invitation

const weddingConfig = {
    // Couple Information
    couple: {
        name1: "Isna Refina",
        name2: "Surya Ariadi",
        ig1: "isnarefina",
        ig2: "surya_artfreedom",
        combinedName: "Isna & Surya"
    },
    
    // Wedding Date
    weddingDate: {
        day: "Minggu",
        date: "14",
        month: "Desember",
        year: "2025",
        fullDate: "14.12.2025"
    },
    
    // Events
    events: [
        {
            title: "AKAD NIKAH",
            day: "Minggu",
            date: "14",
            month: "Desember 2025",
            time: "10.00 WIB - Selesai",
            location: "Rustic Republik Kediri"
        },
        {
            title: "RESEPSI PERNIKAHAN",
            day: "Minggu",
            date: "14",
            month: "Desember 2025",
            time: "16.00 WIB - Selesai",
            location: "Rustic Republik Kediri"
        }
    ],
    
    // Bank Account Information
    bankAccount: {
        bank: "BCA",
        accountNumber: "0901407915",
        accountName: "ISNA REFINA RAHMAWATI"
    },
    
    // Gift Address
    giftAddress: {
        recipient: "Isna Refina",
        phone: "085792788020",
        address: "Dsn Kendalrejo RT 3 RW 9 Kecamatan Talun - Blitar"
    },
    
    // Location (for Google Maps)
    location: {
        latitude: -7.8239,
        longitude: 112.0119,
        name: "Rustic Republik Kediri"
    },
    
    // Messages
    greeting: "Dengan segala kerendahan hati dan dengan ungkapan syukur, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri Resepsi Pernikahan kami.",
    
    quote: "\"Kita adalah \"ketersalingan\". Saling mengisi kekosongan, saling melengkapi, saling membersamai, dan saling berdamai dengan segala kelebihan dan kekurangan yang kita miliki\"",
    
    // Gallery Images (replace with your image URLs)
    galleryImages: [
        "image01.jpg",
        "image02.jpg",
        "image03.jpg",
        "image04.jpg",
        "image05.jpg",
        "image06.jpg",
        "image07.jpg",
        "image08.jpg"
    ],
    
    // Photo Gallery (for galeri section)
    photos: [
        "photo1.jpg",
        "photo2.jpg",
        "photo3.jpg",
        "photo4.jpg",
        "photo5.jpg",
        "photo6.jpg"
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = weddingConfig;
}

