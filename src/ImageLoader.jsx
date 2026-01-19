import { useState } from "react";

export default function ImageLoader({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-stone-200 ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse z-10" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
          Görsel Yüklenemedi
        </div>
      )}
    </div>
  );
}