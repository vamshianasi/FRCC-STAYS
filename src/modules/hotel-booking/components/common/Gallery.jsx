import { useState, useEffect, useCallback } from 'react';
import Lightbox from './Lightbox';
import SmartImage from './SmartImage';
import './Gallery.css';

export default function Gallery({ images, title, owner }) {
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(false);

  const cats = ['All', ...new Set(images.map(i => i.category))];
  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter);
  const shown = filtered.length ? filtered : images;

  // Hide the filter chips row when fewer than 2 categories remain.
  const showChips = cats.length >= 2;

  useEffect(() => { setActive(0); }, [filter]);

  const onKey = useCallback(e => {
    if (lightbox) return;
    if (e.key === 'ArrowRight') setActive(a => (a + 1) % shown.length);
    if (e.key === 'ArrowLeft') setActive(a => (a - 1 + shown.length) % shown.length);
  }, [lightbox, shown.length]);

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  if (!images.length) return null;

  return (
    <div className="gallery">
      {showChips && (
        <div className="gallery-chips">
          {cats.map(c => (
            <button
              key={c}
              className={'chip' + (filter === c ? ' chip-active' : '')}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="gallery-main">
        <SmartImage
          src={shown[active].file}
          alt={shown[active].alt}
          className="gallery-main-img"
          owner={owner}
          onClick={() => setLightbox(true)}
        />
        <span className="gallery-cat-label">{shown[active].category}</span>
        <button className="gallery-expand" onClick={() => setLightbox(true)} aria-label="Expand image">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </button>
      </div>
      <div className="gallery-thumbs">
        {shown.map((img, i) => (
          <button
            key={i}
            className={'thumb' + (i === active ? ' thumb-active' : '')}
            onClick={() => setActive(i)}
            aria-label={img.category}
            title={img.category}
            aria-pressed={i === active}
          >
            <SmartImage src={img.file} alt="" className="thumb-img" owner={owner} />
          </button>
        ))}
      </div>
      {lightbox && (
        <Lightbox
          images={shown}
          index={active}
          onClose={() => setLightbox(false)}
          onNav={setActive}
        />
      )}
    </div>
  );
}