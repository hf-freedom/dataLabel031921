import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores'

const checkPermission = (value: string | string[]): boolean => {
  const userStore = useUserStore()
  const permissions = userStore.permissions
  
  if (permissions.includes('*')) return true
  
  if (typeof value === 'string') {
    return permissions.includes(value)
  }
  
  return value.some(p => permissions.includes(p))
}

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const value = binding.value
    
    if (!value) return
    
    const hasPermission = checkPermission(value)
    
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}

export const setupPermissionDirective = (app: App) => {
  app.directive('permission', permission)
}

export default permission
