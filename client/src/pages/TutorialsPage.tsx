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
    pdfPath: istruzioniF23PDF,
    thumbnailImage: modelloF23Image
  },
  {
    id: "istruzioni-f24",
    title: "Istruzioni Modello F24",
    description: "Guida alla compilazione del modello F24 ordinario",
    pdfPath: istruzioniF24PDF,
    thumbnailImage: modelloF24Image
  },
  {
    id: "istruzioni-f24-semplificato",
    title: "Istruzioni F24 Semplificato",
    description: "Guida alla compilazione del modello F24 semplificato",
    pdfPath: istruzioniF24SemplificatoPDF,
    thumbnailImage: modelloF24SemplificatoImage
  },
  {
    id: "istruzioni-f24-accise",
    title: "Istruzioni F24 Accise",
    description: "Guida alla compilazione del modello F24 accise",
    pdfPath: istruzioniF24AccisePDF,
    thumbnailImage: modelloF24AcciseImage
  },
  {
    id: "istruzioni-f24-elide",
    title: "Istruzioni F24 Elide",
    description: "Guida alla compilazione del modello F24 elementi identificativi",
    pdfPath: istruzioniF24ElidePDF,
    thumbnailImage: modelloF24ElideImage
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
            <TabsTrigger value="tutorial">Guida Video</TabsTrigger>
            <TabsTrigger value="modelli">Modelli</TabsTrigger>
            <TabsTrigger value="istruzioni">Istruzioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutorial">
            <h2 className="text-2xl font-bold mb-6">Guida Video alla Compilazione del Modello F24</h2>
            {isLoading ? (
              <div className="w-full max-w-4xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="aspect-video w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-1/4 mt-6" />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-black relative group">
                  <video 
                    className="w-full h-full"
                    id="f24-tutorial-video"
                    src="/videos/f24-tutorial.mp4"
                    title="Come compilare il modello F24: Guida Completa"
                    controls
                    poster="/assets/Modello_F24.png"
                  ></video>
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:opacity-100 opacity-90 transition-opacity bg-black bg-opacity-20 play-button"
                    onClick={() => {
                      const video = document.getElementById('f24-tutorial-video') as HTMLVideoElement;
                      const playButton = document.querySelector('.play-button') as HTMLElement;
                      
                      if (video && playButton) {
                        if (video.paused) {
                          video.play();
                          playButton.style.opacity = '0';
                          
                          // Aggiungiamo listener per quando il video viene messo in pausa
                          video.onpause = () => {
                            playButton.style.opacity = '1';
                          };
                          
                          // Aggiungiamo listener per quando il video termina
                          video.onended = () => {
                            playButton.style.opacity = '1';
                          };
                        } else {
                          video.pause();
                          playButton.style.opacity = '1';
                        }
                      }
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-black bg-opacity-60 flex items-center justify-center border-2 border-white shadow-lg transform transition-transform hover:scale-110">
                      <span className="material-icons text-white text-5xl">play_arrow</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Come compilare il modello F24: Guida Completa</h3>
                  <p className="text-gray-700 mb-6">
                    Questa video guida comprende tutte le istruzioni necessarie per compilare correttamente 
                    il modello F24, incluse le sezioni contribuente, erario, INPS, regioni ed enti locali. 
                    Include esempi pratici di compilazione e mostra come calcolare correttamente gli importi 
                    a debito e a credito.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="/moduli"
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
                    >
                      <span className="material-icons mr-2">edit_note</span>
                      Compila Moduli
                    </a>
                    <a 
                      href="/tutorial?tab=modelli"
                      className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <span className="material-icons mr-2">cloud_download</span>
                      Scarica Modelli
                    </a>
                  </div>
                </div>
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
                  thumbnailImage={doc.thumbnailImage}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
