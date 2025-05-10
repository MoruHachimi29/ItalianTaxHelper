import { Helmet } from "react-helmet";
import CodiceFiscaleGenerator from "@/components/utilities/CodiceFiscaleGenerator";

export default function CodiceFiscalePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Calcolo Codice Fiscale - F24Editabile.it</title>
        <meta name="description" content="Calcola il tuo codice fiscale in pochi semplici passaggi. Inserisci i tuoi dati anagrafici e ottieni immediatamente il codice fiscale completo." />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Calcolo Codice Fiscale</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Calcola in modo preciso e affidabile il tuo codice fiscale inserendo i dati anagrafici. 
          Questo strumento ti permette di ottenere il codice fiscale italiano secondo le regole 
          ufficiali definite dall'Agenzia delle Entrate.
        </p>
      </div>

      <CodiceFiscaleGenerator />
      
      <div className="mt-10 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Cos'è il Codice Fiscale?</h2>
        <p>
          Il codice fiscale è un codice alfanumerico di 16 caratteri che identifica in modo 
          univoco ogni cittadino italiano ai fini fiscali e amministrativi. È necessario per 
          molteplici operazioni come l'iscrizione al Sistema Sanitario Nazionale, l'apertura di 
          conti correnti, la stipula di contratti di lavoro e altre pratiche amministrative.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Utilizzi del Codice Fiscale</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Documenti d'identità</h3>
            <p>Compare sulla carta d'identità, patente e altri documenti ufficiali</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Pratiche fiscali</h3>
            <p>Necessario per dichiarazioni dei redditi, F24 e altri adempimenti fiscali</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Contratti e servizi</h3>
            <p>Richiesto per assunzioni, contratti, iscrizioni e servizi pubblici</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-10">
          Nota: Il codice fiscale calcolato da questo strumento è teorico e potrebbe differire da quello 
          ufficiale in casi particolari (come le omocodie). Per ottenere il codice fiscale ufficiale è 
          necessario rivolgersi all'Agenzia delle Entrate.
        </p>
      </div>
    </div>
  );
}