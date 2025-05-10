import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  rootRef?: RefObject<HTMLElement>;
}

/**
 * Hook personalizzato che utilizza l'Intersection Observer API
 * per rilevare quando un elemento diventa visibile nel viewport.
 * Ottimizzato per le prestazioni e ridurre il layout thrashing.
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
  rootRef,
}: UseIntersectionObserverProps = {}): [
  RefObject<HTMLElement>,
  boolean,
  IntersectionObserverEntry | null
] {
  // Se viene fornito un riferimento esterno, lo utilizziamo
  // altrimenti ne creiamo uno interno
  const localRef = useRef<HTMLElement>(null);
  const observerRef = rootRef || localRef;
  
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  
  const frozen = isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = observerRef?.current;
    
    // Non procedere se non abbiamo un elemento da osservare o se abbiamo già visto l'elemento
    if (!node || frozen) return;
    
    // Callback che viene chiamato quando l'elemento entra o esce dal viewport
    const updateEntry = ([newEntry]: IntersectionObserverEntry[]): void => {
      setEntry(newEntry);
      setIsIntersecting(newEntry.isIntersecting);
    };

    // Creiamo l'observer con i parametri specificati
    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    // Iniziamo a osservare l'elemento
    observer.observe(node);
    
    // Cleanup quando il componente viene smontato
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen, observerRef]);

  return [observerRef, isIntersecting, entry];
}