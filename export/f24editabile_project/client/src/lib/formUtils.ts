/**
 * Calculates the total from an array of amount strings
 * @param amounts Array of amount strings in Italian format (e.g. "10,50")
 * @returns Formatted total in Italian format (e.g. "10,50")
 */
export function calculateTotal(amounts: string[]): string {
  let total = 0;
  
  for (const amount of amounts) {
    // Convert from Italian format (comma as decimal separator) to Number
    const cleanAmount = amount.replace(/\./g, "").replace(",", ".");
    const numericAmount = parseFloat(cleanAmount);
    
    if (!isNaN(numericAmount)) {
      total += numericAmount;
    }
  }
  
  // Format back to Italian format
  return total.toFixed(2).replace(".", ",");
}

/**
 * Validates Italian fiscal code format
 * @param fiscalCode The fiscal code to validate
 * @returns True if valid, false otherwise
 */
export function isValidFiscalCode(fiscalCode: string): boolean {
  // Simple validation - a more complete validation would be more complex
  const pattern = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
  return pattern.test(fiscalCode);
}

/**
 * Validates Italian VAT number format
 * @param vatNumber The VAT number to validate
 * @returns True if valid, false otherwise
 */
export function isValidVATNumber(vatNumber: string): boolean {
  // Simple validation for Italian VAT number (11 digits)
  const pattern = /^\d{11}$/;
  return pattern.test(vatNumber);
}

/**
 * Formats a number as Italian currency
 * @param value Number to format
 * @returns Formatted string (e.g. "€ 10,50")
 */
export function formatCurrency(value: number): string {
  return `€ ${value.toFixed(2).replace(".", ",")}`;
}

/**
 * Parses an Italian formatted number string to a number
 * @param value String in Italian format (e.g. "10,50")
 * @returns Number value (e.g. 10.5)
 */
export function parseItalianNumber(value: string): number {
  const cleanValue = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleanValue);
}
