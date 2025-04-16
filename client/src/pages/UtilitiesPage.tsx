import { Link } from "wouter";

// Tool data with descriptions and links
const toolsList = [
  {
    id: "net-salary-calculator",
    title: "Calcolo Stipendio Netto",
    description: "Calcola il tuo stipendio netto mensile a partire dal lordo annuale (RAL). Aggiornato con le aliquote fiscali 2025 e le ultime normative.",
    icon: "💰",
    path: "/strumenti/stipendio-netto"
  },
  {
    id: "tax-deadlines",
    title: "Scadenze Fiscali 2025",
    description: "Monitora tutte le scadenze fiscali per persone fisiche e giuridiche. Aggiornamento automatico su dichiarazioni, versamenti e adempimenti fiscali.",
    icon: "📅",
    path: "/strumenti/scadenze-fiscali"
  },
  {
    id: "bonus-isee",
    title: "Bonus ISEE 2025",
    description: "Esplora tutti i bonus e le agevolazioni disponibili in base al tuo ISEE. Verifica la tua idoneità e scopri come fare domanda per ottenere i contributi.",
    icon: "🎁",
    path: "/strumenti/bonus-isee"
  },
  {
    id: "public-debt-tracker",
    title: "Debito Pubblico",
    description: "Monitora il debito pubblico delle maggiori economie globali. Visualizza andamento storico, confronta paesi e analizza dati aggiornati quotidianamente.",
    icon: "📊",
    path: "/strumenti/debito-pubblico"
  },
  {
    id: "currency-converter",
    title: "Convertitore di Valuta",
    description: "Converti facilmente tra diverse valute utilizzando tassi di cambio aggiornati. Strumento utile per chi effettua pagamenti o riceve denaro dall'estero.",
    icon: "💱",
    path: "/strumenti/valuta"
  },
  {
    id: "duty-calculator",
    title: "Calcolatore Dazi Doganali",
    description: "Calcola dazi e imposte per importazione ed esportazione di prodotti. Include tariffe preferenziali e imposte locali dei paesi di destinazione.",
    icon: "🧮",
    path: "/strumenti/dazi"
  },
  {
    id: "p7m-converter",
    title: "Convertitore P7M in PDF",
    description: "Converti facilmente file firmati digitalmente con estensione .p7m in formato PDF leggibile, mantenendo l'integrità del documento originale.",
    icon: "📄",
    path: "/strumenti/p7m"
  },
  {
    id: "xml-to-png",
    title: "XML a PNG",
    description: "Converti facilmente file XML in immagini PNG di alta qualità. Ideale per la visualizzazione di strutture XML in documenti o presentazioni.",
    icon: "🖼️",
    path: "/strumenti/xml-png"
  },
  {
    id: "pdf-editor",
    title: "Editor PDF",
    description: "Modifica facilmente i tuoi PDF: aggiungi testo, immagini, ruota pagine, aggiungi filigrane e altro. Ottimo per compilare o correggere documenti.",
    icon: "✏️",
    path: "/strumenti/pdf-editor"
  },
  {
    id: "pdf-to-word",
    title: "PDF a Word",
    description: "Converti documenti PDF in file Word editabili, mantenendo la formattazione originale, immagini e layout. Ideale per modificare documenti bloccati.",
    icon: "📝",
    path: "/strumenti/pdf-word"
  }
];

export default function UtilitiesPage() {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Strumenti Utili</h1>
          <p className="text-lg text-gray-600">
            Utilizza questi strumenti per facilitare le tue attività finanziarie e fiscali.
            Semplici, rapidi e pratici.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toolsList.map((tool) => (
              <div 
                key={tool.id} 
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="text-4xl mb-4 text-center">{tool.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-sm text-gray-600 mb-6 flex-grow">{tool.description}</p>
                  <Link href={tool.path}>
                    <a className="block w-full bg-black text-white text-center py-2 rounded hover:bg-gray-900 transition-colors">
                      Apri Strumento
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}