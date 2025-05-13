<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">Novità Fiscali</h1>
    <p class="text-gray-600 mb-8 text-center">
      Aggiornamenti, notizie e novità dal mondo fiscale italiano
    </p>
    
    <div class="max-w-5xl mx-auto">
      <!-- Filtri e ricerca -->
      <div class="bg-white rounded-lg p-4 shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="w-full md:w-auto flex-1 md:max-w-md">
            <label for="search-news" class="form-label">Cerca news</label>
            <div class="relative">
              <input 
                id="search-news" 
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
      
      <!-- Elenco news -->
      <div>
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p class="mt-4 text-gray-600">Caricamento news...</p>
        </div>
        
        <div v-else-if="filteredNews.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
          <i class="material-icons text-6xl text-gray-300 mb-4">feed</i>
          <p class="text-gray-600">Nessuna news trovata con i filtri selezionati.</p>
        </div>
        
        <div v-else>
          <div 
            v-for="(news, index) in filteredNews" 
            :key="news.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mb-6"
          >
            <div class="md:flex">
              <div class="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                <img 
                  v-if="news.coverImage" 
                  :src="news.coverImage" 
                  :alt="news.title" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex items-center justify-center h-full">
                  <i class="material-icons text-gray-400 text-4xl">article</i>
                </div>
              </div>
              
              <div class="p-5 md:w-2/3">
                <div class="flex items-center text-sm text-gray-500 mb-2">
                  <i class="material-icons text-sm mr-1">calendar_today</i>
                  <span>{{ formatDate(news.createdAt) }}</span>
                </div>
                
                <h3 class="text-xl font-semibold mb-2">{{ news.title }}</h3>
                <p class="text-gray-600 mb-4">{{ news.excerpt }}</p>
                
                <router-link :to="`/news/${news.id}`" class="btn-primary">
                  Leggi l'articolo
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Paginazione -->
          <div v-if="filteredNews.length > 0" class="flex justify-center mt-8">
            <div class="flex space-x-2">
              <button 
                @click="page > 1 && (page--)" 
                :disabled="page <= 1"
                class="px-4 py-2 border rounded-md"
                :class="page <= 1 ? 'text-gray-400 border-gray-200' : 'border-gray-300 hover:bg-gray-50'"
              >
                <i class="material-icons text-sm">chevron_left</i>
              </button>
              
              <div class="px-4 py-2 bg-black text-white rounded-md">
                {{ page }}
              </div>
              
              <button 
                @click="hasMorePages && (page++)" 
                :disabled="!hasMorePages"
                class="px-4 py-2 border rounded-md"
                :class="!hasMorePages ? 'text-gray-400 border-gray-200' : 'border-gray-300 hover:bg-gray-50'"
              >
                <i class="material-icons text-sm">chevron_right</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { newsApi } from '../services/api';

// Stato
const allNews = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const page = ref(1);
const itemsPerPage = 5;

// Carica le news
onMounted(async () => {
  try {
    allNews.value = await newsApi.getAll();
  } catch (error) {
    console.error('Errore nel caricamento delle news:', error);
  } finally {
    isLoading.value = false;
  }
});

// News filtrate in base alla ricerca
const filteredNewsBySearch = computed(() => {
  if (!searchQuery.value.trim()) {
    return allNews.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return allNews.value.filter(news => 
    news.title.toLowerCase().includes(query) || 
    news.excerpt.toLowerCase().includes(query) ||
    (news.content && news.content.toLowerCase().includes(query))
  );
});

// News filtrate con paginazione
const filteredNews = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return filteredNewsBySearch.value.slice(startIndex, endIndex);
});

// Se ci sono più pagine
const hasMorePages = computed(() => {
  return page.value * itemsPerPage < filteredNewsBySearch.value.length;
});

// Reset della pagina quando cambia la ricerca
watch(searchQuery, () => {
  page.value = 1;
});

// Formatta la data in un formato leggibile
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
</script>