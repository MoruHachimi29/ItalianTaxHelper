<template>
  <div class="border rounded-md p-4 bg-white shadow-sm mb-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Sezione Erario</h3>
      <button 
        type="button" 
        @click="$emit('add-row')"
        class="btn-secondary text-sm flex items-center"
      >
        <i class="material-icons mr-1 text-sm">add</i>
        Aggiungi riga
      </button>
    </div>
    
    <!-- Header della tabella -->
    <div class="grid grid-cols-12 gap-2 font-medium text-sm bg-gray-100 p-2 rounded mb-2">
      <div class="col-span-2">Codice tributo</div>
      <div class="col-span-2">Anno di riferimento</div>
      <div class="col-span-3">Importi a debito</div>
      <div class="col-span-3">Importi a credito</div>
      <div class="col-span-2">Azioni</div>
    </div>
    
    <!-- Righe della tabella -->
    <div v-for="row in rows" :key="row.id" class="grid grid-cols-12 gap-2 mb-2 items-center">
      <div class="col-span-2">
        <input 
          type="text" 
          v-model="row.tributeCode" 
          class="form-input"
          maxlength="4"
        />
      </div>
      <div class="col-span-2">
        <input 
          type="text" 
          v-model="row.referenceYear" 
          class="form-input"
          maxlength="4"
          placeholder="AAAA"
        />
      </div>
      <div class="col-span-3">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
          <input 
            type="text" 
            v-model="row.debitAmount" 
            class="form-input pl-7 currency-input"
            @input="onlyNumbers($event, row, 'debitAmount')"
          />
        </div>
      </div>
      <div class="col-span-3">
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
          <input 
            type="text" 
            v-model="row.creditAmount" 
            class="form-input pl-7 currency-input"
            @input="onlyNumbers($event, row, 'creditAmount')"
          />
        </div>
      </div>
      <div class="col-span-2">
        <button 
          type="button" 
          @click="$emit('remove-row', row.id)"
          class="text-red-600 hover:text-red-800 transition" 
          :disabled="rows.length <= 1"
        >
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
    
    <!-- Totali -->
    <div class="grid grid-cols-12 gap-2 mt-4 pt-4 border-t border-gray-200 font-medium">
      <div class="col-span-4 text-right">Totali:</div>
      <div class="col-span-3 text-right">
        € {{ debitTotal }}
      </div>
      <div class="col-span-3 text-right">
        € {{ creditTotal }}
      </div>
      <div class="col-span-2"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add-row', 'remove-row', 'update:rows']);

// Calcola il totale a debito
const debitTotal = computed(() => {
  return props.rows.reduce((total, row) => {
    const amount = parseFloat(row.debitAmount) || 0;
    return total + amount;
  }, 0).toFixed(2);
});

// Calcola il totale a credito
const creditTotal = computed(() => {
  return props.rows.reduce((total, row) => {
    const amount = parseFloat(row.creditAmount) || 0;
    return total + amount;
  }, 0).toFixed(2);
});

// Funzione per permettere solo numeri e decimali nei campi importo
function onlyNumbers(event, row, field) {
  const value = event.target.value;
  
  // Rimuove caratteri non numerici, mantenendo punto e virgola
  const filteredValue = value.replace(/[^\d.,]/g, '');
  
  // Sostituisce virgole con punti
  let formattedValue = filteredValue.replace(/,/g, '.');
  
  // Assicura che ci sia al massimo un punto decimale
  const parts = formattedValue.split('.');
  if (parts.length > 2) {
    formattedValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Assicura che ci siano al massimo 2 decimali
  if (parts.length === 2 && parts[1].length > 2) {
    formattedValue = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  // Aggiorna il valore nel modello
  row[field] = formattedValue;
}
</script>