import { useState, useEffect, useRef } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderColor?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; 
  objectFit?: "cover" | "contain";
}

/**
 * Componente ottimizzato per caricamento lazy di immagini
 * con prevenzione del Cumulative Layout Shift (CLS)
 * per migliorare i Core Web Vitals di Google.
 */
export function LazyImage({
  src,
  alt,
  placeholderColor = "#f3f4f6",
  className = "",
  width,
  height,
  aspectRatio = "16/9",
  objectFit = "cover",
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stile del container per prevenire CLS
  const containerStyle = {
    position: "relative" as const,
    width: typeof width === "number" ? `${width}px` : width || "100%",
    height: typeof height === "number" ? `${height}px` : height || "auto",
    aspectRatio: height ? undefined : aspectRatio,
    backgroundColor: placeholderColor,
    overflow: "hidden" as const,
  };

  // Observer per monitorare quando l'immagine entra nel viewport
  useEffect(() => {
    // Utilizziamo IntersectionObserver API
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Prefetch aggressivo
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Gestore di caricamento dell'immagine
  function handleImageLoad() {
    setIsLoaded(true);
  }

  return (
    <div 
      ref={containerRef} 
      className={`${className || ""}`}
      style={containerStyle}
      aria-label={alt}
      role="img"
    >
      {/* Skeleton mentre l'immagine carica */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      {/* Carica l'immagine solo quando è visibile */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${
            objectFit === "cover" ? "object-cover" : "object-contain"
          } ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
          {...rest}
        />
      )}
    </div>
  );
}