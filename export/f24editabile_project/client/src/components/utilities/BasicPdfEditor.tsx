import React, { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { FilePlus, Save, X, FileText } from "lucide-react";

export default function BasicPdfEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkText, setWatermarkText] = useState("");
  
  const fileRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          toast({
            title: "Formato non supportato",
            description: "Seleziona un file PDF valido",
            variant: "destructive"
          });
          return;
        }
        
        setPdfFile(file);
        setIsLoading(true);
        setProgress(20);
        
        // Creiamo un URL immediato per l'anteprima
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        
        // Leggiamo il file come ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        setPdfBytes(bytes);
        
        setProgress(100);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Errore nel caricamento del PDF:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nel caricamento del PDF",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const addWatermark = async () => {
    if (!pdfBytes || !watermarkText) {
      toast({
        title: "Impossibile aggiungere filigrana",
        description: "Carica un PDF e inserisci il testo per la filigrana",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    
    try {
      // Carica il documento PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      setProgress(30);
      
      // Ottieni tutte le pagine
      const pages = pdfDoc.getPages();
      
      // Carica un font standard
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      setProgress(50);
      
      // Aggiungi filigrana a tutte le pagine
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 12;
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        
        // Posiziona al centro e in diagonale - utilizziamo la funzione degrees per la rotazione
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.7, 0.7, 0.7),
          opacity: 0.3,
          rotate: degrees(-45), // Ruota di 45° in senso orario
        });
        
        setProgress(50 + Math.round((i + 1) / pages.length * 40));
      });
      
      // Salva il documento modificato
      const modifiedPdfBytes = await pdfDoc.save();
      setPdfBytes(modifiedPdfBytes);
      
      // Aggiorna URL per anteprima
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl); // Pulisci la memoria
      const modifiedUrl = URL.createObjectURL(modifiedPdfBlob);
      setPdfUrl(modifiedUrl);
      
      setProgress(100);
      setIsLoading(false);
      
      toast({
        title: "Filigrana aggiunta",
        description: "La filigrana è stata applicata al documento"
      });
    } catch (error) {
      console.error("Errore nell'applicazione della filigrana:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'applicazione della filigrana",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const saveDocument = async () => {
    if (!pdfBytes) {
      toast({
        title: "Impossibile salvare",
        description: "Nessun documento da salvare",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setProgress(50);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile?.name?.replace('.pdf', '_modificato.pdf') || 'documento_modificato.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      setProgress(100);
      setIsLoading(false);
      
      toast({
        title: "Documento salvato",
        description: "Il PDF è stato salvato con successo"
      });
    } catch (error) {
      console.error("Errore nel salvataggio del PDF:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nel salvataggio del PDF",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const resetEditor = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(null);
    setPdfBytes(null);
    setPdfUrl(null);
    setWatermarkText("");
    if (fileRef.current) fileRef.current.value = '';
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Editor PDF Essenziale</h1>
          <p className="text-gray-600">Strumento semplice e affidabile per gestire i tuoi PDF</p>
        </div>
        
        {!pdfFile ? (
          <Button 
            onClick={() => fileRef.current?.click()}
            className="bg-black text-white hover:bg-gray-800"
          >
            <FilePlus className="h-4 w-4 mr-2" /> Carica PDF
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={saveDocument} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" /> Salva
            </Button>
            <Button variant="ghost" onClick={resetEditor} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <input
          type="file"
          ref={fileRef}
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
      {isLoading && (
        <div className="p-4 rounded-lg bg-gray-50 border">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p>Elaborazione in corso...</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {!pdfFile ? (
        <div 
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-10 text-center
            cursor-pointer transition duration-150
            hover:bg-gray-50 border-gray-300 hover:border-black"
        >
          <div className="text-4xl mb-3">📄</div>
          <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
          <p className="text-sm text-gray-500 mb-4">oppure fai clic per selezionare</p>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Seleziona PDF
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4 border rounded-lg p-4">
              <h2 className="font-medium">Strumenti disponibili</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="watermark">Aggiungi filigrana</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="watermark"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Testo filigrana"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={addWatermark} 
                      disabled={!watermarkText || isLoading}
                      variant="secondary"
                    >
                      Applica
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="font-medium mb-3">Dettagli documento</h2>
              <div className="bg-gray-50 rounded-lg p-4 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-medium truncate max-w-[180px]">{pdfFile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensione:</span>
                  <span className="font-medium">{Math.round(pdfFile?.size / 1024)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">Documento PDF</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden h-[500px] bg-gray-100">
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border-0" 
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Anteprima non disponibile</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}