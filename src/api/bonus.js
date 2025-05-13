/**
 * API per bonus e agevolazioni
 * Versione semplificata con dati mockati
 */

export const bonusCategories = [
  {
    id: "famiglia",
    name: "Famiglia",
    icon: "family"
  },
  {
    id: "casa",
    name: "Casa",
    icon: "home"
  },
  {
    id: "lavoro",
    name: "Lavoro",
    icon: "work"
  },
  {
    id: "salute",
    name: "Salute",
    icon: "health"
  },
  {
    id: "istruzione",
    name: "Istruzione",
    icon: "education"
  }
];

export const bonusList = [
  {
    id: "assegno-unico",
    title: "Assegno Unico Universale",
    description: "Sostegno economico per le famiglie con figli a carico.",
    category: "famiglia",
    iseeMax: 40000,
    amount: "fino a 175€ mensili per figlio",
    deadline: "28/02/2024",
    requirements: [
      "Figli a carico fino a 21 anni",
      "Residenza in Italia",
      "Cittadinanza italiana, UE o permesso di soggiorno"
    ],
    howToApply: "Domanda online sul sito INPS o tramite patronato",
    link: "https://www.inps.it/prestazioni-servizi/assegno-unico-e-universale-per-i-figli-a-carico",
    isNew: false,
    isExpiring: true,
    updatedAt: "2023-12-01"
  },
  {
    id: "bonus-asilo-nido",
    title: "Bonus Asilo Nido",
    description: "Contributo per il pagamento delle rette degli asili nido pubblici e privati.",
    category: "famiglia",
    iseeMax: 40000,
    amount: "fino a 3.000€ annui",
    deadline: "31/12/2023",
    requirements: [
      "Figli minori di 3 anni",
      "Iscrizione all'asilo nido",
      "Pagamento della retta"
    ],
    howToApply: "Domanda online sul sito INPS",
    link: "https://www.inps.it/prestazioni-servizi/bonus-asilo-nido-e-forme-di-supporto-presso-la-propria-abitazione",
    isNew: false,
    isExpiring: false,
    updatedAt: "2023-10-15"
  },
  {
    id: "superbonus-110",
    title: "Superbonus 110%",
    description: "Detrazioni fiscali per interventi di efficientamento energetico e riduzione del rischio sismico.",
    category: "casa",
    iseeMax: null,
    amount: "detrazione del 110% delle spese sostenute",
    deadline: "31/12/2023 (con variazioni)",
    requirements: [
      "Interventi di efficientamento energetico",
      "Interventi antisismici",
      "Requisiti tecnici specifici"
    ],
    howToApply: "Tramite dichiarazione dei redditi o cessione del credito/sconto in fattura",
    link: "https://www.agenziaentrate.gov.it/portale/superbonus-110",
    isNew: false,
    isExpiring: true,
    updatedAt: "2023-11-20"
  },
  {
    id: "bonus-mobili",
    title: "Bonus Mobili ed Elettrodomestici",
    description: "Detrazione IRPEF per l'acquisto di mobili e grandi elettrodomestici.",
    category: "casa",
    iseeMax: null,
    amount: "detrazione del 50% su una spesa massima di 8.000€",
    deadline: "31/12/2024",
    requirements: [
      "Acquisto di mobili o elettrodomestici per immobili ristrutturati",
      "Acquisto di elettrodomestici di classe energetica elevata",
      "Ristrutturazione dell'immobile iniziata non oltre 12 mesi prima dell'acquisto"
    ],
    howToApply: "Detrazione IRPEF in dichiarazione dei redditi",
    link: "https://www.agenziaentrate.gov.it/portale/web/guest/bonus-mobili-ed-elettrodomestici/infogen-bonus-mobili-ed-elettrodomestici",
    isNew: true,
    isExpiring: false,
    updatedAt: "2024-01-10"
  },
  {
    id: "bonus-cultura",
    title: "Carta della Cultura Giovani",
    description: "Contributo destinato ai giovani per acquisti culturali.",
    category: "istruzione",
    iseeMax: 35000,
    amount: "500€",
    deadline: "31/01/2024",
    requirements: [
      "18 anni compiuti nel 2023",
      "ISEE non superiore a 35.000€"
    ],
    howToApply: "Registrazione sul portale dedicato",
    link: "https://www.cartegiovani.cultura.gov.it/",
    isNew: true,
    isExpiring: true,
    updatedAt: "2024-01-05"
  }
];

// Ottieni tutte le categorie di bonus
export const getBonusCategories = (req, res) => {
  res.json(bonusCategories);
};

// Ottieni tutti i bonus
export const getAllBonus = (req, res) => {
  res.json(bonusList);
};

// Ottieni i range ISEE
export const getIseeRanges = (req, res) => {
  const ranges = [
    { min: 0, max: 10000, label: "0-10.000€" },
    { min: 10001, max: 20000, label: "10.001-20.000€" },
    { min: 20001, max: 30000, label: "20.001-30.000€" },
    { min: 30001, max: 40000, label: "30.001-40.000€" },
    { min: 40001, max: null, label: "Oltre 40.000€" }
  ];
  res.json(ranges);
};

// Ottieni i bonus nuovi
export const getNewBonus = (req, res) => {
  const newBonus = bonusList.filter(bonus => bonus.isNew);
  res.json(newBonus);
};

// Ottieni i bonus in scadenza
export const getExpiringBonus = (req, res) => {
  const expiringBonus = bonusList.filter(bonus => bonus.isExpiring);
  res.json(expiringBonus);
};

// Ottieni un bonus per ID
export const getBonusById = (req, res) => {
  const bonus = bonusList.find(b => b.id === req.params.id);
  if (bonus) {
    res.json(bonus);
  } else {
    res.status(404).json({ error: "Bonus non trovato" });
  }
};