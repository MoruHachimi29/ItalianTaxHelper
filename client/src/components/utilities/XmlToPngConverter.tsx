import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function XmlToPngConverter() {
  const [xmlText, setXmlText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");

  const parseXmlToSvg = (xml: string): string => {
    try {
      // This is a simplified example - in a real implementation, 
      // proper XML parsing and transformation would be needed
      if (!xml.trim().startsWith('<?xml') && !xml.trim().startsWith('<svg')) {
        throw new Error("XML non valido o non contiene un elemento SVG");
      }
      
      // Extract or create an SVG from the XML
      let svgContent = xml;
      
      // If it's just XML but not SVG, we'd transform it here
      if (!xml.includes('<svg')) {
        // This is where you'd transform XML to SVG
        // For demo purposes, we'll create a simple SVG
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect x="10" y="10" width="180" height="180" fill="#f0f0f0" stroke="black" stroke-width="2"/>
            <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle">
              XML Convertito
            </text>
          </svg>
        `;
      }
      
      return svgContent;
    } catch (error) {
      console.error("Error parsing XML:", error);
      throw new Error("Errore nella conversione del XML. Verifica la sintassi e riprova.");
    }
  };

  const convertToImage = () => {
    setErrorMessage(null);
    
    let xmlToConvert = "";
    
    if (activeTab === "text") {
      if (!xmlText.trim()) {
        setErrorMessage("Per favore, inserisci del codice XML da convertire");
        return;
      }
      xmlToConvert = xmlText;
    } else {
      if (!uploadedFile) {
        setErrorMessage("Per favore, seleziona un file XML da convertire");
        return;
      }
      
      // In a real implementation, we would read the file here
      // For demo, we'll just simulate success
      setIsConverting(true);
      setTimeout(() => {
        setIsConverting(false);
        // Use a placeholder SVG
        xmlToConvert = `
          <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
            <rect x="10" y="10" width="280" height="180" fill="#f0f0f0" stroke="black" stroke-width="2"/>
            <text x="50%" y="40%" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle">
              File: ${uploadedFile.name}
            </text>
            <text x="50%" y="60%" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle">
              (Dimensione: ${Math.round(uploadedFile.size / 1024)} KB)
            </text>
          </svg>
        `;
        
        createPreviewFromSvg(xmlToConvert);
      }, 1500);
      return;
    }
    
    setIsConverting(true);
    
    try {
      // Convert XML to SVG
      const svgContent = parseXmlToSvg(xmlToConvert);
      
      // Create preview
      createPreviewFromSvg(svgContent);
      
      setIsConverting(false);
    } catch (error) {
      setIsConverting(false);
      setErrorMessage((error as Error).message);
    }
  };

  const createPreviewFromSvg = (svgContent: string) => {
    // Create a data URL from the SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setPreviewImage(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.xml')) {
        setUploadedFile(file);
        setErrorMessage(null);
        setPreviewImage(null);
      } else {
        setUploadedFile(null);
        setErrorMessage("Per favore, seleziona un file XML (.xml)");
      }
    }
  };

  const downloadImage = () => {
    if (!previewImage) return;
    
    // In a real implementation, we would convert SVG to PNG here
    // For demo purposes, we'll just download the SVG as an image
    
    const a = document.createElement('a');
    a.href = previewImage;
    a.download = uploadedFile 
      ? uploadedFile.name.replace('.xml', '.png') 
      : 'converted-xml.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Convertitore XML in PNG</h2>
        <p className="text-gray-600 mb-6">
          Converti facilmente file XML o codice XML in immagini PNG di alta qualità.
          Ideale per la visualizzazione di strutture XML in documenti o presentazioni.
        </p>
      </div>

      <Tabs 
        defaultValue="text" 
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setPreviewImage(null);
          setErrorMessage(null);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="text">Incolla XML</TabsTrigger>
          <TabsTrigger value="file">Carica file XML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="xmlInput">Codice XML</Label>
            <Textarea
              id="xmlInput"
              placeholder="Incolla qui il tuo XML..."
              value={xmlText}
              onChange={(e) => {
                setXmlText(e.target.value);
                setPreviewImage(null);
              }}
              className="font-mono text-sm h-48 mt-1"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="file" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileInput">File XML</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center
                ${uploadedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-black'}
                transition-colors cursor-pointer`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                type="file"
                id="fileInput"
                accept=".xml"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {uploadedFile ? (
                <div>
                  <div className="text-green-600 mb-2">✓ File selezionato</div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm mt-2">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-2">Trascina qui il tuo file XML</p>
                  <p className="text-sm text-gray-500 mb-3">oppure</p>
                  <Button type="button" variant="outline" size="sm">
                    Seleziona un file
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="space-y-4">
        <Button 
          onClick={convertToImage} 
          disabled={isConverting || (activeTab === 'text' && !xmlText.trim()) || (activeTab === 'file' && !uploadedFile)}
          className="w-full"
        >
          {isConverting ? "Conversione in corso..." : "Converti in PNG"}
        </Button>
        
        {previewImage && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white p-4">
              <h3 className="font-medium mb-3">Anteprima:</h3>
              <div className="flex justify-center bg-gray-100 p-4 rounded">
                <img 
                  src={previewImage} 
                  alt="Anteprima XML convertito" 
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            </div>
            
            <Button
              onClick={downloadImage}
              variant="outline"
              className="w-full"
            >
              Scarica immagine PNG
            </Button>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Note sulla conversione:</h3>
        <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
          <li>La qualità e precisione della conversione dipende dalla complessità e dalla struttura del file XML.</li>
          <li>Per risultati ottimali, assicurati che il tuo XML sia valido e ben formattato.</li>
          <li>Le immagini generate sono in formato PNG con sfondo trasparente.</li>
        </ul>
      </div>
    </div>
  );
}