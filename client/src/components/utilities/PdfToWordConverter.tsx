import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionComplete, setConversionComplete] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>("docx");
  const [keepFormatting, setKeepFormatting] = useState<boolean>(true);
  const [extractImages, setExtractImages] = useState<boolean>(true);
  const [conversionQuality, setConversionQuality] = useState<string>("high");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setPdfFile(file);
        setErrorMessage(null);
        setConversionComplete(false);
        setConversionProgress(0);
      } else {
        setPdfFile(null);
        setErrorMessage("Per favore, seleziona un file PDF (.pdf)");
      }
    }
  };

  const handleConvert = () => {
    if (!pdfFile) {
      setErrorMessage("Per favore, seleziona un file PDF da convertire");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setErrorMessage(null);
    
    // Simulate the conversion process with a progress bar
    const interval = setInterval(() => {
      setConversionProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsConverting(false);
            setConversionComplete(true);
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  const handleDownload = () => {
    if (!pdfFile || !conversionComplete) return;
    
    // In a real app, we'd provide a link to the converted file
    // For demo, we'll just simulate a download
    
    const fileFormat = outputFormat === "docx" ? "docx" : "doc";
    const a = document.createElement('a');
    a.href = '#';
    a.download = pdfFile.name.replace('.pdf', `.${fileFormat}`);
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Convertitore da PDF a Word</h2>
        <p className="text-gray-600 mb-6">
          Converti facilmente i tuoi documenti PDF in file Word editabili.
          Mantiene la formattazione, le immagini e la struttura del documento originale.
        </p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center
          ${pdfFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-black'}
          transition-colors cursor-pointer`}
        onClick={() => document.getElementById('pdfInput')?.click()}
      >
        <input
          type="file"
          id="pdfInput"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {pdfFile ? (
          <div>
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <p className="font-medium mb-1">{pdfFile.name}</p>
            <p className="text-sm text-gray-600 mb-3">
              {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setPdfFile(null);
                setConversionComplete(false);
                setConversionProgress(0);
              }}
            >
              Cambia file
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
            <p className="text-sm text-gray-500 mb-4">oppure</p>
            <Button type="button" variant="outline">
              Seleziona un file PDF
            </Button>
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      {pdfFile && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="outputFormat">Formato di output</Label>
                <Select
                  value={outputFormat}
                  onValueChange={setOutputFormat}
                >
                  <SelectTrigger id="outputFormat" className="mt-1">
                    <SelectValue placeholder="Seleziona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">Word (.docx)</SelectItem>
                    <SelectItem value="doc">Word 97-2003 (.doc)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Il formato .docx è consigliato per la massima compatibilità con le versioni moderne di Microsoft Word.
                </p>
              </div>
              
              <div>
                <Label htmlFor="conversionQuality">Qualità di conversione</Label>
                <Select
                  value={conversionQuality}
                  onValueChange={setConversionQuality}
                >
                  <SelectTrigger id="conversionQuality" className="mt-1">
                    <SelectValue placeholder="Seleziona qualità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta (più lenta)</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Bassa (più veloce)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Opzioni</Label>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="keepFormatting" 
                      checked={keepFormatting}
                      onCheckedChange={(checked) => setKeepFormatting(!!checked)}
                    />
                    <Label htmlFor="keepFormatting" className="cursor-pointer">
                      Mantieni formattazione originale
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="extractImages" 
                      checked={extractImages}
                      onCheckedChange={(checked) => setExtractImages(!!checked)}
                    />
                    <Label htmlFor="extractImages" className="cursor-pointer">
                      Estrai e preserva le immagini
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preserveTables"
                      defaultChecked
                    />
                    <Label htmlFor="preserveTables" className="cursor-pointer">
                      Preserva tabelle e layout
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ocrOption"
                      defaultChecked
                    />
                    <Label htmlFor="ocrOption" className="cursor-pointer">
                      Utilizza OCR per testo non selezionabile
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {isConverting ? (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Conversione in corso...</Label>
              <Progress value={conversionProgress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
                {conversionProgress < 100 
                  ? `${Math.round(conversionProgress)}% completato` 
                  : "Finalizzazione..."}
              </p>
            </div>
          ) : conversionComplete ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-center">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <p className="font-medium">Conversione completata con successo!</p>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Il tuo file è pronto per essere scaricato.
              </p>
              <Button 
                onClick={handleDownload}
                className="w-full"
              >
                Scarica file {outputFormat.toUpperCase()}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleConvert}
              disabled={!pdfFile}
              className="w-full"
            >
              Converti in {outputFormat.toUpperCase()}
            </Button>
          )}
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Vantaggi della conversione:</h3>
        <ul className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Documento completamente editabile in Microsoft Word</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Preserva formattazione, stili e layout originali</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Estrae e mantiene immagini in alta qualità</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Riconosce testo tramite OCR anche in PDF scansionati</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Supporta documenti multilingua</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-600">✓</span>
            <span>Nessun limite di dimensione dei file</span>
          </li>
        </ul>
      </div>
    </div>
  );
}