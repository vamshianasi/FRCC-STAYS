import { useEffect, useCallback } from 'react';
import SmartImage from './SmartImage';
import './Lightbox.css';

export default function Lightbox({ images, index, onClose, onNav }) {
  const prev = useCallback(() => onNav((index - 1 + images.length) % images.length), [index, images.length, onNav]);
  const next = useCallback(() => onNav((index + 1) % images.length), [index, images.length, onNav]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <button className="lb-arrow lb-prev" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <div className="lb-stage" onClick={e => e.stopPropagation()}>
        <SmartImage src={images[index].file} alt={images[index].alt} className="lb-img" eager />
        <div className="lb-caption">
          <span className="lb-cat">{images[index].category}</span>
          <span className="lb-counter">{index + 1} / {images.length}</span>
        </div>
      </div>
      <button className="lb-arrow lb-next" onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}
