/**
 * Questo file è un wrapper per l'index.js per il deployment
 * Serve ad assicurarsi che il file server/index.js venga trovato durante il deployment
 */

// Importa e esegui il server principale
import './index.js';

console.log('Deploy server wrapper inizializzato');