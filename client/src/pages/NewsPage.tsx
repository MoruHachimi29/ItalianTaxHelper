import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EconomicNewsList from "@/components/EconomicNewsList";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("live");
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news/all"],
  });
  
  return (
    <>
      <Helmet>
        <title>Notizie Economiche e Fiscali | ModuliTax</title>
        <meta name="description" content="Ultime notizie su economia, fisco e normative fiscali italiane. Aggiornamenti in tempo reale su economia, finanza, tasse e fiscalità." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-serif mb-8 text-center">Notizie Economiche e Fiscali</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="live">Notizie in Tempo Reale</TabsTrigger>
            <TabsTrigger value="editorial">Editoriali</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Notizie Economiche in Tempo Reale</h2>
              <p className="text-gray-600 mb-6">
                Le ultime notizie su economia, finanza, fisco e lavoro da fonti italiane e internazionali, aggiornate in tempo reale.
              </p>
              
              <EconomicNewsList 
                limit={6} 
                showPagination={true}
                showCategories={true}
                showSearch={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="editorial">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Editoriali e Approfondimenti</h2>
              <p className="text-gray-600 mb-6">
                I nostri articoli, analisi e commenti sui temi più importanti dell'economia e della fiscalità italiana.
              </p>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <article key={i} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news?.map((item) => (
                    <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                      <div className="p-4">
                        <div className="text-sm text-gray-500 mb-2">
                          {format(new Date(item.publishDate), "d MMMM yyyy", { locale: it })}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.content}</p>
                        <a 
                          href={`#news-${item.id}`}
                          className="text-black font-medium hover:underline flex items-center"
                        >
                          Leggi l'articolo <span className="material-icons text-sm ml-1">arrow_forward</span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
