import SmartImage from '../common/SmartImage';
import './AreaCollage.css';

const AREA_IMAGES = {
  hyderabad: [
    { file: '/images/areas/hyderabad/hotel-exterior.webp', thumb: '/images/areas/hyderabad/hotel-exterior-600.webp', category: 'exterior', alt: 'Modern hotel building exterior in Hyderabad' },
    { file: '/images/areas/hyderabad/lobby.webp', thumb: '/images/areas/hyderabad/lobby-600.webp', category: 'lobby', alt: 'Grand hotel lobby with reception desk' },
  ],
  vijayawada: [
    { file: '/images/areas/vijayawada/hotel-facade.webp', thumb: '/images/areas/vijayawada/hotel-facade-600.webp', category: 'exterior', alt: 'Elegant hotel building facade in Vijayawada' },
    { file: '/images/areas/vijayawada/suite-bedroom.webp', thumb: '/images/areas/vijayawada/suite-bedroom-600.webp', category: 'bedroom', alt: 'Suite bedroom with king bed and city view' },
  ]
};

function getImagesForArea(area) {
  const key = area.toLowerCase().replace(/\s+/g, '');
  return AREA_IMAGES[key] || [];
}

export default function AreaCollage({ area, count }) {
  const images = getImagesForArea(area);

  if (images.length === 0) {
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

  const [large, small1] = images;

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
        </div>
      </div>
      <div className="area-overlay">
        <h3>{area}</h3>
        <p>{count} hotels</p>
      </div>
    </div>
  );
}