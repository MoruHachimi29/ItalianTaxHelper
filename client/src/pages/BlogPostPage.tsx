import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogPostDetail from "@/components/BlogPostDetail";
import RelatedPosts from "@/components/RelatedPosts";

export default function BlogPostPage() {
  // Get slug from URL
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // Fetch blog post data for RelatedPosts component
  const { data: post } = useQuery<BlogPost>({
    queryKey: [`/api/blog/post/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="container mx-auto py-8">
      <BlogPostDetail slug={slug} />
      
      {post && (
        <div className="max-w-4xl mx-auto px-4">
          <RelatedPosts postId={post.id} limit={3} />
        </div>
      )}
    </div>
  );
}