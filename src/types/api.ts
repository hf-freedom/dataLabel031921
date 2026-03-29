import type { Permission } from './permission'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar?: string
    roles: string[]
  }
  permissions: string[]
  routes: RouteItem[]
}

export interface RouteItem {
  path: string
  name: string
  component?: string
  redirect?: string
  meta?: RouteMeta
  children?: RouteItem[]
}

export interface RouteMeta {
  title: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  permissions?: string[]
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
