import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function P7mConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.name.toLowerCase().endsWith('.p7m')) {
        setFile(selectedFile);
        setErrorMessage(null);
        setConvertedFile(null);
      } else {
        setFile(null);
        setErrorMessage("Per favore, seleziona un file con estensione .p7m");
      }
    }
  };

  const handleConvert = () => {
    if (!file) {
      setErrorMessage("Per favore, seleziona un file da convertire");
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    // In a real implementation, this would send the file to the server for conversion
    // Instead, we'll just simulate a conversion delay
    setTimeout(() => {
      // Simulate conversion success
      const filename = file.name.replace('.p7m', '.pdf');
      setConvertedFile(filename);
      setIsConverting(false);
    }, 2000);
  };

  const handleDownload = () => {
    // In a real implementation, this would download the actual converted file
    alert("In una implementazione reale, questo scaricherebbe il file convertito.");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.name.toLowerCase().endsWith('.p7m')) {
        setFile(droppedFile);
        setErrorMessage(null);
        setConvertedFile(null);
      } else {
        setFile(null);
        setErrorMessage("Per favore, seleziona un file con estensione .p7m");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Convertitore P7M in PDF</h2>
        <p className="text-gray-600 mb-6">
          Converti facilmente file firmati digitalmente (.p7m) in formato PDF leggibile.
        </p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center
          ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-black'}
          transition-colors cursor-pointer`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          accept=".p7m"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {file ? (
          <div>
            <div className="text-green-600 mb-2">✓ File selezionato</div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm mt-2">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-2">Trascina qui il tuo file .p7m</p>
            <p className="text-sm text-gray-500 mb-3">oppure</p>
            <Button type="button" variant="outline" size="sm">
              Seleziona un file
            </Button>
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <Button 
        onClick={handleConvert} 
        disabled={!file || isConverting}
        className="w-full"
      >
        {isConverting ? "Conversione in corso..." : "Converti in PDF"}
      </Button>

      {convertedFile && (
        <div className="p-4 bg-gray-50 border rounded-md">
          <h3 className="font-medium mb-2">File convertito con successo!</h3>
          <p className="text-gray-600 mb-3">
            Il tuo file è pronto per essere scaricato come: <br />
            <span className="font-medium">{convertedFile}</span>
          </p>
          <Button 
            onClick={handleDownload}
            variant="outline" 
            className="w-full"
          >
            Scarica PDF
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Nota: Questo è un prototipo dimostrativo. In un'applicazione reale, 
            la conversione avverrebbe sul server e il file PDF verrebbe generato effettivamente.
          </p>
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Cos'è un file P7M?</h3>
        <p className="text-sm text-gray-600">
          Un file con estensione .p7m è un documento firmato digitalmente secondo lo standard PKCS#7/CAdES. 
          Questi file contengono sia il documento originale sia la firma digitale che ne certifica l'autenticità. 
          La conversione estrae il documento originale, rendendolo leggibile senza software specifici.
        </p>
      </div>
    </div>
  );
}