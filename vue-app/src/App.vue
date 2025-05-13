<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

const route = useRoute();

// Scorrimento in cima alla pagina quando cambia la rotta
watch(
  () => route.path,
  () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Definizione delle variabili CSS */
:root {
  --color-background: #ffffff;
  --color-text: #000000;
  --color-primary: #000000;
  --color-secondary: #4a4a4a;
  --color-accent: #e1e1e1;
  --color-border: #dcdcdc;
  --color-error: #ff3b30;
  --color-success: #34c759;
  --border-radius: 0.375rem;
}

/* Stili di base */
html {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  color: var(--color-text);
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

/* Transizioni per router-view */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>