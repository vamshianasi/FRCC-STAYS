# FRCC STAYS - Implementation Plan

## Build Order

### Phase 1: Data Layer (foundation)
1. `js/data/images.js` - Curated categorized image pool (exterior, lobby, room, suite, bathroom, pool, spa, restaurant, ballroom) from Unsplash/Pexels
2. `js/data/hotels.js` - 36 hotels (14 Hyderabad, 11 Vijayawada, 11 Amaravathi) with room types

### Phase 2: Core Infrastructure
3. `js/auth.js` - localStorage authentication
4. `js/bookings.js` - Booking CRUD, availability, cancellation logic
5. `js/app.js` - Shared utilities (currency, dates, gallery, lightbox, toasts, header, footer)

### Phase 3: Styles
6. `css/style.css` - Luxury design system (navy #0B1F3A + gold #C9A24B)

### Phase 4: Pages (in user-flow order)
7. `index.html` - Landing (hero, search card, featured hotels, area cards)
8. `hotels.html` - Search results (filters, sorting)
9. `hotel-details.html` - Hotel details + room availability
10. `guest-details.html` - Guest form + sticky summary
11. `payment.html` - UPI/Cards/NetBanking/Wallets/Pay-at-Venue with UPI verification
12. `confirmation.html` - Success animation + booking summary
13. `my-bookings.html` - Bookings with tabs (Upcoming/Completed/Cancelled)
14. `signin.html` - Sign in/up
15. `README.md`

### Phase 5: Testing
- Full flow: Landing -> Search -> Hotel -> Room -> Details -> UPI verify -> Pay -> Confirmation -> My Bookings -> Cancel
- Edge cases: <48hr cancellation block, sold-out rooms, guest capacity filtering

## Key Decisions
- Use Unsplash direct URLs (stable, hotlink-friendly) with `onerror` gradient fallback
- `sessionStorage` for booking flow state, `localStorage` for bookings/user
- Simulated UPI verification via `verifyUpi()` Promise interface ( Razorpay-ready )
- 18% GST on room price, price breakdown on every summary
- Seeded demo bookings for testing cancellation rules
