import { useParams } from "wouter";
import FormViewer from "@/components/FormViewer";
import { Helmet } from "react-helmet";

// Map of form types to their display titles
const formTitles: Record<string, string> = {
  "f24-ordinario": "F24 Ordinario",
  "f24-semplificato": "F24 Semplificato",
  "f24-accise": "F24 Accise",
  "f24-elide": "F24 Elide",
  "f23": "F23"
};

export default function FormPage() {
  const params = useParams<{ formType: string }>();
  const formType = params.formType;
  
  // Check if the form type is valid
  const isValidFormType = Object.keys(formTitles).includes(formType);
  
  if (!isValidFormType) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold font-serif mb-4">Modulo non trovato</h1>
        <p className="mb-6">Il modulo richiesto non esiste o non è disponibile.</p>
        <a href="/" className="bg-black text-white px-6 py-3 rounded shadow hover:bg-gray-900 transition-colors">
          Torna alla home
        </a>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Compila {formTitles[formType]} | ModuliTax</title>
        <meta name="description" content={`Compila il modulo ${formTitles[formType]} online, calcola gli importi e scarica il PDF.`} />
      </Helmet>
      
      <FormViewer formType={formType as any} />
    </>
  );
}
