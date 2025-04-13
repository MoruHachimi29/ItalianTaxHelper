import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Common currency codes
const currencies = [
  { code: "EUR", name: "Euro (EUR)" },
  { code: "USD", name: "Dollaro USA (USD)" },
  { code: "GBP", name: "Sterlina inglese (GBP)" },
  { code: "JPY", name: "Yen giapponese (JPY)" },
  { code: "CHF", name: "Franco svizzero (CHF)" },
  { code: "CAD", name: "Dollaro canadese (CAD)" },
  { code: "AUD", name: "Dollaro australiano (AUD)" },
  { code: "CNY", name: "Yuan cinese (CNY)" },
];

// Mock exchange rates against EUR (would be replaced with real API data)
const exchangeRates = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  JPY: 157.32,
  CHF: 0.97,
  CAD: 1.47,
  AUD: 1.63,
  CNY: 7.83,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Per favore, inserisci un importo valido");
      return;
    }

    setLoading(true);
    
    // In a real implementation, we would call an API here
    setTimeout(() => {
      // Convert both currencies to EUR, then to the target currency
      const valueInEur = Number(amount) / exchangeRates[fromCurrency as keyof typeof exchangeRates];
      const convertedValue = valueInEur * exchangeRates[toCurrency as keyof typeof exchangeRates];
      
      // Format the result with 2 decimal places
      setResult(`${Number(amount).toLocaleString('it-IT')} ${fromCurrency} = ${convertedValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`);
      setLoading(false);
    }, 500);
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Convertitore di Valuta</h2>
        <p className="text-gray-600 mb-6">
          Converte facilmente tra diverse valute utilizzando tassi di cambio aggiornati.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="amount">Importo</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setResult("");
            }}
            placeholder="Inserisci l'importo"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="fromCurrency">Da</Label>
            <Select
              value={fromCurrency}
              onValueChange={(value) => {
                setFromCurrency(value);
                setResult("");
              }}
            >
              <SelectTrigger id="fromCurrency" className="mt-1">
                <SelectValue placeholder="Seleziona valuta" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center md:justify-start">
            <Button 
              variant="outline" 
              onClick={handleSwap}
              className="h-10 w-10 rounded-full flex items-center justify-center"
              aria-label="Scambia valute"
            >
              ⇄
            </Button>
          </div>
          
          <div className="md:col-start-2 md:row-start-1">
            <Label htmlFor="toCurrency">A</Label>
            <Select
              value={toCurrency}
              onValueChange={(value) => {
                setToCurrency(value);
                setResult("");
              }}
            >
              <SelectTrigger id="toCurrency" className="mt-1">
                <SelectValue placeholder="Seleziona valuta" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleConvert} 
          disabled={loading}
          className="mt-4"
        >
          {loading ? "Conversione in corso..." : "Converti"}
        </Button>
      </div>

      {result && (
        <div className="p-4 bg-gray-50 border rounded-md mt-6">
          <h3 className="font-medium text-lg mb-2">Risultato della conversione:</h3>
          <p className="text-xl font-medium">{result}</p>
          <p className="text-sm text-gray-500 mt-2">Nota: i tassi di cambio sono rappresentativi e soggetti a variazioni.</p>
        </div>
      )}
    </div>
  );
}