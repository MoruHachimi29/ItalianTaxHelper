import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Loader2, 
  ArrowLeft, 
  MessageSquare, 
  ThumbsUp, 
  Star, 
  Flag, 
  Share, 
  Lock, 
  CheckCircle2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Tipi per il topic e i post
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
  // Props aggiuntive che verranno popolate dal server
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    username: string;
  };
}

interface ForumPost {
  id: number;
  content: string;
  topicId: number;
  userId: number;
  isAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  // Props aggiuntive che verranno popolate dal server
  author?: {
    id: number;
    username: string;
  };
  reactions?: {
    like: number;
    helpful: number;
  };
}

export default function ForumTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  
  // Fetch del topic
  const { 
    data: topic, 
    isLoading: isLoadingTopic, 
    error: topicError 
  } = useQuery({
    queryKey: ["/api/forum/topics", slug],
    queryFn: async () => {
      const res = await fetch(`/api/forum/topics/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          navigate("/forum");
          throw new Error("Topic non trovato");
        }
        throw new Error("Errore nel caricamento del topic");
      }
      return res.json() as Promise<ForumTopic>;
    }
  });
  
  // Fetch dei post relativi al topic
  const { 
    data: postsData, 
    isLoading: isLoadingPosts, 
    error: postsError 
  } = useQuery({
    queryKey: ["/api/forum/topics", topic?.id, "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/forum/topics/${topic?.id}/posts`);
      if (!res.ok) throw new Error("Errore nel caricamento delle risposte");
      return res.json() as Promise<{ posts: ForumPost[], pagination: any }>;
    },
    enabled: !!topic?.id
  });
  
  // Mutation per aggiungere una risposta
  const addReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          topicId: topic?.id
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore nell'invio della risposta");
      }
      
      return res.json() as Promise<ForumPost>;
    },
    onSuccess: () => {
      // Reset del form e aggiornamento dei post
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics", topic?.id, "posts"] });
      toast({
        title: "Risposta pubblicata",
        description: "La tua risposta è stata pubblicata con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation per segnare un post come risposta
  const markAsAnswerMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/forum/posts/${postId}/mark-as-answer`, {
        method: "POST",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore nel marcare come risposta");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics", topic?.id, "posts"] });
      toast({
        title: "Risposta accettata",
        description: "La risposta è stata marcata come soluzione",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Funzione per inviare una risposta
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Il contenuto della risposta non può essere vuoto",
        variant: "destructive",
      });
      return;
    }
    
    addReplyMutation.mutate(replyContent);
  };
  
  // Funzione per marcare un post come risposta
  const handleMarkAsAnswer = (postId: number) => {
    markAsAnswerMutation.mutate(postId);
  };
  
  // Preparazione dei dati per schema.org
  const topicSchemaData = topic ? {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": topic.title,
    "datePublished": topic.createdAt,
    "dateModified": topic.updatedAt,
    "author": {
      "@type": "Person",
      "name": topic.author?.username || "Utente F24Editabile"
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ViewAction",
      "userInteractionCount": topic.viewCount
    }
  } : undefined;
  
  // Se siamo in caricamento, mostriamo uno spinner
  if (isLoadingTopic) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }
  
  // Se c'è un errore, mostriamo un messaggio
  if (topicError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Errore</h1>
        <p className="text-gray-600 mb-6">Si è verificato un errore durante il caricamento del topic.</p>
        <Button asChild>
          <Link href="/forum">Torna al forum</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <SEO
        title={topic ? `${topic.title} | Forum F24Editabile` : "Discussione | Forum F24Editabile"}
        description={topic ? `${topic.content.substring(0, 160)}...` : "Discussione nel forum di F24Editabile"}
        canonicalPath={`/forum/topic/${slug}`}
        schemaData={topicSchemaData}
      />
      
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb e navigazione */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              asChild
            >
              <Link href="/forum">
                <ArrowLeft size={16} />
                Torna al forum
              </Link>
            </Button>
          </div>
          
          {topic && (
            <>
              {/* Header del topic */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold">{topic.title}</h1>
                  <div className="flex gap-2">
                    {topic.isPinned && (
                      <Badge variant="secondary">In evidenza</Badge>
                    )}
                    {topic.isLocked && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock size={14} />
                        Chiuso
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="prose max-w-none mb-6">
                  <p>{topic.content}</p>
                </div>
                
                <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{topic.author?.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{topic.author?.username || "Utente F24Editabile"}</span>
                      <span className="mx-2">•</span>
                      <time dateTime={topic.createdAt}>
                        {format(new Date(topic.createdAt), "d MMMM yyyy, HH:mm", { locale: it })}
                      </time>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      {postsData?.posts.length || 0} risposte
                    </span>
                    <span>
                      Visto: {topic.viewCount}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Sezione risposte */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Risposte</h2>
                
                {isLoadingPosts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                  </div>
                ) : postsError ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500">Errore nel caricamento delle risposte</p>
                  </div>
                ) : postsData?.posts && postsData.posts.length > 0 ? (
                  <div className="space-y-6">
                    {postsData.posts.map((post) => (
                      <Card key={post.id} className={post.isAnswer ? "border-green-500" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{post.author?.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{post.author?.username || "Utente F24Editabile"}</span>
                              <span className="mx-2">•</span>
                              <time dateTime={post.createdAt} className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: it })}
                              </time>
                            </div>
                            {post.isAnswer && (
                              <Badge className="ml-auto bg-green-500">
                                <CheckCircle2 size={14} className="mr-1" />
                                Soluzione
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose max-w-none">
                            <p>{post.content}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <ThumbsUp size={14} />
                              {post.reactions?.like || 0}
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Star size={14} />
                              {post.reactions?.helpful || 0}
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Mostra il pulsante "Segna come soluzione" solo all'autore del topic e solo se il topic non è bloccato */}
                            {user && 
                             topic.userId === user.id && 
                             !topic.isLocked && 
                             !post.isAnswer && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleMarkAsAnswer(post.id)}
                              >
                                <CheckCircle2 size={14} />
                                Segna come soluzione
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Flag size={14} />
                              Segnala
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-lg">
                    <p>Nessuna risposta ancora. Sii il primo a rispondere!</p>
                  </div>
                )}
              </div>
              
              {/* Form per rispondere */}
              {!topic.isLocked ? (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Aggiungi una risposta</h2>
                  
                  {isLoadingAuth ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-black" />
                    </div>
                  ) : user ? (
                    <form onSubmit={handleSubmitReply}>
                      <Textarea
                        placeholder="Scrivi la tua risposta qui..."
                        className="mb-4 min-h-[150px]"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={addReplyMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          {addReplyMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          Pubblica risposta
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4">Devi essere registrato per rispondere</p>
                      <Button asChild>
                        <Link href="/auth">Accedi o registrati</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <h2 className="text-xl font-semibold mb-2">Discussione chiusa</h2>
                  <p className="text-gray-600">Questa discussione è stata chiusa e non accetta nuove risposte.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}