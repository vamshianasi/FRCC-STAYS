# Missing Photos Report — FRCC HOTEL BOOKING

Generated: 2025-10-12

## Summary
- **36 hotels** × 10 photos each (8 existing + 2 gym) = **360 hotel photos needed**
- **108 rooms** × 8 photos each = **864 room photos needed**
- **Total: 1,224 photos** to download
- Currently have: **14 placeholder SVGs** (hyd-01 hotel + hyd-01-dlx room)
- **Missing: 1,210 photos**

## Hotels Missing Gym Photos (All 36 Hotels Need 2 Gym Photos Each = 72 Total)
All 36 hotels need 2 gym photos each:
- `gym-floor.jpg` — Wide view of gym floor (treadmills, cross-trainers, weights)
- `gym-closeup.jpg` — Close-up (dumbbell rack, cable machines, or yoga/stretching area)

### 5-Star Hotels (get larger gym with yoga area):
- hyd-01, hyd-02, hyd-03, hyd-04, hyd-05, hyd-06, hyd-07, hyd-08, hyd-09, hyd-10, hyd-11, hyd-12, hyd-13, hyd-14
- vij-01, vij-02, vij-03, vij-04, vij-05, vij-06, vij-07, vij-08, vij-09, vij-10, vij-11
- ama-01, ama-02, ama-03, ama-04, ama-05, ama-06, ama-07, ama-08, ama-09, ama-10, ama-11

### 4-Star Hotels (compact fitness room):
- hyd-15 through hyd-36 (22 hotels)

**Gym photos needed: 36 hotels × 2 = 72 photos**

## Hotel Galleries Missing (35 hotels × 8 photos = 280 photos)
All hotels except hyd-01 need all 8 gallery photos:
- exterior.jpg, lobby.jpg, pool.jpg, restaurant.jpg, kids-zone.jpg, park.jpg, banquet.jpg, parking.jpg

## Room Galleries Missing (107 rooms × 6-8 photos = ~864 photos)

### hyd-01 rooms (only hyd-01-dlx has placeholders):
- hyd-01-exe: bedroom, bed, living, desk, view, bathroom (6 photos)
- hyd-01-pre: bedroom, bed, living, kitchen, view, bathroom (6 photos)

### All other 107 rooms (hyd-02 through hyd-36, vij-01 through vij-11, ama-01 through ama-11):
Each room needs 6-8 photos based on tier:

**Deluxe Rooms (6 photos):**
- bedroom.jpg, bed.jpg, seating.jpg, minibar.jpg, view.jpg, bathroom.jpg

**Executive Suites (7 photos):**
- bedroom.jpg, bed.jpg, living.jpg, desk.jpg, view.jpg, bathroom.jpg

**Presidential Suites (8 photos):**
- bedroom.jpg, bed.jpg, living.jpg, kitchen.jpg, view.jpg, bathroom.jpg, wardrobe.jpg (optional)

### Room Categories by Tier:
| Tier | Categories (6-8 photos) |
|------|------------------------|
| Deluxe | bedroom, bed, seating, minibar, view, bathroom |
| Executive | bedroom, bed, living, desk, view, bathroom |
| Presidential | bedroom, bed, living, kitchen, view, bathroom, wardrobe |

## Directory Structure Expected
```
public/images/
├── areas/ (3 files - DONE)
│   ├── hyderabad.svg
│   ├── vijayawada.svg
│   └── amaravathi.svg
├── hotels/
│   ├── hyd-01/ (8 done)
│   │   ├── exterior.svg, lobby.svg, pool.svg, restaurant.svg
│   │   ├── kids-zone.svg, park.svg, banquet.svg, parking.svg
│   │   └── gym-floor.svg, gym-closeup.svg (NEED 2)
│   ├── hyd-02/ through hyd-36/ (each needs 10 files)
│   ├── vij-01/ through vij-11/ (each needs 10 files)
│   └── ama-01/ through ama-11/ (each needs 10 files)
└── rooms/
    ├── hyd-01-dlx/ (6 done)
    │   ├── bedroom.svg, bed.svg, seating.svg, minibar.svg, view.svg, bathroom.svg
    │   └── living.svg, kitchen.svg (NEED 2 more for 8 total)
    ├── hyd-01-exe/ (0/7)
    │   ├── bedroom, bed, living, desk, view, bathroom
    │   └── kitchen (for 7 total)
    ├── hyd-01-pre/ (0/8)
    │   ├── bedroom, bed, living, kitchen, view, bathroom, wardrobe
    └── ... 107 more room directories
```

## Required Actions

### Batch 1: Hotels 1-12 (hyd-01 through hyd-12)
1. **Gym photos**: 12 hotels × 2 = 24 gym photos
2. **Hotel galleries**: 11 hotels × 8 = 88 photos (hyd-01 done)
3. **Room photos**: ~36 rooms × 6-8 = 216-288 photos
4. Run check after batch

### Batch 2: Hotels 13-24 (hyd-13 through hyd-24)
1. **Gym photos**: 12 hotels × 2 = 24 gym photos
2. **Hotel galleries**: 12 hotels × 8 = 96 photos
3. **Room photos**: ~36 rooms × 6-8 = 216-288 photos
4. Run check after batch

### Batch 3: Hotels 25-36 (hyd-25 through hyd-36, vij-01-11, ama-01-11)
1. **Gym photos**: 12 hotels × 2 = 24 gym photos
2. **Hotel galleries**: 12 hotels × 8 = 96 photos
4. **Room photos**: ~36 rooms × 6-8 = 216-288 photos
5. Run check after batch

## Download Script
See `tools/download-images.js` for automated download from Unsplash/Pexels with:
- Category-specific search terms
- Landscape orientation, ~1600px wide, <400KB
- Visual check prompts
- CREDITS.md generation

## Verification Checklist
After each batch, run:
```bash
node src/modules/hotel-booking/tools/check-images.js
```
Expected output:
```
0 duplicates, 0 missing files, 0 incomplete galleries, 36/36 hotels have gym photos
```

## Notes
- All photos must be: landscape, ~1600px wide, <400KB, WebP or JPG
- No hotlinks, no watermarks, no brand logos, no posed people
- Natural look: soft daylight, true colors, lived-in feel
- Update `images/CREDITS.md` with photographer + source URL per photo
- Gym photos: 5-star = large gym + yoga area; 4-star = compact fitness room