/**
 * FRCC STAYS - Bookings Module
 * Handles booking creation, availability, cancellation logic.
 * All data stored in localStorage.
 */

const Bookings = {
  BOOKINGS_KEY: 'frcc_bookings',

  /**
   * Get all bookings from localStorage
   */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || [];
    } catch {
      return [];
    }
  },

  /**
   * Save bookings array to localStorage
   */
  save(bookings) {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
  },

  /**
   * Get bookings for a specific user
   */
  getByUser(userId) {
    return this.getAll().filter(b => b.userId === userId);
  },

  /**
   * Get a single booking by ID
   */
  getById(bookingId) {
    return this.getAll().find(b => b.id === bookingId);
  },

  /**
   * Generate unique booking ID: FRCC-YYYYMMDD-XXXX
   */
  generateBookingId() {
    const now = new Date();
    const dateStr = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `FRCC-${dateStr}-${random}`;
  },

  /**
   * Generate cancellation ID: CAN-YYYYMMDD-XXXX (date = cancellation date, IST).
   */
  generateCancellationId() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const dateStr = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CAN-${dateStr}-${random}`;
  },

  /**
   * Calculate number of nights between check-in and check-out
   */
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  /**
   * Check if two date ranges overlap
   */
  datesOverlap(start1, end1, start2, end2) {
    return new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2);
  },

  /**
   * Get available room count for a hotel/room within date range
   * Accounts for existing bookings with overlapping dates
   */
  getAvailability(hotelId, roomId, checkIn, checkOut, totalRooms) {
    const bookings = this.getAll();
    let bookedCount = 0;

    for (const booking of bookings) {
      if (
        booking.hotelId === hotelId &&
        booking.roomId === roomId &&
        booking.status !== 'cancelled' &&
        this.datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
      ) {
        bookedCount += booking.rooms || 1;
      }
    }

    return Math.max(0, totalRooms - bookedCount);
  },

  /**
   * Create a new booking
   */
  create(bookingData) {
    const bookings = this.getAll();
    const booking = {
      id: this.generateBookingId(),
      cancellationId: null,
      status: bookingData.paymentMethod === 'pay-at-venue' ? 'confirmed' : 'confirmed',
      paymentStatus: bookingData.paymentMethod === 'pay-at-venue' ? 'pay-at-venue' : 'paid',
      createdAt: new Date().toISOString(),
      cancelledAt: null,
      refundInfo: null,
      ...bookingData
    };

    bookings.unshift(booking);
    this.save(bookings);
    return booking;
  },

  /**
   * Cancel a booking with reason.
   * opts: { userId } — when provided, only the owner can cancel.
   * Re-checks the 48h window (single source: getCancellationStatus).
   */
  cancel(bookingId, reason, opts) {
    opts = opts || {};
    const bookings = this.getAll();
    const index = bookings.findIndex(b => b.id === bookingId);

    if (index === -1) {
      return { success: false, error: 'Booking not found' };
    }

    const booking = bookings[index];

    if (booking.status === 'cancelled') {
      return { success: false, error: 'This booking has already been cancelled.' };
    }
    if (booking.status === 'completed') {
      return { success: false, error: 'This stay is already completed and can no longer be cancelled.' };
    }
    if (opts.userId && booking.userId && booking.userId !== opts.userId) {
      return { success: false, error: 'You can only cancel your own bookings.' };
    }

    // Single source of truth — re-checked at confirm time.
    const st = getCancellationStatus(booking, opts.userId || null);
    if (!st.allowed) {
      return { success: false, error: st.reason === 'not-yours' ? st.reasonText : Cancellation.blockedText };
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    booking.cancellationId = this.generateCancellationId();
    booking.cancellationReason = reason;

    // Refund info (simulated, demo mode)
    if (booking.paymentMethod === 'pay-at-venue') {
      booking.refundInfo = {
        message: 'No payment was made, so there is nothing to refund.',
        amount: 0,
        method: 'pay-at-venue',
        status: 'none',
        date: booking.cancelledAt
      };
    } else {
      booking.refundInfo = {
        message: Cancellation.refundMessage(booking),
        amount: booking.totalPrice,
        method: booking.paymentMethod,
        status: 'initiated',
        date: booking.cancelledAt
      };
    }
    booking.paymentStatus = booking.paymentMethod === 'pay-at-venue' ? 'pay-at-venue' : 'refunded';

    bookings[index] = booking;
    this.save(bookings);

    return { success: true, booking };
  },

  /**
   * Check if a booking can be cancelled (delegates to getCancellationStatus).
   */
  canCancel(booking, currentUserId) {
    return getCancellationStatus(booking, currentUserId || null).allowed;
  },

  /**
   * Get cancellation deadline text (delegates to getCancellationStatus).
   * Kept for backwards compatibility: { text, canCancel, urgent }.
   */
  getCancellationDeadline(booking, currentUserId) {
    const st = getCancellationStatus(booking, currentUserId || null);
    if (booking && booking.status === 'cancelled') {
      return { text: 'This booking was cancelled', canCancel: false, urgent: false };
    }
    if (!st.allowed) {
      return { text: st.reason === 'invalid-date' ? st.reasonText : 'Cancellation window has closed', canCancel: false, urgent: true };
    }
    const isUrgent = st.hoursLeft < (24 * 60 * 60 * 1000);
    return { text: `Free cancellation until ${st.deadlineText}`, canCancel: true, urgent: isUrgent };
  },

  /**
   * Seed demo bookings for testing
   */
  seedDemoBookings(userId) {
    const existing = this.getByUser(userId);
    if (existing.length > 0) return; // Don't seed if user already has bookings

    const today = new Date();
    const addDays = (date, days) => {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };
    const img = (id) => (typeof getHotelGallery === 'function' ? getHotelGallery(id)[0] : '');

    const demoBookings = [
      {
        // (a) check-in in 10 days — cancellable
        userId,
        hotelId: 'hyd001',
        hotelName: 'The Nizam Royale',
        area: 'Hyderabad',
        hotelImage: img('hyd001'),
        roomId: 'hyd001-r1',
        roomName: 'Deluxe Room',
        checkIn: addDays(today, 10),
        checkOut: addDays(today, 13),
        nights: 3,
        guests: { adults: 2, children: 0, type: 'Couple' },
        guestType: 'Couple',
        rooms: 1,
        guestName: 'Demo User',
        guestMobile: '9876543210',
        guestEmail: 'demo@frcc.com',
        pricePerNight: 18500,
        totalPrice: 65490,
        paymentMethod: 'upi',
        paymentDetails: { upiId: 'demo.user@okhdfcbank' },
        paymentStatus: 'paid',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        id: this.generateBookingId()
      },
      {
        // (b) check-in in 3 days — cancellable, deadline soon
        userId,
        hotelId: 'vij002',
        hotelName: 'MG Road Majestic',
        area: 'Vijayawada',
        hotelImage: img('vij002'),
        roomId: 'vij002-r1',
        roomName: 'Standard Room',
        checkIn: addDays(today, 3),
        checkOut: addDays(today, 5),
        nights: 2,
        guests: { adults: 2, children: 1, type: 'Family' },
        guestType: 'Family',
        rooms: 1,
        guestName: 'Demo User',
        guestMobile: '9876543210',
        guestEmail: 'demo@frcc.com',
        pricePerNight: 6800,
        totalPrice: 16048,
        paymentMethod: 'credit-card',
        paymentDetails: { cardType: 'Visa', last4: '1111', cardHolderName: 'Demo User' },
        paymentStatus: 'paid',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        id: this.generateBookingId()
      },
      {
        // (c) check-in tomorrow — cancellation blocked from the start
        userId,
        hotelId: 'hyd005',
        hotelName: 'Begumpet Heritage Inn',
        area: 'Hyderabad',
        hotelImage: img('hyd005'),
        roomId: 'hyd005-r1',
        roomName: 'Classic Room',
        checkIn: addDays(today, 1),
        checkOut: addDays(today, 2),
        nights: 1,
        guests: { adults: 1, children: 0, type: 'Business' },
        guestType: 'Business',
        rooms: 1,
        guestName: 'Demo User',
        guestMobile: '9876543210',
        guestEmail: 'demo@frcc.com',
        pricePerNight: 5500,
        totalPrice: 6490,
        paymentMethod: 'upi',
        paymentDetails: { upiId: 'demo.user@okhdfcbank' },
        paymentStatus: 'paid',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        id: this.generateBookingId()
      },
      {
        // (d) past completed stay
        userId,
        hotelId: 'ama003',
        hotelName: 'Mangalagiri Heritage',
        area: 'Amaravathi',
        hotelImage: img('ama003'),
        roomId: 'ama003-r1',
        roomName: 'Standard Room',
        checkIn: addDays(today, -20),
        checkOut: addDays(today, -18),
        nights: 2,
        guests: { adults: 2, children: 0, type: 'Couple' },
        guestType: 'Couple',
        rooms: 1,
        guestName: 'Demo User',
        guestMobile: '9876543210',
        guestEmail: 'demo@frcc.com',
        pricePerNight: 6200,
        totalPrice: 14632,
        paymentMethod: 'net-banking',
        paymentDetails: { bank: 'HDFC' },
        paymentStatus: 'paid',
        status: 'completed',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        id: this.generateBookingId()
      },
      {
        // (e) already cancelled booking
        userId,
        hotelId: 'ama001',
        hotelName: 'Amaravathi Grand Imperial',
        area: 'Amaravathi',
        hotelImage: img('ama001'),
        roomId: 'ama001-r1',
        roomName: 'Deluxe Room',
        checkIn: addDays(today, 30),
        checkOut: addDays(today, 33),
        nights: 3,
        guests: { adults: 2, children: 0, type: 'Business' },
        guestType: 'Business',
        rooms: 1,
        guestName: 'Demo User',
        guestMobile: '9876543210',
        guestEmail: 'demo@frcc.com',
        pricePerNight: 35000,
        totalPrice: 123900,
        paymentMethod: 'wallet',
        paymentDetails: { wallet: 'Paytm' },
        paymentStatus: 'refunded',
        status: 'cancelled',
        cancelledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        cancellationId: this.generateCancellationId(),
        cancellationReason: 'Travel dates changed',
        refundInfo: {
          message: `Refund of ${Utils.formatCurrency(123900)} will be credited to your Paytm wallet in ${CONFIG.REFUND_ETA}.`,
          amount: 123900,
          method: 'wallet',
          status: 'initiated',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        id: this.generateBookingId()
      }
    ];

    const bookings = this.getAll();
    this.save([...demoBookings, ...bookings]);
  }
};
