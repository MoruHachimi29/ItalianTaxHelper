<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">F23</h1>
    <p class="text-gray-600 mb-8 text-center">
      Compila, calcola e scarica il modello F23 con facilità
    </p>
    
    <div class="max-w-5xl mx-auto">
      <!-- Barra strumenti -->
      <div class="bg-white rounded-lg p-4 shadow-md mb-6 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <button 
            type="button" 
            @click="resetForm"
            class="btn-secondary"
          >
            <i class="material-icons mr-1">refresh</i>
            Nuovo
          </button>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button 
            type="button" 
            @click="downloadPDF"
            class="btn-primary"
          >
            <i class="material-icons mr-1">download</i>
            Scarica PDF
          </button>
          
          <button 
            type="button" 
            @click="printForm"
            class="btn-secondary"
          >
            <i class="material-icons mr-1">print</i>
            Stampa
          </button>
          
          <button 
            type="button" 
            @click="shareForm"
            class="btn-secondary"
          >
            <i class="material-icons mr-1">share</i>
            Condividi
          </button>
        </div>
      </div>
      
      <form @submit.prevent="submitForm">
        <!-- Form content -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <p class="text-center py-12">
            Questo modulo è in fase di sviluppo. Sarà disponibile a breve.
          </p>
        </div>
        
        <!-- Pulsanti finali -->
        <div class="flex justify-center mt-6">
          <button 
            type="submit"
            class="btn-primary px-8 py-3 text-lg"
            disabled
          >
            Genera F23
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { createPDF } from '../utils/pdfGenerator';

// Metodi base
function resetForm() {
  alert('Funzionalità in fase di sviluppo');
}

function downloadPDF() {
  alert('Funzionalità in fase di sviluppo');
}

function printForm() {
  window.print();
}

function shareForm() {
  if (navigator.share) {
    navigator.share({
      title: 'Modello F23',
      text: 'Ecco il mio modello F23 compilato',
      url: window.location.href
    })
    .catch((error) => console.error('Errore durante la condivisione:', error));
  } else {
    // Fallback per browser che non supportano Web Share API
    const dummyTextArea = document.createElement('textarea');
    dummyTextArea.value = window.location.href;
    document.body.appendChild(dummyTextArea);
    dummyTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(dummyTextArea);
    alert('Link copiato negli appunti!');
  }
}

function submitForm() {
  alert('Funzionalità in fase di sviluppo');
}
</script>

<style scoped>
@media print {
  button {
    display: none;
  }
}
</style>