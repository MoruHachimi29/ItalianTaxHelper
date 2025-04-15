import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface NewsArticle {
  title: string;
  content: string;
  source: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  author: string | null;
}

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  category?: string;
  searchQuery?: string;
}

interface EconomicNewsListProps {
  limit?: number;
  showPagination?: boolean;
  showCategories?: boolean;
  showSearch?: boolean;
}

export default function EconomicNewsList({ 
  limit = 10, 
  showPagination = true,
  showCategories = true,
  showSearch = true
}: EconomicNewsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Define query key based on active filters
  const getQueryKey = () => {
    if (searchQuery) {
      return ["/api/economic-news/search", { q: searchQuery, page: currentPage, pageSize: limit }];
    }
    
    if (activeCategory !== "all") {
      return [`/api/economic-news/category/${activeCategory}`, { page: currentPage, pageSize: limit }];
    }
    
    return ["/api/economic-news", { page: currentPage, pageSize: limit }];
  };
  
  // Fetch news based on active filters
  const { data, isLoading, isError, error } = useQuery<NewsResponse>({
    queryKey: getQueryKey(),
    staleTime: 60 * 1000 // 1 minute
  });
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setSearchQuery("");
    setSearchInput("");
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setActiveCategory("all");
    setCurrentPage(1);
  };
  
  // Format date to Italian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    if (!data) return null;
    
    const { totalPages } = data;
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div className="space-y-6">
      {showCategories && (
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="all">Tutte</TabsTrigger>
            <TabsTrigger value="economia">Economia</TabsTrigger>
            <TabsTrigger value="fisco">Fisco</TabsTrigger>
            <TabsTrigger value="finanza">Finanza</TabsTrigger>
            <TabsTrigger value="lavoro">Lavoro</TabsTrigger>
            <TabsTrigger value="tecnologia">Tecnologia</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {showSearch && (
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Cerca notizie..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Cerca</Button>
          </form>
        </div>
      )}
      
      {/* Results status */}
      {searchQuery && data && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Risultati per "{searchQuery}": {data.totalResults} articoli trovati
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mt-4" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p>Si è verificato un errore nel caricamento delle notizie. Riprova più tardi.</p>
          <p className="text-sm mt-2">Dettagli: {error instanceof Error ? error.message : "Errore sconosciuto"}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.articles.map((article, index) => (
              <Card key={index} className="overflow-hidden flex flex-col h-full">
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{article.source}</Badge>
                    <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-gray-600">
                    {article.content || "Leggi l'articolo completo per maggiori informazioni."}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black hover:underline font-medium flex items-center"
                  >
                    Leggi articolo completo
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="ml-1"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {showPagination && data && data.totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(data.totalPages, currentPage + 1))}
                    className={currentPage === data.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}