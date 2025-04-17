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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lista dei comuni italiani con relativi codici
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

// Stati esteri più comuni con relativi codici
const STATI_ESTERI = [
  { nome: "ALBANIA", codice: "Z100" },
  { nome: "ARGENTINA", codice: "Z200" },
  { nome: "AUSTRALIA", codice: "Z700" },
  { nome: "AUSTRIA", codice: "Z102" },
  { nome: "BELGIO", codice: "Z103" },
  { nome: "BRASILE", codice: "Z203" },
  { nome: "BULGARIA", codice: "Z104" },
  { nome: "CANADA", codice: "Z401" },
  { nome: "CINA", codice: "Z210" },
  { nome: "CROAZIA", codice: "Z118" },
  { nome: "DANIMARCA", codice: "Z107" },
  { nome: "EGITTO", codice: "Z301" },
  { nome: "FRANCIA", codice: "Z110" },
  { nome: "GERMANIA", codice: "Z112" },
  { nome: "GIAPPONE", codice: "Z219" },
  { nome: "GRECIA", codice: "Z115" },
  { nome: "INDIA", codice: "Z222" },
  { nome: "IRLANDA", codice: "Z116" },
  { nome: "ISRAELE", codice: "Z226" },
  { nome: "LITUANIA", codice: "Z129" },
  { nome: "LUSSEMBURGO", codice: "Z119" },
  { nome: "MAROCCO", codice: "Z330" },
  { nome: "MESSICO", codice: "Z404" },
  { nome: "MONTENEGRO", codice: "Z159" },
  { nome: "NORVEGIA", codice: "Z125" },
  { nome: "PAESI BASSI", codice: "Z126" },
  { nome: "POLONIA", codice: "Z127" },
  { nome: "PORTOGALLO", codice: "Z128" },
  { nome: "REGNO UNITO", codice: "Z114" },
  { nome: "REPUBBLICA CECA", codice: "Z156" },
  { nome: "ROMANIA", codice: "Z129" },
  { nome: "RUSSIA", codice: "Z154" },
  { nome: "SERBIA", codice: "Z158" },
  { nome: "SLOVENIA", codice: "Z150" },
  { nome: "SPAGNA", codice: "Z131" },
  { nome: "STATI UNITI", codice: "Z404" },
  { nome: "SVEZIA", codice: "Z132" },
  { nome: "SVIZZERA", codice: "Z133" },
  { nome: "TUNISIA", codice: "Z352" },
  { nome: "TURCHIA", codice: "Z243" },
  { nome: "UCRAINA", codice: "Z138" },
  { nome: "UNGHERIA", codice: "Z134" },
  { nome: "VENEZUELA", codice: "Z614" },
];

// Schema per la validazione del form di calcolo
const calcoloFormSchema = z.object({
  nome: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  cognome: z.string().min(2, { message: "Il cognome deve avere almeno 2 caratteri" }),
  dataNascita: z.string().min(10, { message: "Inserisci una data valida" }),
  sesso: z.enum(["M", "F"], {
    required_error: "Seleziona il sesso",
  }),
  luogoNascitaTipo: z.enum(["comune", "estero"], {
    required_error: "Seleziona il tipo di luogo",
  }),
  luogoNascita: z.string().min(1, { message: "Seleziona un luogo di nascita" }),
});

// Schema per la validazione del form di decodifica
const decodificaFormSchema = z.object({
  codiceFiscale: z.string().min(16, { message: "Il codice fiscale deve avere 16 caratteri" })
    .max(16, { message: "Il codice fiscale deve avere 16 caratteri" })
    .regex(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/, { message: "Formato codice fiscale non valido" }),
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

const calcolaCodiceFiscale = (dati: z.infer<typeof calcoloFormSchema>): string => {
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

// Funzioni per la decodifica del codice fiscale
const decodificaMese = (carattere: string): number => {
  const codiciMesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  return codiciMesi.indexOf(carattere);
};

const decodificaCodiceFiscale = (cf: string): {
  sesso: string;
  annoNascita: string;
  meseNascita: string;
  giornoNascita: string;
  luogoNascita: string;
  valido: boolean;
} => {
  // Verifica che il codice fiscale sia valido
  if (!/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(cf)) {
    return {
      sesso: "",
      annoNascita: "",
      meseNascita: "",
      giornoNascita: "",
      luogoNascita: "",
      valido: false
    };
  }
  
  // Estrai le componenti
  const anno = cf.substring(6, 8);
  const codice_mese = cf.charAt(8);
  const giorno = parseInt(cf.substring(9, 11));
  const codice_luogo = cf.substring(11, 15);
  
  // Determina il sesso
  const sesso = giorno > 40 ? "F" : "M";
  
  // Ottieni il giorno effettivo
  const giornoEffettivo = sesso === "F" ? giorno - 40 : giorno;
  
  // Ottieni l'anno completo (assumiamo persone nate nel XX o XXI secolo)
  const annoCompleto = parseInt(anno) < 30 ? "20" + anno : "19" + anno;
  
  // Ottieni il mese
  const mese = decodificaMese(codice_mese);
  const mesiNomi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const meseNome = mesiNomi[mese];
  
  // Cerca il luogo di nascita
  let luogoNascita = "";
  const comune = COMUNI.find(c => c.codice === codice_luogo);
  if (comune) {
    luogoNascita = comune.nome;
  } else {
    const statoEstero = STATI_ESTERI.find(s => s.codice === codice_luogo);
    if (statoEstero) {
      luogoNascita = statoEstero.nome + " (Stato Estero)";
    } else {
      luogoNascita = "Sconosciuto (codice: " + codice_luogo + ")";
    }
  }
  
  return {
    sesso,
    annoNascita: annoCompleto,
    meseNascita: meseNome,
    giornoNascita: giornoEffettivo.toString(),
    luogoNascita,
    valido: true
  };
};

const CodiceFiscaleGenerator = () => {
  const [codiceFiscale, setCodiceFiscale] = useState<string>("");
  const [copiato, setCopiato] = useState<boolean>(false);
  const [filteredLuoghi, setFilteredLuoghi] = useState<Array<{nome: string, codice: string}>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tipoLuogo, setTipoLuogo] = useState<"comune" | "estero">("comune");
  const [datiDecodificati, setDatiDecodificati] = useState<ReturnType<typeof decodificaCodiceFiscale> | null>(null);

  // Form per calcolo codice fiscale
  const calcoloForm = useForm<z.infer<typeof calcoloFormSchema>>({
    resolver: zodResolver(calcoloFormSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      dataNascita: "",
      sesso: "M",
      luogoNascitaTipo: "comune",
      luogoNascita: "",
    },
  });

  // Form per decodifica codice fiscale
  const decodificaForm = useForm<z.infer<typeof decodificaFormSchema>>({
    resolver: zodResolver(decodificaFormSchema),
    defaultValues: {
      codiceFiscale: "",
    },
  });

  // Effetto per filtrare i luoghi in base alla ricerca e al tipo
  useEffect(() => {
    if (searchTerm.length > 1) {
      const sourceList = tipoLuogo === "comune" ? COMUNI : STATI_ESTERI;
      const filtered = sourceList.filter(luogo => 
        luogo.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLuoghi(filtered.slice(0, 15)); // Limita a 15 risultati per performance
    } else {
      setFilteredLuoghi([]);
    }
  }, [searchTerm, tipoLuogo]);

  // Gestisce il cambio di tipo di luogo di nascita
  useEffect(() => {
    // Quando cambia il tipo di luogo, resetta la selezione
    calcoloForm.setValue('luogoNascita', '');
    setSearchTerm('');
  }, [tipoLuogo, calcoloForm]);

  // Submit per calcolo del codice fiscale
  const onCalcoloSubmit = (values: z.infer<typeof calcoloFormSchema>) => {
    const cf = calcolaCodiceFiscale(values);
    setCodiceFiscale(cf);
    toast({
      title: "Codice fiscale calcolato",
      description: `Il codice fiscale è: ${cf}`,
    });
  };

  // Submit per decodifica del codice fiscale
  const onDecodificaSubmit = (values: z.infer<typeof decodificaFormSchema>) => {
    const result = decodificaCodiceFiscale(values.codiceFiscale.toUpperCase());
    setDatiDecodificati(result);
    
    if (result.valido) {
      toast({
        title: "Codice fiscale decodificato",
        description: "I dati anagrafici sono stati estratti correttamente.",
      });
    } else {
      toast({
        title: "Errore nella decodifica",
        description: "Il codice fiscale potrebbe non essere valido.",
        variant: "destructive",
      });
    }
  };

  // Funzione per copiare il codice fiscale
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
    <div className="w-full max-w-6xl mx-auto bg-white">
      <div className="py-6 px-4 border-b text-center">
        <h1 className="text-2xl font-bold mb-2">Calcolo Codice Fiscale</h1>
        <p className="text-sm text-gray-500">Calcola il tuo codice fiscale o decodifica un codice fiscale esistente</p>
      </div>

      <Tabs defaultValue="calcolo" className="w-full">
        <TabsList className="w-full grid grid-cols-2 my-4">
          <TabsTrigger value="calcolo" className="py-2">Calcolo Codice Fiscale</TabsTrigger>
          <TabsTrigger value="decodifica" className="py-2">Decodifica Codice Fiscale</TabsTrigger>
        </TabsList>

        {/* TAB CALCOLO */}
        <TabsContent value="calcolo" className="px-4 pb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sezione sinistra - Form */}
            <div className="lg:w-1/2">
              <Form {...calcoloForm}>
                <form onSubmit={calcoloForm.handleSubmit(onCalcoloSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={calcoloForm.control}
                      name="cognome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognome</FormLabel>
                          <FormControl>
                            <Input placeholder="Rossi" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={calcoloForm.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Mario" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={calcoloForm.control}
                      name="dataNascita"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data di nascita</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              className="border-gray-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={calcoloForm.control}
                      name="sesso"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Sesso</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="M" id="sesso-m" />
                                <Label htmlFor="sesso-m">Maschile</Label>
                              </div>
                              <div className="flex items-center space-x-1">
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
                    control={calcoloForm.control}
                    name="luogoNascitaTipo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Tipo di luogo di nascita</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTipoLuogo(value as "comune" | "estero");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Seleziona tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="comune">Comune Italiano</SelectItem>
                            <SelectItem value="estero">Stato Estero</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={calcoloForm.control}
                    name="luogoNascita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tipoLuogo === "comune" ? "Comune" : "Stato"} di nascita</FormLabel>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder={`Cerca ${tipoLuogo === "comune" ? "comune" : "stato"}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-gray-300 mb-1"
                          />
                          {filteredLuoghi.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredLuoghi.map(luogo => (
                                <div
                                  key={luogo.codice}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setSearchTerm(luogo.nome);
                                    calcoloForm.setValue('luogoNascita', luogo.codice);
                                    setFilteredLuoghi([]);
                                  }}
                                >
                                  {luogo.nome}
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
                  
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 mt-6">
                    Calcola Codice Fiscale
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Sezione destra - Risultato e informazioni */}
            <div className="lg:w-1/2 space-y-6">
              {codiceFiscale ? (
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Risultato</h3>
                  <div className="p-3 bg-gray-50 border rounded flex items-center justify-between">
                    <div className="text-xl font-mono tracking-wider">{codiceFiscale}</div>
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
              ) : null}
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Composizione del Codice Fiscale</h3>
                
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold w-1/4">Posizioni 1-3</td>
                      <td className="py-2">Prime consonanti del COGNOME</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold">Posizioni 4-6</td>
                      <td className="py-2">Prime consonanti del NOME</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold">Posizioni 7-8</td>
                      <td className="py-2">Ultime due cifre dell'ANNO di nascita</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold">Posizione 9</td>
                      <td className="py-2">Lettera del MESE di nascita</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold">Posizioni 10-11</td>
                      <td className="py-2">GIORNO di nascita (+ 40 per le donne)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-semibold">Posizioni 12-15</td>
                      <td className="py-2">Codice del COMUNE o STATO di nascita</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">Posizione 16</td>
                      <td className="py-2">CARATTERE DI CONTROLLO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB DECODIFICA */}
        <TabsContent value="decodifica" className="px-4 pb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sezione sinistra - Form */}
            <div className="lg:w-1/2">
              <Form {...decodificaForm}>
                <form onSubmit={decodificaForm.handleSubmit(onDecodificaSubmit)} className="space-y-4">
                  <FormField
                    control={decodificaForm.control}
                    name="codiceFiscale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inserisci il codice fiscale da decodificare</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="RSSMRA80A01H501X" 
                            {...field} 
                            className="border-gray-300 uppercase"
                            maxLength={16}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 mt-2">
                    Decodifica Codice Fiscale
                  </Button>
                </form>
              </Form>
              
              {datiDecodificati && datiDecodificati.valido && (
                <div className="mt-6 border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Dati anagrafici estratti</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-semibold w-1/3">Sesso</td>
                        <td className="py-2">{datiDecodificati.sesso === "M" ? "Maschio" : "Femmina"}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-semibold">Data di nascita</td>
                        <td className="py-2">{datiDecodificati.giornoNascita} {datiDecodificati.meseNascita} {datiDecodificati.annoNascita}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-semibold">Luogo di nascita</td>
                        <td className="py-2">{datiDecodificati.luogoNascita}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-4">
                    * Nota: La decodifica non può recuperare nome e cognome originali
                  </p>
                </div>
              )}
            </div>
            
            {/* Sezione destra - Informazioni */}
            <div className="lg:w-1/2 space-y-6">
              <div className="border p-4 rounded">
                <h3 className="text-lg font-semibold mb-3">Come si decodifica un codice fiscale</h3>
                <p className="text-sm mb-4">
                  Il codice fiscale italiano contiene informazioni codificate che possono essere estratte per risalire a:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-sm">
                  <li>Sesso della persona</li>
                  <li>Data di nascita</li>
                  <li>Luogo di nascita</li>
                </ul>
                <p className="text-sm mb-2">
                  Non è possibile risalire al nome e cognome originali poiché il processo di codifica non è reversibile in modo univoco.
                </p>
                
                <Separator className="my-4" />
                
                <h4 className="font-semibold mb-2">Esempi di codici validi:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div><code>RSSMRA80A01H501X</code> - Mario Rossi</div>
                  <div><code>BNCNNA95D57F205Y</code> - Anna Bianchi</div>
                </div>
                
                <h4 className="font-semibold mb-2">Limitazioni:</h4>
                <p className="text-sm">
                  La decodifica fornisce informazioni parziali e approssimative. Per omocodie o casi particolari, 
                  il risultato potrebbe non corrispondere esattamente ai dati originali.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t mt-6 text-center">
        <p className="text-xs text-gray-500">
          Questo strumento calcola e decodifica codici fiscali a scopo informativo. 
          I dati inseriti non vengono memorizzati o trasmessi ad alcun server esterno.
        </p>
      </div>
    </div>
  );
};

export default CodiceFiscaleGenerator;