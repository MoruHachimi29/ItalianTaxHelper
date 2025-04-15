import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { BlogPost } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import SEO from "./SEO";

interface BlogPostDetailProps {
  slug: string;
}

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const [shareUrl, setShareUrl] = useState<string>("");

  // Fetch blog post by slug
  const { data: post, isLoading, isError, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/post/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set share URL on mount
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || "Articolo del blog",
          text: post?.summary || "",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copiato negli appunti!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: it });
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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        
        <Skeleton className="h-96 w-full mt-8" />
        
        <div className="mt-8">
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-red-700">
          <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
          <p>Si è verificato un errore nel caricamento dell'articolo richiesto.</p>
          <p className="text-sm mt-2">Dettagli: {error instanceof Error ? error.message : "Errore sconosciuto"}</p>
          <div className="mt-6">
            <Link href="/blog">
              <a className="inline-flex items-center text-black hover:underline">
                <ArrowLeft size={18} className="mr-2" />
                Torna alla lista degli articoli
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No post found
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
          <p className="mb-6">L'articolo che stai cercando non esiste o è stato rimosso.</p>
          <Link href="/blog">
            <a className="inline-flex items-center text-black hover:underline">
              <ArrowLeft size={18} className="mr-2" />
              Torna alla lista degli articoli
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO */}
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.summary}
        keywords={post.metaKeywords || undefined}
        ogType="article"
        ogImage={post.imageUrl || undefined}
        schemaType="Article"
        schemaData={{
          headline: post.title,
          image: post.imageUrl,
          datePublished: post.publishDate,
          author: {
            "@type": "Person",
            name: post.author
          }
        }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back to blog */}
        <div className="mb-6">
          <Link href="/blog">
            <a className="inline-flex items-center text-black hover:underline mb-6">
              <ArrowLeft size={18} className="mr-2" />
              Torna al blog
            </a>
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <Badge variant={getCategoryColor(post.category)}>
              {getCategoryLabel(post.category)}
            </Badge>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={14} className="mr-1" />
              {formatDate(post.publishDate)}
            </div>
            <button
              onClick={handleShare}
              className="ml-auto text-gray-600 hover:text-black flex items-center text-sm"
              aria-label="Condividi articolo"
            >
              <Share2 size={14} className="mr-1" />
              Condividi
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{post.summary}</p>

          <div className="flex items-center">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="text-sm font-medium">{post.author}</div>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {post.imageUrl && (
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-lg object-cover h-auto max-h-[500px]"
              loading="lazy"
            />
          </div>
        )}

        {/* Article content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-black prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link key={index} href={`/blog/tag/${tag}`}>
                  <Badge variant="outline" className="cursor-pointer">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="text-sm text-gray-600">Autore</div>
              <div className="font-medium">{post.author}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
          <Link href="/blog">
            <a className="inline-flex items-center text-black hover:underline">
              <ArrowLeft size={18} className="mr-2" />
              Torna al blog
            </a>
          </Link>
        </div>
      </article>
    </>
  );
}