import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Ottimizzazioni per migliorare Core Web Vitals e performance
 * - Implementa rendering progressivo
 * - Aggiunge monitoraggio delle metriche web vitals 
 * - Utilizza strategia ottimale per FCP e LCP
 */

// Monitora Web Vitals (FCP, LCP, CLS, FID)
const reportWebVitals = () => {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          console.log('FCP:', entries[0].startTime, 'ms');
          fcpObserver.disconnect();
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          console.log('LCP:', entries[entries.length - 1].startTime, 'ms');
          lcpObserver.disconnect();
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', (entry as any).processingStart - (entry as any).startTime, 'ms');
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.log('Web Vitals measurement not supported in this browser');
    }
  }
};

// Rimuovi il loading spinner
const removeLoadingSpinner = () => {
  setTimeout(() => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
      }, 300);
    }
  }, 100);
};

// Strategia di rendering ottimizzata per Core Web Vitals
const renderApp = () => {
  // Create the root element for React rendering
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Rimuovi lo spinner di caricamento
  removeLoadingSpinner();
  
  // Monitora metriche di performance in produzione
  if (import.meta.env.PROD) {
    reportWebVitals();
  }
};

// Utilizziamo requestIdleCallback per renderizzare durante il tempo di inattività
// migliorando i tempi di interattività della pagina
const scheduleRender = () => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      renderApp();
    }, { timeout: 1000 }); // Timeout massimo di 1 secondo
  } else {
    // Fallback per browser che non supportano requestIdleCallback
    setTimeout(renderApp, 0);
  }
};

// Verifica se il documento è già interattivo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Se è già pronto, pianifica il rendering durante tempo di inattività
  scheduleRender();
} else {
  // Altrimenti attendi che sia pronto
  document.addEventListener('DOMContentLoaded', scheduleRender);
}
