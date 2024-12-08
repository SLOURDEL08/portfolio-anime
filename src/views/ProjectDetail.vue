<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const sliderRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const projects = ref([
  {
    id: 1,
    title: "Projet 1",
    description: "Description du projet 1",
    image: "/api/placeholder/800/600"
  },
  // Ajouter d'autres projets
])

const initGradientAnimation = () => {
  gsap.to('.gradient-bg', {
    backgroundPosition: '200% center',
    duration: 8,
    ease: 'none',
    repeat: -1
  })
}

const initSlider = () => {
  if (!sliderRef.value) return

  ScrollTrigger.create({
    trigger: sliderRef.value,
    pin: true,
    scrub: 1,
    snap: 1 / (projects.value.length - 1),
    end: () => `+=${sliderRef.value?.offsetHeight || 0}`,
    onUpdate: (self) => {
      const newIndex = Math.round(self.progress * (projects.value.length - 1))
      if (newIndex !== activeIndex.value) {
        activeIndex.value = newIndex
      }
    }
  })
}

const navigateToProject = (project: any) => {
  const element = document.querySelector('.active-project')
  
  gsap.to(element, {
    scale: 1.1,
    duration: 0.5,
    onComplete: () => {
      router.push(`/project/${project.id}`)
    }
  })
}

onMounted(() => {
  initSlider()
  initGradientAnimation()
})
</script>

<template>
  <div 
    ref="sliderRef" 
    class="relative h-screen w-full overflow-hidden"
  >
    <!-- Gradient animé pour le projet actif -->
    <div 
      v-if="activeIndex === 0"
      class="gradient-bg absolute inset-0 opacity-20 -z-10"
    />
    
    <!-- Projets -->
    <div
      v-for="(project, index) in projects"
      :key="project.id"
      :class="[
        'absolute inset-0 transition-transform duration-1000',
        { 'active-project': index === activeIndex }
      ]"
      :style="{
        transform: `translateY(${(index - activeIndex) * 100}%)`
      }"
    >
      <div class="h-full w-full p-8 flex items-center justify-center">
        <div 
          class="relative bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full transform transition-all duration-300 hover:scale-105 cursor-pointer"
          @click="index === activeIndex && navigateToProject(project)"
        >
          <img 
            :src="project.image" 
            :alt="project.title"
            class="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h2 class="text-3xl font-bold mb-4">{{ project.title }}</h2>
          <p class="text-gray-600">{{ project.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gradient-bg {
  background: linear-gradient(
    90deg,
    #4f46e5,
    #7c3aed,
    #db2777,
    #7c3aed,
    #4f46e5
  );
  background-size: 200% 100%;
}
</style>