<template>
  <div class="min-h-screen bg-background">
    <AppHeader />
    <main class="container mx-auto py-4">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

const route = useRoute();

// Funzione per scorrere in alto al cambio di rotta
function handleRouteChange() {
  window.scrollTo(0, 0);
}

onMounted(() => {
  // Inizializza il tema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  }

  // Gestione della navigazione
  window.addEventListener('popstate', handleRouteChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleRouteChange);
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>