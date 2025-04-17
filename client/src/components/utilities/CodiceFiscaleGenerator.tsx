import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";

// Lista dei comuni italiani con relativi codici (versione ridotta per l'esempio)
const COMUNI = [
  { nome: "AGRIGENTO", codice: "A089" },
  { nome: "ALESSANDRIA", codice: "A182" },
  { nome: "ANCONA", codice: "A271" },
  { nome: "AOSTA", codice: "A326" },
  { nome: "AREZZO", codice: "A390" },
  { nome: "ASCOLI PICENO", codice: "A462" },
  { nome: "ASTI", codice: "A479" },
  { nome: "AVELLINO", codice: "A509" },
  { nome: "BARI", codice: "A662" },
  { nome: "BARLETTA", codice: "A669" },
  { nome: "BELLUNO", codice: "A757" },
  { nome: "BENEVENTO", codice: "A783" },
  { nome: "BERGAMO", codice: "A794" },
  { nome: "BIELLA", codice: "A859" },
  { nome: "BOLOGNA", codice: "A944" },
  { nome: "BOLZANO", codice: "A952" },
  { nome: "BRESCIA", codice: "B157" },
  { nome: "BRINDISI", codice: "B180" },
  { nome: "CAGLIARI", codice: "B354" },
  { nome: "CALTANISSETTA", codice: "B429" },
  { nome: "CAMPOBASSO", codice: "B519" },
  { nome: "CASERTA", codice: "B963" },
  { nome: "CATANIA", codice: "C351" },
  { nome: "CATANZARO", codice: "C352" },
  { nome: "CHIETI", codice: "C632" },
  { nome: "COMO", codice: "C933" },
  { nome: "COSENZA", codice: "D086" },
  { nome: "CREMONA", codice: "D150" },
  { nome: "CROTONE", codice: "D122" },
  { nome: "CUNEO", codice: "D205" },
  { nome: "ENNA", codice: "C342" },
  { nome: "FERMO", codice: "D542" },
  { nome: "FERRARA", codice: "D548" },
  { nome: "FIRENZE", codice: "D612" },
  { nome: "FOGGIA", codice: "D643" },
  { nome: "FORLÌ", codice: "D704" },
  { nome: "FROSINONE", codice: "D810" },
  { nome: "GENOVA", codice: "D969" },
  { nome: "GORIZIA", codice: "E098" },
  { nome: "GROSSETO", codice: "E202" },
  { nome: "IMPERIA", codice: "E290" },
  { nome: "ISERNIA", codice: "E335" },
  { nome: "L'AQUILA", codice: "A345" },
  { nome: "LA SPEZIA", codice: "E463" },
  { nome: "LATINA", codice: "E472" },
  { nome: "LECCE", codice: "E506" },
  { nome: "LECCO", codice: "E507" },
  { nome: "LIVORNO", codice: "E625" },
  { nome: "LODI", codice: "E648" },
  { nome: "LUCCA", codice: "E715" },
  { nome: "MACERATA", codice: "E783" },
  { nome: "MANTOVA", codice: "E897" },
  { nome: "MASSA", codice: "F023" },
  { nome: "MATERA", codice: "F052" },
  { nome: "MESSINA", codice: "F158" },
  { nome: "MILANO", codice: "F205" },
  { nome: "MODENA", codice: "F257" },
  { nome: "MONZA", codice: "F704" },
  { nome: "NAPOLI", codice: "F839" },
  { nome: "NOVARA", codice: "F952" },
  { nome: "NUORO", codice: "F979" },
  { nome: "ORISTANO", codice: "G113" },
  { nome: "PADOVA", codice: "G224" },
  { nome: "PALERMO", codice: "G273" },
  { nome: "PARMA", codice: "G337" },
  { nome: "PAVIA", codice: "G388" },
  { nome: "PERUGIA", codice: "G478" },
  { nome: "PESARO", codice: "G479" },
  { nome: "PESCARA", codice: "G482" },
  { nome: "PIACENZA", codice: "G535" },
  { nome: "PISA", codice: "G702" },
  { nome: "PISTOIA", codice: "G713" },
  { nome: "PORDENONE", codice: "G888" },
  { nome: "POTENZA", codice: "G942" },
  { nome: "PRATO", codice: "G999" },
  { nome: "RAGUSA", codice: "H163" },
  { nome: "RAVENNA", codice: "H199" },
  { nome: "REGGIO CALABRIA", codice: "H224" },
  { nome: "REGGIO EMILIA", codice: "H223" },
  { nome: "RIETI", codice: "H282" },
  { nome: "RIMINI", codice: "H294" },
  { nome: "ROMA", codice: "H501" },
  { nome: "ROVIGO", codice: "H620" },
  { nome: "SALERNO", codice: "H703" },
  { nome: "SASSARI", codice: "I452" },
  { nome: "SAVONA", codice: "I480" },
  { nome: "SIENA", codice: "I726" },
  { nome: "SIRACUSA", codice: "I754" },
  { nome: "SONDRIO", codice: "I829" },
  { nome: "TARANTO", codice: "L049" },
  { nome: "TERAMO", codice: "L103" },
  { nome: "TERNI", codice: "L117" },
  { nome: "TORINO", codice: "L219" },
  { nome: "TRAPANI", codice: "L331" },
  { nome: "TRENTO", codice: "L378" },
  { nome: "TREVISO", codice: "L407" },
  { nome: "TRIESTE", codice: "L424" },
  { nome: "UDINE", codice: "L483" },
  { nome: "VARESE", codice: "L682" },
  { nome: "VENEZIA", codice: "L736" },
  { nome: "VERBANIA", codice: "L746" },
  { nome: "VERCELLI", codice: "L750" },
  { nome: "VERONA", codice: "L781" },
  { nome: "VIBO VALENTIA", codice: "F537" },
  { nome: "VICENZA", codice: "L840" },
  { nome: "VITERBO", codice: "M082" },
];

// Schema per la validazione del form
const formSchema = z.object({
  nome: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  cognome: z.string().min(2, { message: "Il cognome deve avere almeno 2 caratteri" }),
  dataNascita: z.string().min(10, { message: "Inserisci una data valida" }),
  sesso: z.enum(["M", "F"], {
    required_error: "Seleziona il sesso",
  }),
  luogoNascita: z.string().min(1, { message: "Seleziona un comune" }),
});

// Funzioni per il calcolo del codice fiscale
const getCodiceCognome = (cognome: string): string => {
  cognome = cognome.toUpperCase().trim();
  const consonanti = cognome.replace(/[AEIOU\s]/g, '');
  const vocali = cognome.replace(/[^AEIOU]/g, '');
  
  let codice = consonanti + vocali;
  codice = codice.replace(/\s/g, ''); // Rimuove eventuali spazi
  
  // Pad con X se necessario
  while (codice.length < 3) {
    codice += 'X';
  }
  
  return codice.substring(0, 3);
};

const getCodiceNome = (nome: string): string => {
  nome = nome.toUpperCase().trim();
  const consonanti = nome.replace(/[AEIOU\s]/g, '');
  const vocali = nome.replace(/[^AEIOU]/g, '');
  
  let codice;
  if (consonanti.length >= 4) {
    // Se ci sono almeno 4 consonanti, prendo la 1ª, 3ª e 4ª
    codice = consonanti[0] + consonanti[2] + consonanti[3];
  } else {
    // Altrimenti prendo tutte le consonanti e aggiungo vocali
    codice = consonanti + vocali;
  }
  
  codice = codice.replace(/\s/g, ''); // Rimuove eventuali spazi
  
  // Pad con X se necessario
  while (codice.length < 3) {
    codice += 'X';
  }
  
  return codice.substring(0, 3);
};

const getCodiceMeseGiorno = (dataNascita: string, sesso: string): string => {
  const data = new Date(dataNascita);
  const anno = data.getFullYear().toString().substr(-2);
  const mese = data.getMonth(); // 0-11
  
  // Codice per il mese
  const codiciMesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  const codiceMese = codiciMesi[mese];
  
  // Codice per il giorno
  let giorno = data.getDate();
  if (sesso === 'F') {
    giorno += 40;
  }
  
  const codiceGiorno = giorno.toString().padStart(2, '0');
  
  return anno + codiceMese + codiceGiorno;
};

const calcolaCarattereControllo = (codice: string): string => {
  // Tabella di conversione per i caratteri in posizione pari
  const conversionePari: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  };

  // Tabella di conversione per i caratteri in posizione dispari
  const conversioneDispari: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };

  // Calcola la somma dei valori
  let somma = 0;
  for (let i = 0; i < codice.length; i++) {
    const carattere = codice[i];
    if (i % 2 === 0) { // Posizione dispari (0-based index)
      somma += conversioneDispari[carattere] || 0;
    } else { // Posizione pari (0-based index)
      somma += conversionePari[carattere] || 0;
    }
  }

  // Calcola il resto della divisione per 26
  const resto = somma % 26;
  
  // Converti il resto in lettera
  return String.fromCharCode(65 + resto); // A = 65, B = 66, ...
};

const calcolaCodiceFiscale = (dati: z.infer<typeof formSchema>): string => {
  try {
    // Calcola i vari componenti del codice fiscale
    const codiceCognome = getCodiceCognome(dati.cognome);
    const codiceNome = getCodiceNome(dati.nome);
    const codiceMeseGiorno = getCodiceMeseGiorno(dati.dataNascita, dati.sesso);
    const codiceLuogo = dati.luogoNascita;
    
    // Assembla il codice fiscale senza carattere di controllo
    const codiceBase = codiceCognome + codiceNome + codiceMeseGiorno + codiceLuogo;
    
    // Calcola il carattere di controllo
    const carattereControllo = calcolaCarattereControllo(codiceBase);
    
    // Codice fiscale completo
    return codiceBase + carattereControllo;
  } catch (error) {
    console.error("Errore nel calcolo del codice fiscale:", error);
    return "";
  }
};

const CodiceFiscaleGenerator = () => {
  const [codiceFiscale, setCodiceFiscale] = useState<string>("");
  const [filteredComuni, setFilteredComuni] = useState<typeof COMUNI>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiato, setCopiato] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      dataNascita: "",
      sesso: "M",
      luogoNascita: "",
    },
  });

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = COMUNI.filter(comune => 
        comune.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComuni(filtered.slice(0, 15)); // Limita a 15 risultati per performance
    } else {
      setFilteredComuni([]);
    }
  }, [searchTerm]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const cf = calcolaCodiceFiscale(values);
    setCodiceFiscale(cf);
    toast({
      title: "Codice fiscale calcolato",
      description: `Il codice fiscale calcolato è: ${cf}`,
    });
  };

  const copiaCodice = () => {
    if (codiceFiscale) {
      navigator.clipboard.writeText(codiceFiscale)
        .then(() => {
          setCopiato(true);
          setTimeout(() => setCopiato(false), 2000);
          toast({
            title: "Codice fiscale copiato!",
            description: "Il codice fiscale è stato copiato negli appunti.",
          });
        })
        .catch(err => {
          console.error('Errore durante la copia: ', err);
          toast({
            title: "Errore",
            description: "Impossibile copiare il codice fiscale.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Calcolo Codice Fiscale</CardTitle>
        <CardDescription>
          Inserisci i tuoi dati anagrafici per calcolare il codice fiscale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calcolo">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calcolo">Calcolo Codice Fiscale</TabsTrigger>
            <TabsTrigger value="info">Informazioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calcolo">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cognome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cognome</FormLabel>
                        <FormControl>
                          <Input placeholder="Rossi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Mario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dataNascita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data di nascita</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sesso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sesso</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="M" id="sesso-m" />
                              <Label htmlFor="sesso-m">Maschile</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="F" id="sesso-f" />
                              <Label htmlFor="sesso-f">Femminile</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="luogoNascita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comune di nascita</FormLabel>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Cerca comune..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-1"
                        />
                        {filteredComuni.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredComuni.map(comune => (
                              <div
                                key={comune.codice}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  setSearchTerm(comune.nome);
                                  form.setValue('luogoNascita', comune.codice);
                                  setFilteredComuni([]);
                                }}
                              >
                                {comune.nome}
                              </div>
                            ))}
                          </div>
                        )}
                        <Input
                          type="hidden"
                          {...field}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Calcola Codice Fiscale</Button>
              </form>
            </Form>
            
            {codiceFiscale && (
              <div className="mt-8 p-4 border rounded-md bg-gray-50">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Risultato</h3>
                  <p className="text-sm text-gray-500">Ecco il codice fiscale calcolato</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-2xl font-bold tracking-widest bg-white p-3 border rounded">
                    {codiceFiscale}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copiaCodice}
                    className={copiato ? "bg-green-50" : ""}
                  >
                    {copiato ? "Copiato!" : "Copia"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Struttura del Codice Fiscale</h3>
              <p>Il codice fiscale italiano è composto da 16 caratteri alfanumerici, suddivisi come segue:</p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizioni 1-3:</span>
                  <span>Prime 3 consonanti del cognome (se non sufficienti, si utilizzano le vocali; se ancora insufficienti si utilizzano le lettere X)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizioni 4-6:</span>
                  <span>Prime 3 consonanti del nome (se il nome contiene 4 o più consonanti, si prendono la 1ª, 3ª e 4ª)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizioni 7-8:</span>
                  <span>Ultime due cifre dell'anno di nascita</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizione 9:</span>
                  <span>Lettera del mese di nascita (A=gennaio, B=febbraio, ...)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizioni 10-11:</span>
                  <span>Giorno di nascita (per le donne si aggiunge 40 al giorno)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizioni 12-15:</span>
                  <span>Codice del comune di nascita (o stato estero)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-24">Posizione 16:</span>
                  <span>Carattere di controllo calcolato sulle 15 posizioni precedenti</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Note Importanti</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Questo calcolatore fornisce il codice fiscale teorico che potrebbe differire da quello ufficiale in casi specifici (ad esempio, omocodie).</li>
                <li>Per ottenere il codice fiscale ufficiale, rivolgersi all'Agenzia delle Entrate.</li>
                <li>I dati inseriti non vengono memorizzati o trasmessi ad alcun server esterno.</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-xs text-gray-500 text-center">
          Questo strumento calcola il codice fiscale in base ai dati inseriti. Il risultato è puramente indicativo e non sostituisce documenti ufficiali.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CodiceFiscaleGenerator;