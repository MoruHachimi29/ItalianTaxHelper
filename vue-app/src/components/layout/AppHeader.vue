<template>
  <header class="sticky-header">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo e nome sito -->
        <router-link to="/" class="flex items-center text-white">
          <span class="text-xl font-bold">F24Editabile</span>
        </router-link>

        <!-- Menu di navigazione desktop -->
        <nav class="hidden md:flex space-x-6">
          <div class="relative group" v-for="(item, index) in navigationItems" :key="index">
            <template v-if="item.children">
              <button 
                class="text-white flex items-center space-x-1 hover:text-gray-300 transition"
                @click="toggleDropdown(item.text)"
              >
                <span>{{ item.text }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform" :class="openDropdown === item.text ? 'rotate-180' : ''">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div 
                v-show="openDropdown === item.text"
                class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
              >
                <router-link 
                  v-for="(child, childIndex) in item.children" 
                  :key="childIndex"
                  :to="child.path"
                  class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  @click="openDropdown = null"
                >
                  {{ child.text }}
                </router-link>
              </div>
            </template>
            
            <router-link 
              v-else 
              :to="item.path" 
              class="text-white hover:text-gray-300 transition"
            >
              {{ item.text }}
            </router-link>
          </div>
        </nav>

        <!-- Mobile menu button -->
        <button 
          class="md:hidden flex items-center text-white"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div 
      v-if="isMobileMenuOpen" 
      class="md:hidden fixed inset-0 pt-16 bg-white z-40"
    >
      <div class="px-4 py-2">
        <div v-for="(item, index) in navigationItems" :key="index" class="py-2">
          <template v-if="item.children">
            <button 
              class="flex items-center justify-between w-full text-left py-2 text-black font-medium"
              @click="toggleMobileSubmenu(item.text)"
            >
              {{ item.text }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform" :class="mobileSubmenu === item.text ? 'rotate-180' : ''">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <div v-show="mobileSubmenu === item.text" class="ml-4 border-l-2 border-gray-200 pl-4 mt-2">
              <router-link 
                v-for="(child, childIndex) in item.children" 
                :key="childIndex"
                :to="child.path"
                class="block py-2 text-gray-800"
                @click="closeMobileMenu"
              >
                {{ child.text }}
              </router-link>
            </div>
          </template>
          
          <router-link 
            v-else 
            :to="item.path" 
            class="block py-2 text-black font-medium"
            @click="closeMobileMenu"
          >
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Gestione dello stato del menu mobile
const isMobileMenuOpen = ref(false);
const openDropdown = ref(null);
const mobileSubmenu = ref(null);

// Definizione degli elementi di navigazione
const navigationItems = [
  {
    text: 'Home',
    path: '/'
  },
  {
    text: 'Moduli F24',
    children: [
      { text: 'F24 Ordinario', path: '/f24-ordinario' },
      { text: 'F24 Semplificato', path: '/f24-semplificato' },
      { text: 'F24 Accise', path: '/f24-accise' },
      { text: 'F24 Elide', path: '/f24-elide' }
    ]
  },
  {
    text: 'F23',
    path: '/f23'
  },
  {
    text: 'Strumenti',
    path: '/strumenti'
  },
  {
    text: 'Tutorial',
    path: '/tutorial'
  },
  {
    text: 'News',
    path: '/news'
  },
  {
    text: 'Chi Siamo',
    path: '/chi-siamo'
  }
];

// Metodi
function toggleDropdown(name) {
  if (openDropdown.value === name) {
    openDropdown.value = null;
  } else {
    openDropdown.value = name;
  }
}

function toggleMobileSubmenu(name) {
  if (mobileSubmenu.value === name) {
    mobileSubmenu.value = null;
  } else {
    mobileSubmenu.value = name;
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  mobileSubmenu.value = null;
}
</script>