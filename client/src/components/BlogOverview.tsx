import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { BlogPost } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function BlogOverview() {
  // Fetch latest blog posts
  const { data: latestPosts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/latest", { limit: 3 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: it });
  };

  // Get category label
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

  // Get category color
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

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Approfondimenti e Articoli</h2>
          <Link href="/blog">
            <Button variant="outline">Tutti gli articoli</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        ) : isError || !latestPosts || latestPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Nessun articolo disponibile</h3>
            <p className="text-gray-500 mt-2">Gli articoli verranno pubblicati presto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
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
                  <p className="text-gray-600 text-sm">
                    {truncateText(post.summary, 120)}
                  </p>
                  <div className="mt-4">
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-black hover:underline font-medium inline-flex items-center text-sm">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}