
import F24OrdinaryEditor from "@/components/utilities/F24OrdinaryEditor";
import { Helmet } from "react-helmet";

export default function F24OrdinaryPage() {
  return (
    <>
      <Helmet>
        <title>Compila F24 Ordinario | ModuliTax</title>
        <meta name="description" content="Compila il modello F24 ordinario online, calcola gli importi e scarica il PDF." />
      </Helmet>
      
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Compila F24 Ordinario</h1>
              <p className="text-lg text-gray-600">
                Compila il modello F24 ordinario, inserisci i dati e genera il PDF pronto per il pagamento.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <F24OrdinaryEditor />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
