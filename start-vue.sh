#!/bin/bash

# Script per avviare l'applicazione Vue.js in ambiente di sviluppo su Replit

echo "🚀 Avvio dell'applicazione Vue.js..."

# Naviga nella directory dell'app Vue
cd vue-app

# Installa le dipendenze se necessario
if [ ! -d "node_modules" ]; then
  echo "📦 Installazione delle dipendenze Vue.js..."
  npm install
fi

# Pulisci la cache di Vite (per evitare problemi dopo le modifiche alla configurazione)
echo "🧹 Pulizia della cache di Vite..."
rm -rf node_modules/.vite || true

# Visualizza informazioni utili
echo "ℹ️  Informazioni utili:"
echo "  - Replit URL: $(hostname -I | awk '{print $1}')"
echo "  - Porta Vite: 3000"
echo "  - Node.js: $(node -v)"
echo "  - NPM: $(npm -v)"

# Avvia l'applicazione Vue
echo "🌐 Avvio del server di sviluppo Vue.js..."
echo "   L'applicazione sarà disponibile all'URL fornito da Replit."
echo "   Se l'avvio è bloccato, assicurati che il server principale sia in esecuzione."
npm run dev