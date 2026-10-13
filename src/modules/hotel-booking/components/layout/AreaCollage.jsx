import SmartImage from '../common/SmartImage';
import './AreaCollage.css';

const AREA_IMAGES = {
  hyderabad: [
    { file: '/images/areas/hyderabad/hotel-exterior.webp', thumb: '/images/areas/hyderabad/hotel-exterior-600.webp', category: 'exterior', alt: 'Modern glass-and-stone luxury hotel tower exterior at dusk with city lights' },
    { file: '/images/areas/hyderabad/lobby.webp', thumb: '/images/areas/hyderabad/lobby-600.webp', category: 'lobby', alt: 'Grand marble hotel lobby with chandelier and reception desk' },
    { file: '/images/areas/hyderabad/rooftop-pool.webp', thumb: '/images/areas/hyderabad/rooftop-pool-600.webp', category: 'pool', alt: 'Rooftop infinity pool with panoramic city skyline view at dusk' },
  ],
  vijayawada: [
    { file: '/images/areas/vijayawada/hotel-facade.webp', thumb: '/images/areas/vijayawada/hotel-facade-600.webp', category: 'exterior', alt: 'Elegant luxury hotel facade with landscaped driveway and manicured gardens' },
    { file: '/images/areas/vijayawada/suite-bedroom.webp', thumb: '/images/areas/vijayawada/suite-bedroom-600.webp', category: 'bedroom', alt: 'Luxury suite bedroom with king bed, large windows and city view' },
    { file: '/images/areas/vijayawada/fine-dining.webp', thumb: '/images/areas/vijayawada/fine-dining-600.webp', category: 'restaurant', alt: 'Fine-dining restaurant interior with elegant decor and seating' },
  ],
  amaravathi: [
    { file: '/images/areas/amaravathi/garden-resort.webp', thumb: '/images/areas/amaravathi/garden-resort-600.webp', category: 'exterior', alt: 'Spacious garden resort with manicured lawns and hotel building' },
    { file: '/images/areas/amaravathi/courtyard-pool.webp', thumb: '/images/areas/amaravathi/courtyard-pool-600.webp', category: 'pool', alt: 'Courtyard pool surrounded by lush greenery and hotel building' },
    { file: '/images/areas/amaravathi/spa-lounge.webp', thumb: '/images/areas/amaravathi/spa-lounge-600.webp', category: 'spa', alt: 'Luxury spa lounge interior with modern decor and relaxation area' },
  ],
};

function getImagesForArea(area) {
  const key = area.toLowerCase().replace(/\s+/g, '');
  return AREA_IMAGES[key] || [];
}

export default function AreaCollage({ area, count }) {
  const images = getImagesForArea(area);
  
  if (images.length < 3) {
    return (
      <div className="area-collage area-collage--empty">
        <div className="area-collage-placeholder" />
        <div className="area-overlay">
          <h3>{area}</h3>
          <p>{count} hotels</p>
        </div>
      </div>
    );
  }

  const [large, small1, small2] = images.slice(0, 3);

  return (
    <div className="area-collage">
      <div className="area-collage-grid">
        <div className="area-collage-main">
          <SmartImage
            src={large.file}
            alt={large.alt}
            className="area-collage-img"
            eager
          />
        </div>
        <div className="area-collage-smalls">
          <div className="area-collage-small">
            <SmartImage
              src={small1.file}
              alt={small1.alt}
              className="area-collage-img"
              eager
            />
          </div>
          <div className="area-collage-small">
            <SmartImage
              src={small2.file}
              alt={small2.alt}
              className="area-collage-img"
              eager
            />
          </div>
        </div>
      </div>
      <div className="area-overlay">
        <h3>{area}</h3>
        <p>{count} hotels</p>
      </div>
    </div>
  );
}