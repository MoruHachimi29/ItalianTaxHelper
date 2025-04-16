import OpenAI from "openai";

// Inizializzazione del client OpenAI - nota che l'API key è gestita lato server
const openaiInstance = new OpenAI({ 
  apiKey: "not_used_on_client", // La chiave è usata solo sul server
  dangerouslyAllowBrowser: true
});

/**
 * Servizio per interagire con OpenAI - tutte le chiamate API effettive vanno attraverso il server
 */
export class OpenAIService {
  /**
   * Richiedi dati aggiornati sul debito pubblico
   */
  static async getPublicDebtData(country: string): Promise<any> {
    try {
      const response = await fetch(`/api/public-debt/current?country=${encodeURIComponent(country)}`);
      if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Errore nel recupero dei dati del debito pubblico:", error);
      throw error;
    }
  }

  /**
   * Richiedi dati storici sul debito pubblico
   */
  static async getHistoricalDebtData(country: string, years: number = 5): Promise<any> {
    try {
      const response = await fetch(`/api/public-debt/historical?country=${encodeURIComponent(country)}&years=${years}`);
      if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Errore nel recupero dei dati storici:", error);
      throw error;
    }
  }

  /**
   * Confronta il debito pubblico tra due paesi
   */
  static async comparePublicDebt(country1: string, country2: string): Promise<any> {
    try {
      const response = await fetch(`/api/public-debt/compare?country1=${encodeURIComponent(country1)}&country2=${encodeURIComponent(country2)}`);
      if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Errore nel confronto dei dati:", error);
      throw error;
    }
  }
}