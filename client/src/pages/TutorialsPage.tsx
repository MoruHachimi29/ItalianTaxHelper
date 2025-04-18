import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFDocumentCard from "@/components/PDFDocumentCard";

// Import PDF documents
import modelloF23PDF from "@assets/Modello_F23.pdf";
import modelloF24OrdinarioPDF from "@assets/Modello_F24_Ordinario.pdf";
import modelloF24SemplificatoPDF from "@assets/Modello_F24_Semplificato.pdf";
import modelloF24AccisePDF from "@assets/Modello_F24_Accise.pdf";
import modelloF24ElidePDF from "@assets/Modello_F24_Elide.pdf";

// Import PDF instructions
import istruzioniF23PDF from "@assets/Istruzioni_Modello_F23.pdf";
import istruzioniF24PDF from "@assets/Istruzioni_modello_F24.pdf";
import istruzioniF24SemplificatoPDF from "@assets/Istruzioni_F24_semplificato.pdf";
import istruzioniF24AccisePDF from "@assets/Istruzioni_F24_accise.pdf";
import istruzioniF24ElidePDF from "@assets/Istruzioni_Mod_F24_elide.pdf";

// Import thumbnail images (if available)
import modelloF23Image from "@assets/Modello_F23.png";
import modelloF24Image from "@assets/Modello_F24.png";
import modelloF24SemplificatoImage from "@assets/Modello_F24_Semplificato.png";
import modelloF24AcciseImage from "@assets/Modello_F24_Accise.png";
import modelloF24ElideImage from "@assets/Modello_F24_Elementi_identificativi.png";

const templateDocuments = [
  {
    id: "f23",
    title: "Modello F23",
    description: "Modello per il pagamento di tasse, imposte, sanzioni e altre entrate",
    pdfPath: modelloF23PDF,
    thumbnailImage: modelloF23Image
  },
  {
    id: "f24-ordinario",
    title: "Modello F24 Ordinario",
    description: "Modello di pagamento unificato per imposte, tasse e contributi",
    pdfPath: modelloF24OrdinarioPDF,
    thumbnailImage: modelloF24Image
  },
  {
    id: "f24-semplificato",
    title: "Modello F24 Semplificato",
    description: "Versione semplificata del modello F24 per pagamenti più comuni",
    pdfPath: modelloF24SemplificatoPDF,
    thumbnailImage: modelloF24SemplificatoImage
  },
  {
    id: "f24-accise",
    title: "Modello F24 Accise",
    description: "Modello specifico per il pagamento di accise e monopoli di stato",
    pdfPath: modelloF24AccisePDF,
    thumbnailImage: modelloF24AcciseImage
  },
  {
    id: "f24-elide",
    title: "Modello F24 Elide",
    description: "Modello per versamenti con elementi identificativi",
    pdfPath: modelloF24ElidePDF,
    thumbnailImage: modelloF24ElideImage
  }
];

const instructionDocuments = [
  {
    id: "istruzioni-f23",
    title: "Istruzioni Modello F23",
    description: "Guida alla compilazione del modello F23",
    pdfPath: istruzioniF23PDF
  },
  {
    id: "istruzioni-f24",
    title: "Istruzioni Modello F24",
    description: "Guida alla compilazione del modello F24 ordinario",
    pdfPath: istruzioniF24PDF
  },
  {
    id: "istruzioni-f24-semplificato",
    title: "Istruzioni F24 Semplificato",
    description: "Guida alla compilazione del modello F24 semplificato",
    pdfPath: istruzioniF24SemplificatoPDF
  },
  {
    id: "istruzioni-f24-accise",
    title: "Istruzioni F24 Accise",
    description: "Guida alla compilazione del modello F24 accise",
    pdfPath: istruzioniF24AccisePDF
  },
  {
    id: "istruzioni-f24-elide",
    title: "Istruzioni F24 Elide",
    description: "Guida alla compilazione del modello F24 elementi identificativi",
    pdfPath: istruzioniF24ElidePDF
  }
];

export default function TutorialsPage() {
  const { data: tutorials, isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });
  
  const [activeTab, setActiveTab] = useState("tutorial");
  
  return (
    <>
      <Helmet>
        <title>Tutorial e Guide | ModuliTax</title>
        <meta name="description" content="Guide e tutorial per la compilazione dei moduli fiscali F24 ordinario, F24 semplificato, F24 accise, F24 elide e F23." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-serif mb-8 text-center">Tutorial e Documenti</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tutorial">Guide Video</TabsTrigger>
            <TabsTrigger value="modelli">Modelli</TabsTrigger>
            <TabsTrigger value="istruzioni">Istruzioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutorial">
            <h2 className="text-2xl font-bold mb-6">Guide e Tutorial Video</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-6 w-1/3 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials?.map((tutorial) => (
                  <div key={tutorial.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-5xl text-gray-400">
                        {tutorial.isVideo ? "play_circle" : "menu_book"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tutorial.content}</p>
                      {tutorial.isVideo ? (
                        <a 
                          href={tutorial.id === 3 ? `/video-tutorial/come-pagare-imposte-f24` : `/video-tutorial/${tutorial.id}`}
                          className="text-black font-medium hover:underline flex items-center"
                        >
                          Guarda il video
                          <span className="material-icons text-sm ml-1">play_circle</span>
                        </a>
                      ) : (
                        <a 
                          href={`#tutorial-${tutorial.id}`}
                          className="text-black font-medium hover:underline flex items-center"
                        >
                          Leggi la guida
                          <span className="material-icons text-sm ml-1">arrow_forward</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="modelli">
            <h2 className="text-2xl font-bold mb-6">Modelli Fiscali</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templateDocuments.map(doc => (
                <PDFDocumentCard 
                  key={doc.id}
                  title={doc.title}
                  description={doc.description}
                  pdfPath={doc.pdfPath}
                  thumbnailImage={doc.thumbnailImage}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="istruzioni">
            <h2 className="text-2xl font-bold mb-6">Istruzioni di Compilazione</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructionDocuments.map(doc => (
                <PDFDocumentCard 
                  key={doc.id}
                  title={doc.title}
                  description={doc.description}
                  pdfPath={doc.pdfPath}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
