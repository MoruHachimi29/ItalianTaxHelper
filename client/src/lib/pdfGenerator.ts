import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";

// Import form images
import f24OrdinarioImage from "@/assets/forms/f24-ordinario.png";
import f24SemplificatoImage from "@/assets/forms/f24-semplificato.png";
import f24AcciseImage from "@/assets/forms/f24-accise.png";
import f24ElideImage from "@/assets/forms/f24-elide.png";
import f23Image from "@/assets/forms/f23.png";

interface FormData {
  [key: string]: string;
}

const formBackgrounds = {
  "f24-ordinario": f24OrdinarioImage,
  "f24-semplificato": f24SemplificatoImage,
  "f24-accise": f24AcciseImage,
  "f24-elide": f24ElideImage,
  "f23": f23Image
};

/**
 * Creates a PDF from form data
 * @param formType The type of form (e.g. "f24-ordinario")
 * @param formTitle The display title of the form
 * @param formData The form data to include in the PDF
 * @param total The calculated total
 */
export async function createPDF(
  formType: string,
  formTitle: string,
  formData: FormData,
  total: string
): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Add the form background image (con una gestione migliorata dell'immagine)
  try {
    const backgroundImage = formBackgrounds[formType as keyof typeof formBackgrounds];
    if (backgroundImage) {
      // Utilizziamo un approccio più semplice e affidabile per caricare l'immagine
      // Utilizzando l'URL diretto dell'immagine invece dell'oggetto Image
      
      // Impostiamo direttamente l'opacità del testo a 1.0 
      // (evitiamo di impostare l'opacità dell'immagine che può causare problemi)
      doc.setFillColor(0, 0, 0);
      
      // Aggiungiamo l'immagine come sfondo
      doc.addImage(
        backgroundImage,
        'PNG',
        10, // x position
        30, // y position
        190, // width
        240, // height
        undefined, // nessun alias (potrebbe causare conflitti)
        'NONE' // no compression
      );
    }
  } catch (error) {
    console.error("Error adding background image:", error);
    // In caso di errore con l'immagine, continuiamo comunque con il resto del PDF
  }
  
  // Set font styles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  
  // Add title
  doc.text(formTitle, 105, 20, { align: "center" });
  
  // Add ModuliTax footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Generato tramite ModuliTax", 105, 285, { align: "center" });
  
  // Set font for the form data
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  // Add form data
  let yPosition = 40;
  doc.text("Dati del contribuente:", 20, yPosition);
  yPosition += 8;
  
  // Add contributor data
  if (formData.fiscalCode) {
    doc.text(`Codice fiscale: ${formData.fiscalCode}`, 20, yPosition);
    yPosition += 8;
  }
  
  if (formData.fullName) {
    doc.text(`Nome e cognome: ${formData.fullName}`, 20, yPosition);
    yPosition += 8;
  }
  
  // Add a separator line
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Add payment data
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
  
  // Add a separator line
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Add total
  doc.setFont("helvetica", "bold");
  doc.text(`TOTALE: € ${total}`, 20, yPosition);
  
  // Save the PDF with a filename that includes the form type
  doc.save(`modulo-${formType}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Creates a shareable URL to the form
 * @param formType The type of form
 * @param formData The form data to encode in the URL
 * @returns A URL string with the form data encoded
 */
export function createShareableLink(formType: string, formData: FormData): string {
  const baseUrl = window.location.origin;
  const encodedData = encodeURIComponent(JSON.stringify(formData));
  return `${baseUrl}/moduli/${formType}?data=${encodedData}`;
}
