import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrencyConverter from "../components/utilities/CurrencyConverter";
import DutyCalculator from "../components/utilities/DutyCalculator";
import P7mConverter from "../components/utilities/P7mConverter";

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState("currency");

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
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <Tabs 
            defaultValue="currency" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="currency">Convertitore di Valuta</TabsTrigger>
              <TabsTrigger value="duty">Calcolatore Dazi</TabsTrigger>
              <TabsTrigger value="p7m">Convertitore P7M</TabsTrigger>
            </TabsList>
            
            <TabsContent value="currency" className="mt-6">
              <CurrencyConverter />
            </TabsContent>
            
            <TabsContent value="duty" className="mt-6">
              <DutyCalculator />
            </TabsContent>
            
            <TabsContent value="p7m" className="mt-6">
              <P7mConverter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}