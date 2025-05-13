/**
 * Questa utilità sostituisce le chiamate API con accesso a file JSON statici
 * È progettata per funzionare sia in development (con API reali) che in production (con file statici)
 */

// Determina se siamo in ambiente di produzione
const isProduction = import.meta.env.PROD;

/**
 * Funzione generale per il recupero dei dati
 * In development, chiama l'API reale
 * In production, carica il file JSON statico
 * 
 * @param {string} endpoint - L'endpoint API, es. "/api/bonus"
 * @param {string} staticPath - Il percorso del file statico, es. "/data/bonus-list.json"
 * @returns {Promise<any>} I dati richiesti
 */
async function fetchData(endpoint, staticPath) {
  try {
    if (isProduction) {
      // In production, carica il file JSON statico
      const response = await fetch(staticPath);
      if (!response.ok) {
        throw new Error(`Errore nel caricamento dei dati statici: ${response.status}`);
      }
      return await response.json();
    } else {
      // In development, chiama l'API reale
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Errore nella chiamata API: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error(`Errore nel recupero dei dati (${endpoint || staticPath}):`, error);
    throw error;
  }
}

// API per i bonus
export const bonusApi = {
  // Ottieni tutte le categorie di bonus
  getCategories: () => fetchData('/api/bonus/categories', '/data/bonus-categories.json'),
  
  // Ottieni tutti i bonus
  getAll: () => fetchData('/api/bonus', '/data/bonus-list.json'),
  
  // Ottieni i range ISEE
  getIseeRanges: () => fetchData('/api/bonus/isee-ranges', '/data/bonus-isee-ranges.json'),
  
  // Ottieni i bonus nuovi
  getNew: () => fetchData('/api/bonus/new', '/data/bonus-new.json'),
  
  // Ottieni i bonus in scadenza
  getExpiring: () => fetchData('/api/bonus/expiring', '/data/bonus-expiring.json'),
  
  // Ottieni un bonus per ID
  getById: (id) => fetchData(`/api/bonus/${id}`, `/data/bonus/${id}.json`),
};

// API per il debito pubblico
export const debtApi = {
  // Ottieni i dati correnti del debito pubblico
  getCurrent: (country = 'Italy') => {
    const countryLower = country.toLowerCase();
    return fetchData(
      `/api/public-debt/current?country=${country}`, 
      `/data/public-debt/current-${countryLower}.json`
    );
  },
  
  // Ottieni i dati storici del debito pubblico
  getHistorical: (country = 'Italy') => {
    const countryLower = country.toLowerCase();
    return fetchData(
      `/api/public-debt/historical?country=${country}`, 
      `/data/public-debt/historical-${countryLower}.json`
    );
  },
  
  // Ottieni i dati di confronto tra paesi
  getComparison: (countries = ['Italy', 'Germany']) => {
    const countriesQuery = countries.join(',');
    const countriesKey = countries.sort().join('-').toLowerCase();
    return fetchData(
      `/api/public-debt/comparison?countries=${countriesQuery}`, 
      `/data/public-debt-comparison.json`
    );
  },
};

// API per i tutorial
export const tutorialApi = {
  // Ottieni tutti i tutorial
  getAll: () => fetchData('/api/tutorials', '/data/tutorials.json'),
  
  // Ottieni un tutorial per ID
  getById: (id) => fetchData(`/api/tutorials/${id}`, `/data/tutorials/${id}.json`),
  
  // Ottieni tutorial per tipo
  getByType: (type) => {
    // Per la versione statica, dobbiamo filtrare i dati lato client
    return tutorialApi.getAll().then(tutorials => 
      tutorials.filter(tutorial => tutorial.type === type)
    );
  },
};

// API per le news
export const newsApi = {
  // Ottieni tutte le news
  getAll: () => fetchData('/api/news', '/data/news.json'),
  
  // Ottieni una news per ID
  getById: (id) => fetchData(`/api/news/${id}`, `/data/news/${id}.json`),
  
  // Ottieni le ultime news
  getLatest: (limit = 5) => {
    // Per la versione statica, dobbiamo filtrare i dati lato client
    return newsApi.getAll().then(news => {
      const sorted = [...news].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sorted.slice(0, limit);
    });
  },
};