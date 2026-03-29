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

router.beforeEach(async (to, from, next) => {
  const token = getToken()
  
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const { usePermissionStore } = await import('@/stores/permission')
      const permissionStore = usePermissionStore()
      
      // 只在路由未加载时加载动态路由，避免重复添加
      if (!permissionStore.isRoutesLoaded) {
        const routes = await permissionStore.loadRoutes()
        routes.forEach(route => {
          router.addRoute(route)
        })
        router.addRoute({
          path: '/:pathMatch(.*)*',
          redirect: '/404'
        } as any)
        permissionStore.isRoutesLoaded = true
        // 重新导航到目标路由
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
