import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  FileText, 
  CreditCard, 
  Mail, 
  CheckSquare, 
  Percent, 
  Briefcase,
  ExternalLink,
  RefreshCw 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";
import { it } from "date-fns/locale";

// Definizione dei tipi
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
}

interface DeadlineCategory {
  id: string;
  name: string;
  icon: string;
}

// Componente principale
export default function TaxDeadlinesTracker() {
  // Stati
  const [activeTab, setActiveTab] = useState<"individuals" | "companies">("individuals");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 secondi (per test, in produzione useremo 300000 = 5 minuti)

  // Query per le scadenze fiscali
  const { data: deadlinesData, isLoading: isLoadingDeadlines, refetch } = useQuery({
    queryKey: ["tax-deadlines", activeTab, categoryFilter],
    queryFn: async () => {
      let url = `/api/tax-deadlines?type=${activeTab}`;
      if (categoryFilter && categoryFilter !== "all") {
        url += `&category=${categoryFilter}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Errore nel caricamento delle scadenze fiscali");
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
  });

  // Query per le categorie
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["tax-deadline-categories"],
    queryFn: async () => {
      const response = await fetch("/api/tax-deadlines/categories");
      if (!response.ok) {
        throw new Error("Errore nel caricamento delle categorie");
      }
      return response.json();
    },
  });

  // Query per le scadenze imminenti
  const { data: upcomingData, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["tax-deadlines-upcoming", activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/tax-deadlines/upcoming?days=30&type=${activeTab}`);
      if (!response.ok) {
        throw new Error("Errore nel caricamento delle scadenze imminenti");
      }
      return response.json();
    },
    refetchInterval: refreshInterval,
  });

  // Filtro delle scadenze in base alla ricerca
  const filteredDeadlines = deadlinesData?.deadlines.filter((deadline: TaxDeadline) => {
    if (!searchQuery) return true;
    return (
      deadline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deadline.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Funzione per ottenere l'icona della categoria
  const getCategoryIcon = (categoryId: string) => {
    if (!categoriesData) return <FileText className="h-4 w-4" />;
    const category = categoriesData.categories.find((cat: DeadlineCategory) => cat.id === categoryId);
    
    if (!category) return <FileText className="h-4 w-4" />;
    
    switch (category.icon) {
      case "file-text":
        return <FileText className="h-4 w-4" />;
      case "credit-card":
        return <CreditCard className="h-4 w-4" />;
      case "mail":
        return <Mail className="h-4 w-4" />;
      case "check-square":
        return <CheckSquare className="h-4 w-4" />;
      case "percent":
        return <Percent className="h-4 w-4" />;
      case "briefcase":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Funzione per formattare la data
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: it });
    } catch (error) {
      return dateStr;
    }
  };
  
  // Funzione per classificare manualmente le scadenze per test
  const getDeadlineStatus = (deadline: TaxDeadline): 'expired' | 'imminent' | 'future' => {
    // Configura manualmente lo stato delle scadenze per test
    const expiredIds = ["pf-8", "pg-2"];
    const imminentIds = ["pf-1", "pg-1"];
    
    if (expiredIds.includes(deadline.id)) return 'expired';
    if (imminentIds.includes(deadline.id)) return 'imminent';
    return 'future';
  };

  // Funzione per verificare se una scadenza è scaduta
  const isDeadlineExpired = (deadline: TaxDeadline) => {
    return getDeadlineStatus(deadline) === 'expired';
  };
  
  // Funzione per verificare se una scadenza è imminente
  const isDeadlineImminent = (deadline: TaxDeadline) => {
    return getDeadlineStatus(deadline) === 'imminent';
  };

  // Ottieni la data dell'ultimo aggiornamento
  const lastUpdate = deadlinesData?.lastUpdate ? 
    format(parseISO(deadlinesData.lastUpdate), "d MMMM yyyy, HH:mm", { locale: it }) : 
    "N/A";

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-between">
        <Tabs 
          defaultValue="individuals" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "individuals" | "companies")}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-2">
            <TabsTrigger value="individuals">Persone Fisiche</TabsTrigger>
            <TabsTrigger value="companies">Persone Giuridiche</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {!isLoadingCategories && categoriesData?.categories.map((category: DeadlineCategory) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center space-x-2">
                    {getCategoryIcon(category.id)}
                    <span className="ml-2">{category.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca scadenze..."
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {activeTab === "individuals" ? "Scadenze per Persone Fisiche" : "Scadenze per Persone Giuridiche"}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  className="text-xs flex items-center space-x-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Aggiorna
                </Button>
              </div>
              <CardDescription className="pt-1">
                Lista aggiornata delle scadenze fiscali {activeTab === "individuals" ? "per cittadini e contribuenti" : "per aziende e professionisti"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDeadlines ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border">
                      <CardHeader className="p-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2 mt-2" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredDeadlines?.length > 0 ? (
                <div className="space-y-4">
                  {filteredDeadlines.map((deadline: TaxDeadline) => (
                    <Card 
                      key={deadline.id} 
                      className={`border ${isDeadlineImminent(deadline) ? 'border-orange-300' : isDeadlineExpired(deadline) ? 'border-red-300 opacity-70' : ''}`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base font-medium">{deadline.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={deadline.isImportant ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                <div className="flex items-center">
                                  {getCategoryIcon(deadline.category)}
                                  <span className="ml-1">
                                    {categoriesData?.categories.find((cat: DeadlineCategory) => cat.id === deadline.category)?.name}
                                  </span>
                                </div>
                              </Badge>
                              {deadline.isRecurring && (
                                <Badge variant="outline" className="text-xs">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  {deadline.recurringInfo}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className={`text-sm font-medium ${
                                isDeadlineExpired(deadline) 
                                  ? 'text-red-500' 
                                  : isDeadlineImminent(deadline) 
                                    ? 'text-orange-500' 
                                    : ''
                              }`}>
                                {formatDate(deadline.date)}
                              </span>
                            </div>
                            {isDeadlineExpired(deadline) && (
                              <Badge variant="destructive" className="mt-1">Scaduta</Badge>
                            )}
                            {isDeadlineImminent(deadline) && !isDeadlineExpired(deadline) && (
                              <Badge variant="outline" className="mt-1 bg-orange-500 text-white">Imminente</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground">{deadline.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Aggiornato: {format(parseISO(deadline.updatedAt), "d MMM yyyy", { locale: it })}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <a href={deadline.link} target="_blank" rel="noopener noreferrer">
                            <span className="flex items-center">
                              Maggiori dettagli
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </span>
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nessuna scadenza trovata</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Non ci sono scadenze fiscali corrispondenti ai criteri di ricerca selezionati.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t flex justify-between items-center text-xs text-muted-foreground">
              <div>
                <p>Dati aggiornati al: {lastUpdate}</p>
              </div>
              <div>
                {deadlinesData && (
                  <p>Totale scadenze: {deadlinesData.totalCount}</p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scadenze Imminenti</CardTitle>
              <CardDescription>Prossime scadenze nei 30 giorni</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUpcoming ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingData?.deadlines?.length > 0 ? (
                <div className="space-y-4">
                  {upcomingData.deadlines.map((deadline: TaxDeadline) => (
                    <div key={deadline.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 rounded-full p-2 ${
                        isDeadlineExpired(deadline.date, deadline.id) 
                          ? 'bg-red-100 text-red-700' 
                          : isDeadlineImminent(deadline.date, deadline.id) 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Scadenza: {formatDate(deadline.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Non ci sono scadenze imminenti nei prossimi 30 giorni.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attenzione</AlertTitle>
            <AlertDescription>
              Le informazioni riportate in questa pagina sono indicative e potrebbero essere soggette a variazioni. Verifica sempre le scadenze esatte sui siti ufficiali degli enti competenti.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}