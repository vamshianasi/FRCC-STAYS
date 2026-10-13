# FRCC STAYS - Hotel Booking Module

A standalone, production-quality hotel booking website built with plain HTML5, CSS3, and vanilla JavaScript (ES6+). No build step required - simply open `index.html` or serve with any local web server.

**Screens 5 of 12: Hotel Booking** - Part of the larger resort/club website project.

---

## Quick Start

### Option 1: Open directly
1. Double-click `index.html` in the project folder.
2. The landing page opens in your default browser.

### Option 2: Local server (recommended)
```bash
# Using the bundled zero-dependency Node server (no installs needed)
node serve.js          # http://localhost:8000
node serve.js 3000     # or any port

# Or Python
python -m http.server 8000
```
Then visit `http://localhost:8000/index.html`.

### Image tooling (unique photos, no repeats)
Every hotel gallery and every room gallery uses its **own distinct images** — no
image is shared between two hotels, two rooms, or between a room and its hotel.
All image URLs live in `js/data/images.js`.

- `tools/check-images.js` — verifies the image library at any time:
  ```bash
  node tools/check-images.js            # structural + uniqueness checks
  node tools/check-images.js --verify   # also HEAD every URL for HTTP 200
  ```
  Final line should read: **`RESULT: PASS — 0 duplicates, 0 galleries with fewer than 5 images.`**
- `tools/build-images.js` — regenerates `js/data/images.js` (936 unique slots).

Images are served by **Lorem Picsum** (`https://picsum.photos`, an Unsplash-sourced
photo catalogue) pinned to specific image IDs so each is unique **and** always loads.
See **"How to Replace Images"** to swap in your team's own Unsplash/Pexels URLs.

---

## Project Structure

```
FRCC STAYS/
├── index.html                  # Landing page
├── hotels.html                 # Search results
├── hotel-details.html           # Hotel details + room selection
├── guest-details.html           # Guest information form
├── payment.html                # Payment (all methods + UPI verification)
├── confirmation.html           # Booking confirmation
├── my-bookings.html            # User's bookings
├── signin.html                 # Sign in / Sign up
├── serve.js                    # Zero-dependency local server (node serve.js)
├── css/
│   └── style.css               # Complete luxury design system
├── js/
│   ├── data/
│   │   ├── images.js            # UNIQUE image library (swap here!)
│   │   └── hotels.js            # 36 hotels data
│   ├── app.js                   # Shared utilities, header/footer, lightbox, toast
│   ├── auth.js                  # Authentication (placeholder)
│   ├── bookings.js              # Booking CRUD, availability, cancellation actions
│   ├── booking.js               # Booking flow state management
│   ├── cancellation.js          # Cancel single source: getCancellationStatus + modal
│   ├── config.js                # CONFIG (48h window, 14:00, IST, GST)
│   └── payment.js               # Payment processing + UPI verification
├── tools/
│   ├── check-images.js          # Image uniqueness / coverage checker
│   └── build-images.js          # Regenerates js/data/images.js
└── README.md
```

---

## Multi-Page Navigation Flow

```
Landing (index.html)
  → Search Hotels
     → Hotels List (hotels.html)
        → Select Hotel
           → Hotel Details + Rooms (hotel-details.html)
              → Select Room
                 → Guest Details (guest-details.html)
                    → Proceed to Payment
                       → Payment (payment.html)
                          → Process Payment
                             → Confirmation (confirmation.html)
                                → My Bookings (my-bookings.html)
```

State is carried via:
- **URL params** - Search criteria and selections (hotel, dates, guests)
- **sessionStorage** - Booking flow state between pages
- **localStorage** - User accounts, bookings, demo data

All pages include:
- Sticky header with logo, Hotel Booking, My Bookings, Sign In / Profile
- Step progress indicator on booking pages
- Footer with minimal links
- Back button support (data preservation)

---

## Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

Requires JavaScript ES6+ support. Uses `localStorage` and `sessionStorage`.

---

## Authentication

> **NOTE:** The current auth system (`js/auth.js`) is a minimal placeholder using localStorage. It is designed to be replaced by the team's real Sign up / Sign in screens without affecting the rest of the codebase.

### Current Placeholder
```javascript
// Users stored in localStorage as JSON (NOT secure)
Auth.register(name, email, mobile, password)
Auth.login(identifier, password)
Auth.getCurrentUser()
Auth.logout()
```

### To Replace
1. Update `Auth.getCurrentUser()` to return your authenticated user
2. Update `Auth.login()` / `Auth.register()` to call your backend API
3. My Bookings page reads `Auth.getCurrentUser().id` - keep this property name
4. The redirect logic in signin.html handles "return to booking" - keep this flow

---

## Data Management

### Hotels (js/data/hotels.js)

36 luxury hotels:
- **14** in Hyderabad (Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, Begumpet, Shamshabad, Kondapur, Madhapur, Uppal, Secunderabad, Manikonda, Miyapur, Kukatpally, Dilsukhnagar)
- **11** in Vijayawada (Benz Circle, MG Road, Gunadala, Bhavanipuram, Eluru Road, Penamaluru, Poranki, Kankipadu, Gannavaram, Tadigadapa, Bharajamanka)
- **11** in Amaravathi (Capital Region, Tadepalli, Mangalagiri, Undavalli, Thullur, Nekkallu, Velagapudi, Krishna Delta, Buddha Vihar)

Prices:
- 4-star: ₹3,500 - ₹9,000/night
- 5-star: ₹9,000 - ₹120,000/night

Each hotel includes:
- 3-4 room types with 5 images each
- 5-6 hotel gallery images
- Amenities, policies, check-in/out times
- Star rating and guest rating data

### Images (js/data/images.js)

All image URLs are curated here for easy swapping. Categories:
- `exterior`, `lobby`, `room`, `suite`, `bathroom`, `pool`, `spa`, `restaurant`, `ballroom`

## How to Replace Images

All image URLs live in **`js/data/images.js`**, as two lookup tables that the whole
app reads — so you never touch HTML or other JS to change photos.

1. **Open `js/data/images.js`.** You'll see two objects:
   - `HOTEL_IMAGES = { "hyd001": ["…","…", …], … }` — one array per hotel gallery.
   - `ROOM_IMAGES  = { "hyd001-r1": ["…","…", …], … }` — one array per room type.
   The URLs are exposed to pages with `getHotelGallery(hotelId)` and
   `getRoomGallery(roomId)`.
2. **Replace any URL** with your own (e.g. an Unsplash direct URL):
   ```javascript
   "hyd001": [
     "https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1200&q=80",
     "https://your-cdn.com/lobby.jpg",
     /* …5–6 per hotel… */
   ],
   ```
3. **Save** — every page picks up the change automatically.

### Rules that MUST be kept
- **No URL may repeat anywhere** — not across two hotels, two rooms, or between a
  room and any hotel gallery. After editing, run `node tools/check-images.js` and
  it must report **0 duplicates**.
- Keep **5–6 images per gallery** (the checker flags any gallery with fewer than 5).

### Image Requirements
- Recommended width ≥ 1200px; JPG or WebP.
- The elegant navy/gold gradient `onerror` fallback in the UI is a **safety net only**
  — never rely on it to fill gaps. Replace dead links instead.

### Change a hotel's category labels (alt text), not the URLs
`hotels.js` keeps a small `images: ["exterior","lobby","pool","spa","restaurant"]`
array per hotel (and per room) purely to label each slot for alt text. The actual
URLs come from `js/data/images.js` by gallery id.

---

## Payment Gateway Integration

> **DEMO MODE ACTIVE:** All payments in this project are simulated. No real transactions occur. The `Payment.processPayment()` and `Payment.verifyUpi()` functions are simulation placeholders.

### Integrating Razorpay

1. **Include the SDK:**
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

2. **Replace `Payment.processPayment()` in `js/payment.js`:**
```javascript
processPayment(amount, orderData) {
  return new Promise((resolve, reject) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: amount * 100,  // Paise
      currency: "INR",
      name: "FRCC STAYS",
      description: "Hotel Booking Payment",
      order_id: orderData.orderId,  // From your backend
      handler: function(response) {
        // Verify payment with your backend
        fetch('/api/verify-payment', {
          method: 'POST',
          body: JSON.stringify(response)
        }).then(() => resolve({
          success: true,
          transactionId: response.razorpay_payment_id
        }));
      }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    
    rzp.on('payment.failed', (response) => {
      reject({ error: response.error.description });
    });
  });
}
```

3. **Backend Integration Required:**
   - Create a `/api/create-order` endpoint that calls Razorpay's Orders API
   - Create a `/api/verify-payment` endpoint to verify signatures
   - Store bookings server-side, not just in localStorage

### Real UPI Verification

Replace `Payment.verifyUpi()` in `js/payment.js`:

```javascript
verifyUpi(upiId) {
  return fetch('https://api.your-backend.com/verify-upi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upiId })
  })
  .then(res => res.json())
  .then(data => ({
    success: data.valid,
    holderName: data.name,
    maskedName: data.name_masked,
    upiId: upiId
  }));
}
```

**UPI Verification APIs:**
- **Razorpay:** Uses VPA validation APIs (contact Razorpay)
- **NPCI:** Direct UPI validation (requires merchant registration)
- **PayU/Cashfree:** UPI verification endpoints in merchant dashboard

### Payment Security Checklist
- [ ] Never log or store full card numbers
- [ ] Validate Luhn on frontend only for UX
- [ ] Always verify amounts server-side before processing
- [ ] Store only last 4 digits of card
- [ ] Use HTTPS for all payment pages
- [ ] Implement CSRF protection
- [ ] Return proper refund policies

---

## Cancellation System (single source of truth)

### Rule
A booking can be cancelled **at any time up to 48 hours before the check-in moment**
(check-in date at **2:00 PM IST**). Cancellation is allowed only if *now* is before
(deadline = check-in 14:00 IST minus 48h). A stay whose check-in is less than 48h
away is **non-cancellable from the start** — the guest is warned before paying.

### Config + helper (never duplicate this logic)
- `js/config.js` → `CONFIG.CANCELLATION_WINDOW_HOURS` (48), `CONFIG.CHECKIN_TIME`
  ("14:00"), `CONFIG.TIMEZONE` ("Asia/Kolkata"), `CONFIG.GST_RATE`, `CONFIG.REFUND_ETA`.
- `js/cancellation.js` → `getCancellationStatus(booking, currentUserId?)` returns
  `{ allowed, deadline, hoursLeft, reason }` (`reason`: ok / already-cancelled /
  completed / invalid-date / too-close / window-closed / not-yours), using real
  `Date` maths anchored to IST. Every page uses this function.
- `Cancellation` helpers: `countdownText(ms)`, `refundMessage(booking)`,
  `cancelButtonHTML`, `deadlineLineHTML`, `policyBoxHTML(checkIn)`,
  `openCancelModal(bookingId, { onSuccess })` (shared accessible modal: focus trap,
  Esc to close, double-submit guard, re-checks eligibility on open AND on confirm),
  `startTicker()` (live countdowns; auto-disables buttons on expiry).

### Where the Cancel option appears (always visible, never hidden in a menu)
1. **Confirmation page** — a prominent **“Manage This Booking”** box directly under the
   booking summary, with a **Cancel Booking** button (or a greyed-out button with
   *“Cancellation is allowed only up to 48 hours before check-in.”*) and the
   **“Free cancellation until … 2:00 PM”** line + a **Cancellation Policy** box.
2. **Right after payment** — a green success callout: *“Booking confirmed! You can
   cancel free of charge until [date] at 2:00 PM.”* with **View Booking** and
   **Cancel Booking** buttons.
3. **My Bookings** — every upcoming card shows a **Cancel Booking** button plus the
   free-cancellation line (and the greyed-out 48-hour message when the window closed).
4. **View Details modal** (inside My Bookings) — same Cancel button + policy line.

### Modal
Opens with a booking summary, a **reason** dropdown (Change of plans / Found a better
price / Booked by mistake / Travel dates changed / Other), the refund details, and
**Confirm Cancellation** / **Keep Booking**. On confirm: status → `cancelled`, rooms
release back to availability, a **cancellation ID `CAN-YYYYMMDD-XXXX`** is shown, and
the booking moves to the **Cancelled** filter.

### Implementation
```javascript
getCancellationStatus(booking, currentUserId) // { allowed, deadline, hoursLeft, reason }
Bookings.canCancel(booking, userId)           // delegates to the helper above
Bookings.getCancellationDeadline(booking)     // { text, canCancel, urgent } (wrapper)
Bookings.cancel(bookingId, reason, { userId })// enforces owner + re-checks window
```

### Refund Rules (simulated — demo mode, no real money; labelled in the UI)
| Method | Refund |
|--------|--------|
| UPI | "Refund of Rs X will be credited to your UPI account (id) in 5 to 7 working days." |
| Credit/Debit card | "…credited to your credit/debit card ending 1234 (Brand) in 5 to 7 working days." |
| Net Banking | "…credited to your {Bank} account in 5 to 7 working days." |
| Wallet | "…credited to your {Wallet} wallet in 5 to 7 working days." |
| Pay at Venue | "No payment was made, so there is nothing to refund." |

Cancelled cards show **"Refund initiated — {date}"** (or "No payment to refund").
On confirm, localStorage stores status, `cancelledAt`, reason, `cancellationId`
(`CAN-YYYYMMDD-XXXX`), and `refundInfo` (`status: 'initiated'`, `date`,
method-specific message).

A cancelled booking can never be cancelled again (its button is replaced by a
**Cancelled** badge).

### Statuses
- `confirmed` - Active booking
- `completed` - Stay has ended (shows a Completed badge, no cancel option)
- `cancelled` - Cancelled by user (with cancellation ID, reason, cancelled-on date and refund status)

### Safeguards
- Cancellation policy is shown on hotel details, room selection, guest details and
  payment pages (not only after booking), and the deadline prints on the receipt.
- Edge cases handled: IST-anchored maths, invalid/missing dates, cancelling another
  user's booking is blocked, double-click can't cancel twice, eligibility is
  re-checked when Cancel is clicked AND when Confirm is clicked.
- Cancel modal is accessible (focus trap, Esc to close) with clear toasts.

---

## Demo Data

The app seeds 5 demo bookings on first load for each user:
1. **Upcoming** — check-in in 10 days (cancellable)
2. **Upcoming** — check-in in 3 days (cancellable, deadline soon, live countdown)
3. **Upcoming** — check-in tomorrow (cancel blocked from the start)
4. **Completed** — a past stay (Completed badge, no cancel option)
5. **Cancelled** — cancellation ID, reason, cancelled-on date and "Refund initiated"

To clear demo data:
```javascript
localStorage.removeItem('frcc_bookings');
```

---

## Design System

### Colors
```css
--navy: #0B1F3A          /* Primary background, text */
--navy-light: #1a3a5c    /* Secondary tones */
--gold: #C9A24B          /* Accents, buttons, badges */
--gold-light: #e0c07a    /* Light accents */
--ivory: #faf8f5         /* Page background */
--white: #ffffff        /* Cards */
--success: #16a34a      /* Available badges */
--error: #dc2626        /* Errors, sold out */
--warning: #f59e0b      /* Limited availability */
```

### Typography
- **Headings:** Playfair Display (with Georgia fallback)
- **Body:** Inter (with system font fallback)
- Loaded from Google Fonts with `display=swap`

### Formatting
- **Currency:** ₹ with Indian lakh comma format (`₹1,85,000`)
- **Dates:** `DD MMM YYYY` (`09 Oct 2026`)

---

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- `alt` text on all images
- Skip-to-content link
- Keyboard focus styles (visible outlines)
- ARIA labels on interactive elements

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|---------------|
| 1200px+ | Full multi-column layout |
| 992px | Single column hotel details |
| 768px | Mobile navigation, stacked grids |
| 480px | Mobile-optimized, single column |

---

## Known Limitations (Demo)

- No server-side data persistence
- No real payment processing
- No email confirmations
- Auth is localStorage-based (not secure)
- Images depend on external CDNs (Unsplash, Pexels)

---

## Support

For questions or issues, check:
1. Browser console for errors
2. `localStorage` data integrity
3. Network tab for failed image requests

---

© 2026 FRCC RESORTS & STAYS. Demo hotel booking module.
