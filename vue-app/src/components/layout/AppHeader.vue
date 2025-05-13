<template>
  <header class="sticky top-0 z-50 w-full bg-black text-white">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <span class="text-xl font-bold">F24Editabile</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-6">
        <router-link v-for="(item, index) in navItems" 
          :key="index" 
          :to="item.href"
          class="text-white hover:text-gray-300 transition"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Mobile Menu Button -->
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
        <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-black">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex flex-col space-y-4 py-4">
          <router-link v-for="(item, index) in navItems" 
            :key="index" 
            :to="item.href"
            class="text-white hover:text-gray-300 transition py-2 px-4"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'F24 Ordinario', href: '/f24-ordinario' },
  { label: 'F24 Semplificato', href: '/f24-semplificato' },
  { label: 'F24 Accise', href: '/f24-accise' },
  { label: 'F24 Elide', href: '/f24-elide' },
  { label: 'F23', href: '/f23' },
  { label: 'Strumenti', href: '/strumenti' },
  { label: 'Tutorial', href: '/tutorial' },
  { label: 'News', href: '/news' },
];
</script>