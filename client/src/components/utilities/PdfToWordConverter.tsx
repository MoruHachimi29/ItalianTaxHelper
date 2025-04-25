
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, FileText, Settings, Download, Upload } from "lucide-react";

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionComplete, setConversionComplete] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>("docx");
  const [conversionSettings, setConversionSettings] = useState({
    preserveFormatting: true,
    extractImages: true,
    detectTables: true,
    ocrEnabled: true,
    quality: "high"
  });

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

    try {
      setIsConverting(true);
      setConversionProgress(0);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('settings', JSON.stringify(conversionSettings));

      const response = await fetch('/api/convert-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Errore durante la conversione');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setIsConverting(false);
      setConversionComplete(true);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name.replace('.pdf', '.docx');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setErrorMessage("Si è verificato un errore durante la conversione");
      setIsConverting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Convertitore PDF Professionale</h2>
        </div>
        
        <div className="text-gray-600 space-y-2 mb-6">
          <p className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Converti i tuoi documenti PDF in file Word mantenendo la formattazione originale
          </p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${pdfFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}
            ${isConverting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isConverting && document.getElementById('pdfInput')?.click()}
        >
          <input
            type="file"
            id="pdfInput"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isConverting}
          />
          
          {pdfFile ? (
            <div>
              <div className="text-blue-600 text-4xl mb-2">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <p className="font-medium text-lg mb-1">{pdfFile.name}</p>
              <p className="text-sm text-gray-600 mb-3">
                {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {!isConverting && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPdfFile(null);
                    setConversionComplete(false);
                  }}
                >
                  Cambia file
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
              <p className="text-sm text-gray-500 mb-4">oppure</p>
              <Button variant="outline">
                Seleziona un file
              </Button>
            </div>
          )}
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {pdfFile && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="outputFormat">Formato di output</Label>
                  <Select
                    value={outputFormat}
                    onValueChange={setOutputFormat}
                  >
                    <SelectTrigger id="outputFormat">
                      <SelectValue placeholder="Seleziona formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="docx">Word (.docx)</SelectItem>
                      <SelectItem value="doc">Word 97-2003 (.doc)</SelectItem>
                      <SelectItem value="rtf">Rich Text Format (.rtf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Qualità di conversione</Label>
                  <Select
                    value={conversionSettings.quality}
                    onValueChange={(val) => setConversionSettings(prev => ({...prev, quality: val}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona qualità" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta (ottimale per documenti complessi)</SelectItem>
                      <SelectItem value="medium">Media (bilanciata)</SelectItem>
                      <SelectItem value="low">Bassa (conversione rapida)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Impostazioni avanzate
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preserveFormatting"
                      checked={conversionSettings.preserveFormatting}
                      onCheckedChange={(checked) => 
                        setConversionSettings(prev => ({...prev, preserveFormatting: checked as boolean}))}
                    />
                    <Label htmlFor="preserveFormatting">Mantieni formattazione originale</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="extractImages"
                      checked={conversionSettings.extractImages}
                      onCheckedChange={(checked) => 
                        setConversionSettings(prev => ({...prev, extractImages: checked as boolean}))}
                    />
                    <Label htmlFor="extractImages">Estrai e preserva le immagini</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="detectTables"
                      checked={conversionSettings.detectTables}
                      onCheckedChange={(checked) => 
                        setConversionSettings(prev => ({...prev, detectTables: checked as boolean}))}
                    />
                    <Label htmlFor="detectTables">Rileva e converti tabelle</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ocrEnabled"
                      checked={conversionSettings.ocrEnabled}
                      onCheckedChange={(checked) => 
                        setConversionSettings(prev => ({...prev, ocrEnabled: checked as boolean}))}
                    />
                    <Label htmlFor="ocrEnabled">Abilita OCR per testo non selezionabile</Label>
                  </div>
                </div>
              </div>
            </div>

            {isConverting ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Conversione in corso...</span>
                  <span>{Math.round(conversionProgress)}%</span>
                </div>
                <Progress value={conversionProgress} className="h-2" />
                <p className="text-xs text-gray-500 text-center">
                  {conversionProgress < 100 
                    ? "Elaborazione del documento in corso..." 
                    : "Finalizzazione della conversione..."}
                </p>
              </div>
            ) : (
              <Button 
                onClick={handleConvert}
                disabled={!pdfFile || isConverting}
                className="w-full"
              >
                {isConverting ? (
                  "Conversione in corso..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Converti in {outputFormat.toUpperCase()}
                  </span>
                )}
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Caratteristiche Premium:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              Conversione ad alta fedeltà
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              Supporto per documenti complessi
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              Mantenimento di stili e layout
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              OCR avanzato integrato
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              Conversione batch disponibile
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <span className="text-green-600">✓</span>
              Supporto multilingua
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
