/**
 * FRCC STAYS - Cancellation module (SINGLE SOURCE OF TRUTH for cancel logic).
 *
 * Rule: a booking can be cancelled at any time up to CONFIG.CANCELLATION_WINDOW_HOURS
 * before the check-in moment (check-in date at CONFIG.CHECKIN_TIME in CONFIG.TIMEZONE).
 * All maths uses real Date calculations anchored to IST (Asia/Kolkata).
 *
 * Every page MUST use getCancellationStatus(booking) / Cancellation helpers below
 * and never duplicate this logic.
 */

/** Parse "YYYY-MM-DD" into the absolute check-in instant (that date, 14:00 IST). */
function checkinMomentIST(checkInStr) {
  if (!checkInStr || typeof checkInStr !== 'string') return null;
  const m = checkInStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T${CONFIG.CHECKIN_TIME}:00+05:30`);
  return isNaN(d.getTime()) ? null : d;
}

/** Format an instant as "18 Oct 2026, 2:00 PM" in IST. */
function formatIST(date) {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: CONFIG.TIMEZONE,
    day: '2-digit', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
  const hour = (parts.hour || '').toUpperCase().replace(/\s/g, '');
  const dayPeriod = (parts.dayPeriod || '').toUpperCase();
  return `${parts.day} ${parts.month} ${parts.year}, ${hour}:${parts.minute} ${dayPeriod}`;
}

/**
 * Single source of truth.
 * Returns { allowed, deadline, hoursLeft, reason } plus display helpers.
 *  - deadline:  Date (IST-anchored instant) or null when unknown
 *  - hoursLeft: ms until the deadline (may be negative), null when unknown
 *  - reason:    'ok' | 'already-cancelled' | 'completed' | 'invalid-date'
 *               | 'too-close' | 'window-closed' | 'not-yours'
 */
function getCancellationStatus(booking, currentUserId) {
  const fail = (reason, reasonText) => ({
    allowed: false, deadline: null, hoursLeft: null, reason, reasonText,
    deadlineText: '', countdownText: ''
  });

  if (!booking || !booking.checkIn) {
    return fail('invalid-date', 'Unable to determine the cancellation status for this booking.');
  }
  if (booking.status === 'cancelled') {
    return fail('already-cancelled', 'This booking has already been cancelled.');
  }
  if (booking.status === 'completed') {
    return fail('completed', 'This stay is already completed and can no longer be cancelled.');
  }
  if (currentUserId && booking.userId && booking.userId !== currentUserId) {
    return fail('not-yours', 'You can only cancel your own bookings.');
  }

  const checkin = checkinMomentIST(booking.checkIn);
  if (!checkin) {
    return fail('invalid-date', 'Unable to determine the cancellation status for this booking.');
  }

  const deadline = new Date(checkin.getTime() - CONFIG.CANCELLATION_WINDOW_HOURS * 3600 * 1000);
  const hoursLeft = deadline.getTime() - Date.now();
  const deadlineText = formatIST(deadline);

  if (hoursLeft <= 0) {
    const past = Date.now() >= checkin.getTime();
    return {
      allowed: false, deadline, hoursLeft, deadlineText,
      countdownText: '',
      reason: past ? 'window-closed' : 'too-close',
      reasonText: past
        ? 'The cancellation window has closed.'
        : 'This booking is non-cancellable because check-in is within 48 hours.'
    };
  }

  return {
    allowed: true, deadline, hoursLeft, deadlineText,
    countdownText: Cancellation.countdownText(hoursLeft),
    reason: 'ok',
    reasonText: `Free cancellation until ${deadlineText} (${CONFIG.CANCELLATION_WINDOW_HOURS} hours before check-in).`
  };
}

const Cancellation = {
  /** Alias so pages can call either spelling. */
  statusOf: (booking, currentUserId) => getCancellationStatus(booking, currentUserId),

  /** "3 days 4 hours" / "5 hours 20 minutes" / "12 minutes" / "less than a minute". */
  countdownText(ms) {
    if (ms == null || ms <= 0) return '';
    const totalMin = Math.floor(ms / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    if (mins > 0) return `${mins} minute${mins !== 1 ? 's' : ''}`;
    return 'less than a minute';
  },

  /** Method-specific refund sentence (simulated, demo mode). */
  refundMessage(booking) {
    const total = Utils.formatCurrency(booking.totalPrice);
    const eta = CONFIG.REFUND_ETA;
    const d = booking.paymentDetails || {};
    switch (booking.paymentMethod) {
      case 'pay-at-venue':
        return 'No payment was made, so there is nothing to refund.';
      case 'upi':
        return `Refund of ${total} will be credited to your UPI account${d.upiId ? ' (' + d.upiId + ')' : ''} in ${eta}.`;
      case 'credit-card':
      case 'debit-card': {
        const kind = booking.paymentMethod === 'credit-card' ? 'credit card' : 'debit card';
        const ending = d.last4 ? ` ending ${d.last4}` : '';
        const brand = d.cardType && d.cardType !== 'Unknown' ? ` (${d.cardType})` : '';
        return `Refund of ${total} will be credited to your ${kind}${ending}${brand} in ${eta}.`;
      }
      case 'net-banking':
        return `Refund of ${total} will be credited to your ${d.bank || 'bank'} account in ${eta}.`;
      case 'wallet':
        return `Refund of ${total} will be credited to your ${d.wallet || 'wallet'} wallet in ${eta}.`;
      default:
        return `Refund of ${total} will be credited to your original payment method in ${eta}.`;
    }
  },

  /** The exact greyed-out message required when cancelling is blocked. */
  blockedText: 'Cancellation is allowed only up to 48 hours before check-in.',

  /**
   * Green deadline line + live countdown (cancellable), or the blocked message.
   * Countdown spans carry data-cd="<deadlineISO>" so the ticker can update them.
   */
  deadlineLineHTML(booking, currentUserId) {
    const st = getCancellationStatus(booking, currentUserId);
    if (booking.status === 'cancelled') return '';
    if (!st.allowed) {
      if (st.reason === 'invalid-date') {
        return `<p style="margin:8px 0 0; font-size:0.85rem; color:var(--error);">Cancellation status unavailable.</p>`;
      }
      return `<p style="margin:8px 0 0; font-size:0.85rem; color:var(--error);">${this.blockedText}</p>`;
    }
    return `<p style="margin:8px 0 0; font-size:0.85rem; color:#166534; font-weight:600;">` +
      `Free cancellation until ${st.deadlineText}` +
      `<br><span data-cd="${st.deadline.toISOString()}" data-for="${booking.id}">Cancel within ${st.countdownText}</span></p>`;
  },

  /**
   * Canonical Cancel button for a booking id:
   *  active button | disabled greyed button | Cancelled badge | Completed badge | nothing.
   */
  cancelButtonHTML(booking, currentUserId, sizeClass) {
    const st = getCancellationStatus(booking, currentUserId);
    const cls = sizeClass || 'btn btn-sm';
    if (booking.status === 'cancelled') {
      return `<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:#fee2e2;color:var(--error);font-weight:700;font-size:0.75rem;">Cancelled</span>`;
    }
    if (booking.status === 'completed') {
      return `<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:#dbeafe;color:#1d4ed8;font-weight:700;font-size:0.75rem;">Completed</span>`;
    }
    if (st.allowed) {
      return `<button type="button" class="${cls}" style="background:var(--error); color:#fff;" data-cancel-for="${booking.id}" onclick="Cancellation.open('${booking.id}')">Cancel Booking</button>`;
    }
    return `<button type="button" class="${cls}" disabled data-cancel-for="${booking.id}" style="background:var(--gray-200); color:var(--gray-500); cursor:not-allowed; white-space:normal;" title="${this.blockedText}">${this.blockedText}</button>`;
  },

  /**
   * Pre-booking policy box for a prospective check-in date (hotel/room/guest/payment pages).
   * Green free-cancel line, or the amber non-cancellable warning.
   */
  policyBoxHTML(checkInStr) {
    const probe = { checkIn: checkInStr, status: 'confirmed' };
    const st = getCancellationStatus(probe);
    if (st.allowed) {
      return `<div style="padding:14px 16px; border:1px solid #86efac; background:#f0fdf4; border-radius:var(--radius-sm); margin:16px 0;">` +
        `<p style="margin:0; font-weight:700; color:#166534;">Free cancellation available</p>` +
        `<p style="margin:6px 0 0; font-size:0.9rem; color:#166534;">${st.reasonText}</p></div>`;
    }
    return `<div style="padding:14px 16px; border:1px solid #fcd34d; background:#fef3c7; border-radius:var(--radius-sm); margin:16px 0;">` +
      `<p style="margin:0; font-weight:700; color:#92400e;">Non-cancellable booking</p>` +
      `<p style="margin:6px 0 0; font-size:0.9rem; color:#92400e;">This booking is non-cancellable because check-in is within 48 hours.</p></div>`;
  },

  /** Live countdown ticker: updates every [data-cd] span; disables buttons on expiry. */
  _tickerStarted: false,
  startTicker() {
    if (this._tickerStarted) return;
    this._tickerStarted = true;
    const tick = () => {
      const now = Date.now();
      document.querySelectorAll('[data-cd]').forEach(el => {
        const dl = new Date(el.getAttribute('data-cd')).getTime();
        if (isNaN(dl)) return;
        const left = dl - now;
        if (left <= 0) {
          el.textContent = 'Cancellation window has closed';
          const id = el.getAttribute('data-for');
          if (id) document.querySelectorAll(`[data-cancel-for="${id}"]`).forEach(btn => {
            if (btn.tagName === 'BUTTON' && !btn.disabled) {
              btn.disabled = true;
              btn.style.background = 'var(--gray-200)';
              btn.style.color = 'var(--gray-500)';
              btn.style.cursor = 'not-allowed';
              btn.textContent = Cancellation.blockedText;
            }
          });
        } else {
          el.textContent = 'Cancel within ' + Cancellation.countdownText(left);
        }
      });
    };
    tick();
    setInterval(tick, 30000);
  },

  /** Thin adapter used by inline onclick handlers. */
  open(bookingId, opts) {
    return this.openCancelModal(bookingId, opts || {});
  },

  /**
   * Shared, accessible cancellation modal.
   * Re-checks eligibility on open AND on confirm. Focus trap + Esc to close.
   * opts: { onSuccess(booking), containerId }
   */
  openCancelModal(bookingId, opts) {
    opts = opts || {};
    const container = document.getElementById(opts.containerId || 'modal-root') || document.body;
    const user = (typeof Auth !== 'undefined' && Auth.getCurrentUser()) ? Auth.getCurrentUser() : null;
    const booking = Bookings.getById(bookingId);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'cancel-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cancel-modal-title');

    const renderBlocked = (message) => {
      overlay.innerHTML =
        '<div class="modal"><div class="modal-header"><h3 id="cancel-modal-title">Cancel Booking</h3>' +
        '<button class="modal-close" data-act="close" aria-label="Close">&times;</button></div>' +
        '<div class="modal-body"><p style="color:var(--error); font-weight:600;">' + message + '</p></div>' +
        '<div class="modal-footer"><button class="btn btn-secondary" data-act="close">OK</button></div></div>';
    };

    if (!booking) {
      renderBlocked('Booking not found.');
    } else {
      const st = getCancellationStatus(booking, user ? user.id : null);
      if (!st.allowed) {
        renderBlocked(st.reason === 'invalid-date'
          ? 'Unable to determine the cancellation status for this booking.'
          : (st.reason === 'not-yours' ? st.reasonText : this.blockedText));
      } else {
        const refund = this.refundMessage(booking);
        overlay.innerHTML =
          '<div class="modal"><div class="modal-header"><h3 id="cancel-modal-title">Cancel Booking</h3>' +
          '<button class="modal-close" data-act="close" aria-label="Close">&times;</button></div>' +
          '<div class="modal-body">' +
            '<p>Are you sure you want to cancel this booking?</p>' +
            '<div style="margin:14px 0; padding:12px 14px; background:var(--ivory); border-radius:var(--radius-sm); font-size:0.9rem; line-height:1.7;">' +
              '<strong>Booking ID:</strong> ' + booking.id + '<br>' +
              '<strong>Hotel:</strong> ' + (booking.hotelName || 'Hotel') + '<br>' +
              '<strong>Room:</strong> ' + (booking.roomName || 'Room') + '<br>' +
              '<strong>Dates:</strong> ' + Utils.formatDate(booking.checkIn) + ' → ' + Utils.formatDate(booking.checkOut) + ' (' + (booking.nights || 0) + ' night(s))<br>' +
              '<strong>Guests:</strong> ' + booking.guests.adults + ' Adult' + (booking.guests.adults !== 1 ? 's' : '') + (booking.guests.children > 0 ? ' + ' + booking.guests.children + ' Child' + (booking.guests.children !== 1 ? 'ren' : '') : '') + '<br>' +
              '<strong>Amount paid:</strong> ' + Utils.formatCurrency(booking.totalPrice) +
            '</div>' +
            '<p style="font-size:0.9rem; color:var(--gray-700);"><strong>Refund:</strong> ' + refund + ' <em>(Demo mode — no real money is processed.)</em></p>' +
            '<div class="form-group" style="margin-top:16px;">' +
              '<label for="cx-reason">Reason for cancellation</label>' +
              '<select id="cx-reason">' +
                '<option>Change of plans</option>' +
                '<option>Found a better price</option>' +
                '<option>Booked by mistake</option>' +
                '<option>Travel dates changed</option>' +
                '<option>Health or emergency</option>' +
                '<option value="__other">Other</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-group" id="cx-other-wrap" style="display:none; margin-top:12px;">' +
              '<label for="cx-other">Please specify</label>' +
              '<input type="text" id="cx-other" placeholder="Tell us briefly">' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-secondary" data-act="close">Keep Booking</button>' +
            '<button class="btn" style="background:var(--error); color:#fff;" data-act="confirm">Confirm Cancellation</button>' +
          '</div></div>';
      }
    }

    const prevFocus = document.activeElement;
    container.appendChild(overlay);

    const close = () => {
      document.removeEventListener('keydown', onKey, true);
      overlay.remove();
      if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
    };

    const focusables = () => [...overlay.querySelectorAll('button, select, input, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.disabled && el.offsetParent !== null);

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);

    const reasonSel = overlay.querySelector('#cx-reason');
    if (reasonSel) {
      reasonSel.addEventListener('change', () => {
        overlay.querySelector('#cx-other-wrap').style.display =
          reasonSel.value === '__other' ? 'block' : 'none';
      });
      setTimeout(() => { try { reasonSel.focus(); } catch (e) {} }, 50);
    }

    let submitting = false;
    overlay.addEventListener('click', (e) => {
      const actBtn = e.target.closest('[data-act]');
      if (e.target === overlay || (actBtn && actBtn.getAttribute('data-act') === 'close')) { close(); return; }
      if (!(actBtn && actBtn.getAttribute('data-act') === 'confirm')) return;
      if (submitting) return; // prevent duplicate cancellation on double click
      submitting = true;
      actBtn.disabled = true;
      actBtn.textContent = 'Cancelling...';

      // Re-check eligibility at confirm time (the deadline may have passed).
      const fresh = Bookings.getById(bookingId);
      const stNow = getCancellationStatus(fresh, user ? user.id : null);
      if (!stNow.allowed) {
        close();
        Utils.toast(stNow.reason === 'not-yours' ? stNow.reasonText : Cancellation.blockedText, 'error');
        return;
      }

      let reason = reasonSel.value;
      let otherText = '';
      if (reason === '__other') {
        otherText = (overlay.querySelector('#cx-other').value || '').trim();
        reason = otherText ? 'Other: ' + otherText : 'Other';
      }
      const result = Bookings.cancel(bookingId, reason, { userId: user ? user.id : null });
      if (!result.success) {
        close();
        Utils.toast(result.error || 'Unable to cancel this booking.', 'error');
        return;
      }

      // Success screen inside the modal.
      const b = result.booking;
      const refund = Cancellation.refundMessage(b);
      overlay.querySelector('.modal').innerHTML =
        '<div class="modal-header"><h3 id="cancel-modal-title">Booking Cancelled</h3>' +
        '<button class="modal-close" data-act="close" aria-label="Close">&times;</button></div>' +
        '<div class="modal-body">' +
          '<div style="text-align:center; margin-bottom:16px;">' +
            '<div style="width:64px;height:64px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">' +
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></div>' +
            '<p style="font-weight:700; font-size:1.1rem; margin:0;">Your booking has been cancelled.</p>' +
          '</div>' +
          '<div style="padding:12px 14px; background:var(--ivory); border-radius:var(--radius-sm); font-size:0.9rem; line-height:1.8;">' +
            '<strong>Cancellation ID:</strong> ' + (b.cancellationId || 'N/A') + '<br>' +
            '<strong>Booking ID:</strong> ' + b.id + '<br>' +
            '<strong>Refund:</strong> ' + refund + '<br>' +
            '<strong>Refund status:</strong> ' + (b.paymentMethod === 'pay-at-venue' ? 'No payment to refund' : 'Refund initiated — ' + Utils.formatDate(b.cancelledAt)) +
          '</div>' +
          '<p style="font-size:0.8rem; color:var(--gray-500); margin-top:10px;">Demo mode — no real money is processed.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<a href="my-bookings.html" class="btn btn-secondary">View My Bookings</a>' +
          '<a href="index.html" class="btn btn-primary">Book Another Stay</a>' +
        '</div>';
      if (opts.onSuccess) { try { opts.onSuccess(b); } catch (e) {} }
    });

    return { close };
  }
};
