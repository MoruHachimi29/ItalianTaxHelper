<template>
  <div>
    <!-- Hero Section -->
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Moduli F24 e F23 Compilabili Online
        </h1>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          Compila, calcola e scarica gratuitamente i moduli fiscali italiani in modo semplice e veloce.
          Nessuna registrazione richiesta.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/f24-ordinario" class="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition">
            Inizia con F24 Ordinario
          </router-link>
          <router-link to="/strumenti" class="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition">
            Scopri gli Strumenti
          </router-link>
        </div>
      </div>
    </section>

    <!-- Form Types Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Scegli il modulo da compilare
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormTypeCard
            v-for="(form, index) in formTypes"
            :key="index"
            :title="form.title"
            :description="form.description"
            :to="form.path"
            :icon="form.icon"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Caratteristiche Principali
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            v-for="(feature, index) in features"
            :key="index"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
          />
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="py-12 bg-white" v-if="news.length > 0">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold">Ultime Novità</h2>
          <router-link to="/news" class="text-black hover:underline">
            Vedi tutte
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewsCard
            v-for="item in news.slice(0, 3)"
            :key="item.id"
            :title="item.title"
            :date="new Date(item.createdAt)"
            :excerpt="item.excerpt"
            :to="`/news/${item.id}`"
            :image="item.coverImage"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-black text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          Inizia subito a compilare i tuoi moduli
        </h2>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Servizio gratuito, senza registrazione e sempre aggiornato con le ultime normative.
        </p>
        <router-link to="/f24-ordinario" class="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition">
          Compila F24 Ordinario
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { newsApi } from '../services/api';

import FormTypeCard from '../components/home/FormTypeCard.vue';
import FeatureCard from '../components/home/FeatureCard.vue';
import NewsCard from '../components/home/NewsCard.vue';

const news = ref([]);

const formTypes = [
  {
    title: 'F24 Ordinario',
    description: 'Il modello standard per tutti i tipi di pagamento di tributi, contributi e premi.',
    path: '/f24-ordinario',
    icon: 'description'
  },
  {
    title: 'F24 Semplificato',
    description: 'Versione semplificata per i contribuenti che devono versare solo tributi erariali e locali.',
    path: '/f24-semplificato',
    icon: 'article'
  },
  {
    title: 'F24 Accise',
    description: 'Modello specifico per il pagamento di accise, imposte di consumo e altre imposte indirette.',
    path: '/f24-accise',
    icon: 'local_gas_station'
  },
  {
    title: 'F24 Elide',
    description: 'Modello per il pagamento di tributi e imposte relative alla registrazione di contratti di locazione.',
    path: '/f24-elide',
    icon: 'home'
  },
  {
    title: 'F23',
    description: 'Modello per il pagamento di imposte di registro, successioni, sanzioni e altri tributi indiretti.',
    path: '/f23',
    icon: 'receipt'
  },
  {
    title: 'Strumenti',
    description: 'Strumenti utili per calcoli fiscali, scadenze e informazioni tributarie.',
    path: '/strumenti',
    icon: 'calculate'
  }
];

const features = [
  {
    title: 'Compilazione Facile',
    description: 'Interfaccia intuitiva, simile alla carta, per compilare moduli F24 e F23.',
    icon: 'edit'
  },
  {
    title: 'Calcolo Automatico',
    description: 'Calcolo automatico dei totali e verifica della correttezza dei dati inseriti.',
    icon: 'calculate'
  },
  {
    title: 'PDF Scaricabili',
    description: 'Esporta i tuoi moduli compilati come PDF, pronti per la stampa o l\'invio digitale.',
    icon: 'download'
  },
  {
    title: 'Nessuna Registrazione',
    description: 'Accesso immediato a tutti i servizi senza necessità di registrazione o abbonamento.',
    icon: 'person'
  }
];

onMounted(async () => {
  try {
    news.value = await newsApi.getLatest(3);
  } catch (error) {
    console.error('Errore nel caricamento delle news:', error);
  }
});
</script>