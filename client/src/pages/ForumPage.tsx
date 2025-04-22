import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, MessageSquarePlus, Bookmark, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

// Definiamo i tipi per le categorie e i topic del forum
interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  iconName?: string;
  order: number;
}

interface ForumTopic {
  id: number;
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  userId: number;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch delle categorie del forum
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["/api/forum/categories"],
    queryFn: async () => {
      const res = await fetch("/api/forum/categories");
      if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
      return res.json() as Promise<ForumCategory[]>;
    }
  });
  
  // Fetch dei topic più recenti
  const { data: latestTopics, isLoading: isTopicsLoading, error: topicsError } = useQuery({
    queryKey: ["/api/forum/topics", "latest"],
    queryFn: async () => {
      // In una implementazione reale, avremo un endpoint per i topic più recenti
      // Per ora assumiamo che usiamo la ricerca senza query per ottenere gli ultimi topic
      const res = await fetch("/api/forum/topics/search?limit=10");
      if (!res.ok) throw new Error("Errore nel caricamento dei topic recenti");
      const data = await res.json();
      return data.topics as ForumTopic[];
    },
    enabled: !selectedCategory // Carica solo se nessuna categoria è selezionata
  });
  
  // Fetch dei topic per categoria selezionata
  const { data: categoryTopics, isLoading: isCategoryTopicsLoading, error: categoryTopicsError } = useQuery({
    queryKey: ["/api/forum/categories", selectedCategory, "topics"],
    queryFn: async () => {
      const res = await fetch(`/api/forum/categories/${selectedCategory}/topics?limit=20`);
      if (!res.ok) throw new Error(`Errore nel caricamento dei topic della categoria ${selectedCategory}`);
      const data = await res.json();
      return data.topics as ForumTopic[];
    },
    enabled: !!selectedCategory
  });
  
  // Ottieni i topic da visualizzare in base alla categoria selezionata
  const displayedTopics = selectedCategory ? categoryTopics : latestTopics;
  const isLoadingTopics = selectedCategory ? isCategoryTopicsLoading : isTopicsLoading;
  const topicsLoadError = selectedCategory ? categoryTopicsError : topicsError;
  
  // Logica per selezionare una categoria
  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? null : categorySlug);
  };
  
  // Schema.org data per SEO
  const forumSchemaData = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": "Forum di discussione F24Editabile",
    "description": "Forum di discussione su temi fiscali, tributari e finanziari.",
    "publisher": {
      "@type": "Organization",
      "name": "F24Editabile"
    }
  };
  
  return (
    <>
      <SEO
        title="Forum F24Editabile | Discussioni su temi fiscali"
        description="Partecipa alle discussioni nel forum di F24Editabile. Condividi le tue esperienze e ricevi supporto dalla community su temi fiscali, tributari e finanziari."
        canonicalPath="/forum"
        schemaData={forumSchemaData}
      />
      
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Intestazione e bottone nuovo topic */}
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Forum di discussione</h1>
              <p className="text-gray-600 mb-4">
                Discuti di temi fiscali, tributari e finanziari con altri utenti
              </p>
            </div>
            
            <Link href="/forum/nuovo-topic">
              <Button className="flex items-center gap-2">
                <MessageSquarePlus size={18} />
                Nuovo argomento
              </Button>
            </Link>
          </div>
          
          {/* Tabs per le diverse viste */}
          <Tabs defaultValue="categorie" className="mt-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="categorie">Categorie</TabsTrigger>
              <TabsTrigger value="recenti">Topic recenti</TabsTrigger>
              <TabsTrigger value="popolari">Più visti</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categorie" className="mt-6">
              {/* Categorie Forum */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isCategoriesLoading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                  </div>
                ) : categoriesError ? (
                  <div className="col-span-full p-6 text-center">
                    <p className="text-red-500">Errore nel caricamento delle categorie</p>
                  </div>
                ) : categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <Card key={category.id} className={`overflow-hidden ${selectedCategory === category.slug ? 'ring-2 ring-black' : ''}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {/* Icona della categoria, se presente */}
                          {category.iconName && (
                            <span className="material-icons text-gray-700">{category.iconName}</span>
                          )}
                          {category.name}
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button 
                          variant={selectedCategory === category.slug ? "default" : "outline"} 
                          onClick={() => handleCategorySelect(category.slug)}
                          className="w-full"
                        >
                          {selectedCategory === category.slug ? "Chiudi lista" : "Visualizza discussioni"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full p-6 text-center">
                    <p>Nessuna categoria disponibile</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recenti" className="mt-6">
              {/* Topic recenti */}
              <div className="bg-gray-50 p-4 mb-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Topic più recenti</h2>
                <p className="text-gray-600">
                  Le discussioni più recenti aperte su F24Editabile
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="popolari" className="mt-6">
              {/* Topic popolari */}
              <div className="bg-gray-50 p-4 mb-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Topic più popolari</h2>
                <p className="text-gray-600">
                  Le discussioni più viste e commentate
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Lista dei topic per la categoria selezionata */}
          {selectedCategory && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {categories?.find(c => c.slug === selectedCategory)?.name || "Discussioni"}
                </h2>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Torna alle categorie
                </Button>
              </div>
              
              {isLoadingTopics ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : topicsLoadError ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">Errore nel caricamento dei topic</p>
                </div>
              ) : displayedTopics && displayedTopics.length > 0 ? (
                <div className="space-y-4">
                  {displayedTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50 rounded-lg">
                  <p>Nessuna discussione in questa categoria</p>
                  <Link href="/forum/nuovo-topic">
                    <Button className="mt-4">Crea il primo topic</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Componente per la card di un topic
function TopicCard({ topic }: { topic: ForumTopic }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              {topic.isPinned && (
                <Badge variant="secondary">In evidenza</Badge>
              )}
              {topic.isLocked && (
                <Badge variant="outline">Chiuso</Badge>
              )}
            </div>
            <CardTitle className="text-lg mt-1">
              <Link href={`/forum/topic/${topic.slug}`} className="hover:underline">
                {topic.title}
              </Link>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{topic.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {topic.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={16} />
            {/* Implementazione reale userebbe il numero di post per questo topic */}
            0
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock size={16} />
          {formatDistanceToNow(new Date(topic.lastActivityAt), { addSuffix: true, locale: it })}
        </span>
      </CardFooter>
    </Card>
  );
}