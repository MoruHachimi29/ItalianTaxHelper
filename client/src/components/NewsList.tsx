import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { News } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EconomicNewsList from "./EconomicNewsList";

interface NewsListProps {
  limit?: number;
  showViewAllButton?: boolean;
  showRealTimeTab?: boolean;
}

export default function NewsList({ 
  limit = 3, 
  showViewAllButton = true,
  showRealTimeTab = true
}: NewsListProps) {
  const [activeTab, setActiveTab] = useState("editorial");
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: [`/api/news?limit=${limit}`],
  });
  
  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">Notizie Economiche</h2>
        
        {showRealTimeTab ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="editorial">Editoriali</TabsTrigger>
              <TabsTrigger value="realtime">Tempo Reale</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editorial">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[...Array(limit)].map((_, i) => (
                    <article key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                      <div className="p-4">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-6 w-1/3 mt-4" />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {news?.map((item) => (
                    <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                      <div className="p-4">
                        <div className="text-sm text-gray-500 mb-2">
                          {format(new Date(item.publishDate), "d MMMM yyyy", { locale: it })}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.content}</p>
                        <Link href={`/notizie/${item.id}`} className="text-black font-medium hover:underline flex items-center">
                          Leggi l'articolo <span className="material-icons text-sm ml-1">arrow_forward</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              
              {showViewAllButton && (
                <div className="text-center">
                  <Link href="/notizie" className="inline-flex items-center bg-white border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors">
                    Tutti gli editoriali <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="realtime">
              <div className="mb-8">
                <EconomicNewsList 
                  limit={limit} 
                  showPagination={false}
                  showCategories={false}
                  showSearch={false}
                />
                
                {showViewAllButton && (
                  <div className="text-center mt-8">
                    <Link href="/notizie" className="inline-flex items-center bg-white border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors">
                      Tutte le notizie in tempo reale <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(limit)].map((_, i) => (
                  <article key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="p-4">
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-6 w-1/3 mt-4" />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news?.map((item) => (
                  <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {format(new Date(item.publishDate), "d MMMM yyyy", { locale: it })}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{item.content}</p>
                      <Link href={`/notizie/${item.id}`} className="text-black font-medium hover:underline flex items-center">
                        Leggi l'articolo <span className="material-icons text-sm ml-1">arrow_forward</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {showViewAllButton && (
              <div className="text-center">
                <Link href="/notizie" className="inline-flex items-center bg-white border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors">
                  Tutte le notizie <span className="material-icons text-sm ml-1">arrow_forward</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
