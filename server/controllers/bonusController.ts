import { Request, Response } from "express";
import { db } from "../db";
import { z } from "zod";

// Tipi di dati per i bonus
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

// Elenco delle categorie disponibili
export const bonusCategories: BonusCategory[] = [
  { id: "famiglia", name: "Famiglia", icon: "BabyIcon" },
  { id: "casa", name: "Casa", icon: "HomeIcon" },
  { id: "istruzione", name: "Istruzione", icon: "GraduationCapIcon" },
  { id: "trasporti", name: "Trasporti", icon: "CarIcon" },
  { id: "salute", name: "Salute", icon: "HeartPulseIcon" },
  { id: "economici", name: "Economici", icon: "EuroIcon" },
];

// Dati iniziali per i bonus
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
    updatedAt: "2025-04-01"
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
    updatedAt: "2025-04-10"
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
    updatedAt: "2025-03-15"
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
    updatedAt: "2025-02-20"
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
    updatedAt: "2025-03-05"
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
    updatedAt: "2025-04-16"
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
    updatedAt: "2025-04-14"
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
    updatedAt: "2025-02-28"
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
    updatedAt: "2025-01-15"
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
    updatedAt: "2025-02-05"
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
    updatedAt: "2025-01-30"
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
    updatedAt: "2025-03-20"
  }
];

// Valori ISEE predefiniti per il simulatore
const iseeRanges = [
  { min: 0, max: 9360, label: "Molto basso (0-9.360€)" },
  { min: 9361, max: 15000, label: "Basso (9.361-15.000€)" },
  { min: 15001, max: 20000, label: "Medio-basso (15.001-20.000€)" },
  { min: 20001, max: 30000, label: "Medio (20.001-30.000€)" },
  { min: 30001, max: 40000, label: "Medio-alto (30.001-40.000€)" },
  { min: 40001, max: 50000, label: "Alto (40.001-50.000€)" },
  { min: 50001, max: null, label: "Superiore a 50.000€" }
];

// Schema di validazione per il filtro bonus
const bonusFilterSchema = z.object({
  iseeValue: z.string().optional(),
  category: z.string().optional(),
  searchQuery: z.string().optional()
});

// Ottieni tutte le categorie
export const getBonusCategories = async (req: Request, res: Response) => {
  try {
    res.json({ categories: bonusCategories });
  } catch (error) {
    console.error("Errore nel recupero delle categorie:", error);
    res.status(500).json({ error: "Errore nel recupero delle categorie dei bonus" });
  }
};

// Ottieni tutti i bonus
export const getAllBonus = async (req: Request, res: Response) => {
  try {
    const { 
      iseeValue,  
      category, 
      searchQuery 
    } = bonusFilterSchema.parse(req.query);
    
    let filteredBonus = [...bonusList];
    
    // Filtra per ISEE se specificato
    if (iseeValue && iseeValue !== "") {
      const iseeNum = parseFloat(iseeValue);
      filteredBonus = filteredBonus.filter(bonus => 
        !bonus.iseeMax || iseeNum <= bonus.iseeMax
      );
    }
    
    // Filtra per categoria se specificata e non è "all"
    if (category && category !== "all") {
      filteredBonus = filteredBonus.filter(bonus => 
        bonus.category === category
      );
    }
    
    // Filtra per testo di ricerca se specificato
    if (searchQuery && searchQuery !== "") {
      const query = searchQuery.toLowerCase();
      filteredBonus = filteredBonus.filter(bonus => 
        bonus.title.toLowerCase().includes(query) || 
        bonus.description.toLowerCase().includes(query)
      );
    }
    
    res.json({ 
      bonus: filteredBonus,
      totalCount: filteredBonus.length,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error("Errore nel recupero dei bonus:", error);
    res.status(500).json({ error: "Errore nel recupero dei bonus disponibili" });
  }
};

// Ottieni i ranges ISEE predefiniti
export const getIseeRanges = async (req: Request, res: Response) => {
  try {
    res.json({ ranges: iseeRanges });
  } catch (error) {
    console.error("Errore nel recupero dei range ISEE:", error);
    res.status(500).json({ error: "Errore nel recupero dei range ISEE" });
  }
};

// Ottieni i bonus nuovi
export const getNewBonus = async (req: Request, res: Response) => {
  try {
    const newBonus = bonusList.filter(bonus => bonus.isNew);
    res.json({ 
      bonus: newBonus,
      count: newBonus.length 
    });
  } catch (error) {
    console.error("Errore nel recupero dei nuovi bonus:", error);
    res.status(500).json({ error: "Errore nel recupero dei nuovi bonus" });
  }
};

// Ottieni i bonus in scadenza
export const getExpiringBonus = async (req: Request, res: Response) => {
  try {
    const expiringBonus = bonusList.filter(bonus => bonus.isExpiring);
    res.json({ 
      bonus: expiringBonus,
      count: expiringBonus.length 
    });
  } catch (error) {
    console.error("Errore nel recupero dei bonus in scadenza:", error);
    res.status(500).json({ error: "Errore nel recupero dei bonus in scadenza" });
  }
};

// Dettagli di un bonus specifico
export const getBonusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bonus = bonusList.find(b => b.id === id);
    
    if (!bonus) {
      return res.status(404).json({ error: "Bonus non trovato" });
    }
    
    res.json({ bonus });
  } catch (error) {
    console.error("Errore nel recupero del bonus:", error);
    res.status(500).json({ error: "Errore nel recupero del bonus" });
  }
};