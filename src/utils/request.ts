import type { ApiResponse } from '@/types'

const TOKEN_KEY = 'rbac_token'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const request = async <T>(mockFn: () => Promise<ApiResponse<T>>): Promise<T> => {
  const response = await mockFn()
  if (response.code !== 200) {
    throw new Error(response.message)
  }
  return response.data
}
