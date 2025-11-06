import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'aos/dist/aos.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [ucapanList, setUcapanList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const [currentUcapanIndex, setCurrentUcapanIndex] = useState(0);
  const [ucapanDisplayCount] = useState(3); // Tampilkan 3 ucapan sekaligus
  const [isUcapanPaused, setIsUcapanPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasTriedAutoplayRef = useRef(false);

  const totalSlides = 8;
  const photoFiles = [
    'photo-1.jpg',
    'photo-2.jpg',
    'photo-3.jpg',
    'photo-4.JPG', // case-sensitive on Linux/Vercel
    'photo-5.jpg',
    'photo-6.JPG', // case-sensitive on Linux/Vercel
    'photo-7.jpg',
    'photo-8.jpg',
  ];

  // Fetch ucapan on mount
  useEffect(() => {
    fetchUcapan();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return;
    }

    let interval = null;
    let timeoutId = null;

    const targetDate = new Date('2025-12-14T00:00:00').getTime();
    
    const updateCountdown = () => {
      try {
        // Always get fresh references to elements on each interval call
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // If any element is missing, stop the interval
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          return;
        }

        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // Update with null checks
          if (daysEl && daysEl.textContent !== undefined) {
            daysEl.textContent = days < 10 ? `0${days}` : days.toString();
          }
          if (hoursEl && hoursEl.textContent !== undefined) {
            hoursEl.textContent = hours < 10 ? `0${hours}` : hours.toString();
          }
          if (minutesEl && minutesEl.textContent !== undefined) {
            minutesEl.textContent = minutes < 10 ? `0${minutes}` : minutes.toString();
          }
          if (secondsEl && secondsEl.textContent !== undefined) {
            secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds.toString();
          }
        } else {
          // Countdown finished
          if (daysEl) daysEl.textContent = '00';
          if (hoursEl) hoursEl.textContent = '00';
          if (minutesEl) minutesEl.textContent = '00';
          if (secondsEl) secondsEl.textContent = '00';
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      } catch (error) {
        // Silently handle errors to prevent console spam
        console.warn('Countdown timer error:', error);
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    // Wait for DOM to be ready, then start countdown
    timeoutId = setTimeout(() => {
      updateCountdown(); // Initial call
      if (!interval) {
        interval = setInterval(updateCountdown, 1000);
      }
    }, 200);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen]);

  // Initialize AOS (Animate On Scroll) - only for main content, not opening
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      // Delay AOS init to ensure images load first
      setTimeout(() => {
        const AOS = require('aos');
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: 100,
          disable: false,
        });
        AOS.refresh();
      }, 500);
    }
  }, [isOpen]);

  // Active nav on scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      try {
        if (typeof window === 'undefined' || !document) {
          return;
        }

        const sections = ['home', 'mempelai', 'acara', 'galeri', 'lokasi', 'ucapan'];
        const scrollPosition = window.scrollY + 150;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && section.offsetTop && section.offsetTop <= scrollPosition) {
            setActiveNav(sections[i]);
            break;
          }
        }
      } catch (error) {
        // Silently handle scroll errors
        console.warn('Scroll handler error:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Auto slide gallery
  useEffect(() => {
    if (!isOpen || isGalleryPaused || typeof window === 'undefined' || !document) return;

    let gallerySection;
    try {
      gallerySection = document.getElementById('galeri');
      if (!gallerySection) return;
    } catch (error) {
      console.warn('Gallery section error:', error);
      return;
    }

    const isGalleryVisible = () => {
      try {
        if (!gallerySection || !gallerySection.getBoundingClientRect) return false;
        const rect = gallerySection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      } catch (error) {
        return false;
      }
    };

    const autoSlideInterval = setInterval(() => {
      if (isGalleryVisible() && !isGalleryPaused) {
        setCurrentGalleryIndex((prev) => (prev < 7 ? prev + 1 : 0));
      }
    }, 3000); // Change every 3 seconds

    return () => clearInterval(autoSlideInterval);
  }, [isOpen, isGalleryPaused]);

  // Auto rotate ucapan
  useEffect(() => {
    if (!isOpen || ucapanList.length <= ucapanDisplayCount || isUcapanPaused) return;

    const rotateInterval = setInterval(() => {
      setIsTransitioning(true);
      
      // Fade out animation
      setTimeout(() => {
        setCurrentUcapanIndex((prev) => {
          // Calculate max index untuk scroll
          const maxIndex = Math.max(0, ucapanList.length - ucapanDisplayCount);
          return prev >= maxIndex ? 0 : prev + 1;
        });
        
        // Fade in animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 300); // Wait for fade out
    }, 4000); // Berganti setiap 4 detik

    return () => clearInterval(rotateInterval);
  }, [isOpen, ucapanList.length, ucapanDisplayCount, isUcapanPaused]);


  const fetchUcapan = async () => {
    try {
      const res = await fetch('/api/ucapan');
      const data = await res.json();
      if (data.ucapan && data.ucapan.length > 0) {
        const normalized = data.ucapan.map((item) => {
          const raw = (item.attendance || '').toString().trim().toLowerCase();
          let attendance = raw;
          if (raw === 'berkenan hadir' || raw === 'hadir' || raw === 'hadir.') attendance = 'hadir';
          if (raw === 'maaf tidak bisa hadir' || raw === 'tidak' || raw === 'tidak hadir') attendance = 'tidak';
          return { ...item, attendance };
        });
        setUcapanList(normalized);
      } else {
        // Default ucapan
        setUcapanList([
          {
            id: 'default',
            name: 'zlfikri',
            message: 'May your marriage be filled with trust, respect, and love, but above all else, may it be filled with abundant joy. Congratulation!🕊️',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching ucapan:', error);
    }
  };

  const openInvitation = () => {
    // Start closing animation
    setIsClosing(true);
    
    // Show navbar and main content immediately (no delay)
    setIsOpen(true);
    
    // After animation completes, reset closing state
    setTimeout(() => {
      setIsClosing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800); // Match animation duration

    // Try autoplay music on this user gesture
    setTimeout(() => {
      if (!hasTriedAutoplayRef.current && audioRef.current) {
        hasTriedAutoplayRef.current = true;
        try {
          audioRef.current.volume = 0.6;
          const p = audioRef.current.play();
          if (p && typeof p.then === 'function') {
            p.then(() => setIsMusicPlaying(true)).catch(() => {});
          } else {
            setIsMusicPlaying(true);
          }
        } catch (_) {}
      }
    }, 100);
  };


  const copyAccount = () => {
    const text = '0901407915\nISNA REFIANA';
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Nomor rekening berhasil disalin!');
    });
  };

  const copyAddress = () => {
    const address = 'Isna Refina, 085792788020\nDsn Kendalrejo RT 3 RW 9 Kecamatan Talun - Blitar';
    navigator.clipboard.writeText(address).then(() => {
      showNotification('Alamat berhasil disalin!');
    });
  };

  const openMap = () => {
    // Google Maps link from user
    window.open('https://maps.app.goo.gl/zmHsNzr6Fg3qxo4A6', '_blank');
  };

  const showNotification = (message, type = 'success') => {
    try {
      if (typeof window === 'undefined' || !document || !document.body) {
        return;
      }

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // Icon based on type
      let icon = '';
      if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
      } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
      } else {
        icon = '<i class="fas fa-info-circle"></i>';
      }
      
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">${icon}</div>
          <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      if (document.body) {
        document.body.appendChild(notification);
      }
      
      // Close button functionality
      const closeBtn = notification.querySelector('.notification-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          notification.style.animation = 'slideOutRight 0.3s ease';
          setTimeout(() => {
            if (notification && notification.parentElement) {
              notification.remove();
            }
          }, 300);
        });
      }
      
      // Auto close after 4 seconds
      setTimeout(() => {
        try {
          if (notification && notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
              if (notification && notification.parentElement) {
                notification.remove();
              }
            }, 300);
          }
        } catch (error) {
          // Silently handle cleanup errors
        }
      }, 4000);
    } catch (error) {
      // Silently handle notification errors to prevent console spam
      console.warn('Notification error:', error);
    }
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      attendance: formData.get('attendance'),
      guestCount: formData.get('guestCount'),
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        showNotification('Terima kasih! Konfirmasi kehadiran Anda telah diterima.');
        e.target.reset();
      } else {
        showNotification(result.error || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUcapan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      relationship: formData.get('relationship'),
      attendance: formData.get('attendance'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/ucapan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        showNotification('Terima kasih! Ucapan Anda telah dikirim.', 'success');
        e.target.reset();
        
        // Add new ucapan to list with animation
        const newUcapan = {
          ...result.data,
          id: result.data?.id || Date.now().toString(),
          isNew: true, // Flag for animation
        };
        
        // Remove default ucapan if it exists and add new one
        const filteredList = ucapanList.filter(ucapan => ucapan.id !== 'default');
        setUcapanList([newUcapan, ...filteredList]);
        
        // Reset to first position to show new ucapan
        setCurrentUcapanIndex(0);
        
        // Scroll to new ucapan after a short delay
        setTimeout(() => {
          const firstUcapan = document.querySelector('.ucapan-item.new-ucapan');
          if (firstUcapan) {
            firstUcapan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
        
        // Remove isNew flag after animation
        setTimeout(() => {
          setUcapanList(prevList => 
            prevList.map(item => 
              item.id === newUcapan.id ? { ...item, isNew: false } : item
            )
          );
        }, 1000);
      } else {
        const errorMessage = result.error || result.message || 'Terjadi kesalahan. Silakan coba lagi.';
        console.error('Ucapan API error:', result);
        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error submitting ucapan:', error);
      showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle music play/pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
        showNotification('Musik dihentikan', 'info');
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          showNotification('Gagal memutar musik. Pastikan browser mengizinkan autoplay.', 'error');
        });
        setIsMusicPlaying(true);
        showNotification('Musik dimainkan', 'success');
      }
    }
  };

  const smoothScroll = (e, targetId) => {
    e.preventDefault();
    setActiveNav(targetId); // Set active immediately on click
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        if (typeof window === 'undefined' || !document) return;
        
        const target = document.getElementById(targetId);
        if (target && target.getBoundingClientRect) {
          // Get the element's position relative to the document
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset;
          
          // For mempelai section, use smaller offset to avoid white gap
        const offset = targetId === 'mempelai' ? 0 : 80;
        const targetPosition = offsetPosition - offset;
        
        // Smooth scroll with animation - use longer duration
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000; // 1 second
        let start = null;
        
        function easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        function animation(currentTime) {
          try {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            if (window && window.scrollTo) {
              window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
            }
            
            if (progress < 1) {
              if (window.requestAnimationFrame) {
                requestAnimationFrame(animation);
              }
            }
          } catch (error) {
            // Silently handle animation errors
          }
        }
        
        if (window.requestAnimationFrame) {
          requestAnimationFrame(animation);
        }
      }
    } catch (error) {
      // Silently handle smooth scroll errors
      console.warn('Smooth scroll error:', error);
    }
    }, 50);
  };

  const saveToCalendar = () => {
    // Event details
    const eventTitle = 'Pernikahan Isna & Surya';
    const eventDate = '20251214'; // Format: YYYYMMDD
    const eventStartTime = '100000'; // 10:00 AM (format: HHMMSS)
    const eventEndTime = '140000'; // 2:00 PM (format: HHMMSS)
    const eventLocation = 'Venue Pernikahan'; // Ganti dengan lokasi sebenarnya
    const eventDetails = 'Undangan Pernikahan Isna & Surya\n\nTanpa mengurangi rasa hormat, kami mengundang anda untuk hadir di acara pernikahan kami.';

    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
    const startDateTime = `${eventDate}T${eventStartTime}`;
    const endDateTime = `${eventDate}T${eventEndTime}`;

    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}`;

    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
    
    // Show notification
    showNotification('Google Calendar dibuka! Silakan simpan ke kalender Anda.');
  };

  // Attempt autoplay on initial load (muted), then unmute on first user interaction
  useEffect(() => {
    if (!audioRef.current) return;
    if (hasTriedAutoplayRef.current) return;
    hasTriedAutoplayRef.current = true;

    try {
      audioRef.current.muted = true;
      audioRef.current.volume = 0;
      const p = audioRef.current.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setIsMusicPlaying(true)).catch(() => {});
      } else {
        setIsMusicPlaying(true);
      }
    } catch (_) {}

    const unlock = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = false;
      const target = 0.6;
      const step = 0.06;
      const interval = setInterval(() => {
        if (!audioRef.current) return clearInterval(interval);
        let v = (audioRef.current.volume || 0) + step;
        if (v >= target) {
          v = target;
          clearInterval(interval);
        }
        audioRef.current.volume = v;
      }, 80);

      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }, []);

  return (
    <>
      <Head suppressHydrationWarning>
        <title>Undangan Pernikahan - Isna & Surya</title>
        <meta name="description" content="Undangan Pernikahan Isna & Surya" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        {/* Preload critical images to speed up first paint */}
        <link rel="preload" as="image" href="/images/gambar-home-new.jpg" />
        <link rel="preload" as="image" href="/images/halaman-pertama.jpg" />
      </Head>

      {/* Global audio element (rendered selalu agar bisa autoplay muted) */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/audio/wedding-music.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-music.ogg" type="audio/ogg" />
        Browser Anda tidak mendukung audio.
      </audio>

      {/* Opening Invitation */}
      {!isOpen && (
        <section className={`opening-section ${isClosing ? 'closing' : ''}`}>
          <div className="opening-image-background">
            <img 
              src="/images/halaman-pertama.jpg" 
              alt="Isna & Surya" 
              className="opening-couple-image"
              loading="eager"
              decoding="sync"
              fetchpriority="high"
              onError={(e) => {
                if (e.target && e.target.parentElement) {
                  console.error('Error loading image:', e.target.src);
                  // Show error message instead of hiding
                  e.target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.textContent = 'Gambar tidak ditemukan';
                  errorDiv.style.cssText = 'color: white; text-align: center; padding: 2rem;';
                  e.target.parentElement.appendChild(errorDiv);
                }
              }}
              onLoad={(e) => {
                console.log('Image loaded successfully');
                e.target.style.opacity = '1';
                e.target.style.imageRendering = 'auto';
              }}
            />
            <div className="opening-overlay"></div>
          </div>
          <div className="opening-content">
            <div className="opening-text-container">
              <p className="opening-label">Undangan</p>
              <h1 className="couple-names">Isna & Surya</h1>
              <button className="open-btn" onClick={openInvitation}>
                <i className="fas fa-envelope"></i>
                <span>Buka Undangan</span>
              </button>
              <p className="opening-greeting">Kepada Yth. Bpk/Ibu/Saudara/i</p>
              <p className="invitation-text">
                Tanpa mengurangi rasa hormat, kami mengundang anda untuk hadir di acara pernikahan kami.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Navigation - Always visible when isOpen */}
      {isOpen && (
        <nav className="bottom-navbar">
          <a href="#home" className={`nav-item ${activeNav === 'home' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'home')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-home nav-icon-main"></i>
              <i className="fas fa-heart nav-icon-heart"></i>
            </div>
            <span className="nav-label">Home</span>
          </a>
          <a href="#mempelai" className={`nav-item ${activeNav === 'mempelai' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'mempelai')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-user-friends nav-icon-main"></i>
              <i className="fas fa-heart nav-icon-heart"></i>
            </div>
            <span className="nav-label">Mempelai</span>
          </a>
          <a href="#acara" className={`nav-item ${activeNav === 'acara' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'acara')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-calendar nav-icon-main"></i>
              <i className="fas fa-heart nav-icon-heart"></i>
            </div>
            <span className="nav-label">Acara</span>
          </a>
          <a href="#galeri" className={`nav-item ${activeNav === 'galeri' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'galeri')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-images nav-icon-main"></i>
            </div>
            <span className="nav-label">Galeri</span>
          </a>
          <a href="#lokasi" className={`nav-item ${activeNav === 'lokasi' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'lokasi')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-map-marker-alt nav-icon-main"></i>
            </div>
            <span className="nav-label">Lokasi</span>
          </a>
          <a href="#ucapan" className={`nav-item ${activeNav === 'ucapan' ? 'active' : ''}`} onClick={(e) => smoothScroll(e, 'ucapan')}>
            <div className="nav-icon-wrapper">
              <i className="fas fa-comment nav-icon-main"></i>
              <i className="fas fa-heart nav-icon-heart"></i>
            </div>
            <span className="nav-label">Ucapan</span>
          </a>
        </nav>
      )}

      {/* Music Button - Always visible when isOpen */}
      {isOpen && (
        <>
          <audio
            ref={audioRef}
            loop
            preload="auto"
            onPlay={() => setIsMusicPlaying(true)}
            onPause={() => setIsMusicPlaying(false)}
            onEnded={() => setIsMusicPlaying(false)}
          >
            <source src="/audio/wedding-music.mp3" type="audio/mpeg" />
            <source src="/audio/wedding-music.ogg" type="audio/ogg" />
            Browser Anda tidak mendukung audio.
          </audio>
          <button 
            className={`music-btn ${isMusicPlaying ? 'playing' : ''}`} 
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Hentikan musik' : 'Putar musik'}
          >
            <i className="fas fa-music"></i>
          </button>
        </>
      )}

      {/* Main Content */}
      {isOpen && (
        <div className="main-content fade-in">
          {/* Home Section */}
          <section id="home" className="section home-section">
            <div className="home-background-image">
              <img src="/images/bg-1.jpg" alt="Background" className="bg-image" />
              <div className="home-background-overlay"></div>
            </div>
            <div className="home-background-decorations">
              <div className="leaf-decoration leaf-top-left"></div>
              <div className="leaf-decoration leaf-top-right"></div>
              <div className="leaf-decoration leaf-bottom-left"></div>
            </div>
            <div className="container">
              <h2 className="home-section-title">The Wedding</h2>
              <div className="couple-photo-container">
                <div className="couple-photo-circle">
                  <img 
                    src="/images/gambar-home-new.jpg" 
                    alt="Isna & Surya" 
                    className="couple-photo"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitImageRendering: '-webkit-optimize-contrast'
                    }}
                    onLoad={(e) => {
                      const img = e.target;
                      img.style.opacity = '1';
                      img.style.imageRendering = '-webkit-optimize-contrast';
                      img.style.webkitImageRendering = '-webkit-optimize-contrast';
                      // Force repaint to ensure HD rendering
                      img.style.display = 'none';
                      img.offsetHeight; // Trigger reflow
                      img.style.display = '';
                    }}
                  />
                  <div className="photo-leaf-overlay"></div>
                </div>
              </div>
              <h1 className="main-title">Isna & Surya</h1>
              <p className="wedding-date">14.12.2025</p>
              <div className="save-date-container">
                <button className="save-date-btn" onClick={saveToCalendar}>
                  Save The Date
                </button>
              </div>
              <div className="countdown-container">
                <div className="countdown-item">
                  <div className="countdown-circle">
                    <div className="countdown-value" id="days">39</div>
                  </div>
                  <div className="countdown-label">Hari</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-circle">
                    <div className="countdown-value" id="hours">12</div>
                  </div>
                  <div className="countdown-label">Jam</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-circle">
                    <div className="countdown-value" id="minutes">45</div>
                  </div>
                  <div className="countdown-label">Menit</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-circle">
                    <div className="countdown-value" id="seconds">29</div>
                  </div>
                  <div className="countdown-label">Detik</div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Preview */}
          <section id="galeri-preview" className="section gallery-preview" data-aos="fade-up">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              speed={2000}
              effect="fade"
              fadeEffect={{
                crossFade: true,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet-custom',
              }}
              className="gallery-swiper"
            >
              {[...Array(8)].map((_, i) => (
                <SwiperSlide key={i} className="gallery-slide">
                  <div className="gallery-preview-image">
                        <img 
                          src={`/images/${photoFiles[i]}`}
                      alt={`Photo ${i + 1}`}
                      className="gallery-preview-img"
                      loading="lazy"
                      decoding="async"
                      style={{
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto',
                      }}
                      onLoad={(e) => {
                        e.target.style.imageRendering = 'auto';
                        e.target.style.webkitImageRendering = 'auto';
                      }}
                    />
                    <div className="gallery-preview-overlay">
                      <div className="stripes-overlay"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* Greeting Section */}
          <section className="section greeting-section" data-aos="fade-up">
            <div className="container">
              <h2 className="section-title" data-aos="fade-down">Salam Sejahtera</h2>
              <p className="greeting-text" data-aos="fade-up" data-aos-delay="200">
                Dengan segala kerendahan hati dan dengan ungkapan syukur, kami mengundang Bapak/Ibu/Saudara/i untuk
                menghadiri Resepsi Pernikahan kami.
              </p>
            </div>
          </section>

          {/* Mempelai Section */}
          <section id="mempelai" className="section mempelai-section" data-aos="fade-up">
            <div className="container">
              <h2 className="mempelai-section-title" data-aos="fade-down">Mempelai</h2>
              <p className="mempelai-subtitle" data-aos="fade-down" data-aos-delay="100">Wanita & Pria</p>
              <div className="mempelai-decorative-line" data-aos="fade-down" data-aos-delay="200"></div>
              <div className="mempelai-container">
                <div className="mempelai-photo-container" data-aos="zoom-in" data-aos-delay="200">
                  <div className="mempelai-photo-circle">
                    <img 
                      src="/images/gambar-2.jpg"
                      alt="Mempelai"
                      className="mempelai-photo"
                      loading="eager"
                      decoding="sync"
                      fetchpriority="high"
                      style={{
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto',
                        msImageRendering: 'auto',
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.imageRendering = 'auto';
                        e.target.style.webkitImageRendering = 'auto';
                      }}
                    />
                  </div>
                  <div className="mempelai-photo-leaf"></div>
                </div>
                <div className="mempelai-names-container" data-aos="fade-up" data-aos-delay="300">
                  <div className="mempelai-name-wrapper">
                    <h3 className="mempelai-name">Isna Refiana</h3>
                    <a 
                      href="https://www.instagram.com/isnarefina/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mempelai-ig"
                    >
                      <i className="fab fa-instagram"></i> isnarefina
                    </a>
                  </div>
                  <div className="mempelai-divider">
                    <span>&</span>
                  </div>
                  <div className="mempelai-name-wrapper">
                    <h3 className="mempelai-name">Surya Ariadi</h3>
                    <a 
                      href="https://www.instagram.com/surya_artfreedom/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mempelai-ig"
                    >
                      <i className="fab fa-instagram"></i> surya_artfreedom
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Acara Section */}
          <section id="acara" className="section acara-section" data-aos="fade-up">
            <div className="container">
              <h2 className="section-title" data-aos="fade-down">Hari Spesial</h2>
              <div className="acara-decorative-line" data-aos="fade-down" data-aos-delay="100"></div>
              <div className="events-container">
                <div 
                  className="event-card" 
                  data-aos="flip-left" 
                  data-aos-delay="200"
                  onClick={(e) => smoothScroll(e, 'lokasi')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-content">
                    <h3 className="event-title">AKAD NIKAH</h3>
                    <div className="event-date">
                      <p className="day">Minggu</p>
                      <p className="date-number">14</p>
                      <p className="month-year">Desember 2025</p>
                    </div>
                    <div className="event-time">
                      <i className="fas fa-clock"></i>
                      <span>10.00 WIB - Selesai</span>
                    </div>
                    <div className="event-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Rustic Republik Kediri</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="event-card" 
                  data-aos="flip-right" 
                  data-aos-delay="200"
                  onClick={(e) => smoothScroll(e, 'lokasi')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-content">
                    <h3 className="event-title">RESEPSI PERNIKAHAN</h3>
                    <div className="event-date">
                      <p className="day">Minggu</p>
                      <p className="date-number">14</p>
                      <p className="month-year">Desember 2025</p>
                    </div>
                    <div className="event-time">
                      <i className="fas fa-clock"></i>
                      <span>16.00 WIB - Selesai</span>
                    </div>
                    <div className="event-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Rustic Republik Kediri</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Galeri Section */}
          <section id="galeri" className="section galeri-section">
            <div className="container">
              <div className="galeri-header">
                <h2 className="galeri-title">Galeri</h2>
                <div className="galeri-title-line"></div>
              </div>
              
              <div 
                className="galeri-main-container"
                onMouseEnter={() => setIsGalleryPaused(true)}
                onMouseLeave={() => setIsGalleryPaused(false)}
              >
                <button 
                  className="galeri-nav-btn galeri-nav-prev" 
                  onClick={() => {
                    setIsGalleryPaused(true);
                    setCurrentGalleryIndex((prev) => (prev > 0 ? prev - 1 : 7));
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="galeri-main-image">
              <img 
                src={`/images/${photoFiles[currentGalleryIndex]}`} 
                    alt={`Photo ${currentGalleryIndex + 1}`}
                    className="galeri-main-img"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                    style={{
                      imageRendering: 'auto',
                      WebkitImageRendering: 'auto',
                      msImageRendering: 'auto',
                    }}
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.imageRendering = 'auto';
                      e.target.style.webkitImageRendering = 'auto';
                    }}
                  />
                </div>
                
                <button 
                  className="galeri-nav-btn galeri-nav-next"
                  onClick={() => {
                    setIsGalleryPaused(true);
                    setCurrentGalleryIndex((prev) => (prev < 7 ? prev + 1 : 0));
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div 
                className="galeri-thumbnails"
                onMouseEnter={() => setIsGalleryPaused(true)}
                onMouseLeave={() => setIsGalleryPaused(false)}
              >
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`galeri-thumbnail ${currentGalleryIndex === i ? 'active' : ''}`}
                    onClick={() => {
                      setIsGalleryPaused(true);
                      setCurrentGalleryIndex(i);
                    }}
                  >
                        <img 
                          src={`/images/${photoFiles[i]}`} 
                      alt={`Photo ${i + 1}`}
                      className="galeri-thumbnail-img"
                      loading={i < 4 ? "eager" : "lazy"}
                      decoding="async"
                      style={{
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto',
                      }}
                      onLoad={(e) => {
                        e.target.style.imageRendering = 'auto';
                        e.target.style.webkitImageRendering = 'auto';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Lokasi Section */}
          <section id="lokasi" className="section lokasi-section">
            <div className="container">
              <div className="lokasi-banner">
                <div className="lokasi-banner-content">
                  <h2 className="lokasi-banner-title">Denah Lokasi</h2>
                  <p className="lokasi-banner-subtitle">Resepsi Pernikahan</p>
                </div>
                <div className="lokasi-banner-feather">
                  <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 0 Q45 20 50 40 Q55 60 50 80 Q45 100 50 120 Q55 140 50 160 Q45 180 50 200" 
                          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8"/>
                    <path d="M48 10 Q43 30 48 50 Q53 70 48 90 Q43 110 48 130 Q53 150 48 170" 
                          stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                    <path d="M52 10 Q57 30 52 50 Q47 70 52 90 Q57 110 52 130 Q47 150 52 170" 
                          stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                    <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.9"/>
                  </svg>
                </div>
              </div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15863.123456789!2d112.0119!3d-7.8239!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDknMjYuMCJTIDExMsKwMDAnNDIuOCJF!5e0!3m2!1sid!2sid!4v1234567890!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-iframe"
                  title="Lokasi Resepsi Pernikahan"
                ></iframe>
              </div>
              <button className="map-btn" onClick={openMap}>
                <i className="fas fa-directions"></i>
                Lihat Lokasi
              </button>
              <p className="map-hint">Klik untuk petunjuk arah</p>
            </div>
          </section>

          {/* Digital Envelope Section */}
          <section className="section envelope-section">
            <div className="container">
              <h2 className="section-title">Amplop Digital</h2>
              <p className="envelope-text">Doa Restu Anda merupakan karunia bagi kami.</p>
              <button className="envelope-btn" onClick={() => setShowEnvelope(!showEnvelope)}>
                Tampilkan Amplop Digital
              </button>
              {showEnvelope && (
                <div className="envelope-details">
                  <div className="envelope-section-transfer">
                    <p className="envelope-info">Silahkan bisa transfer melalui rekening berikut:</p>
                    <div className="bank-info">
                      <div className="bank-logo">
                        <img 
                          src="/images/bca-logo.png" 
                          alt="BCA Logo" 
                          className="bca-logo-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="account-info">
                        <p>
                          <strong>0901407915</strong>
                        </p>
                        <p>ISNA REFIANA</p>
                      </div>
                      <button className="copy-btn" onClick={copyAccount}>
                        <i className="fas fa-copy"></i> Salin
                      </button>
                    </div>
                    <p className="envelope-note">Silakan konfirmasi transfer dengan isi form dibawah.</p>
                  </div>
                  
                  <div className="envelope-section-gift">
                    <h3 className="gift-section-title">Hadiah / Kado</h3>
                    <p className="gift-info">Silakan bisa mengirimkan hadiah ke alamat berikut:</p>
                    <div className="gift-address">
                      <p>
                        <strong>Penerima:</strong>
                      </p>
                      <p>Isna Refina, 085792788020</p>
                      <p>Dsn Kendalrejo RT 3 RW 9 Kecamatan Talun - Blitar</p>
                      <button className="copy-btn" onClick={copyAddress}>
                        <i className="fas fa-copy"></i> Salin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* RSVP Section */}
          <section className="section rsvp-section">
            <div className="container">
              <h2 className="section-title">RSVP</h2>
              <p className="rsvp-text">Silakan konfirmasi kehadiran anda kepada kedua mempelai.</p>
              <form className="rsvp-form" onSubmit={handleRSVP}>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Nama" required />
                </div>
                <div className="form-group">
                  <select name="attendance" required>
                    <option value="">Pilih Kehadiran</option>
                    <option value="hadir">Berkenan hadir</option>
                    <option value="tidak">Maaf tidak bisa hadir</option>
                  </select>
                </div>
                <div className="form-group">
                  <input type="number" name="guestCount" placeholder="Jumlah Tamu" min="1" required />
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Konfirm'}
                </button>
              </form>
            </div>
          </section>

          {/* Ucapan Section */}
          <section id="ucapan" className="section ucapan-section">
            <div className="container">
              <h2 className="section-title">Ucapan Selamat</h2>
              <p className="ucapan-text">Silakan memberikan ucapan selamat kepada kedua mempelai.</p>
              <form className="ucapan-form" onSubmit={handleUcapan}>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Nama" required />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="relationship" 
                    placeholder="Hubungan, contoh: Teman / Bestie" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <select name="attendance" required>
                    <option value="">- Konfirmasi Kehadiran -</option>
                    <option value="hadir">Berkenan hadir</option>
                    <option value="tidak">Maaf tidak bisa hadir</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder="Tuliskan ucapan selamat..." rows="4" required></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </form>
              <div 
                className="ucapan-list"
                onMouseEnter={() => setIsUcapanPaused(true)}
                onMouseLeave={() => setIsUcapanPaused(false)}
              >
                {/* Navigation arrows */}
                {ucapanList.length > ucapanDisplayCount && (
                  <>
                    <button
                      className="ucapan-nav-btn ucapan-nav-prev"
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentUcapanIndex((prev) => {
                            const maxIndex = Math.max(0, ucapanList.length - ucapanDisplayCount);
                            return prev <= 0 ? maxIndex : prev - 1;
                          });
                          setTimeout(() => setIsTransitioning(false), 100);
                        }, 300);
                      }}
                      aria-label="Previous ucapan"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      className="ucapan-nav-btn ucapan-nav-next"
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentUcapanIndex((prev) => {
                            const maxIndex = Math.max(0, ucapanList.length - ucapanDisplayCount);
                            return prev >= maxIndex ? 0 : prev + 1;
                          });
                          setTimeout(() => setIsTransitioning(false), 100);
                        }, 300);
                      }}
                      aria-label="Next ucapan"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}
                
                {/* Pagination indicator */}
                {ucapanList.length > ucapanDisplayCount && (
                  <div className="ucapan-pagination">
                    {Array.from({ length: Math.ceil(ucapanList.length / ucapanDisplayCount) }).map((_, pageIndex) => {
                      const startIndex = pageIndex * ucapanDisplayCount;
                      const isActive = currentUcapanIndex >= startIndex && 
                                     currentUcapanIndex < startIndex + ucapanDisplayCount;
                      return (
                        <button
                          key={pageIndex}
                          className={`ucapan-pagination-dot ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            if (!isActive) {
                              setIsTransitioning(true);
                              setTimeout(() => {
                                setCurrentUcapanIndex(startIndex);
                                setTimeout(() => setIsTransitioning(false), 100);
                              }, 300);
                            }
                          }}
                          aria-label={`Go to page ${pageIndex + 1}`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Ucapan items container */}
                <div className={`ucapan-items-container ${isTransitioning ? 'transitioning' : ''}`}>
                  {ucapanList
                    .slice(currentUcapanIndex, currentUcapanIndex + ucapanDisplayCount)
                    .map((ucapan, displayIndex) => {
                      const actualIndex = currentUcapanIndex + displayIndex;
                      return (
                        <div 
                          key={`${ucapan.id}-${currentUcapanIndex}`} 
                          className={`ucapan-item ${ucapan.isNew ? 'new-ucapan' : ''} ucapan-slide-in`}
                          style={{ animationDelay: `${displayIndex * 0.15}s` }}
                        >
                          <div className="ucapan-header">
                            <h4>{ucapan.name}</h4>
                            {ucapan.relationship && (
                              <span className="ucapan-relationship">{ucapan.relationship}</span>
                            )}
                          </div>
                          {ucapan.attendance && (
                            <div className={`ucapan-attendance attendance-${ucapan.attendance}`}>
                              <i className={`fas ${ucapan.attendance === 'hadir' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                              <span>{ucapan.attendance === 'hadir' ? 'Berkenan hadir' : 'Maaf tidak bisa hadir'}</span>
                            </div>
                          )}
                          <p>{ucapan.message}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="section quote-section">
            <div className="container">
              <p className="quote-text">
                "Kita adalah "ketersalingan". Saling mengisi kekosongan, saling melengkapi, saling membersamai, dan
                saling berdamai dengan segala kelebihan dan kekurangan yang kita miliki"
              </p>
              <p className="quote-note">Atas kehadiran dan doa restunya kami ucapkan terima kasih.</p>
              <div className="quote-photo-container">
                <div className="quote-photo-circle">
                  <img 
                    src="/images/gambar-home-new.jpg" 
                    alt="Isna & Surya" 
                    className="quote-photo"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                    onError={(e) => {
                      if (e.target && e.target.parentElement) {
                        console.error('Error loading quote photo:', e.target.src);
                        e.target.style.display = 'none';
                      }
                    }}
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  />
                </div>
                <div className="quote-feather-decoration">
                  <div className="feather-left"></div>
                  <div className="feather-right"></div>
                </div>
              </div>
              <h3 className="quote-signature">Isna & Surya</h3>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            {/* <p>Designed with ❤ by zlfkri.</p> */}
            <p>Developed by zlfkri © 2025</p>
          </footer>
        </div>
      )}
    </>
  );
}

