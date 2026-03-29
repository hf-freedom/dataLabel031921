import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginParams } from '@/types'
import { authApi } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/request'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<{
    id: number
    username: string
    nickname: string
    roles: string[]
  } | null>(null)
  const permissions = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value)
  const hasPermission = (permission: string) => {
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(permission)
  }

  const login = async (params: LoginParams) => {
    const res = await authApi.login(params)
    token.value = res.token
    userInfo.value = res.userInfo
    permissions.value = res.permissions
    setToken(res.token)
    return res
  }

  const logout = async () => {
    await authApi.logout()
    token.value = null
    userInfo.value = null
    permissions.value = []
    removeToken()
    router.push('/login')
  }

  const initUser = async () => {
    const savedToken = getToken()
    if (savedToken) {
      token.value = savedToken
      try {
        const info = await authApi.getUserInfo(savedToken)
        userInfo.value = info
      } catch {
        logout()
      }
    }
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    hasPermission,
    login,
    logout,
    initUser
  }
})
