import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

export default function TutorialsPage() {
  const { data: tutorials, isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });
  
  return (
    <>
      <Helmet>
        <title>Tutorial e Guide | ModuliTax</title>
        <meta name="description" content="Guide e tutorial per la compilazione dei moduli fiscali F24 ordinario, F24 semplificato, F24 accise, F24 elide e F23." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-serif mb-8 text-center">Tutorial e Guide</h1>
        
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
                  <a 
                    href={tutorial.isVideo && tutorial.videoUrl ? tutorial.videoUrl : `#tutorial-${tutorial.id}`}
                    className="text-black font-medium hover:underline flex items-center"
                    target={tutorial.isVideo && tutorial.videoUrl ? "_blank" : undefined}
                    rel={tutorial.isVideo && tutorial.videoUrl ? "noopener noreferrer" : undefined}
                  >
                    {tutorial.isVideo ? "Guarda il video" : "Leggi la guida"} 
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
