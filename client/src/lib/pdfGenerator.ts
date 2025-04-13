import { jsPDF } from "jspdf";

interface FormData {
  [key: string]: string;
}

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
