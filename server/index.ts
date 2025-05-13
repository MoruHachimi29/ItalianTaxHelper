import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression"; // Per la compressione GZIP

// Ottieni il percorso corrente in moduli ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Compressione GZIP per migliorare la velocità di caricamento
app.use(compression({
  level: 6, // Livello di compressione ottimale (0-9)
  threshold: 1024, // Non comprimere risposte più piccole di 1KB
  filter: (req, res) => {
    // Non comprimere immagini già compresse
    if (req.headers['accept']?.includes('image/')) {
      return false;
    }
    // Usa la compressione di default per tutto il resto
    return compression.filter(req, res);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve i file SEO statici dalla cartella client/public con cache ottimizzata
app.use(express.static(path.join(__dirname, '..', 'client', 'public'), {
  maxAge: '30d', // Cache per 30 giorni
  etag: true,    // Supporto per ETag
  lastModified: true
}));

// Serve i file dalla cartella attached_assets con cache ottimizzata
app.use('/assets', express.static(path.join(__dirname, '..', 'attached_assets'), {
  maxAge: '30d', // Cache per 30 giorni
  etag: true,    // Supporto per ETag
  lastModified: true
}));

// Aggiungi header per migliorare Core Web Vitals
app.use((req, res, next) => {
  // Abilita la pre-connessione per le risorse critiche
  res.setHeader('Link', [
    '</assets/fonts.css>; rel=preload; as=style',
    '<https://fonts.googleapis.com>; rel=preconnect',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
  ].join(', '));
  
  // Ottimizzazioni di sicurezza e performance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'interest-cohort=()'); // Disabilita FLoC
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error('Error:', err);
    res.status(status).json({ 
      message,
      status,
      path: _req.path
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
