import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Info, FileText, Settings, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [conversionComplete, setConversionComplete] = useState<boolean>(false);

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
      const formData = new FormData();
      formData.append('file', pdfFile);

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
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${pdfFile ? 'border-gray-800 bg-gray-50' : 'border-gray-300 hover:border-gray-600'}
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
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-800" />
            <p className="font-medium text-lg mb-1">{pdfFile.name}</p>
            <p className="text-sm text-gray-600 mb-3">
              {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <Button variant="outline" size="sm" onClick={() => {setPdfFile(null); setConversionComplete(false);}}>Cambia file</Button>
          </div>
        ) : (
          <div>
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
            <p className="text-sm text-gray-500 mb-4">oppure</p>
            <Button variant="outline">Seleziona un file</Button>
          </div>
        )}
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {pdfFile && (
        <div className="space-y-4">
          {isConverting ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Conversione in corso...</span>
                <span>{Math.round(conversionProgress)}%</span>
              </div>
              <Progress value={conversionProgress} className="h-2" />
            </div>
          ) : (
            <Button 
              onClick={handleConvert}
              disabled={!pdfFile || isConverting}
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Converti in Word
              </span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}