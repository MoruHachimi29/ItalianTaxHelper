#!/bin/bash
# Script di build personalizzato che prepara i file per il deployment

# Esegui il build standard
echo "Esecuzione del build standard..."
npm run build

# Crea la directory server in dist se non esiste
echo "Creazione della directory server in dist..."
mkdir -p dist/server

# Copia il file index.js nella posizione corretta
echo "Copia del file index.js nella posizione per il deployment..."
cp dist/index.js dist/server/

# Verifica che il file esista
if [ -f dist/server/index.js ]; then
  echo "Build completato con successo. File pronto per il deployment."
else
  echo "ERRORE: Il file dist/server/index.js non è stato creato correttamente."
  exit 1
fi