import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Product categories with their import duty rates
const importProductCategories = [
  { id: "electronics", name: "Elettronica", rate: 0.035 },
  { id: "clothing", name: "Abbigliamento", rate: 0.12 },
  { id: "food", name: "Prodotti alimentari", rate: 0.055 },
  { id: "cosmetics", name: "Cosmetici", rate: 0.065 },
  { id: "automobiles", name: "Automobili", rate: 0.10 },
  { id: "furniture", name: "Mobili", rate: 0.045 },
  { id: "jewelry", name: "Gioielli", rate: 0.07 },
  { id: "books", name: "Libri", rate: 0.00 },
  { id: "other", name: "Altro", rate: 0.04 },
];

// Export tariffs by destination
const exportProductCategories = [
  { id: "machinery", name: "Macchinari industriali", rate: 0.00 },
  { id: "automotive", name: "Componenti automotive", rate: 0.02 },
  { id: "fashion", name: "Moda e accessori", rate: 0.01 },
  { id: "wine", name: "Vino e alcolici", rate: 0.05 },
  { id: "food", name: "Prodotti alimentari", rate: 0.03 },
  { id: "furniture", name: "Mobili e design", rate: 0.015 },
  { id: "pharmaceuticals", name: "Prodotti farmaceutici", rate: 0.00 },
  { id: "cosmetics", name: "Cosmetici", rate: 0.025 },
  { id: "other", name: "Altri prodotti", rate: 0.02 },
];

// Import countries with preferential rates
const importCountries = [
  { id: "eu", name: "Unione Europea", preferential: true },
  { id: "us", name: "Stati Uniti", preferential: false },
  { id: "cn", name: "Cina", preferential: false },
  { id: "jp", name: "Giappone", preferential: true },
  { id: "kr", name: "Corea del Sud", preferential: true },
  { id: "in", name: "India", preferential: false },
  { id: "ca", name: "Canada", preferential: true },
  { id: "other", name: "Altro paese", preferential: false },
];

// Export destinations with their info
const exportDestinations = [
  { id: "eu", name: "Unione Europea", vatExempt: true, dutyFree: true },
  { id: "us", name: "Stati Uniti", vatExempt: true, dutyFree: false },
  { id: "cn", name: "Cina", vatExempt: true, dutyFree: false },
  { id: "jp", name: "Giappone", vatExempt: true, dutyFree: true },
  { id: "uk", name: "Regno Unito", vatExempt: true, dutyFree: false },
  { id: "br", name: "Brasile", vatExempt: true, dutyFree: false },
  { id: "in", name: "India", vatExempt: true, dutyFree: false },
  { id: "ru", name: "Russia", vatExempt: true, dutyFree: false },
  { id: "other", name: "Altro paese", vatExempt: true, dutyFree: false },
];

export default function DutyCalculator() {
  // Common state
  const [calculationType, setCalculationType] = useState<"import" | "export">("import");
  
  // Import calculation state
  const [importValue, setImportValue] = useState<string>("");
  const [importCategory, setImportCategory] = useState<string>("electronics");
  const [importCountry, setImportCountry] = useState<string>("other");
  const [includeImportVAT, setIncludeImportVAT] = useState<boolean>(true);
  const [importResults, setImportResults] = useState<{
    dutyAmount: number;
    vatAmount: number;
    totalCost: number;
  } | null>(null);

  // Export calculation state
  const [exportValue, setExportValue] = useState<string>("");
  const [exportCategory, setExportCategory] = useState<string>("machinery");
  const [exportDestination, setExportDestination] = useState<string>("other");
  const [includeExportInsurance, setIncludeExportInsurance] = useState<boolean>(true);
  const [includeExportFreight, setIncludeExportFreight] = useState<boolean>(true);
  const [exportResults, setExportResults] = useState<{
    dutyAmount: number;
    localTaxAmount: number;
    insuranceCost: number;
    freightCost: number;
    totalCost: number;
    netProfit: number;
  } | null>(null);

  const handleImportCalculate = () => {
    if (!importValue || isNaN(Number(importValue))) {
      alert("Per favore, inserisci un valore valido per il prodotto");
      return;
    }

    const value = Number(importValue);
    const selectedCategory = importProductCategories.find(cat => cat.id === importCategory);
    const selectedCountry = importCountries.find(c => c.id === importCountry);
    
    if (!selectedCategory || !selectedCountry) return;
    
    // Apply duty rate with 50% discount for preferential countries
    const dutyRate = selectedCountry.preferential 
      ? selectedCategory.rate / 2 
      : selectedCategory.rate;
    
    const dutyAmount = value * dutyRate;
    
    // Value + Duty = Customs value for VAT calculation
    const customsValue = value + dutyAmount;
    
    // Italian standard VAT rate is 22%
    const vatRate = 0.22;
    const vatAmount = includeImportVAT ? customsValue * vatRate : 0;
    
    setImportResults({
      dutyAmount,
      vatAmount,
      totalCost: value + dutyAmount + vatAmount
    });
  };

  const handleExportCalculate = () => {
    if (!exportValue || isNaN(Number(exportValue))) {
      alert("Per favore, inserisci un valore valido per il prodotto");
      return;
    }

    const value = Number(exportValue);
    const selectedCategory = exportProductCategories.find(cat => cat.id === exportCategory);
    const selectedDestination = exportDestinations.find(d => d.id === exportDestination);
    
    if (!selectedCategory || !selectedDestination) return;
    
    // Calculate export duty (if applicable)
    const dutyRate = selectedDestination.dutyFree ? 0 : selectedCategory.rate;
    const dutyAmount = value * dutyRate;
    
    // Local taxes vary by destination (typically 5-15%)
    // This is a simplified estimation
    let localTaxRate = 0;
    switch(exportDestination) {
      case "us": localTaxRate = 0.05; break; // Sales tax
      case "cn": localTaxRate = 0.13; break; // VAT
      case "uk": localTaxRate = 0.20; break; // VAT
      case "jp": localTaxRate = 0.10; break; // Consumption tax
      case "br": localTaxRate = 0.17; break; // ICMS
      case "in": localTaxRate = 0.18; break; // GST
      case "ru": localTaxRate = 0.20; break; // VAT
      default: localTaxRate = 0.10; // Average
    }
    
    const localTaxAmount = value * localTaxRate;
    
    // Insurance and freight costs (estimated percentages)
    const insuranceCost = includeExportInsurance ? value * 0.03 : 0;
    const freightCost = includeExportFreight ? value * 0.08 : 0;
    
    // Total landed cost in the destination country
    const totalCost = value + dutyAmount + localTaxAmount + insuranceCost + freightCost;
    
    // Estimate net profit (assuming a 30% markup)
    const costOfGoods = value / 1.3; // reverse-calculate cost from selling price
    const netProfit = value - costOfGoods - (insuranceCost + freightCost);
    
    setExportResults({
      dutyAmount,
      localTaxAmount,
      insuranceCost,
      freightCost,
      totalCost,
      netProfit
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Calcolatore di Dazi Doganali</h2>
        <p className="text-gray-600 mb-6">
          Calcola i dazi doganali sia per l'importazione che per l'esportazione di prodotti.
        </p>
      </div>

      <Tabs 
        defaultValue="import" 
        value={calculationType}
        onValueChange={(value) => setCalculationType(value as "import" | "export")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="import">Importazione in Italia</TabsTrigger>
          <TabsTrigger value="export">Esportazione dall'Italia</TabsTrigger>
        </TabsList>
        
        {/* Import Calculator */}
        <TabsContent value="import" className="space-y-4">
          <div>
            <Label htmlFor="importValue">Valore del prodotto (€)</Label>
            <Input
              id="importValue"
              type="number"
              value={importValue}
              onChange={(e) => {
                setImportValue(e.target.value);
                setImportResults(null);
              }}
              placeholder="Inserisci il valore in euro"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="importCategory">Categoria prodotto</Label>
            <Select
              value={importCategory}
              onValueChange={(value) => {
                setImportCategory(value);
                setImportResults(null);
              }}
            >
              <SelectTrigger id="importCategory" className="mt-1">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {importProductCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({(cat.rate * 100).toFixed(1)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="importCountry">Paese di provenienza</Label>
            <Select
              value={importCountry}
              onValueChange={(value) => {
                setImportCountry(value);
                setImportResults(null);
              }}
            >
              <SelectTrigger id="importCountry" className="mt-1">
                <SelectValue placeholder="Seleziona paese" />
              </SelectTrigger>
              <SelectContent>
                {importCountries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.preferential ? "(Preferenziale)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="includeImportVAT" 
              checked={includeImportVAT}
              onCheckedChange={(checked) => {
                setIncludeImportVAT(!!checked);
                setImportResults(null);
              }}
            />
            <Label htmlFor="includeImportVAT" className="cursor-pointer">
              Includi calcolo IVA (22%)
            </Label>
          </div>

          <Button 
            onClick={handleImportCalculate} 
            className="w-full mt-4"
          >
            Calcola dazi di importazione
          </Button>

          {importResults && (
            <div className="p-4 bg-gray-50 border rounded-md mt-6">
              <h3 className="font-medium text-lg mb-4">Risultato del calcolo:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valore merce:</span>
                  <span className="font-medium">{Number(importValue).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Dazi doganali:</span>
                  <span className="font-medium">{importResults.dutyAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                {includeImportVAT && (
                  <div className="flex justify-between">
                    <span>IVA (22%):</span>
                    <span className="font-medium">{importResults.vatAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Costo totale:</span>
                  <span>{importResults.totalCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Nota: questo calcolo è indicativo. Le aliquote effettive possono variare in base a specifici accordi commerciali
                e dettagli del prodotto. Consulta un esperto doganale per informazioni accurate.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Export Calculator */}
        <TabsContent value="export" className="space-y-4">
          <div>
            <Label htmlFor="exportValue">Valore del prodotto (€)</Label>
            <Input
              id="exportValue"
              type="number"
              value={exportValue}
              onChange={(e) => {
                setExportValue(e.target.value);
                setExportResults(null);
              }}
              placeholder="Inserisci il valore in euro"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="exportCategory">Categoria prodotto</Label>
            <Select
              value={exportCategory}
              onValueChange={(value) => {
                setExportCategory(value);
                setExportResults(null);
              }}
            >
              <SelectTrigger id="exportCategory" className="mt-1">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {exportProductCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({(cat.rate * 100).toFixed(1)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exportDestination">Paese di destinazione</Label>
            <Select
              value={exportDestination}
              onValueChange={(value) => {
                setExportDestination(value);
                setExportResults(null);
              }}
            >
              <SelectTrigger id="exportDestination" className="mt-1">
                <SelectValue placeholder="Seleziona paese" />
              </SelectTrigger>
              <SelectContent>
                {exportDestinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} {d.dutyFree ? "(No dazi)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeExportInsurance" 
                checked={includeExportInsurance}
                onCheckedChange={(checked) => {
                  setIncludeExportInsurance(!!checked);
                  setExportResults(null);
                }}
              />
              <Label htmlFor="includeExportInsurance" className="cursor-pointer">
                Includi assicurazione (3% del valore)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeExportFreight" 
                checked={includeExportFreight}
                onCheckedChange={(checked) => {
                  setIncludeExportFreight(!!checked);
                  setExportResults(null);
                }}
              />
              <Label htmlFor="includeExportFreight" className="cursor-pointer">
                Includi costi di trasporto (8% del valore)
              </Label>
            </div>
          </div>

          <Button 
            onClick={handleExportCalculate} 
            className="w-full mt-4"
          >
            Calcola costi di esportazione
          </Button>

          {exportResults && (
            <div className="p-4 bg-gray-50 border rounded-md mt-6">
              <h3 className="font-medium text-lg mb-4">Risultato del calcolo:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valore merce:</span>
                  <span className="font-medium">{Number(exportValue).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Dazi paese destinazione:</span>
                  <span className="font-medium">{exportResults.dutyAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tasse locali paese destinazione:</span>
                  <span className="font-medium">{exportResults.localTaxAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                {includeExportInsurance && (
                  <div className="flex justify-between">
                    <span>Costi assicurazione:</span>
                    <span className="font-medium">{exportResults.insuranceCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                )}
                
                {includeExportFreight && (
                  <div className="flex justify-between">
                    <span>Costi di trasporto:</span>
                    <span className="font-medium">{exportResults.freightCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Costo totale nel paese di destinazione:</span>
                  <span>{exportResults.totalCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Profitto netto stimato:</span>
                  <span>{exportResults.netProfit.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Nota: questi calcoli sono indicativi. I costi effettivi possono variare in base a specifici accordi commerciali,
                regolamenti locali, e dettagli del prodotto. Consulta un esperto in commercio internazionale per informazioni accurate.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}