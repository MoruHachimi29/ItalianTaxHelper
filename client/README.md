# F24Editabile - Migrazione a Vue.js

**ATTENZIONE: Questa directory è deprecata e viene mantenuta solo per garantire la compatibilità con il server durante lo sviluppo.**

## ⚠️ Utilizzo sospeso ⚠️

L'implementazione React.js originariamente contenuta in questa directory è stata completamente rimossa e sostituita da una nuova implementazione in Vue.js.

### Migrazione a Vue.js

Tutte le funzionalità sono state migrate in Vue.js e sono ora disponibili nella cartella `vue-app/`.

### Struttura attuale

I file minimi qui presenti servono solo a:
- Fornire un messaggio di redirect durante lo sviluppo
- Mantenere la compatibilità con il server Express che cerca alcuni file in questa posizione

### Come accedere alla nuova applicazione

La nuova applicazione Vue.js è accessibile avviando sia il server Express che l'app Vue:

1. Avvia il server Express (porta 5000): `npm run dev`
2. Avvia l'app Vue.js (porta 3000): `cd vue-app && npm run dev`

In produzione, l'app Vue.js compilata viene servita direttamente dal server Express.

### Deployment

Per il deployment, utilizzare lo script `deploy-vue.sh` che si occupa di compilare sia l'app Vue.js che il server.