import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Definizione delle aliquote IRPEF 2025
const IRPEF_RATES_2025 = [
  { limit: 28000, rate: 0.23 },
  { limit: 50000, rate: 0.35 },
  { limit: Infinity, rate: 0.43 }
];

// Percentuali INPS per dipendenti (variano in base al CCNL)
const INPS_RATES = {
  "commercio": 0.0919, // 9.19% per commercio
  "industria": 0.0919, // 9.19% per industria
  "artigianato": 0.0919, // 9.19% per artigianato
  "turismo": 0.0919, // 9.19% per turismo
  "agricoltura": 0.0889, // 8.89% per agricoltura
  "edilizia": 0.0919, // 9.19% per edilizia
  "trasporti": 0.0919, // 9.19% per trasporti
  "credito": 0.0919, // 9.19% per credito e assicurazioni
  "pubblico": 0.0819, // 8.19% per pubblico impiego
  "sanita": 0.0919, // 9.19% per sanità privata
  "scuola": 0.0819, // 8.19% per scuola e istruzione privata
  "altro": 0.0919, // 9.19% valore standard
};

// Giorni lavorativi standard per tipo di contratto
const WORKING_DAYS: Record<string, number> = {
  "full-time": 260, // 5 giorni a settimana per circa 52 settimane
  "part-time-5": 260, // part-time 5 giorni a settimana
  "part-time-4": 208, // part-time 4 giorni a settimana
  "part-time-3": 156, // part-time 3 giorni a settimana
  "turni": 240, // lavoro a turni in media
  "stagionale": 180, // contratto stagionale
  "flessibile": 240, // orario flessibile
  "custom": 365, // personalizzato (calendario completo - 365 giorni)
};

// Detrazioni
const BASE_DEDUCTION = 3000; // Detrazione di base per lavoro dipendente
const MAX_DEDUCTION_INCOME = 15000; // Reddito massimo per detrazione completa

// Aliquote addizionali regionali 2025 (percentuali)
const REGIONAL_TAX_RATES = {
  "abruzzo": 0.0173,
  "basilicata": 0.0173,
  "calabria": 0.0196,
  "campania": 0.0203,
  "emilia-romagna": 0.0193,
  "friuli-venezia-giulia": 0.0123,
  "lazio": 0.0173,
  "liguria": 0.0148,
  "lombardia": 0.0133,
  "marche": 0.0173,
  "molise": 0.0183,
  "piemonte": 0.0162,
  "puglia": 0.0133,
  "sardegna": 0.0123,
  "sicilia": 0.0173,
  "toscana": 0.0148,
  "trentino-alto-adige": 0.0123,
  "umbria": 0.0153,
  "valle-aosta": 0.0123,
  "veneto": 0.0123,
  "media": 0.0139, // 1.39% media nazionale
};

// Aliquote addizionali comunali 2025 (percentuali - valori approssimativi)
const MUNICIPAL_TAX_RATES = {
  "roma": 0.009,
  "milano": 0.008,
  "napoli": 0.01,
  "torino": 0.008,
  "palermo": 0.008,
  "genova": 0.008,
  "bologna": 0.008,
  "firenze": 0.007,
  "bari": 0.008,
  "catania": 0.008,
  "venezia": 0.008,
  "verona": 0.007,
  "messina": 0.008,
  "padova": 0.007,
  "trieste": 0.006,
  "brescia": 0.006,
  "parma": 0.008,
  "modena": 0.007,
  "reggio-calabria": 0.008,
  "reggio-emilia": 0.008,
  "perugia": 0.007,
  "livorno": 0.007,
  "cagliari": 0.007,
  "foggia": 0.008,
  "rimini": 0.007,
  "salerno": 0.008,
  "ferrara": 0.008,
  "sassari": 0.007,
  "siracusa": 0.008,
  "pescara": 0.008,
  "monza": 0.007,
  "bergamo": 0.006,
  "forlì": 0.007,
  "trento": 0.006,
  "vicenza": 0.007,
  "bolzano": 0.006,
  "novara": 0.008,
  "piacenza": 0.008,
  "ancona": 0.008,
  "media": 0.00701, // 0.701% media nazionale
};

export default function NetSalaryCalculator() {
  // Stati per i valori del form
  const [grossAnnualSalary, setGrossAnnualSalary] = useState("");
  const [monthlyPayments, setMonthlyPayments] = useState("13");
  const [contractType, setContractType] = useState("commercio"); // Tipo di contratto (CCNL)
  const [workSchedule, setWorkSchedule] = useState("full-time"); // Tipo di orario lavorativo
  const [workingDays, setWorkingDays] = useState("365"); // Giorni lavorati in un anno (default 365 per calendario completo)
  const [dependents, setDependents] = useState("0"); // Familiari a carico
  const [region, setRegion] = useState("media"); // Regione per calcolo addizionale regionale
  const [city, setCity] = useState("media"); // Comune per calcolo addizionale comunale
  const [customDays, setCustomDays] = useState(false); // Se true, l'utente specifica manualmente i giorni
  
  // Stato per i risultati
  const [calculationResults, setCalculationResults] = useState<any>(null);
  
  // Aggiorna i giorni lavorativi quando cambia il tipo di orario
  useEffect(() => {
    if (!customDays && workSchedule !== "custom") {
      setWorkingDays(WORKING_DAYS[workSchedule as keyof typeof WORKING_DAYS].toString());
    }
  }, [workSchedule, customDays]);

  // Calcola lo stipendio netto
  const calculateNetSalary = () => {
    // Converti gli input in numeri
    const grossAnnual = parseFloat(grossAnnualSalary);
    const payments = parseInt(monthlyPayments);
    const days = parseInt(workingDays);
    const deps = parseInt(dependents);
    
    if (isNaN(grossAnnual) || grossAnnual <= 0) {
      return;
    }
    
    // 1. Calcolo dei contributi INPS in base al tipo di contratto
    const inpsRate = INPS_RATES[contractType as keyof typeof INPS_RATES];
    const inpsContribution = grossAnnual * inpsRate;
    const taxableIncome = grossAnnual - inpsContribution;
    
    // 2. Calcolo IRPEF progressiva
    let irpef = 0;
    let previousLimit = 0;
    
    for (const bracket of IRPEF_RATES_2025) {
      if (taxableIncome > previousLimit) {
        const taxableInBracket = Math.min(taxableIncome - previousLimit, bracket.limit - previousLimit);
        irpef += taxableInBracket * bracket.rate;
        previousLimit = bracket.limit;
        
        if (taxableIncome <= bracket.limit) {
          break;
        }
      }
    }
    
    // 3. Calcolo detrazioni da lavoro dipendente
    let workDeduction = 0;
    if (taxableIncome <= MAX_DEDUCTION_INCOME) {
      workDeduction = BASE_DEDUCTION;
    } else {
      // Riduzione progressiva delle detrazioni oltre 15.000€
      const reductionFactor = (50000 - taxableIncome) / (50000 - MAX_DEDUCTION_INCOME);
      workDeduction = BASE_DEDUCTION * Math.max(0, reductionFactor);
    }
    
    // Detrazioni per familiari a carico
    const dependentDeduction = deps * 950; // 950€ per familiare a carico
    
    // Totale detrazioni
    const totalDeductions = workDeduction + dependentDeduction;
    
    // IRPEF finale dopo detrazioni (non può essere negativa)
    const finalIrpef = Math.max(0, irpef - totalDeductions);
    
    // 4. Addizionali regionali e comunali in base alla regione e comune selezionati
    const regionalRate = REGIONAL_TAX_RATES[region as keyof typeof REGIONAL_TAX_RATES];
    const municipalRate = MUNICIPAL_TAX_RATES[city as keyof typeof MUNICIPAL_TAX_RATES];
    const regionalTax = taxableIncome * regionalRate;
    const municipalTax = taxableIncome * municipalRate;
    
    // 5. Calcolo stipendio netto annuale
    const netAnnualSalary = grossAnnual - inpsContribution - finalIrpef - regionalTax - municipalTax;
    
    // 6. Calcolo stipendio netto mensile (diviso per il numero di mensilità)
    const netMonthlySalary = netAnnualSalary / payments;
    
    // 7. Calcolo della giornaliera (se richiesto)
    const dailyRate = netAnnualSalary / days;
    
    // Imposta i risultati
    setCalculationResults({
      grossAnnual: grossAnnual.toFixed(2),
      inpsContribution: inpsContribution.toFixed(2),
      taxableIncome: taxableIncome.toFixed(2),
      irpef: irpef.toFixed(2),
      deductions: totalDeductions.toFixed(2),
      finalIrpef: finalIrpef.toFixed(2),
      regionalTax: regionalTax.toFixed(2),
      municipalTax: municipalTax.toFixed(2),
      netAnnual: netAnnualSalary.toFixed(2),
      netMonthly: netMonthlySalary.toFixed(2),
      dailyRate: dailyRate.toFixed(2),
      taxRate: ((grossAnnual - netAnnualSalary) / grossAnnual * 100).toFixed(2)
    });
  };
  
  // Resetta il form
  const resetForm = () => {
    setGrossAnnualSalary("");
    setMonthlyPayments("13");
    setContractType("commercio");
    setWorkSchedule("full-time");
    setWorkingDays("365");
    setCustomDays(false);
    setDependents("0");
    setRegion("media");
    setCity("media");
    setCalculationResults(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calcolatore</TabsTrigger>
          <TabsTrigger value="info">Informazioni</TabsTrigger>
        </TabsList>
        
        {/* Sezione Calcolatore */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="grossAnnualSalary">Retribuzione Annua Lorda (RAL)</Label>
              <Input
                id="grossAnnualSalary"
                type="number"
                placeholder="es. 30000"
                value={grossAnnualSalary}
                onChange={(e) => setGrossAnnualSalary(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="monthlyPayments">Mensilità</Label>
              <Select value={monthlyPayments} onValueChange={setMonthlyPayments}>
                <SelectTrigger id="monthlyPayments" className="mt-1">
                  <SelectValue placeholder="Seleziona mensilità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 mensilità</SelectItem>
                  <SelectItem value="13">13 mensilità</SelectItem>
                  <SelectItem value="14">14 mensilità</SelectItem>
                  <SelectItem value="15">15 mensilità</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="contractType">Tipo di contratto (CCNL)</Label>
              <Select value={contractType} onValueChange={setContractType}>
                <SelectTrigger id="contractType" className="mt-1">
                  <SelectValue placeholder="Seleziona contratto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercio">Commercio</SelectItem>
                  <SelectItem value="industria">Industria</SelectItem>
                  <SelectItem value="artigianato">Artigianato</SelectItem>
                  <SelectItem value="turismo">Turismo</SelectItem>
                  <SelectItem value="agricoltura">Agricoltura</SelectItem>
                  <SelectItem value="edilizia">Edilizia</SelectItem>
                  <SelectItem value="trasporti">Trasporti</SelectItem>
                  <SelectItem value="credito">Credito e Assicurazioni</SelectItem>
                  <SelectItem value="pubblico">Pubblico Impiego</SelectItem>
                  <SelectItem value="sanita">Sanità Privata</SelectItem>
                  <SelectItem value="scuola">Scuola e Istruzione</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="workSchedule">Tipo di orario di lavoro</Label>
              <Select 
                value={workSchedule} 
                onValueChange={(val) => {
                  setWorkSchedule(val);
                  if (val === "custom") {
                    setCustomDays(true);
                  }
                }}
              >
                <SelectTrigger id="workSchedule" className="mt-1">
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time (5 giorni/settimana)</SelectItem>
                  <SelectItem value="part-time-5">Part-time (5 giorni/settimana)</SelectItem>
                  <SelectItem value="part-time-4">Part-time (4 giorni/settimana)</SelectItem>
                  <SelectItem value="part-time-3">Part-time (3 giorni/settimana)</SelectItem>
                  <SelectItem value="turni">Lavoro a turni</SelectItem>
                  <SelectItem value="stagionale">Lavoro stagionale</SelectItem>
                  <SelectItem value="flessibile">Orario flessibile</SelectItem>
                  <SelectItem value="custom">Personalizzato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="workingDays">Giorni lavorati all'anno</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customDays"
                    checked={customDays}
                    onCheckedChange={(checked) => {
                      setCustomDays(checked === true);
                      if (checked === false && workSchedule !== "custom") {
                        setWorkingDays(WORKING_DAYS[workSchedule as keyof typeof WORKING_DAYS].toString());
                      }
                    }}
                  />
                  <label
                    htmlFor="customDays"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Personalizza
                  </label>
                </div>
              </div>
              <Input
                id="workingDays"
                type="number"
                placeholder="es. 365"
                value={workingDays}
                onChange={(e) => {
                  setWorkingDays(e.target.value);
                  // Se l'utente modifica manualmente, impostiamo customDays a true
                  if (!customDays) {
                    setCustomDays(true);
                  }
                }}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="dependents">Familiari a carico</Label>
              <Select value={dependents} onValueChange={setDependents}>
                <SelectTrigger id="dependents" className="mt-1">
                  <SelectValue placeholder="Seleziona numero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Nessuno</SelectItem>
                  <SelectItem value="1">1 familiare</SelectItem>
                  <SelectItem value="2">2 familiari</SelectItem>
                  <SelectItem value="3">3 familiari</SelectItem>
                  <SelectItem value="4">4 familiari</SelectItem>
                  <SelectItem value="5">5 o più familiari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="region">Regione</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region" className="mt-1">
                  <SelectValue placeholder="Seleziona regione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="media">Media nazionale</SelectItem>
                  <SelectItem value="abruzzo">Abruzzo</SelectItem>
                  <SelectItem value="basilicata">Basilicata</SelectItem>
                  <SelectItem value="calabria">Calabria</SelectItem>
                  <SelectItem value="campania">Campania</SelectItem>
                  <SelectItem value="emilia-romagna">Emilia-Romagna</SelectItem>
                  <SelectItem value="friuli-venezia-giulia">Friuli-Venezia Giulia</SelectItem>
                  <SelectItem value="lazio">Lazio</SelectItem>
                  <SelectItem value="liguria">Liguria</SelectItem>
                  <SelectItem value="lombardia">Lombardia</SelectItem>
                  <SelectItem value="marche">Marche</SelectItem>
                  <SelectItem value="molise">Molise</SelectItem>
                  <SelectItem value="piemonte">Piemonte</SelectItem>
                  <SelectItem value="puglia">Puglia</SelectItem>
                  <SelectItem value="sardegna">Sardegna</SelectItem>
                  <SelectItem value="sicilia">Sicilia</SelectItem>
                  <SelectItem value="toscana">Toscana</SelectItem>
                  <SelectItem value="trentino-alto-adige">Trentino-Alto Adige</SelectItem>
                  <SelectItem value="umbria">Umbria</SelectItem>
                  <SelectItem value="valle-aosta">Valle d'Aosta</SelectItem>
                  <SelectItem value="veneto">Veneto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city">Comune</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city" className="mt-1">
                  <SelectValue placeholder="Seleziona comune" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="media">Media nazionale</SelectItem>
                  <SelectItem value="roma">Roma</SelectItem>
                  <SelectItem value="milano">Milano</SelectItem>
                  <SelectItem value="napoli">Napoli</SelectItem>
                  <SelectItem value="torino">Torino</SelectItem>
                  <SelectItem value="palermo">Palermo</SelectItem>
                  <SelectItem value="genova">Genova</SelectItem>
                  <SelectItem value="bologna">Bologna</SelectItem>
                  <SelectItem value="firenze">Firenze</SelectItem>
                  <SelectItem value="bari">Bari</SelectItem>
                  <SelectItem value="catania">Catania</SelectItem>
                  <SelectItem value="venezia">Venezia</SelectItem>
                  <SelectItem value="verona">Verona</SelectItem>
                  <SelectItem value="messina">Messina</SelectItem>
                  <SelectItem value="padova">Padova</SelectItem>
                  <SelectItem value="trieste">Trieste</SelectItem>
                  <SelectItem value="brescia">Brescia</SelectItem>
                  <SelectItem value="parma">Parma</SelectItem>
                  <SelectItem value="modena">Modena</SelectItem>
                  <SelectItem value="reggio-calabria">Reggio Calabria</SelectItem>
                  <SelectItem value="reggio-emilia">Reggio Emilia</SelectItem>
                  <SelectItem value="perugia">Perugia</SelectItem>
                  <SelectItem value="livorno">Livorno</SelectItem>
                  <SelectItem value="cagliari">Cagliari</SelectItem>
                  <SelectItem value="foggia">Foggia</SelectItem>
                  <SelectItem value="rimini">Rimini</SelectItem>
                  <SelectItem value="salerno">Salerno</SelectItem>
                  <SelectItem value="ferrara">Ferrara</SelectItem>
                  <SelectItem value="sassari">Sassari</SelectItem>
                  <SelectItem value="siracusa">Siracusa</SelectItem>
                  <SelectItem value="pescara">Pescara</SelectItem>
                  <SelectItem value="monza">Monza</SelectItem>
                  <SelectItem value="bergamo">Bergamo</SelectItem>
                  <SelectItem value="forlì">Forlì</SelectItem>
                  <SelectItem value="trento">Trento</SelectItem>
                  <SelectItem value="vicenza">Vicenza</SelectItem>
                  <SelectItem value="bolzano">Bolzano</SelectItem>
                  <SelectItem value="novara">Novara</SelectItem>
                  <SelectItem value="piacenza">Piacenza</SelectItem>
                  <SelectItem value="ancona">Ancona</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button onClick={calculateNetSalary} className="w-full sm:w-auto">
              Calcola Stipendio Netto
            </Button>
            <Button variant="outline" onClick={resetForm} className="w-full sm:w-auto">
              Azzera
            </Button>
          </div>
          
          {calculationResults && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-center">Risultato del calcolo</CardTitle>
                <CardDescription className="text-center">
                  Dati aggiornati alle normative fiscali 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Stipendio Lordo Annuale:</span>
                      <span className="font-medium">€ {calculationResults.grossAnnual}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Contributi INPS:</span>
                      <span className="font-medium text-red-600">- € {calculationResults.inpsContribution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reddito imponibile:</span>
                      <span className="font-medium">€ {calculationResults.taxableIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IRPEF lorda:</span>
                      <span className="font-medium text-red-600">- € {calculationResults.irpef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Detrazioni:</span>
                      <span className="font-medium text-green-600">+ € {calculationResults.deductions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IRPEF netta:</span>
                      <span className="font-medium text-red-600">- € {calculationResults.finalIrpef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Addizionale regionale:</span>
                      <span className="font-medium text-red-600">- € {calculationResults.regionalTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Addizionale comunale:</span>
                      <span className="font-medium text-red-600">- € {calculationResults.municipalTax}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-1">Stipendio Netto Mensile</h4>
                        <div className="text-3xl font-bold">€ {calculationResults.netMonthly}</div>
                        <div className="text-sm text-gray-500">Per {monthlyPayments} mensilità</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Netto Annuale:</span>
                        <span className="font-medium text-green-600">€ {calculationResults.netAnnual}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Retribuzione giornaliera:</span>
                        <span className="font-medium">€ {calculationResults.dailyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Aliquota fiscale media:</span>
                        <span className="font-medium">{calculationResults.taxRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 text-sm text-gray-500">
                  <p className="text-xs text-center">
                    I calcoli sono basati sulla normativa fiscale italiana 2025. I valori possono variare in base 
                    al CCNL applicato e altre situazioni personali. Per un calcolo preciso, consulta un commercialista.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Sezione Informazioni */}
        <TabsContent value="info" className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Come funziona il calcolatore?</AccordionTrigger>
              <AccordionContent>
                <p>L'applicazione calcola lo stipendio netto mensile partendo dal lordo inserito, calcola i contributi INPS, l'IRPEF dovuta e le detrazioni. Il risultato rappresenta quanto effettivamente riceverai ogni mese sul tuo conto corrente.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Come si calcola lo stipendio netto?</AccordionTrigger>
              <AccordionContent>
                <p>Per calcolare lo stipendio netto nel 2025 è necessario conoscere l'ammontare lordo annuale (RAL). Da questo importo vengono sottratti:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>I contributi previdenziali (INPS)</li>
                  <li>L'IRPEF (dal 2024 con un'aliquota del 23% fino a 28.000 euro)</li>
                  <li>Le addizionali IRPEF regionali e comunali</li>
                </ul>
                <p className="mt-2">Successivamente vengono applicate le detrazioni per lavoro dipendente e per familiari a carico, ottenendo così l'importo netto finale.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Quali sono le aliquote IRPEF 2025?</AccordionTrigger>
              <AccordionContent>
                <p>Le aliquote IRPEF 2025 sono strutturate in 3 scaglioni:</p>
                <div className="mt-2 space-y-1">
                  <p><strong>23%</strong> per redditi fino a € 28.000</p>
                  <p><strong>35%</strong> per redditi da € 28.001 a € 50.000</p>
                  <p><strong>43%</strong> per redditi oltre € 50.000</p>
                </div>
                <p className="mt-2">Dal 2024 sono stati accorpati i primi due scaglioni con un'aliquota unificata del 23% fino a 28.000 euro.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Lo stipendio netto calcolato è preciso?</AccordionTrigger>
              <AccordionContent>
                <p>Il valore è attendibile e tiene conto delle mensilità indicate in busta paga e dei giorni effettivi di lavoro dipendente, ma può variare a seconda del contratto di lavoro (CCNL commercio, edilizia, alimentari, artigianato ecc.) il quale potrebbe prevedere contributi specifici aggiuntivi di categoria e un differente contributo INPS.</p>
                <p className="mt-2">Lo stipendio netto inoltre non tiene conto di eventuali detrazioni e deduzioni aggiuntive quali spese mediche, deduzione abitazione principale, che vengono applicate alla dichiarazione dei redditi.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Cosa influisce sul calcolo dello stipendio netto?</AccordionTrigger>
              <AccordionContent>
                <p>Diversi fattori possono influenzare il calcolo dello stipendio netto:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tipologia di contratto di lavoro e CCNL applicato</li>
                  <li>Numero di mensilità previste (13, 14 o più)</li>
                  <li>Presenza di familiari a carico</li>
                  <li>Regione e comune di residenza (per le addizionali)</li>
                  <li>Deduzioni e detrazioni specifiche (mutuo, spese sanitarie, ecc.)</li>
                  <li>Eventuale presenza di redditi aggiuntivi</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-gray-500">
            <h3 className="font-medium text-black mb-2">Note legali</h3>
            <p>Il presente calcolatore offre una simulazione indicativa e non costituisce consulenza fiscale o legale. I calcoli sono basati sulla normativa fiscale italiana 2025, ma potrebbero non riflettere situazioni individuali specifiche.</p>
            <p className="mt-2">Per un calcolo preciso della propria situazione fiscale, è sempre consigliabile rivolgersi a un commercialista o consulente fiscale.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}