import React, { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Highlighter, Pencil, Circle, Square, 
  FilePlus, X, Save, PanelLeft, PanelRight, Search,
  Scissors, RotateCw, ImagePlus, FileText, SquarePen,
  Type, Eraser, Undo, Redo
} from "lucide-react";

export default function SimplePdfEditor() {
  // File e rendering
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Stati UI
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("annotate");
  
  // Watermark
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(30);
  const previewRef = useRef<HTMLIFrameElement>(null);
  
  // Gestione file - versione ottimizzata
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setPdfFile(file);
        setErrorMessage(null);
        
        // Mostra subito l'interfaccia di caricamento
        setIsProcessing(true);
        setProgress(20);
        
        try {
          // Crea URL per anteprima immediatamente
          const fileUrl = URL.createObjectURL(file);
          setPdfUrl(fileUrl);
          
          // Utilizziamo FileReader invece di await per migliorare le prestazioni percepite
          const reader = new FileReader();
          
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentLoaded = Math.round((event.loaded / event.total) * 70) + 20;
              setProgress(Math.min(90, percentLoaded));
            }
          };
          
          reader.onload = (event) => {
            if (event.target) {
              const arrayBuffer = event.target.result as ArrayBuffer;
              const bytes = new Uint8Array(arrayBuffer);
              setPdfBytes(bytes);
              
              // Completa il caricamento
              setProgress(100);
              setTimeout(() => {
                setIsProcessing(false);
                toast({
                  title: "Caricamento completato",
                  description: "Il PDF è stato caricato con successo"
                });
              }, 200);
            }
          };
          
          // In caso di errori
          reader.onerror = () => {
            console.error('Errore nel caricamento del file');
            setErrorMessage("Si è verificato un errore nella lettura del file PDF.");
            setIsProcessing(false);
            toast({
              title: "Errore",
              description: "Si è verificato un errore nella lettura del file PDF",
              variant: "destructive"
            });
          };
          
          // Inizia caricamento file
          reader.readAsArrayBuffer(file);
          
        } catch (error) {
          console.error('Errore nel caricamento del PDF:', error);
          setErrorMessage("Si è verificato un errore nel caricamento del PDF.");
          setIsProcessing(false);
          toast({
            title: "Errore",
            description: "Si è verificato un errore nel caricamento del PDF",
            variant: "destructive"
          });
        }
      } else {
        setPdfFile(null);
        setPdfUrl(null);
        setPdfBytes(null);
        setErrorMessage("Per favore, seleziona un file PDF (.pdf)");
        toast({
          title: "Formato non valido",
          description: "Per favore, seleziona un file PDF (.pdf)",
          variant: "destructive"
        });
      }
    }
  };

  // Salvataggio del documento - ottimizzato
  const saveDocument = async () => {
    if (!pdfBytes) return;
    
    setIsProcessing(true);
    setProgress(30);
    
    try {
      // Crea un link per scaricare il PDF immediatamente
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      setProgress(70);
      
      // Crea e attiva il link di download
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile?.name?.replace('.pdf', '_modificato.pdf') || 'documento_modificato.pdf';
      
      // Esegui il download in modo asincrono per migliorare la reattività dell'UI
      requestAnimationFrame(() => {
        link.click();
        
        // Pulisci risorse
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          setProgress(100);
          setIsProcessing(false);
          
          toast({
            title: "PDF Salvato",
            description: "Il documento è stato salvato con successo",
            duration: 3000
          });
        }, 100);
      });
    } catch (error) {
      console.error('Errore nel salvataggio del PDF:', error);
      setErrorMessage("Si è verificato un errore nel salvataggio del PDF.");
      setIsProcessing(false);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nel salvataggio del PDF",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  
  // Aggiungi filigrana
  const applyWatermark = async () => {
    if (!pdfBytes || !watermarkText) return;
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Carica il PDF esistente
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      // Carica un font standard
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      setProgress(30);
      
      // Aggiungi filigrana a tutte le pagine
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        
        // Calcola la dimensione del testo in base alla pagina
        const fontSize = Math.min(width, height) / 10;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        
        // Posiziona la filigrana al centro della pagina
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font: font,
          color: rgb(0.8, 0.8, 0.8),
          opacity: watermarkOpacity / 100,
          rotate: degrees(315) // Ruota di 45 gradi
        });
        
        // Aggiorna progress per ogni pagina
        setProgress(30 + (i / pages.length) * 60);
      }
      
      setProgress(90);
      
      // Salva il PDF modificato
      const modifiedPdfBytes = await pdfDoc.save();
      
      setProgress(95);
      
      // Aggiorna lo stato con il nuovo PDF
      setPdfBytes(modifiedPdfBytes);
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const modifiedUrl = URL.createObjectURL(modifiedPdfBlob);
      
      // Aggiorna l'URL per il rendering
      setPdfUrl(modifiedUrl);
      
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        
        toast({
          title: "Filigrana applicata",
          description: "La filigrana è stata aggiunta al documento",
          duration: 3000
        });
      }, 500);
      
    } catch (error) {
      console.error('Errore nell\'applicazione della filigrana:', error);
      setErrorMessage("Si è verificato un errore nell'applicazione della filigrana.");
      setIsProcessing(false);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'applicazione della filigrana",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Editor PDF Semplificato</h2>
          <p className="text-gray-600">
            Modifica i tuoi PDF con strumenti essenziali e affidabili.
          </p>
        </div>
        
        {!pdfFile ? (
          <Button
            onClick={() => document.getElementById('pdfFileInput')?.click()}
            className="bg-black text-white hover:bg-gray-800"
          >
            <FilePlus className="h-4 w-4 mr-2" /> Apri PDF
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => saveDocument()}>
              <Save className="h-4 w-4 mr-2" /> Salva
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                setPdfFile(null);
                setPdfUrl(null);
                setPdfBytes(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <input
        type="file"
        id="pdfFileInput"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {!pdfFile ? (
        <div 
          className="border-2 border-dashed rounded-lg p-10 text-center
            border-gray-300 hover:border-black
            transition-colors cursor-pointer"
          onClick={() => document.getElementById('pdfFileInput')?.click()}
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
          <p className="text-sm text-gray-500 mb-4">oppure</p>
          <Button type="button" className="bg-black text-white hover:bg-gray-800">
            <FileText className="h-4 w-4 mr-2" /> Seleziona un file PDF
          </Button>
          <p className="text-xs text-gray-500 mt-4">
            Supporta funzionalità essenziali come filigrana e trasformazioni base.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Contenitore principale con preview e sidebar */}
          <div className="flex border rounded-lg overflow-hidden">
            {/* Area centrale con il documento PDF */}
            <div className="flex-1 relative overflow-auto bg-gray-200 p-4 h-[600px]">
              {isProcessing && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
                  <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                  <p className="text-lg font-medium mb-2">Elaborazione in corso...</p>
                  <Progress value={progress} className="w-64 h-2" />
                </div>
              )}
              
              {pdfUrl && (
                <iframe 
                  ref={previewRef}
                  src={pdfUrl} 
                  className="w-full h-full border-0 shadow-lg" 
                  title="PDF Preview"
                />
              )}
            </div>
            
            {/* Sidebar destra (proprietà e impostazioni) */}
            <div className="w-72 border-l bg-white overflow-y-auto">
              <Tabs defaultValue="annotate" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 p-1 m-2">
                  <TabsTrigger value="annotate">Strumenti</TabsTrigger>
                  <TabsTrigger value="properties">Proprietà</TabsTrigger>
                </TabsList>
                
                <TabsContent value="annotate" className="p-4 space-y-4">
                  {/* Sezione per aggiungere filigrana */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Filigrana</h3>
                    <div>
                      <Label htmlFor="watermarkText">Testo filigrana</Label>
                      <Input
                        id="watermarkText"
                        placeholder="es. CONFIDENZIALE"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="watermarkOpacity">Opacità ({watermarkOpacity}%)</Label>
                      <Slider
                        id="watermarkOpacity"
                        min={5}
                        max={50}
                        step={5}
                        value={[watermarkOpacity]}
                        onValueChange={(value) => setWatermarkOpacity(value[0])}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={!watermarkText}
                      onClick={applyWatermark}
                    >
                      Applica filigrana
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties" className="p-4 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-medium">Informazioni documento</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome file:</span>
                        <span className="font-medium">{pdfFile?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensione:</span>
                        <span className="font-medium">
                          {pdfFile ? `${(pdfFile.size / 1024).toFixed(2)} KB` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{pdfFile?.type || '-'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Guida rapida</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        <strong>Filigrana:</strong> Aggiungi testo in filigrana al documento.
                      </p>
                      <p>
                        <strong>Nota:</strong> Questa versione semplificata supporta solo la funzionalità di filigrana
                        per garantire la massima compatibilità e stabilità.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {errorMessage && (
            <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}