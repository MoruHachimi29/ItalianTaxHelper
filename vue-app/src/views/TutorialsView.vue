<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">Tutorial</h1>
    <p class="text-gray-600 mb-8 text-center">
      Guide e istruzioni per la compilazione dei moduli fiscali italiani
    </p>
    
    <div class="max-w-5xl mx-auto">
      <!-- Filtri e ricerca -->
      <div class="bg-white rounded-lg p-4 shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="w-full md:w-auto">
            <label for="tutorial-type" class="form-label">Filtra per tipo</label>
            <select 
              id="tutorial-type" 
              v-model="selectedType"
              class="form-input"
            >
              <option value="">Tutti i tutorial</option>
              <option value="f24-ordinario">F24 Ordinario</option>
              <option value="f24-semplificato">F24 Semplificato</option>
              <option value="f24-accise">F24 Accise</option>
              <option value="f24-elide">F24 Elide</option>
              <option value="f23">F23</option>
            </select>
          </div>
          
          <div class="w-full md:w-auto flex-1 md:max-w-md">
            <label for="search-tutorials" class="form-label">Cerca tutorial</label>
            <div class="relative">
              <input 
                id="search-tutorials" 
                type="text" 
                v-model="searchQuery"
                class="form-input w-full pl-10"
                placeholder="Cerca per titolo o contenuto..."
              />
              <i class="material-icons absolute left-3 top-2 text-gray-400">search</i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Elenco tutorial -->
      <div>
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p class="mt-4 text-gray-600">Caricamento tutorial...</p>
        </div>
        
        <div v-else-if="filteredTutorials.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
          <i class="material-icons text-6xl text-gray-300 mb-4">menu_book</i>
          <p class="text-gray-600">Nessun tutorial trovato con i filtri selezionati.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="tutorial in filteredTutorials" 
            :key="tutorial.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="h-48 bg-gray-200 relative">
              <img 
                v-if="tutorial.coverImage" 
                :src="tutorial.coverImage" 
                :alt="tutorial.title" 
                class="w-full h-full object-cover"
              />
              <div v-else class="flex items-center justify-center h-full">
                <i class="material-icons text-gray-400 text-4xl">description</i>
              </div>
              
              <div class="absolute top-0 right-0 bg-black text-white px-3 py-1 text-sm m-2 rounded">
                {{ getTutorialTypeLabel(tutorial.type) }}
              </div>
            </div>
            
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-2">{{ tutorial.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ tutorial.excerpt }}</p>
              <router-link :to="`/tutorial/${tutorial.id}`" class="btn-primary">
                Leggi la guida
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { tutorialApi } from '../services/api';

// Stato
const tutorials = ref([]);
const isLoading = ref(true);
const selectedType = ref('');
const searchQuery = ref('');

// Carica i tutorial
onMounted(async () => {
  try {
    tutorials.value = await tutorialApi.getAll();
  } catch (error) {
    console.error('Errore nel caricamento dei tutorial:', error);
  } finally {
    isLoading.value = false;
  }
});

// Tutorial filtrati in base a tipo e ricerca
const filteredTutorials = computed(() => {
  let result = [...tutorials.value];
  
  // Filtra per tipo
  if (selectedType.value) {
    result = result.filter(tutorial => tutorial.type === selectedType.value);
  }
  
  // Filtra per ricerca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(tutorial => 
      tutorial.title.toLowerCase().includes(query) || 
      tutorial.excerpt.toLowerCase().includes(query) ||
      tutorial.content.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// Ottiene l'etichetta leggibile per il tipo di tutorial
function getTutorialTypeLabel(type) {
  const labels = {
    'f24-ordinario': 'F24 Ordinario',
    'f24-semplificato': 'F24 Semplificato',
    'f24-accise': 'F24 Accise',
    'f24-elide': 'F24 Elide',
    'f23': 'F23',
    'generic': 'Generale'
  };
  
  return labels[type] || 'Generale';
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>