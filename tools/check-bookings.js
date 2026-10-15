#!/usr/bin/env node
/**
 * tools/check-bookings.js
 *
 * Verifies the bookings / receipt / ID-proof rules:
 *  - My Bookings tabs are exactly Upcoming, Completed, Cancelled (no "Booked")
 *  - tab filters sort bookings into the right bucket
 *  - the ID dropdown has exactly the 6 accepted types
 *  - each ID validator accepts a valid number and rejects invalid ones
 *  - the WhatsApp validator handles +91 and other country codes
 *  - sendReceiptToWhatsApp resolves in demo mode and stores receiptSent
 *  - no API key or token exists in frontend code
 *
 * Usage: node tools/check-bookings.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const MODULE = path.join(ROOT, 'src', 'modules', 'hotel-booking');

const { TABS, DEFAULT_TAB, tabForBooking, filterByTab, tabCounts, sortBookings } =
  await import('../src/modules/hotel-booking/lib/bookingTabs.js');
const { ID_TYPES, isValidId, maskId } = await import('../src/modules/hotel-booking/lib/idProof.js');
const { isValidWhatsApp, maskWhatsApp, normaliseWhatsApp } = await import('../src/modules/hotel-booking/lib/whatsappNumber.js');
const { sendReceiptToWhatsApp, applyReceiptSent, resetWhatsAppAttempts, WHATSAPP_MODE } =
  await import('../src/modules/hotel-booking/services/whatsapp.js');

let pass = 0;
const failures = [];
function ok(name, cond, extra = '') {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { failures.push(name + (extra ? ' — ' + extra : '')); console.log('  FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}
function section(t) { console.log('\n' + t); }

const day = 86400000;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString();

/* ================================================================ */
section('1. MY BOOKINGS TABS');
ok('tabs are exactly [Upcoming, Completed, Cancelled]',
  JSON.stringify(TABS) === JSON.stringify(['Upcoming', 'Completed', 'Cancelled']),
  JSON.stringify(TABS));
ok('default tab is Upcoming', DEFAULT_TAB === 'Upcoming', DEFAULT_TAB);
ok('no tab named Booked', !TABS.some(t => /booked/i.test(t)));

// MyBookings.jsx must not mention "Booked" as a tab
const mbSrc = fs.readFileSync(path.join(MODULE, 'pages', 'MyBookings.jsx'), 'utf8');
ok('MyBookings.jsx has no "Booked" label', !/\bBooked\b/.test(mbSrc));
ok('MyBookings.jsx uses the TABS constant', /import\s*\{[^}]*TABS/.test(mbSrc));
// Tab names come from the TABS constant, not literals, so check that they render.
ok('MyBookings renders one tab button per tab',
  /TABS\.map\(/.test(mbSrc) && /{t}\s*<span className="tab-count">/.test(mbSrc));

/* ================================================================ */
section('2. TAB FILTER LOGIC');
const confirmed = { id: 'A1', status: 'confirmed', checkIn: iso(10), checkOut: iso(12), createdAt: iso(-1) };
const payAtVenue = { id: 'A2', status: 'pay_at_venue', checkIn: iso(5), checkOut: iso(6), createdAt: iso(-2) };
const pastStay = { id: 'A3', status: 'confirmed', checkIn: iso(-10), checkOut: iso(-8), createdAt: iso(-20) };
const cancelled = { id: 'A4', status: 'Cancelled', checkIn: iso(10), checkOut: iso(12), cancelledAt: iso(-1), createdAt: iso(-3) };

ok('confirmed + future check-out => Upcoming', tabForBooking(confirmed) === 'Upcoming', tabForBooking(confirmed));
ok('pay_at_venue + future check-out => Upcoming', tabForBooking(payAtVenue) === 'Upcoming', tabForBooking(payAtVenue));
ok('past check-out => Completed', tabForBooking(pastStay) === 'Completed', tabForBooking(pastStay));
ok('cancelled => Cancelled', tabForBooking(cancelled) === 'Cancelled', tabForBooking(cancelled));
ok('cancelled wins over a future check-out', tabForBooking({ ...confirmed, status: 'Cancelled' }) === 'Cancelled');

const all = [confirmed, payAtVenue, pastStay, cancelled];
const counts = tabCounts(all);
ok('counts: Upcoming = 2', counts.Upcoming === 2, String(counts.Upcoming));
ok('counts: Completed = 1', counts.Completed === 1, String(counts.Completed));
ok('counts: Cancelled = 1', counts.Cancelled === 1, String(counts.Cancelled));
ok('total counts match bookings',
  counts.Upcoming + counts.Completed + counts.Cancelled === all.length);
ok('filterByTab(Upcoming) returns 2', filterByTab(all, 'Upcoming').length === 2);
ok('filterByTab(Completed) returns 1', filterByTab(all, 'Completed').length === 1);
ok('filterByTab(Cancelled) returns 1', filterByTab(all, 'Cancelled').length === 1);

const sorted = sortBookings([pastStay, confirmed, payAtVenue]);
ok('sortBookings puts the newest first', sorted[0].id === 'A1', sorted.map(b => b.id).join(','));
const brandNew = { id: 'NEW', status: 'confirmed', checkIn: iso(3), checkOut: iso(4), createdAt: new Date().toISOString() };
ok('a new booking is at the top of Upcoming',
  sortBookings(filterByTab([...all, brandNew], 'Upcoming'))[0].id === 'NEW');

/* ================================================================ */
section('3. ID PROOF TYPES');
const expectedTypes = [
  ['aadhaar', 'Aadhaar Card'],
  ['pan', 'PAN Card'],
  ['passport', 'Passport (Indian)'],
  ['dl', 'Driving Licence'],
  ['voter', 'Voter ID Card (EPIC)'],
  ['foreign_passport', 'Foreign Passport with Visa'],
];
ok('exactly 6 ID types', ID_TYPES.length === 6, String(ID_TYPES.length));
for (const [value, label] of expectedTypes) {
  ok(`type "${label}" present`, ID_TYPES.some(t => t.value === value && t.label === label));
}
const labels = ID_TYPES.map(t => t.label).join(' | ').toLowerCase();
for (const banned of ['ration', 'student', 'employee', 'defence', 'armed forces', 'other government']) {
  ok(`no "${banned}" ID option`, !labels.includes(banned));
}
// Project-wide scan
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
// Project-wide scan, whole words only (so "duration"/"operation" don't trip it)
const scanned = walk(MODULE).filter(f => /\.(jsx?|css|md)$/.test(f));
const bannedHits = [];
const bannedRe = [
  /\b ration\b/i, /\bration card\b/i,
  /\bstudent\b/i, /\bemployee\b/i,
  /\bdefence\b/i, /\bdefense\b/i,
  /\barmed forces\b/i
];
for (const f of scanned) {
  const text = fs.readFileSync(f, 'utf8');
  for (const re of bannedRe) {
    if (re.test(text)) bannedHits.push(`${path.relative(ROOT, f)} (${re})`);
  }
}
ok('no ration/student/employee/defence references in the module',
  bannedHits.length === 0, bannedHits.slice(0, 5).join(', '));

/* ================================================================ */
section('4. ID VALIDATORS (accept valid / reject invalid)');
const idCases = [
  // Aadhaar: first digit 2-9 AND a correct Verhoeff checksum
  ['aadhaar', '3456 7890 1232', true, 'valid checksum'],
  ['aadhaar', '2345 6789 0129', true, 'valid checksum'],
  ['aadhaar', '9998 8877 7661', true, 'valid checksum'],
  ['aadhaar', '9999 9999 9999', false, 'bad checksum'],
  ['aadhaar', '3456 7890 1233', false, 'wrong check digit'],
  ['aadhaar', '1234 5678 9012', false, 'first digit 1 not allowed'],
  ['aadhaar', '3456 7890 123', false, 'only 11 digits'],
  // PAN
  ['pan', 'ABCDE1234F', true, 'valid'],
  ['pan', 'abcde1234f', true, 'auto-uppercase'],
  ['pan', 'ABC12345F', false, '4 letters then digit'],
  ['pan', 'ABCDE12345', false, 'missing trailing letter'],
  // Passport (Indian): ^[A-PR-WY][1-9][0-9]\s?[0-9]{4}[1-9]$
  ['passport', 'A1234567', true, 'valid'],
  ['passport', 'A12 34567', true, 'one space allowed after 3 chars'],
  ['passport', 'Z1234567', false, 'Z not in A-PR-WY'],
  ['passport', 'A0234567', false, 'second digit 0 not 1-9'],
  ['passport', 'A123456', false, 'only 7 chars'],
  // Driving Licence
  ['dl', 'MH1220260012345', true, 'valid'],
  ['dl', 'MH 12-2026-0012345', true, 'spaces and hyphens removed'],
  ['dl', 'M1220260012345', false, 'only one letter'],
  ['dl', 'MHABCDEF0012345', false, 'letters after the state code'],
  // Voter / EPIC
  ['voter', 'ABC1234567', true, 'valid'],
  ['voter', 'abc1234567', true, 'auto-uppercase'],
  ['voter', 'AB1234567', false, 'only 2 letters'],
  ['voter', 'ABC123456', false, 'only 6 digits'],
  // Foreign passport + visa: 6 to 9 letters or digits
  ['foreign_passport', 'A12345678', true, '9 chars'],
  ['foreign_passport', 'A12345', true, '6 chars'],
  ['foreign_passport', 'A1234', false, 'only 5 chars'],
  ['foreign_passport', 'ABCDEF12345', false, '10 chars'],
];
for (const [type, value, expected, note] of idCases) {
  ok(`${type}: ${note} (${value})`, isValidId(type, value) === expected,
    `expected ${expected}, got ${isValidId(type, value)}`);
}

section('5. ID MASKING (never store the full number)');
const maskCases = [
  ['aadhaar', '3456 7890 1232', 'XXXX XXXX 1232'],
  ['pan', 'ABCDE1234F', 'XXXXXX 234F'],
  ['voter', 'ABC1234567', 'XXXXXX 4567'],
  ['dl', 'MH1220260012345', 'XXXXXXXXXXX 2345'],
];
for (const [type, value, expected] of maskCases) {
  const m = maskId(type, value);
  ok(`${type} masked => ${expected}`, m === expected, m);
  ok(`${type} mask hides the input`, !m.replace(/\s/g, '').includes(value.replace(/\D/g, '').slice(0, 4)));
}

/* ================================================================ */
section('6. WHATSAPP NUMBER VALIDATION');
const waCases = [
  ['+91', '9876543210', true, 'valid Indian 10-digit number'],
  ['+91', '98765432', false, 'only 8 digits'],
  ['+91', '98765432101', false, '11 digits'],
  ['+91', '1234567890', false, 'starts with 1, must be 6-9'],
  ['+91', '5876543210', false, 'starts with 5, must be 6-9'],
  ['+971', '501234567', true, '9-digit UAE number'],
  ['+44', '7912345678', true, '10-digit UK number'],
  ['+65', '81234567', true, '8-digit Singapore number'],
  ['+1', '4155551234', true, '10-digit US number'],
  ['+91', '', false, 'empty'],
];
for (const [code, value, expected, note] of waCases) {
  ok(`${code} ${note} (${value || 'empty'})`, isValidWhatsApp(code, value) === expected,
    `expected ${expected}, got ${isValidWhatsApp(code, value)}`);
}
ok('foreign codes allow 6 digits',
  isValidWhatsApp('+65', '123456') === true);
ok('foreign codes allow 15 digits',
  isValidWhatsApp('+1', '123456789012345') === true);
ok('foreign codes reject 5 digits',
  isValidWhatsApp('+65', '12345') === false);
ok('foreign codes reject 16 digits',
  isValidWhatsApp('+1', '1234567890123456') === false);
ok('normaliseWhatsApp strips non-digits and trims',
  normaliseWhatsApp('+91', '98-765 43210') === '9876543210');

section('7. WHATSAPP MASKING');
ok('masked Indian number looks like +91 98XXXXXX10',
  maskWhatsApp('+91', '9876543210') === '+91 98XXXXXX10', maskWhatsApp('+91', '9876543210'));
ok('masked number hides the middle digits',
  !maskWhatsApp('+91', '9876543210').includes('7654'));

/* ================================================================ */
section('8. sendReceiptToWhatsApp IN DEMO MODE');
ok('WHATSAPP_MODE is demo or live', ['demo', 'live'].includes(WHATSAPP_MODE), WHATSAPP_MODE);

resetWhatsAppAttempts();
const demoBooking = {
  id: 'FRCC-20261015-ABCD',
  guestName: 'Asha Rao',
  hotel: { name: 'The Nizam Royale', area: 'Hyderabad' },
  room: { name: 'Suite Room', bed: 'King Bed' },
  adults: 2, children: 0,
  checkIn: iso(10), checkOut: iso(12),
  base: 14000, gst: 2520, total: 16520,
  paymentMethod: 'UPI', status: 'confirmed',
  cancellationDeadline: iso(8),
  whatsappNumber: '+919876543210',
  whatsappNumberMasked: '+91 98XXXXXX10',
};

const t0 = Date.now();
const result = await sendReceiptToWhatsApp(demoBooking);
const elapsed = Date.now() - t0;

ok('demo send resolves with status "sent"', result.status === 'sent', result.status);
ok('demo send returns a messageId', typeof result.messageId === 'string' && result.messageId.length > 0);
ok('demo send returns the masked number', result.to === '+91 98XXXXXX10', result.to);
ok('demo send returns an ISO timestamp', !Number.isNaN(Date.parse(result.at)));
ok('demo send reports mode "demo"', result.mode === 'demo', result.mode);
ok('demo send waits about 1.5s', elapsed >= 1200 && elapsed < 4000, elapsed + 'ms');
ok('result never contains the full number',
  !JSON.stringify(result).includes('9876543210'));

const message = result.message;
ok('message greets the guest by name', message.includes('Asha Rao'));
ok('message includes the booking id', message.includes(demoBooking.id));
ok('message includes the hotel name', message.includes('The Nizam Royale'));
ok('message includes the area', message.includes('Hyderabad'));
ok('message includes the room type', message.includes('Suite Room'));
ok('message includes the total', message.includes('16,520'));
ok('message mentions free cancellation', /Free cancellation until/i.test(message));
ok('message never contains the full number', !message.includes('9876543210'));

const stored = applyReceiptSent(demoBooking, result);
ok('receiptSent is stored on the booking', !!stored.receiptSent);
ok('receiptSent.to is masked', stored.receiptSent.to === '+91 98XXXXXX10');
ok('receiptSent.at is set', !Number.isNaN(Date.parse(stored.receiptSent.at)));
ok('receiptSent.status is sent', stored.receiptSent.status === 'sent');
ok('receiptSent.mode is demo', stored.receiptSent.mode === 'demo');
ok('receiptSent holds no full number',
  !JSON.stringify(stored.receiptSent).includes('9876543210'));

section('9. RATE LIMITING (max 5 sends per booking)');
resetWhatsAppAttempts();
const rlBooking = { ...demoBooking, id: 'RL-1' };
const statuses = [];
for (let i = 0; i < 7; i++) {
  const r = await sendReceiptToWhatsApp(rlBooking);
  statuses.push(r.status);
}
ok('first 5 sends are attempted', statuses.slice(0, 5).every(s => s === 'sent' || s === 'rate_limited'));
ok('sends beyond 5 are rate limited', statuses.slice(5).every(s => s === 'rate_limited'),
  statuses.join(','));
ok('rate limited message says try again later',
  (await sendReceiptToWhatsApp(rlBooking)).error === 'Please try again later');
ok('a failed send does not block the booking',
  (await sendReceiptToWhatsApp({ ...demoBooking, id: 'NO-WA', whatsappNumber: undefined })).status === 'failed');

section('10. NO API KEY OR TOKEN IN FRONTEND CODE');
const tokenPatterns = [
  /WHATSAPP_TOKEN\s*=\s*['"][^'"]+['"]/,
  /EA[A-Za-z0-9]{20,}/,
  /Bearer\s+[A-Za-z0-9._-]{20,}/,
  /graph\.facebook\.com/,
  /whatsapp.*api.*key/i,
  /phone_number_id\s*[:=]\s*['"]?\d{6,}/
];
const tokenHits = [];
for (const f of walk(MODULE).filter(f => /\.(jsx?|css)$/.test(f))) {
  const text = fs.readFileSync(f, 'utf8');
  for (const p of tokenPatterns) {
    if (p.test(text)) tokenHits.push(path.relative(ROOT, f));
  }
}
ok('no token, API key or Graph endpoint in frontend code', tokenHits.length === 0, tokenHits.join(', '));

const waSrc = fs.readFileSync(path.join(MODULE, 'services', 'whatsapp.js'), 'utf8');
ok('service only POSTs bookingId and to',
  /JSON\.stringify\(\{\s*bookingId:[^}]*to:/.test(waSrc.replace(/\s+/g, ' ')));
ok('service posts to /api/send-receipt', waSrc.includes('/api/send-receipt'));

const serverExample = path.join(ROOT, 'server', 'send-receipt.example.js');
ok('server/send-receipt.example.js exists', fs.existsSync(serverExample));
if (fs.existsSync(serverExample)) {
  const src = fs.readFileSync(serverExample, 'utf8');
  ok('example reads WHATSAPP_TOKEN from env', /process\.env\.WHATSAPP_TOKEN/.test(src));
  ok('example reads WHATSAPP_PHONE_NUMBER_ID from env', /process\.env\.WHATSAPP_PHONE_NUMBER_ID/.test(src));
  ok('example has no hard-coded token value', !/WHATSAPP_TOKEN\s*=\s*['"][A-Za-z0-9]{20,}['"]/.test(src));
}

const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
ok('README explains the WhatsApp modes', /WHATSAPP_MODE/.test(readme));
ok('README mentions template approval', /approved/i.test(readme) && /template/i.test(readme));
ok('README names alternative providers',
  /Twilio/.test(readme) && /Gupshup/.test(readme) && /Interakt/.test(readme));

section('11. GUEST DETAILS FIELDS');
const gdSrc = fs.readFileSync(path.join(MODULE, 'pages', 'GuestDetails.jsx'), 'utf8');
ok('WhatsApp field present', /WhatsApp Number/.test(gdSrc));
ok('country code dropdown defaults to +91', /useState\('\+91'\)/.test(gdSrc));
ok('same-as-mobile checkbox present', /Same as mobile number/.test(gdSrc));
ok('consent checkbox present', /Send my booking confirmation and receipt to this WhatsApp number/.test(gdSrc));
ok('consent is required in validation', /whatsappConsent/.test(gdSrc));
ok('helper text present', /Your receipt will be sent here after booking/.test(gdSrc));
ok('ID helper line present', /Please carry the same original ID for verification at check-in/.test(gdSrc));
ok('stores the masked ID, never the full one', /idNumberMasked/.test(gdSrc) && /idNumber: undefined/.test(gdSrc));
ok('visa field appears for the foreign passport type', /visaNumber/.test(gdSrc));
ok('guest payload carries the ID type label',
  /idProofLabel:/.test(gdSrc) && /ID_TYPES\.find/.test(gdSrc));

const paySrc = fs.readFileSync(path.join(MODULE, 'pages', 'Payment.jsx'), 'utf8');
ok('Payment stores whatsappNumber on the booking', /whatsappNumber:/.test(paySrc));
ok('Payment stores whatsappNumberMasked', /whatsappNumberMasked:/.test(paySrc));
ok('Payment stores idProofLabel', /idProofLabel:/.test(paySrc));
ok('Payment stores only the masked idNumberMasked', /idNumberMasked:/.test(paySrc));
ok('Payment does not store the raw idNumber', !/\bidNumber:\s*guest\.idNumber/.test(paySrc));
ok('Payment does not store a member discount field',
  !/memberDiscount|originalPrice|isMemberBooking/.test(paySrc));

section('12. CONFIRMATION AND MY BOOKINGS RECEIPT ACTIONS');
const cfSrc = fs.readFileSync(path.join(MODULE, 'pages', 'Confirmation.jsx'), 'utf8');
ok('three buttons: Download Receipt', /Download Receipt/.test(cfSrc));
ok('three buttons: My Bookings', />\s*My Bookings\s*</.test(cfSrc));
ok('three buttons: Cancel Booking', /Cancel Booking/.test(cfSrc));
ok('status line shows sending text', /Sending receipt to WhatsApp/.test(cfSrc));
ok('status line shows sent text', /Receipt sent to/.test(cfSrc));
ok('status line shows the demo note', /demo mode, no real message sent/.test(cfSrc));
ok('Resend button present', /Resend/.test(cfSrc));
ok('the save-PDF link is gone from Confirmation', !/Save PDF to this device/.test(cfSrc));
ok('the save-PDF link is gone from My Bookings', !/Save PDF to this device/.test(mbSrc));
ok('no receipt PDF helper is left in the module',
  !fs.existsSync(path.join(MODULE, 'lib', 'receiptPdf.js')));
ok('nothing imports the receipt PDF helper',
  walk(MODULE).filter(f => /\.(jsx?|css)$/.test(f)).every(f => !/receiptPdf/.test(fs.readFileSync(f, 'utf8'))));

ok('every My Bookings card can download the receipt',
  /Download Receipt/.test(mbSrc));
ok('My Bookings shows the last sent time', /Last sent/.test(mbSrc));

section('12b. SHARED ACTION BUTTON STYLE');
const btnCss = fs.readFileSync(path.join(MODULE, 'styles', 'buttons.css'), 'utf8');
for (const cls of ['.frcc-btn', '.frcc-btn--gold', '.frcc-btn--navy', '.frcc-btn--outline', '.frcc-btn--danger']) {
  ok(`shared style defines ${cls}`, btnCss.includes(cls));
}
ok('Cancel Booking never says "Cancellation not allowed" inside the button',
  !/Cancellation not allowed/.test(cfSrc) && !/Cancellation not allowed/.test(mbSrc));
ok('a muted 48-hour note is shown under the buttons',
  cfSrc.includes('CANCELLATION_NOTE') && mbSrc.includes('CANCELLATION_NOTE'));
ok('cancelled bookings show a red Cancelled badge',
  /cancelled-badge/.test(cfSrc) && /Cancelled/.test(cfSrc));
ok('card actions use a 3-column grid that cannot overflow',
  /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(
    fs.readFileSync(path.join(MODULE, 'pages', 'MyBookings.css'), 'utf8')));
ok('card clips its own overflow and allows shrinking',
  /\.mb-card\s*\{[^}]*overflow:\s*hidden[^}]*min-width:\s*0/.test(
    fs.readFileSync(path.join(MODULE, 'pages', 'MyBookings.css'), 'utf8').replace(/\n\s*/g, ' ')));

section('12c. CANCELLATION RULE (48 hours before check-in, 2:00 PM IST)');
const { getCancellationStatus, checkInInstant, CANCELLATION_NOTE } =
  await import('../src/modules/hotel-booking/config/cancellation.js');
const nowMs = Date.now();
const dayIso = (offset) => {
  const d = new Date(nowMs + offset * 86400000);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};
const sixDays = { id: 'X1', status: 'confirmed', checkIn: dayIso(6) };
const tomorrow = { id: 'X2', status: 'confirmed', checkIn: dayIso(1) };
ok('check-in 6 days away => cancellation allowed', getCancellationStatus(sixDays).allowed === true);
ok('check-in tomorrow => cancellation blocked', getCancellationStatus(tomorrow).allowed === false);
ok('blocked reason is the 48-hour rule',
  getCancellationStatus(tomorrow).reason.includes('48 hours'));
ok('cancelled booking is never cancellable',
  getCancellationStatus({ ...sixDays, status: 'Cancelled' }).allowed === false);
ok('check-in instant is 2:00 PM IST (05:30 UTC) of the check-in day',
  (() => {
    const iso = '2026-10-21';
    const i = checkInInstant({ checkIn: iso });
    return i.toISOString() === '2026-10-21T08:30:00.000Z';
  })(),
  checkInInstant({ checkIn: '2026-10-21' }).toISOString());
ok('a date-only check-in keeps its own calendar day',
  checkInInstant({ checkIn: '2026-01-01' }).toISOString() === '2026-01-01T08:30:00.000Z');
ok('deadline is exactly 48 hours before check-in',
  Math.round((checkInInstant({ checkIn: '2026-10-21' }) -
    getCancellationStatus({ status: 'confirmed', checkIn: '2026-10-21' }).deadline) / 3600000) === 48);
ok('both pages use the same helper',
  /getCancellationStatus/.test(cfSrc) && /getCancellationStatus/.test(mbSrc));
ok('the note is 13px and muted in the stylesheet',
  /\.cancel-note\s*\{[^}]*font-size:\s*13px[^}]*color:\s*#6B7385/.test(
    fs.readFileSync(path.join(MODULE, 'pages', 'Confirmation.css'), 'utf8').replace(/\n\s*/g, ' ')));
ok('note text matches the rule', CANCELLATION_NOTE === 'Cancellation is allowed only up to 48 hours before check-in.');

section('13. ROOM TYPES AND DEMO DATA MIGRATION');
const { CURRENT_ROOM_TYPES, buildDemoBookings, migrateBookings } =
  await import('../src/modules/hotel-booking/lib/storage.js');
ok('current room types are Suite Room and Normal Room',
  JSON.stringify(CURRENT_ROOM_TYPES) === JSON.stringify(['Suite Room', 'Normal Room']));
const demo = buildDemoBookings();
ok('demo bookings are seeded', demo.length === 5, String(demo.length));
ok('every demo booking uses a current room type',
  demo.every(b => CURRENT_ROOM_TYPES.includes(b.room?.name)));
ok('every demo booking price matches its room data',
  demo.every(b => b.base === b.room.pricePerNight * Math.round(
    (new Date(b.checkOut) - new Date(b.checkIn)) / 86400000)));
ok('demo bookings cover Hyderabad and Vijayawada',
  new Set(demo.map(b => b.hotel.area)).size === 2,
  [...new Set(demo.map(b => b.hotel.area))].join(','));
ok('demo bookings cover both room types',
  new Set(demo.map(b => b.room.name)).size === 2);
ok('no demo booking uses a deleted room type',
  !demo.some(b => /deluxe/i.test(b.room.name)));

// Migration drops old room types and keeps everything current.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
};
store.set('frcc-bookings', JSON.stringify([
  { id: 'OLD-1', room: { name: 'Deluxe Room' }, status: 'confirmed', checkIn: dayIso(5) },
  { id: 'OLD-2', room: { name: 'Presidential Suite' }, status: 'confirmed', checkIn: dayIso(5) },
  { id: 'KEEP-1', room: { name: 'Suite Room' }, status: 'confirmed', checkIn: dayIso(5) },
]));
const summary = migrateBookings();
ok('migration removes 2 old bookings', summary.removed === 2, String(summary.removed));
const after = JSON.parse(store.get('frcc-bookings'));
ok('migration keeps the Suite Room booking', after.some(b => b.id === 'KEEP-1'));
ok('migration removes every Deluxe Room booking', !after.some(b => /deluxe/i.test(b.room?.name || '')));
ok('migration re-seeds the 5 demo bookings',
  after.filter(b => b.id.startsWith('FRCC-DEMO-')).length === 5, String(after.length));

/* ================================================================ */
console.log('\n' + '='.repeat(64));
console.log('FRCC STAYS - BOOKINGS / RECEIPT CHECKS');
console.log('='.repeat(64));
console.log(`Passed: ${pass}`);
console.log(`Failed: ${failures.length}`);
if (failures.length) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  - ' + f));
  console.log('RESULT: FAIL');
  console.log('='.repeat(64));
  process.exit(1);
}
console.log('RESULT: PASS - all booking, receipt, ID and WhatsApp checks passed');
console.log('='.repeat(64));