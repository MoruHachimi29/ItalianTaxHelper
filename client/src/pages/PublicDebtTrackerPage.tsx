import Layout from "@/components/Layout";
import PublicDebtTracker from "@/components/utilities/PublicDebtTracker";
import { Helmet } from "react-helmet";

export default function PublicDebtTrackerPage() {
  return (
    <Layout>
      <Helmet>
        <title>Tracker Debito Pubblico | F24Editabile</title>
        <meta name="description" content="Monitora il debito pubblico delle principali economie mondiali, visualizza dati storici e confronta paesi con dati aggiornati quotidianamente." />
        <meta name="keywords" content="debito pubblico, PIL, economia, finanza pubblica, debito/PIL, confronto economie, tracciamento debito" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold mb-4">Tracker Debito Pubblico</h1>
            <p className="text-lg text-gray-600 mb-2">
              Monitora il debito pubblico delle principali economie mondiali con dati aggiornati quotidianamente.
            </p>
            <p className="text-sm text-gray-500">
              I dati sono ottenuti da fonti ufficiali e vengono aggiornati quotidianamente.
              Visualizza l'andamento storico e confronta paesi diversi per un'analisi completa.
            </p>
          </header>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
            <PublicDebtTracker />
          </div>
          
          <div className="text-sm text-gray-500 mt-8 text-center">
            <p>
              Nota: I dati visualizzati rappresentano stime basate sulle informazioni più recenti disponibili.
              Le fonti includono banche centrali, ministeri delle finanze e organizzazioni internazionali.
            </p>
            <p className="mt-2">
              Il rapporto debito/PIL è un indicatore della sostenibilità del debito pubblico di un paese.
              Un valore superiore al 100% indica che il debito totale supera il prodotto interno lordo annuale.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}