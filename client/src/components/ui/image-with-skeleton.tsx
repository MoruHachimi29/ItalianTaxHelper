import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  objectFit?: string;
}

// Componente che mostra uno skeleton mentre l'immagine si carica
export function ImageWithSkeleton({
  src,
  alt,
  className,
  aspectRatio = "16/9",
  objectFit = "cover",
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          objectFit === "cover" ? "object-cover" : "object-contain",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}