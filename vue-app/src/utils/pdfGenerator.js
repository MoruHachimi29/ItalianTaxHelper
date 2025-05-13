import { jsPDF } from "jspdf";

// Importazione delle immagini dei moduli (da aggiungere durante il build effettivo)
const formBackgrounds = {
  "f24-ordinario": "/assets/forms/f24-ordinario.png",
  "f24-semplificato": "/assets/forms/f24-semplificato.png",
  "f24-accise": "/assets/forms/f24-accise.png",
  "f24-elide": "/assets/forms/f24-elide.png",
  "f23": "/assets/forms/f23.png"
};

/**
 * Crea un PDF dai dati del modulo
 * @param {string} formType Il tipo di modulo (es. "f24-ordinario")
 * @param {string} formTitle Il titolo visualizzato nel PDF
 * @param {Object} formData I dati del modulo da includere nel PDF
 * @param {string} total Il totale calcolato
 */
export async function createPDF(
  formType,
  formTitle,
  formData,
  total
) {
  // Crea un nuovo documento PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Aggiungi l'immagine di sfondo del modulo
  try {
    const backgroundImage = formBackgrounds[formType];
    if (backgroundImage) {
      // Approccio semplificato per aggiungere l'immagine senza usare setGState/addGState
      doc.setFillColor(0, 0, 0);
      
      // Aggiungi l'immagine come sfondo
      doc.addImage(
        backgroundImage,
        'PNG',
        10, // x position
        30, // y position
        190, // width
        240, // height
        undefined, // nessun alias
        'NONE' // no compression
      );
    }
  } catch (error) {
    console.error("Error adding background image:", error);
    // Continua anche senza l'immagine di sfondo
  }
  
  // Imposta stili del font
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  
  // Aggiungi titolo
  doc.text(formTitle, 105, 20, { align: "center" });
  
  // Aggiungi il footer ModuliTax
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Generato tramite ModuliTax", 105, 285, { align: "center" });
  
  // Imposta font per i dati del modulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  // Aggiungi i dati del modulo
  let yPosition = 40;
  doc.text("Dati del contribuente:", 20, yPosition);
  yPosition += 8;
  
  // Aggiungi dati del contribuente
  if (formData.fiscalCode) {
    doc.text(`Codice fiscale: ${formData.fiscalCode}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (formData.fullName) {
    doc.text(`Nome e cognome: ${formData.fullName}`, 20, yPosition);
    yPosition += 8;
  }
  
  // Aggiungi una linea separatrice
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Aggiungi dati del pagamento
  doc.text("Dati del pagamento:", 20, yPosition);
  yPosition += 8;
  
  if (formData.tributeCode) {
    doc.text(`Codice tributo: ${formData.tributeCode}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (formData.amount) {
    doc.text(`Importo a debito: € ${formData.amount}`, 20, yPosition);
    yPosition += 8;
  }
  
  // Aggiungi una linea separatrice
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Aggiungi totale
  doc.setFont("helvetica", "bold");
  doc.text(`TOTALE: € ${total}`, 20, yPosition);
  
  // Salva il PDF con un nome che include il tipo di modulo
  doc.save(`modulo-${formType}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Crea un URL condivisibile per il modulo
 * @param {string} formType Il tipo di modulo
 * @param {Object} formData I dati del modulo da codificare nell'URL
 * @returns Una stringa URL con i dati del modulo codificati
 */
export function createShareableLink(formType, formData) {
  const baseUrl = window.location.origin;
  const encodedData = encodeURIComponent(JSON.stringify(formData));
  return `${baseUrl}/moduli/${formType}?data=${encodedData}`;
}