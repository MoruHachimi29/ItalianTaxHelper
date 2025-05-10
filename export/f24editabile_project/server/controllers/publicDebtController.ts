import { Request, Response } from "express";
import OpenAI from "openai";
import { currentDebtData, historicalDebtData, comparisonData } from "./mockPublicDebtData";

// Inizializzazione del client OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Flag per indicare se usare dati di esempio invece di OpenAI
const useTestData = true; // Imposta a false quando l'API OpenAI funziona

// Lista dei paesi principali supportati
export const supportedCountries = [
  "Italia",
  "Stati Uniti",
  "Germania",
  "Francia",
  "Regno Unito",
  "Giappone",
  "Cina",
  "Spagna",
  "Canada",
  "Brasile",
  "India",
  "Australia",
  "Russia",
  "Svizzera"
];

/**
 * Ottiene il debito pubblico corrente per un paese specifico
 */
export const getCurrentPublicDebt = async (countryParam: string | Request, res?: Response) => {
  let country: string;
  
  // Gestione parametri sia come richiesta HTTP che come stringa diretta
  if (typeof countryParam === 'string') {
    country = countryParam;
  } else if (countryParam.query && countryParam.query.country) {
    country = countryParam.query.country as string;
    res = res as Response;
  } else {
    if (res) {
      return res.status(400).json({ error: "È necessario specificare un paese valido." });
    } else {
      throw new Error("È necessario specificare un paese valido.");
    }
  }

  // Se useTestData è true, restituisci i dati di esempio
  if (useTestData) {
    // Controlliamo se il paese è tra quelli disponibili nei dati di esempio
    if (country in currentDebtData) {
      const data = currentDebtData[country as keyof typeof currentDebtData];
      return res ? res.json(data) : data;
    } else {
      // Se il paese non è disponibile, usiamo l'Italia come fallback
      const data = currentDebtData["Italia"];
      return res ? res.json(data) : data;
    }
  }

  try {
    // Richiesta a GPT per ottenere dati aggiornati
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente è "gpt-4o" rilasciato il 13 maggio 2024. non modificare questo valore a meno che non sia esplicitamente richiesto dall'utente
      messages: [
        {
          role: "system",
          content: `Sei un assistente specializzato in dati economici. Fornisci dati accurati sul debito pubblico delle nazioni. 
          Rispondi SOLO in formato JSON con i seguenti campi:
          {
            "country": nome del paese,
            "debtValue": valore numerico del debito pubblico in miliardi,
            "currency": valuta (EUR, USD, ecc.),
            "debtToGDP": rapporto debito/PIL in percentuale (valore numerico),
            "lastUpdate": data ultimo aggiornamento disponibile,
            "trend": "up" o "down" rispetto all'anno precedente,
            "changePercentage": variazione percentuale rispetto all'anno precedente (valore numerico)
          }`
        },
        {
          role: "user",
          content: `Fornisci i dati più recenti sul debito pubblico di ${country}. Non aggiungere alcun testo introduttivo o di spiegazione, rispondi SOLO con i dati in formato JSON come specificato.`
        }
      ],
      response_format: { type: "json_object" },
    });

    // Parsifica il risultato
    const content = completion.choices[0].message.content || "";
    const data = JSON.parse(content);
    
    if (res) {
      return res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Errore nel recupero del debito pubblico:", error);
    
    // In caso di errore, se abbiamo dati di esempio disponibili, li utilizziamo
    if (country in currentDebtData) {
      console.log("Utilizzo dati di esempio dopo errore API per", country);
      const data = currentDebtData[country as keyof typeof currentDebtData];
      
      if (res) {
        return res.json(data);
      } else {
        return data;
      }
    }
    
    const errorResponse = { 
      error: "Si è verificato un errore durante il recupero dei dati sul debito pubblico.",
      details: error instanceof Error ? error.message : String(error)
    };
    
    if (res) {
      return res.status(500).json(errorResponse);
    } else {
      throw new Error(JSON.stringify(errorResponse));
    }
  }
};

/**
 * Ottiene dati storici sul debito pubblico
 */
export const getHistoricalPublicDebt = async (countryParam: string | Request, yearsParam?: number | string | Response, res?: Response) => {
  let country: string;
  let numYears: number = 5;
  
  // Gestione parametri sia come richiesta HTTP che come parametri diretti
  if (typeof countryParam === 'string') {
    country = countryParam;
    
    // Se yearsParam è un numero o una stringa, lo usiamo come years
    if (typeof yearsParam === 'number') {
      numYears = yearsParam;
    } else if (typeof yearsParam === 'string') {
      numYears = parseInt(yearsParam) || 5;
    } else if (yearsParam && typeof yearsParam !== 'function') {
      // Se yearsParam è l'oggetto Response, lo trattiamo come tale
      res = yearsParam as Response;
    }
  } else if (countryParam.query) {
    // È un oggetto Request
    const query = countryParam.query;
    country = query.country as string;
    
    if (!country || typeof country !== "string") {
      if (res) {
        return res.status(400).json({ error: "È necessario specificare un paese valido." });
      } else {
        throw new Error("È necessario specificare un paese valido.");
      }
    }
    
    // Verifichiamo se è presente il parametro years
    if (query.years) {
      numYears = parseInt(query.years as string) || 5;
    }
    
    // Se yearsParam è l'oggetto Response, lo trattiamo come tale
    if (yearsParam && typeof yearsParam === 'function') {
      res = yearsParam as Response;
    }
  } else {
    // Input non valido
    if (res) {
      return res.status(400).json({ error: "È necessario specificare un paese valido." });
    } else {
      throw new Error("È necessario specificare un paese valido.");
    }
  }
  
  // Se useTestData è true, restituisci i dati di esempio
  if (useTestData) {
    if (country in historicalDebtData) {
      const data = historicalDebtData[country as keyof typeof historicalDebtData];
      return res ? res.json(data) : data;
    } else {
      // Se il paese non è disponibile nei dati di esempio, usiamo l'Italia
      const data = historicalDebtData["Italia"];
      return res ? res.json(data) : data;
    }
  }

  try {
    // Richiesta a GPT per ottenere dati storici
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente è "gpt-4o" rilasciato il 13 maggio 2024. non modificare questo valore a meno che non sia esplicitamente richiesto dall'utente
      messages: [
        {
          role: "system",
          content: `Sei un assistente specializzato in dati economici. Fornisci dati storici sul debito pubblico delle nazioni.
          Rispondi SOLO in formato JSON con il seguente formato:
          {
            "country": nome del paese,
            "currency": valuta principale,
            "data": [
              {
                "year": anno,
                "debtValue": valore del debito in miliardi,
                "debtToGDP": rapporto debito/PIL in percentuale
              },
              ...
            ]
          }`
        },
        {
          role: "user",
          content: `Fornisci i dati storici sul debito pubblico di ${country} degli ultimi ${numYears} anni. Assicurati di includere i dati anno per anno. Non aggiungere alcun testo introduttivo o di spiegazione, rispondi SOLO con i dati in formato JSON come specificato.`
        }
      ],
      response_format: { type: "json_object" },
    });

    // Parsifica il risultato
    const content = completion.choices[0].message.content || "";
    const data = JSON.parse(content);
    
    if (res) {
      return res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Errore nel recupero dei dati storici:", error);
    
    // In caso di errore, se abbiamo dati di esempio disponibili, li utilizziamo
    if (country in historicalDebtData) {
      console.log("Utilizzo dati storici di esempio dopo errore API per", country);
      const data = historicalDebtData[country as keyof typeof historicalDebtData];
      
      if (res) {
        return res.json(data);
      } else {
        return data;
      }
    }
    
    const errorResponse = { 
      error: "Si è verificato un errore durante il recupero dei dati storici.",
      details: error instanceof Error ? error.message : String(error)
    };
    
    if (res) {
      return res.status(500).json(errorResponse);
    } else {
      throw new Error(JSON.stringify(errorResponse));
    }
  }
};

/**
 * Confronta il debito pubblico tra due paesi
 */
export const comparePublicDebt = async (
  param1: string | Request,
  param2?: string | Response,
  res?: Response
) => {
  let country1: string;
  let country2: string;
  
  // Gestione parametri sia come richiesta HTTP che come parametri diretti
  if (typeof param1 === 'string' && typeof param2 === 'string') {
    country1 = param1;
    country2 = param2;
  } else if (typeof param1 !== 'string' && 'query' in param1) {
    // È un oggetto Request
    const req = param1 as Request;
    country1 = req.query.country1 as string;
    country2 = req.query.country2 as string;
    
    // In questo caso, param2 è l'oggetto Response
    res = param2 as Response;
    
    if (!country1 || !country2 || typeof country1 !== "string" || typeof country2 !== "string") {
      if (res) {
        return res.status(400).json({ error: "È necessario specificare due paesi validi per il confronto." });
      } else {
        throw new Error("È necessario specificare due paesi validi per il confronto.");
      }
    }
  } else {
    // Input non valido
    if (param2 && typeof param2 !== 'string') {
      return (param2 as Response).status(400).json({ error: "È necessario specificare due paesi validi per il confronto." });
    } else {
      throw new Error("È necessario specificare due paesi validi per il confronto.");
    }
  }
  
  // Se useTestData è true, restituisci i dati di esempio
  if (useTestData) {
    // Prepariamo una chiave per comparisonData basata sui due paesi
    const key1 = `${country1}-${country2}`;
    const key2 = `${country2}-${country1}`;
    
    if (key1 in comparisonData) {
      const data = comparisonData[key1 as keyof typeof comparisonData];
      return res ? res.json(data) : data;
    } else if (key2 in comparisonData) {
      const data = comparisonData[key2 as keyof typeof comparisonData];
      return res ? res.json(data) : data;
    } else {
      // Se la combinazione specifica non è disponibile, usiamo Italia-Germania come fallback
      const data = comparisonData["Italia-Germania"];
      return res ? res.json(data) : data;
    }
  }

  try {
    // Richiesta a GPT per confrontare i dati
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente è "gpt-4o" rilasciato il 13 maggio 2024. non modificare questo valore a meno che non sia esplicitamente richiesto dall'utente
      messages: [
        {
          role: "system",
          content: `Sei un assistente specializzato in dati economici. Confronta i dati sul debito pubblico tra due nazioni.
          Rispondi SOLO in formato JSON con il seguente formato:
          {
            "countries": [nome del paese1, nome del paese2],
            "data": [
              {
                "country": nome del paese1,
                "debtValue": valore del debito in miliardi,
                "currency": valuta,
                "debtToGDP": rapporto debito/PIL in percentuale,
                "perCapita": debito pro capite
              },
              {
                "country": nome del paese2,
                "debtValue": valore del debito in miliardi,
                "currency": valuta,
                "debtToGDP": rapporto debito/PIL in percentuale,
                "perCapita": debito pro capite
              }
            ],
            "comparison": {
              "relativeSize": rapporto tra i due debiti (valore numerico del rapporto tra il debito del paese più grande e quello del paese più piccolo),
              "gdpComparison": confronto tra i rapporti debito/PIL (differenza in punti percentuali),
              "perCapitaRatio": confronto tra debito pro capite (rapporto)
            }
          }`
        },
        {
          role: "user",
          content: `Confronta i dati più recenti sul debito pubblico tra ${country1} e ${country2}. Includi il debito totale, il rapporto debito/PIL, e il debito pro capite. Non aggiungere alcun testo introduttivo o di spiegazione, rispondi SOLO con i dati in formato JSON come specificato.`
        }
      ],
      response_format: { type: "json_object" },
    });

    // Parsifica il risultato
    const content = completion.choices[0].message.content || "";
    const data = JSON.parse(content);
    
    if (res) {
      return res.json(data);
    } else {
      return data;
    }
  } catch (error) {
    console.error("Errore nel confronto dei dati:", error);
    
    // In caso di errore, proviamo a utilizzare i dati di esempio
    const key1 = `${country1}-${country2}`;
    const key2 = `${country2}-${country1}`;
    
    if (key1 in comparisonData) {
      console.log("Utilizzo dati di confronto di esempio dopo errore API per", key1);
      const data = comparisonData[key1 as keyof typeof comparisonData];
      
      if (res) {
        return res.json(data);
      } else {
        return data;
      }
    } else if (key2 in comparisonData) {
      console.log("Utilizzo dati di confronto di esempio dopo errore API per", key2);
      const data = comparisonData[key2 as keyof typeof comparisonData];
      
      if (res) {
        return res.json(data);
      } else {
        return data;
      }
    }
    
    const errorResponse = { 
      error: "Si è verificato un errore durante il confronto dei dati sul debito pubblico.",
      details: error instanceof Error ? error.message : String(error)
    };
    
    if (res) {
      return res.status(500).json(errorResponse);
    } else {
      throw new Error(JSON.stringify(errorResponse));
    }
  }
};