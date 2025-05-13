/**
 * Modulo server semplificato che utilizza Vite come backend
 * Questa versione rimuove la distinzione client/server per semplificare il deployment
 */

import { createServer as createViteServer } from 'vite';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import compression from 'compression';

// Importazione dei controller degli API esistenti
import { bonusCategories, bonusList, getBonusCategories, getAllBonus, getIseeRanges, getNewBonus, getExpiringBonus, getBonusById } from '../server/controllers/bonusController.js';
import { currentDebtData, historicalDebtData, comparisonData } from '../server/controllers/mockPublicDebtData.js';

// Ottieni il percorso corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurazione del server
async function createServer() {
  const app = express();
  const port = process.env.PORT || 5000;

  // Middleware
  app.use(compression());
  app.use(express.json());

  // Development setup con Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production: servi i file statici
    app.use(express.static(resolve(__dirname, '../dist')));
  }

  // API Routes
  setupApiRoutes(app);

  // Fallback route per SPA (Single Page Application)
  app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(resolve(__dirname, '../dist/index.html'));
    } else {
      // In development, Vite gestisce già il fallback
      res.status(404).send('Not found');
    }
  });

  // Avvia il server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

// Configura le rotte API mantenendo le funzionalità essenziali
function setupApiRoutes(app) {
  // Bonus e agevolazioni
  app.get('/api/bonus/categories', getBonusCategories);
  app.get('/api/bonus', getAllBonus);
  app.get('/api/bonus/isee-ranges', getIseeRanges);
  app.get('/api/bonus/new', getNewBonus);
  app.get('/api/bonus/expiring', getExpiringBonus);
  app.get('/api/bonus/:id', getBonusById);

  // Debt data
  app.get('/api/public-debt/current', (req, res) => {
    const country = req.query.country || 'Italy';
    if (currentDebtData[country]) {
      res.json(currentDebtData[country]);
    } else {
      res.status(404).json({ error: 'Dati non disponibili' });
    }
  });

  app.get('/api/public-debt/historical', (req, res) => {
    const country = req.query.country || 'Italy';
    if (historicalDebtData[country]) {
      res.json(historicalDebtData[country]);
    } else {
      res.status(404).json({ error: 'Dati non disponibili' });
    }
  });

  app.get('/api/public-debt/comparison', (req, res) => {
    const countries = req.query.countries ? req.query.countries.split(',') : ['Italy', 'Germany'];
    const key = countries.sort().join('-');
    
    if (comparisonData[key]) {
      res.json(comparisonData[key]);
    } else {
      res.status(404).json({ error: 'Dati di confronto non disponibili' });
    }
  });

  // Tutorial
  app.get('/api/tutorials', (req, res) => {
    // Mock data semplificata per i tutorial
    const tutorials = [
      { id: 1, title: "Come compilare il modulo F24", type: "f24", content: "Istruzioni per compilare il modulo F24..." },
      { id: 2, title: "Guida al modulo F23", type: "f23", content: "Istruzioni per compilare il modulo F23..." },
      { id: 3, title: "Modulo F24 Semplificato", type: "f24", content: "Guida al modulo F24 semplificato..." }
    ];
    res.json(tutorials);
  });
  
  app.get('/api/tutorials/:id', (req, res) => {
    // Mock data per un singolo tutorial
    const id = parseInt(req.params.id);
    const tutorials = {
      1: { id: 1, title: "Come compilare il modulo F24", type: "f24", content: "Istruzioni per compilare il modulo F24..." },
      2: { id: 2, title: "Guida al modulo F23", type: "f23", content: "Istruzioni per compilare il modulo F23..." },
      3: { id: 3, title: "Modulo F24 Semplificato", type: "f24", content: "Guida al modulo F24 semplificato..." }
    };
    
    if (tutorials[id]) {
      res.json(tutorials[id]);
    } else {
      res.status(404).json({ error: 'Tutorial non trovato' });
    }
  });

  // News
  app.get('/api/news', (req, res) => {
    // Mock data semplificata per le news
    const news = [
      { id: 1, title: "Nuove scadenze fiscali", content: "Aggiornamento sulle scadenze fiscali...", date: "2024-01-15" },
      { id: 2, title: "Modifiche ai moduli F24", content: "Le modifiche apportate ai moduli F24...", date: "2024-02-20" },
      { id: 3, title: "Guida agli incentivi 2024", content: "Panoramica degli incentivi fiscali...", date: "2024-03-10" }
    ];
    res.json(news);
  });
}

// Crea ed esporta il server
const server = createServer();
export default server;