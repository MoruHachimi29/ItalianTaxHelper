<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">F24 Ordinario</h1>
    <p class="text-gray-600 mb-8 text-center">
      Compila, calcola e scarica il modello F24 Ordinario con facilità
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
        <!-- Sezione contribuente -->
        <TaxpayerSection v-model="formData" />
        
        <!-- Sezioni del modulo -->
        <div class="mt-6">
          <TreasurySectionF24 
            :rows="formData.treasurySection" 
            @add-row="addTreasuryRow"
            @remove-row="removeTreasuryRow"
          />
        </div>
        
        <!-- Altre sezioni omesse per brevità -->
        
        <!-- Sezione di riepilogo -->
        <div class="border rounded-md p-4 bg-white shadow-sm mb-6">
          <h3 class="text-lg font-semibold mb-4">Riepilogo e Saldo</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="paymentDate" class="form-label">Data di versamento</label>
              <input 
                type="date" 
                id="paymentDate" 
                v-model="formData.paymentDate"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-4">
            <div>
              <p class="text-right text-lg">Totale a debito: <span class="font-semibold">€ {{ totalDebitAmount }}</span></p>
            </div>
            <div>
              <p class="text-right text-lg">Totale a credito: <span class="font-semibold">€ {{ totalCreditAmount }}</span></p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4 mt-4">
            <p class="text-right text-xl">
              Saldo finale: 
              <span class="font-bold" :class="balance > 0 ? 'text-red-600' : 'text-green-600'">
                € {{ balance }}
              </span>
            </p>
          </div>
        </div>
        
        <!-- Pulsanti finali -->
        <div class="flex justify-center mt-6">
          <button 
            type="submit"
            class="btn-primary px-8 py-3 text-lg"
          >
            Genera F24
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useF24Store } from '../stores/f24Store';
import { createPDF } from '../utils/pdfGenerator';
import TaxpayerSection from '../components/forms/TaxpayerSection.vue';
import TreasurySectionF24 from '../components/forms/TreasurySectionF24.vue';

// Inizializza lo store
const f24Store = useF24Store();

// Riferimento ai dati del modulo
const formData = computed(() => f24Store.f24Ordinary);

// Getter per i totali
const totalDebitAmount = computed(() => f24Store.totalDebitAmount);
const totalCreditAmount = computed(() => f24Store.totalCreditAmount);
const balance = computed(() => f24Store.balance);

// Metodi
function resetForm() {
  if (confirm('Sei sicuro di voler cancellare tutti i dati inseriti?')) {
    f24Store.resetForm();
  }
}

function addTreasuryRow() {
  f24Store.addTreasuryRow();
}

function removeTreasuryRow(id) {
  f24Store.removeTreasuryRow(id);
}

function submitForm() {
  // Validazione e invio del form
  downloadPDF();
}

async function downloadPDF() {
  try {
    // Preparazione dati per il PDF
    const pdfData = {
      fiscalCode: formData.value.fiscalCode,
      fullName: formData.value.taxpayerType === 'person' 
        ? `${formData.value.lastName} ${formData.value.firstName}`
        : formData.value.companyName,
      tributeCode: formData.value.treasurySection.length > 0 
        ? formData.value.treasurySection[0].tributeCode 
        : '',
      amount: formData.value.treasurySection.length > 0 
        ? formData.value.treasurySection[0].debitAmount 
        : '0.00'
    };
    
    // Genera il PDF
    await createPDF(
      'f24-ordinario',
      'Modello F24 Ordinario',
      pdfData,
      balance.value
    );
  } catch (error) {
    console.error('Errore nella generazione del PDF:', error);
    alert('Si è verificato un errore durante la generazione del PDF. Riprova più tardi.');
  }
}

function printForm() {
  window.print();
}

function shareForm() {
  if (navigator.share) {
    navigator.share({
      title: 'Modello F24 Ordinario',
      text: 'Ecco il mio modello F24 compilato',
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

// Inizializzazione componente
onMounted(() => {
  // Eventuale codice di inizializzazione
});
</script>

<style scoped>
@media print {
  button {
    display: none;
  }
}
</style>