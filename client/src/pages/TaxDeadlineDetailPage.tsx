import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  AlertTriangle,
  User,
  DollarSign,
  CreditCard,
  BookOpen,
  AlertCircle,
  Pencil
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Interfaccia per i dati della scadenza fiscale
interface TaxDeadline {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  type: "individuals" | "companies";
  isImportant: boolean;
  isRecurring: boolean;
  recurringInfo?: string;
  link: string;
  updatedAt: string;
  // Informazioni aggiuntive
  targetAudience?: string;
  amount?: string;
  paymentMethods?: string[];
  regulations?: string;
  consequences?: string;
  notes?: string;
}

interface DeadlineCategory {
  id: string;
  name: string;
  icon: string;
}

export default function TaxDeadlineDetailPage() {
  // Ottieni l'ID dalla URL
  const { id } = useParams<{ id: string }>();

  // Query per i dettagli della scadenza
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["tax-deadline", id],
    queryFn: async () => {
      const response = await fetch(`/api/tax-deadlines/${id}`);
      if (!response.ok) {
        throw new Error("Errore nel caricamento dei dettagli della scadenza");
      }
      return response.json();
    },
  });

  // Query per le categorie (per mostrare il nome della categoria)
  const { data: categoriesData } = useQuery({
    queryKey: ["tax-deadline-categories"],
    queryFn: async () => {
      const response = await fetch("/api/tax-deadlines/categories");
      if (!response.ok) {
        throw new Error("Errore nel caricamento delle categorie");
      }
      return response.json();
    },
  });

  // Funzione per formattare le date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "Data non specificata";
    
    try {
      const date = parseISO(dateStr);
      return format(date, "d MMMM yyyy", { locale: it });
    } catch (error) {
      console.error("Errore nella formattazione della data:", error);
      return dateStr;
    }
  };

  // Funzione per verificare se una scadenza è scaduta
  const isDeadlineExpired = (deadline: TaxDeadline): boolean => {
    try {
      const today = new Date();
      const deadlineDate = parseISO(deadline.date);
      
      // Considera scadute le date passate rispetto a oggi
      return deadlineDate < today;
    } catch (error) {
      console.error("Errore nel controllo se la scadenza è scaduta:", error);
      return false;
    }
  };
  
  // Funzione per verificare se una scadenza è imminente (entro 30 giorni)
  const isDeadlineImminent = (deadline: TaxDeadline): boolean => {
    try {
      // Verifica prima che non sia scaduta, in tal caso non può essere imminente
      if (isDeadlineExpired(deadline)) {
        return false;
      }
      
      const today = new Date();
      const deadlineDate = parseISO(deadline.date);
      
      // Calcola la differenza in millisecondi
      const diffTime = deadlineDate.getTime() - today.getTime();
      // Converti millisecondi in giorni
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Considera imminenti le scadenze entro i prossimi 30 giorni
      return diffDays >= 0 && diffDays <= 30;
    } catch (error) {
      console.error("Errore nel controllo se la scadenza è imminente:", error);
      return false;
    }
  };

  // Funzione per ottenere il nome della categoria
  const getCategoryName = (categoryId: string): string => {
    if (!categoriesData) return "";
    const category = categoriesData.categories.find((cat: DeadlineCategory) => cat.id === categoryId);
    return category ? category.name : "";
  };

  // Elementi da renderizzare in base allo stato della query
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tax-deadlines">Scadenze Fiscali</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Dettaglio Scadenza</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data || !data.deadline) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/strumenti/scadenze-fiscali">Scadenze Fiscali</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Errore</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>
            Non è stato possibile caricare i dettagli della scadenza richiesta.
            La scadenza potrebbe non esistere o si è verificato un errore durante il caricamento.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center mt-6">
          <Link href="/strumenti/scadenze-fiscali">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna all'elenco delle scadenze
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const deadline = data.deadline;
  const isExpired = isDeadlineExpired(deadline);
  const isImminent = isDeadlineImminent(deadline);
  const statusVariant = isExpired ? "destructive" : isImminent ? "outline" : "default";
  const statusText = isExpired ? "Scaduta" : isImminent ? "Imminente" : "Futura";
  const statusClass = isExpired ? "bg-red-50" : isImminent ? "bg-orange-50" : "";

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/strumenti/scadenze-fiscali">Scadenze Fiscali</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Dettaglio Scadenza</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className={`w-full max-w-4xl mx-auto ${statusClass}`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-2xl">{deadline.title}</CardTitle>
              <CardDescription className="mt-2">
                {deadline.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className={`text-lg font-medium ${
                  isExpired 
                    ? 'text-red-500' 
                    : isImminent 
                      ? 'text-orange-500' 
                      : ''
                }`}>
                  {formatDate(deadline.date)}
                </span>
              </div>
              <Badge variant={statusVariant} className={`${isImminent && !isExpired ? 'bg-orange-500 text-white' : ''}`}>
                {statusText}
              </Badge>
              {deadline.isRecurring && (
                <Badge variant="outline" className="mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {deadline.recurringInfo || "Ricorrente"}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant={deadline.isImportant ? "destructive" : "outline"} className="text-sm">
              <div className="flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1" />
                <span>{getCategoryName(deadline.category)}</span>
              </div>
            </Badge>
            <Badge variant="outline" className="text-sm">
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                <span>{deadline.type === "individuals" ? "Persone Fisiche" : "Persone Giuridiche"}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informazioni Dettagliate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {deadline.targetAudience && (
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">A chi è rivolta</h3>
                    <p className="text-sm">{deadline.targetAudience}</p>
                  </div>
                </div>
              </div>
            )}
            
            {deadline.amount && (
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Importo</h3>
                    <p className="text-sm">{deadline.amount}</p>
                  </div>
                </div>
              </div>
            )}
            
            {deadline.paymentMethods && deadline.paymentMethods.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Metodi di pagamento</h3>
                    <ul className="list-disc list-inside text-sm">
                      {deadline.paymentMethods.map((method: string, index: number) => (
                        <li key={index}>{method}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {deadline.regulations && (
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Normativa di riferimento</h3>
                    <p className="text-sm">{deadline.regulations}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {deadline.consequences && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Conseguenze per mancato adempimento</AlertTitle>
              <AlertDescription className="mt-1">
                {deadline.consequences}
              </AlertDescription>
            </Alert>
          )}
          
          {deadline.notes && (
            <div className="bg-slate-50 p-4 rounded-lg border mt-6">
              <div className="flex items-start">
                <Pencil className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm mb-1">Note aggiuntive</h3>
                  <p className="text-sm">{deadline.notes}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-6">
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1 inline-block" />
            Aggiornato il {formatDate(deadline.updatedAt)}
          </div>
          
          <div className="flex gap-2">
            <Link href="/strumenti/scadenze-fiscali">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna all'elenco
              </Button>
            </Link>
            
            <a href={deadline.link} target="_blank" rel="noopener noreferrer">
              <Button variant="default" className="flex items-center">
                Vai al sito ufficiale
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}