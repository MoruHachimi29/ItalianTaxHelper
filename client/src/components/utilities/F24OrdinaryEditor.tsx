
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPDF } from "@/lib/pdfGenerator";

export default function F24OrdinaryEditor() {
  const [formData, setFormData] = useState({
    banca: "",
    fiscalCode: "",
    fullName: "",
    tributeCode: "",
    amount: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await createPDF(
        "f24-ordinario",
        "Modello F24 Ordinario",
        formData,
        formData.amount
      );
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="banca">Banca</Label>
          <Input
            id="banca"
            name="banca"
            value={formData.banca}
            onChange={handleInputChange}
            placeholder="Nome della banca"
          />
        </div>
        
        <div>
          <Label htmlFor="fiscalCode">Codice Fiscale</Label>
          <Input
            id="fiscalCode"
            name="fiscalCode"
            value={formData.fiscalCode}
            onChange={handleInputChange}
            placeholder="Inserisci il codice fiscale"
          />
        </div>

        <div>
          <Label htmlFor="fullName">Nome e Cognome</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Inserisci nome e cognome"
          />
        </div>

        <div>
          <Label htmlFor="tributeCode">Codice Tributo</Label>
          <Input
            id="tributeCode"
            name="tributeCode"
            value={formData.tributeCode}
            onChange={handleInputChange}
            placeholder="Inserisci il codice tributo"
          />
        </div>

        <div>
          <Label htmlFor="amount">Importo</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Inserisci l'importo"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Genera F24
      </Button>
    </div>
  );
}
