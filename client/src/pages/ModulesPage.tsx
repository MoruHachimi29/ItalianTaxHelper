import FormsList from "@/components/FormsList";

export default function ModulesPage() {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Moduli Fiscali</h1>
          <p className="text-lg text-gray-600">
            Seleziona il modulo fiscale che desideri compilare. Tutti i moduli sono pre-compilabili 
            online, con funzionalità di calcolo automatico e possibilità di scaricare il documento in PDF.
          </p>
        </div>
        
        <FormsList />
      </div>
    </div>
  );
}