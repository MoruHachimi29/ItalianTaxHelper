import { useState, useEffect, useRef } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  placeholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3C/svg%3E",
  threshold = 0.1,
  className = "",
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Observer che monitora quando l'immagine entra nel viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Gestione del caricamento dell'immagine
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Immagine placeholder che viene mostrata durante il caricamento */}
      <img
        src={placeholderSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
        {...rest}
      />
      
      {/* Immagine vera che viene caricata solo quando è in vista */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          {...rest}
        />
      )}
    </div>
  );
}