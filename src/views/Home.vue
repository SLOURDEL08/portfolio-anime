<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectSlider from '@/components/ProjectSlider.vue'
import { useTransitionStore } from '@/stores/transition'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const transitionStore = useTransitionStore()
const homeRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Réinitialiser le scroll
  window.scrollTo(0, 0)
  
  if (homeRef.value && scrollContainerRef.value) {
    // Créer une zone scrollable suffisamment grande
    const totalProjects = 5 // Nombre de projets dans votre slider
    const scrollHeight = window.innerHeight * totalProjects
    gsap.set(scrollContainerRef.value, { height: scrollHeight })

    // Configuration du ScrollTrigger
    ScrollTrigger.create({
      trigger: homeRef.value,
      start: 'top top',
      end: `+=${scrollHeight}`,
      pin: true,
      pinSpacing: false,
      scrub: 1,
      markers: true, // Utile pour le débug, à retirer en production
    })
  }
})
</script>

<template>
  <div ref="homeRef" class="home-wrapper">
    <!-- Contenu fixe -->
    <main class="fixed-content">
      <ProjectSlider />
    </main>
    
  </div>
</template>

<style>
.home-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.fixed-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
}

.scroll-container {
  position: relative;
  width: 100%;
  /* La hauteur sera définie dynamiquement par JavaScript */
  pointer-events: none;
  opacity: 0;
}
</style>