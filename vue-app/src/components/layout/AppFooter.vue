<template>
  <footer class="bg-gray-100 pt-12 pb-6">
    <div class="container mx-auto px-4">
      <!-- Footer principale -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Colonna 1: Informazioni sul sito -->
        <div>
          <h3 class="text-xl font-bold mb-4">F24Editabile</h3>
          <p class="text-gray-600 mb-4">
            Compila, calcola e scarica gratuitamente i moduli fiscali italiani in modo semplice e veloce.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-600 hover:text-black transition">
              <span class="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-600 hover:text-black transition">
              <span class="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-600 hover:text-black transition">
              <span class="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Colonna 2: Moduli -->
        <div>
          <h3 class="text-lg font-bold mb-4">Moduli</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/f24-ordinario" class="text-gray-600 hover:text-black transition">
                F24 Ordinario
              </router-link>
            </li>
            <li>
              <router-link to="/f24-semplificato" class="text-gray-600 hover:text-black transition">
                F24 Semplificato
              </router-link>
            </li>
            <li>
              <router-link to="/f24-accise" class="text-gray-600 hover:text-black transition">
                F24 Accise
              </router-link>
            </li>
            <li>
              <router-link to="/f24-elide" class="text-gray-600 hover:text-black transition">
                F24 Elide
              </router-link>
            </li>
            <li>
              <router-link to="/f23" class="text-gray-600 hover:text-black transition">
                F23
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Colonna 3: Links utili -->
        <div>
          <h3 class="text-lg font-bold mb-4">Links utili</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/strumenti" class="text-gray-600 hover:text-black transition">
                Strumenti fiscali
              </router-link>
            </li>
            <li>
              <router-link to="/tutorial" class="text-gray-600 hover:text-black transition">
                Tutorial
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="text-gray-600 hover:text-black transition">
                News
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="text-gray-600 hover:text-black transition">
                FAQ
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Colonna 4: Info legali -->
        <div>
          <h3 class="text-lg font-bold mb-4">Informazioni</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/chi-siamo" class="text-gray-600 hover:text-black transition">
                Chi siamo
              </router-link>
            </li>
            <li>
              <router-link to="/privacy" class="text-gray-600 hover:text-black transition">
                Privacy Policy
              </router-link>
            </li>
            <li>
              <router-link to="/termini" class="text-gray-600 hover:text-black transition">
                Termini di Utilizzo
              </router-link>
            </li>
            <li>
              <router-link to="/cookie" class="text-gray-600 hover:text-black transition">
                Cookie Policy
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Disclaimer e copyright -->
      <div class="border-t border-gray-300 pt-6">
        <div class="flex flex-col md:flex-row justify-between">
          <p class="text-sm text-gray-600 mb-2 md:mb-0">
            © {{ currentYear }} F24Editabile. Tutti i diritti riservati.
          </p>
          <p class="text-sm text-gray-600">
            Il servizio è fornito a solo scopo informativo. Non ci assumiamo responsabilità per eventuali errori.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>