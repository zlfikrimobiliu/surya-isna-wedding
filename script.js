// Opening Invitation
function openInvitation() {
    const openingSection = document.querySelector('.opening-section');
    const mainContent = document.getElementById('main-content');
    
    openingSection.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Gallery Slider
let currentSlideIndex = 1;
showSlides(currentSlideIndex);

function currentSlide(n) {
    showSlides(currentSlideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName('gallery-item');
    const dots = document.getElementsByClassName('dot');
    
    if (n > slides.length) { currentSlideIndex = 1; }
    if (n < 1) { currentSlideIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    
    slides[currentSlideIndex - 1].classList.add('active');
    dots[currentSlideIndex - 1].classList.add('active');
}

// Auto slide gallery
let slideInterval = setInterval(() => {
    currentSlideIndex++;
    if (currentSlideIndex > document.getElementsByClassName('gallery-item').length) {
        currentSlideIndex = 1;
    }
    showSlides(currentSlideIndex);
}, 3000);

// Pause on hover
const gallerySlider = document.querySelector('.gallery-slider');
if (gallerySlider) {
    gallerySlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    gallerySlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlideIndex++;
            if (currentSlideIndex > document.getElementsByClassName('gallery-item').length) {
                currentSlideIndex = 1;
            }
            showSlides(currentSlideIndex);
        }, 3000);
    });
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Toggle Envelope Details
function toggleEnvelope() {
    const envelopeDetails = document.getElementById('envelope-details');
    envelopeDetails.classList.toggle('hidden');
}

// Copy Account Number
function copyAccount() {
    const accountNumber = '0901407915';
    const accountName = 'ISNA REFINA RAHMAWATI';
    const textToCopy = `${accountNumber}\n${accountName}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('Nomor rekening berhasil disalin!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Nomor rekening berhasil disalin!');
    });
}

// Copy Address
function copyAddress() {
    const address = 'Isna Refina, 085792788020\nDsn Kendalrejo RT 3 RW 9 Kecamatan Talun - Blitar';
    
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Alamat berhasil disalin!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Alamat berhasil disalin!');
    });
}

// Show Notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// RSVP Form Submission
function submitRSVP(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = form.querySelector('input[type="text"]').value;
    const attendance = form.querySelector('select').value;
    const guestCount = form.querySelector('input[type="number"]').value;
    
    // Here you would typically send this data to a server
    // For now, we'll just show a success message
    console.log('RSVP Submitted:', { name, attendance, guestCount });
    
    showNotification('Terima kasih! Konfirmasi kehadiran Anda telah diterima.');
    form.reset();
}

// Ucapan Form Submission
function submitUcapan(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const message = form.querySelector('textarea').value;
    
    // Add message to the list
    const ucapanList = document.getElementById('ucapan-list');
    const newUcapan = document.createElement('div');
    newUcapan.className = 'ucapan-item';
    newUcapan.innerHTML = `
        <h4>${name}</h4>
        <p>${message}</p>
    `;
    
    // Insert at the beginning
    ucapanList.insertBefore(newUcapan, ucapanList.firstChild);
    
    // Here you would typically send this data to a server
    console.log('Ucapan Submitted:', { name, message });
    
    showNotification('Terima kasih! Ucapan Anda telah dikirim.');
    form.reset();
}

// Open Map
function openMap() {
    // Replace with actual location coordinates
    const latitude = -7.8239;
    const longitude = 112.0119;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Save the Date button
document.querySelector('.save-date-btn')?.addEventListener('click', () => {
    showNotification('Tanggal telah disimpan ke kalender!');
});

