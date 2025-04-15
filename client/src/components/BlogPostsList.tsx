import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { BlogPost } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlogPostsListProps {
  limit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
  categoryFilter?: string;
  showViewAllButton?: boolean;
}

export default function BlogPostsList({
  limit = 10,
  showPagination = true,
  showFilters = true,
  categoryFilter,
  showViewAllButton = false,
}: BlogPostsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "all");
  const isMobile = useIsMobile();

  // Query key based on active filters
  const getQueryKey = () => {
    if (searchQuery) {
      return ["/api/blog/search", { q: searchQuery, page: currentPage, limit }];
    }

    if (selectedCategory !== "all") {
      return [`/api/blog/category/${selectedCategory}`, { page: currentPage, limit }];
    }

    return ["/api/blog", { page: currentPage, limit }];
  };

  // Fetch blog posts
  const { data, isLoading, isError, error } = useQuery<{
    posts: BlogPost[],
    totalCount: number,
    currentPage: number,
    pageSize: number,
    totalPages: number,
    category?: string,
    searchQuery?: string
  }>({
    queryKey: getQueryKey(),
    staleTime: 60 * 1000, // 1 minute
  });

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery("");
    setSearchInput("");
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSelectedCategory("all");
    setCurrentPage(1);
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

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: it });
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'economia': 'Economia',
      'fisco': 'Fisco',
      'finanza': 'Finanza',
      'lavoro': 'Lavoro',
      'tecnologia': 'Tecnologia'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'economia': 'default',
      'fisco': 'secondary',
      'finanza': 'outline',
      'lavoro': 'default',
      'tecnologia': 'outline'
    };
    return colors[category] || 'default';
  };

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                type="text"
                placeholder="Cerca articoli..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Cerca</Button>
            </form>

            {/* Category filter */}
            <div className="w-full md:w-64">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtra per categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  <SelectItem value="economia">Economia</SelectItem>
                  <SelectItem value="fisco">Fisco</SelectItem>
                  <SelectItem value="finanza">Finanza</SelectItem>
                  <SelectItem value="lavoro">Lavoro</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results status */}
          {data && (
            <div>
              {searchQuery ? (
                <p className="text-sm text-gray-600">
                  Risultati per "{searchQuery}": {data.totalCount} articoli trovati
                </p>
              ) : selectedCategory !== "all" ? (
                <p className="text-sm text-gray-600">
                  Categoria: {getCategoryLabel(selectedCategory)} - {data.totalCount} articoli
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  {data.totalCount} articoli totali
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 bg-gray-200 animate-pulse" />
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
          <p>Si è verificato un errore nel caricamento degli articoli. Riprova più tardi.</p>
          <p className="text-sm mt-2">Dettagli: {error instanceof Error ? error.message : "Errore sconosciuto"}</p>
        </div>
      ) : (
        <>
          {data?.posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Nessun articolo trovato</h3>
              <p className="text-gray-500 mt-2">
                Prova a modificare i filtri di ricerca o a esplorare altre categorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={getCategoryColor(post.category)}>{getCategoryLabel(post.category)}</Badge>
                      <span className="text-xs text-gray-500">{formatDate(post.publishDate)}</span>
                    </div>
                    <CardTitle className="text-lg">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="hover:underline">{truncateText(post.title, 80)}</a>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 flex-grow">
                    <CardDescription className="text-gray-600">
                      {truncateText(post.summary, 120)}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-black hover:underline font-medium inline-flex items-center">
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
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </a>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {showPagination && data && data.totalPages > 1 && (
            <div className="mt-8 overflow-x-auto pb-2">
              <Pagination className="flex justify-center">
                <PaginationContent className="flex flex-nowrap">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} whitespace-nowrap`}
                    />
                  </PaginationItem>

                  <div className="hidden sm:flex">
                    {renderPaginationItems()}
                  </div>

                  <div className="flex sm:hidden items-center mx-2">
                    <span className="text-sm">
                      {currentPage} di {data.totalPages}
                    </span>
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(data.totalPages, currentPage + 1))}
                      className={`${currentPage === data.totalPages ? "pointer-events-none opacity-50" : ""} whitespace-nowrap`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {showViewAllButton && data && data.totalCount > limit && (
            <div className="mt-8 text-center">
              <Link href="/blog">
                <Button>Vedi tutti gli articoli</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}