# F24Editabile

F24Editabile è un'applicazione web avanzata per la preparazione di documenti fiscali italiani che semplifica processi complessi attraverso un design innovativo e una tecnologia user-friendly.

## 🔄 Migrazione a Vue.js

**IMPORTANTE**: Questo progetto è stato completamente migrato da React.js a Vue.js!

### Tecnologie e capacità chiave:

- ✅ Frontend Vue.js 3 con Vite.js
- ✅ Architettura delle viste completa per diversi tipi di documenti fiscali
- ✅ Design modulare basato su componenti per un'elaborazione scalabile dei documenti
- ✅ Interfaccia responsive che supporta diversi scenari di preparazione dei documenti
- ✅ Infrastruttura frontend avanzata con script di deployment

## 🏗️ Struttura del Progetto

Il progetto è organizzato nelle seguenti directory principali:

- `vue-app/`: L'applicazione Vue.js (frontend)
- `server/`: Il server Express.js (backend)
- `shared/`: Codice condiviso tra frontend e backend
- `client/`: **DEPRECATO** - Contiene solo file minimi per la compatibilità durante lo sviluppo

## 🚀 Avvio dell'Applicazione

### Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn

### Sviluppo

#### In ambiente locale

Per avviare l'ambiente di sviluppo su una macchina locale:

```bash
# Avvia il server Express (API)
npm run dev

# In un altro terminale, avvia l'applicazione Vue.js
cd vue-app
npm install  # Solo la prima volta
npm run dev
```

#### In ambiente Replit

Replit richiede alcuni passaggi specifici:

1. Avvia il server principale (già configurato nel workflow "Start application")
2. Apri una nuova finestra di shell ed esegui:
   ```bash
   ./start-vue.sh
   ```
3. Utilizza l'URL fornito nella console (o nell'interfaccia Replit) per accedere all'applicazione Vue.js

### Risoluzione dei problemi in Replit

- Se ricevi errori relativi agli host consentiti, assicurati che la configurazione in `vue-app/vite.config.js` includa il tuo dominio Replit
- In caso di problemi con il server di sviluppo Vue, prova a cancellare la cache:
  ```bash
  cd vue-app
  rm -rf node_modules/.vite
  ```

### Produzione

Per preparare e avviare l'applicazione in produzione:

```bash
# Costruisci sia l'app Vue.js che il server
./deploy-vue.sh

# Avvia l'applicazione
npm run start
```

## 📝 Funzionalità

- **Moduli Fiscali**: Compilazione di F24 (Ordinario, Semplificato, Accise, Elide) e F23
- **Calcolo Automatico**: Calcolo automatico dei totali
- **Generazione PDF**: Esportazione in PDF dei moduli compilati
- **Tutorial**: Guide informative sulla compilazione dei moduli
- **Strumenti Utili**:
  - Scadenze fiscali
  - Calcolo bonus ISEE
  - Monitoraggio del debito pubblico

## 🧪 Testing

Per eseguire i test:

```bash
npm run test
```

## 📦 Deployment

### Deployment su Replit

Per preparare l'applicazione per il deployment su Replit:

1. Esegui lo script di build che compila sia il frontend Vue.js che il backend:
   ```bash
   ./deploy-vue.sh
   ```

2. Utilizza la funzionalità "Deploy" integrata di Replit per pubblicare l'applicazione

3. Una volta completato il deployment, l'app sarà disponibile all'URL di Replit (solitamente nel formato `https://nomeapp.nomeutente.repl.co`)

### Note sul Deployment

- Il file `server/deploy-index.js` è configurato per servire automaticamente l'app Vue.js compilata
- In produzione, non è necessario avviare separatamente il server Vue.js
- Tutte le risorse statiche vengono servite con caching ottimizzato per le prestazioni
- Per i deployment manuali (al di fuori di Replit), utilizzare:
  ```bash
  ./deploy-vue.sh
  npm run start
  ```

## 👥 Contributi

I contributi sono benvenuti! Si prega di seguire il processo standard di fork, branch, e pull request.

## 📄 Licenza

Questo progetto è distribuito con licenza MIT.