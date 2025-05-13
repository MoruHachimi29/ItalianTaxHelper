import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/data' : '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// API per i bonus e le agevolazioni
export const bonusApi = {
  getCategories: async () => {
    const response = await api.get(import.meta.env.PROD ? '/bonus-categories.json' : '/bonus/categories');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get(import.meta.env.PROD ? '/bonus-list.json' : '/bonus');
    return response.data;
  },
  
  getIseeRanges: async () => {
    const response = await api.get(import.meta.env.PROD ? '/bonus-isee-ranges.json' : '/bonus/isee-ranges');
    return response.data;
  },
  
  getNew: async () => {
    const response = await api.get(import.meta.env.PROD ? '/bonus-new.json' : '/bonus/new');
    return response.data;
  },
  
  getExpiring: async () => {
    const response = await api.get(import.meta.env.PROD ? '/bonus-expiring.json' : '/bonus/expiring');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(import.meta.env.PROD ? `/bonus/${id}.json` : `/bonus/${id}`);
    return response.data;
  }
};

// API per il debito pubblico
export const debtApi = {
  getCurrent: async (country = 'Italy') => {
    const countryLower = country.toLowerCase();
    const path = import.meta.env.PROD 
      ? `/public-debt/current-${countryLower}.json`
      : `/public-debt/current?country=${country}`;
    const response = await api.get(path);
    return response.data;
  },
  
  getHistorical: async (country = 'Italy') => {
    const countryLower = country.toLowerCase();
    const path = import.meta.env.PROD 
      ? `/public-debt/historical-${countryLower}.json`
      : `/public-debt/historical?country=${country}`;
    const response = await api.get(path);
    return response.data;
  },
  
  getComparison: async (countries = ['Italy', 'Germany']) => {
    const countriesQuery = countries.join(',');
    const countriesKey = countries.sort().join('-').toLowerCase();
    const path = import.meta.env.PROD 
      ? `/public-debt-comparison.json`
      : `/public-debt/comparison?countries=${countriesQuery}`;
    const response = await api.get(path);
    return response.data;
  }
};

// API per i tutorial
export const tutorialApi = {
  getAll: async () => {
    const response = await api.get(import.meta.env.PROD ? '/tutorials.json' : '/tutorials');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(import.meta.env.PROD ? `/tutorials/${id}.json` : `/tutorials/${id}`);
    return response.data;
  },
  
  getByType: async (type) => {
    if (import.meta.env.PROD) {
      const allTutorials = await tutorialApi.getAll();
      return allTutorials.filter(tutorial => tutorial.type === type);
    } else {
      const response = await api.get(`/tutorials/type/${type}`);
      return response.data;
    }
  }
};

// API per le news
export const newsApi = {
  getAll: async () => {
    const response = await api.get(import.meta.env.PROD ? '/news.json' : '/news');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(import.meta.env.PROD ? `/news/${id}.json` : `/news/${id}`);
    return response.data;
  },
  
  getLatest: async (limit = 5) => {
    if (import.meta.env.PROD) {
      const allNews = await newsApi.getAll();
      const sorted = [...allNews].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sorted.slice(0, limit);
    } else {
      const response = await api.get(`/news/latest/${limit}`);
      return response.data;
    }
  }
};