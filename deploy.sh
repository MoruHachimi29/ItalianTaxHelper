#!/bin/bash
# Script per il deployment della versione semplificata

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Inizio del processo di deployment semplificato...${NC}"

# Pulizia directory di build
echo -e "${YELLOW}Pulizia della directory di build...${NC}"
rm -rf dist
mkdir -p dist

# Build frontend
echo -e "${YELLOW}Build del frontend...${NC}"
npx vite build --config vite.config.simple.js

# Verifica se ci sono errori
if [ $? -ne 0 ]; then
  echo -e "${RED}Errore durante il build del frontend. Processo interrotto.${NC}"
  exit 1
fi

# Copia dei file server
echo -e "${YELLOW}Preparazione dei file server...${NC}"
mkdir -p dist/server

# Transpilazione di src/server.js e src/index.js
echo -e "${YELLOW}Transpilazione dei file server...${NC}"
npx esbuild src/server.js src/index.js src/api/*.js --platform=node --packages=external --format=esm --outdir=dist/server

# Verifica se ci sono errori
if [ $? -ne 0 ]; then
  echo -e "${RED}Errore durante la transpilazione dei file server. Processo interrotto.${NC}"
  exit 1
fi

# Crea un index.js nella radice di dist
echo -e "${YELLOW}Creazione del punto di ingresso principale...${NC}"
cat > dist/index.js << EOL
// Questo file è il punto di ingresso principale per il deployment
// Esporta il server dalla directory server
export * from './server/index.js';
EOL

# Verifica che i file necessari esistano
echo -e "${YELLOW}Verifica dei file necessari...${NC}"
if [ -f dist/index.html ] && [ -f dist/index.js ] && [ -f dist/server/index.js ]; then
  echo -e "${GREEN}Tutti i file necessari sono stati creati correttamente.${NC}"
else
  echo -e "${RED}Mancano alcuni file necessari:${NC}"
  [ -f dist/index.html ] || echo -e "${RED}Manca dist/index.html${NC}"
  [ -f dist/index.js ] || echo -e "${RED}Manca dist/index.js${NC}"
  [ -f dist/server/index.js ] || echo -e "${RED}Manca dist/server/index.js${NC}"
  exit 1
fi

echo -e "${GREEN}Processo di build completato con successo!${NC}"
echo -e "${GREEN}Il progetto è pronto per il deployment su Replit.${NC}"