import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogPostsList from "@/components/BlogPostsList";
import SEO from "@/components/SEO";

export default function BlogPage() {
  // Fetch latest posts for SEO data
  const { data: latestPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/latest", { limit: 10 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate SEO description from latest posts
  const generateSeoDescription = () => {
    if (!latestPosts || latestPosts.length === 0) {
      return "Leggi i nostri articoli su economia, finanza, fisco e molto altro. Blog aggiornato con notizie e approfondimenti sul mondo economico e finanziario.";
    }

    const categories = Array.from(new Set(latestPosts.map(post => post.category)));
    const categoryLabels = categories.map(cat => {
      const labels: Record<string, string> = {
        'economia': 'economia',
        'fisco': 'fisco',
        'finanza': 'finanza',
        'lavoro': 'lavoro',
        'tecnologia': 'tecnologia'
      };
      return labels[cat] || cat;
    });

    return `Leggi i nostri articoli e approfondimenti su ${categoryLabels.join(', ')} e molto altro. Blog aggiornato quotidianamente con analisi, guide e suggerimenti sul mondo economico e finanziario italiano.`;
  };

  return (
    <>
      <SEO
        title="Blog Economico | Notizie, Guide e Approfondimenti | F24Editabile"
        description={generateSeoDescription()}
        keywords="blog economico, approfondimenti economia, novità fiscali, guida finanziaria, tasse italia, irpef, articoli economia, fisco"
        ogType="website"
        schemaType="WebPage"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Blog Economico</h1>
          <p className="text-gray-600 mb-8">
            Notizie, guide e approfondimenti sul mondo economico e fiscale italiano
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <BlogPostsList 
            limit={12} 
            showPagination={true} 
            showFilters={true}
          />
        </div>
      </div>
    </>
  );
}