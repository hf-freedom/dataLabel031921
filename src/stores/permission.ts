import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { permissionApi } from '@/api'
import { useUserStore } from './user'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const permissionTree = ref<any[]>([])
  const isRoutesLoaded = ref(false)

  const menuRoutes = computed(() => routes.value)

  const generateRoutes = (routeItems: any[]): RouteRecordRaw[] => {
    const modules = import.meta.glob('../views/**/*.vue')
    
    return routeItems.map(item => {
      const route: any = {
        path: item.path,
        name: item.name,
        meta: item.meta,
        redirect: item.redirect
      }
      
      if (item.component) {
        if (typeof item.component === 'function') {
          route.component = item.component
        } else {
          const componentPath = `../views/${item.component}.vue`
          route.component = modules[componentPath]
        }
      }
      
      if (item.children && item.children.length > 0) {
        route.children = generateRoutes(item.children)
      }
      
      return route
    })
  }

  const loadRoutes = async () => {
    const userStore = useUserStore()
    
    const Layout = () => import('@/layout/index.vue')
    
    const mockRoutes = [
      {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            component: 'dashboard/index',
            meta: { title: '仪表盘', icon: 'DataBoard' }
          },
          {
            path: '/system',
            name: 'System',
            redirect: '/system/user',
            meta: { title: '系统管理', icon: 'Setting' },
            children: [
              {
                path: '/system/user',
                name: 'User',
                component: 'system/user/index',
                meta: { title: '用户管理', icon: 'User' }
              },
              {
                path: '/system/role',
                name: 'Role',
                component: 'system/role/index',
                meta: { title: '角色管理', icon: 'UserFilled' }
              },
              {
                path: '/system/permission',
                name: 'Permission',
                component: 'system/permission/index',
                meta: { title: '权限管理', icon: 'Lock' }
              }
            ]
          }
        ]
      }
    ]
    
    routes.value = generateRoutes(mockRoutes)
    isRoutesLoaded.value = true
    
    return routes.value
  }

  const loadPermissionTree = async () => {
    const tree = await permissionApi.getTree()
    permissionTree.value = tree
    return tree
  }

  const resetRoutes = () => {
    routes.value = []
    isRoutesLoaded.value = false
  }

  return {
    routes,
    permissionTree,
    isRoutesLoaded,
    menuRoutes,
    loadRoutes,
    loadPermissionTree,
    resetRoutes
  }
})
