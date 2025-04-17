import { Helmet } from "react-helmet";
import F24OrdinaryForm from "@/components/forms/F24OrdinaryForm";

export default function F24OrdinaryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Modello F24 Ordinario - F24Editabile.it</title>
        <meta name="description" content="Compilazione modello F24 ordinario online. Compila, calcola, stampa e salva il modello F24 con la nostra interfaccia user-friendly." />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Modello F24 Ordinario</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Compila il modello F24 ordinario online in modo semplice e veloce. La nostra interfaccia ti permette di inserire tutti i dati necessari, calcolare automaticamente i totali e generare un PDF pronto per la stampa o l'invio.
        </p>
      </div>

      <F24OrdinaryForm />
      
      <div className="mt-12 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Cos'è il Modello F24 Ordinario?</h2>
        <p className="mb-4">
          Il modello F24 ordinario è il modulo utilizzato per il versamento della maggior parte delle imposte, tasse e contributi dovuti da persone fisiche e giuridiche.
          Permette di effettuare con un'unica operazione il pagamento di diverse tipologie di tributi, compensando eventuali crediti.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Principali tributi versabili con il Modello F24 Ordinario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Imposte sui redditi</h3>
            <p>IRPEF, IRES, addizionali comunali e regionali, cedolare secca</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">IVA</h3>
            <p>Liquidazioni periodiche, acconto, saldo, regolarizzazioni</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Contributi previdenziali</h3>
            <p>INPS (dipendenti, artigiani, commercianti, gestione separata), INAIL</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Tributi locali</h3>
            <p>IMU, TASI, tributi comunali, regionali e locali vari</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-10">
          Nota: Questo strumento è fornito a scopo informativo. Verifica sempre la correttezza dei dati inseriti prima dell'invio o del pagamento.
        </p>
      </div>
    </div>
  );
}