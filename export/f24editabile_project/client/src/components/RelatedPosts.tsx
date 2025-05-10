import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { BlogPost } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface RelatedPostsProps {
  postId: number;
  limit?: number;
}

export default function RelatedPosts({ postId, limit = 3 }: RelatedPostsProps) {
  // Fetch related posts
  const { data: relatedPosts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog/related/${postId}`, { limit }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format date
  const formatDate = (dateString: Date | string) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
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

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Articoli correlati</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error or no related posts
  if (isError || !relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Articoli correlati</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant={getCategoryColor(post.category)}>{getCategoryLabel(post.category)}</Badge>
                <span className="text-xs text-gray-500">{formatDate(post.publishDate.toString())}</span>
              </div>
              <CardTitle className="text-base">
                <Link href={`/blog/${post.slug}`}>
                  <a className="hover:underline">{truncateText(post.title, 60)}</a>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 flex-grow">
              <CardDescription className="text-gray-600 text-sm">
                {truncateText(post.summary, 100)}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}