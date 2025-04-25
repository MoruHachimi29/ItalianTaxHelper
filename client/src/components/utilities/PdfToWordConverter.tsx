import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  RefreshCw, 
  Upload, 
  FileType, 
  File, 
  Settings, 
  Info,
  Loader2
} from "lucide-react";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionComplete, setConversionComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("docx");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.type === "application/pdf") {
        setPdfFile(file);
        setErrorMessage(null);
        setConversionComplete(false);
        setConversionProgress(0);
      } else {
        setPdfFile(null);
        setErrorMessage("Per favore, seleziona un file PDF valido");
      }
    }
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setErrorMessage("Per favore, seleziona un file PDF da convertire");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setErrorMessage(null);

    try {
      // Simula progresso graduale mentre il server elabora
      const progressInterval = setInterval(() => {
        setConversionProgress(prevProgress => {
          // Progredisci fino all'85% durante il caricamento e l'elaborazione
          if (prevProgress < 85) {
            return prevProgress + Math.random() * 5;
          }
          return prevProgress;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('format', activeTab); // Invia il formato scelto (docx o rtf)

      const response = await fetch('/api/convert-pdf', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Errore durante la conversione';
        const errorDetails = errorData.details ? `\n\nDettagli: ${errorData.details}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      // Completa il progresso al 100%
      setConversionProgress(100);
      
      // Piccola pausa per mostrare il 100% prima di completare
      setTimeout(async () => {
        try {
          // Ottieni il blob dalla risposta in modo affidabile
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          setIsConverting(false);
          setConversionComplete(true);

          // Trigger download
          const a = document.createElement('a');
          a.href = url;
          
          // Estensione corretta in base al formato scelto
          const extension = activeTab === "docx" ? ".docx" : ".rtf";
          a.download = pdfFile.name.replace(/\.pdf$/i, extension);
          
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Mostra conferma di successo
          setErrorMessage(null);
          
          // Rimuovi l'URL creato dopo un breve ritardo per assicurarsi che il download sia iniziato
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        } catch (err: any) {
          console.error('Errore nel download del file:', err);
          setErrorMessage('Errore nel download del file: ' + (err.message || 'Errore sconosciuto'));
          setIsConverting(false);
          setConversionProgress(0);
        }
      }, 500);

    } catch (error: any) {
      setErrorMessage(error.message || "Si è verificato un errore durante la conversione");
      setIsConverting(false);
      setConversionProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
        setErrorMessage(null);
        setConversionComplete(false);
      } else {
        setErrorMessage("Per favore, seleziona un file PDF valido");
      }
    }
  };

  // Resetta lo stato di conversione
  const handleStartOver = () => {
    setPdfFile(null);
    setIsConverting(false);
    setErrorMessage(null);
    setConversionProgress(0);
    setConversionComplete(false);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card className="border-2 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Converti PDF in Word
          </CardTitle>
          <CardDescription>
            Converti facilmente i tuoi documenti PDF in file Word editabili, mantenendo la formattazione e il testo originale.
          </CardDescription>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="docx">Word DOCX</TabsTrigger>
              <TabsTrigger value="rtf">Rich Text RTF</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {!pdfFile ? (
            <div 
              className={`border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} 
                rounded-lg p-10 text-center transition-all hover:border-gray-400 cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pdfInput')?.click()}
            >
              <input
                type="file"
                id="pdfInput"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isConverting}
              />
              
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mt-2">Trascina qui il tuo file PDF</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm">
                  o clicca per selezionare un file dal tuo computer
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Seleziona file PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium truncate max-w-xs">{pdfFile.name}</h3>
                      <p className="text-sm text-gray-500">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    
                    {!isConverting && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartOver();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Rimuovi
                      </Button>
                    )}
                  </div>
                  
                  {isConverting && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 flex items-center">
                          {conversionProgress < 100 ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Conversione in corso...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              Conversione completata
                            </>
                          )}
                        </span>
                        <span>{Math.round(conversionProgress)}%</span>
                      </div>
                      <Progress value={conversionProgress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
              
              {!isConverting && (
                <div className="flex flex-col gap-3">
                  {activeTab === "docx" ? (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="flex items-center gap-1">
                        <Info className="h-4 w-4" /> 
                        <span className="font-medium">Il formato DOCX</span> è compatibile con Microsoft Word e altre applicazioni di elaborazione testi moderne.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="flex items-center gap-1">
                        <Info className="h-4 w-4" /> 
                        <span className="font-medium">Il formato RTF</span> è più semplice ma compatibile con quasi tutti i programmi di testo, inclusi quelli più datati.
                      </p>
                    </div>
                  )}
                
                  <Button 
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Converti in {activeTab === "docx" ? "Word DOCX" : "Rich Text RTF"}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Errore</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {conversionComplete && !errorMessage && (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-300 mt-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                <AlertTitle>Conversione completata con successo!</AlertTitle>
                <p className="text-sm mt-1">Il download dovrebbe iniziare automaticamente. Se non si avvia, prova a convertire nuovamente.</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        {conversionComplete && !errorMessage && (
          <CardFooter className="flex justify-between border-t pt-4 pb-2">
            <Button 
              variant="outline" 
              onClick={handleStartOver}
            >
              <Upload className="h-4 w-4 mr-2" />
              Converti un altro file
            </Button>
            
            <Button 
              onClick={handleConvert}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Converti nuovamente
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informazioni sulla conversione</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>Mantiene la formattazione:</strong> Ottieni un documento Word che mantiene il layout, i caratteri e le immagini del PDF originale.
          </p>
          <p>
            <strong>Converti qualsiasi PDF:</strong> Funziona con documenti scansionati, PDF protetti da copia, e PDF complessi con tabelle e immagini.
          </p>
          <p>
            <strong>Privacy garantita:</strong> I tuoi documenti vengono elaborati sui nostri server, ma non vengono memorizzati permanentemente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}