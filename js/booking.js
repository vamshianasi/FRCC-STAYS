/**
 * FRCC STAYS - Booking Flow Module
 * Manages booking state across pages using sessionStorage.
 * Handles search params, selected hotel/room, guest details.
 */

const Booking = {
  SESSION_KEY: 'frcc_booking_flow',

  /**
   * Get current booking flow state
   */
  getState() {
    try {
      return JSON.parse(sessionStorage.getItem(this.SESSION_KEY)) || {};
    } catch {
      return {};
    }
  },

  /**
   * Save booking flow state
   */
  saveState(state) {
    const current = this.getState();
    const merged = { ...current, ...state };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(merged));
  },

  /**
   * Clear booking flow state
   */
  clearState() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  /**
   * Initialize search from URL params or form
   */
  initSearch(params = {}) {
    const state = {
      area: params.area || 'Hyderabad',
      checkIn: params.checkIn || Utils.addDays(Utils.getToday(), 1),
      checkOut: params.checkOut || Utils.addDays(Utils.getToday(), 3),
      guestType: params.guestType || 'Couple',
      adults: parseInt(params.adults) || 2,
      children: parseInt(params.children) || 0,
      rooms: parseInt(params.rooms) || 1
    };
    this.saveState(state);
    return state;
  },

  /**
   * Get search params from URL
   */
  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      area: params.get('area') || '',
      checkIn: params.get('checkIn') || '',
      checkOut: params.get('checkOut') || '',
      guestType: params.get('guestType') || '',
      adults: params.get('adults') || '',
      children: params.get('children') || '',
      rooms: params.get('rooms') || '',
      hotelId: params.get('hotelId') || '',
      roomId: params.get('roomId') || ''
    };
  },

  /**
   * Select a hotel and room
   */
  selectRoom(hotel, room) {
    this.saveState({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: (typeof getHotelGallery === 'function' ? (getHotelGallery(hotel.id)[0] || '') : ''),
      hotelLocality: hotel.locality,
      hotelAddress: hotel.address,
      roomId: room.id,
      roomName: room.name,
      roomSize: room.size,
      roomBed: room.bed,
      roomMaxOccupancy: room.maxOccupancy,
      roomPricePerNight: room.pricePerNight,
      roomAmenities: room.amenities,
      roomTotalRooms: room.totalRooms
    });
  },

  /**
   * Save guest details
   */
  saveGuestDetails(details) {
    this.saveState({ guest: details });
  },

  /**
   * Get complete booking data for confirmation
   */
  getBookingData() {
    const state = this.getState();
    const nights = Utils.nights(state.checkIn, state.checkOut);
    const breakdown = Utils.priceBreakdown(state.roomPricePerNight, nights);

    return {
      ...state,
      nights,
      priceBreakdown: breakdown
    };
  },

  /**
   * Validate search form
   */
  validateSearch(data) {
    const errors = {};

    if (!data.area) {
      errors.area = 'Please select an area';
    }

    if (!data.checkIn) {
      errors.checkIn = 'Check-in date is required';
    } else if (data.checkIn < Utils.getToday()) {
      errors.checkIn = 'Check-in date cannot be in the past';
    }

    if (!data.checkOut) {
      errors.checkOut = 'Check-out date is required';
    } else if (data.checkIn && data.checkOut <= data.checkIn) {
      errors.checkOut = 'Check-out must be after check-in';
    }

    if (!data.adults || data.adults < 1) {
      errors.adults = 'At least 1 adult required';
    }

    if (!data.rooms || data.rooms < 1) {
      errors.rooms = 'At least 1 room required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate guest details form
   */
  validateGuest(data) {
    const errors = {};

    if (!data.fullName || data.fullName.trim().length < 3) {
      errors.fullName = 'Full name is required (min 3 characters)';
    }

    if (!data.mobile || !/^[6-9]\d{9}$/.test(data.mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (data.idProofType && !data.idProofNumber) {
      errors.idProofNumber = 'ID proof number is required when type is selected';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
};
