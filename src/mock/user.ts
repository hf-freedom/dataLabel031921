import type { User, ApiResponse, PageResponse } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    nickname: '超级管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 1,
    roles: ['admin'],
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'zhangsan',
    password: '123456',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 1,
    roles: ['editor'],
    createTime: '2024-01-02 10:30:00',
    updateTime: '2024-01-02 10:30:00'
  },
  {
    id: 3,
    username: 'lisi',
    password: '123456',
    nickname: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 0,
    roles: ['viewer'],
    createTime: '2024-01-03 14:20:00',
    updateTime: '2024-01-03 14:20:00'
  },
  {
    id: 4,
    username: 'wangwu',
    password: '123456',
    nickname: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 1,
    roles: ['editor'],
    createTime: '2024-01-04 09:15:00',
    updateTime: '2024-01-04 09:15:00'
  },
  {
    id: 5,
    username: 'zhaoliu',
    password: '123456',
    nickname: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    status: 1,
    roles: ['viewer'],
    createTime: '2024-01-05 16:45:00',
    updateTime: '2024-01-05 16:45:00'
  }
]

let userIdCounter = 6

export const mockUserApi = {
  getList: (params: { page: number; pageSize: number; username?: string; status?: number }): Promise<ApiResponse<PageResponse<User>>> => {
    let filtered = [...mockUsers]
    
    if (params.username) {
      filtered = filtered.filter(u => u.username.includes(params.username!))
    }
    if (params.status !== undefined && params.status !== null) {
      filtered = filtered.filter(u => u.status === params.status)
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
  
  getById: (id: number): Promise<ApiResponse<User>> => {
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      return Promise.resolve({ code: 200, message: 'success', data: user })
    }
    return Promise.resolve({ code: 404, message: '用户不存在', data: null as any })
  },
  
  create: (data: Omit<User, 'id' | 'createTime' | 'updateTime'>): Promise<ApiResponse<User>> => {
    const newUser: User = {
      ...data,
      id: userIdCounter++,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    }
    mockUsers.push(newUser)
    return Promise.resolve({ code: 200, message: 'success', data: newUser })
  },
  
  update: (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const index = mockUsers.findIndex(u => u.id === id)
    if (index > -1) {
      mockUsers[index] = { ...mockUsers[index], ...data, updateTime: new Date().toLocaleString() }
      return Promise.resolve({ code: 200, message: 'success', data: mockUsers[index] })
    }
    return Promise.resolve({ code: 404, message: '用户不存在', data: null as any })
  },
  
  delete: (ids: number[]): Promise<ApiResponse<null>> => {
    ids.forEach(id => {
      const index = mockUsers.findIndex(u => u.id === id)
      if (index > -1) mockUsers.splice(index, 1)
    })
    return Promise.resolve({ code: 200, message: 'success', data: null })
  },
  
  updateStatus: (id: number, status: 0 | 1): Promise<ApiResponse<null>> => {
    const user = mockUsers.find(u => u.id === id)
    if (user) {
      user.status = status
      user.updateTime = new Date().toLocaleString()
    }
    return Promise.resolve({ code: 200, message: 'success', data: null })
  },
  
  checkUsername: (username: string, excludeId?: number): Promise<ApiResponse<boolean>> => {
    const exists = mockUsers.some(u => u.username === username && u.id !== excludeId)
    return Promise.resolve({ code: 200, message: 'success', data: !exists })
  }
}
