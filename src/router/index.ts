import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/request'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

const whiteList = ['/login', '/404']

const DASHBOARD_PATH = '/dashboard'
let routesLoaded = false
let isRedirecting = false

export async function initRoutes() {
  const token = getToken()
  if (!token || routesLoaded) return
  
  try {
    const { usePermissionStore } = await import('@/stores/permission')
    const permissionStore = usePermissionStore()
    
    if (!permissionStore.isRoutesLoaded) {
      const routes = await permissionStore.loadRoutes()
      routes.forEach(route => {
        router.addRoute(route)
      })
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404'
      } as any)
      
      routesLoaded = true
    }
  } catch (error) {
    console.error('Failed to load routes:', error)
  }
}

router.beforeEach(async (to, from, next) => {
  const token = getToken()
  
  if (to.path === '/login' || to.path === '/404') {
    next()
    return
  }
  
  if (!token) {
    next('/login')
    return
  }
  
  if (to.path === '/') {
    next(DASHBOARD_PATH)
    return
  }
  
  if (!routesLoaded) {
    await initRoutes()
  }
  
  next()
})

export default router
