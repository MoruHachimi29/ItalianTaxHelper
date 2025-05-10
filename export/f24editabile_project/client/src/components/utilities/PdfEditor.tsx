import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EditingOperation = {
  type: 'text' | 'image' | 'shape' | 'delete' | 'rotate' | 'watermark';
  description: string;
};

export default function PdfEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<string>("text");
  const [editingOperations, setEditingOperations] = useState<EditingOperation[]>([]);
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [textToAdd, setTextToAdd] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textPosition, setTextPosition] = useState<string>("top-left");
  const [rotationAngle, setRotationAngle] = useState<string>("90");
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setPdfFile(file);
        setErrorMessage(null);
        
        // Simulate PDF processing and preview generation
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setTotalPages(Math.floor(Math.random() * 10) + 1); // Random page count for demo
          setPreviewUrl('/placeholder-pdf.png'); // In a real app, we'd generate a preview
        }, 1500);
      } else {
        setPdfFile(null);
        setPreviewUrl(null);
        setErrorMessage("Per favore, seleziona un file PDF (.pdf)");
      }
    }
  };

  const addEditingOperation = (type: EditingOperation['type']) => {
    let description = '';
    
    switch (type) {
      case 'text':
        description = `Aggiunto testo "${textToAdd.substring(0, 15)}${textToAdd.length > 15 ? '...' : ''}" in posizione ${textPosition}`;
        break;
      case 'image':
        description = 'Aggiunta immagine nella pagina corrente';
        break;
      case 'shape':
        description = 'Aggiunta forma nella pagina corrente';
        break;
      case 'delete':
        description = `Eliminata pagina ${currentPage}`;
        break;
      case 'rotate':
        description = `Ruotata pagina ${currentPage} di ${rotationAngle} gradi`;
        break;
      case 'watermark':
        description = `Aggiunta filigrana "${watermarkText.substring(0, 15)}${watermarkText.length > 15 ? '...' : ''}" a tutte le pagine`;
        break;
      default:
        description = 'Operazione non specificata';
    }
    
    const newOperation: EditingOperation = { type, description };
    setEditingOperations([...editingOperations, newOperation]);
    
    // Simulate processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  };

  const removeOperation = (index: number) => {
    const newOperations = [...editingOperations];
    newOperations.splice(index, 1);
    setEditingOperations(newOperations);
  };

  const handleSavePdf = () => {
    if (!pdfFile) return;
    
    // Simulate saving with loading state
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      // Trigger a fake download
      const a = document.createElement('a');
      a.href = '#';
      a.download = pdfFile.name.replace('.pdf', '_modificato.pdf');
      a.click();
      
      // Reset operations after saving
      setEditingOperations([]);
    }, 2000);
  };

  const positionOptions = [
    { value: "top-left", label: "In alto a sinistra" },
    { value: "top-center", label: "In alto al centro" },
    { value: "top-right", label: "In alto a destra" },
    { value: "center-left", label: "Al centro a sinistra" },
    { value: "center", label: "Al centro" },
    { value: "center-right", label: "Al centro a destra" },
    { value: "bottom-left", label: "In basso a sinistra" },
    { value: "bottom-center", label: "In basso al centro" },
    { value: "bottom-right", label: "In basso a destra" },
  ];

  const rotationAngles = [
    { value: "90", label: "90 gradi" },
    { value: "180", label: "180 gradi" },
    { value: "270", label: "270 gradi" },
  ];

  const compressionOptions = [
    { value: "low", label: "Bassa (Qualità migliore, file più grande)" },
    { value: "medium", label: "Media (Bilanciata)" },
    { value: "high", label: "Alta (Qualità inferiore, file più piccolo)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Editor PDF</h2>
        <p className="text-gray-600 mb-6">
          Modifica facilmente i tuoi file PDF: aggiungi testo, immagini, forme, ruota pagine,
          aggiungi filigrane e molto altro.
        </p>
      </div>

      {!pdfFile ? (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center
            border-gray-300 hover:border-black
            transition-colors cursor-pointer"
          onClick={() => document.getElementById('pdfFileInput')?.click()}
        >
          <input
            type="file"
            id="pdfFileInput"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg font-medium mb-2">Trascina qui il tuo file PDF</p>
          <p className="text-sm text-gray-500 mb-4">oppure</p>
          <Button type="button" variant="outline">
            Seleziona un file PDF
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PDF Preview and Page Navigation */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Anteprima:</h3>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  ← Precedente
                </Button>
                <span className="text-sm">
                  Pagina {currentPage} di {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Successiva →
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-md min-h-64 flex justify-center items-center p-4">
              {isProcessing ? (
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full inline-block mb-2"></div>
                  <p>Elaborazione in corso...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-3">📄</div>
                  <p className="text-gray-600">{pdfFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Pagina {currentPage} • {totalPages} pagine totali
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Editing Tools */}
          <div className="space-y-4">
            <Tabs 
              value={editingMode} 
              onValueChange={setEditingMode}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
                <TabsTrigger value="text">Testo</TabsTrigger>
                <TabsTrigger value="rotate">Ruota</TabsTrigger>
                <TabsTrigger value="watermark">Filigrana</TabsTrigger>
                <TabsTrigger value="delete">Elimina</TabsTrigger>
                <TabsTrigger value="compress">Comprimi</TabsTrigger>
                <TabsTrigger value="merge">Unisci</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="textToAdd">Testo da aggiungere</Label>
                  <Textarea
                    id="textToAdd"
                    placeholder="Inserisci il testo..."
                    value={textToAdd}
                    onChange={(e) => setTextToAdd(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="textPosition">Posizione</Label>
                    <Select
                      value={textPosition}
                      onValueChange={setTextPosition}
                    >
                      <SelectTrigger id="textPosition" className="mt-1">
                        <SelectValue placeholder="Seleziona posizione" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="textColor">Colore</Label>
                    <div className="flex mt-1">
                      <Input
                        type="color"
                        id="textColor"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => addEditingOperation('text')}
                  disabled={textToAdd.trim() === '' || isProcessing}
                  className="w-full"
                >
                  Aggiungi testo
                </Button>
              </TabsContent>
              
              <TabsContent value="rotate" className="space-y-4">
                <div>
                  <Label htmlFor="rotationAngle">Angolo di rotazione</Label>
                  <Select
                    value={rotationAngle}
                    onValueChange={setRotationAngle}
                  >
                    <SelectTrigger id="rotationAngle" className="mt-1">
                      <SelectValue placeholder="Seleziona angolo" />
                    </SelectTrigger>
                    <SelectContent>
                      {rotationAngles.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="allPages" />
                  <Label htmlFor="allPages" className="cursor-pointer">
                    Applica a tutte le pagine
                  </Label>
                </div>
                
                <Button 
                  onClick={() => addEditingOperation('rotate')}
                  disabled={isProcessing}
                  className="w-full"
                >
                  Ruota pagina
                </Button>
              </TabsContent>
              
              <TabsContent value="watermark" className="space-y-4">
                <div>
                  <Label htmlFor="watermarkText">Testo filigrana</Label>
                  <Input
                    id="watermarkText"
                    placeholder="es. CONFIDENZIALE, BOZZA, ecc."
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="watermarkColor">Colore</Label>
                    <div className="flex mt-1">
                      <Input
                        type="color"
                        id="watermarkColor"
                        value="#CCCCCC"
                        className="w-12 p-1 h-10"
                      />
                      <Input
                        type="text"
                        value="#CCCCCC"
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="watermarkOpacity">Opacità</Label>
                    <Input
                      id="watermarkOpacity"
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      defaultValue="30"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => addEditingOperation('watermark')}
                  disabled={watermarkText.trim() === '' || isProcessing}
                  className="w-full"
                >
                  Aggiungi filigrana
                </Button>
              </TabsContent>
              
              <TabsContent value="delete" className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600 mb-4">
                  <p className="font-medium">Attenzione:</p>
                  <p className="text-sm">L'eliminazione di pagine è un'operazione irreversibile.</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmDelete" />
                  <Label htmlFor="confirmDelete" className="cursor-pointer">
                    Confermo di voler eliminare la pagina {currentPage}
                  </Label>
                </div>
                
                <Button 
                  onClick={() => addEditingOperation('delete')}
                  disabled={isProcessing}
                  variant="destructive"
                  className="w-full"
                >
                  Elimina pagina corrente
                </Button>
              </TabsContent>
              
              <TabsContent value="compress" className="space-y-4">
                <div>
                  <Label htmlFor="compressionLevel">Livello di compressione</Label>
                  <Select
                    value={compressionLevel}
                    onValueChange={setCompressionLevel}
                  >
                    <SelectTrigger id="compressionLevel" className="mt-1">
                      <SelectValue placeholder="Seleziona livello" />
                    </SelectTrigger>
                    <SelectContent>
                      {compressionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setIsProcessing(false);
                      setEditingOperations([...editingOperations, {
                        type: 'text',
                        description: `PDF compresso con livello ${
                          compressionOptions.find(o => o.value === compressionLevel)?.label.toLowerCase() || compressionLevel
                        }`
                      }]);
                    }, 1500);
                  }}
                  disabled={isProcessing}
                  className="w-full"
                >
                  Comprimi PDF
                </Button>
              </TabsContent>
              
              <TabsContent value="merge" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center border-gray-300">
                  <p className="mb-2">Seleziona un altro PDF da unire</p>
                  <Button type="button" variant="outline" size="sm">
                    Seleziona PDF
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex-1 text-center py-2 px-4 bg-gray-100 rounded-md">
                    {pdfFile.name}
                  </div>
                  <div className="text-xl">+</div>
                  <div className="flex-1 text-center py-2 px-4 bg-gray-100 rounded-md text-gray-400">
                    Nessun file selezionato
                  </div>
                </div>
                
                <Button 
                  disabled={true}
                  className="w-full"
                >
                  Unisci PDF
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Operations Log */}
          {editingOperations.length > 0 && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Operazioni ({editingOperations.length})</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {editingOperations.map((op, index) => (
                  <li key={index} className="flex justify-between items-center text-sm border-b pb-2">
                    <span>{op.description}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeOperation(index)}
                    >
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 space-x-2 flex">
                <Button 
                  onClick={handleSavePdf}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? "Elaborazione..." : "Salva PDF modificato"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setEditingOperations([])}
                  disabled={isProcessing}
                >
                  Annulla tutto
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Funzionalità disponibili:</h3>
        <ul className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <li className="flex items-center">✓ Aggiunta di testo</li>
          <li className="flex items-center">✓ Rotazione delle pagine</li>
          <li className="flex items-center">✓ Filigrane personalizzate</li>
          <li className="flex items-center">✓ Eliminazione di pagine</li>
          <li className="flex items-center">✓ Compressione del PDF</li>
          <li className="flex items-center">✓ Unione di più PDF</li>
        </ul>
      </div>
    </div>
  );
}