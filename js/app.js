/**
 * FRCC STAYS - Shared Utilities
 * Currency formatting, date helpers, gallery/lightbox, toasts, header/footer rendering.
 */

const Utils = {
  /** Format number as Indian Rupee with lakh comma format */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  /** Format date as "DD MMM YYYY" */
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /** Format date as "DD MMM YYYY, hh:mm AM/PM" */
  formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /** Get today's date as YYYY-MM-DD */
  getToday() {
    return new Date().toISOString().split('T')[0];
  },

  /** Add days to a date, return YYYY-MM-DD */
  addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  },

  /** Calculate nights between two dates */
  nights(checkIn, checkOut) {
    return Bookings.calculateNights(checkIn, checkOut);
  },

  /** Calculate price breakdown with GST (rate from CONFIG). */
  priceBreakdown(pricePerNight, nights) {
    const base = pricePerNight * nights;
    const rate = (typeof CONFIG !== 'undefined' && CONFIG.GST_RATE) || 0.18;
    const gst = Math.round(base * rate);
    return { base, gst, total: base + gst };
  },

  /** Get amenity display name */
  amenityLabel(key) {
    const labels = {
      'pool': 'Swimming Pool',
      'spa': 'Spa',
      'gym': 'Fitness Center',
      'fine-dining': 'Fine Dining',
      'bar': 'Bar',
      'free-wifi': 'Free Wi-Fi',
      'airport-transfer': 'Airport Transfer',
      'parking': 'Free Parking',
      'banquet': 'Banquet Hall',
      'kids-zone': 'Kids Zone'
    };
    return labels[key] || key;
  },

  /** Get amenity SVG icon */
  amenityIcon(key) {
    const icons = {
      'pool': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1"/><path d="M2 16c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1"/><path d="M12 4v10"/><path d="M8 8l4-4 4 4"/></svg>',
      'spa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 8 5 12 5 16a7 7 0 0 0 14 0c0-4-3-8-7-14z"/></svg>',
      'gym': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11v11h-11z"/><path d="M4 9v6M20 9v6M2 10v4M22 10v4"/></svg>',
      'fine-dining': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
      'bar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M19 3H5v7a7 7 0 0 0 14 0V3z"/></svg>',
      'free-wifi': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 9.5a15 15 0 0 1 20 0"/><circle cx="12" cy="20" r="1"/></svg>',
      'airport-transfer': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
      'parking': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
      'banquet': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      'kids-zone': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
    };
    return icons[key] || '';
  },

  /** Show toast notification */
  toast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /** Elegant gradient placeholder used ONLY as an onerror safety net (never to fill gaps). */
  gradient(label) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#0B1F3A"/><stop offset="1" stop-color="#1a3a5c"/></linearGradient></defs>' +
      '<rect width="1200" height="800" fill="url(#g)"/>' +
      '<text x="50%" y="50%" fill="#C9A24B" font-family="Georgia" font-size="26" text-anchor="middle" dominant-baseline="middle">' +
      String(label || 'FRCC STAYS').replace(/[<>]/g, '') + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  },

  /** Hotel's DISTINCT gallery (unique URLs from the image library). */
  getHotelImages(hotel) {
    const gallery = (typeof getHotelGallery === 'function') ? getHotelGallery(hotel.id) : [];
    if (!gallery.length) return [{ url: this.gradient(hotel.name), alt: hotel.name + ' (image unavailable)' }];
    const alts = (typeof getHotelGalleryAlts === 'function') ? getHotelGalleryAlts(hotel.id) : [];
    return gallery.map((url, i) => ({
      url,
      alt: alts[i] || `${hotel.name} - ${hotel.images[i] || 'view'}`
    }));
  },

  /** Room's DISTINCT gallery (unique URLs, different from the hotel gallery). */
  getRoomImages(room, hotelName) {
    const gallery = (typeof getRoomGallery === 'function') ? getRoomGallery(room.id) : [];
    if (!gallery.length) return [{ url: this.gradient(room.name), alt: `${room.name} (image unavailable)` }];
    const alts = (typeof getRoomGalleryAlts === 'function') ? getRoomGalleryAlts(room.id) : [];
    return gallery.map((url, i) => ({
      url,
      alt: alts[i] || `${room.name} at ${hotelName || ''} - ${room.images[i] || 'view'}`
    }));
  }
};

/**
 * Render the shared header
 */
function renderHeader(activePage) {
  const user = Auth.getCurrentUser();
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="logo">
        <img src="/images/brand/frcc-emblem.png" alt="FRCC - Film Recreation & Cultural Centre" width="64" height="64" style="flex-shrink:0;" />
        FRCC <span>STAYS</span>
      </a>
      <ul class="nav-links">
        <li><a href="hotels.html" class="${activePage === 'hotels' ? 'active' : ''}">Hotel Booking</a></li>
        <li><a href="my-bookings.html" class="${activePage === 'bookings' ? 'active' : ''}">My Bookings</a></li>
      </ul>
      <div class="nav-user">
        ${user ? `
          <span class="nav-username">${user.name}</span>
          <div class="nav-avatar">${Auth.getInitials(user.name)}</div>
          <button class="btn btn-ghost btn-sm" onclick="Auth.logout(); window.location.href='index.html';">Logout</button>
        ` : `
          <a href="signin.html" class="btn btn-outline btn-sm">Sign In</a>
        `}
      </div>
    </div>
  `;
  document.body.prepend(header);
}

/**
 * Render the shared footer
 */
function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/images/brand/frcc-emblem.png" alt="FRCC - Film Recreation & Cultural Centre" width="72" height="72" style="flex-shrink:0;" />
            FRCC <span>STAYS</span>
          </div>
          <p>Experience Luxury Across Telangana & Andhra Pradesh</p>
        </div>
        <div class="footer-links">
          <div class="footer-links-column">
            <h4>Explore</h4>
            <a href="hotels.html">Hotel Booking</a>
            <a href="my-bookings.html">My Bookings</a>
          </div>
          <div class="footer-links-column">
            <h4>Areas</h4>
            <a href="hotels.html?area=Hyderabad">Hyderabad</a>
            <a href="hotels.html?area=Vijayawada">Vijayawada</a>
            <a href="hotels.html?area=Amaravathi">Amaravathi</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} FRCC STAYS. All rights reserved. Demo project.
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

/**
 * Render step indicator
 * steps: [{label, completed, active}]
 */
function renderStepIndicator(containerId, steps) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="step-indicator">
      ${steps.map((step, i) => `
        <div class="step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}">
          <div class="step-number">${step.completed ? '&#10003;' : i + 1}</div>
          <span>${step.label}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="step-line ${step.completed ? 'completed' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `;
}

/**
 * Image gallery with thumbnails and lightbox
 */
class Gallery {
  constructor(images, containerId, options = {}) {
    this.images = images;
    this.currentIndex = 0;
    this.container = document.getElementById(containerId);
    this.options = options;
    this.render();
  }

  render() {
    if (!this.container || !this.images.length) return;

    const mainImg = this.images[0];
    this.container.innerHTML = `
      <div class="detail-gallery">
        <div class="detail-gallery-main" onclick="this.closest('.gallery-wrapper').__gallery.openLightbox()">
          <img src="${mainImg.url}" alt="${mainImg.alt}" onerror="this.src='${this.fallbackUrl()}'">
        </div>
        <div class="detail-gallery-thumbs">
          ${this.images.slice(0, 5).map((img, i) => `
            <div class="detail-gallery-thumb" onclick="this.closest('.gallery-wrapper').__gallery.showImage(${i}); this.closest('.gallery-wrapper').__gallery.openLightbox()">
              <img src="${img.url}" alt="${img.alt}" loading="lazy" onerror="this.src='${this.fallbackUrl()}'">
            </div>
          `).join('')}
        </div>
      </div>
    `;
    this.container.__gallery = this;
  }

  showImage(index) {
    this.currentIndex = index;
    const mainImg = this.container.querySelector('.detail-gallery-main img');
    if (mainImg && this.images[index]) {
      mainImg.src = this.images[index].url;
      mainImg.alt = this.images[index].alt;
    }
  }

  openLightbox() {
    Lightbox.open(this.images, this.currentIndex);
  }

  fallbackUrl() {
    const name = this.options.name || 'Hotel';
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="#0B1F3A" width="800" height="600"/><text x="50%" y="50%" fill="#C9A24B" font-family="Georgia" font-size="24" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>`)}`;
  }
}

/**
 * Full-screen lightbox with keyboard support
 */
const Lightbox = {
  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox active';
    overlay.id = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="Lightbox.close()">&times;</button>
        <img id="lightbox-img" src="${images[startIndex].url}" alt="${images[startIndex].alt}" onerror="this.src='data:image/svg+xml,${encodeURIComponent('<svg xmlns=http://www.w3.org/2000/svg width=800 height=600><rect fill=#0B1F3A width=800 height=600/><text x=50% y=50% fill=#C9A24B font-family=Georgia font-size=24 text-anchor=middle>Image Unavailable</text></svg>')}'">
        <button class="lightbox-nav lightbox-prev" onclick="Lightbox.prev()">&#8249;</button>
        <button class="lightbox-nav lightbox-next" onclick="Lightbox.next()">&#8250;</button>
        <div class="lightbox-counter">${startIndex + 1} / ${images.length}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Keyboard support
    this._onKeydown = (e) => {
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    };
    document.addEventListener('keydown', this._onKeydown);

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
  },

  close() {
    const overlay = document.getElementById('lightbox-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKeydown);
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  },

  updateImage() {
    const img = document.getElementById('lightbox-img');
    const counter = document.querySelector('.lightbox-counter');
    if (img && this.images[this.currentIndex]) {
      img.src = this.images[this.currentIndex].url;
      img.alt = this.images[this.currentIndex].alt;
    }
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }
};
