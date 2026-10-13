import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\DELL\\OneDrive\\Desktop\\FRCC RESORTS &STAYS';

console.log('ROOT:', ROOT);
console.log('CREDITS path:', path.join(ROOT, 'images', 'CREDITS.md'));
console.log('Exists:', fs.existsSync(path.join(ROOT, 'images', 'CREDITS.md')));

const credits = [
  { city: 'Hyderabad', landmark: 'Charminar', file: 'charminar1', pexelsId: '3717267', alt: 'Charminar monument in Hyderabad at dusk' },
  { city: 'Hyderabad', landmark: 'Charminar', file: 'charminar2', pexelsId: '1497259', alt: 'Charminar four minarets illuminated at night' },
  { city: 'Hyderabad', landmark: 'Golconda Fort', file: 'golconda', pexelsId: '3717271', alt: 'Golconda Fort ramparts and walls' },
  { city: 'Hyderabad', landmark: 'Hussain Sagar Lake', file: 'hussain-sagar', pexelsId: '3717272', alt: 'Hussain Sagar Lake with Buddha statue at sunset' },
  { city: 'Vijayawada', landmark: 'Prakasam Barrage', file: 'prakasam1', pexelsId: '3717274', alt: 'Prakasam Barrage across Krishna River at dusk' },
  { city: 'Vijayawada', landmark: 'Prakasam Barrage', file: 'prakasam2', pexelsId: '1497263', alt: 'Prakasam Barrage gates and river view' },
  { city: 'Vijayawada', landmark: 'Kanaka Durga Temple', file: 'kanaka-durga', pexelsId: '3717275', alt: 'Kanaka Durga Temple on Indrakeeladri hill' },
  { city: 'Vijayawada', landmark: 'Bhavani Island', file: 'bhavani-island', pexelsId: '3717276', alt: 'Bhavani Island on Krishna River with greenery' },
  { city: 'Amaravathi', landmark: 'Amaravati Stupa', file: 'amaravati-stupa', pexelsId: '1497266', alt: 'Amaravati Stupa Mahachaitya ancient ruins' },
  { city: 'Amaravathi', landmark: 'Amareswara Temple', file: 'amareswara1', pexelsId: '3717279', alt: 'Amareswara Swamy Temple gopuram' },
  { city: 'Amaravathi', landmark: 'Amareswara Temple', file: 'amareswara2', pexelsId: '1497267', alt: 'Amareswara Temple intricate carvings' },
  { city: 'Amaravathi', landmark: 'Dhyana Buddha', file: 'dhyana-buddha', pexelsId: '3717280', alt: 'Dhyana Buddha statue meditation pose' },
  { city: 'Amaravathi', landmark: 'Dhyana Buddha', file: 'dhyana-buddha2', pexelsId: '1497268', alt: 'Dhyana Buddha statue riverside view' },
  { city: 'Amaravathi', landmark: 'Krishna River', file: 'krishna-river', pexelsId: '3717281', alt: 'Krishna River banks at Amaravathi' },
];

let creditsMd = '\n## Area Landmark Collages\n\n';
creditsMd += '| City | Landmark | File | Pexels ID | Alt Text | Source | License |\n';
creditsMd += '|------|----------|------|-----------|----------|--------|---------|\n';

credits.forEach(c => {
  creditsMd += `| ${c.city} | ${c.landmark} | ${c.file}.webp | ${c.pexelsId} | ${c.alt} | Pexels | Pexels License |\n`;
});

// Append to existing CREDITS.md
const creditsPath = path.join(ROOT, 'images', 'CREDITS.md');
let existingCredits = '';
if (fs.existsSync(creditsPath)) {
  existingCredits = fs.readFileSync(creditsPath, 'utf8');
}

// Remove any existing Area Landmark Collages section
existingCredits = existingCredits.replace(/## Area Landmark Collages\n[\s\S]*?(?=\n## |\n---|$)/, '');

// Insert before last --- or at end
const insertPos = existingCredits.lastIndexOf('---');
if (insertPos !== -1) {
  existingCredits = existingCredits.slice(0, insertPos) + creditsMd + '\n' + existingCredits.slice(insertPos);
} else {
  existingCredits += creditsMd;
}

fs.writeFileSync(creditsPath, existingCredits);
console.log('✓ Updated images/CREDITS.md with landmark credits');

// Also create a manifest file for the area images
const manifest = {
  'hyderabad': [
    { file: '/images/areas/hyderabad/charminar1.webp', thumb: '/images/areas/hyderabad/charminar1-600.webp', landmark: 'Charminar', alt: 'Charminar monument in Hyderabad at dusk' },
    { file: '/images/areas/hyderabad/charminar2.webp', thumb: '/images/areas/hyderabad/charminar2-600.webp', landmark: 'Charminar', alt: 'Charminar four minarets illuminated at night' },
    { file: '/images/areas/hyderabad/golconda.webp', thumb: '/images/areas/hyderabad/golconda-600.webp', landmark: 'Golconda Fort', alt: 'Golconda Fort ramparts and walls' },
    { file: '/images/areas/hyderabad/hussain-sagar.webp', thumb: '/images/areas/hyderabad/hussain-sagar-600.webp', landmark: 'Hussain Sagar Lake', alt: 'Hussain Sagar Lake with Buddha statue at sunset' },
  ],
  'vijayawada': [
    { file: '/images/areas/vijayawada/prakasam1.webp', thumb: '/images/areas/vijayawada/prakasam1-600.webp', landmark: 'Prakasam Barrage', alt: 'Prakasam Barrage across Krishna River at dusk' },
    { file: '/images/areas/vijayawada/prakasam2.webp', thumb: '/images/areas/vijayawada/prakasam2-600.webp', landmark: 'Prakasam Barrage', alt: 'Prakasam Barrage gates and river view' },
    { file: '/images/areas/vijayawada/kanaka-durga.webp', thumb: '/images/areas/vijayawada/kanaka-durga-600.webp', landmark: 'Kanaka Durga Temple', alt: 'Kanaka Durga Temple on Indrakeeladri hill' },
    { file: '/images/areas/vijayawada/bhavani-island.webp', thumb: '/images/areas/vijayawada/bhavani-island-600.webp', landmark: 'Bhavani Island', alt: 'Bhavani Island on Krishna River with greenery' },
  ],
  'amaravathi': [
    { file: '/images/areas/amaravathi/amaravati-stupa.webp', thumb: '/images/areas/amaravathi/amaravati-stupa-600.webp', landmark: 'Amaravati Stupa', alt: 'Amaravati Stupa Mahachaitya ancient ruins' },
    { file: '/images/areas/amaravathi/amareswara1.webp', thumb: '/images/areas/amaravathi/amareswara1-600.webp', landmark: 'Amareswara Temple', alt: 'Amareswara Swamy Temple gopuram' },
    { file: '/images/areas/amaravathi/amareswara2.webp', thumb: '/images/areas/amaravathi/amareswara2-600.webp', landmark: 'Amareswara Temple', alt: 'Amareswara Temple intricate carvings' },
    { file: '/images/areas/amaravathi/dhyana-buddha.webp', thumb: '/images/areas/amaravathi/dhyana-buddha-600.webp', landmark: 'Dhyana Buddha', alt: 'Dhyana Buddha statue meditation pose' },
    { file: '/images/areas/amaravathi/dhyana-buddha2.webp', thumb: '/images/areas/amaravathi/dhyana-buddha2-600.webp', landmark: 'Dhyana Buddha', alt: 'Dhyana Buddha statue riverside view' },
    { file: '/images/areas/amaravathi/krishna-river.webp', thumb: '/images/areas/amaravathi/krishna-river-600.webp', landmark: 'Krishna River', alt: 'Krishna River banks at Amaravathi' },
  ]
};

const manifestPath = path.join(ROOT, 'tools', 'area-images.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ Created tools/area-images.json manifest');
console.log('✓ Done');