import { Link } from "wouter";

// Tool data with descriptions and links
const toolsList = [
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