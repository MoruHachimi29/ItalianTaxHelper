import { useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
}

/**
 * Componente ottimizzato per immagini che previene il Cumulative Layout Shift (CLS)
 * mantenendo lo spazio riservato all'immagine prima che venga caricata.
 * Migliora il punteggio di Core Web Vitals.
 */
export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className = "",
  aspectRatio = "16/9",
  objectFit = "cover",
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Utilizziamo il custom hook per l'intersezione
  // Osserviamo direttamente l'elemento
  const [_, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  // Calcoliamo lo stile CSS per mantenere il rapporto di aspetto
  const containerStyle = {
    position: "relative" as const,
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "auto",
    aspectRatio: height ? undefined : aspectRatio,
    overflow: "hidden" as const,
  };

  // Gestisce il caricamento completo dell'immagine
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={containerRef} 
      className={`${className} bg-gray-100 rounded overflow-hidden`} 
      style={containerStyle}
    >
      {/* Skeleton che viene mostrato durante il caricamento */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      
      {/* Carica l'immagine solo quando diventa visibile nel viewport */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            objectFit === 'cover' ? 'object-cover' : 'object-contain'
          } ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleImageLoad}
          loading="lazy"
          width={width}
          height={height}
          decoding="async"
        />
      )}
    </div>
  );
}