import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useTransitionStore } from '@/stores/transition'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { 
      transition: 'slide',
      title: 'Accueil'
    }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: { 
      transition: 'expand',
      title: 'Projet'
    },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const transitionStore = useTransitionStore()
  
  // Démarrer la transition
  if (to.meta.transition) {
    transitionStore.startTransition(to.meta.transition as string)
  }
  
  // Mettre à jour le titre de la page
  document.title = `${to.meta.title || 'Portfolio'}`
  
  next()
})

export default router