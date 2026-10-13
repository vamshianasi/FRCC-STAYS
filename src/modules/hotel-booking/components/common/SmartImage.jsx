import { useState } from 'react';
import './SmartImage.css';

/**
 * SmartImage — reusable image component with:
 *  - lazy loading
 *  - explicit width/height (prevents layout shift)
 *  - soft blurred placeholder while loading
 *  - single consistent onerror fallback (never shows broken-image icon)
 *  - console warning on failure with hotel/room id and path
 */
export default function SmartImage({ src, alt, width, height, className, onClick, eager }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  function handleError(e) {
    setError(true);
    setLoaded(true);
    // Log warning with context for debugging
    console.warn(`[SmartImage] Failed to load: ${src}${alt ? ` (alt: ${alt})` : ''}`);
    if (e?.target) {
      e.target.style.display = 'none';
    }
  }

  function handleLoad() {
    setLoaded(true);
  }

  if (error) {
    return (
      <div
        className={`smart-image-fallback ${className || ''}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40" opacity="0.4">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`smart-image-wrapper ${className || ''}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
      onClick={onClick}
    >
      {/* Blurred placeholder */}
      <div
        className={`smart-image-placeholder ${loaded ? 'smart-image-placeholder--hidden' : ''}`}
        style={{ width: '100%', height: '100%' }}
      />
      <img
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`smart-image-img ${loaded ? 'smart-image-img--loaded' : ''}`}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
