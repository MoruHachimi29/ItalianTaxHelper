import express, { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Configura Express per servire i file statici dell'applicazione Vue
 * @param app Istanza di Express
 */
export function serveVueApp(app: Express) {
  const vueDistPath = path.resolve(__dirname, '../../vue-app/dist');
  
  // Verifica se la directory di build Vue esiste
  if (fs.existsSync(vueDistPath)) {
    // Servi i file statici dalla directory dist di Vue
    app.use(express.static(vueDistPath));
    
    // Per qualsiasi altra route, servi index.html per gestire il routing lato client
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(vueDistPath, 'index.html'));
    });
    
    console.log('[express] Vue app is being served from: ' + vueDistPath);
  } else {
    console.warn('[express] Vue app build directory not found. Make sure to build the Vue app first.');
    
    // Fallback per ambiente di sviluppo - reindirizza al server di sviluppo Vue
    app.get('*', (req: Request, res: Response) => {
      res.redirect('http://localhost:3000' + req.originalUrl);
    });
  }
}