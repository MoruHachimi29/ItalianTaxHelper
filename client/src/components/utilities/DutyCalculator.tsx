import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Product categories with their duty rates
const productCategories = [
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

export default function DutyCalculator() {
  const [productValue, setProductValue] = useState<string>("");
  const [category, setCategory] = useState<string>("electronics");
  const [country, setCountry] = useState<string>("other");
  const [includeVAT, setIncludeVAT] = useState<boolean>(true);
  const [results, setResults] = useState<{
    dutyAmount: number;
    vatAmount: number;
    totalCost: number;
  } | null>(null);

  const handleCalculate = () => {
    if (!productValue || isNaN(Number(productValue))) {
      alert("Per favore, inserisci un valore valido per il prodotto");
      return;
    }

    const value = Number(productValue);
    const selectedCategory = productCategories.find(cat => cat.id === category);
    const selectedCountry = importCountries.find(c => c.id === country);
    
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
    const vatAmount = includeVAT ? customsValue * vatRate : 0;
    
    setResults({
      dutyAmount,
      vatAmount,
      totalCost: value + dutyAmount + vatAmount
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Calcolatore di Dazi Doganali</h2>
        <p className="text-gray-600 mb-6">
          Calcola i dazi doganali e l'IVA per l'importazione di prodotti in Italia.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="productValue">Valore del prodotto (€)</Label>
          <Input
            id="productValue"
            type="number"
            value={productValue}
            onChange={(e) => {
              setProductValue(e.target.value);
              setResults(null);
            }}
            placeholder="Inserisci il valore in euro"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria prodotto</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setResults(null);
            }}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name} ({(cat.rate * 100).toFixed(1)}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="country">Paese di importazione</Label>
          <Select
            value={country}
            onValueChange={(value) => {
              setCountry(value);
              setResults(null);
            }}
          >
            <SelectTrigger id="country" className="mt-1">
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
            id="includeVAT" 
            checked={includeVAT}
            onCheckedChange={(checked) => {
              setIncludeVAT(!!checked);
              setResults(null);
            }}
          />
          <Label htmlFor="includeVAT" className="cursor-pointer">
            Includi calcolo IVA (22%)
          </Label>
        </div>

        <Button 
          onClick={handleCalculate} 
          className="w-full mt-4"
        >
          Calcola dazi
        </Button>
      </div>

      {results && (
        <div className="p-4 bg-gray-50 border rounded-md mt-6">
          <h3 className="font-medium text-lg mb-4">Risultato del calcolo:</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Valore merce:</span>
              <span className="font-medium">{Number(productValue).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Dazi doganali:</span>
              <span className="font-medium">{results.dutyAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            
            {includeVAT && (
              <div className="flex justify-between">
                <span>IVA (22%):</span>
                <span className="font-medium">{results.vatAmount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Costo totale:</span>
              <span>{results.totalCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Nota: questo calcolo è indicativo. Le aliquote effettive possono variare in base a specifici accordi commerciali
            e dettagli del prodotto. Consulta un esperto doganale per informazioni accurate.
          </p>
        </div>
      )}
    </div>
  );
}