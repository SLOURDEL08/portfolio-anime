<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

gsap.registerPlugin()

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
}

const projects = ref<Project[]>([
  {
    id: 1,
    title: "Application Mobile Crypto",
    description: "Application mobile moderne pour le suivi des cryptomonnaies avec des graphiques en temps réel et des alertes personnalisées.",
    image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg",
    category: "Mobile App"
  },
  {
    id: 2,
    title: "Application Web Dashboard",
    description: "Dashboard interactif pour visualiser des données en temps réel avec des graphiques clairs.",
    image: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg",
    category: "Web App"
  },
  {
    id: 3,
    title: "E-commerce Moderne",
    description: "Site d'e-commerce optimisé pour une navigation rapide et des fonctionnalités avancées.",
    image: "https://images.pexels.com/photos/3965474/pexels-photo-3965474.jpeg",
    category: "E-commerce"
  },
  {
    id: 4,
    title: "Portfolio Créatif",
    description: "Portfolio interactif pour les designers et créateurs de contenu.",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    category: "Portfolio"
  }
])

const activeIndex = ref(0)
const sliderRef = ref<HTMLElement | null>(null)
let isAnimating = false
let wheelTimeout: number | null = null

const POSITIONS = {
  ACTIVE: {
    y: '0',
    scale: 1,
    opacity: 1,
    rotateX: '0deg',
    width: '800px',
    filter: 'blur(0px)',
    zIndex: 50
  },
  HIDDEN_BOTTOM: {
    y: '150vh',
    scale: 0.8,
    opacity: 0,
    rotateX: '0deg',
    width: '600px',
    filter: 'blur(10px)',
    zIndex: 1
  }
}

const getStackPosition = (distance: number, total: number) => {
  const position = (distance % total + total) % total
  return {
    y: `${position * -60}px`,
    scale: 1 - position * 0.03,
    opacity: 1 - position * 0.12,
    rotateX: `${position * -8}deg`,
    width: `${800 - position * 100}px`,
    filter: `blur(${position * 0.8}px)`,
    zIndex: 40 - position
  }
}

const moveCard = (direction: 'up' | 'down') => {
  if (isAnimating) return
  isAnimating = true

  const totalCards = projects.value.length
  const newIndex = direction === 'down'
    ? (activeIndex.value + 1) % totalCards
    : (activeIndex.value - 1 + totalCards) % totalCards

  const timeline = gsap.timeline({
    onComplete: () => {
      activeIndex.value = newIndex
      isAnimating = false
    }
  })

  projects.value.forEach((_, index) => {
    const card = document.querySelector(`.project-${index}`) as HTMLElement
    if (!card) return

    const distanceFromNewActive = (index - newIndex + totalCards) % totalCards
    const position = getStackPosition(distanceFromNewActive, totalCards)

    if (distanceFromNewActive === totalCards - 1 && direction === 'down') {
      gsap.set(card, { zIndex: 1, y: '150vh' })
    }

    timeline.to(card, {
      ...position,
      duration: 0.6,
      ease: 'power2.out'
    }, 0)
  })
}

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  if (wheelTimeout !== null) {
    window.clearTimeout(wheelTimeout)
  }
  
  wheelTimeout = window.setTimeout(() => {
    const direction = event.deltaY > 0 ? 'down' : 'up'
    moveCard(direction)
    wheelTimeout = null
  }, 50) // Petit délai pour regrouper les événements de scroll
}

const initSlider = () => {
  const totalCards = projects.value.length
  projects.value.forEach((_, index) => {
    const card = document.querySelector(`.project-${index}`) as HTMLElement
    if (!card) return

    const distanceFromActive = (index - activeIndex.value + totalCards) % totalCards
    const position = getStackPosition(distanceFromActive, totalCards)
    gsap.set(card, position)
  })

  sliderRef.value?.addEventListener('wheel', handleWheel, { passive: false })
}

onMounted(() => {
  initSlider()
})

onUnmounted(() => {
  if (wheelTimeout !== null) {
    window.clearTimeout(wheelTimeout)
  }
  sliderRef.value?.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <div 
    ref="sliderRef"
    class="slider-container h-screen w-full relative flex items-end justify-center pb-32"
  >
    <div 
      v-for="(project, index) in projects"
      :key="project.id"
      :class="`project-card project-${index} absolute bottom-0`"
      @click="index === activeIndex && $router.push(`/project/${project.id}`)"
    >
      <div class="project-content bg-white rounded-xl overflow-hidden h-[400px]">
        <img 
          :src="project.image" 
          :alt="project.title"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<style>
.slider-container {
  perspective: 2000px;
  transform-style: preserve-3d;
  overflow: hidden;
}

.project-card {
  transform-style: preserve-3d;
  will-change: transform, opacity, filter, width;
  pointer-events: none;
  backface-visibility: hidden;
  transform-origin: bottom center;
}

.project-content {
  width: 100%;
}
</style>