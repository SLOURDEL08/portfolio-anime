import { defineStore } from 'pinia'

interface TransitionState {
  isTransitioning: boolean
  currentTransition: string
  currentProject: number | null
}

export const useTransitionStore = defineStore('transition', {
  state: (): TransitionState => ({
    isTransitioning: false,
    currentTransition: 'slide',
    currentProject: null
  }),
  
  actions: {
    startTransition(transition: string = 'slide') {
      this.isTransitioning = true
      this.currentTransition = transition
    },
    
    endTransition() {
      this.isTransitioning = false
    },
    
    setCurrentProject(id: number) {
      this.currentProject = id
    }
  }
})