export interface User {
  id: number
  username: string
  password?: string
  nickname: string
  email: string
  phone: string
  status: 0 | 1
  roles: string[]
  createTime: string
  updateTime: string
}

export interface UserQuery {
  page: number
  pageSize: number
  username?: string
  status?: number
  roleId?: number
}

export interface UserFormData {
  id?: number
  username: string
  password?: string
  nickname: string
  email: string
  phone: string
  status: 0 | 1
  roles: string[]
}
