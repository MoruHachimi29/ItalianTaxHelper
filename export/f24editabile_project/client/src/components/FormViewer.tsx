import { useState, useRef, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPDF } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ImageModal from "@/components/ImageModal";
import {
  f24OrdinarySchema,
  f24SimplifiedSchema,
  f24ExciseSchema,
  f24ElideSchema,
  f23Schema,
  type F24Ordinary,
  type F24Simplified,
  type F24Excise,
  type F24Elide,
  type F23
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { calculateTotal } from "@/lib/formUtils";

// Import form images
import f24OrdinarioImage from "@/assets/forms/f24-ordinario.png";
import f24SemplificatoImage from "@/assets/forms/f24-semplificato.png";
import f24AcciseImage from "@/assets/forms/f24-accise.png";
import f24ElideImage from "@/assets/forms/f24-elide.png";
import f23Image from "@/assets/forms/f23.png";

interface FormViewerProps {
  formType: "f24-ordinario" | "f24-semplificato" | "f24-accise" | "f24-elide" | "f23";
}

const formSchemas = {
  "f24-ordinario": f24OrdinarySchema,
  "f24-semplificato": f24SimplifiedSchema,
  "f24-accise": f24ExciseSchema,
  "f24-elide": f24ElideSchema,
  "f23": f23Schema
};

const formTitles = {
  "f24-ordinario": "F24 Ordinario",
  "f24-semplificato": "F24 Semplificato",
  "f24-accise": "F24 Accise",
  "f24-elide": "F24 Elide",
  "f23": "F23"
};

const formImages = {
  "f24-ordinario": f24OrdinarioImage,
  "f24-semplificato": f24SemplificatoImage,
  "f24-accise": f24AcciseImage,
  "f24-elide": f24ElideImage,
  "f23": f23Image
};

export default function FormViewer({ formType }: FormViewerProps) {
  const { toast } = useToast();
  const [total, setTotal] = useState("0,00");
  const formRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Get the correct schema for the form type
  const formSchema = formSchemas[formType];
  
  // Create form with zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fiscalCode: "",
      fullName: "",
      tributeCode: "",
      amount: ""
    }
  });
  
  // Watch the amount field to calculate the total
  const watchAmount = form.watch("amount");
  
  // Update total when amount changes
  useState(() => {
    try {
      const formattedTotal = calculateTotal([watchAmount || "0"]);
      setTotal(formattedTotal);
    } catch (error) {
      // Keep the previous total if there's an error
    }
  });
  
  // Function to download the PDF
  const downloadPDF = useCallback(async () => {
    if (!form.formState.isValid) {
      form.trigger();
      toast({
        title: "Errore",
        description: "Compila correttamente tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const formData = form.getValues();
      // Generate PDF client-side
      await createPDF(formType, formTitles[formType], formData, total);
      
      toast({
        title: "PDF Generato",
        description: "Il tuo PDF è stato scaricato con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione del PDF.",
        variant: "destructive",
      });
    }
  }, [form, formType, total, toast]);
  
  // Function to print the form
  const printForm = useCallback(() => {
    if (!form.formState.isValid) {
      form.trigger();
      toast({
        title: "Errore",
        description: "Compila correttamente tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }
    
    // Open print dialog
    window.print();
    
    toast({
      title: "Stampa",
      description: "Il modulo è stato inviato alla stampa.",
    });
  }, [form, toast]);
  
  // Function to share the form
  const shareForm = useCallback(() => {
    if (!form.formState.isValid) {
      form.trigger();
      toast({
        title: "Errore",
        description: "Compila correttamente tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: `Modulo ${formTitles[formType]}`,
        text: "Ho compilato questo modulo fiscale con ModuliTax",
        url: window.location.href,
      }).then(() => {
        toast({
          title: "Condivisione",
          description: "Il modulo è stato condiviso con successo.",
        });
      }).catch(() => {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la condivisione.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copiato",
          description: "Il link al modulo è stato copiato negli appunti.",
        });
      }).catch(() => {
        toast({
          title: "Errore",
          description: "Impossibile copiare il link negli appunti.",
          variant: "destructive",
        });
      });
    }
  }, [form, formType, toast]);
  
  // Function to save the form data
  const saveForm = useCallback(async () => {
    if (!form.formState.isValid) {
      form.trigger();
      toast({
        title: "Errore",
        description: "Compila correttamente tutti i campi obbligatori.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const formData = form.getValues();
      
      await apiRequest("POST", "/api/forms", {
        type: formType,
        data: formData,
        // In a real application, you would include userId from authentication
        userId: null
      });
      
      toast({
        title: "Modulo Salvato",
        description: "Il modulo è stato salvato con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del modulo.",
        variant: "destructive",
      });
    }
  }, [form, formType, toast]);
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif mb-6 text-center">
        Compila {formTitles[formType]}
      </h1>
      
      <div ref={formRef} className="form-overlay border border-gray-200 rounded-lg overflow-hidden mb-6 relative bg-white">
        {/* Form background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={formImages[formType]} 
            alt={`Modello ${formTitles[formType]}`}
            className="w-full h-full object-contain opacity-20"
          />
        </div>
        <div className="form-content relative z-10 p-6">
          <form onSubmit={form.handleSubmit(saveForm)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <label className="block text-sm mb-1">Codice fiscale</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="Codice fiscale"
                  {...form.register("fiscalCode")}
                />
                {form.formState.errors.fiscalCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.fiscalCode.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Cognome e nome o denominazione</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="Cognome e nome"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Codice tributo</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="Codice tributo"
                  {...form.register("tributeCode")}
                />
                {form.formState.errors.tributeCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.tributeCode.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Importo a debito</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="0,00"
                  {...form.register("amount")}
                />
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">TOTALE</span>
                <span className="font-bold text-xl">€ {total}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          className="flex-1 bg-black text-white hover:bg-gray-900"
          onClick={downloadPDF}
        >
          <span className="material-icons text-sm mr-1">download</span> Scarica PDF
        </Button>
        <Button
          className="flex-1 border border-black bg-white text-black hover:bg-gray-100"
          onClick={printForm}
        >
          <span className="material-icons text-sm mr-1">print</span> Stampa
        </Button>
        <Button
          className="flex-1 border border-black bg-white text-black hover:bg-gray-100"
          onClick={shareForm}
        >
          <span className="material-icons text-sm mr-1">share</span> Condividi
        </Button>
        <Button
          className="flex-1 border border-black bg-white text-black hover:bg-gray-100"
          onClick={saveForm}
        >
          <span className="material-icons text-sm mr-1">save</span> Salva
        </Button>
      </div>
      
      <div className="text-center">
        <Button
          variant="link"
          className="text-black hover:underline inline-flex items-center"
          onClick={() => setShowImageModal(true)}
        >
          <span className="material-icons text-sm mr-1">zoom_in</span> 
          Visualizza modello originale
        </Button>
      </div>
      
      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={formImages[formType]}
        imageAlt={`Modello ${formTitles[formType]}`}
      />
    </div>
  );
}
