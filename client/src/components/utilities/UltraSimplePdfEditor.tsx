import React, { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, Save, Trash, Loader2 } from "lucide-react";

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
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Editor PDF Ultra Semplice</h1>
          <p className="text-gray-600">Visualizza e scarica i tuoi documenti PDF</p>
        </div>
        
        <div className="flex gap-2">
          {!pdfFile ? (
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white hover:bg-gray-800"
            >
              <FilePlus className="h-4 w-4 mr-2" /> Carica PDF
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={downloadPdf}>
                <Save className="h-4 w-4 mr-2" /> Salva
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
        >
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</h3>
          <p className="text-sm text-gray-500 mb-4">oppure clicca per selezionare</p>
          <Button variant="outline">Seleziona file PDF</Button>
          <p className="text-xs text-gray-500 mt-4">
            Versione ultraleggera - solo visualizzazione e download
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border p-3 rounded-md bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dettagli file</h3>
                <p className="text-sm text-gray-600">{pdfFile.name}</p>
              </div>
              <div className="text-sm text-gray-500">
                {(pdfFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden h-[600px] bg-gray-100">
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
          
          <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm text-gray-500 text-center">
              Nota: Questa è una versione ultra-leggera dell'editor PDF 
              pensata per eliminare problemi di compatibilità.
              Supporta solo la visualizzazione e il download di file PDF.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}