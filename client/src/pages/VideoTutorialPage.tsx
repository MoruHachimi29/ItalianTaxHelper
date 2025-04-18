import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import thumbnailImage from "@assets/f24-video-thumbnail.svg";

// Video embed sections for our different tutorial types
const videoEmbeds = {
  "come-pagare-imposte-f24": {
    title: "Come Pagare le Imposte con Modello F24",
    videoId: "dQw4w9WgXcQ", // Example video ID, replace with actual video
    description: `
      <p>Questo tutorial video ti guida passo passo attraverso il processo di pagamento delle imposte utilizzando il modello F24, spiegando in modo chiaro e dettagliato:</p>
      <ul>
        <li>Come identificare correttamente i campi del modello F24</li>
        <li>Come inserire i codici tributo e i periodi di riferimento</li>
        <li>Come compilare la sezione contribuente con i dati anagrafici e fiscali</li>
        <li>Come calcolare correttamente gli importi da versare</li>
        <li>Come effettuare il pagamento presso banche, poste o online</li>
        <li>Come verificare la correttezza del modello prima della presentazione</li>
      </ul>
      <p>Segui attentamente le istruzioni animate per evitare errori comuni e assicurarti che il pagamento venga processato correttamente dalle autorità fiscali.</p>
    `,
    // Video chapters/sections
    chapters: [
      { time: "00:00", title: "Introduzione al modello F24" },
      { time: "01:15", title: "Sezione contribuente: dati anagrafici" },
      { time: "03:42", title: "Compilazione sezione Erario" },
      { time: "06:30", title: "Compilazione sezione INPS e altri enti" },
      { time: "09:15", title: "Calcolo degli importi a debito e a credito" },
      { time: "12:20", title: "Modalità di pagamento" },
      { time: "15:45", title: "Controlli finali e invio" },
      { time: "18:30", title: "Esempi pratici completi" }
    ],
    // Related resources
    resources: [
      { title: "Modello F24 Ordinario", url: "/tutorial?tab=modelli" },
      { title: "Istruzioni Modello F24", url: "/tutorial?tab=istruzioni" },
      { title: "Compilazione F24 Online", url: "/moduli/f24-ordinario" }
    ]
  }
};

export default function VideoTutorialPage() {
  const { slug } = useParams<{ slug: string }>();
  const videoData = videoEmbeds[slug as keyof typeof videoEmbeds];
  
  // Fetch tutorial data (as backup if videoData is not found)
  const { data: tutorials, isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });
  
  // If slug doesn't match any of our predefined videos, try to find it in the tutorials
  if (!videoData && !isLoading && tutorials) {
    const tutorial = tutorials.find(t => t.isVideo && t.videoUrl);
    if (tutorial) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Helmet>
            <title>{tutorial.title} | F24Editabile</title>
            <meta name="description" content={tutorial.content} />
          </Helmet>
          
          <div className="mb-6">
            <Link href="/tutorial">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft size={16} />
                Torna ai Tutorial
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">{tutorial.title}</h1>
          
          <div className="aspect-video mb-8 bg-black">
            <iframe 
              className="w-full h-full"
              src={tutorial.videoUrl}
              title={tutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p>{tutorial.content}</p>
          </div>
        </div>
      );
    }
  }
  
  // Return our enhanced video tutorial page for predefined videos
  if (videoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>{videoData.title} | F24Editabile</title>
          <meta name="description" content="Tutorial video dettagliato su come pagare le imposte con il modello F24, con spiegazioni passo passo ed esempi pratici." />
        </Helmet>
        
        <div className="mb-6">
          <Link href="/tutorial">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              Torna ai Tutorial
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{videoData.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video embed */}
            <div className="aspect-video mb-8 bg-black">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoData.videoId}`}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Description */}
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: videoData.description }}></div>
            
            {/* Chapters */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Contenuti del video</h3>
              <div className="space-y-2">
                {videoData.chapters.map((chapter, index) => (
                  <div key={index} className="flex border-b border-gray-100 pb-2">
                    <div className="w-16 font-mono text-gray-600">{chapter.time}</div>
                    <div className="flex-1">{chapter.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Sidebar with related resources */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Risorse correlate</h3>
              <div className="space-y-4">
                {videoData.resources.map((resource, index) => (
                  <div key={index}>
                    <Link href={resource.url}>
                      <a className="flex items-center gap-2 text-black hover:underline">
                        <span className="material-icons text-gray-600 text-sm">arrow_forward</span>
                        {resource.title}
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Moduli compilabili</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dopo aver guardato il tutorial, puoi compilare il modello F24 direttamente online:
                </p>
                <Link href="/moduli/f24-ordinario">
                  <Button className="w-full bg-black hover:bg-gray-800">Compila F24 Online</Button>
                </Link>
              </div>
            </div>
            
            {/* Download section */}
            <div className="border border-gray-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Scarica i modelli</h3>
              <div className="space-y-3">
                <div>
                  <Link href="/assets/Modello_F24_Ordinario.pdf" target="_blank">
                    <a className="flex items-center gap-2 text-black hover:underline">
                      <span className="material-icons text-gray-600">download</span>
                      Modello F24 (PDF)
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/assets/Istruzioni_modello_F24.pdf" target="_blank">
                    <a className="flex items-center gap-2 text-black hover:underline">
                      <span className="material-icons text-gray-600">download</span>
                      Istruzioni F24 (PDF)
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Return "not found" message if no matching video is found
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <Helmet>
        <title>Tutorial non trovato | F24Editabile</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Tutorial non trovato</h1>
      <p className="mb-8">Il tutorial video richiesto non è disponibile.</p>
      
      <Link href="/tutorial">
        <Button variant="outline" className="flex items-center gap-2 mx-auto">
          <ChevronLeft size={16} />
          Torna ai Tutorial
        </Button>
      </Link>
    </div>
  );
}