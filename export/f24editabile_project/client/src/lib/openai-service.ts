/**
 * Servizio per interagire con l'API OpenAI tramite il backend
 */
export class OpenAIService {
  /**
   * Ottiene i dati attuali del debito pubblico per un paese specifico
   * @param country - Il nome del paese
   * @returns I dati del debito pubblico
   */
  static async getPublicDebtData(country: string) {
    try {
      const response = await fetch(`/api/public-debt/current?country=${encodeURIComponent(country)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore nel recupero dei dati del debito pubblico");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Errore nel servizio OpenAI:", error);
      throw error;
    }
  }
  
  /**
   * Ottiene i dati storici del debito pubblico per un paese specifico
   * @param country - Il nome del paese
   * @param years - Il numero di anni da considerare
   * @returns I dati storici del debito pubblico
   */
  static async getHistoricalDebtData(country: string, years: number = 5) {
    try {
      const response = await fetch(`/api/public-debt/historical?country=${encodeURIComponent(country)}&years=${years}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore nel recupero dei dati storici");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Errore nel servizio OpenAI:", error);
      throw error;
    }
  }
  
  /**
   * Confronta il debito pubblico tra due paesi
   * @param country1 - Il nome del primo paese
   * @param country2 - Il nome del secondo paese
   * @returns I dati di confronto tra i due paesi
   */
  static async comparePublicDebt(country1: string, country2: string) {
    try {
      const response = await fetch(`/api/public-debt/compare?country1=${encodeURIComponent(country1)}&country2=${encodeURIComponent(country2)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore nel confronto dei dati");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Errore nel servizio OpenAI:", error);
      throw error;
    }
  }
}