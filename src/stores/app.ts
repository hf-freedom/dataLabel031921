import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const device = ref<'desktop' | 'mobile'>('desktop')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setDevice = (val: 'desktop' | 'mobile') => {
    device.value = val
  }

  return {
    sidebarCollapsed,
    device,
    toggleSidebar,
    setDevice
  }
})
