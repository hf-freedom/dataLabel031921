export interface Role {
  id: number
  name: string
  code: string
  description: string
  permissions: string[]
  status: 0 | 1
  createTime: string
  updateTime: string
}

export interface RoleQuery {
  page: number
  pageSize: number
  name?: string
  status?: number
}

export interface RoleFormData {
  id?: number
  name: string
  code: string
  description: string
  status: 0 | 1
  permissions: string[]
}
