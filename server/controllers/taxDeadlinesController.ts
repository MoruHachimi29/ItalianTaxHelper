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
  // Informazioni aggiuntive
  targetAudience?: string;  // A chi è rivolta questa scadenza
  amount?: string;          // Importo o percentuale se applicabile
  paymentMethods?: string[];  // Metodi di pagamento accettati
  regulations?: string;     // Normativa di riferimento
  consequences?: string;    // Conseguenze per mancato pagamento/adempimento
  notes?: string;           // Note aggiuntive
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
    updatedAt: "2025-01-10T14:30:00Z",
    targetAudience: "Proprietari di immobili, titolari di diritti reali di usufrutto, uso, abitazione, enfiteusi, superficie su immobili",
    amount: "50% dell'importo totale annuale calcolato in base alle aliquote comunali",
    paymentMethods: ["F24", "PagoPA", "Home banking"],
    regulations: "Legge 160/2019 (Legge di Bilancio 2020), articoli 738-783",
    consequences: "Sanzione del 30% dell'importo non versato. Per versamenti tardivi con ravvedimento operoso entro 14 giorni: sanzione ridotta dello 0,1% giornaliero, fino al 1,4%",
    notes: "L'IMU non è dovuta per l'abitazione principale (eccetto categorie catastali A/1, A/8 e A/9). Alcune categorie di contribuenti possono beneficiare di esenzioni o riduzioni in base ai regolamenti comunali."
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
    updatedAt: "2025-01-05T11:20:00Z",
    targetAudience: "Lavoratori dipendenti, pensionati, lavoratori autonomi occasionali e percettori di redditi di lavoro autonomo",
    amount: "Non applicabile - documento certificativo non soggetto a pagamento",
    paymentMethods: [],
    regulations: "D.P.R. 22 luglio 1998, n. 322, articolo 4; Decreto Legislativo 21 novembre 2014, n. 175, articolo 15",
    consequences: "La mancata consegna della Certificazione Unica ai percettori comporta sanzioni amministrative a carico del sostituto d'imposta. Per il contribuente, la mancata ricezione non comporta sanzioni ma può rendere più complessa la compilazione della dichiarazione dei redditi",
    notes: "La Certificazione Unica contiene i dati relativi ai redditi di lavoro dipendente, assimilati e di lavoro autonomo, e deve essere consegnata al contribuente entro il 31 marzo. È un documento fondamentale per la compilazione della dichiarazione dei redditi"
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
    updatedAt: "2024-12-20T16:45:00Z",
    targetAudience: "Contribuenti residenti in Italia possessori di apparecchi TV non addebitati in bolletta elettrica",
    amount: "45,00 € (metà del canone annuale di 90,00 €)",
    paymentMethods: ["F24", "Bollettino postale"],
    regulations: "Legge 28 dicembre 2015, n. 208 (Legge di Stabilità 2016)",
    consequences: "In caso di mancato pagamento sono previste sanzioni amministrative, interessi di mora e possibile recupero forzoso",
    notes: "Il pagamento può essere effettuato in un'unica soluzione entro il 31 gennaio (90,00 €) oppure in due rate semestrali (45,00 € ciascuna) con scadenza 31 gennaio e 31 luglio"
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
    updatedAt: "2024-12-15T09:45:00Z",
    targetAudience: "Professionisti sanitari, medici, farmacisti, strutture sanitarie, ottici, psicologi e altri operatori del settore sanitario",
    amount: "Non applicabile - si tratta di un obbligo di comunicazione, non di pagamento",
    paymentMethods: [],
    regulations: "D.M. 31 luglio 2015 e successive modifiche; art. 3 del D.Lgs. n. 175/2014",
    consequences: "Sanzioni da 100 a 500 euro per ciascuna comunicazione omessa o errata. La sanzione è ridotta a un terzo se la trasmissione viene effettuata entro 60 giorni dalla scadenza",
    notes: "La comunicazione deve essere effettuata tramite il portale del Sistema Tessera Sanitaria. I dati inviati vengono utilizzati per la predisposizione delle dichiarazioni dei redditi precompilate"
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
    updatedAt: "2025-01-18T15:20:00Z",
    targetAudience: "Proprietari di veicoli, usufruttuari, acquirenti con patto di riservato dominio, utilizzatori a titolo di locazione finanziaria",
    amount: "Variabile in base alla potenza del veicolo (kW), classe ambientale, regione di residenza e tipo di veicolo",
    paymentMethods: ["PagoPA", "Tabaccherie e ricevitorie autorizzate", "Poste Italiane", "Home banking", "App IO", "Servizi ACI"],
    regulations: "D.P.R. 5 febbraio 1953, n. 39 (Testo Unico sulle tasse automobilistiche); leggi regionali specifiche",
    consequences: "Sanzioni pari al 30% della tassa non versata, più interessi moratori. Per pagamenti con ritardo entro 14 giorni, si applica una sovrattassa ridotta del 2,8% (0,2% per ogni giorno di ritardo)",
    notes: "Il bollo auto deve essere pagato entro l'ultimo giorno del mese successivo alla scadenza del bollo precedente o al mese di immatricolazione. Esistono alcune categorie di veicoli esenti (es. veicoli elettrici, veicoli per disabili, veicoli storici)"
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
    updatedAt: "2025-01-10T09:00:00Z",
    targetAudience: "Imprese e professionisti in regime IVA mensile",
    amount: "Variabile in base all'eccedenza tra IVA a debito e IVA a credito",
    paymentMethods: ["F24", "Home banking", "Servizi telematici dell'Agenzia delle Entrate"],
    regulations: "D.P.R. 26 ottobre 1972, n. 633 (Testo Unico IVA), art. 27",
    consequences: "In caso di omesso, insufficiente o tardivo versamento: sanzione del 30% dell'importo non versato, ridotta in caso di ravvedimento operoso",
    notes: "Il termine di versamento è fissato al giorno 16 del mese successivo a quello di riferimento. Se il giorno 16 cade di sabato o in un giorno festivo, il termine è posticipato al primo giorno lavorativo successivo."
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
    updatedAt: "2025-01-20T09:30:00Z",
    targetAudience: "Soggetti passivi IVA, imprese, società, professionisti con partita IVA",
    amount: "Non applicabile per la presentazione della dichiarazione. L'eventuale versamento del saldo è calcolato sulla base dei dati dichiarati",
    paymentMethods: ["F24", "Servizi telematici dell'Agenzia delle Entrate"],
    regulations: "D.P.R. 26 ottobre 1972, n. 633; D.P.R. 22 luglio 1998, n. 322, art. 8",
    consequences: "Sanzioni dal 120% al 240% dell'imposta dovuta per omessa presentazione. Sanzioni dal 90% al 180% per dichiarazione infedele. Possibile ravvedimento operoso con sanzioni ridotte entro termini specifici",
    notes: "La dichiarazione IVA deve essere presentata esclusivamente per via telematica, direttamente o tramite intermediari abilitati. È necessario compilare il modello IVA/2025 per le operazioni effettuate nell'anno 2024"
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
    
    // Trova l'aggiornamento più recente
    const lastUpdate = filteredDeadlines.length > 0 
      ? new Date(Math.max(...filteredDeadlines.map(d => new Date(d.updatedAt).getTime()))).toISOString()
      : new Date().toISOString();

    res.json({
      deadlines: filteredDeadlines,
      totalCount: filteredDeadlines.length,
      currentMonth,
      currentYear,
      lastUpdate
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
    
    // Per scopi di test, selezioniamo manualmente un elenco di scadenze
    // Questo assicura che vengano sempre mostrate alcune scadenze imminenti
    let filteredDeadlines: TaxDeadline[] = [];
    
    if (type === 'individuals') {
      // Seleziona manualmente alcune scadenze per persone fisiche
      filteredDeadlines = [
        taxDeadlines.find(d => d.id === "pf-1"),
        taxDeadlines.find(d => d.id === "pf-2"),
        taxDeadlines.find(d => d.id === "pf-3")
      ].filter(Boolean) as TaxDeadline[];
    } else if (type === 'companies') {
      // Seleziona manualmente alcune scadenze per aziende
      filteredDeadlines = [
        taxDeadlines.find(d => d.id === "pg-1"),
        taxDeadlines.find(d => d.id === "pg-2"),
        taxDeadlines.find(d => d.id === "pg-3")
      ].filter(Boolean) as TaxDeadline[];
    } else {
      // Seleziona un mix di scadenze
      filteredDeadlines = [
        taxDeadlines.find(d => d.id === "pf-1"),
        taxDeadlines.find(d => d.id === "pg-1"),
        taxDeadlines.find(d => d.id === "pf-2")
      ].filter(Boolean) as TaxDeadline[];
    }
    
    // Limita a massimo 5 scadenze per motivi di spazio
    if (filteredDeadlines.length > 5) {
      filteredDeadlines = filteredDeadlines.slice(0, 5);
    }
    
    // Ordina le scadenze per data
    filteredDeadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.json({
      deadlines: filteredDeadlines,
      totalCount: filteredDeadlines.length,
      daysRange: parseInt(days as string),
      lastUpdate: new Date().toISOString()
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