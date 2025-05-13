<template>
  <footer class="bg-black text-white py-8 mt-10">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Links columns -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Moduli</h3>
          <ul class="space-y-2">
            <li><router-link to="/f24-ordinario" class="hover:underline">F24 Ordinario</router-link></li>
            <li><router-link to="/f24-semplificato" class="hover:underline">F24 Semplificato</router-link></li>
            <li><router-link to="/f24-accise" class="hover:underline">F24 Accise</router-link></li>
            <li><router-link to="/f24-elide" class="hover:underline">F24 Elide</router-link></li>
            <li><router-link to="/f23" class="hover:underline">F23</router-link></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Risorse</h3>
          <ul class="space-y-2">
            <li><router-link to="/strumenti" class="hover:underline">Strumenti</router-link></li>
            <li><router-link to="/tutorial" class="hover:underline">Tutorial</router-link></li>
            <li><router-link to="/news" class="hover:underline">News</router-link></li>
            <li><router-link to="/faq" class="hover:underline">FAQ</router-link></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Info</h3>
          <ul class="space-y-2">
            <li><router-link to="/chi-siamo" class="hover:underline">Chi siamo</router-link></li>
            <li><router-link to="/privacy" class="hover:underline">Privacy</router-link></li>
            <li><router-link to="/termini" class="hover:underline">Termini di utilizzo</router-link></li>
            <li><router-link to="/cookie" class="hover:underline">Cookie Policy</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-700 text-center">
        <p class="text-sm text-gray-400">
          F24Editabile.it non è affiliato all'Agenzia delle Entrate o ad alcun ente governativo. 
          Tutti i moduli sono generati in conformità ai modelli ufficiali.
        </p>
        <p class="mt-2 text-sm">
          &copy; {{ currentYear }} F24Editabile - Tutti i diritti riservati
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>