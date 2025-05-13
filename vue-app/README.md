# F24Editabile - Applicazione Vue.js

Questa directory contiene l'applicazione Vue.js per F24Editabile, che offre una moderna interfaccia utente per la compilazione e gestione dei moduli fiscali italiani.

## Struttura del progetto

L'applicazione Vue.js è organizzata con la seguente struttura:

```
vue-app/
├── public/            # File statici accessibili direttamente
├── src/
│   ├── assets/        # Risorse statiche (CSS, immagini)
│   ├── components/    # Componenti Vue riutilizzabili
│   │   ├── forms/     # Componenti specifici per i moduli fiscali
│   │   ├── home/      # Componenti per la home page
│   │   ├── layout/    # Componenti strutturali (header, footer)
│   │   └── ui/        # Componenti UI riutilizzabili
│   ├── router/        # Configurazione del router Vue
│   ├── services/      # Servizi per chiamate API e logica di business
│   ├── stores/        # Store Pinia per la gestione dello stato
│   ├── utils/         # Utility functions
│   └── views/         # Componenti delle pagine principali
├── index.html         # Punto di ingresso HTML
├── package.json       # Dipendenze e script
├── postcss.config.js  # Configurazione PostCSS
├── tailwind.config.js # Configurazione Tailwind CSS
└── vite.config.js     # Configurazione Vite
```

## Funzionalità principali

- **Moduli fiscali compilabili**: F24 Ordinario, Semplificato, Accise, Elide e F23
- **Calcolo automatico**: Somma automatica degli importi inseriti
- **Esportazione PDF**: Generazione di PDF dei moduli compilati
- **Interfaccia responsiva**: Compatibile con dispositivi desktop e mobili
- **Strumenti fiscali**: Scadenze fiscali, bonus ISEE, e monitoraggio del debito pubblico

## Tecnologie utilizzate

- **Vue.js 3**: Framework JavaScript progressivo con Composition API
- **Pinia**: Gestione dello stato dell'applicazione
- **Vue Router**: Gestione delle rotte
- **Tailwind CSS**: Framework CSS utility-first
- **jsPDF**: Libreria per la generazione di PDF

## Compilazione e Deployment

### Sviluppo locale

```bash
cd vue-app
npm install
npm run dev
```

### Compilazione per produzione

```bash
cd vue-app
npm install
npm run build
```

Il risultato della compilazione sarà nella directory `vue-app/dist`.

### Deployment su Replit

Per il deployment su Replit, utilizzare lo script `deploy-vue.sh` nella root del progetto:

```bash
./deploy-vue.sh
```

Questo script:
1. Compila l'applicazione Vue.js
2. Prepara i file del server in `dist/server/`
3. Configura tutto per il deployment di Replit

## Manutenzione e aggiornamenti

Per aggiungere nuove funzionalità o componenti:

1. Creare il componente in `src/components/`
2. Aggiungere la vista in `src/views/` se necessario
3. Aggiornare le rotte in `src/router/index.js`
4. Aggiungere lo stato necessario in `src/stores/`

Per modificare lo stile dell'applicazione, puoi:
- Modificare le classi Tailwind nei componenti Vue
- Aggiornare il tema in `tailwind.config.js`
- Modificare gli stili globali in `src/assets/main.css`