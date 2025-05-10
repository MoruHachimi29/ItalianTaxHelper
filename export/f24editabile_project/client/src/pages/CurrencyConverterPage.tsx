import CurrencyConverter from "../components/utilities/CurrencyConverter";

export default function CurrencyConverterPage() {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Convertitore di Valuta</h1>
          <p className="text-lg text-gray-600">
            Strumento per convertire facilmente tra diverse valute utilizzando tassi di cambio aggiornati.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
}