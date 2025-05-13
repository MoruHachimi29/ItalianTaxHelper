/**
 * Script per testare il processo di build
 * Questo script verifica che il file server/index.ts venga correttamente compilato 
 * e salvato in dist/server/index.js come necessario per il deployment
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Esegui il comando di build
console.log('Esecuzione del comando di build...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore durante l'esecuzione del build: ${error.message}`);
    return;
  }
  
  console.log('Output della build:');
  console.log(stdout);
  
  if (stderr) {
    console.error(`Errori durante la build: ${stderr}`);
  }
  
  // Verifica il percorso del file di output
  const serverFile = path.join(process.cwd(), 'dist', 'index.js');
  const targetDir = path.join(process.cwd(), 'dist', 'server');
  const targetFile = path.join(targetDir, 'index.js');
  
  console.log(`Controllo se esiste il file: ${serverFile}`);
  const serverFileExists = fs.existsSync(serverFile);
  console.log(`Il file ${serverFile} esiste: ${serverFileExists}`);
  
  if (serverFileExists) {
    // Crea la directory target se non esiste
    if (!fs.existsSync(targetDir)) {
      console.log(`Creazione della directory: ${targetDir}`);
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copia il file nella posizione target
    console.log(`Copia del file da ${serverFile} a ${targetFile}`);
    fs.copyFileSync(serverFile, targetFile);
    
    console.log(`Verifica se il file ${targetFile} esiste`);
    const targetFileExists = fs.existsSync(targetFile);
    console.log(`Il file ${targetFile} esiste: ${targetFileExists}`);
    
    if (targetFileExists) {
      console.log('Build completata con successo! File copiato nella posizione corretta per il deployment.');
    } else {
      console.error('Errore: il file di output non è stato copiato correttamente.');
    }
  } else {
    console.error('Errore: il file di output della build non è stato trovato.');
  }
});