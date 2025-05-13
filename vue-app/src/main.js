import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importa i fogli di stile
import './assets/main.css'

// Crea l'app Vue
const app = createApp(App)

// Aggiungi i plugin
app.use(createPinia())
app.use(router)

// Monta l'app sul DOM
app.mount('#app')