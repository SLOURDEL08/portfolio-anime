<script setup lang="ts">
import { useTransitionStore } from '@/stores/transition'

const transitionStore = useTransitionStore()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="transitionStore.currentTransition"
      mode="out-in"
      @before-leave="transitionStore.startTransition"
      @after-enter="transitionStore.endTransition"
    >
      <component 
        :is="Component"
        :key="route.path"
      />
    </transition>
  </router-view>
</template>

<style lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.expand-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>