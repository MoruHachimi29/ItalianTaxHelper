import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Home | F24Editabile' }
    },
    {
      path: '/f24-ordinario',
      name: 'f24-ordinario',
      component: () => import('../views/F24OrdinaryView.vue'),
      meta: { title: 'F24 Ordinario | F24Editabile' }
    },
    {
      path: '/f24-semplificato',
      name: 'f24-semplificato',
      component: () => import('../views/F24SimplifiedView.vue'),
      meta: { title: 'F24 Semplificato | F24Editabile' }
    },
    {
      path: '/f24-accise',
      name: 'f24-accise',
      component: () => import('../views/F24ExciseView.vue'),
      meta: { title: 'F24 Accise | F24Editabile' }
    },
    {
      path: '/f24-elide',
      name: 'f24-elide',
      component: () => import('../views/F24ElideView.vue'),
      meta: { title: 'F24 Elide | F24Editabile' }
    },
    {
      path: '/f23',
      name: 'f23',
      component: () => import('../views/F23View.vue'),
      meta: { title: 'F23 | F24Editabile' }
    },
    {
      path: '/strumenti',
      name: 'strumenti',
      component: () => import('../views/ToolsView.vue'),
      meta: { title: 'Strumenti | F24Editabile' }
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('../views/TutorialsView.vue'),
      meta: { title: 'Tutorial | F24Editabile' }
    },
    {
      path: '/tutorial/:id',
      name: 'tutorial-detail',
      component: () => import('../views/TutorialDetailView.vue'),
      meta: { title: 'Tutorial | F24Editabile' }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
      meta: { title: 'News | F24Editabile' }
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue'),
      meta: { title: 'News | F24Editabile' }
    },
    {
      path: '/chi-siamo',
      name: 'chi-siamo',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Chi Siamo | F24Editabile' }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: { title: 'Privacy | F24Editabile' }
    },
    {
      path: '/termini',
      name: 'termini',
      component: () => import('../views/TermsView.vue'),
      meta: { title: 'Termini di Utilizzo | F24Editabile' }
    },
    {
      path: '/cookie',
      name: 'cookie',
      component: () => import('../views/CookieView.vue'),
      meta: { title: 'Cookie Policy | F24Editabile' }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { title: 'FAQ | F24Editabile' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Pagina Non Trovata | F24Editabile' }
    }
  ]
})

// Aggiorna il titolo della pagina in base alla rotta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'F24Editabile - Moduli Fiscali Italiani Compilabili Online'
  next()
})

export default router