<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Immagine di copertina con fallback -->
    <div class="h-48 bg-gray-200 relative">
      <img 
        v-if="image" 
        :src="image" 
        :alt="title" 
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full bg-gray-200">
        <i class="material-icons text-gray-400 text-4xl">article</i>
      </div>
      
      <!-- Data di pubblicazione -->
      <div class="absolute top-0 right-0 bg-black text-white px-3 py-1 text-sm m-2 rounded">
        {{ formattedDate }}
      </div>
    </div>
    
    <!-- Contenuto -->
    <div class="p-5">
      <h3 class="text-xl font-semibold mb-2 line-clamp-2">{{ title }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-3">{{ excerpt }}</p>
      <router-link :to="to" class="text-black font-medium hover:underline">
        Leggi di più →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
});

const formattedDate = computed(() => {
  if (!props.date) return '';
  
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(props.date);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>