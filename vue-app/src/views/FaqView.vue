<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-2 text-center">Domande Frequenti</h1>
    <p class="text-gray-600 mb-8 text-center">
      Risposte alle domande più comuni su F24Editabile
    </p>
    
    <div class="max-w-3xl mx-auto">
      <!-- Filtri -->
      <div class="bg-white rounded-lg p-4 shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="w-full flex-1">
            <label for="search-faq" class="form-label">Cerca nelle FAQ</label>
            <div class="relative">
              <input 
                id="search-faq" 
                type="text" 
                v-model="searchQuery"
                class="form-input w-full pl-10"
                placeholder="Cerca..."
              />
              <i class="material-icons absolute left-3 top-2 text-gray-400">search</i>
            </div>
          </div>
          
          <div class="w-full md:w-auto">
            <label for="faq-category" class="form-label">Categoria</label>
            <select 
              id="faq-category" 
              v-model="selectedCategory"
              class="form-input"
            >
              <option value="">Tutte le categorie</option>
              <option value="general">Generale</option>
              <option value="forms">Moduli</option>
              <option value="payment">Pagamenti</option>
              <option value="technical">Problemi tecnici</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Elenco FAQ -->
      <div>
        <div v-if="filteredFaqs.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
          <i class="material-icons text-6xl text-gray-300 mb-4">search_off</i>
          <p class="text-gray-600">Nessuna FAQ trovata con i filtri selezionati.</p>
          <button @click="clearFilters" class="mt-4 text-black hover:underline">
            Cancella i filtri
          </button>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <button 
              class="w-full px-6 py-4 text-left flex justify-between items-center"
              @click="toggleFaq(index)"
            >
              <h3 class="font-semibold text-lg">{{ faq.question }}</h3>
              <i class="material-icons transition-transform" :class="openFaq === index ? 'rotate-180' : ''">
                expand_more
              </i>
            </button>
            
            <div 
              v-show="openFaq === index" 
              class="px-6 py-4 border-t"
            >
              <p class="text-gray-700" v-html="faq.answer"></p>
              
              <div v-if="faq.links && faq.links.length > 0" class="mt-4 pt-2 border-t border-gray-100">
                <p class="text-sm font-medium">Link utili:</p>
                <ul class="mt-2 space-y-1">
                  <li v-for="(link, linkIndex) in faq.links" :key="linkIndex">
                    <a :href="link.url" class="text-blue-600 hover:underline text-sm">
                      {{ link.text }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contattaci -->
      <div class="mt-12 bg-gray-50 rounded-lg p-6 text-center">
        <h3 class="text-xl font-semibold mb-2">Non hai trovato la risposta che cercavi?</h3>
        <p class="text-gray-600 mb-4">Inviaci la tua domanda e ti risponderemo al più presto.</p>
        <a href="mailto:supporto@f24editabile.it" class="btn-primary inline-block">
          Contattaci
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Stato
const searchQuery = ref('');
const selectedCategory = ref('');
const openFaq = ref(null);

// Lista FAQ
const faqs = [
  {
    question: "Cosa è F24Editabile?",
    answer: "F24Editabile è una piattaforma web gratuita che permette di compilare, calcolare e scaricare moduli fiscali italiani come il F24 (in tutte le sue versioni) e il F23, senza necessità di registrazione o installazione di software.",
    category: "general"
  },
  {
    question: "I dati che inserisco sono al sicuro?",
    answer: "Sì, tutti i dati inseriti rimangono esclusivamente sul tuo dispositivo e non vengono mai inviati o memorizzati sui nostri server. La compilazione avviene interamente nel tuo browser.",
    category: "general"
  },
  {
    question: "Quali moduli posso compilare su F24Editabile?",
    answer: "Attualmente puoi compilare i seguenti moduli:<br>- F24 Ordinario<br>- F24 Semplificato<br>- F24 Accise<br>- F24 Elide (Elementi Identificativi)<br>- F23",
    category: "forms"
  },
  {
    question: "Come posso pagare un F24 compilato con F24Editabile?",
    answer: "Dopo aver compilato il modulo, puoi scaricarlo in formato PDF e poi procedere con il pagamento attraverso i canali consentiti:<br>- Home banking<br>- Sportelli bancari<br>- Uffici postali<br>- Agenzie di riscossione",
    category: "payment",
    links: [
      {
        text: "Pagamento F24 tramite Home Banking",
        url: "#"
      },
      {
        text: "Guida al pagamento F24",
        url: "#"
      }
    ]
  },
  {
    question: "Il PDF generato è valido per il pagamento?",
    answer: "Sì, il PDF generato da F24Editabile è conforme ai modelli ufficiali dell'Agenzia delle Entrate e può essere utilizzato per il pagamento attraverso i canali autorizzati.",
    category: "forms"
  },
  {
    question: "Posso salvare i moduli compilati?",
    answer: "Al momento F24Editabile non offre un sistema di salvataggio online dei moduli. Tuttavia, puoi scaricare il PDF generato e conservarlo sul tuo dispositivo per consultazioni future.",
    category: "forms"
  },
  {
    question: "F24Editabile è compatibile con dispositivi mobili?",
    answer: "Sì, F24Editabile è completamente responsive e può essere utilizzato su smartphone e tablet. L'interfaccia si adatta automaticamente alle dimensioni dello schermo per garantire una buona esperienza utente su qualsiasi dispositivo.",
    category: "technical"
  },
  {
    question: "Devo registrarmi per utilizzare F24Editabile?",
    answer: "No, F24Editabile è completamente gratuito e non richiede alcuna registrazione. Puoi accedere a tutte le funzionalità senza creare un account.",
    category: "general"
  },
  {
    question: "Come posso segnalare un errore o un problema?",
    answer: "Puoi segnalare errori o problemi inviando un'email a supporto@f24editabile.it, specificando il tipo di problema riscontrato e, se possibile, allegando screenshot.",
    category: "technical"
  }
];

// FAQ filtrate
const filteredFaqs = computed(() => {
  let result = [...faqs];
  
  // Filtra per categoria
  if (selectedCategory.value) {
    result = result.filter(faq => faq.category === selectedCategory.value);
  }
  
  // Filtra per ricerca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// Funzioni
function toggleFaq(index) {
  if (openFaq.value === index) {
    openFaq.value = null;
  } else {
    openFaq.value = index;
  }
}

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
}
</script>