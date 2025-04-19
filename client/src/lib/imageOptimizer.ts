/**
 * Utility per ottimizzare e gestire immagini per migliorare Core Web Vitals
 * Supporta dimensionamento dinamico e formato ottimale
 */

// Dimensioni di immagini responsive per diverse viewport
const RESPONSIVE_SIZES = [320, 640, 768, 1024, 1280, 1536, 1920];

/**
 * Genera un set di URL per immagini srcSet ottimizzate per responsive design
 * @param imageUrl URL dell'immagine originale
 * @param sizes Array di larghezze per immagini responsive (in pixel)
 */
export function generateSrcSet(imageUrl: string, sizes = RESPONSIVE_SIZES): string {
  // Se l'URL è già ottimizzato o è un placeholder, restituiscilo com'è
  if (imageUrl.startsWith('data:') || !imageUrl || imageUrl.includes('placeholder')) {
    return imageUrl;
  }

  // Per immagini esterne (GitHub, CDN, ecc.) restituisci l'URL originale
  if (imageUrl.startsWith('http') && !imageUrl.includes(window.location.hostname)) {
    return imageUrl;
  }

  // Per immagini interne generate con srcset
  return sizes
    .map(size => `${getOptimizedImageUrl(imageUrl, size)} ${size}w`)
    .join(', ');
}

/**
 * Ottimizza le dimensioni di un'immagine
 * @param imageUrl URL dell'immagine originale
 * @param width Larghezza desiderata in pixel
 */
export function getOptimizedImageUrl(imageUrl: string, width: number): string {
  // Per immagini locali sul server web
  if (imageUrl.startsWith('/')) {
    // Per immagini in public/assets, possiamo supporre che siano già ottimizzate
    return imageUrl;
  }
  
  // Per immagini esterne
  return imageUrl;
}

/**
 * Calcola i parametri sizes per immagini responsive
 * @param defaultSize Dimensione di default in viewport width
 */
export function getResponsiveSizes(defaultSize = '100vw'): string {
  return `
    (max-width: 640px) 100vw,
    (max-width: 768px) 80vw,
    (max-width: 1024px) 70vw,
    (max-width: 1280px) 60vw,
    ${defaultSize}
  `.trim();
}

/**
 * Ottiene le dimensioni di un'immagine dall'attributo HTML
 * @param width Larghezza, può essere un numero o una stringa CSS (es. '100px', '50%')
 * @returns Dimensione parsata come numero, o undefined
 */
export function parseDimension(dimension: number | string | undefined): number | undefined {
  if (dimension === undefined) return undefined;
  if (typeof dimension === 'number') return dimension;
  
  // Per dimensioni come '100px', estrae solo il numero
  const match = String(dimension).match(/^(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  return undefined;
}

/**
 * Determina il miglior formato immagine in base al supporto del browser
 */
export function getBestImageFormat(): 'webp' | 'avif' | 'jpeg' {
  // Verifica se il browser supporta WebP
  const supportsWebp = (() => {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  })();
  
  // Verifica se il browser supporta AVIF (più recente e migliore compressione)
  const supportsAvif = (() => {
    try {
      return document.createElement('canvas')
        .toDataURL('image/avif')
        .indexOf('data:image/avif') === 0;
    } catch (e) {
      return false;
    }
  })();
  
  if (supportsAvif) return 'avif';
  if (supportsWebp) return 'webp';
  return 'jpeg';
}

/**
 * Converte un'immagine in un formato ottimizzato (Base64)
 * @param file File dell'immagine
 * @param maxWidth Larghezza massima
 * @param quality Qualità dell'immagine (0-1)
 */
export async function getOptimizedImageBase64(
  file: File, 
  maxWidth = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calcola le dimensioni proporzionalmente
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Crea un canvas per ridimensionare
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Disegna l'immagine ridimensionata
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converti in formato ottimizzato
        const format = getBestImageFormat();
        const mimeType = `image/${format}`;
        
        resolve(canvas.toDataURL(mimeType, quality));
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}