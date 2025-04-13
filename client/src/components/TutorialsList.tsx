import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tutorial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TutorialsListProps {
  limit?: number;
  showViewAllButton?: boolean;
}

export default function TutorialsList({ limit, showViewAllButton = true }: TutorialsListProps) {
  const { data: tutorials, isLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });
  
  // Filter and limit tutorials if needed
  const displayedTutorials = tutorials 
    ? (limit ? tutorials.slice(0, limit) : tutorials)
    : [];
  
  return (
    <section id="tutorial" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">Tutorial e Guide</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(limit || 3)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedTutorials.map((tutorial) => (
              <div key={tutorial.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <span className="material-icons text-5xl text-gray-400">
                    {tutorial.isVideo ? "play_circle" : "menu_book"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tutorial.content}</p>
                  <Link href={`/tutorial/${tutorial.id}`}>
                    <a className="text-black font-medium hover:underline flex items-center">
                      {tutorial.isVideo ? "Guarda il video" : "Leggi la guida"} 
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showViewAllButton && (
          <div className="text-center">
            <Link href="/tutorial">
              <a className="inline-flex items-center bg-white border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors">
                Vedi tutti i tutorial <span className="material-icons text-sm ml-1">arrow_forward</span>
              </a>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
