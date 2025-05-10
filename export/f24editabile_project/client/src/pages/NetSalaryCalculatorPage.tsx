import NetSalaryCalculator from "@/components/utilities/NetSalaryCalculator";

export default function NetSalaryCalculatorPage() {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Calcolo Stipendio Netto</h1>
          <p className="text-lg text-gray-600">
            Calcola il tuo stipendio netto mensile a partire dal lordo annuale (RAL).
            Aggiornato con le aliquote fiscali 2025 e le ultime normative.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <NetSalaryCalculator />
        </div>
      </div>
    </div>
  );
}