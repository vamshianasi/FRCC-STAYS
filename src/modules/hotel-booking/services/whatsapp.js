/**
 * sendReceiptToWhatsApp(booking, options)
 *
 * Sends the booking receipt (PDF) to the guest's WhatsApp number.
 *
 * Modes (config constant WHATSAPP_MODE):
 *   "demo" (default) — waits ~1.5s and resolves. Nothing is really sent.
 *   "live"            — POSTs to the backend at API_ENDPOINT. The backend
 *                       holds the WhatsApp Business Cloud API token, uploads
 *                       the PDF and sends an approved template message.
 *                       The token NEVER reaches the browser.
 *
 * Resolves with { status, messageId, to, at, mode }.
 * `to` is always the MASKED number, so nothing sensitive is returned or logged.
 *
 * Rate limiting is handled by the caller via the returned status
 * "rate_limited"; a failed send never blocks or undoes the booking.
 */

export const WHATSAPP_MODE = 'demo'; // <- set to "live" when the backend is ready

const API_ENDPOINT = '/api/send-receipt';
const MAX_ATTEMPTS = 5;
const MIN_GAP_MS = 15000; // short wait between sends

/* In-memory attempt tracker (per booking id). */
const attempts = new Map();
const lastSent = new Map();

export function resetWhatsAppAttempts() {
  attempts.clear();
  lastSent.clear();
}

/* ------------------------------------------------------------------ */
/* Message text                                                        */
/* ------------------------------------------------------------------ */

function fmtDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDeadline(deadline) {
  if (!deadline) return '';
  return `${fmtDate(deadline)} ${new Date(deadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

function fmtAmount(n) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n ?? 0);
}

/** The guest-facing message. Never contains the full ID or any token. */
export function buildReceiptMessage(booking) {
  if (!booking) return '';
  if (booking.status === 'Cancelled' || booking.cancelledAt) {
    return (
      `Hello ${booking.guestName || 'Guest'}, your FRCC hotel booking ${booking.id} at ${booking.hotel?.name || ''}` +
      ` has been cancelled. The cancellation confirmation is attached.`
    );
  }
  const deadline = booking.cancellationDeadline;
  return (
    `Hello ${booking.guestName || 'Guest'}, your FRCC hotel booking ${booking.id} at ` +
    `${booking.hotel?.name || ''}, ${booking.hotel?.area || ''} is confirmed. ` +
    `Check-in ${fmtDate(booking.checkIn)} 2:00 PM, check-out ${fmtDate(booking.checkOut)} 11:00 AM, ` +
    `${booking.room?.name || ''}, total Rs ${fmtAmount(booking.total)}. ` +
    `Your receipt is attached. Free cancellation until ${fmtDeadline(deadline)}.`
  );
}

/* ------------------------------------------------------------------ */
/* Send                                                                */
/* ------------------------------------------------------------------ */

export async function sendReceiptToWhatsApp(booking, options = {}) {
  const mode = options.mode || WHATSAPP_MODE;
  const masked = booking?.whatsappNumberMasked || '';
  const now = new Date().toISOString();

  if (!booking || !booking.whatsappNumber) {
    return { status: 'failed', messageId: null, to: masked, at: now, mode, error: 'No WhatsApp number on this booking' };
  }

  // Rate limit: at most 5 sends, with a short gap between them.
  const count = (attempts.get(booking.id) || 0) + 1;
  attempts.set(booking.id, count);
  const last = lastSent.get(booking.id) || 0;
  const sinceLast = Date.now() - last;

  if (count > MAX_ATTEMPTS) {
    return { status: 'rate_limited', messageId: null, to: masked, at: now, mode, error: 'Please try again later' };
  }
  if (count > 1 && sinceLast < MIN_GAP_MS) {
    const wait = Math.ceil((MIN_GAP_MS - sinceLast) / 1000);
    return {
      status: 'rate_limited', messageId: null, to: masked, at: now, mode,
      error: `Please wait ${wait}s before sending again`
    };
  }
  lastSent.set(booking.id, Date.now());

  const message = buildReceiptMessage(booking);

  if (mode === 'live') {
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only the booking id and the destination number are sent.
        body: JSON.stringify({ bookingId: booking.id, to: booking.whatsappNumber })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return {
        status: 'sent', messageId: data.messageId || null, to: masked,
        at: new Date().toISOString(), mode, error: null
      };
    } catch (err) {
      // A failed send never blocks the booking.
      return {
        status: 'failed', messageId: null, to: masked,
        at: new Date().toISOString(), mode, error: err.message
      };
    }
  }

  // Demo mode: wait ~1.5s, then succeed. Nothing is really sent.
  await new Promise(r => setTimeout(r, 1500));
  const messageId = `DEMO-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  return { status: 'sent', messageId, to: masked, at: new Date().toISOString(), mode, message, error: null };
}

/** Records the send on the booking (to, at, status, mode). */
export function applyReceiptSent(booking, result) {
  return {
    ...booking,
    receiptSent: {
      to: result.to,
      at: result.at,
      status: result.status,
      mode: result.mode,
      messageId: result.messageId || null
    },
    receiptAttempts: (booking.receiptAttempts || 0) + 1
  };
}

export const WHATSAPP_MAX_ATTEMPTS = MAX_ATTEMPTS;