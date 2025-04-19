import { useState, useEffect, useRef } from 'react';

type CacheItem<T> = {
  data: T;
  timestamp: number;
};

type CachedApiOptions = {
  expirationTime?: number; // Tempo di scadenza della cache in ms (default 5 minuti)
  storageKey?: string; // Chiave per memorizzare nella sessionStorage
  useSessionStorage?: boolean; // Se usare la sessionStorage oltre alla memoria
};

/**
 * Hook personalizzato per memorizzare le richieste API con meccanismo di cache
 * per migliorare le prestazioni e ridurre le chiamate API ridondanti.
 * Supporta sia la cache in memoria che la sessionStorage.
 */
export function useCachedApi<T>(
  url: string, 
  options: CachedApiOptions = {}
): [T | null, boolean, Error | null, () => void] {
  // Valori predefiniti per le opzioni
  const {
    expirationTime = 5 * 60 * 1000, // 5 minuti di default
    storageKey = `api_cache_${url}`,
    useSessionStorage = true
  } = options;

  // Stati per dati, caricamento ed errori
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Riferimento alla cache in memoria
  const memoryCache = useRef<Record<string, CacheItem<T>>>({});

  // Funzione per verificare se un elemento è scaduto
  const isExpired = (timestamp: number): boolean => {
    return Date.now() - timestamp > expirationTime;
  };

  // Funzione per ottenere dati dalla cache (memoria o sessionStorage)
  const getFromCache = (): CacheItem<T> | null => {
    // Prima controlla la cache in memoria
    if (memoryCache.current[url] && !isExpired(memoryCache.current[url].timestamp)) {
      return memoryCache.current[url];
    }
    
    // Poi controlla la sessionStorage se abilitata
    if (useSessionStorage) {
      try {
        const cachedItem = sessionStorage.getItem(storageKey);
        if (cachedItem) {
          const parsedItem: CacheItem<T> = JSON.parse(cachedItem);
          if (!isExpired(parsedItem.timestamp)) {
            // Aggiorna anche la cache in memoria
            memoryCache.current[url] = parsedItem;
            return parsedItem;
          }
        }
      } catch (e) {
        // In caso di errori con sessionStorage, continua senza usarla
        console.warn('Error accessing sessionStorage:', e);
      }
    }
    
    return null;
  };

  // Funzione per salvare dati nella cache
  const saveToCache = (data: T): void => {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    
    // Salva nella cache in memoria
    memoryCache.current[url] = cacheItem;
    
    // Salva anche nella sessionStorage se abilitata
    if (useSessionStorage) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(cacheItem));
      } catch (e) {
        console.warn('Error saving to sessionStorage:', e);
      }
    }
  };

  // Funzione per forzare il refresh dei dati
  const refresh = () => {
    setLoading(true);
    fetchData(true);
  };

  // Funzione principale per recuperare i dati
  const fetchData = async (forceRefresh = false): Promise<void> => {
    try {
      // Se non è forzato il refresh, cerca nella cache
      if (!forceRefresh) {
        const cachedData = getFromCache();
        if (cachedData) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }
      }
      
      // Altrimenti fa la chiamata API
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      saveToCache(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Effetto che carica i dati al mount del componente o quando cambia l'URL
  useEffect(() => {
    fetchData();
  }, [url]);

  return [data, loading, error, refresh];
}