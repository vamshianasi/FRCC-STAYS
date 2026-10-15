/**
 * FRCC STAYS - Hotel Data
 * 25 hotels: 14 Hyderabad, 11 Vijayawada
 * All names are fictional. Prices in INR.
 * Amenities: Free Wi-Fi and Parking only.
 * GST: 18% (confirm with finance team).
 * Star ratings: 3-star or 4-star only.
 * Suite Room: Rs 4,500 to Rs 10,000 per night.
 * Normal Room: Rs 2,500 to Rs 4,500 per night.
 * Suite always priced higher than Normal in same hotel.
 */

const HOTELS = [
  // ============ HYDERABAD (14) ============
  {
    id: "hyd001",
    name: "The Nizam Royale",
    area: "Hyderabad",
    locality: "Banjara Hills",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
    stars: 4,
    guestRating: 9.2,
    reviewCount: 1847,
    description: "A heritage hotel in Banjara Hills featuring classic architecture and modern comforts. Located near IT parks and business districts, it offers a convenient stay for travelers exploring Hyderabad.",
    priceFrom: 3200,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Early check-in subject to availability", "Smoking permitted in designated areas only"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd001-r1", name: "Suite Room", size: 450, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7200, totalRooms: 6, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd001-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3200, totalRooms: 10, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd002",
    name: "Jubilee Hills Grand",
    area: "Hyderabad",
    locality: "Jubilee Hills",
    address: "Plot 458, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
    stars: 4,
    guestRating: 9.0,
    reviewCount: 1523,
    description: "An urban sanctuary perched above Jubilee Hills with panoramic city views, offering modern comforts and a peaceful retreat for travelers exploring Hyderabad.",
    priceFrom: 3800,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Early check-in subject to availability", "Guests below 18 not allowed in the premises. Timings 6 AM - 10 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd002-r1", name: "Suite Room", size: 500, bed: "King Bed", maxOccupancy: 4, pricePerNight: 8500, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd002-r2", name: "Normal Room", size: 300, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4200, totalRooms: 12, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd003",
    name: "HITEC City Towers",
    area: "Hyderabad",
    locality: "HITEC City",
    address: "Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana 500081",
    stars: 4,
    guestRating: 8.6,
    reviewCount: 2104,
    description: "A sleek business hotel in the heart of Hyderabad's tech corridor. Floor-to-ceiling windows and smart-room technology make it the preferred choice for corporate travelers and weekend explorers alike.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Quiet hours 10 PM - 6 AM", "No outside food in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd003-r1", name: "Suite Room", size: 380, bed: "King Bed", maxOccupancy: 3, pricePerNight: 9200, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd003-r2", name: "Normal Room", size: 250, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4800, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd004",
    name: "Gachibowli Grand",
    area: "Hyderabad",
    locality: "Gachibowli",
    address: "Nanakramguda, Financial District, Gachibowli, Hyderabad, Telangana 500032",
    stars: 4,
    guestRating: 8.9,
    reviewCount: 1287,
    description: "A contemporary hotel in Gachibowli's financial district offering modern amenities and comfortable rooms for business and leisure travelers.",
    priceFrom: 4200,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Smart casual dress code in public areas", "No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd004-r1", name: "Suite Room", size: 550, bed: "King Bed", maxOccupancy: 4, pricePerNight: 9800, totalRooms: 7, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd004-r2", name: "Normal Room", size: 300, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4500, totalRooms: 14, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd005",
    name: "Begumpet Heritage Inn",
    area: "Hyderabad",
    locality: "Begumpet",
    address: "1-10-60, Begumpet, Hyderabad, Telangana 500016",
    stars: 4,
    guestRating: 8.4,
    reviewCount: 976,
    description: "A restored colonial-era mansion turned boutique hotel offering personalized service and comfortable rooms in Begumpet area.",
    priceFrom: 3500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Heritage building - please respect the architecture", "No loud music after 10 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd005-r1", name: "Suite Room", size: 420, bed: "King Bed", maxOccupancy: 3, pricePerNight: 6800, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd005-r2", name: "Normal Room", size: 260, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3500, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd006",
    name: "Shamshabad transit Grand",
    area: "Hyderabad",
    locality: "Shamshabad",
    address: "Near Rajiv Gandhi International transit, Shamshabad, Hyderabad, Telangana 500108",
    stars: 4,
    guestRating: 8.2,
    reviewCount: 1654,
    description: "A convenient transit hotel near RGIA offering soundproofed rooms and Complimentary shuttle for early departures and late arrivals.",
    priceFrom: 4000,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Complimentary shuttle every 30 minutes", "Early check-in available for transit guests"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd006-r1", name: "Suite Room", size: 400, bed: "King Bed", maxOccupancy: 4, pricePerNight: 6200, totalRooms: 12, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd006-r2", name: "Normal Room", size: 240, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3000, totalRooms: 20, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd007",
    name: "Kondapur Serenity",
    area: "Hyderabad",
    locality: "Kondapur",
    address: "Plot 89, Kondapur, Hyderabad, Telangana 500084",
    stars: 4,
    guestRating: 8.5,
    reviewCount: 1123,
    description: "A calm retreat in bustling Kondapur with rooms designed around natural light and peaceful surroundings for families and business travelers.",
    priceFrom: 4800,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Children stay free (under 12). Timings 6 AM - 9 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd007-r1", name: "Suite Room", size: 480, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7500, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd007-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4000, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd008",
    name: "Madhapur Skyline",
    area: "Hyderabad",
    locality: "Madhapur",
    address: "Cyber Gateway, Madhapur, Hyderabad, Telangana 500081",
    stars: 4,
    guestRating: 8.3,
    reviewCount: 1345,
    description: "A contemporary hotel above the Madhapur skyline offering stunning city views and smart-home automation rooms close to HITEC City tech campuses.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Rooftop lounge 21+ entry. No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd008-r1", name: "Suite Room", size: 450, bed: "King Bed", maxOccupancy: 4, pricePerNight: 8200, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd008-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4600, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd009",
    name: "Uppal Regency",
    area: "Hyderabad",
    locality: "Uppal",
    address: "Survey No. 123, Uppal, Hyderabad, Telangana 500039",
    stars: 4,
    guestRating: 8.1,
    reviewCount: 876,
    description: "A grand hotel in eastern Hyderabad combining traditional hospitality with modern comforts. Known for easy access to both city and outskirts.",
    priceFrom: 4000,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Bookings require 50% advance payment", "No outside alcohol"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd009-r1", name: "Suite Room", size: 400, bed: "King Bed", maxOccupancy: 3, pricePerNight: 6500, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd009-r2", name: "Normal Room", size: 250, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3600, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd010",
    name: "Secunderabad Cantonment",
    area: "Hyderabad",
    locality: "Secunderabad",
    address: "1-8-303, MG Road, Secunderabad, Hyderabad, Telangana 500003",
    stars: 4,
    guestRating: 8.8,
    reviewCount: 1432,
    description: "A heritage hotel in the heart of Secunderabad's cantonment area offering colonial architecture and comfortable rooms for diplomats and business leaders.",
    priceFrom: 4800,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Smart casual dress code in public areas", "No photography in heritage wing"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd010-r1", name: "Suite Room", size: 500, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7800, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd010-r2", name: "Normal Room", size: 300, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4200, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd011",
    name: "Manikonda Hills Retreat",
    area: "Hyderabad",
    locality: "Manikonda",
    address: "Lanco Hills Road, Manikonda, Hyderabad, Telangana 500089",
    stars: 4,
    guestRating: 9.1,
    reviewCount: 987,
    description: "A private retreat in the Manikonda hills offering peaceful surroundings and comfortable rooms for families and business travelers seeking privacy.",
    priceFrom: 5500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Private private rooms only - no shared walls", "No loud music after 10 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd011-r1", name: "Suite Room", size: 550, bed: "King Bed", maxOccupancy: 4, pricePerNight: 9500, totalRooms: 6, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd011-r2", name: "Normal Room", size: 300, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4800, totalRooms: 12, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd012",
    name: "Miyapur Meadows",
    area: "Hyderabad",
    locality: "Miyapur",
    address: "Plot 45, Miyapur, Hyderabad, Telangana 500049",
    stars: 4,
    guestRating: 8.0,
    reviewCount: 765,
    description: "A comfortable and well-connected hotel in Miyapur ideal for business travelers and families. Clean rooms and friendly service at affordable prices.",
    priceFrom: 4200,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Children stay free (under 10). Timings 7 AM - 9 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd012-r1", name: "Suite Room", size: 420, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7000, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd012-r2", name: "Normal Room", size: 260, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3800, totalRooms: 20, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd013",
    name: "Kukatpally Grand",
    area: "Hyderabad",
    locality: "Kukatpally",
    address: "NH-65, Kukatpally, Hyderabad, Telangana 500072",
    stars: 4,
    guestRating: 8.2,
    reviewCount: 1098,
    description: "A modern hotel on the NH-65 corridor offering easy access to both Hyderabad and its outskirts. Rooftop seating and spacious rooms with good facilities.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Bookings require 50% advance payment", "No outside food in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd013-r1", name: "Suite Room", size: 450, bed: "King Bed", maxOccupancy: 4, pricePerNight: 8000, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd013-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4000, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "hyd014",
    name: "Dilsukhnagar Diamond",
    area: "Hyderabad",
    locality: "Dilsukhnagar",
    address: "Plot 78, Dilsukhnagar, Hyderabad, Telangana 500060",
    stars: 4,
    guestRating: 7.9,
    reviewCount: 654,
    description: "A reliable and comfortable hotel in Dilsukhnagar offering clean rooms, prompt service and good value for business travelers and families visiting eastern Hyderabad.",
    priceFrom: 4000,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Timings 7 AM - 8 PM", "No outside food in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "hyd014-r1", name: "Suite Room", size: 420, bed: "King Bed", maxOccupancy: 3, pricePerNight: 7200, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "hyd014-r2", name: "Normal Room", size: 260, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3400, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },

  // ============ VIJAYAWADA (11) ============
  {
    id: "vij001",
    name: "Krishna Riverfront",
    area: "Vijayawada",
    locality: "Benz Circle",
    address: "Benz Circle, Vijayawada, Andhra Pradesh 520010",
    stars: 4,
    guestRating: 9.3,
    reviewCount: 2156,
    description: "A hotel near Benz Circle offering river views and comfortable rooms for travelers exploring Vijayawada. Popular with both business and leisure visitors.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Rooftop lounge 21+ entry. No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij001-r1", name: "Suite Room", size: 550, bed: "King Bed", maxOccupancy: 4, pricePerNight: 8800, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij001-r2", name: "Normal Room", size: 300, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 4000, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij002",
    name: "MG Road Majestic",
    area: "Vijayawada",
    locality: "MG Road",
    address: "MG Road, Labbipet, Vijayawada, Andhra Pradesh 520010",
    stars: 4,
    guestRating: 8.5,
    reviewCount: 1432,
    description: "A grand hotel on Vijayawada's iconic MG Road offering colonial-era charm with modern comforts and a convenient location for shopping and dining.",
    priceFrom: 4000,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Smart casual dress code in public areas. No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij002-r1", name: "Suite Room", size: 500, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7500, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij002-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3500, totalRooms: 15, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij003",
    name: "Gunadala Heights",
    area: "Vijayawada",
    locality: "Gunadala",
    address: "Gunadala, Vijayawada, Andhra Pradesh 520004",
    stars: 4,
    guestRating: 8.3,
    reviewCount: 1087,
    description: "A peaceful hotel overlooking Gunadala Mary Matha Church offering modern comforts and a convenient location for pilgrims and leisure travelers exploring Vijayawada.",
    priceFrom: 4200,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Quiet hours 9 PM - 6 AM", "No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij003-r1", name: "Suite Room", size: 480, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7200, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij003-r2", name: "Normal Room", size: 260, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3300, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij004",
    name: "Bhavanipuram Bliss",
    area: "Vijayawada",
    locality: "Bhavanipuram",
    address: "Bhavanipuram, Vijayawada, Andhra Pradesh 520012",
    stars: 4,
    guestRating: 8.1,
    reviewCount: 876,
    description: "A cozy boutique hotel in Bhavanipuram offering personalized service and home-like comfort. Famous for authentic Andhra breakfast and warm hospitality.",
    priceFrom: 3500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Children stay free (under 10). Timings 7 AM - 9 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij004-r1", name: "Suite Room", size: 420, bed: "King Bed", maxOccupancy: 3, pricePerNight: 6500, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij004-r2", name: "Normal Room", size: 240, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3000, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij005",
    name: "Eluru Road Grand",
    area: "Vijayawada",
    locality: "Eluru Road",
    address: "Eluru Road, Vijayawada, Andhra Pradesh 520002",
    stars: 4,
    guestRating: 8.0,
    reviewCount: 765,
    description: "A well-appointed hotel on the Eluru Road corridor offering easy highway access and modern amenities for business travelers and families road-tripping along the Vijayawada-Eluru route.",
    priceFrom: 3800,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Timings 7 AM - 9 PM", "No outside food in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij005-r1", name: "Suite Room", size: 400, bed: "King Bed", maxOccupancy: 4, pricePerNight: 6200, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij005-r2", name: "Normal Room", size: 250, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 2800, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij006",
    name: "Penamaluru Palace",
    area: "Vijayawada",
    locality: "Penamaluru",
    address: "Penamaluru, Vijayawada, Andhra Pradesh 521139",
    stars: 4,
    guestRating: 8.7,
    reviewCount: 1234,
    description: "A modern hotel in Penamaluru offering comfortable rooms, a rooftop seating area and easy highway access for business travelers and families.",
    priceFrom: 4800,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Traditional dress encouraged for evening events. No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij006-r1", name: "Suite Room", size: 520, bed: "King Bed", maxOccupancy: 4, pricePerNight: 9500, totalRooms: 7, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij006-r2", name: "Normal Room", size: 280, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3800, totalRooms: 15, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij007",
    name: "Poranki Grand",
    area: "Vijayawada",
    locality: "Poranki",
    address: "Poranki, Vijayawada, Andhra Pradesh 520008",
    stars: 4,
    guestRating: 8.2,
    reviewCount: 943,
    description: "A modern hotel in Poranki offering comfortable rooms, rooftop seating and easy access to Vijayawada transit for transit stays and business travel.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Complimentary shuttle. No smoking in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij007-r1", name: "Suite Room", size: 460, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7800, totalRooms: 10, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij007-r2", name: "Normal Room", size: 270, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3600, totalRooms: 16, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij008",
    name: "Kankipadu Heights",
    area: "Vijayawada",
    locality: "Kankipadu",
    address: "Kankipadu, Vijayawada, Andhra Pradesh 521151",
    stars: 4,
    guestRating: 7.9,
    reviewCount: 678,
    description: "A serene hotel in Kankipadu surrounded by green offering peaceful escape from the city while being minutes from Vijayawada's major attractions.",
    priceFrom: 4000,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Children stay free (under 10). Timings 7 AM - 8 PM"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij008-r1", name: "Suite Room", size: 440, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7000, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij008-r2", name: "Normal Room", size: 260, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3200, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij009",
    name: "Gannavaram Gateway",
    area: "Vijayawada",
    locality: "Gannavaram",
    address: "Gannavaram, Vijayawada, Andhra Pradesh 521101",
    stars: 4,
    guestRating: 8.1,
    reviewCount: 812,
    description: "Located near Vijayawada's international transit, the perfect choice for early morning flights and late arrivals. Modern rooms and complimentary shuttle service for transit guests.",
    priceFrom: 4500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Complimentary shuttle every 30 minutes", "Early check-in subject to availability"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij009-r1", name: "Suite Room", size: 480, bed: "King Bed", maxOccupancy: 4, pricePerNight: 8200, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij009-r2", name: "Normal Room", size: 290, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3800, totalRooms: 20, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij010",
    name: "Tadigadapa Grand",
    area: "Vijayawada",
    locality: "Tadigadapa",
    address: "Tadigadapa, Vijayawada, Andhra Pradesh 521137",
    stars: 4,
    guestRating: 8.0,
    reviewCount: 723,
    description: "A comfortable hotel in Tadigadapa offering good value and modern amenities for business travelers and families visiting the industrial areas of Vijayawada.",
    priceFrom: 4200,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "Timings 7 AM - 9 PM", "No outside food in rooms"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij010-r1", name: "Suite Room", size: 460, bed: "King Bed", maxOccupancy: 4, pricePerNight: 7500, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij010-r2", name: "Normal Room", size: 270, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3400, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  },
  {
    id: "vij011",
    name: "Bharajamanka Vista",
    area: "Vijayawada",
    locality: "Bharajamanka",
    address: "Bharajamanka, Vijayawada, Andhra Pradesh 520001",
    stars: 4,
    guestRating: 7.8,
    reviewCount: 589,
    description: "A budget-friendly hotel in Bharajamanka offering clean rooms and essential amenities for travelers seeking comfort without breaking the bank.",
    priceFrom: 3500,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    policies: ["No pets allowed", "Valid government ID required at check-in", "No outside food in rooms. Check-out after 11 AM may incur additional charges"],
    images: ["exterior", "lobby", "room", "room", "room", "room"],
    rooms: [
      { id: "vij011-r1", name: "Suite Room", size: 400, bed: "King Bed", maxOccupancy: 4, pricePerNight: 6800, totalRooms: 8, images: ["bedroom", "bed", "living area", "balcony", "washroom", "work desk"] },
      { id: "vij011-r2", name: "Normal Room", size: 250, bed: "Queen Bed", maxOccupancy: 3, pricePerNight: 3200, totalRooms: 18, images: ["bedroom", "bed", "work desk", "window view", "washroom", "tea corner"] }
    ]
  }
];