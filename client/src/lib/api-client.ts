// API Client per le richieste ai servizi del backend

// Tipi per i Bonus ISEE
export interface BonusCategory {
  id: string;
  name: string;
  icon: string;
}

export interface BonusItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iseeMax: number | null;
  amount: string;
  deadline: string;
  requirements: string[];
  howToApply: string;
  link: string;
  isNew: boolean;
  isExpiring: boolean;
  updatedAt: string;
}

export interface IseeRange {
  min: number;
  max: number | null;
  label: string;
}

// Funzioni API per i Bonus ISEE
export async function getBonusCategories(): Promise<BonusCategory[]> {
  const response = await fetch('/api/bonus/categories');
  
  if (!response.ok) {
    throw new Error('Errore nel recupero delle categorie dei bonus');
  }
  
  const data = await response.json();
  return data.categories;
}

export async function getAllBonus(params?: { 
  iseeValue?: string, 
  category?: string,
  searchQuery?: string
}): Promise<{
  bonus: BonusItem[],
  totalCount: number,
  lastUpdate: string
}> {
  let url = '/api/bonus';
  
  if (params) {
    const queryParams = new URLSearchParams();
    
    if (params.iseeValue) {
      queryParams.append('iseeValue', params.iseeValue);
    }
    
    if (params.category && params.category !== 'all') {
      queryParams.append('category', params.category);
    }
    
    if (params.searchQuery) {
      queryParams.append('searchQuery', params.searchQuery);
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei bonus');
  }
  
  return await response.json();
}

export async function getIseeRanges(): Promise<IseeRange[]> {
  const response = await fetch('/api/bonus/isee-ranges');
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei range ISEE');
  }
  
  const data = await response.json();
  return data.ranges;
}

export async function getNewBonus(): Promise<{
  bonus: BonusItem[],
  count: number
}> {
  const response = await fetch('/api/bonus/new');
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei nuovi bonus');
  }
  
  return await response.json();
}

export async function getExpiringBonus(): Promise<{
  bonus: BonusItem[],
  count: number
}> {
  const response = await fetch('/api/bonus/expiring');
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei bonus in scadenza');
  }
  
  return await response.json();
}

export async function getBonusById(id: string): Promise<BonusItem> {
  const response = await fetch(`/api/bonus/${id}`);
  
  if (!response.ok) {
    throw new Error('Errore nel recupero del bonus');
  }
  
  const data = await response.json();
  return data.bonus;
}