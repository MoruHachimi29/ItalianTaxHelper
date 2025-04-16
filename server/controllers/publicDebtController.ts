import { Request, Response } from "express";
import OpenAI from "openai";

// Inizializzazione del client OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
export const getCurrentPublicDebt = async (req: Request, res: Response) => {
  const { country } = req.query;
  
  if (!country || typeof country !== "string") {
    return res.status(400).json({ error: "È necessario specificare un paese valido." });
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
    const data = JSON.parse(completion.choices[0].message.content);
    return res.json(data);
  } catch (error) {
    console.error("Errore nel recupero del debito pubblico:", error);
    return res.status(500).json({ 
      error: "Si è verificato un errore durante il recupero dei dati sul debito pubblico.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Ottiene dati storici sul debito pubblico
 */
export const getHistoricalPublicDebt = async (req: Request, res: Response) => {
  const { country, years = "5" } = req.query;
  
  if (!country || typeof country !== "string") {
    return res.status(400).json({ error: "È necessario specificare un paese valido." });
  }

  const numYears = parseInt(years as string) || 5;

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
    const data = JSON.parse(completion.choices[0].message.content);
    return res.json(data);
  } catch (error) {
    console.error("Errore nel recupero dei dati storici:", error);
    return res.status(500).json({ 
      error: "Si è verificato un errore durante il recupero dei dati storici.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Confronta il debito pubblico tra due paesi
 */
export const comparePublicDebt = async (req: Request, res: Response) => {
  const { country1, country2 } = req.query;
  
  if (!country1 || !country2 || typeof country1 !== "string" || typeof country2 !== "string") {
    return res.status(400).json({ error: "È necessario specificare due paesi validi per il confronto." });
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
    const data = JSON.parse(completion.choices[0].message.content);
    return res.json(data);
  } catch (error) {
    console.error("Errore nel confronto dei dati:", error);
    return res.status(500).json({ 
      error: "Si è verificato un errore durante il confronto dei dati sul debito pubblico.",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};