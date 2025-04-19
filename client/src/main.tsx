import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Strategia di rendering ottimizzata per Core Web Vitals
const renderApp = () => {
  // Create the root element for React rendering
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Verifica se il documento è già interattivo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Se è già pronto, renderizza subito
  renderApp();
} else {
  // Altrimenti attendi che sia pronto
  document.addEventListener('DOMContentLoaded', renderApp);
}
