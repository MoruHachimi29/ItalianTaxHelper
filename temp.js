/**
* Approccio semplificato per la conversione del PDF che preserva il testo originale
*/

// Nel formato DOCX
// Prima creiamo un div di content control attorno al paragrafo originale
// per dividere in paragrafi il testo del PDF
const rawPdfText = pdfContent;

// Invece di usare la nostra logica sofisticata che potrebbe perdere contenuto,
// aggiungiamo semplicemente il testo in paragrafi semplici
const paragraphs = rawPdfText.split('\n')
  .filter(line => line.trim().length > 0)
  .map(line => line.trim());

// Aggiungi ogni linea trovata come paragrafo separato al documento
for (const paragraph of paragraphs) {
  allParagraphs.push(
    new Paragraph({
      text: paragraph,
      spacing: {
        before: 80,
        after: 80
      }
    })
  );
}