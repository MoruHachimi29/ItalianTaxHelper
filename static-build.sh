#!/bin/bash
# Script per eseguire il deployment statico

# Questo script esegue il processo di creazione della versione statica del sito
# e la prepara per il deployment su hosting statici

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Inizio del processo di creazione della versione statica...${NC}"

# Esecuzione dello script Node.js
echo -e "${YELLOW}Esecuzione dello script static-deploy.js...${NC}"
node static-deploy.js

# Verifica se ci sono errori
if [ $? -ne 0 ]; then
  echo -e "${RED}Errore durante la creazione della versione statica. Processo interrotto.${NC}"
  exit 1
fi

# Mostra istruzioni per il deployment
echo -e "${GREEN}Versione statica creata con successo!${NC}"
echo -e "${GREEN}I file sono disponibili nella directory 'dist'${NC}"
echo -e "${YELLOW}Istruzioni per il deployment:${NC}"
echo -e "1. Per Replit: Utilizzare il pulsante di deployment dalla UI di Replit"
echo -e "2. In alternativa, è possibile utilizzare uno dei seguenti servizi di hosting statici:"
echo -e "   - GitHub Pages: Carica la directory dist in un repository GitHub e configura GitHub Pages"
echo -e "   - Netlify: Carica la directory dist o collega il repository GitHub"
echo -e "   - Vercel: Carica la directory dist o collega il repository GitHub"
echo -e "   - Cloudflare Pages: Carica la directory dist o collega il repository GitHub"
echo -e ""
echo -e "${YELLOW}Nota:${NC} I file di configurazione per i diversi servizi di hosting sono già inclusi nella directory dist"