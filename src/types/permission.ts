export interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button'
  parentId: number | null
  path?: string
  component?: string
  icon?: string
  sort: number
  children?: Permission[]
}

export interface PermissionTree extends Permission {
  children?: PermissionTree[]
}
