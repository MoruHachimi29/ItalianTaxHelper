import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { jsPDF } from "jspdf";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import modelloF24ImgPath from "@assets/Modello_F24_Ordinario.pdf";

// Interfacce per i dati del form
interface ContribuenteData {
  codiceFiscale: string;
  cognome: string;
  nome: string;
  dataNascita: string;
  sesso: "M" | "F";
  comuneNascita: string;
  provinciaNascita: string;
  comuneResidenza: string;
  provinciaResidenza: string;
  viaResidenza: string;
  civico: string;
}

interface SezioneTributi {
  codiceTributo: string;
  riferimento: string;
  anno: string;
  importoDebito: string;
  importoCredito: string;
}

interface SezioneErario {
  tributi: SezioneTributi[];
  totaleDebiti: string;
  totaleCrediti: string;
}

interface SezioneInps {
  tributi: SezioneTributi[];
  totaleDebiti: string;
  totaleCrediti: string;
}

interface SezioneRegioni {
  regione: string;
  tributi: SezioneTributi[];
  totaleDebiti: string;
  totaleCrediti: string;
}

interface SezioneImposteLocali {
  codiceEnte: string;
  tributi: SezioneTributi[];
  totaleDebiti: string;
  totaleCrediti: string;
}

interface F24OrdinaryData {
  contribuente: ContribuenteData;
  delega: boolean;
  dataDelega: string;
  erario: SezioneErario;
  inps: SezioneInps;
  regioni: SezioneRegioni;
  imposteLocali: SezioneImposteLocali;
  totaleComplessivo: string;
  saldoFinale: string;
}

export default function FormF24OrdinaryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("contribuente");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [showFormHelp, setShowFormHelp] = useState(false);

  // Stato per i dati del form F24
  const [formData, setFormData] = useState<F24OrdinaryData>({
    contribuente: {
      codiceFiscale: "",
      cognome: "",
      nome: "",
      dataNascita: "",
      sesso: "M",
      comuneNascita: "",
      provinciaNascita: "",
      comuneResidenza: "",
      provinciaResidenza: "",
      viaResidenza: "",
      civico: ""
    },
    delega: false,
    dataDelega: "",
    erario: {
      tributi: Array(6).fill({
        codiceTributo: "",
        riferimento: "",
        anno: "",
        importoDebito: "",
        importoCredito: ""
      }),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    inps: {
      tributi: Array(4).fill({
        codiceTributo: "",
        riferimento: "",
        anno: "",
        importoDebito: "",
        importoCredito: ""
      }),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    regioni: {
      regione: "",
      tributi: Array(4).fill({
        codiceTributo: "",
        riferimento: "",
        anno: "",
        importoDebito: "",
        importoCredito: ""
      }),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    imposteLocali: {
      codiceEnte: "",
      tributi: Array(4).fill({
        codiceTributo: "",
        riferimento: "",
        anno: "",
        importoDebito: "",
        importoCredito: ""
      }),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    totaleComplessivo: "0,00",
    saldoFinale: "0,00"
  });

  // Calcola i totali quando cambiano i dati del form
  useEffect(() => {
    calcolaTotali();
  }, [formData.erario.tributi, formData.inps.tributi, formData.regioni.tributi, formData.imposteLocali.tributi]);

  // Funzione per calcolare i totali
  const calcolaTotali = () => {
    // Calcolo totali sezione Erario
    let totaleDebitiErario = 0;
    let totaleCreditiErario = 0;
    formData.erario.tributi.forEach(tributo => {
      totaleDebitiErario += parseFloat(tributo.importoDebito.replace(',', '.')) || 0;
      totaleCreditiErario += parseFloat(tributo.importoCredito.replace(',', '.')) || 0;
    });

    // Calcolo totali sezione INPS
    let totaleDebitiInps = 0;
    let totaleCreditiInps = 0;
    formData.inps.tributi.forEach(tributo => {
      totaleDebitiInps += parseFloat(tributo.importoDebito.replace(',', '.')) || 0;
      totaleCreditiInps += parseFloat(tributo.importoCredito.replace(',', '.')) || 0;
    });

    // Calcolo totali sezione Regioni
    let totaleDebitiRegioni = 0;
    let totaleCreditiRegioni = 0;
    formData.regioni.tributi.forEach(tributo => {
      totaleDebitiRegioni += parseFloat(tributo.importoDebito.replace(',', '.')) || 0;
      totaleCreditiRegioni += parseFloat(tributo.importoCredito.replace(',', '.')) || 0;
    });

    // Calcolo totali sezione Imposte Locali
    let totaleDebitiLocali = 0;
    let totaleCreditiLocali = 0;
    formData.imposteLocali.tributi.forEach(tributo => {
      totaleDebitiLocali += parseFloat(tributo.importoDebito.replace(',', '.')) || 0;
      totaleCreditiLocali += parseFloat(tributo.importoCredito.replace(',', '.')) || 0;
    });

    // Totale complessivo
    const totaleDebiti = totaleDebitiErario + totaleDebitiInps + totaleDebitiRegioni + totaleDebitiLocali;
    const totaleCrediti = totaleCreditiErario + totaleCreditiInps + totaleCreditiRegioni + totaleCreditiLocali;
    const saldoFinale = totaleDebiti - totaleCrediti;

    // Aggiornamento dello stato con i totali calcolati
    setFormData(prev => ({
      ...prev,
      erario: {
        ...prev.erario,
        totaleDebiti: totaleDebitiErario.toFixed(2).replace('.', ','),
        totaleCrediti: totaleCreditiErario.toFixed(2).replace('.', ',')
      },
      inps: {
        ...prev.inps,
        totaleDebiti: totaleDebitiInps.toFixed(2).replace('.', ','),
        totaleCrediti: totaleCreditiInps.toFixed(2).replace('.', ',')
      },
      regioni: {
        ...prev.regioni,
        totaleDebiti: totaleDebitiRegioni.toFixed(2).replace('.', ','),
        totaleCrediti: totaleCreditiRegioni.toFixed(2).replace('.', ',')
      },
      imposteLocali: {
        ...prev.imposteLocali,
        totaleDebiti: totaleDebitiLocali.toFixed(2).replace('.', ','),
        totaleCrediti: totaleCreditiLocali.toFixed(2).replace('.', ',')
      },
      totaleComplessivo: totaleDebiti.toFixed(2).replace('.', ','),
      saldoFinale: saldoFinale > 0 ? saldoFinale.toFixed(2).replace('.', ',') : "0,00"
    }));
  };

  // Gestisce il cambio valore nei campi del form
  const handleInputChange = (section: string, field: string, value: string, index?: number) => {
    setFormData(prev => {
      if (section === "contribuente") {
        return {
          ...prev,
          contribuente: {
            ...prev.contribuente,
            [field]: value
          }
        };
      } else if (section === "delega") {
        return {
          ...prev,
          [field]: value
        };
      } else if (["erario", "inps", "regioni", "imposteLocali"].includes(section) && index !== undefined) {
        const sectionData = { ...prev[section as keyof F24OrdinaryData] };
        const tributi = [...sectionData.tributi] as SezioneTributi[];
        tributi[index] = { ...tributi[index], [field]: value };
        return {
          ...prev,
          [section]: {
            ...sectionData,
            tributi
          }
        };
      } else if (section === "regioni" && field === "regione") {
        return {
          ...prev,
          regioni: {
            ...prev.regioni,
            regione: value
          }
        };
      } else if (section === "imposteLocali" && field === "codiceEnte") {
        return {
          ...prev,
          imposteLocali: {
            ...prev.imposteLocali,
            codiceEnte: value
          }
        };
      }
      return prev;
    });
  };

  // Generazione del PDF
  const generatePdf = async () => {
    setLoadingPdf(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297] // A4
      });
      
      // Aggiungi sfondo del modello F24
      const img = new Image();
      img.src = modelloF24ImgPath;
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          pdf.addImage(img, 'PNG', 0, 0, 210, 297);
          // Aggiungi dati del contribuente
          pdf.setFontSize(10);
          pdf.text(formData.contribuente.codiceFiscale, 30, 30);
          pdf.text(formData.contribuente.cognome, 80, 30);
          pdf.text(formData.contribuente.nome, 140, 30);
          
          // Aggiungi dati delle varie sezioni
          // ...
          
          // Aggiungi totali
          pdf.text(formData.erario.totaleDebiti, 150, 120);
          pdf.text(formData.erario.totaleCrediti, 170, 120);
          pdf.text(formData.inps.totaleDebiti, 150, 160);
          pdf.text(formData.inps.totaleCrediti, 170, 160);
          pdf.text(formData.regioni.totaleDebiti, 150, 200);
          pdf.text(formData.regioni.totaleCrediti, 170, 200);
          pdf.text(formData.imposteLocali.totaleDebiti, 150, 240);
          pdf.text(formData.imposteLocali.totaleCrediti, 170, 240);
          
          // Aggiungi saldo finale
          pdf.text(formData.saldoFinale, 170, 260);
          
          resolve();
        };
      });
      
      // Salva il PDF
      pdf.save("modello_f24_ordinario.pdf");
      
      toast({
        title: "PDF generato con successo",
        description: "Il modello F24 è stato scaricato."
      });
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione del PDF.",
        variant: "destructive"
      });
    } finally {
      setLoadingPdf(false);
    }
  };

  // Validazione del form prima della generazione del PDF
  const validateForm = () => {
    // Verifica la presenza del codice fiscale
    if (!formData.contribuente.codiceFiscale) {
      toast({
        title: "Errore di validazione",
        description: "Il codice fiscale è obbligatorio.",
        variant: "destructive"
      });
      setActiveTab("contribuente");
      return false;
    }
    
    // Verifica che ci sia almeno un importo inserito
    const hasAnyAmount = formData.erario.tributi.some(t => 
      (parseFloat(t.importoDebito.replace(',', '.')) || 0) > 0 || 
      (parseFloat(t.importoCredito.replace(',', '.')) || 0) > 0
    ) || formData.inps.tributi.some(t => 
      (parseFloat(t.importoDebito.replace(',', '.')) || 0) > 0 || 
      (parseFloat(t.importoCredito.replace(',', '.')) || 0) > 0
    ) || formData.regioni.tributi.some(t => 
      (parseFloat(t.importoDebito.replace(',', '.')) || 0) > 0 || 
      (parseFloat(t.importoCredito.replace(',', '.')) || 0) > 0
    ) || formData.imposteLocali.tributi.some(t => 
      (parseFloat(t.importoDebito.replace(',', '.')) || 0) > 0 || 
      (parseFloat(t.importoCredito.replace(',', '.')) || 0) > 0
    );
    
    if (!hasAnyAmount) {
      toast({
        title: "Errore di validazione",
        description: "Inserire almeno un importo in una delle sezioni.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Gestisce la stampa del modello
  const handlePrint = () => {
    if (validateForm()) {
      generatePdf();
    }
  };

  // Gestisce il reset del form
  const handleReset = () => {
    if (confirm("Sei sicuro di voler cancellare tutti i dati inseriti?")) {
      setFormData({
        contribuente: {
          codiceFiscale: "",
          cognome: "",
          nome: "",
          dataNascita: "",
          sesso: "M",
          comuneNascita: "",
          provinciaNascita: "",
          comuneResidenza: "",
          provinciaResidenza: "",
          viaResidenza: "",
          civico: ""
        },
        delega: false,
        dataDelega: "",
        erario: {
          tributi: Array(6).fill({
            codiceTributo: "",
            riferimento: "",
            anno: "",
            importoDebito: "",
            importoCredito: ""
          }),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        inps: {
          tributi: Array(4).fill({
            codiceTributo: "",
            riferimento: "",
            anno: "",
            importoDebito: "",
            importoCredito: ""
          }),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        regioni: {
          regione: "",
          tributi: Array(4).fill({
            codiceTributo: "",
            riferimento: "",
            anno: "",
            importoDebito: "",
            importoCredito: ""
          }),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        imposteLocali: {
          codiceEnte: "",
          tributi: Array(4).fill({
            codiceTributo: "",
            riferimento: "",
            anno: "",
            importoDebito: "",
            importoCredito: ""
          }),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        totaleComplessivo: "0,00",
        saldoFinale: "0,00"
      });
      
      setActiveTab("contribuente");
      
      toast({
        title: "Form resettato",
        description: "Tutti i dati sono stati cancellati."
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Modello F24 Ordinario Compilabile Online | F24Editabile</title>
        <meta name="description" content="Compila il modello F24 ordinario online, calcola automaticamente i totali e scarica il PDF. Servizio gratuito per il pagamento di tasse, imposte e contributi." />
        <meta name="keywords" content="F24 ordinario, modello F24 online, F24 editabile, modello F24 compilabile, compilare F24, scaricare F24 PDF" />
        <link rel="canonical" href="https://f24editabile.replit.app/moduli/f24-ordinario" />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Modello F24 Ordinario Compilabile Online</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Compila il modello F24 ordinario online, calcola automaticamente i totali e genera il file PDF per la stampa. 
          Il servizio è completamente gratuito.
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-8 mb-8">
        <div className="w-full md:w-2/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Compila il modello F24 Ordinario</CardTitle>
              <CardDescription>
                Inserisci i dati per compilare il modello F24 ordinario. Tutti i calcoli verranno effettuati automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                  <TabsTrigger value="contribuente">Contribuente</TabsTrigger>
                  <TabsTrigger value="erario">Erario</TabsTrigger>
                  <TabsTrigger value="inps">INPS</TabsTrigger>
                  <TabsTrigger value="regioni">Regioni</TabsTrigger>
                  <TabsTrigger value="locali">Imposte Locali</TabsTrigger>
                </TabsList>

                {/* Sezione Contribuente */}
                <TabsContent value="contribuente">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                        <Input 
                          id="codiceFiscale"
                          value={formData.contribuente.codiceFiscale}
                          onChange={(e) => handleInputChange("contribuente", "codiceFiscale", e.target.value)}
                          placeholder="Inserisci il codice fiscale"
                          className="uppercase"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cognome">Cognome</Label>
                        <Input 
                          id="cognome"
                          value={formData.contribuente.cognome}
                          onChange={(e) => handleInputChange("contribuente", "cognome", e.target.value)}
                          placeholder="Cognome o denominazione"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome</Label>
                        <Input 
                          id="nome"
                          value={formData.contribuente.nome}
                          onChange={(e) => handleInputChange("contribuente", "nome", e.target.value)}
                          placeholder="Nome"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataNascita">Data di nascita</Label>
                        <Input 
                          id="dataNascita"
                          type="date"
                          value={formData.contribuente.dataNascita}
                          onChange={(e) => handleInputChange("contribuente", "dataNascita", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="sesso">Sesso</Label>
                        <Select
                          value={formData.contribuente.sesso}
                          onValueChange={(value) => handleInputChange("contribuente", "sesso", value as "M" | "F")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Maschio</SelectItem>
                            <SelectItem value="F">Femmina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="comuneNascita">Comune di nascita</Label>
                        <Input 
                          id="comuneNascita"
                          value={formData.contribuente.comuneNascita}
                          onChange={(e) => handleInputChange("contribuente", "comuneNascita", e.target.value)}
                          placeholder="Comune di nascita"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provinciaNascita">Provincia</Label>
                        <Input 
                          id="provinciaNascita"
                          value={formData.contribuente.provinciaNascita}
                          onChange={(e) => handleInputChange("contribuente", "provinciaNascita", e.target.value)}
                          placeholder="Provincia"
                          maxLength={2}
                          className="uppercase"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="comuneResidenza">Comune di residenza</Label>
                        <Input 
                          id="comuneResidenza"
                          value={formData.contribuente.comuneResidenza}
                          onChange={(e) => handleInputChange("contribuente", "comuneResidenza", e.target.value)}
                          placeholder="Comune di residenza"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provinciaResidenza">Provincia</Label>
                        <Input 
                          id="provinciaResidenza"
                          value={formData.contribuente.provinciaResidenza}
                          onChange={(e) => handleInputChange("contribuente", "provinciaResidenza", e.target.value)}
                          placeholder="Provincia"
                          maxLength={2}
                          className="uppercase"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="viaResidenza">Via e numero civico</Label>
                        <Input 
                          id="viaResidenza"
                          value={formData.contribuente.viaResidenza}
                          onChange={(e) => handleInputChange("contribuente", "viaResidenza", e.target.value)}
                          placeholder="Via/Piazza"
                        />
                      </div>
                      <div>
                        <Label htmlFor="civico">Numero civico</Label>
                        <Input 
                          id="civico"
                          value={formData.contribuente.civico}
                          onChange={(e) => handleInputChange("contribuente", "civico", e.target.value)}
                          placeholder="Civico"
                        />
                      </div>
                    </div>

                    {/* Bottoni di navigazione */}
                    <div className="flex justify-end mt-4">
                      <Button onClick={() => setActiveTab("erario")}>
                        Avanti: Sezione Erario
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Sezione Erario */}
                <TabsContent value="erario">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Sezione Erario</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 border text-center">Codice tributo</th>
                            <th className="p-2 border text-center">Riferimento</th>
                            <th className="p-2 border text-center">Anno</th>
                            <th className="p-2 border text-center">Importi a debito</th>
                            <th className="p-2 border text-center">Importi a credito</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.erario.tributi.map((tributo, index) => (
                            <tr key={`erario-${index}`}>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.codiceTributo}
                                  onChange={(e) => handleInputChange("erario", "codiceTributo", e.target.value, index)}
                                  placeholder="Codice"
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.riferimento}
                                  onChange={(e) => handleInputChange("erario", "riferimento", e.target.value, index)}
                                  placeholder="Rif."
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.anno}
                                  onChange={(e) => handleInputChange("erario", "anno", e.target.value, index)}
                                  placeholder="AAAA"
                                  maxLength={4}
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoDebito}
                                  onChange={(e) => handleInputChange("erario", "importoDebito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoCredito}
                                  onChange={(e) => handleInputChange("erario", "importoCredito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                            <td className="p-2 border text-right">{formData.erario.totaleDebiti}</td>
                            <td className="p-2 border text-right">{formData.erario.totaleCrediti}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bottoni di navigazione */}
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("contribuente")}>
                        Indietro: Contribuente
                      </Button>
                      <Button onClick={() => setActiveTab("inps")}>
                        Avanti: Sezione INPS
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Sezione INPS */}
                <TabsContent value="inps">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Sezione INPS</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 border text-center">Codice tributo</th>
                            <th className="p-2 border text-center">Riferimento</th>
                            <th className="p-2 border text-center">Anno</th>
                            <th className="p-2 border text-center">Importi a debito</th>
                            <th className="p-2 border text-center">Importi a credito</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.inps.tributi.map((tributo, index) => (
                            <tr key={`inps-${index}`}>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.codiceTributo}
                                  onChange={(e) => handleInputChange("inps", "codiceTributo", e.target.value, index)}
                                  placeholder="Codice"
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.riferimento}
                                  onChange={(e) => handleInputChange("inps", "riferimento", e.target.value, index)}
                                  placeholder="Rif."
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.anno}
                                  onChange={(e) => handleInputChange("inps", "anno", e.target.value, index)}
                                  placeholder="AAAA"
                                  maxLength={4}
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoDebito}
                                  onChange={(e) => handleInputChange("inps", "importoDebito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoCredito}
                                  onChange={(e) => handleInputChange("inps", "importoCredito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                            <td className="p-2 border text-right">{formData.inps.totaleDebiti}</td>
                            <td className="p-2 border text-right">{formData.inps.totaleCrediti}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bottoni di navigazione */}
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("erario")}>
                        Indietro: Erario
                      </Button>
                      <Button onClick={() => setActiveTab("regioni")}>
                        Avanti: Sezione Regioni
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Sezione Regioni */}
                <TabsContent value="regioni">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Sezione Regioni</h3>
                    <div className="mb-4">
                      <Label htmlFor="regione">Codice Regione</Label>
                      <Input 
                        id="regione"
                        value={formData.regioni.regione}
                        onChange={(e) => handleInputChange("regioni", "regione", e.target.value)}
                        placeholder="Codice Regione"
                        className="w-40"
                      />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 border text-center">Codice tributo</th>
                            <th className="p-2 border text-center">Riferimento</th>
                            <th className="p-2 border text-center">Anno</th>
                            <th className="p-2 border text-center">Importi a debito</th>
                            <th className="p-2 border text-center">Importi a credito</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.regioni.tributi.map((tributo, index) => (
                            <tr key={`regioni-${index}`}>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.codiceTributo}
                                  onChange={(e) => handleInputChange("regioni", "codiceTributo", e.target.value, index)}
                                  placeholder="Codice"
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.riferimento}
                                  onChange={(e) => handleInputChange("regioni", "riferimento", e.target.value, index)}
                                  placeholder="Rif."
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.anno}
                                  onChange={(e) => handleInputChange("regioni", "anno", e.target.value, index)}
                                  placeholder="AAAA"
                                  maxLength={4}
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoDebito}
                                  onChange={(e) => handleInputChange("regioni", "importoDebito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoCredito}
                                  onChange={(e) => handleInputChange("regioni", "importoCredito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                            <td className="p-2 border text-right">{formData.regioni.totaleDebiti}</td>
                            <td className="p-2 border text-right">{formData.regioni.totaleCrediti}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Bottoni di navigazione */}
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("inps")}>
                        Indietro: INPS
                      </Button>
                      <Button onClick={() => setActiveTab("locali")}>
                        Avanti: Imposte Locali
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Sezione Imposte Locali */}
                <TabsContent value="locali">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Sezione Imposte Locali</h3>
                    <div className="mb-4">
                      <Label htmlFor="codiceEnte">Codice Ente</Label>
                      <Input 
                        id="codiceEnte"
                        value={formData.imposteLocali.codiceEnte}
                        onChange={(e) => handleInputChange("imposteLocali", "codiceEnte", e.target.value)}
                        placeholder="Codice Ente"
                        className="w-40"
                      />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 border text-center">Codice tributo</th>
                            <th className="p-2 border text-center">Riferimento</th>
                            <th className="p-2 border text-center">Anno</th>
                            <th className="p-2 border text-center">Importi a debito</th>
                            <th className="p-2 border text-center">Importi a credito</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.imposteLocali.tributi.map((tributo, index) => (
                            <tr key={`locali-${index}`}>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.codiceTributo}
                                  onChange={(e) => handleInputChange("imposteLocali", "codiceTributo", e.target.value, index)}
                                  placeholder="Codice"
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.riferimento}
                                  onChange={(e) => handleInputChange("imposteLocali", "riferimento", e.target.value, index)}
                                  placeholder="Rif."
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.anno}
                                  onChange={(e) => handleInputChange("imposteLocali", "anno", e.target.value, index)}
                                  placeholder="AAAA"
                                  maxLength={4}
                                  className="text-center"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoDebito}
                                  onChange={(e) => handleInputChange("imposteLocali", "importoDebito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                              <td className="p-2 border">
                                <Input 
                                  value={tributo.importoCredito}
                                  onChange={(e) => handleInputChange("imposteLocali", "importoCredito", e.target.value, index)}
                                  placeholder="0,00"
                                  className="text-right"
                                />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-bold">
                            <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                            <td className="p-2 border text-right">{formData.imposteLocali.totaleDebiti}</td>
                            <td className="p-2 border text-right">{formData.imposteLocali.totaleCrediti}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Riepilogo Totali */}
                    <div className="mt-8 p-4 border rounded-md bg-gray-50">
                      <h3 className="text-lg font-medium mb-4">Riepilogo Totali</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span>Totale debiti:</span>
                        <span className="font-bold">{formData.totaleComplessivo} €</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Totale crediti:</span>
                        <span className="font-bold">{
                          (parseFloat(formData.erario.totaleCrediti.replace(',', '.')) +
                          parseFloat(formData.inps.totaleCrediti.replace(',', '.')) +
                          parseFloat(formData.regioni.totaleCrediti.replace(',', '.')) +
                          parseFloat(formData.imposteLocali.totaleCrediti.replace(',', '.'))).toFixed(2).replace('.', ',')
                        } €</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Saldo finale:</span>
                        <span>{formData.saldoFinale} €</span>
                      </div>
                    </div>

                    {/* Bottoni di navigazione */}
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("regioni")}>
                        Indietro: Regioni
                      </Button>
                      <div className="space-x-2">
                        <Button variant="destructive" onClick={handleReset}>
                          Cancella Tutto
                        </Button>
                        <Button
                          variant="default"
                          onClick={handlePrint}
                          disabled={loadingPdf}
                        >
                          {loadingPdf ? "Generazione in corso..." : "Genera PDF"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowFormHelp(!showFormHelp)}
              >
                {showFormHelp ? "Nascondi guida" : "Mostra guida alla compilazione"}
              </Button>
            </CardFooter>
          </Card>

          {showFormHelp && (
            <Alert className="mb-6">
              <AlertDescription>
                <h3 className="text-lg font-medium mb-2">Guida alla compilazione</h3>
                <p className="mb-2">Per compilare correttamente il modello F24 ordinario, segui queste istruzioni:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Inserisci i dati anagrafici nella sezione <strong>Contribuente</strong> (il codice fiscale è obbligatorio)</li>
                  <li>Compila la <strong>Sezione Erario</strong> per i tributi statali (es. IRPEF, IVA)</li>
                  <li>Utilizza la <strong>Sezione INPS</strong> per i contributi previdenziali</li>
                  <li>Compila la <strong>Sezione Regioni</strong> per i tributi regionali (es. IRAP, Addizionale regionale)</li>
                  <li>Utilizza la <strong>Sezione Imposte Locali</strong> per IMU, TASI e altri tributi comunali</li>
                  <li>Controlla i <strong>Totali</strong> calcolati automaticamente</li>
                  <li>Clicca su <strong>Genera PDF</strong> per ottenere il modello compilato</li>
                </ol>
                <p className="mt-2">A parte controlli di base sul contribuente, non sono presenti controlli particolari quindi verificate con attenzione i dati inseriti.</p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Modelli e istruzioni</CardTitle>
              <CardDescription>
                Accedi ai modelli F24 ufficiali e alle relative istruzioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="/assets/Modello_F24_Ordinario.pdf" target="_blank" rel="noopener noreferrer">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Modello F24 Ordinario (PDF)
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="/assets/Istruzioni_modello_F24.pdf" target="_blank" rel="noopener noreferrer">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Istruzioni F24 Ordinario
                    </a>
                  </Button>
                </div>

                <Separator className="my-4" />
                
                <h3 className="font-medium">Altri modelli F24 disponibili</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="link" className="justify-start h-auto p-0" asChild>
                    <a href="/moduli/f24-semplificato">F24 Semplificato</a>
                  </Button>
                  <Button variant="link" className="justify-start h-auto p-0" asChild>
                    <a href="/moduli/f24-accise">F24 Accise</a>
                  </Button>
                  <Button variant="link" className="justify-start h-auto p-0" asChild>
                    <a href="/moduli/f24-elide">F24 Elementi Identificativi (ELIDE)</a>
                  </Button>
                  <Button variant="link" className="justify-start h-auto p-0" asChild>
                    <a href="/moduli/f23">Modello F23</a>
                  </Button>
                </div>

                <Separator className="my-4" />
                
                <div className="relative rounded-lg overflow-hidden">
                  <ImageWithSkeleton
                    src="/assets/ef7985b0-789e-49da-a51e-6c2b4ba1cc31 (1).png"
                    alt="Esempio F24 Ordinario compilato"
                    aspectRatio="4/3"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm text-center">
                    Esempio modello F24 compilato
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Domande frequenti sul Modello F24</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cos'è il modello F24?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Il modello F24 è un documento fiscale utilizzato in Italia per il pagamento di imposte, tasse e contributi. Con questo modello è possibile effettuare i versamenti relativi a tasse statali, regionali e locali, contributi previdenziali e assicurativi.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Come si paga un F24?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Il modello F24 può essere pagato tramite diversi canali: sportelli bancari, uffici postali, home banking, servizi telematici dell'Agenzia delle Entrate. I contribuenti titolari di partita IVA devono utilizzare esclusivamente i canali telematici.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual è la differenza tra F24 ordinario e semplificato?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Il modello F24 ordinario è il modello completo utilizzabile per tutti i tipi di pagamento. Il modello F24 semplificato ha una struttura più snella ed è pensato principalmente per i contribuenti non titolari di partita IVA che devono versare tributi erariali, regionali e locali.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Devo conservare il modello F24 pagato?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sì, è consigliabile conservare copia dei modelli F24 pagati per almeno 5 anni, in quanto costituiscono prova dell'avvenuto pagamento e potrebbero essere necessari in caso di controlli da parte dell'Agenzia delle Entrate o per la compilazione di dichiarazioni fiscali.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}