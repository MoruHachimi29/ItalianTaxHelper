import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsPDF } from "jspdf";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import modelloF24ImgPath from "@assets/Modello_F24.png";

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
  matricola?: string;
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

  // Funzione per creare un array di tributi vuoti
  const createEmptyTributi = (count: number) => {
    return Array.from({ length: count }, () => ({
      codiceTributo: "",
      riferimento: "",
      anno: "",
      importoDebito: "",
      importoCredito: "",
      matricola: ""
    }));
  };

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
      tributi: createEmptyTributi(6),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    inps: {
      tributi: createEmptyTributi(4),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    regioni: {
      regione: "",
      tributi: createEmptyTributi(4),
      totaleDebiti: "0,00",
      totaleCrediti: "0,00"
    },
    imposteLocali: {
      codiceEnte: "",
      tributi: createEmptyTributi(4),
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
          [field]: value === "true"
        };
      } else if (["erario", "inps", "regioni", "imposteLocali"].includes(section) && index !== undefined) {
        if (section === "erario") {
          const newTributi = [...prev.erario.tributi];
          newTributi[index] = { ...newTributi[index], [field]: value };
          return {
            ...prev,
            erario: {
              ...prev.erario,
              tributi: newTributi
            }
          };
        } else if (section === "inps") {
          const newTributi = [...prev.inps.tributi];
          newTributi[index] = { ...newTributi[index], [field]: value };
          return {
            ...prev,
            inps: {
              ...prev.inps,
              tributi: newTributi
            }
          };
        } else if (section === "regioni") {
          const newTributi = [...prev.regioni.tributi];
          newTributi[index] = { ...newTributi[index], [field]: value };
          return {
            ...prev,
            regioni: {
              ...prev.regioni,
              tributi: newTributi
            }
          };
        } else if (section === "imposteLocali") {
          const newTributi = [...prev.imposteLocali.tributi];
          newTributi[index] = { ...newTributi[index], [field]: value };
          return {
            ...prev,
            imposteLocali: {
              ...prev.imposteLocali,
              tributi: newTributi
            }
          };
        }
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
          tributi: createEmptyTributi(6),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        inps: {
          tributi: createEmptyTributi(4),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        regioni: {
          regione: "",
          tributi: createEmptyTributi(4),
          totaleDebiti: "0,00",
          totaleCrediti: "0,00"
        },
        imposteLocali: {
          codiceEnte: "",
          tributi: createEmptyTributi(4),
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
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Modello F24 Ordinario Compilabile Online | F24Editabile</title>
        <meta name="description" content="Compila il modello F24 ordinario online, calcola automaticamente i totali e scarica il PDF. Servizio gratuito per il pagamento di tasse, imposte e contributi." />
        <meta name="keywords" content="F24 ordinario, modello F24 online, F24 editabile, modello F24 compilabile, compilare F24, scaricare F24 PDF" />
        <link rel="canonical" href="https://f24editabile.replit.app/moduli/f24-ordinario" />
      </Helmet>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-3">Modello F24 Ordinario Compilabile Online</h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-sm">
          Compila il modello F24 ordinario online, calcola automaticamente i totali e scarica il PDF pronto per la stampa. 
          Questo servizio è completamente gratuito.
        </p>
      </div>

      <div className="bg-white p-4 border border-gray-200 mb-6 rounded shadow-sm">
        <div className="text-sm mb-4">
          <p>
            A parte controlli di base sul contribuente, non sono presenti controlli particolari quindi verificate con attenzione i dati inseriti.<br />
            Le sezioni del modello sono compilabili separatamente. Puoi iniziare dalla sezione che preferisci.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4 bg-gray-100">
            <TabsTrigger value="contribuente" className="text-xs md:text-sm">CONTRIBUENTE</TabsTrigger>
            <TabsTrigger value="erario" className="text-xs md:text-sm">ERARIO</TabsTrigger>
            <TabsTrigger value="inps" className="text-xs md:text-sm">INPS</TabsTrigger>
            <TabsTrigger value="regioni" className="text-xs md:text-sm">REGIONI</TabsTrigger>
            <TabsTrigger value="locali" className="text-xs md:text-sm">IMPOSTE LOCALI</TabsTrigger>
          </TabsList>

          {/* Sezione Contribuente */}
          <TabsContent value="contribuente">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-medium mb-4 text-center border-b pb-2">DATI ANAGRAFICI CONTRIBUENTE</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="codiceFiscale" className="mb-1 block text-sm font-medium">Codice Fiscale *</Label>
                  <Input 
                    id="codiceFiscale"
                    value={formData.contribuente.codiceFiscale}
                    onChange={(e) => handleInputChange("contribuente", "codiceFiscale", e.target.value)}
                    placeholder="Inserisci il codice fiscale"
                    className="uppercase bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cognome" className="mb-1 block text-sm font-medium">Cognome / Denominazione</Label>
                  <Input 
                    id="cognome"
                    value={formData.contribuente.cognome}
                    onChange={(e) => handleInputChange("contribuente", "cognome", e.target.value)}
                    placeholder="Cognome o denominazione"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome</Label>
                  <Input 
                    id="nome"
                    value={formData.contribuente.nome}
                    onChange={(e) => handleInputChange("contribuente", "nome", e.target.value)}
                    placeholder="Nome"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="dataNascita" className="mb-1 block text-sm font-medium">Data di nascita</Label>
                  <Input 
                    id="dataNascita"
                    type="date"
                    value={formData.contribuente.dataNascita}
                    onChange={(e) => handleInputChange("contribuente", "dataNascita", e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="sesso" className="mb-1 block text-sm font-medium">Sesso</Label>
                  <div className="flex space-x-4 items-center mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio"
                        checked={formData.contribuente.sesso === "M"}
                        onChange={() => handleInputChange("contribuente", "sesso", "M")}
                        className="form-radio"
                      />
                      <span>M</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio"
                        checked={formData.contribuente.sesso === "F"}
                        onChange={() => handleInputChange("contribuente", "sesso", "F")}
                        className="form-radio"
                      />
                      <span>F</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="comuneNascita" className="mb-1 block text-sm font-medium">Comune di nascita</Label>
                  <Input 
                    id="comuneNascita"
                    value={formData.contribuente.comuneNascita}
                    onChange={(e) => handleInputChange("contribuente", "comuneNascita", e.target.value)}
                    placeholder="Comune di nascita"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="provinciaNascita" className="mb-1 block text-sm font-medium">Prov.</Label>
                  <Input 
                    id="provinciaNascita"
                    value={formData.contribuente.provinciaNascita}
                    onChange={(e) => handleInputChange("contribuente", "provinciaNascita", e.target.value)}
                    placeholder="Provincia"
                    maxLength={2}
                    className="uppercase bg-white w-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Label htmlFor="comuneResidenza" className="mb-1 block text-sm font-medium">Comune di residenza/sede</Label>
                  <Input 
                    id="comuneResidenza"
                    value={formData.contribuente.comuneResidenza}
                    onChange={(e) => handleInputChange("contribuente", "comuneResidenza", e.target.value)}
                    placeholder="Comune di residenza"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="provinciaResidenza" className="mb-1 block text-sm font-medium">Prov.</Label>
                  <Input 
                    id="provinciaResidenza"
                    value={formData.contribuente.provinciaResidenza}
                    onChange={(e) => handleInputChange("contribuente", "provinciaResidenza", e.target.value)}
                    placeholder="Provincia"
                    maxLength={2}
                    className="uppercase bg-white w-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <Label htmlFor="viaResidenza" className="mb-1 block text-sm font-medium">Via e numero civico</Label>
                  <Input 
                    id="viaResidenza"
                    value={formData.contribuente.viaResidenza}
                    onChange={(e) => handleInputChange("contribuente", "viaResidenza", e.target.value)}
                    placeholder="Via/Piazza"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="civico" className="mb-1 block text-sm font-medium">Numero</Label>
                  <Input 
                    id="civico"
                    value={formData.contribuente.civico}
                    onChange={(e) => handleInputChange("contribuente", "civico", e.target.value)}
                    placeholder="Civico"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center mt-6">
                <Checkbox 
                  id="delega" 
                  checked={formData.delega}
                  onCheckedChange={(checked) => {
                    handleInputChange("delega", "delega", checked ? "true" : "false")
                  }}
                />
                <label htmlFor="delega" className="ml-2 text-sm">
                  In caso di presentazione a mezzo delega
                </label>
              </div>

              {formData.delega && (
                <div className="mt-4">
                  <Label htmlFor="dataDelega" className="mb-1 block text-sm font-medium">Data delega</Label>
                  <Input 
                    id="dataDelega"
                    type="date"
                    value={formData.dataDelega}
                    onChange={(e) => handleInputChange("delega", "dataDelega", e.target.value)}
                    className="bg-white w-48"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Sezione Erario */}
          <TabsContent value="erario">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-medium mb-4 text-center border-b pb-2">SEZIONE ERARIO</h3>
              
              <ScrollArea className="h-[400px] pr-4">
                <table className="w-full border-collapse border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border text-center font-medium">Codice tributo</th>
                      <th className="p-2 border text-center font-medium">Riferimento</th>
                      <th className="p-2 border text-center font-medium">Anno di riferimento</th>
                      <th className="p-2 border text-center font-medium">Importi a debito</th>
                      <th className="p-2 border text-center font-medium">Importi a credito</th>
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
                            className="text-center border-none bg-white h-8"
                          />
                        </td>
                        <td className="p-2 border">
                          <Input 
                            value={tributo.riferimento}
                            onChange={(e) => handleInputChange("erario", "riferimento", e.target.value, index)}
                            placeholder="Rif."
                            className="text-center border-none bg-white h-8"
                          />
                        </td>
                        <td className="p-2 border">
                          <Input 
                            value={tributo.anno}
                            onChange={(e) => handleInputChange("erario", "anno", e.target.value, index)}
                            placeholder="AAAA"
                            maxLength={4}
                            className="text-center border-none bg-white h-8"
                          />
                        </td>
                        <td className="p-2 border">
                          <Input 
                            value={tributo.importoDebito}
                            onChange={(e) => handleInputChange("erario", "importoDebito", e.target.value, index)}
                            placeholder="0,00"
                            className="text-right border-none bg-white h-8"
                          />
                        </td>
                        <td className="p-2 border">
                          <Input 
                            value={tributo.importoCredito}
                            onChange={(e) => handleInputChange("erario", "importoCredito", e.target.value, index)}
                            placeholder="0,00"
                            className="text-right border-none bg-white h-8"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                      <td className="p-2 border text-right">{formData.erario.totaleDebiti}</td>
                      <td className="p-2 border text-right">{formData.erario.totaleCrediti}</td>
                    </tr>
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Sezione INPS */}
          <TabsContent value="inps">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-medium mb-4 text-center border-b pb-2">SEZIONE INPS</h3>
              
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-center font-medium">Codice sede</th>
                    <th className="p-2 border text-center font-medium">Causale contributo</th>
                    <th className="p-2 border text-center font-medium">Matricola INPS</th>
                    <th className="p-2 border text-center font-medium">Periodo dal/al</th>
                    <th className="p-2 border text-center font-medium">Importi a debito</th>
                    <th className="p-2 border text-center font-medium">Importi a credito</th>
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
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.riferimento}
                          onChange={(e) => handleInputChange("inps", "riferimento", e.target.value, index)}
                          placeholder="Causale"
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.matricola || ""}
                          onChange={(e) => handleInputChange("inps", "matricola", e.target.value, index)}
                          placeholder="Matricola"
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.anno}
                          onChange={(e) => handleInputChange("inps", "anno", e.target.value, index)}
                          placeholder="MM/AAAA"
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoDebito}
                          onChange={(e) => handleInputChange("inps", "importoDebito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoCredito}
                          onChange={(e) => handleInputChange("inps", "importoCredito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={4} className="p-2 border text-right">TOTALE</td>
                    <td className="p-2 border text-right">{formData.inps.totaleDebiti}</td>
                    <td className="p-2 border text-right">{formData.inps.totaleCrediti}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Sezione Regioni */}
          <TabsContent value="regioni">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-medium mb-4 text-center border-b pb-2">SEZIONE REGIONI</h3>
              
              <div className="mb-4">
                <Label htmlFor="regione" className="mb-1 block text-sm font-medium">Codice Regione</Label>
                <Input 
                  id="regione"
                  value={formData.regioni.regione}
                  onChange={(e) => handleInputChange("regioni", "regione", e.target.value)}
                  placeholder="Codice Regione"
                  className="w-40 bg-white"
                />
              </div>
              
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-center font-medium">Codice tributo</th>
                    <th className="p-2 border text-center font-medium">Riferimento</th>
                    <th className="p-2 border text-center font-medium">Anno</th>
                    <th className="p-2 border text-center font-medium">Importi a debito</th>
                    <th className="p-2 border text-center font-medium">Importi a credito</th>
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
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.riferimento}
                          onChange={(e) => handleInputChange("regioni", "riferimento", e.target.value, index)}
                          placeholder="Rif."
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.anno}
                          onChange={(e) => handleInputChange("regioni", "anno", e.target.value, index)}
                          placeholder="AAAA"
                          maxLength={4}
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoDebito}
                          onChange={(e) => handleInputChange("regioni", "importoDebito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoCredito}
                          onChange={(e) => handleInputChange("regioni", "importoCredito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                    <td className="p-2 border text-right">{formData.regioni.totaleDebiti}</td>
                    <td className="p-2 border text-right">{formData.regioni.totaleCrediti}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Sezione Imposte Locali */}
          <TabsContent value="locali">
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="text-md font-medium mb-4 text-center border-b pb-2">SEZIONE IMU E ALTRI TRIBUTI LOCALI</h3>
              
              <div className="mb-4">
                <Label htmlFor="codiceEnte" className="mb-1 block text-sm font-medium">Codice Ente</Label>
                <Input 
                  id="codiceEnte"
                  value={formData.imposteLocali.codiceEnte}
                  onChange={(e) => handleInputChange("imposteLocali", "codiceEnte", e.target.value)}
                  placeholder="Codice Ente"
                  className="w-40 bg-white"
                />
              </div>
              
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-center font-medium">Codice tributo</th>
                    <th className="p-2 border text-center font-medium">Rateazione</th>
                    <th className="p-2 border text-center font-medium">Anno di riferimento</th>
                    <th className="p-2 border text-center font-medium">Importi a debito</th>
                    <th className="p-2 border text-center font-medium">Importi a credito</th>
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
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.riferimento}
                          onChange={(e) => handleInputChange("imposteLocali", "riferimento", e.target.value, index)}
                          placeholder="Rif."
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.anno}
                          onChange={(e) => handleInputChange("imposteLocali", "anno", e.target.value, index)}
                          placeholder="AAAA"
                          maxLength={4}
                          className="text-center border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoDebito}
                          onChange={(e) => handleInputChange("imposteLocali", "importoDebito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                      <td className="p-2 border">
                        <Input 
                          value={tributo.importoCredito}
                          onChange={(e) => handleInputChange("imposteLocali", "importoCredito", e.target.value, index)}
                          placeholder="0,00"
                          className="text-right border-none bg-white h-8"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={3} className="p-2 border text-right">TOTALE</td>
                    <td className="p-2 border text-right">{formData.imposteLocali.totaleDebiti}</td>
                    <td className="p-2 border text-right">{formData.imposteLocali.totaleCrediti}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Riepilogo Totali e Pulsanti */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-medium mb-3 text-center">Riepilogo Totali</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Totale debiti:</span>
                <span className="font-bold">{formData.totaleComplessivo} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Totale crediti:</span>
                <span className="font-bold">{
                  (parseFloat(formData.erario.totaleCrediti.replace(',', '.')) +
                  parseFloat(formData.inps.totaleCrediti.replace(',', '.')) +
                  parseFloat(formData.regioni.totaleCrediti.replace(',', '.')) +
                  parseFloat(formData.imposteLocali.totaleCrediti.replace(',', '.'))).toFixed(2).replace('.', ',')
                } €</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold">
                <span>Saldo finale:</span>
                <span>{formData.saldoFinale} €</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center space-y-2">
            <Button
              variant="default"
              onClick={handlePrint}
              disabled={loadingPdf}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {loadingPdf ? "Generazione PDF in corso..." : "Stampa modello F24"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full border-black text-black hover:bg-gray-100"
            >
              Cancella tutti i dati
            </Button>
            <div className="text-xs text-gray-500 text-center mt-2">
              * I campi contrassegnati con asterisco sono obbligatori
            </div>
          </div>
        </div>
      </div>

      {/* Istruzioni compilazione e modelli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white p-4 border border-gray-200 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-3">Istruzioni per la compilazione del modello F24</h2>
          <div className="text-sm space-y-2">
            <p>
              Il modello F24 ordinario è utilizzato per il pagamento di tributi, imposte, contributi e premi.
              Compilando il modulo puoi pagare:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Imposte sui redditi e ritenute alla fonte</li>
              <li>IVA</li>
              <li>Imposte sostitutive</li>
              <li>IRAP</li>
              <li>Contributi e premi INPS, INAIL</li>
              <li>IMU, TASI, TARI e altri tributi locali</li>
            </ul>
            <p className="mt-2">
              <strong>Per compilare correttamente il modello:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Inserisci i dati anagrafici nella sezione <strong>Contribuente</strong> (il codice fiscale è obbligatorio)</li>
              <li>Compila la <strong>Sezione Erario</strong> per i tributi statali (es. IRPEF, IVA)</li>
              <li>Utilizza la <strong>Sezione INPS</strong> per i contributi previdenziali</li>
              <li>Compila la <strong>Sezione Regioni</strong> per i tributi regionali (es. IRAP, Addizionale regionale)</li>
              <li>Utilizza la <strong>Sezione Imposte Locali</strong> per IMU, TASI e altri tributi comunali</li>
            </ol>
            <p className="mt-2">
              Il sistema calcolerà automaticamente i totali delle singole sezioni e il saldo finale da versare.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-3">Modelli F24 disponibili</h2>
          <div className="space-y-3">
            <div className="p-2 bg-gray-50 border rounded">
              <strong className="block mb-1">F24 Ordinario</strong>
              <p className="text-xs mb-2">Modello completo per tutti i tipi di versamento</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <a href="/assets/Modello_F24_Ordinario.pdf" target="_blank" rel="noopener noreferrer">
                    Scarica PDF
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <a href="/assets/Istruzioni_modello_F24.pdf" target="_blank" rel="noopener noreferrer">
                    Istruzioni
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button variant="link" className="justify-start h-auto p-0 text-sm" asChild>
                <a href="/moduli/f24-semplificato">F24 Semplificato</a>
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" asChild>
                <a href="/moduli/f24-accise">F24 Accise</a>
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" asChild>
                <a href="/moduli/f24-elide">F24 Elementi Identificativi (ELIDE)</a>
              </Button>
              <Button variant="link" className="justify-start h-auto p-0 text-sm" asChild>
                <a href="/moduli/f23">Modello F23</a>
              </Button>
            </div>
            
            <div className="mt-4">
              <img 
                src={modelloF24ImgPath}
                alt="Esempio F24 Ordinario compilato" 
                className="w-full h-auto object-cover border rounded shadow-sm"
              />
              <div className="text-center text-xs mt-1 text-gray-500">
                Esempio modello F24
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white p-4 border border-gray-200 rounded shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Domande frequenti sul Modello F24</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="border-b pb-3 md:border-r md:pr-4 md:border-b-0 md:pb-0">
            <h3 className="font-medium mb-2">Cos'è il modello F24?</h3>
            <p className="text-sm">Il modello F24 è un documento fiscale utilizzato in Italia per il pagamento di imposte, tasse e contributi. Con questo modello è possibile effettuare i versamenti relativi a tasse statali, regionali e locali, contributi previdenziali e assicurativi.</p>
          </div>
          <div className="border-b pb-3 md:pl-4 md:border-b-0 md:pb-0">
            <h3 className="font-medium mb-2">Come si paga un F24?</h3>
            <p className="text-sm">Il modello F24 può essere pagato tramite diversi canali: sportelli bancari, uffici postali, home banking, servizi telematici dell'Agenzia delle Entrate. I contribuenti titolari di partita IVA devono utilizzare esclusivamente i canali telematici.</p>
          </div>
          <div className="border-b pb-3 md:border-r md:pr-4 md:border-b-0 md:pb-0 pt-3 md:pt-4">
            <h3 className="font-medium mb-2">Qual è la differenza tra F24 ordinario e semplificato?</h3>
            <p className="text-sm">Il modello F24 ordinario è il modello completo utilizzabile per tutti i tipi di pagamento. Il modello F24 semplificato ha una struttura più snella ed è pensato principalmente per i contribuenti non titolari di partita IVA che devono versare tributi erariali, regionali e locali.</p>
          </div>
          <div className="pt-3 md:pl-4 md:pt-4">
            <h3 className="font-medium mb-2">Devo conservare il modello F24 pagato?</h3>
            <p className="text-sm">Sì, è consigliabile conservare copia dei modelli F24 pagati per almeno 5 anni, in quanto costituiscono prova dell'avvenuto pagamento e potrebbero essere necessari in caso di controlli da parte dell'Agenzia delle Entrate o per la compilazione di dichiarazioni fiscali.</p>
          </div>
        </div>
      </div>
    </div>
  );
}