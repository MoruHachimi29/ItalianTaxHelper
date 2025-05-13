# Guida al Deployment di F24Editabile

Questa guida spiega come implementare e pubblicare il progetto F24Editabile utilizzando diverse metodologie.

## Opzione 1: Versione Statica (Consigliata)

La soluzione più semplice e affidabile per il deployment è utilizzare la versione statica del progetto, che elimina la necessità di un server Node.js.

### Passaggi per la creazione della versione statica:

1. Rendi eseguibile lo script di build:
   ```bash
   chmod +x static-build.sh
   ```

2. Esegui lo script per creare la versione statica:
   ```bash
   ./static-build.sh
   ```

3. Al termine, i file statici saranno disponibili nella directory `dist`.

### Opzioni di deployment per la versione statica:

#### Replit:
- Clicca sul pulsante "Deploy" nell'interfaccia di Replit
- Replit utilizzerà automaticamente i file nella directory `dist`

#### Servizi di hosting statico alternativi:
- **GitHub Pages**: Carica la directory `dist` in un repository GitHub e attiva GitHub Pages
- **Netlify**: Carica la directory `dist` o collega direttamente il repository GitHub
- **Vercel**: Utilizza la directory `dist` o collega il repository GitHub
- **Cloudflare Pages**: Carica la directory `dist` o collega il repository GitHub

Tutti i file di configurazione necessari (`vercel.json`, `netlify.toml`, `_redirects`) sono già inclusi nella versione statica generata.

## Opzione 2: Versione Server + Client

Se desideri comunque utilizzare la versione server + client originale (sconsigliata per il deployment su Replit), puoi seguire questi passaggi:

1. Assicurati che il comando di build produca i file nella struttura corretta:
   ```bash
   npm run build && mkdir -p dist/server && cp dist/index.js dist/server/
   ```

2. Verifica che il file `dist/server/index.js` esista dopo il build

3. Per il deployment con Replit, assicurati che il comando di esecuzione punti al file corretto:
   ```
   NODE_ENV=production node dist/server/index.js
   ```

## Risoluzione dei problemi comuni:

### Errore: "Module not found"
- Verifica che lo script di build abbia creato correttamente tutti i file necessari nella directory `dist`
- Controlla che i percorsi nei file di configurazione siano corretti

### Errore: "URI malformation"
- Assicurati che nel file `client/index.html` non ci siano caratteri non-ASCII nei commenti
- Verifica che i metadati e i dati strutturati JSON-LD non contengano URL malformati o caratteri speciali

### Errore: "Cannot find module '/home/runner/workspace/dist/server/index.js'"
- Esegui manualmente il comando di build seguito da `mkdir -p dist/server && cp dist/index.js dist/server/`
- Verifica che il file esista nella posizione prevista dopo il build

### Problemi con il generatore PDF:
- Controlla che l'implementazione del generatore PDF non utilizzi `setGState` o `addGState`
- Verifica che le immagini di sfondo vengano caricate correttamente