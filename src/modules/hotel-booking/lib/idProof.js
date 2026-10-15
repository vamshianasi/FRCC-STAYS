/**
 * ID proof types accepted by hotels at check-in.
 *
 * Only the six documents below are supported. Other categories of government
 * or institutional photo ID are deliberately NOT offered.
 *
 * The full ID number is never returned by these helpers — only a masked
 * form is stored, shown, printed or sent.
 */

export const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', placeholder: '1234 5678 9012', hint: '12 digits, first digit 2 to 9' },
  { value: 'pan', label: 'PAN Card', placeholder: 'ABCDE1234F', hint: '5 letters, 4 digits, 1 letter' },
  { value: 'passport', label: 'Passport (Indian)', placeholder: 'A1234567', hint: 'One letter, 1 digit, 4 digits, 1 digit' },
  { value: 'dl', label: 'Driving Licence', placeholder: 'MH1234567890123', hint: '2 letters followed by digits' },
  { value: 'voter', label: 'Voter ID Card (EPIC)', placeholder: 'ABC1234567', hint: '3 letters and 7 digits' },
  { value: 'foreign_passport', label: 'Foreign Passport with Visa', placeholder: 'A123456789', hint: '6 to 9 letters or digits' },
];

export const ID_TYPE_LABELS = Object.fromEntries(ID_TYPES.map(t => [t.value, t.label]));

/** Foreign Passport with Visa needs a separate visa number. */
export const NEEDS_VISA = 'foreign_passport';

/* ------------------------------------------------------------------ */
/* Aadhaar — Verhoeff checksum                                         */
/* ------------------------------------------------------------------ */

const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Verhoeff checksum for a digit string (no spaces).
 * Uses the UIDAI/Aadhaar form: iterate right to left with p[(i+1) % 8].
 */
export function verhoeffCheck(digits) {
  let c = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][parseInt(digits[i], 10)]];
  }
  return c === 0;
}

/* ------------------------------------------------------------------ */
/* Per-type validation                                                 */
/* ------------------------------------------------------------------ */

export function normaliseId(type, raw) {
  const v = String(raw || '').trim().toUpperCase();
  if (type === 'pan') return v;
  if (type === 'passport') return v.replace(/\s+/g, ' ');
  if (type === 'dl') return v;
  return v.replace(/\s+/g, ''); // aadhaar, voter, foreign: strip spaces
}

/** Returns true when the value is a valid number for the given type. */
export function isValidId(type, raw) {
  const v = normaliseId(type, raw);
  if (!v) return false;

  switch (type) {
    case 'aadhaar': {
      // 12 digits, first digit 2-9, correct Verhoeff checksum
      if (!/^[2-9]\d{11}$/.test(v)) return false;
      return verhoeffCheck(v);
    }
    case 'pan':
      return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
    case 'passport':
      // ^[A-PR-WY][1-9][0-9]\s?[0-9]{4}[1-9]$
      return /^[A-PR-WY][1-9][0-9]\s?[0-9]{4}[1-9]$/.test(v);
    case 'dl': {
      // spaces and hyphens removed first
      const c = v.replace(/[\s-]/g, '');
      return /^[A-Z]{2}[0-9]{2}[0-9]{4,11}$/.test(c);
    }
    case 'voter':
      return /^[A-Z]{3}[0-9]{7}$/.test(v);
    case 'foreign_passport':
      return /^[A-Z0-9]{6,9}$/.test(v);
    default:
      return false;
  }
}

/** A short inline message for a wrong format. */
export function idErrorMessage(type, raw) {
  if (!raw) return '';
  switch (type) {
    case 'aadhaar': return 'Aadhaar must be 12 digits starting 2 to 9 and pass the checksum check';
    case 'pan': return 'PAN must be 5 letters, 4 digits, then 1 letter (e.g. ABCDE1234F)';
    case 'passport': return 'Passport must be a letter, a digit 1 to 9, 4 digits, then 1 digit 1 to 9';
    case 'dl': return 'Driving Licence must be 2 letters followed by digits';
    case 'voter': return 'Voter ID must be 3 letters and 7 digits';
    case 'foreign_passport': return 'Foreign passport must be 6 to 9 letters or digits';
    default: return 'Enter a valid ID number';
  }
}

/** Formats the input for display while typing. */
export function formatIdInput(type, raw) {
  const v = normaliseId(type, raw);
  if (type === 'aadhaar') {
    const d = v.replace(/\D/g, '').slice(0, 12);
    return d.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  if (type === 'dl') {
    const c = v.replace(/[\s-]/g, '');
    return c.slice(0, 15);
  }
  if (type === 'pan') return v.slice(0, 10);
  if (type === 'passport') return v.slice(0, 9);
  if (type === 'voter') return v.slice(0, 10);
  if (type === 'foreign_passport') return v.slice(0, 9);
  return v;
}

/**
 * Masks an ID number for storage and display, e.g. "XXXX XXXX 9012".
 * Never returns the full number.
 */
export function maskId(type, raw) {
  const v = normaliseId(type, raw);
  if (!v) return '';
  if (type === 'aadhaar') {
    const d = v.replace(/\s/g, '');
    if (d.length < 4) return 'X'.repeat(d.length);
    return `XXXX XXXX ${d.slice(-4)}`;
  }
  const alnum = v.replace(/[\s-]/g, '');
  if (alnum.length <= 4) return 'X'.repeat(alnum.length);
  return `${'X'.repeat(alnum.length - 4)} ${alnum.slice(-4)}`;
}

/**
 * Returns the Verhoeff check digit that completes an 11-digit Aadhaar prefix.
 * Derived by search, which is exact for this checksum.
 */
export function aadhaarCheckDigit(first11) {
  const prefix = String(first11 || '').replace(/\D/g, '');
  for (let d = 0; d <= 9; d++) {
    if (verhoeffCheck(prefix + d)) return d;
  }
  return null;
}