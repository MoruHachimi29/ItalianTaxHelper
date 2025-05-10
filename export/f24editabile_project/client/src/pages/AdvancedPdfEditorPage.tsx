import { Helmet } from "react-helmet";
import AdvancedPdfEditor from "@/components/utilities/AdvancedPdfEditor";

export default function AdvancedPdfEditorPage() {
  return (
    <>
      <Helmet>
        <title>Editor PDF Professionale - F24Editabile</title>
        <meta name="description" content="Editor avanzato per annotazioni PDF, evidenziazioni, firme e molto altro. Basato sulle funzionalità di SmallPDF con strumenti di annotazione professionali." />
        <meta name="keywords" content="editor pdf, annotazione pdf, firma pdf, evidenziatore pdf, smallpdf, editor pdf professionale, strumenti pdf" />
      </Helmet>
      
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Editor PDF Professionale</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Strumento avanzato per modificare, annotare e firmare i tuoi documenti PDF con funzionalità professionali simili a SmallPDF.
              </p>
            </div>
            
            <AdvancedPdfEditor />
            
            <div className="mt-16 bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Guida rapida all'utilizzo</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">✏️ Annotazioni e evidenziazioni</h3>
                  <p className="text-gray-600">Usa gli strumenti di disegno e l'evidenziatore per annotare parti importanti del documento.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">🖊️ Aggiungi testo</h3>
                  <p className="text-gray-600">Inserisci caselle di testo ovunque nel documento per aggiungere note o compilare moduli.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">📝 Firma elettronica</h3>
                  <p className="text-gray-600">Crea e inserisci la tua firma digitale direttamente nel documento PDF.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">⚙️ Forme e immagini</h3>
                  <p className="text-gray-600">Aggiungi forme geometriche come rettangoli, cerchi, linee e frecce, o inserisci immagini dal tuo dispositivo.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">🔄 Operazioni di documento</h3>
                  <p className="text-gray-600">Ruota pagine, aggiungi filigrane e sfrutta le funzionalità di modifica avanzate.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Vantaggi dell'Editor PDF Professionale</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Interfaccia intuitiva ispirata a SmallPDF per un'esperienza d'uso professionale</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Strumenti di annotazione avanzati: evidenziatore, pennello, forme e testo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Possibilità di aggiungere firme digitali per validare documenti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Funzionalità di annullamento e ripristino per correggere facilmente gli errori</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Cronologia completa delle modifiche apportate al documento</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Operazioni avanzate come rotazione, aggiunta di filigrane e modifiche di pagina</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}