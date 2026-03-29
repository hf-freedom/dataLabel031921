import type { LoginParams, LoginResponse, ApiResponse, RouteItem } from '@/types'
import { mockUsers } from './user'
import { mockRoles } from './role'

const adminRoutes: RouteItem[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'dashboard/index',
    meta: { title: '仪表盘', icon: 'DataBoard' }
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: 'system/user/index',
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: 'system/role/index',
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: '/system/permission',
        name: 'Permission',
        component: 'system/permission/index',
        meta: { title: '权限管理', icon: 'Lock' }
      }
    ]
  }
]

export const mockAuthApi = {
  login: (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    const user = mockUsers.find(u => u.username === params.username && u.password === params.password)
    
    if (!user) {
      return Promise.resolve({ code: 401, message: '用户名或密码错误', data: null as any })
    }
    
    if (user.status === 0) {
      return Promise.resolve({ code: 403, message: '账号已被禁用', data: null as any })
    }
    
    const userRoles = mockRoles.filter(r => user.roles.includes(r.code))
    const permissions = userRoles.flatMap(r => r.permissions)
    
    const response: LoginResponse = {
      token: `mock-token-${user.id}-${Date.now()}`,
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        roles: user.roles
      },
      permissions: permissions.includes('*') ? ['*'] : permissions,
      routes: adminRoutes
    }
    
    return Promise.resolve({ code: 200, message: 'success', data: response })
  },
  
  logout: (): Promise<ApiResponse<null>> => {
    return Promise.resolve({ code: 200, message: 'success', data: null })
  },
  
  getUserInfo: (token: string): Promise<ApiResponse<LoginResponse['userInfo']>> => {
    const userId = parseInt(token.split('-')[2])
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return Promise.resolve({ code: 401, message: '无效的token', data: null as any })
    }
    
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        roles: user.roles
      }
    })
  }
}
