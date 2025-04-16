import { Request, Response } from "express";

// Modelli di dati per i bonus
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

// Dati statici per le categorie di bonus
export const bonusCategories: BonusCategory[] = [
  { id: "famiglia", name: "Famiglia", icon: "baby" },
  { id: "casa", name: "Casa", icon: "home" },
  { id: "istruzione", name: "Istruzione", icon: "graduation-cap" },
  { id: "trasporti", name: "Trasporti", icon: "car" },
  { id: "salute", name: "Salute", icon: "heart-pulse" },
  { id: "economici", name: "Economici", icon: "euro" },
];

// Lista predefinita di bonus (aggiornata al 2025)
export const bonusList: BonusItem[] = [
  {
    id: "1",
    title: "Assegno Unico Universale 2025",
    description: "Contributo economico per le famiglie con figli a carico fino a 21 anni di età. L'importo varia in base all'ISEE.",
    category: "famiglia",
    iseeMax: 40000,
    amount: "Da 54€ a 189,20€ mensili per figlio",
    deadline: "30/06/2025",
    requirements: [
      "Figli a carico fino a 21 anni",
      "Residenza in Italia",
      "Cittadinanza italiana, UE o permesso di soggiorno",
      "ISEE in corso di validità"
    ],
    howToApply: "Domanda tramite sito INPS, patronati o app IO",
    link: "https://www.inps.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Bonus Asilo Nido 2025",
    description: "Contributo per il pagamento delle rette degli asili nido pubblici e privati o per forme di supporto presso la propria abitazione.",
    category: "famiglia",
    iseeMax: 40000,
    amount: "Fino a 3.000€ annui",
    deadline: "31/12/2025",
    requirements: [
      "Figli nati dal 1° gennaio 2022",
      "Iscrizione all'asilo nido",
      "ISEE minorenni in corso di validità"
    ],
    howToApply: "Domanda online sul sito INPS",
    link: "https://www.inps.it/",
    isNew: true,
    isExpiring: false,
    updatedAt: "2025-01-10T15:30:00Z"
  },
  {
    id: "3",
    title: "Bonus Ristrutturazioni 2025",
    description: "Detrazione fiscale per interventi di ristrutturazione edilizia",
    category: "casa",
    iseeMax: null,
    amount: "50% delle spese fino a un massimo di 96.000€",
    deadline: "31/12/2025",
    requirements: [
      "Proprietà dell'immobile o titolo che attesti la disponibilità",
      "Comunicazione all'Agenzia delle Entrate",
      "Pagamento con bonifico parlante"
    ],
    howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
    link: "https://www.agenziaentrate.gov.it/",
    isNew: false,
    isExpiring: true,
    updatedAt: "2024-12-01T09:15:00Z"
  },
  {
    id: "4",
    title: "Ecobonus 2025",
    description: "Detrazione fiscale per interventi di efficientamento energetico",
    category: "casa",
    iseeMax: null,
    amount: "Dal 50% al 65% delle spese",
    deadline: "31/12/2025",
    requirements: [
      "Proprietà dell'immobile o titolo che attesti la disponibilità",
      "Certificazione energetica pre e post intervento",
      "Invio documentazione all'ENEA entro 90 giorni dalla fine dei lavori"
    ],
    howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
    link: "https://www.agenziaentrate.gov.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2024-12-05T11:45:00Z"
  },
  {
    id: "5",
    title: "Bonus Mobili 2025",
    description: "Detrazione fiscale per l'acquisto di mobili e grandi elettrodomestici",
    category: "casa",
    iseeMax: null,
    amount: "50% delle spese fino a un massimo di 5.000€",
    deadline: "31/12/2025",
    requirements: [
      "Ristrutturazione dell'immobile iniziata dal 1° gennaio 2024",
      "Elettrodomestici di classe energetica non inferiore alla A (A+ per forni)",
      "Pagamento con bonifico, carta di credito o debito"
    ],
    howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
    link: "https://www.agenziaentrate.gov.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2024-11-30T14:20:00Z"
  },
  {
    id: "6",
    title: "Carta Dedicata a Te 2025",
    description: "Carta prepagata per l'acquisto di beni alimentari di prima necessità, carburanti o abbonamenti al trasporto pubblico",
    category: "economici",
    iseeMax: 15000,
    amount: "500€ una tantum",
    deadline: "31/07/2025",
    requirements: [
      "ISEE inferiore a 15.000€",
      "Non percepire altri sussidi pubblici",
      "Essere iscritti all'anagrafe comunale"
    ],
    howToApply: "Assegnazione automatica in base a graduatorie comunali",
    link: "https://www.lavoro.gov.it/",
    isNew: true,
    isExpiring: false,
    updatedAt: "2025-01-20T08:30:00Z"
  },
  {
    id: "7",
    title: "Bonus Psicologo 2025",
    description: "Contributo per sostenere le spese di assistenza psicologica",
    category: "salute",
    iseeMax: 50000,
    amount: "Fino a 1.500€ per persona",
    deadline: "31/10/2025",
    requirements: [
      "ISEE inferiore a 50.000€",
      "Residenza in Italia"
    ],
    howToApply: "Domanda online sul sito INPS",
    link: "https://www.inps.it/",
    isNew: true,
    isExpiring: false,
    updatedAt: "2025-01-15T16:45:00Z"
  },
  {
    id: "8",
    title: "Bonus Trasporti 2025",
    description: "Contributo per l'acquisto di abbonamenti al trasporto pubblico locale, regionale e interregionale",
    category: "trasporti",
    iseeMax: 20000,
    amount: "Fino a 60€ per abbonamento",
    deadline: "31/12/2025 (fino ad esaurimento fondi)",
    requirements: [
      "ISEE inferiore a 20.000€",
      "Acquisto di abbonamenti ai servizi di trasporto pubblico"
    ],
    howToApply: "Domanda online sulla piattaforma dedicata",
    link: "https://www.bonustrasporti.lavoro.gov.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2025-01-05T12:20:00Z"
  },
  {
    id: "9",
    title: "Carta del Merito 2025",
    description: "Bonus cultura destinato ai giovani che conseguono il diploma con 100/100",
    category: "istruzione",
    iseeMax: null,
    amount: "500€ spendibili in cultura",
    deadline: "31/12/2025",
    requirements: [
      "Conseguimento del diploma con votazione 100/100",
      "Età non superiore a 19 anni"
    ],
    howToApply: "Registrazione alla piattaforma online dedicata",
    link: "https://www.cartadelmerito.gov.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2025-01-02T10:10:00Z"
  },
  {
    id: "10",
    title: "Bonus Università 2025",
    description: "Esonero totale o parziale dal pagamento delle tasse universitarie",
    category: "istruzione",
    iseeMax: 30000,
    amount: "Esonero totale o parziale in base all'ISEE",
    deadline: "Variabile in base all'ateneo",
    requirements: [
      "ISEE fino a 30.000€ per esonero totale o parziale",
      "Iscrizione a università statali",
      "Requisiti di merito definiti dagli atenei"
    ],
    howToApply: "Domanda alla segreteria del proprio ateneo",
    link: "https://www.mur.gov.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2024-12-15T09:30:00Z"
  },
  {
    id: "11",
    title: "Assegno di Inclusione 2025",
    description: "Misura di sostegno economico e inclusione sociale rivolta ai nuclei familiari con componenti in condizioni di svantaggio",
    category: "economici",
    iseeMax: 9360,
    amount: "Fino a 6.000€ annui (7.560€ per over 67)",
    deadline: "Rinnovo annuale",
    requirements: [
      "ISEE inferiore a 9.360€",
      "Presenza nel nucleo di minori, over 60, disabili o in condizioni di svantaggio",
      "Residenza in Italia da almeno 5 anni",
      "Iscrizione al Centro per l'Impiego"
    ],
    howToApply: "Domanda presso INPS, patronati o CAF",
    link: "https://www.inps.it/",
    isNew: false,
    isExpiring: false,
    updatedAt: "2024-12-20T15:45:00Z"
  },
  {
    id: "12",
    title: "Bonus Barriere Architettoniche 75% 2025",
    description: "Detrazione fiscale per interventi di eliminazione delle barriere architettoniche",
    category: "casa",
    iseeMax: null,
    amount: "75% delle spese sostenute",
    deadline: "31/12/2025",
    requirements: [
      "Interventi finalizzati all'eliminazione delle barriere architettoniche",
      "Conformità ai requisiti tecnici previsti dal DM 236/1989"
    ],
    howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
    link: "https://www.agenziaentrate.gov.it/",
    isNew: false,
    isExpiring: true,
    updatedAt: "2024-11-25T13:15:00Z"
  }
];

// API per recuperare le categorie dei bonus
export const getBonusCategories = async (req: Request, res: Response) => {
  try {
    res.json({ categories: bonusCategories });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle categorie" });
  }
};

// API per recuperare tutti i bonus con filtri opzionali
export const getAllBonus = async (req: Request, res: Response) => {
  try {
    const { iseeValue, category, searchQuery } = req.query;
    
    let filteredBonus = [...bonusList];
    
    // Applica i filtri se specificati
    if (category && category !== 'all') {
      filteredBonus = filteredBonus.filter(bonus => bonus.category === category);
    }
    
    if (iseeValue) {
      const iseeNumber = parseFloat(iseeValue as string);
      filteredBonus = filteredBonus.filter(bonus => !bonus.iseeMax || iseeNumber <= bonus.iseeMax);
    }
    
    if (searchQuery) {
      const query = (searchQuery as string).toLowerCase();
      filteredBonus = filteredBonus.filter(bonus => 
        bonus.title.toLowerCase().includes(query) || 
        bonus.description.toLowerCase().includes(query)
      );
    }
    
    // Trova l'aggiornamento più recente
    const lastUpdate = filteredBonus.length > 0 
      ? new Date(Math.max(...filteredBonus.map(b => new Date(b.updatedAt).getTime()))).toISOString()
      : new Date().toISOString();
    
    res.json({
      bonus: filteredBonus,
      totalCount: filteredBonus.length,
      lastUpdate
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei bonus" });
  }
};

// API per recuperare i range ISEE predefiniti
export const getIseeRanges = async (req: Request, res: Response) => {
  try {
    const ranges = [
      { min: 0, max: 10000, label: "Fino a 10.000€" },
      { min: 10001, max: 20000, label: "10.001€ - 20.000€" },
      { min: 20001, max: 30000, label: "20.001€ - 30.000€" },
      { min: 30001, max: 40000, label: "30.001€ - 40.000€" },
      { min: 40001, max: 50000, label: "40.001€ - 50.000€" },
      { min: 50001, max: null, label: "Oltre 50.000€" }
    ];
    
    res.json({ ranges });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei range ISEE" });
  }
};

// API per recuperare i nuovi bonus
export const getNewBonus = async (req: Request, res: Response) => {
  try {
    const newBonus = bonusList.filter(bonus => bonus.isNew);
    
    res.json({
      bonus: newBonus,
      count: newBonus.length
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei nuovi bonus" });
  }
};

// API per recuperare i bonus in scadenza
export const getExpiringBonus = async (req: Request, res: Response) => {
  try {
    const expiringBonus = bonusList.filter(bonus => bonus.isExpiring);
    
    res.json({
      bonus: expiringBonus,
      count: expiringBonus.length
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei bonus in scadenza" });
  }
};

// API per recuperare un singolo bonus per ID
export const getBonusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const bonus = bonusList.find(b => b.id === id);
    
    if (!bonus) {
      return res.status(404).json({ error: "Bonus non trovato" });
    }
    
    res.json({ bonus });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero del bonus" });
  }
};