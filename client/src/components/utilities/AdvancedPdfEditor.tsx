import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import * as fabric from 'fabric';
import { 
  SquarePen, Type, ImagePlus, Eraser, RotateCw, 
  FileText, Download, Undo, Redo, Scissors,
  Highlighter, Pencil, Circle, Square, 
  FilePlus, X, Save, PanelLeft, PanelRight, Search
} from "lucide-react";

// Configurazione del worker PDF.js usando la versione minificata più recente che abbiamo scaricato
// Questo garantisce che il worker corrisponda esattamente alla versione della libreria
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

type AnnotationTool = 
  | 'text' 
  | 'draw' 
  | 'highlight' 
  | 'stamp' 
  | 'image' 
  | 'shape' 
  | 'signature'
  | 'erase';

type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow';

type EditingOperation = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'delete' | 'rotate' | 'watermark' | 'annotate' | 'highlight';
  description: string;
  timestamp: number;
};

export default function AdvancedPdfEditor() {
  // File e rendering
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  
  // Stati UI
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("annotate");
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Tracking operazioni
  const [editingOperations, setEditingOperations] = useState<EditingOperation[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Riferimenti Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  // Strumenti di annotazione
  const [activeTool, setActiveTool] = useState<AnnotationTool | null>(null);
  const [inkColor, setInkColor] = useState<string>("#000000");
  const [inkWidth, setInkWidth] = useState<number>(2);
  const [opacity, setOpacity] = useState<number>(100);
  const [textContent, setTextContent] = useState<string>("");
  const [textSize, setTextSize] = useState<number>(16);
  const [textFont, setTextFont] = useState<string>("Arial");
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  
  // Watermark e trasformazioni
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(30);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  
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
              
              // Reset editor state
              setCurrentPage(1);
              setRotation(0);
              setScale(1.0);
              setEditingOperations([]);
              setHistoryIndex(-1);
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

  // Gestione documento PDF
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    initCanvas();
  };
  
  // Inizializzazione del canvas Fabric
  const initCanvas = () => {
    if (!canvasRef.current) return;
    
    // Se esiste già un canvas fabric, distruggilo
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    // Crea un nuovo canvas fabric
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
    });
    
    fabricCanvasRef.current = fabricCanvas;
    
    // Imposta le dimensioni del canvas
    updateCanvasSize();
    
    // Attiva il tool di disegno se necessario
    if (activeTool === 'draw') {
      fabricCanvas.isDrawingMode = true;
      const brush = fabricCanvas.freeDrawingBrush;
      if (brush) {
        brush.color = inkColor;
        brush.width = inkWidth;
      }
    }
  };
  
  // Aggiorna le dimensioni del canvas
  const updateCanvasSize = () => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    
    const pageContainer = document.querySelector('.react-pdf__Page');
    if (pageContainer) {
      const { width, height } = pageContainer.getBoundingClientRect();
      fabricCanvasRef.current.setWidth(width);
      fabricCanvasRef.current.setHeight(height);
    }
  };
  
  // Effetto per aggiornare il canvas quando cambia la pagina o lo strumento attivo
  useEffect(() => {
    // Reinizializza il canvas quando cambia la pagina corrente
    if (pdfUrl && currentPage > 0) {
      // Utilizziamo requestAnimationFrame per sincronizzarci con il ciclo di rendering
      requestAnimationFrame(() => {
        initCanvas();
      });
    }
  }, [currentPage, pdfUrl]);
  
  // Gestione strumenti di annotazione
  const setTool = (tool: AnnotationTool) => {
    setActiveTool(tool);
    
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Reset dello stato del canvas
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    switch (tool) {
      case 'draw':
        canvas.isDrawingMode = true;
        const brush = canvas.freeDrawingBrush;
        if (brush) {
          brush.color = inkColor;
          brush.width = inkWidth;
        }
        break;
      case 'erase':
        // Attiva modalità di selezione per cancellare oggetti
        canvas.selection = true;
        break;
      case 'text':
        addTextAnnotation();
        break;
      case 'highlight':
        canvas.isDrawingMode = true;
        const highlightBrush = canvas.freeDrawingBrush;
        if (highlightBrush) {
          highlightBrush.color = 'rgba(255, 255, 0, 0.4)';  // Giallo semi-trasparente
          highlightBrush.width = 20;
        }
        break;
      case 'shape':
        addShape();
        break;
      case 'image':
        // Trigger file input
        document.getElementById('imageFileInput')?.click();
        break;
      case 'signature':
        startSignatureMode();
        break;
    }
    
    addOperation({
      type: 'annotate',
      description: `Attivato strumento: ${tool}`
    });
  };
  
  // Aggiunta di operazioni alla cronologia
  const addOperation = ({ type, description }: { type: EditingOperation['type'], description: string }) => {
    const newOperation: EditingOperation = { 
      id: Math.random().toString(36).substring(2, 9),
      type, 
      description,
      timestamp: Date.now()
    };
    
    // Tronca la cronologia se abbiamo fatto annullamenti e ora aggiungiamo una nuova operazione
    const newOperations = editingOperations.slice(0, historyIndex + 1).concat(newOperation);
    setEditingOperations(newOperations);
    setHistoryIndex(newOperations.length - 1);
  };
  
  // Annulla/Ripristina
  const undo = () => {
    if (historyIndex > -1) {
      setHistoryIndex(historyIndex - 1);
      // Qui si dovrebbe rimuovere l'ultimo oggetto aggiunto al canvas
      if (fabricCanvasRef.current) {
        const objects = fabricCanvasRef.current.getObjects();
        if (objects.length > 0) {
          fabricCanvasRef.current.remove(objects[objects.length - 1]);
        }
      }
    }
  };
  
  const redo = () => {
    if (historyIndex < editingOperations.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Qui si dovrebbe reapplicare l'operazione annullata
      // Questa è una logica semplificata, in realtà si dovrebbe memorizzare lo stato completo
    }
  };
  
  // Funzioni per le diverse operazioni
  const addTextAnnotation = () => {
    if (!fabricCanvasRef.current) return;
    
    const text = new fabric.IText('Clicca per modificare', {
      left: 100,
      top: 100,
      fontFamily: textFont,
      fontSize: textSize,
      fill: inkColor,
      opacity: opacity / 100
    });
    
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    
    addOperation({
      type: 'text',
      description: 'Aggiunto testo'
    });
  };
  
  const addShape = () => {
    if (!fabricCanvasRef.current) return;
    
    let shape;
    
    switch (selectedShape) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 50,
          fill: 'transparent',
          stroke: inkColor,
          strokeWidth: inkWidth,
          opacity: opacity / 100
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: 'transparent',
          stroke: inkColor,
          strokeWidth: inkWidth,
          opacity: opacity / 100
        });
        break;
      case 'line':
        shape = new fabric.Line([50, 100, 200, 100], {
          stroke: inkColor,
          strokeWidth: inkWidth,
          opacity: opacity / 100
        });
        break;
      case 'arrow':
        // Freccia (combinazione di linea e triangolo)
        const line = new fabric.Line([50, 100, 200, 100], {
          stroke: inkColor,
          strokeWidth: inkWidth,
          opacity: opacity / 100
        });
        
        const triangle = new fabric.Triangle({
          left: 200 - 15,
          top: 100 - 10,
          width: 20,
          height: 20,
          fill: inkColor,
          opacity: opacity / 100,
          angle: 90
        });
        
        shape = new fabric.Group([line, triangle]);
        break;
    }
    
    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      
      addOperation({
        type: 'shape',
        description: `Aggiunta forma: ${selectedShape}`
      });
    }
  };
  
  const addImageAnnotation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvasRef.current || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || !fabricCanvasRef.current) return;
      
      const imgObj = new Image();
      imgObj.src = event.target.result as string;
      
      imgObj.onload = () => {
        const image = new fabric.Image(imgObj, {
          left: 100,
          top: 100,
          opacity: opacity / 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        
        fabricCanvasRef.current?.add(image);
        fabricCanvasRef.current?.setActiveObject(image);
        
        addOperation({
          type: 'image',
          description: `Aggiunta immagine: ${file.name}`
        });
      };
    };
    
    reader.readAsDataURL(file);
  };
  
  const deleteSelectedObjects = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      addOperation({
        type: 'delete',
        description: 'Eliminato oggetto selezionato'
      });
    }
  };
  
  const startSignatureMode = () => {
    if (!fabricCanvasRef.current) return;
    
    // Attiva modalità disegno con impostazioni per firma
    fabricCanvasRef.current.isDrawingMode = true;
    const brush = fabricCanvasRef.current.freeDrawingBrush;
    if (brush) {
      brush.color = inkColor;
      brush.width = 2; // Linea sottile per firme
    }
    
    // Avviso per l'utente
    toast({
      title: "Modalità firma attivata",
      description: "Disegna la tua firma sul documento",
      duration: 3000
    });
  };
  
  // Funzioni di rotazione e trasformazione
  const rotatePage = (angle: number) => {
    setRotation((prev) => (prev + angle) % 360);
    
    addOperation({
      type: 'rotate',
      description: `Ruotata pagina di ${angle}°`
    });
  };
  
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
      
      addOperation({
        type: 'watermark',
        description: `Aggiunta filigrana: "${watermarkText}"`
      });
      
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error('Errore nell\'applicazione della filigrana:', error);
      setErrorMessage("Si è verificato un errore nell'applicazione della filigrana.");
      setIsProcessing(false);
    }
  };
  
  // Salvataggio del documento - ottimizzato
  const saveDocument = async () => {
    if (!pdfBytes) return;
    
    // In un'implementazione reale, qui dovresti combinare le modifiche del canvas fabric
    // con il pdf-lib per creare un nuovo PDF con le annotazioni
    
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
    }
  };
  
  // Componenti UI
  const ToolbarButton = ({ icon: Icon, label, active, onClick }: { 
    icon: any, 
    label: string, 
    active?: boolean, 
    onClick: () => void 
  }) => (
    <Button
      variant={active ? "default" : "ghost"}
      className={`flex flex-col items-center justify-center h-16 p-1 ${active ? 'bg-black text-white' : ''}`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs">{label}</span>
    </Button>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Editor PDF Avanzato</h2>
          <p className="text-gray-600">
            Modifica, annota e trasforma i tuoi PDF con strumenti professionali.
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
                setCurrentPage(1);
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
      
      <input
        type="file"
        id="imageFileInput"
        accept="image/*"
        className="hidden"
        onChange={addImageAnnotation}
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
            Supporta annotazioni, evidenziazioni, firme, testo, forme e molto altro.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Barra degli strumenti principale */}
          <div className="flex justify-between items-center bg-gray-100 p-1 rounded-lg">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
              
              <div className="flex items-center px-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-12 h-8 text-center border rounded-md"
                />
                <span className="mx-2">di {numPages}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={scale.toString()}
                onValueChange={(value) => setScale(parseFloat(value))}
              >
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Zoom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">50%</SelectItem>
                  <SelectItem value="0.75">75%</SelectItem>
                  <SelectItem value="1">100%</SelectItem>
                  <SelectItem value="1.25">125%</SelectItem>
                  <SelectItem value="1.5">150%</SelectItem>
                  <SelectItem value="2">200%</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon" onClick={() => rotatePage(90)}>
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Contenitore principale con editor e sidebar */}
          <div className="flex border rounded-lg overflow-hidden">
            {/* Toolbar verticale (strumenti di annotazione) */}
            {showToolbar && (
              <div className="w-20 border-r bg-gray-50 flex flex-col items-center py-2 space-y-1">
                <ToolbarButton 
                  icon={Type} 
                  label="Testo" 
                  active={activeTool === 'text'} 
                  onClick={() => setTool('text')} 
                />
                <ToolbarButton 
                  icon={Pencil} 
                  label="Disegno" 
                  active={activeTool === 'draw'} 
                  onClick={() => setTool('draw')} 
                />
                <ToolbarButton 
                  icon={Highlighter} 
                  label="Evidenzia" 
                  active={activeTool === 'highlight'} 
                  onClick={() => setTool('highlight')} 
                />
                <ToolbarButton 
                  icon={Square} 
                  label="Forma" 
                  active={activeTool === 'shape'} 
                  onClick={() => setTool('shape')} 
                />
                <ToolbarButton 
                  icon={ImagePlus} 
                  label="Immagine" 
                  active={activeTool === 'image'} 
                  onClick={() => setTool('image')} 
                />
                <ToolbarButton 
                  icon={SquarePen} 
                  label="Firma" 
                  active={activeTool === 'signature'} 
                  onClick={() => setTool('signature')} 
                />
                <ToolbarButton 
                  icon={Eraser} 
                  label="Cancella" 
                  active={activeTool === 'erase'} 
                  onClick={() => setTool('erase')} 
                />
                <div className="mt-auto">
                  <ToolbarButton 
                    icon={Undo} 
                    label="Annulla" 
                    onClick={undo} 
                  />
                  <ToolbarButton 
                    icon={Redo} 
                    label="Ripeti" 
                    onClick={redo} 
                  />
                </div>
              </div>
            )}
            
            {/* Area centrale con il documento PDF e canvas di annotazione sovrapposto */}
            <div className="flex-1 relative overflow-auto bg-gray-200 p-4">
              {isProcessing && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
                  <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                  <p className="text-lg font-medium mb-2">Elaborazione in corso...</p>
                  <Progress value={progress} className="w-64 h-2" />
                </div>
              )}
              
              {pdfUrl && (
                <div className="relative">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex justify-center"
                    loading={
                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                        <p>Caricamento documento...</p>
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={currentPage}
                      scale={scale}
                      rotate={rotation}
                      className="shadow-lg"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                  
                  {/* Canvas di annotazione sovrapposto alla pagina PDF */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 right-0 mx-auto pointer-events-auto z-10"
                  />
                </div>
              )}
            </div>
            
            {/* Sidebar destra (proprietà e impostazioni) */}
            {showSidebar && (
              <div className="w-72 border-l bg-white overflow-y-auto">
                <Tabs defaultValue="annotate" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 p-1 m-2">
                    <TabsTrigger value="annotate">Strumenti</TabsTrigger>
                    <TabsTrigger value="properties">Proprietà</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="annotate" className="p-4 space-y-4">
                    {activeTool === 'text' && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Proprietà testo</h3>
                        <div>
                          <Label htmlFor="textContent">Testo</Label>
                          <Textarea
                            id="textContent"
                            placeholder="Inserisci il testo..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="textFont">Font</Label>
                          <Select
                            value={textFont}
                            onValueChange={setTextFont}
                          >
                            <SelectTrigger id="textFont" className="mt-1">
                              <SelectValue placeholder="Seleziona font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                              <SelectItem value="Courier New">Courier New</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Verdana">Verdana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="textSize">Dimensione ({textSize}pt)</Label>
                          <Slider
                            id="textSize"
                            min={8}
                            max={72}
                            step={1}
                            value={[textSize]}
                            onValueChange={(value) => setTextSize(value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeTool === 'draw' && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Proprietà pennello</h3>
                        <div>
                          <Label htmlFor="inkWidth">Spessore ({inkWidth}px)</Label>
                          <Slider
                            id="inkWidth"
                            min={1}
                            max={20}
                            step={1}
                            value={[inkWidth]}
                            onValueChange={(value) => setInkWidth(value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeTool === 'shape' && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Proprietà forma</h3>
                        <div>
                          <Label htmlFor="shapeType">Tipo</Label>
                          <Select
                            value={selectedShape}
                            onValueChange={(value) => setSelectedShape(value as ShapeType)}
                          >
                            <SelectTrigger id="shapeType" className="mt-1">
                              <SelectValue placeholder="Tipo di forma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rectangle">Rettangolo</SelectItem>
                              <SelectItem value="circle">Cerchio</SelectItem>
                              <SelectItem value="line">Linea</SelectItem>
                              <SelectItem value="arrow">Freccia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="inkWidth">Spessore bordo ({inkWidth}px)</Label>
                          <Slider
                            id="inkWidth"
                            min={1}
                            max={10}
                            step={1}
                            value={[inkWidth]}
                            onValueChange={(value) => setInkWidth(value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Impostazioni comuni a molti strumenti */}
                    {(activeTool === 'text' || activeTool === 'draw' || activeTool === 'shape' || activeTool === 'highlight') && (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="inkColor">Colore</Label>
                          <div className="flex mt-1">
                            <Input
                              type="color"
                              id="inkColor"
                              value={inkColor}
                              onChange={(e) => setInkColor(e.target.value)}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={inkColor}
                              onChange={(e) => setInkColor(e.target.value)}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="opacity">Opacità ({opacity}%)</Label>
                          <Slider
                            id="opacity"
                            min={10}
                            max={100}
                            step={5}
                            value={[opacity]}
                            onValueChange={(value) => setOpacity(value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Pulsante di eliminazione nel caso in cui sia selezionato lo strumento di cancellazione */}
                    {activeTool === 'erase' && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Cancella elementi</h3>
                        <p className="text-sm text-gray-600">
                          Seleziona un oggetto sul documento e poi premi il pulsante per eliminarlo.
                        </p>
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          onClick={deleteSelectedObjects}
                        >
                          <Scissors className="h-4 w-4 mr-2" /> Elimina selezionato
                        </Button>
                      </div>
                    )}
                    
                    {/* Sezione per aggiungere filigrana */}
                    {activeTab === 'annotate' && !activeTool && (
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
                    )}
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
                          <span className="text-gray-600">Pagine:</span>
                          <span className="font-medium">{numPages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dimensione:</span>
                          <span className="font-medium">
                            {pdfFile ? `${(pdfFile.size / 1024).toFixed(2)} KB` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Cronologia modifiche</h3>
                      {editingOperations.length === 0 ? (
                        <p className="text-sm text-gray-600">
                          Nessuna modifica effettuata.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {editingOperations.map((op, index) => (
                            <div 
                              key={op.id}
                              className={`text-sm p-2 rounded ${index <= historyIndex ? 'bg-gray-100' : 'bg-gray-50 text-gray-400 line-through'}`}
                            >
                              <div className="flex justify-between">
                                <span>{op.description}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(op.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t mt-4">
                      <Button 
                        className="w-full"
                        onClick={saveDocument}
                      >
                        <Download className="h-4 w-4 mr-2" /> Salva PDF
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          <p className="font-medium">Errore</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}