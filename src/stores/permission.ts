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
    return routeItems.map(item => {
      const route: RouteRecordRaw = {
        path: item.path,
        name: item.name,
        meta: item.meta,
        redirect: item.redirect,
        children: item.children ? generateRoutes(item.children) : undefined
      } as any
      
      if (item.component) {
        if (typeof item.component === 'function') {
          route.component = item.component
        } else {
          route.component = () => import(`@/views/${item.component}.vue`)
        }
      }
      
      return route
    })
  }

  const loadRoutes = async () => {
    const userStore = useUserStore()
    
    const Layout = () => import('@/layout/index.vue')
    
    const mockRoutes = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Layout,
        children: [
          {
            path: '',
            component: 'dashboard/index',
            meta: { title: '仪表盘', icon: 'DataBoard' }
          }
        ]
      },
      {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'user',
            name: 'User',
            component: 'system/user/index',
            meta: { title: '用户管理', icon: 'User' }
          },
          {
            path: 'role',
            name: 'Role',
            component: 'system/role/index',
            meta: { title: '角色管理', icon: 'UserFilled' }
          },
          {
            path: 'permission',
            name: 'Permission',
            component: 'system/permission/index',
            meta: { title: '权限管理', icon: 'Lock' }
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
