import type { LoginParams, LoginResponse } from '@/types'
import { request } from '@/utils/request'
import { mockAuthApi } from '@/mock'

export const authApi = {
  login: (params: LoginParams) => request(() => mockAuthApi.login(params)),
  logout: () => request(() => mockAuthApi.logout()),
  getUserInfo: (token: string) => request(() => mockAuthApi.getUserInfo(token))
}
