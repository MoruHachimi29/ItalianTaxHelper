import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, Save, Trash, Loader2, FileText, Download, Upload, Info } from "lucide-react";

export default function UltraSimplePdfEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [watermarkText, setWatermarkText] = useState("");
  
  // Gestione file - nessuna dipendenza esterna
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.type === "application/pdf") {
        setPdfFile(file);
        // Crea un URL di preview per l'iframe
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast({
          title: "PDF caricato",
          description: `File "${file.name}" caricato correttamente`
        });
      } else {
        toast({
          title: "Errore",
          description: "Per favore seleziona un file PDF valido",
          variant: "destructive"
        });
      }
    }
  };
  
  // Reset dell'editor
  const resetEditor = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPdfFile(null);
    setPreviewUrl(null);
    setWatermarkText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Funzione di download 
  const downloadPdf = () => {
    if (!previewUrl) return;
    
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = pdfFile?.name?.replace(".pdf", "_editato.pdf") || "documento_editato.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download completato",
      description: "Il file PDF è stato scaricato con successo"
    });
  };
  
  // Puliamo le risorse quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">PDF Viewer Ultra</h1>
          <p className="text-gray-600">Visualizza e scarica i tuoi documenti PDF senza problemi</p>
        </div>
        
        <div className="flex gap-2">
          {!pdfFile ? (
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Upload className="h-4 w-4 mr-2" /> Carica PDF
            </Button>
          ) : (
            <>
              <Button variant="default" onClick={downloadPdf}>
                <Download className="h-4 w-4 mr-2" /> Scarica
              </Button>
              <Button variant="destructive" onClick={resetEditor}>
                <Trash className="h-4 w-4 mr-2" /> Elimina
              </Button>
            </>
          )}
        </div>
      </div>
      
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">Elaborazione in corso...</span>
        </div>
      )}
      
      {!pdfFile ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center
            hover:border-black cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              
              if (file.type === "application/pdf") {
                setPdfFile(file);
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                toast({
                  title: "PDF caricato",
                  description: `File "${file.name}" caricato correttamente`
                });
              } else {
                toast({
                  title: "Errore",
                  description: "Per favore seleziona un file PDF valido",
                  variant: "destructive"
                });
              }
            }
          }}
        >
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</h3>
          <p className="text-sm text-gray-500 mb-4">oppure clicca per selezionare</p>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Seleziona file PDF
          </Button>
          <div className="flex items-center justify-center mt-8">
            <Info className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-xs text-gray-500">
              Questa visualizzatore PDF ultra-leggero utilizza le funzionalità native del browser,
              garantendo la massima compatibilità e stabilità.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border p-4 rounded-md bg-gray-50 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <h3 className="font-medium">{pdfFile.name}</h3>
                <p className="text-sm text-gray-600">{(pdfFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadPdf}
              className="text-gray-500 hover:text-black"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden h-[600px] bg-gray-100 shadow-sm">
            {previewUrl ? (
              <iframe 
                src={previewUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Anteprima non disponibile</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 border rounded-lg text-sm text-gray-500">
            <Info className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <p>
              Questa è una versione base che utilizza le funzionalità native del browser per visualizzare i PDF.
              È ottimizzata per la velocità e l'affidabilità.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}