import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  EuroIcon, 
  HomeIcon, 
  GraduationCapIcon, 
  BabyIcon, 
  CarIcon, 
  HeartPulseIcon, 
  FilterIcon,
  SearchIcon,
  CheckCircle2Icon,
  XCircleIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Interfacce per i tipi di dati
interface BonusCategory {
  id: string;
  name: string;
  icon: JSX.Element;
}

interface BonusItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iseeMax: number | null;
  amount: string;
  deadline: string;
  requirements: string[];
  howToApply: string;
  link: string;
  isNew: boolean;
  isExpiring: boolean;
}

export default function BonusIseeTracker() {
  // Lista categorie
  const categories: BonusCategory[] = [
    { id: "all", name: "Tutti i bonus", icon: <FilterIcon className="h-4 w-4" /> },
    { id: "famiglia", name: "Famiglia", icon: <BabyIcon className="h-4 w-4" /> },
    { id: "casa", name: "Casa", icon: <HomeIcon className="h-4 w-4" /> },
    { id: "istruzione", name: "Istruzione", icon: <GraduationCapIcon className="h-4 w-4" /> },
    { id: "trasporti", name: "Trasporti", icon: <CarIcon className="h-4 w-4" /> },
    { id: "salute", name: "Salute", icon: <HeartPulseIcon className="h-4 w-4" /> },
    { id: "economici", name: "Economici", icon: <EuroIcon className="h-4 w-4" /> },
  ];

  // Stato per la selezione della categoria e il valore ISEE
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [iseeValue, setIseeValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lista dei Bonus disponibili nel 2025 (dati di esempio)
  const bonusList: BonusItem[] = [
    {
      id: "1",
      title: "Assegno Unico Universale 2025",
      description: "Contributo economico per le famiglie con figli a carico fino a 21 anni di età. L'importo varia in base all'ISEE.",
      category: "famiglia",
      iseeMax: 40000,
      amount: "Da 54€ a 189,20€ mensili per figlio",
      deadline: "30/06/2025",
      requirements: [
        "Figli a carico fino a 21 anni",
        "Residenza in Italia",
        "Cittadinanza italiana, UE o permesso di soggiorno",
        "ISEE in corso di validità"
      ],
      howToApply: "Domanda tramite sito INPS, patronati o app IO",
      link: "https://www.inps.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "2",
      title: "Bonus Asilo Nido 2025",
      description: "Contributo per il pagamento delle rette degli asili nido pubblici e privati o per forme di supporto presso la propria abitazione.",
      category: "famiglia",
      iseeMax: 40000,
      amount: "Fino a 3.000€ annui",
      deadline: "31/12/2025",
      requirements: [
        "Figli nati dal 1° gennaio 2022",
        "Iscrizione all'asilo nido",
        "ISEE minorenni in corso di validità"
      ],
      howToApply: "Domanda online sul sito INPS",
      link: "https://www.inps.it/",
      isNew: true,
      isExpiring: false
    },
    {
      id: "3",
      title: "Bonus Ristrutturazioni 2025",
      description: "Detrazione fiscale per interventi di ristrutturazione edilizia",
      category: "casa",
      iseeMax: null,
      amount: "50% delle spese fino a un massimo di 96.000€",
      deadline: "31/12/2025",
      requirements: [
        "Proprietà dell'immobile o titolo che attesti la disponibilità",
        "Comunicazione all'Agenzia delle Entrate",
        "Pagamento con bonifico parlante"
      ],
      howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
      link: "https://www.agenziaentrate.gov.it/",
      isNew: false,
      isExpiring: true
    },
    {
      id: "4",
      title: "Ecobonus 2025",
      description: "Detrazione fiscale per interventi di efficientamento energetico",
      category: "casa",
      iseeMax: null,
      amount: "Dal 50% al 65% delle spese",
      deadline: "31/12/2025",
      requirements: [
        "Proprietà dell'immobile o titolo che attesti la disponibilità",
        "Certificazione energetica pre e post intervento",
        "Invio documentazione all'ENEA entro 90 giorni dalla fine dei lavori"
      ],
      howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
      link: "https://www.agenziaentrate.gov.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "5",
      title: "Bonus Mobili 2025",
      description: "Detrazione fiscale per l'acquisto di mobili e grandi elettrodomestici",
      category: "casa",
      iseeMax: null,
      amount: "50% delle spese fino a un massimo di 5.000€",
      deadline: "31/12/2025",
      requirements: [
        "Ristrutturazione dell'immobile iniziata dal 1° gennaio 2024",
        "Elettrodomestici di classe energetica non inferiore alla A (A+ per forni)",
        "Pagamento con bonifico, carta di credito o debito"
      ],
      howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
      link: "https://www.agenziaentrate.gov.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "6",
      title: "Carta Dedicata a Te 2025",
      description: "Carta prepagata per l'acquisto di beni alimentari di prima necessità, carburanti o abbonamenti al trasporto pubblico",
      category: "economici",
      iseeMax: 15000,
      amount: "500€ una tantum",
      deadline: "31/07/2025",
      requirements: [
        "ISEE inferiore a 15.000€",
        "Non percepire altri sussidi pubblici",
        "Essere iscritti all'anagrafe comunale"
      ],
      howToApply: "Assegnazione automatica in base a graduatorie comunali",
      link: "https://www.lavoro.gov.it/",
      isNew: true,
      isExpiring: false
    },
    {
      id: "7",
      title: "Bonus Psicologo 2025",
      description: "Contributo per sostenere le spese di assistenza psicologica",
      category: "salute",
      iseeMax: 50000,
      amount: "Fino a 1.500€ per persona",
      deadline: "31/10/2025",
      requirements: [
        "ISEE inferiore a 50.000€",
        "Residenza in Italia"
      ],
      howToApply: "Domanda online sul sito INPS",
      link: "https://www.inps.it/",
      isNew: true,
      isExpiring: false
    },
    {
      id: "8",
      title: "Bonus Trasporti 2025",
      description: "Contributo per l'acquisto di abbonamenti al trasporto pubblico locale, regionale e interregionale",
      category: "trasporti",
      iseeMax: 20000,
      amount: "Fino a 60€ per abbonamento",
      deadline: "31/12/2025 (fino ad esaurimento fondi)",
      requirements: [
        "ISEE inferiore a 20.000€",
        "Acquisto di abbonamenti ai servizi di trasporto pubblico"
      ],
      howToApply: "Domanda online sulla piattaforma dedicata",
      link: "https://www.bonustrasporti.lavoro.gov.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "9",
      title: "Carta del Merito 2025",
      description: "Bonus cultura destinato ai giovani che conseguono il diploma con 100/100",
      category: "istruzione",
      iseeMax: null,
      amount: "500€ spendibili in cultura",
      deadline: "31/12/2025",
      requirements: [
        "Conseguimento del diploma con votazione 100/100",
        "Età non superiore a 19 anni"
      ],
      howToApply: "Registrazione alla piattaforma online dedicata",
      link: "https://www.cartadelmerito.gov.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "10",
      title: "Bonus Università 2025",
      description: "Esonero totale o parziale dal pagamento delle tasse universitarie",
      category: "istruzione",
      iseeMax: 30000,
      amount: "Esonero totale o parziale in base all'ISEE",
      deadline: "Variabile in base all'ateneo",
      requirements: [
        "ISEE fino a 30.000€ per esonero totale o parziale",
        "Iscrizione a università statali",
        "Requisiti di merito definiti dagli atenei"
      ],
      howToApply: "Domanda alla segreteria del proprio ateneo",
      link: "https://www.mur.gov.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "11",
      title: "Assegno di Inclusione 2025",
      description: "Misura di sostegno economico e inclusione sociale rivolta ai nuclei familiari con componenti in condizioni di svantaggio",
      category: "economici",
      iseeMax: 9360,
      amount: "Fino a 6.000€ annui (7.560€ per over 67)",
      deadline: "Rinnovo annuale",
      requirements: [
        "ISEE inferiore a 9.360€",
        "Presenza nel nucleo di minori, over 60, disabili o in condizioni di svantaggio",
        "Residenza in Italia da almeno 5 anni",
        "Iscrizione al Centro per l'Impiego"
      ],
      howToApply: "Domanda presso INPS, patronati o CAF",
      link: "https://www.inps.it/",
      isNew: false,
      isExpiring: false
    },
    {
      id: "12",
      title: "Bonus Barriere Architettoniche 75% 2025",
      description: "Detrazione fiscale per interventi di eliminazione delle barriere architettoniche",
      category: "casa",
      iseeMax: null,
      amount: "75% delle spese sostenute",
      deadline: "31/12/2025",
      requirements: [
        "Interventi finalizzati all'eliminazione delle barriere architettoniche",
        "Conformità ai requisiti tecnici previsti dal DM 236/1989"
      ],
      howToApply: "Dichiarazione dei redditi - Modello 730 o Modello Redditi",
      link: "https://www.agenziaentrate.gov.it/",
      isNew: false,
      isExpiring: true
    }
  ];

  // Filtraggio bonus in base alla categoria, al valore ISEE e alla ricerca
  const filteredBonus = bonusList.filter(bonus => {
    // Filtro per categoria
    const categoryMatch = selectedCategory === "all" || bonus.category === selectedCategory;
    
    // Filtro per ISEE
    const iseeMatch = iseeValue === "" || !bonus.iseeMax || 
      (parseFloat(iseeValue) <= bonus.iseeMax);
      
    // Filtro per ricerca
    const searchMatch = searchQuery === "" ||
      bonus.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bonus.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && iseeMatch && searchMatch;
  });

  // Controlla se un bonus è accessibile con l'ISEE specificato
  const isEligibleByIsee = (bonus: BonusItem) => {
    if (iseeValue === "" || !bonus.iseeMax) return true;
    return parseFloat(iseeValue) <= bonus.iseeMax;
  };

  return (
    <div className="space-y-3">
      <Tabs defaultValue="explorer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="explorer">Esplora Bonus</TabsTrigger>
          <TabsTrigger value="eligibility">Verifica Idoneità</TabsTrigger>
        </TabsList>
        
        {/* Sezione Esplora Bonus */}
        <TabsContent value="explorer" className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div>
              <Label htmlFor="bonus-category">Filtra per categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="bonus-category" className="mt-1">
                  <SelectValue placeholder="Seleziona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="isee-value">Filtra per ISEE (€)</Label>
              <Input
                id="isee-value"
                type="number"
                value={iseeValue}
                onChange={(e) => setIseeValue(e.target.value)}
                placeholder="Inserisci il tuo valore ISEE"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Cerca bonus per nome o descrizione..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBonus.length > 0 ? (
              filteredBonus.map((bonus) => (
                <Card key={bonus.id} className={`overflow-hidden transition-shadow hover:shadow-md ${!isEligibleByIsee(bonus) ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {bonus.title}
                      </CardTitle>
                      <div className="flex space-x-1">
                        {bonus.isNew && (
                          <Badge className="bg-blue-500 hover:bg-blue-600">Nuovo</Badge>
                        )}
                        {bonus.isExpiring && (
                          <Badge className="bg-amber-500 hover:bg-amber-600">In scadenza</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      {categories.find(c => c.id === bonus.category)?.icon}
                      <span className="ml-1">{categories.find(c => c.id === bonus.category)?.name}</span>
                      {bonus.iseeMax && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          ISEE max: {bonus.iseeMax.toLocaleString()}€
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {bonus.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Importo:</span>
                        <span>{bonus.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Scadenza:</span>
                        <span>{bonus.deadline}</span>
                      </div>
                      {iseeValue && (
                        <div className="mt-3 flex items-center justify-center">
                          {isEligibleByIsee(bonus) ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2Icon className="h-4 w-4 mr-1" />
                              <span className="text-xs">Compatibile con il tuo ISEE</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              <span className="text-xs">ISEE richiesto inferiore</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => document.getElementById(`bonus-details-${bonus.id}`)?.scrollIntoView({ behavior: 'smooth' })}>
                        Dettagli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="text-gray-500">Nessun bonus corrisponde ai filtri selezionati</div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("all");
                    setIseeValue("");
                    setSearchQuery("");
                  }}
                >
                  Reimposta filtri
                </Button>
              </div>
            )}
          </div>
          
          <Separator className="my-8" />
          
          {/* Dettagli dei bonus */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Dettagli Bonus</h3>
            {filteredBonus.length > 0 ? (
              filteredBonus.map((bonus) => (
                <Accordion
                  key={bonus.id}
                  type="single"
                  collapsible
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionItem value="item-1" id={`bonus-details-${bonus.id}`} className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{bonus.title}</span>
                        <span className="text-sm text-gray-500">
                          {categories.find(c => c.id === bonus.category)?.name} - {bonus.amount}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Descrizione</h4>
                          <p className="text-gray-700 mt-1">{bonus.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Requisiti</h4>
                          <ul className="list-disc list-inside mt-1 text-gray-700">
                            {bonus.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Come fare domanda</h4>
                          <p className="text-gray-700 mt-1">{bonus.howToApply}</p>
                          <div className="mt-2">
                            <a 
                              href={bonus.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center px-2.5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Vai al sito ufficiale
                            </a>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Seleziona almeno un bonus per vedere i dettagli
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Sezione Verifica Idoneità */}
        <TabsContent value="eligibility" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Verifica la tua idoneità</CardTitle>
              <CardDescription>
                Inserisci i tuoi dati per scoprire a quali bonus potresti avere diritto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eligibility-isee">Valore ISEE 2025 (€)</Label>
                    <Input
                      id="eligibility-isee"
                      type="number"
                      value={iseeValue}
                      onChange={(e) => setIseeValue(e.target.value)}
                      placeholder="Es.: 15000"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="family-members">Numero componenti nucleo familiare</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="family-members" className="mt-1">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                        <SelectItem value="7+">7 o più</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="children">Figli a carico</Label>
                    <Select defaultValue="0">
                      <SelectTrigger id="children" className="mt-1">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                        <SelectItem value="6+">6 o più</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="age-group">Fascia d'età</Label>
                    <Select defaultValue="30-65">
                      <SelectTrigger id="age-group" className="mt-1">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-29">18-29 anni</SelectItem>
                        <SelectItem value="30-65">30-65 anni</SelectItem>
                        <SelectItem value="over-65">Oltre 65 anni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Label className="w-full mb-1">Categorie di interesse</Label>
                    {categories.filter(c => c.id !== "all").map((category) => (
                      <Button 
                        key={category.id} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                      >
                        {category.icon}
                        <span className="ml-1">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // Questo recupera i bonus filtrati in base all'ISEE inserito
                    // Il risultato è già visibile nella sezione sottostante
                    document.getElementById('bonus-results')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Verifica Bonus Disponibili
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {iseeValue && (
            <div id="bonus-results" className="space-y-4">
              <h3 className="text-xl font-semibold">Bonus potenzialmente disponibili</h3>
              
              {filteredBonus
                .filter(bonus => isEligibleByIsee(bonus))
                .map((bonus) => (
                  <Card key={bonus.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{bonus.title}</CardTitle>
                        <div className="flex gap-1">
                          {bonus.isNew && (
                            <Badge className="bg-blue-500 hover:bg-blue-600">Nuovo</Badge>
                          )}
                          {bonus.isExpiring && (
                            <Badge className="bg-amber-500 hover:bg-amber-600">In scadenza</Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>
                        {bonus.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium block">Importo:</span>
                            <span>{bonus.amount}</span>
                          </div>
                          <div>
                            <span className="font-medium block">Scadenza:</span>
                            <span>{bonus.deadline}</span>
                          </div>
                          <div>
                            <span className="font-medium block">Categoria:</span>
                            <span>{categories.find(c => c.id === bonus.category)?.name}</span>
                          </div>
                          <div>
                            <span className="font-medium block">ISEE massimo:</span>
                            <span>{bonus.iseeMax ? `${bonus.iseeMax.toLocaleString()}€` : "Nessun limite"}</span>
                          </div>
                        </div>
                        
                        <a 
                          href={bonus.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-gray-50"
                        >
                          Vai al sito ufficiale
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {filteredBonus.filter(bonus => isEligibleByIsee(bonus)).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    Nessun bonus disponibile con il valore ISEE inserito
                  </div>
                  <p className="text-sm text-gray-400">
                    Prova a modificare il valore ISEE o altri parametri
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}