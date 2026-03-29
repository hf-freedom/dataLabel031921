import type { Role, ApiResponse, PageResponse } from '@/types'

export const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    permissions: ['*'],
    status: 1,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    name: '编辑员',
    code: 'editor',
    description: '拥有编辑权限',
    permissions: ['dashboard:view', 'user:view', 'user:create', 'user:update', 'role:view'],
    status: 1,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    id: 3,
    name: '访客',
    code: 'viewer',
    description: '只读权限',
    permissions: ['dashboard:view', 'user:view', 'role:view'],
    status: 1,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  }
]

let roleIdCounter = 4

export const mockRoleApi = {
  getList: (params: { page: number; pageSize: number; name?: string; status?: number }): Promise<ApiResponse<PageResponse<Role>>> => {
    let filtered = [...mockRoles]
    
    if (params.name) {
      filtered = filtered.filter(r => r.name.includes(params.name!))
    }
    if (params.status !== undefined && params.status !== null) {
      filtered = filtered.filter(r => r.status === params.status)
    }
    
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    const list = filtered.slice(start, start + params.pageSize)
    
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: { list, total, page: params.page, pageSize: params.pageSize }
    })
  },
  
  getAll: (): Promise<ApiResponse<Role[]>> => {
    return Promise.resolve({ code: 200, message: 'success', data: mockRoles.filter(r => r.status === 1) })
  },
  
  getById: (id: number): Promise<ApiResponse<Role>> => {
    const role = mockRoles.find(r => r.id === id)
    if (role) {
      return Promise.resolve({ code: 200, message: 'success', data: role })
    }
    return Promise.resolve({ code: 404, message: '角色不存在', data: null as any })
  },
  
  create: (data: Omit<Role, 'id' | 'createTime' | 'updateTime'>): Promise<ApiResponse<Role>> => {
    const newRole: Role = {
      ...data,
      id: roleIdCounter++,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    }
    mockRoles.push(newRole)
    return Promise.resolve({ code: 200, message: 'success', data: newRole })
  },
  
  update: (id: number, data: Partial<Role>): Promise<ApiResponse<Role>> => {
    const index = mockRoles.findIndex(r => r.id === id)
    if (index > -1) {
      mockRoles[index] = { ...mockRoles[index], ...data, updateTime: new Date().toLocaleString() }
      return Promise.resolve({ code: 200, message: 'success', data: mockRoles[index] })
    }
    return Promise.resolve({ code: 404, message: '角色不存在', data: null as any })
  },
  
  delete: (ids: number[]): Promise<ApiResponse<null>> => {
    ids.forEach(id => {
      const index = mockRoles.findIndex(r => r.id === id)
      if (index > -1) mockRoles.splice(index, 1)
    })
    return Promise.resolve({ code: 200, message: 'success', data: null })
  },
  
  updatePermissions: (id: number, permissions: string[]): Promise<ApiResponse<null>> => {
    const role = mockRoles.find(r => r.id === id)
    if (role) {
      role.permissions = permissions
      role.updateTime = new Date().toLocaleString()
    }
    return Promise.resolve({ code: 200, message: 'success', data: null })
  }
}
