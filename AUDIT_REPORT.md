# Image Audit Report - FRCC Hotel Booking

## Summary
- **Total Hotels:** 36
- **Total Hotel Gallery Photos:** 360 (36 hotels × 10 photos each)
- **Total Room Gallery Photos:** ~700 (108 rooms × 6-8 photos each)
- **Grand Total:** ~1,060 photos

## Risk Assessment by Category

### Hotel Gallery Categories (10 per hotel)

| Category | Count | Search Term Used | Risk Level | Reason |
|----------|-------|------------------|------------|--------|
| Exterior | 36 | "luxury hotel exterior facade architecture" | 🟡 MEDIUM | Could include beach resort exteriors |
| Lobby | 36 | "luxury hotel lobby reception marble" | 🟢 LOW | Indoor, unlikely to show sea |
| **Pool** | 36 | **"luxury hotel infinity pool resort"** | 🔴 **HIGH** | "Resort" + "infinity pool" strongly suggests beach/sea backdrop |
| Restaurant | 36 | "luxury hotel restaurant fine dining interior" | 🟢 LOW | Indoor |
| Kids Zone | 36 | "luxury hotel kids play zone indoor" | 🟢 LOW | Indoor |
| Park | 36 | "luxury hotel garden park landscaping" | 🟡 MEDIUM | Could be tropical gardens |
| Banquet Hall | 36 | "luxury hotel banquet hall ballroom" | 🟢 LOW | Indoor |
| Parking | 36 | "luxury hotel parking entrance valet" | 🟢 LOW | Outdoor but urban |
| Gym Floor | 36 | "luxury hotel gym fitness center treadmills weights" | 🟢 LOW | Indoor |
| Gym Close-up | 36 | "luxury hotel gym dumbbells cable machines yoga area" | 🟢 LOW | Indoor |

### Room Gallery Categories (6-8 per room)

| Category | Count | Risk Level | Reason |
|----------|-------|------------|--------|
| Bedroom | ~108 | 🟢 LOW | Indoor |
| Bed | ~108 | 🟢 LOW | Indoor close-up |
| Seating | ~108 | 🟢 LOW | Indoor |
| Living Area | ~72 | 🟢 LOW | Indoor |
| Kitchen | ~36 | 🟢 LOW | Indoor |
| Minibar | ~72 | 🟢 LOW | Indoor |
| Washroom | ~108 | 🟢 LOW | Indoor |
| Work Desk | ~72 | 🟢 LOW | Indoor |
| Wardrobe | ~36 | 🟢 LOW | Indoor |
| **Balcony/View** | ~108 | 🔴 **HIGH** | "luxury hotel room balcony view city garden" but could return sea views |

## Photo Distribution Pattern
- Hotel categories use **10 photos per category** in round-robin across 36 hotels
- Room categories use **6-10 photos per category** in round-robin
- This means only ~10 unique photos per category are reused across all hotels

## Audit Recommendation

### IMMEDIATE REPLACEMENT (Highest Priority)
1. **Pool (36 photos)** - Search term "infinity pool resort" virtually guarantees beach/sea backdrop
2. **Balcony/View (108 room photos)** - Room views could show sea instead of city

### SECONDARY REPLACEMENT (Medium Priority)  
3. **Exterior (36 photos)** - Could include beach resort facades
4. **Park (36 photos)** - Could include tropical gardens

### KEEP (Low Risk)
- Lobby, Restaurant, Kids Zone, Banquet, Parking, Gym (all indoor)
- Bedroom, Bed, Seating, Living Area, Kitchen, Minibar, Washroom, Work Desk, Wardrobe (all indoor)

## Replacement Strategy
1. **Phase 1:** Replace Pool for all 36 hotels with city-style rooftop pool photos
2. **Phase 2:** Replace Balcony/View for all rooms with city skyline/garden views
3. **Phase 3:** Replace Exterior for all hotels with city hotel tower/facade photos
4. **Phase 4:** Replace Park with urban garden/courtyard photos

## First 3 Hotels (Visible on Landing Page)
1. **The Nizam Royale (hyd-01)** - Hyderabad
2. **Jubilee Hills Grand (hyd-02)** - Hyderabad  
3. **HITEC City Towers (hyd-03)** - Hyderabad

These use pool photos #1, #2, #3 from the round-robin pool set.

## Next Steps
1. Source 10 verified city-style rooftop pool photos (Unsplash/Pexels)
2. Source 10 verified city skyline balcony view photos
3. Source 10 verified city hotel exterior photos
4. Source 10 verified urban garden/courtyard photos
5. Download and replace in batches
6. Update manifests and CREDITS.md