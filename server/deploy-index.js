// File di ingresso per il deployment di Replit
// Questo file carica la versione compilata del server
// e serve l'applicazione Vue.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import fs from 'fs';

// Ottieni il percorso corrente in moduli ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Compressione GZIP
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['accept']?.includes('image/')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes (minimo necessario)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servi file statici di Vue.js dalla cartella dist
const vueDistPath = path.resolve(__dirname, '../../vue-app/dist');

if (fs.existsSync(vueDistPath)) {
  console.log('Serving Vue.js application from:', vueDistPath);
  
  // Servi assets statici con cache
  app.use(express.static(vueDistPath, {
    maxAge: '30d',
    etag: true,
    lastModified: true
  }));
  
  // Per tutte le altre richieste, servi l'app Vue
  app.get('*', (req, res) => {
    res.sendFile(path.join(vueDistPath, 'index.html'));
  });
} else {
  console.error('Vue.js build not found at:', vueDistPath);
  app.get('*', (req, res) => {
    res.status(500).send('Server configuration error: Vue.js build not found.');
  });
}

// Avvia il server sulla porta 3000 o quella configurata
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});