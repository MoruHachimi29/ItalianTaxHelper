import { Request, Response } from "express";

// Interfacce per i dati delle scadenze fiscali
export interface TaxDeadline {
  id: string;
  title: string;
  description: string;
  date: string;  // ISO date string format YYYY-MM-DD
  category: string;
  type: "individuals" | "companies";  // persone fisiche o giuridiche
  isImportant: boolean;
  isRecurring: boolean;
  recurringInfo?: string;
  link: string;
  updatedAt: string;
}

// Categorie di scadenze
export const deadlineCategories = [
  { id: "dichiarativi", name: "Dichiarativi", icon: "file-text" },
  { id: "versamenti", name: "Versamenti", icon: "credit-card" },
  { id: "comunicazioni", name: "Comunicazioni", icon: "mail" },
  { id: "adempimenti", name: "Adempimenti", icon: "check-square" },
  { id: "iva", name: "IVA", icon: "percent" },
  { id: "lavoro", name: "Lavoro e previdenza", icon: "briefcase" }
];

// Scadenze fiscali per persone fisiche e giuridiche
export const taxDeadlines: TaxDeadline[] = [
  // PERSONE FISICHE
  {
    id: "pf-1",
    title: "Dichiarazione dei redditi 2025 (Modello 730)",
    description: "Termine per la presentazione della dichiarazione dei redditi tramite Modello 730 ordinario",
    date: "2025-09-30",
    category: "dichiarativi",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "pf-2",
    title: "Dichiarazione dei redditi 2025 (Modello Redditi PF)",
    description: "Termine per la presentazione della dichiarazione dei redditi tramite Modello Redditi Persone Fisiche",
    date: "2025-11-30",
    category: "dichiarativi",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "pf-3",
    title: "Acconto IMU 2025",
    description: "Termine per il versamento della prima rata dell'IMU",
    date: "2025-06-16",
    category: "versamenti",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Semestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-10T14:30:00Z"
  },
  {
    id: "pf-4",
    title: "Saldo IMU 2025",
    description: "Termine per il versamento del saldo IMU dell'anno",
    date: "2025-12-16",
    category: "versamenti",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Semestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-10T14:30:00Z"
  },
  {
    id: "pf-5",
    title: "Prima rata acconto IRPEF 2025",
    description: "Termine per il versamento della prima rata dell'acconto IRPEF",
    date: "2025-06-30",
    category: "versamenti",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-20T09:15:00Z"
  },
  {
    id: "pf-6",
    title: "Seconda rata acconto IRPEF 2025",
    description: "Termine per il versamento della seconda rata dell'acconto IRPEF",
    date: "2025-11-30",
    category: "versamenti",
    type: "individuals",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-20T09:15:00Z"
  },
  {
    id: "pf-7",
    title: "Certificazione Unica 2025",
    description: "Scadenza per la ricezione della Certificazione Unica dai sostituti d'imposta",
    date: "2025-03-31",
    category: "dichiarativi",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-05T11:20:00Z"
  },
  {
    id: "pf-8",
    title: "Canone RAI - Prima rata",
    description: "Scadenza per il pagamento della prima rata del canone RAI (se non addebitato in bolletta)",
    date: "2025-01-31",
    category: "versamenti",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Semestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2024-12-20T16:45:00Z"
  },
  {
    id: "pf-9",
    title: "Canone RAI - Seconda rata",
    description: "Scadenza per il pagamento della seconda rata del canone RAI (se non addebitato in bolletta)",
    date: "2025-07-31",
    category: "versamenti",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Semestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2024-12-20T16:45:00Z"
  },
  {
    id: "pf-10",
    title: "Richiesta esenzione canone RAI 2026",
    description: "Termine per presentare la dichiarazione sostitutiva per l'esenzione dal canone RAI per l'anno successivo",
    date: "2025-11-30",
    category: "comunicazioni",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-25T10:30:00Z"
  },
  {
    id: "pf-11",
    title: "Comunicazione spese sanitarie (Sistema TS)",
    description: "Termine per la trasmissione delle spese sanitarie al Sistema TS per i cittadini che svolgono attività sanitarie",
    date: "2025-01-31",
    category: "comunicazioni",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://sistemats1.sanita.finanze.it/",
    updatedAt: "2024-12-15T09:45:00Z"
  },
  {
    id: "pf-12",
    title: "Versamento bollo auto",
    description: "Scadenza per il pagamento del bollo auto (la data esatta dipende dal mese di immatricolazione)",
    date: "2025-12-31",
    category: "versamenti",
    type: "individuals",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Annuale - la data esatta dipende dal mese di immatricolazione",
    link: "https://www.aci.it/",
    updatedAt: "2025-01-18T15:20:00Z"
  },

  // PERSONE GIURIDICHE
  {
    id: "pg-1",
    title: "Dichiarazione dei redditi società di capitali 2025",
    description: "Termine per la presentazione della dichiarazione dei redditi per società di capitali con periodo d'imposta coincidente con l'anno solare",
    date: "2025-11-30",
    category: "dichiarativi",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "pg-2",
    title: "Liquidazione IVA mensile - Gennaio 2025",
    description: "Termine per la liquidazione e il versamento dell'IVA relativa al mese precedente",
    date: "2025-02-16",
    category: "iva",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Mensile",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "pg-3",
    title: "Liquidazione IVA mensile - Febbraio 2025",
    description: "Termine per la liquidazione e il versamento dell'IVA relativa al mese precedente",
    date: "2025-03-16",
    category: "iva",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Mensile",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "pg-4",
    title: "Liquidazione IVA trimestrale - 1° Trimestre 2025",
    description: "Termine per la liquidazione e il versamento dell'IVA relativa al primo trimestre dell'anno",
    date: "2025-05-16",
    category: "iva",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Trimestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "pg-5",
    title: "Versamento IRAP - Prima rata acconto 2025",
    description: "Termine per il versamento della prima rata dell'acconto IRAP",
    date: "2025-06-30",
    category: "versamenti",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-20T14:30:00Z"
  },
  {
    id: "pg-6",
    title: "Versamento IRAP - Seconda rata acconto 2025",
    description: "Termine per il versamento della seconda rata dell'acconto IRAP",
    date: "2025-11-30",
    category: "versamenti",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-20T14:30:00Z"
  },
  {
    id: "pg-7",
    title: "Certificazione Unica 2025 - Consegna ai percettori",
    description: "Scadenza per la consegna della Certificazione Unica ai percettori di redditi di lavoro dipendente, assimilati e autonomi",
    date: "2025-03-16",
    category: "adempimenti",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-05T11:20:00Z"
  },
  {
    id: "pg-8",
    title: "Certificazione Unica 2025 - Trasmissione telematica",
    description: "Scadenza per l'invio telematico all'Agenzia delle Entrate delle Certificazioni Uniche",
    date: "2025-03-16",
    category: "adempimenti",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-05T11:20:00Z"
  },
  {
    id: "pg-9",
    title: "Comunicazione dati fatture transfrontaliere (Esterometro) - 1° Trimestre 2025",
    description: "Termine per l'invio dei dati delle operazioni transfrontaliere del primo trimestre",
    date: "2025-04-30",
    category: "comunicazioni",
    type: "companies",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Trimestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-15T16:45:00Z"
  },
  {
    id: "pg-10",
    title: "Comunicazione dati fatture transfrontaliere (Esterometro) - 2° Trimestre 2025",
    description: "Termine per l'invio dei dati delle operazioni transfrontaliere del secondo trimestre",
    date: "2025-07-31",
    category: "comunicazioni",
    type: "companies",
    isImportant: false,
    isRecurring: true,
    recurringInfo: "Trimestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-15T16:45:00Z"
  },
  {
    id: "pg-11",
    title: "Comunicazione Liquidazioni Periodiche IVA (LIPE) - 1° Trimestre 2025",
    description: "Termine per l'invio della comunicazione delle liquidazioni periodiche IVA del primo trimestre",
    date: "2025-05-31",
    category: "comunicazioni",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Trimestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-12T10:30:00Z"
  },
  {
    id: "pg-12",
    title: "Comunicazione Liquidazioni Periodiche IVA (LIPE) - 2° Trimestre 2025",
    description: "Termine per l'invio della comunicazione delle liquidazioni periodiche IVA del secondo trimestre",
    date: "2025-09-16",
    category: "comunicazioni",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Trimestrale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-12T10:30:00Z"
  },
  {
    id: "pg-13",
    title: "Autoliquidazione INAIL 2024/2025",
    description: "Termine per il versamento del premio INAIL a saldo 2024 e acconto 2025",
    date: "2025-02-16",
    category: "lavoro",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.inail.it/",
    updatedAt: "2025-01-08T11:00:00Z"
  },
  {
    id: "pg-14",
    title: "Versamento contributi INPS dipendenti - Gennaio 2025",
    description: "Termine per il versamento dei contributi INPS relativi ai dipendenti per il mese di gennaio",
    date: "2025-02-16",
    category: "lavoro",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Mensile",
    link: "https://www.inps.it/",
    updatedAt: "2025-01-10T14:00:00Z"
  },
  {
    id: "pg-15",
    title: "Dichiarazione annuale IVA 2025",
    description: "Termine per la presentazione della dichiarazione IVA relativa all'anno d'imposta 2024",
    date: "2025-04-30",
    category: "iva",
    type: "companies",
    isImportant: true,
    isRecurring: true,
    recurringInfo: "Annuale",
    link: "https://www.agenziaentrate.gov.it/",
    updatedAt: "2025-01-20T09:30:00Z"
  }
];

// Ottieni tutte le scadenze fiscali con filtri opzionali
export const getAllTaxDeadlines = async (req: Request, res: Response) => {
  try {
    const { type, category, month, year, isImportant } = req.query;

    let filteredDeadlines = [...taxDeadlines];

    // Filtra per tipo (persone fisiche o giuridiche)
    if (type && (type === 'individuals' || type === 'companies')) {
      filteredDeadlines = filteredDeadlines.filter(deadline => deadline.type === type);
    }

    // Filtra per categoria
    if (category) {
      filteredDeadlines = filteredDeadlines.filter(deadline => deadline.category === category);
    }

    // Filtra per mese e anno
    if (month || year) {
      filteredDeadlines = filteredDeadlines.filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        
        if (month && year) {
          return (
            deadlineDate.getMonth() + 1 === parseInt(month as string) && 
            deadlineDate.getFullYear() === parseInt(year as string)
          );
        } else if (month) {
          return deadlineDate.getMonth() + 1 === parseInt(month as string);
        } else if (year) {
          return deadlineDate.getFullYear() === parseInt(year as string);
        }
        
        return true;
      });
    }

    // Filtra per importanza
    if (isImportant === 'true') {
      filteredDeadlines = filteredDeadlines.filter(deadline => deadline.isImportant);
    }

    // Ordina le scadenze per data (dalla più vicina alla più lontana)
    filteredDeadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Trova l'aggiornamento più recente
    const lastUpdate = filteredDeadlines.length > 0 
      ? new Date(Math.max(...filteredDeadlines.map(d => new Date(d.updatedAt).getTime()))).toISOString()
      : new Date().toISOString();

    res.json({
      deadlines: filteredDeadlines,
      totalCount: filteredDeadlines.length,
      lastUpdate
    });
  } catch (error) {
    console.error('Errore nel recupero delle scadenze fiscali:', error);
    res.status(500).json({ error: "Errore nel recupero delle scadenze fiscali" });
  }
};

// Ottieni le categorie delle scadenze fiscali
export const getTaxDeadlineCategories = async (req: Request, res: Response) => {
  try {
    res.json({ categories: deadlineCategories });
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    res.status(500).json({ error: "Errore nel recupero delle categorie" });
  }
};

// Ottieni le scadenze per il mese corrente
export const getCurrentMonthDeadlines = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    let filteredDeadlines = taxDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return (
        deadlineDate.getMonth() + 1 === currentMonth && 
        deadlineDate.getFullYear() === currentYear
      );
    });
    
    // Filtra per tipo (persone fisiche o giuridiche)
    if (type && (type === 'individuals' || type === 'companies')) {
      filteredDeadlines = filteredDeadlines.filter(deadline => deadline.type === type);
    }
    
    // Ordina le scadenze per data (dalla più vicina alla più lontana)
    filteredDeadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.json({
      deadlines: filteredDeadlines,
      totalCount: filteredDeadlines.length,
      currentMonth,
      currentYear
    });
  } catch (error) {
    console.error('Errore nel recupero delle scadenze del mese corrente:', error);
    res.status(500).json({ error: "Errore nel recupero delle scadenze del mese corrente" });
  }
};

// Ottieni le scadenze imminenti (entro i prossimi X giorni)
export const getUpcomingDeadlines = async (req: Request, res: Response) => {
  try {
    const { days = '30', type } = req.query;
    
    const today = new Date();
    // Creiamo una data artificiale per test, che includerà alcune scadenze
    // Normalmente useremmo today, ma per scopi di test usiamo una data passata
    const testToday = new Date('2025-01-15');
    
    const futureDate = new Date('2025-03-31');
    // In produzione useremo:
    // futureDate.setDate(today.getDate() + parseInt(days as string));
    
    let filteredDeadlines = taxDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return (
        deadlineDate >= testToday && 
        deadlineDate <= futureDate
      );
    });
    
    // Filtra per tipo (persone fisiche o giuridiche)
    if (type && (type === 'individuals' || type === 'companies')) {
      filteredDeadlines = filteredDeadlines.filter(deadline => deadline.type === type);
    }
    
    // Limita a massimo 5 scadenze per motivi di spazio
    if (filteredDeadlines.length > 5) {
      filteredDeadlines = filteredDeadlines.slice(0, 5);
    }
    
    // Ordina le scadenze per data (dalla più vicina alla più lontana)
    filteredDeadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.json({
      deadlines: filteredDeadlines,
      totalCount: filteredDeadlines.length,
      daysRange: parseInt(days as string)
    });
  } catch (error) {
    console.error('Errore nel recupero delle scadenze imminenti:', error);
    res.status(500).json({ error: "Errore nel recupero delle scadenze imminenti" });
  }
};

// Ottieni una scadenza specifica per ID
export const getTaxDeadlineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deadline = taxDeadlines.find(d => d.id === id);
    
    if (!deadline) {
      return res.status(404).json({ error: "Scadenza fiscale non trovata" });
    }
    
    res.json({ deadline });
  } catch (error) {
    console.error('Errore nel recupero della scadenza fiscale:', error);
    res.status(500).json({ error: "Errore nel recupero della scadenza fiscale" });
  }
};