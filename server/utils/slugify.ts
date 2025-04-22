/**
 * Converte una stringa in uno slug URL-friendly
 * Gestisce anche caratteri speciali e accenti dell'italiano
 */
export default function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                 // separa gli accenti dalle lettere
    .replace(/[\u0300-\u036f]/g, '') // rimuove i segni diacritici
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')    // rimuove caratteri non alfanumerici
    .replace(/[\s_-]+/g, '-')        // sostituisce spazi, underscore e trattini con un singolo trattino
    .replace(/^-+|-+$/g, '');        // rimuove trattini iniziali e finali
}