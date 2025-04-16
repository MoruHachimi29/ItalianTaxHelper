import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OpenAIService } from "@/lib/openai-service";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

// Interfacce per i tipi di dati
interface CurrentDebtData {
  country: string;
  debtValue: number;
  currency: string;
  debtToGDP: number;
  lastUpdate: string;
  trend: 'up' | 'down';
  changePercentage: number;
}

interface HistoricalDataPoint {
  year: number;
  debtValue: number;
  debtToGDP: number;
}

interface HistoricalDebtData {
  country: string;
  currency: string;
  data: HistoricalDataPoint[];
}

interface CountryDebtData {
  country: string;
  debtValue: number;
  currency: string;
  debtToGDP: number;
  perCapita: number;
}

interface ComparisonDebtData {
  countries: string[];
  data: CountryDebtData[];
  comparison: {
    relativeSize: number;
    gdpComparison: number; 
    perCapitaRatio: number;
  };
}

export default function PublicDebtTracker() {
  // Stato per le selezioni dell'utente
  const [selectedCountry, setSelectedCountry] = useState("Italia");
  const [comparisonCountry, setComparisonCountry] = useState("Germania");
  const [yearsToShow, setYearsToShow] = useState("5");
  
  // Stato per i dati
  const [countries, setCountries] = useState<string[]>([]);
  const [currentDebt, setCurrentDebt] = useState<CurrentDebtData | null>(null);
  const [historicalDebt, setHistoricalDebt] = useState<HistoricalDebtData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonDebtData | null>(null);
  
  // Stato per gestire il caricamento
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Carica l'elenco dei paesi supportati all'avvio
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("/api/public-debt/countries");
        const data = await response.json();
        setCountries(data.countries);
      } catch (error) {
        console.error("Errore nel recupero dei paesi:", error);
        setErrorMessage("Impossibile caricare l'elenco dei paesi");
      }
    }
    
    fetchCountries();
  }, []);
  
  // Carica i dati correnti quando cambia il paese selezionato
  useEffect(() => {
    async function fetchCurrentDebt() {
      if (!selectedCountry) return;
      
      setIsLoading(true);
      setErrorMessage("");
      
      try {
        const data = await OpenAIService.getPublicDebtData(selectedCountry);
        setCurrentDebt(data);
      } catch (error) {
        console.error("Errore nel recupero dei dati correnti:", error);
        setErrorMessage("Impossibile caricare i dati attuali del debito pubblico");
        setCurrentDebt(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCurrentDebt();
  }, [selectedCountry]);
  
  // Funzione per caricare i dati storici
  const loadHistoricalData = async () => {
    if (!selectedCountry) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const data = await OpenAIService.getHistoricalDebtData(selectedCountry, parseInt(yearsToShow));
      setHistoricalDebt(data);
    } catch (error) {
      console.error("Errore nel recupero dei dati storici:", error);
      setErrorMessage("Impossibile caricare i dati storici del debito pubblico");
      setHistoricalDebt(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funzione per caricare i dati di confronto
  const loadComparisonData = async () => {
    if (!selectedCountry || !comparisonCountry) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const data = await OpenAIService.comparePublicDebt(selectedCountry, comparisonCountry);
      setComparisonData(data);
    } catch (error) {
      console.error("Errore nel confronto dei dati:", error);
      setErrorMessage("Impossibile confrontare i dati del debito pubblico");
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formatta il valore di una valuta
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: currency, 
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Formatta percentuali
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'percent', 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Situazione Attuale</TabsTrigger>
          <TabsTrigger value="historical">Storico</TabsTrigger>
          <TabsTrigger value="comparison">Confronto</TabsTrigger>
        </TabsList>
        
        {/* Sezione Situazione Attuale */}
        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <Label htmlFor="country">Seleziona un paese</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country" className="mt-1">
                  <SelectValue placeholder="Seleziona un paese" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading && <div className="text-center py-4">Caricamento dati in corso...</div>}
          
          {errorMessage && (
            <div className="text-center py-4 text-red-600">{errorMessage}</div>
          )}
          
          {currentDebt && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Debito Pubblico di {currentDebt.country}
                </CardTitle>
                <CardDescription className="text-center">
                  Dati aggiornati al {currentDebt.lastUpdate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold mb-1">Debito Totale</h4>
                    <div className="text-3xl font-bold">
                      {formatCurrency(currentDebt.debtValue, currentDebt.currency)} miliardi
                    </div>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      {currentDebt.trend === "up" ? (
                        <>
                          <ArrowUpIcon className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            +{currentDebt.changePercentage.toFixed(1)}% rispetto all'anno precedente
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            -{Math.abs(currentDebt.changePercentage).toFixed(1)}% rispetto all'anno precedente
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">Rapporto Debito/PIL</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold">
                        {formatPercentage(currentDebt.debtToGDP)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {currentDebt.debtToGDP > 100 
                          ? "Superiore al PIL nazionale" 
                          : "Del prodotto interno lordo"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">Tendenza</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      {currentDebt.trend === "up" ? (
                        <>
                          <TrendingUpIcon className="h-8 w-8 mx-auto text-red-600" />
                          <div className="text-sm text-gray-500 mt-2">
                            In aumento rispetto all'anno precedente
                          </div>
                        </>
                      ) : (
                        <>
                          <TrendingDownIcon className="h-8 w-8 mx-auto text-green-600" />
                          <div className="text-sm text-gray-500 mt-2">
                            In diminuzione rispetto all'anno precedente
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-sm text-gray-500 pt-2">
                  <p className="text-xs text-center">
                    I dati sono aggiornati alle ultime statistiche economiche disponibili. 
                    Il debito pubblico è espresso in miliardi di {currentDebt.currency}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Sezione Storico */}
        <TabsContent value="historical" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="historical-country">Seleziona un paese</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="historical-country" className="mt-1">
                  <SelectValue placeholder="Seleziona un paese" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="years">Numero di anni da visualizzare</Label>
              <Select value={yearsToShow} onValueChange={setYearsToShow}>
                <SelectTrigger id="years" className="mt-1">
                  <SelectValue placeholder="Seleziona anni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Ultimi 3 anni</SelectItem>
                  <SelectItem value="5">Ultimi 5 anni</SelectItem>
                  <SelectItem value="10">Ultimi 10 anni</SelectItem>
                  <SelectItem value="15">Ultimi 15 anni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 pb-4">
            <Button onClick={loadHistoricalData} className="w-full sm:w-auto">
              Carica Dati Storici
            </Button>
          </div>
          
          {isLoading && <div className="text-center py-4">Caricamento dati in corso...</div>}
          
          {errorMessage && (
            <div className="text-center py-4 text-red-600">{errorMessage}</div>
          )}
          
          {historicalDebt && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Storico Debito Pubblico di {historicalDebt.country}
                </CardTitle>
                <CardDescription className="text-center">
                  Evoluzione negli ultimi {yearsToShow} anni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalDebt.data.slice(-parseInt(yearsToShow))}
                      margin={{ top: 20, right: 30, left: 30, bottom: 120 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Anno', position: 'insideBottom', offset: -15 }} />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        label={{ value: `Debito (miliardi ${historicalDebt.currency})`, angle: -90, position: 'insideLeft', offset: 15, dy: 50 }} 
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        domain={[0, 200]} 
                        label={{ value: 'Debito/PIL (%)', angle: 90, position: 'insideRight', offset: 15, dy: 50 }} 
                      />
                      <Tooltip formatter={(value: number, name: string) => {
                        if (name === 'debtValue') return [`${value} miliardi ${historicalDebt.currency}`, 'Debito pubblico'];
                        if (name === 'debtToGDP') return [`${value}%`, 'Debito/PIL'];
                        return [value, name];
                      }} />
                      <Legend verticalAlign="bottom" height={80} wrapperStyle={{ paddingTop: "20px" }} />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="debtValue" 
                        name="Debito pubblico" 
                        stroke="#ef4444" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2} 
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="debtToGDP" 
                        name="Debito/PIL" 
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator />
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border text-left" style={{ minWidth: "80px" }}>Anno</th>
                        <th className="py-2 px-4 border text-left" style={{ minWidth: "200px" }}>
                          <span className="text-red-600">Debito (miliardi {historicalDebt.currency})</span>
                        </th>
                        <th className="py-2 px-4 border text-left" style={{ minWidth: "150px" }}>
                          <span className="text-green-600">Debito/PIL (%)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...historicalDebt.data]
                        .slice(-parseInt(yearsToShow)) // Prendi solo gli ultimi N anni
                        .sort((a, b) => b.year - a.year) // Ordina per anno decrescente
                        .map((item) => (
                          <tr key={item.year} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border">{item.year}</td>
                            <td className="py-2 px-4 border text-red-600 font-medium">{item.debtValue.toLocaleString()}</td>
                            <td className="py-2 px-4 border text-green-600 font-medium">{item.debtToGDP.toLocaleString()}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-2 text-sm text-gray-500">
                  <p className="text-xs text-center">
                    I dati mostrano l'andamento del debito pubblico in miliardi di {historicalDebt.currency} 
                    e il rapporto debito/PIL in percentuale nel corso degli anni.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Sezione Confronto */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="country1">Primo paese</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country1" className="mt-1">
                  <SelectValue placeholder="Seleziona un paese" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="country2">Secondo paese</Label>
              <Select value={comparisonCountry} onValueChange={setComparisonCountry}>
                <SelectTrigger id="country2" className="mt-1">
                  <SelectValue placeholder="Seleziona un paese da confrontare" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .filter(country => country !== selectedCountry)
                    .map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 pb-4">
            <Button onClick={loadComparisonData} className="w-full sm:w-auto">
              Confronta Paesi
            </Button>
          </div>
          
          {isLoading && <div className="text-center py-4">Caricamento dati in corso...</div>}
          
          {errorMessage && (
            <div className="text-center py-4 text-red-600">{errorMessage}</div>
          )}
          
          {comparisonData && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Confronto Debito Pubblico
                </CardTitle>
                <CardDescription className="text-center">
                  {comparisonData.countries[0]} vs {comparisonData.countries[1]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData.data}
                      margin={{ top: 20, right: 30, left: 30, bottom: 120 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="country" 
                        type="category" 
                        width={100}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => {
                          const item = props.payload;
                          if (name === 'debtValue') return [`${value} miliardi ${item.currency}`, 'Debito pubblico'];
                          if (name === 'debtToGDP') return [`${value}%`, 'Debito/PIL'];
                          if (name === 'perCapita') return [`${value} ${item.currency}`, 'Debito pro capite'];
                          return [value, name];
                        }}
                      />
                      <Legend verticalAlign="bottom" height={80} wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar 
                        dataKey="debtValue" 
                        name="Debito totale (miliardi)" 
                        fill="#ef4444" 
                      />
                      <Bar 
                        dataKey="debtToGDP" 
                        name="Debito/PIL (%)" 
                        fill="#10b981" 
                      />
                      <Bar 
                        dataKey="perCapita" 
                        name="Debito pro capite" 
                        fill="#f97316" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator />
                
                {/* Tabella di confronto */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mb-6">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border text-left" style={{ minWidth: "150px" }}>Indicatore</th>
                        {comparisonData.data.map(item => (
                          <th key={item.country} className="py-2 px-4 border text-left" style={{ minWidth: "180px" }}>{item.country}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-4 border font-medium">Debito Totale</td>
                        {comparisonData.data.map(item => (
                          <td key={`${item.country}-debt`} className="py-2 px-4 border text-red-600 font-medium">
                            {item.debtValue.toLocaleString()} miliardi {item.currency}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-4 border font-medium">Debito/PIL</td>
                        {comparisonData.data.map(item => (
                          <td key={`${item.country}-gdp`} className="py-2 px-4 border text-green-600 font-medium">
                            {item.debtToGDP.toLocaleString()}%
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-4 border font-medium">Debito Pro Capite</td>
                        {comparisonData.data.map(item => (
                          <td key={`${item.country}-capita`} className="py-2 px-4 border text-orange-500 font-medium">
                            {item.perCapita.toLocaleString()} {item.currency}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">Rapporto Debito Totale</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold">
                        {comparisonData.comparison.relativeSize.toFixed(1)}x
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Rapporto tra i debiti totali
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">Differenza Debito/PIL</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold">
                        {comparisonData.comparison.gdpComparison > 0 ? "+" : ""}
                        {comparisonData.comparison.gdpComparison.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Punti percentuali di differenza
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center">Rapporto Pro Capite</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold">
                        {comparisonData.comparison.perCapitaRatio.toFixed(1)}x
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Rapporto tra i debiti pro capite
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="pt-2 text-sm text-gray-500">
                  <p className="text-xs text-center">
                    Questo confronto mostra i valori assoluti del debito pubblico, 
                    il rapporto debito/PIL e il debito pro capite tra i due paesi selezionati.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}