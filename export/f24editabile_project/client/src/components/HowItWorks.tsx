import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export default function HowItWorks() {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("0,00");
  
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and comma
    const value = e.target.value.replace(/[^\d,]/g, "");
    setAmount(value);
    
    // Calculate total
    try {
      const numericValue = value.replace(",", ".");
      const parsedValue = parseFloat(numericValue) || 0;
      setTotal(parsedValue.toFixed(2).replace(".", ","));
    } catch (error) {
      setTotal("0,00");
    }
  }, []);
  
  const handleAction = useCallback((action: string) => {
    toast({
      title: "Demo",
      description: `La funzione "${action}" sarà disponibile nella versione completa.`,
    });
  }, [toast]);
  
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">Come funziona</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Simulazione di compilazione F24</h3>
            
            <div className="form-overlay border border-gray-200 rounded overflow-hidden mb-4">
              <div className="w-full h-96 bg-gray-100 relative">
                <div className="form-content p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm mb-1">Codice fiscale</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 p-2 rounded" 
                        placeholder="Codice fiscale"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Cognome e nome o denominazione</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 p-2 rounded" 
                        placeholder="Cognome e nome"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm mb-1">Codice tributo</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 p-2 rounded" 
                        placeholder="Codice tributo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Importo a debito</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 p-2 rounded" 
                        placeholder="0,00"
                        value={amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">TOTALE</span>
                      <span className="font-bold text-xl">€ {total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 bg-black text-white py-2 px-4 rounded flex items-center justify-center"
                onClick={() => handleAction("Scarica PDF")}
              >
                <span className="material-icons text-sm mr-1">download</span> Scarica PDF
              </button>
              <button 
                className="flex-1 border border-black py-2 px-4 rounded flex items-center justify-center"
                onClick={() => handleAction("Stampa")}
              >
                <span className="material-icons text-sm mr-1">print</span> Stampa
              </button>
              <button 
                className="flex-1 border border-black py-2 px-4 rounded flex items-center justify-center"
                onClick={() => handleAction("Condividi")}
              >
                <span className="material-icons text-sm mr-1">share</span> Condividi
              </button>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Vantaggi del nostro sistema</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="material-icons text-black mr-2">check_circle</span>
                <div>
                  <h4 className="font-bold">Compila come su carta</h4>
                  <p className="text-sm text-gray-600">Visualizza e compila i moduli esattamente come apparirebbero su carta.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-black mr-2">calculate</span>
                <div>
                  <h4 className="font-bold">Calcolo automatico</h4>
                  <p className="text-sm text-gray-600">Il sistema calcola automaticamente i totali, prevenendo errori.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-black mr-2">description</span>
                <div>
                  <h4 className="font-bold">PDF professionale</h4>
                  <p className="text-sm text-gray-600">Genera documenti PDF pronti per la presentazione agli enti competenti.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-black mr-2">security</span>
                <div>
                  <h4 className="font-bold">Sicurezza garantita</h4>
                  <p className="text-sm text-gray-600">I tuoi dati rimangono sul tuo dispositivo, non vengono inviati ai nostri server.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
