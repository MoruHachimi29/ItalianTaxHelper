import { useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { parseDimension } from "@/lib/imageOptimizer";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  placeholderColor?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * Componente per immagini con caricamento ottimizzato e skeleton loader
 * Previene Cumulative Layout Shift (CLS) mantenendo le dimensioni durante il caricamento
 * Utilizza lazy loading per migliorare le prestazioni
 */
export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  className = "",
  aspectRatio = "16/9",
  objectFit = "cover",
  placeholderColor = "#f3f4f6",
  priority = false,
  onLoad,
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
    if (onLoad) onLoad();
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
      {(isVisible || priority) && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            objectFit === 'cover' ? 'object-cover' : 'object-contain'
          } ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleImageLoad}
          loading={priority ? "eager" : "lazy"}
          width={parseDimension(width)}
          height={parseDimension(height)}
          decoding="async"
        />
      )}
    </div>
  );
}