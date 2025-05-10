import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";

// Tipo per le categorie del forum
interface ForumCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  iconName?: string;
  order: number;
}

// Schema Zod per validare il form
const formSchema = z.object({
  title: z.string()
    .min(5, { message: "Il titolo deve contenere almeno 5 caratteri" })
    .max(100, { message: "Il titolo non può superare i 100 caratteri" }),
  content: z.string()
    .min(20, { message: "Il contenuto deve contenere almeno 20 caratteri" })
    .max(10000, { message: "Il contenuto non può superare i 10000 caratteri" }),
  categoryId: z.string()
    .min(1, { message: "Seleziona una categoria" })
    .transform(val => parseInt(val)),
});

// Tipo derivato dallo schema Zod, ma con override per categoryId
type FormData = Omit<z.infer<typeof formSchema>, 'categoryId'> & {
  categoryId: string;
};

export default function NewForumTopicPage() {
  const [, navigate] = useLocation();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { toast } = useToast();
  
  // Fetch delle categorie del forum
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["/api/forum/categories"],
    queryFn: async () => {
      const res = await fetch("/api/forum/categories");
      if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
      return res.json() as Promise<ForumCategory[]>;
    }
  });
  
  // Configurazione form react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });
  
  // Mutation per creare un nuovo topic
  const createTopicMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore nella creazione del topic");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Topic creato",
        description: "Il tuo topic è stato creato con successo",
      });
      
      // Invalida le query per aggiornare i dati
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/categories"] });
      
      // Reindirizza all'argomento appena creato
      navigate(`/forum/topic/${data.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormData) => {
    createTopicMutation.mutate(data);
  };
  
  // Se l'utente non è autenticato, mostriamo un messaggio e un link per accedere
  if (!isLoadingAuth && !user) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Accesso richiesto</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="mb-6">Devi essere registrato e aver effettuato l'accesso per creare un nuovo argomento.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link href="/auth">Accedi o registrati</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/forum">Torna al forum</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }
  
  return (
    <>
      <SEO
        title="Crea nuovo argomento | Forum F24Editabile"
        description="Crea un nuovo argomento di discussione nel forum di F24Editabile. Condividi le tue domande e opinioni su temi fiscali, tributari e finanziari."
        canonicalPath="/forum/nuovo-topic"
      />
      
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Navigazione */}
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
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Crea nuovo argomento</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAuth || isCategoriesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : categoriesError ? (
                <div className="p-6 text-center">
                  <p className="text-red-500 mb-4">Errore nel caricamento delle categorie</p>
                  <Button variant="outline" asChild>
                    <Link href="/forum">Torna al forum</Link>
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titolo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Inserisci il titolo del tuo argomento" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Un titolo chiaro e specifico aiuterà gli altri a capire di cosa parli.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona una categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Scegli la categoria più appropriata per il tuo argomento.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contenuto</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrivi in dettaglio il tuo argomento o la tua domanda" 
                              className="min-h-[200px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Fornisci più dettagli possibili per aiutare gli altri a comprendere meglio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit"
                        disabled={createTopicMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        {createTopicMutation.isPending && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Crea argomento
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}