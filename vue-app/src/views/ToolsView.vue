<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">Strumenti Fiscali</h1>
    <p class="text-gray-600 mb-8 text-center">
      Strumenti utili per la gestione dei tuoi pagamenti e calcoli fiscali
    </p>
    
    <div class="max-w-5xl mx-auto">
      <!-- Schede degli strumenti -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Strumento Scadenze Fiscali -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" @click="activeTab = 'tax-deadlines'">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <i class="material-icons text-6xl text-gray-500">event</i>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">Scadenze Fiscali</h3>
            <p class="text-gray-600 mb-4">Calendario con le principali scadenze fiscali dell'anno corrente.</p>
            <button class="btn-primary" @click="activeTab = 'tax-deadlines'">
              Apri strumento
            </button>
          </div>
        </div>
        
        <!-- Strumento Calcolo ISEE per Bonus -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" @click="activeTab = 'isee-calculator'">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <i class="material-icons text-6xl text-gray-500">calculate</i>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">Bonus ISEE</h3>
            <p class="text-gray-600 mb-4">Trova i bonus disponibili in base al tuo ISEE e alla tua situazione familiare.</p>
            <button class="btn-primary" @click="activeTab = 'isee-calculator'">
              Apri strumento
            </button>
          </div>
        </div>
        
        <!-- Strumento Debito Pubblico -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" @click="activeTab = 'public-debt'">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <i class="material-icons text-6xl text-gray-500">trending_up</i>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-semibold mb-2">Debito Pubblico</h3>
            <p class="text-gray-600 mb-4">Visualizza l'andamento del debito pubblico italiano e confrontalo con altri paesi.</p>
            <button class="btn-primary" @click="activeTab = 'public-debt'">
              Apri strumento
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contenuto dello strumento attivo -->
      <div v-if="activeTab" class="mt-8 bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">{{ getActiveTabTitle }}</h2>
          <button @click="activeTab = null" class="text-gray-500 hover:text-black">
            <i class="material-icons">close</i>
          </button>
        </div>
        
        <!-- Scadenze Fiscali -->
        <div v-if="activeTab === 'tax-deadlines'">
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p class="mt-4 text-gray-600">Caricamento scadenze...</p>
          </div>
          
          <div v-else>
            <div class="mb-4">
              <label for="month-filter" class="form-label">Filtra per mese</label>
              <select id="month-filter" v-model="selectedMonth" class="form-input">
                <option value="">Tutti i mesi</option>
                <option value="1">Gennaio</option>
                <option value="2">Febbraio</option>
                <option value="3">Marzo</option>
                <option value="4">Aprile</option>
                <option value="5">Maggio</option>
                <option value="6">Giugno</option>
                <option value="7">Luglio</option>
                <option value="8">Agosto</option>
                <option value="9">Settembre</option>
                <option value="10">Ottobre</option>
                <option value="11">Novembre</option>
                <option value="12">Dicembre</option>
              </select>
            </div>
            
            <div class="border rounded-md overflow-hidden">
              <div class="grid grid-cols-12 gap-2 font-semibold bg-gray-100 p-3">
                <div class="col-span-2">Data</div>
                <div class="col-span-4">Descrizione</div>
                <div class="col-span-3">Categoria</div>
                <div class="col-span-3">Contribuenti</div>
              </div>
              
              <div v-for="deadline in filteredDeadlines" :key="deadline.id" class="grid grid-cols-12 gap-2 p-3 border-t">
                <div class="col-span-2 font-medium">{{ formatDate(deadline.date) }}</div>
                <div class="col-span-4">{{ deadline.description }}</div>
                <div class="col-span-3">
                  <span class="inline-block px-2 py-1 text-xs rounded-full" :class="getCategoryClass(deadline.category)">
                    {{ deadline.category }}
                  </span>
                </div>
                <div class="col-span-3 text-sm text-gray-600">{{ deadline.taxpayers }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Calcolo ISEE per Bonus -->
        <div v-if="activeTab === 'isee-calculator'">
          <div class="mb-6">
            <label for="isee-value" class="form-label">Valore ISEE</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
              <input 
                id="isee-value" 
                type="text" 
                v-model="iseeValue"
                class="form-input pl-7"
                placeholder="Es. 15000"
                @input="filterBonus"
              />
            </div>
          </div>
          
          <div v-if="bonusList.length > 0" class="border rounded-md overflow-hidden">
            <div class="grid grid-cols-12 gap-2 font-semibold bg-gray-100 p-3">
              <div class="col-span-4">Bonus</div>
              <div class="col-span-3">Fascia ISEE</div>
              <div class="col-span-3">Importo</div>
              <div class="col-span-2">Scadenza</div>
            </div>
            
            <div v-for="bonus in bonusList" :key="bonus.id" class="grid grid-cols-12 gap-2 p-3 border-t">
              <div class="col-span-4 font-medium">{{ bonus.name }}</div>
              <div class="col-span-3">fino a € {{ formatNumber(bonus.maxIsee) }}</div>
              <div class="col-span-3">{{ bonus.amount }}</div>
              <div class="col-span-2">{{ formatDate(bonus.expiryDate) }}</div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 bg-gray-50 rounded-md">
            <i class="material-icons text-4xl text-gray-300 mb-2">search_off</i>
            <p class="text-gray-600">Nessun bonus disponibile per il valore ISEE inserito.</p>
          </div>
        </div>
        
        <!-- Debito Pubblico -->
        <div v-if="activeTab === 'public-debt'">
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p class="mt-4 text-gray-600">Caricamento dati sul debito pubblico...</p>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gray-50 p-4 rounded-md border">
                <h3 class="text-xl font-semibold mb-4">Debito pubblico italiano</h3>
                <div class="text-4xl font-bold text-center mb-2">
                  {{ formatCurrency(debtData.currentDebt) }}
                </div>
                <p class="text-center text-gray-600">aggiornato al {{ formatDate(debtData.lastUpdate) }}</p>
                
                <div class="mt-4 p-2 rounded bg-gray-100">
                  <div class="flex justify-between">
                    <span>Variazione annuale:</span>
                    <span :class="debtData.yearlyChange > 0 ? 'text-red-600' : 'text-green-600'">
                      {{ debtData.yearlyChange > 0 ? '+' : '' }}{{ debtData.yearlyChange }}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-md border">
                <h3 class="text-xl font-semibold mb-4">Rapporto debito/PIL</h3>
                <div class="text-4xl font-bold text-center mb-2">
                  {{ debtData.debtToGdpRatio }}%
                </div>
                <p class="text-center text-gray-600">Media UE: {{ debtData.euAverage }}%</p>
                
                <div class="mt-4 p-2 rounded bg-gray-100">
                  <div class="flex justify-between">
                    <span>Posizione in UE:</span>
                    <span>
                      {{ debtData.euRanking }}° su 27
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t pt-6 mt-6">
              <h3 class="text-xl font-semibold mb-4">Confronto con altri paesi</h3>
              <div class="space-y-4">
                <div v-for="country in debtData.comparison" :key="country.name" class="relative pt-1">
                  <div class="flex justify-between">
                    <span class="font-medium">{{ country.name }}</span>
                    <span>{{ country.debtToGdpRatio }}%</span>
                  </div>
                  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div :style="`width: ${Math.min(country.debtToGdpRatio, 200)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { bonusApi, debtApi } from '../services/api';

// Stato
const activeTab = ref(null);
const isLoading = ref(false);
const selectedMonth = ref('');
const iseeValue = ref('');

// Dati
const deadlines = ref([]);
const bonusList = ref([]);
const debtData = ref({
  currentDebt: 2750000000000, // valore di esempio
  lastUpdate: new Date(),
  yearlyChange: 4.2,
  debtToGdpRatio: 150.8,
  euAverage: 91.2,
  euRanking: 2,
  comparison: [
    { name: 'Italia', debtToGdpRatio: 150.8 },
    { name: 'Germania', debtToGdpRatio: 66.1 },
    { name: 'Francia', debtToGdpRatio: 112.9 },
    { name: 'Spagna', debtToGdpRatio: 116.1 },
    { name: 'Grecia', debtToGdpRatio: 171.3 }
  ]
});

// Titolo dello strumento attivo
const getActiveTabTitle = computed(() => {
  switch (activeTab.value) {
    case 'tax-deadlines':
      return 'Scadenze Fiscali';
    case 'isee-calculator':
      return 'Bonus ISEE';
    case 'public-debt':
      return 'Debito Pubblico';
    default:
      return '';
  }
});

// Scadenze filtrate per mese
const filteredDeadlines = computed(() => {
  if (!selectedMonth.value) {
    return deadlines.value;
  }
  
  return deadlines.value.filter(deadline => {
    const date = new Date(deadline.date);
    return date.getMonth() + 1 === parseInt(selectedMonth.value);
  });
});

// Carica i dati quando viene selezionato uno strumento
watch(activeTab, async (newTab) => {
  if (!newTab) return;
  
  isLoading.value = true;
  
  try {
    switch (newTab) {
      case 'tax-deadlines':
        // Qui andrebbe la chiamata API se disponibile
        deadlines.value = generateSampleDeadlines();
        break;
      case 'isee-calculator':
        bonusList.value = await bonusApi.getAll();
        break;
      case 'public-debt':
        const currentDebt = await debtApi.getCurrent();
        const comparison = await debtApi.getComparison();
        debtData.value = { ...debtData.value, ...currentDebt, comparison };
        break;
    }
  } catch (error) {
    console.error(`Errore nel caricamento dei dati per ${newTab}:`, error);
  } finally {
    isLoading.value = false;
  }
});

// Filtra i bonus in base all'ISEE
function filterBonus() {
  const value = parseFloat(iseeValue.value.replace(/[^\d]/g, ''));
  
  if (!isNaN(value)) {
    isLoading.value = true;
    
    // Simula una chiamata API
    setTimeout(() => {
      bonusList.value = bonusList.value.filter(bonus => value <= bonus.maxIsee);
      isLoading.value = false;
    }, 500);
  }
}

// Formatta la data in formato italiano
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Formatta numeri con separatore delle migliaia
function formatNumber(number) {
  return new Intl.NumberFormat('it-IT').format(number);
}

// Formatta importi in valuta
function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Determina la classe CSS in base alla categoria
function getCategoryClass(category) {
  const classes = {
    'IVA': 'bg-blue-100 text-blue-800',
    'IRPEF': 'bg-green-100 text-green-800',
    'IMU': 'bg-yellow-100 text-yellow-800',
    'INPS': 'bg-red-100 text-red-800',
    'TARI': 'bg-purple-100 text-purple-800'
  };
  
  return classes[category] || 'bg-gray-100 text-gray-800';
}

// Genera dati di esempio per le scadenze
function generateSampleDeadlines() {
  return [
    {
      id: 1,
      date: '2023-01-16',
      description: 'Versamento IVA mensile',
      category: 'IVA',
      taxpayers: 'Contribuenti IVA mensili'
    },
    {
      id: 2,
      date: '2023-02-16',
      description: 'Versamento IVA mensile',
      category: 'IVA',
      taxpayers: 'Contribuenti IVA mensili'
    },
    {
      id: 3,
      date: '2023-03-16',
      description: 'Versamento IVA mensile',
      category: 'IVA',
      taxpayers: 'Contribuenti IVA mensili'
    },
    {
      id: 4,
      date: '2023-06-16',
      description: 'Acconto IMU',
      category: 'IMU',
      taxpayers: 'Proprietari di immobili'
    },
    {
      id: 5,
      date: '2023-06-30',
      description: 'Dichiarazione dei redditi',
      category: 'IRPEF',
      taxpayers: 'Persone fisiche'
    }
  ];
}
</script>