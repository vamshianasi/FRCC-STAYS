/**
 * WhatsApp number validation and masking.
 *
 * Rules:
 *  - +91 (India): exactly 10 digits, first digit 6 to 9
 *  - other country codes: 6 to 15 digits
 *
 * The full number is never written to the console.
 */

export const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)', digits: 10, firstDigit: /^[6-9]/ },
  { code: '+971', label: 'UAE (+971)', digits: 9 },
  { code: '+966', label: 'Saudi Arabia (+966)', digits: 9 },
  { code: '+974', label: 'Qatar (+974)', digits: 8 },
  { code: '+968', label: 'Oman (+968)', digits: 8 },
  { code: '+965', label: 'Kuwait (+965)', digits: 8 },
  { code: '+20', label: 'Egypt (+20)', digits: 10 },
  { code: '+44', label: 'United Kingdom (+44)', digits: 10 },
  { code: '+1', label: 'USA / Canada (+1)', digits: 10 },
  { code: '+61', label: 'Australia (+61)', digits: 9 },
  { code: '+65', label: 'Singapore (+65)', digits: 8 },
  { code: '+60', label: 'Malaysia (+60)', digits: 9 },
];

export function getCountry(code) {
  return COUNTRY_CODES.find(c => c.code === code) || COUNTRY_CODES[0];
}

/** Keeps digits only and trims the length for the country. */
export function normaliseWhatsApp(code, raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const c = getCountry(code);
  return digits.slice(0, c.digits);
}

export function isValidWhatsApp(code, raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return false;
  const c = getCountry(code);
  if (c.firstDigit) {
    return digits.length === c.digits && c.firstDigit.test(digits);
  }
  // Other countries: 6 to 15 digits
  return digits.length >= 6 && digits.length <= 15;
}

export function whatsappErrorMessage(code, raw) {
  if (!raw) return 'WhatsApp number is required';
  const c = getCountry(code);
  if (c.firstDigit) {
    return `Enter a valid ${c.code} number: 10 digits starting with 6 to 9`;
  }
  return 'Enter a valid WhatsApp number (6 to 15 digits)';
}

/**
 * Masks for display, e.g. "+91 98XXXXXX10".
 * Safe to show in the UI, store, print and send.
 */
export function maskWhatsApp(code, raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const c = getCountry(code);
  if (!digits) return c.code;
  if (digits.length <= 6) return `${c.code} ${digits.replace(/\d/g, 'X')}`;
  const head = digits.slice(0, 2);
  const tail = digits.slice(-2);
  const mid = 'X'.repeat(digits.length - 4);
  return `${c.code} ${head}${mid}${tail}`;
}

/** Full international string, digits only. Used only when actually sending. */
export function toInternational(code, raw) {
  return `${code}${String(raw || '').replace(/\D/g, '')}`;
}