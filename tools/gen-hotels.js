// Generates the full hotels.js data file with all 36 hotels
import fs from 'fs';

const areas = {
  Hyderabad: ['Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Gachibowli', 'Begumpet', 'Shamshabad', 'Kondapur', 'Madhapur', 'Uppal', 'Secunderabad', 'Manikonda', 'Miyapur', 'Kukatpally', 'Dilsukhnagar'],
  Vijayawada: ['Benz Circle', 'MG Road', 'Gunadala', 'Bhavanipuram', 'Eluru Road', 'Penamaluru', 'Poranki', 'Kankipadu', 'Gannavaram', 'Tadigadapa', 'Bharajamanka'],
  Amaravathi: ['Capital Region', 'Tadepalli', 'Mangalagiri', 'Undavalli', 'Thullur', 'Nekkallu', 'Buddha Vihar', 'Krishna Delta', 'Velagapudi', 'Sunrise Road', 'Lakeside Manor']
};

const hotelNames = {
  Hyderabad: ['The Nizam Royale', 'Jubilee Hills Grand', 'HITEC City Towers', 'Gachibowli Grand Palace', 'Begumpet Heritage Inn', 'Shamshabad Airport Grand', 'Kondapur Serenity', 'Madhapur Skyline', 'Uppal Regency', 'Secunderabad Cantonment House', 'Manikonda Hills Retreat', 'Miyapur Meadows', 'Kukatpally Grand', 'Dilsukhnagar Diamond'],
  Vijayawada: ['Krishna Riverfront Palace', 'MG Road Majestic', 'Gunadala Heights', 'Bhavanipuram Bliss', 'Eluru Road Grand', 'Penamaluru Palace', 'Poranki Grand', 'Kankipadu Heights', 'Gannavaram Gateway', 'Tadigadapa Grand', 'Bharajamanka Vista'],
  Amaravathi: ['Amaravathi Grand Imperial', 'Tadepalli Serenity', 'Mangalagiri Heritage', 'Undavalli Caves Resort', 'Thullur Township Grand', 'Nekkallu Greens', 'Buddha Vihar Retreat', 'Krishna Delta Resort', 'Velagapudi Valley View', 'Sunrise Resort', 'Lakeside Manor']
};

const amenitiesPool = ['pool', 'spa', 'gym', 'fine-dining', 'bar', 'free-wifi', 'airport-transfer', 'parking', 'banquet', 'kids-zone'];

const roomTypes = [
  {
    suffix: 'dlx', name: 'Deluxe Room', size: [400, 480], bed: 'King Bed', maxOcc: 2,
    priceRange: [4500, 9000],
    gallery: ['bedroom', 'bed', 'seating', 'minibar', 'view', 'bathroom'],
    cats: ['Bedroom', 'Bed', 'Seating', 'Minibar', 'Balcony', 'Washroom']
  },
  {
    suffix: 'exe', name: 'Executive Suite', size: [650, 780], bed: 'King Bed', maxOcc: 3,
    priceRange: [9000, 18000],
    gallery: ['bedroom', 'bed', 'living', 'desk', 'view', 'bathroom'],
    cats: ['Bedroom', 'Bed', 'Living Area', 'Work Desk', 'Balcony', 'Washroom']
  },
  {
    suffix: 'pre', name: 'Presidential Suite', size: [1100, 1400], bed: 'King Bed', maxOcc: 4,
    priceRange: [22000, 38000],
    gallery: ['bedroom', 'bed', 'living', 'kitchen', 'view', 'bathroom'],
    cats: ['Bedroom', 'Bed', 'Living Area', 'Kitchen', 'Balcony', 'Washroom']
  }
];

const hotelCats = [
  ['exterior', 'Exterior'], ['lobby', 'Lobby'], ['pool', 'Pool'],
  ['restaurant', 'Restaurant'], ['kids-zone', 'Kids Zone'], ['park', 'Park'],
  ['banquet', 'Banquet Hall'], ['parking', 'Parking']
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genHotels() {
  const hotels = [];
  let hid = 1;
  for (const [area, localities] of Object.entries(areas)) {
    for (let i = 0; i < localities.length; i++) {
      const id = 'hyd-' + String(hid).padStart(2, '0');
      const name = hotelNames[area][i];
      const locality = localities[i];
      const stars = Math.random() > 0.4 ? 5 : 4;
      const priceFrom = stars === 5 ? 9000 + Math.floor(Math.random() * 6) * 1000 : 4500 + Math.floor(Math.random() * 4) * 1000;

      // 8 hotel gallery photos
      const gallery = hotelCats.map(([file, cat]) => ({
        file: `/images/hotels/${id}/${file}.jpg`,
        category: cat,
        alt: `${cat} at ${name}`
      }));

      // 3 room types
      const rooms = roomTypes.map(rt => {
        const price = rt.priceRange[0] + Math.floor(Math.random() * (rt.priceRange[1] - rt.priceRange[0]) / 500) * 500;
        const size = rt.size[0] + Math.floor(Math.random() * (rt.size[1] - rt.size[0]) / 20) * 20;
        const roomGallery = rt.gallery.map((g, gi) => ({
          file: `/images/rooms/${id}-${rt.suffix}/${g}.jpg`,
          category: rt.cats[gi],
          alt: `${rt.cats[gi]} in ${rt.name} at ${name}`
        }));
        return {
          id: `${id}-${rt.suffix}`,
          name: rt.name,
          size,
          bed: rt.bed,
          maxOccupancy: rt.maxOcc,
          pricePerNight: price,
          amenities: ['Free Wi-Fi', 'Smart TV', 'Rain Shower', ...(stars === 5 ? ['Club Lounge', 'Premium Toiletries'] : ['Garden View'])],
          gallery: roomGallery
        };
      });

      hotels.push({
        id, name, area, locality, stars, priceFrom,
        amenities: amenitiesPool.slice(0, 7 + Math.floor(Math.random() * 4)),
        gallery,
        rooms
      });
      hid++;
    }
  }
  return hotels;
}

const hotels = genHotels();
const output = `// Auto-generated: ${hotels.length} fictional hotels\nconst HOTELS = ${JSON.stringify(hotels, null, 2)};\nexport default HOTELS;\n`;
fs.writeFileSync('src/modules/hotel-booking/data/hotels.js', output);
console.log('Generated', hotels.length, 'hotels');
console.log('Room galleries:', hotels.reduce((s, h) => s + h.rooms.length, 0));
